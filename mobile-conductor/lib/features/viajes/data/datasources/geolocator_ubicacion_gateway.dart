import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/coordenada_conductor.dart';
import '../../domain/repositories/ubicacion_gateway.dart';

class GeolocatorUbicacionGateway implements UbicacionGateway {
  @override
  Future<Resultado<CoordenadaConductor>> obtenerUbicacionActual() async {
    try {
      final ok = await _asegurarPermisos();
      if (ok != null) {
        return Fallo(ValidationFailure(ok));
      }

      final ultima = await Geolocator.getLastKnownPosition();
      final actual = await _leerPosicionActual();
      if (actual != null) {
        return Exito(_desdePosicion(actual));
      }
      if (ultima != null) {
        debugPrint(
          '[MyRide] GPS: usando ultima conocida '
          '(${ultima.latitude}, ${ultima.longitude})',
        );
        return Exito(_desdePosicion(ultima));
      }

      return const Fallo(Failure(AppStrings.errorGpsObtener));
    } catch (error, stack) {
      debugPrint('[MyRide] GPS error: $error\n$stack');
      return const Fallo(Failure(AppStrings.errorGpsObtener));
    }
  }

  @override
  Stream<CoordenadaConductor> observarUbicacion() async* {
    final ok = await _asegurarPermisos();
    if (ok != null) {
      return;
    }

    yield* Geolocator.getPositionStream(
      locationSettings: _ajustesStream(),
    ).map(_desdePosicion);
  }

  Future<Position?> _leerPosicionActual() async {
    for (final settings in _ajustesLectura()) {
      try {
        return await Geolocator.getCurrentPosition(
          locationSettings: settings,
        );
      } catch (error) {
        debugPrint('[MyRide] GPS getCurrentPosition falló: $error');
      }
    }
    return null;
  }

  List<LocationSettings> _ajustesLectura() {
    if (Platform.isAndroid) {
      return [
        AndroidSettings(
          accuracy: LocationAccuracy.low,
          forceLocationManager: true,
          timeLimit: const Duration(seconds: 12),
        ),
        AndroidSettings(
          accuracy: LocationAccuracy.medium,
          forceLocationManager: true,
          timeLimit: const Duration(seconds: 12),
        ),
      ];
    }
    return const [
      LocationSettings(
        accuracy: LocationAccuracy.low,
        timeLimit: Duration(seconds: 12),
      ),
      LocationSettings(
        accuracy: LocationAccuracy.medium,
        timeLimit: Duration(seconds: 12),
      ),
    ];
  }

  LocationSettings _ajustesStream() {
    if (Platform.isAndroid) {
      return AndroidSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 8,
        forceLocationManager: true,
      );
    }
    return const LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 8,
    );
  }

  CoordenadaConductor _desdePosicion(Position posicion) {
    return CoordenadaConductor(
      latitud: posicion.latitude,
      longitud: posicion.longitude,
    );
  }

  Future<String?> _asegurarPermisos() async {
    final servicioHabilitado = await Geolocator.isLocationServiceEnabled();
    if (!servicioHabilitado) {
      return AppStrings.errorGpsDesactivado;
    }

    var permiso = await Geolocator.checkPermission();
    if (permiso == LocationPermission.denied) {
      permiso = await Geolocator.requestPermission();
    }

    if (permiso == LocationPermission.denied ||
        permiso == LocationPermission.deniedForever) {
      return AppStrings.errorGpsPermiso;
    }

    return null;
  }
}

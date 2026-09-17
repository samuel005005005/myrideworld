import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/coordenada_conductor.dart';
import '../../domain/repositories/ubicacion_gateway.dart';

class GeolocatorUbicacionGateway implements UbicacionGateway {
  static const Duration _maxEdadUltimaConocida = Duration(minutes: 15);

  @override
  Future<Resultado<CoordenadaConductor>> obtenerUbicacionActual() async {
    try {
      final ok = await _asegurarPermisos(pedirBackground: false);
      if (ok != null) {
        return Fallo(ValidationFailure(ok));
      }

      final ultima = await Geolocator.getLastKnownPosition();
      if (_esUltimaUtil(ultima)) {
        debugPrint(
          '[MyRide] GPS: ultima conocida reciente '
          '(${ultima!.latitude}, ${ultima.longitude})',
        );
        return Exito(_desdePosicion(ultima));
      }

      final actual = await _leerPosicionActual();
      if (actual != null) {
        return Exito(_desdePosicion(actual));
      }
      if (ultima != null) {
        debugPrint(
          '[MyRide] GPS: fallback ultima conocida '
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
    // Flota / viaje activo: pide "siempre" + foreground service en Android.
    final ok = await _asegurarPermisos(pedirBackground: true);
    if (ok != null) {
      debugPrint('[MyRide] GPS stream bloqueado: $ok');
      return;
    }

    yield* Geolocator.getPositionStream(
      locationSettings: _ajustesStreamBackground(),
    ).map(_desdePosicion);
  }

  bool _esUltimaUtil(Position? posicion) {
    if (posicion == null) {
      return false;
    }
    final edad = DateTime.now().difference(posicion.timestamp);
    return !edad.isNegative && edad <= _maxEdadUltimaConocida;
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
          accuracy: LocationAccuracy.high,
          timeLimit: const Duration(seconds: 15),
        ),
        AndroidSettings(
          accuracy: LocationAccuracy.high,
          forceLocationManager: true,
          timeLimit: const Duration(seconds: 15),
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
        accuracy: LocationAccuracy.high,
        timeLimit: Duration(seconds: 15),
      ),
      LocationSettings(
        accuracy: LocationAccuracy.medium,
        timeLimit: Duration(seconds: 12),
      ),
    ];
  }

  /// Stream con foreground service (Android) / background updates (iOS).
  LocationSettings _ajustesStreamBackground() {
    if (Platform.isAndroid) {
      return AndroidSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 8,
        intervalDuration: const Duration(seconds: 5),
        foregroundNotificationConfig: const ForegroundNotificationConfig(
          notificationTitle: AppStrings.gpsBackgroundNotificationTitle,
          notificationText: AppStrings.gpsBackgroundNotificationText,
          notificationChannelName: 'Ubicacion MyRide',
          notificationIcon: AndroidResource(
            name: 'ic_launcher',
            defType: 'mipmap',
          ),
          enableWakeLock: true,
          enableWifiLock: true,
          setOngoing: true,
        ),
      );
    }
    return AppleSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 8,
      activityType: ActivityType.automotiveNavigation,
      pauseLocationUpdatesAutomatically: false,
      showBackgroundLocationIndicator: true,
      allowBackgroundLocationUpdates: true,
    );
  }

  CoordenadaConductor _desdePosicion(Position posicion) {
    return CoordenadaConductor(
      latitud: posicion.latitude,
      longitud: posicion.longitude,
    );
  }

  Future<String?> _asegurarPermisos({required bool pedirBackground}) async {
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

    if (pedirBackground && permiso == LocationPermission.whileInUse) {
      // Segunda petición: "Permitir siempre" (Android 10+ / iOS).
      permiso = await Geolocator.requestPermission();
      if (permiso != LocationPermission.always) {
        debugPrint(
          '[MyRide] GPS: sin Always; se usa foreground service (Android) '
          'igual. Ideal: ${AppStrings.errorGpsPermisoBackground}',
        );
      }
    }

    return null;
  }
}

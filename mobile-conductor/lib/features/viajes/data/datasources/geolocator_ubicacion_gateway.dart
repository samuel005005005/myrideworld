import 'package:geolocator/geolocator.dart';

import '../../../../core/config/app_env.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/coordenada_conductor.dart';
import '../../domain/repositories/ubicacion_gateway.dart';

class GeolocatorUbicacionGateway implements UbicacionGateway {
  @override
  Future<Resultado<CoordenadaConductor>> obtenerUbicacionActual() async {
    final override = _coordenadaOverride();
    if (override != null) {
      return Exito(override);
    }

    try {
      final ok = await _asegurarPermisos();
      if (ok != null) {
        return Fallo(ValidationFailure(ok));
      }

      try {
        // Última conocida primero (rápido en emulador / indoor).
        final ultima = await Geolocator.getLastKnownPosition();

        try {
          final posicion = await Geolocator.getCurrentPosition(
            locationSettings: const LocationSettings(
              accuracy: LocationAccuracy.medium,
              timeLimit: Duration(seconds: 6),
            ),
          );
          return Exito(_desdePosicion(posicion));
        } catch (_) {
          if (ultima != null) {
            return Exito(_desdePosicion(ultima));
          }
          return const Fallo(Failure(AppStrings.errorGpsObtener));
        }
      } catch (_) {
        return const Fallo(Failure(AppStrings.errorGpsObtener));
      }
    } catch (_) {
      return const Fallo(Failure(AppStrings.errorGpsObtener));
    }
  }

  @override
  Stream<CoordenadaConductor> observarUbicacion() async* {
    final override = _coordenadaOverride();
    if (override != null) {
      yield override;
      final ok = await _asegurarPermisos();
      if (ok != null) {
        return;
      }
      yield* Geolocator.getPositionStream(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          distanceFilter: 8,
        ),
      ).map((_) => override);
      return;
    }

    final ok = await _asegurarPermisos();
    if (ok != null) {
      return;
    }

    yield* Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 8,
      ),
    ).map(_desdePosicion);
  }

  CoordenadaConductor _desdePosicion(Position posicion) {
    return CoordenadaConductor(
      latitud: posicion.latitude,
      longitud: posicion.longitude,
    );
  }

  CoordenadaConductor? _coordenadaOverride() {
    final override = AppEnv.gpsOverrideDebug;
    if (override == null) {
      return null;
    }
    return CoordenadaConductor(
      latitud: override.latitud,
      longitud: override.longitud,
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

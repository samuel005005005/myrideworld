import 'package:geolocator/geolocator.dart';

import '../../../../core/config/app_env.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/coordenada.dart';
import '../../domain/repositories/ubicacion_gateway.dart';

class GeolocatorUbicacionGateway implements UbicacionGateway {
  @override
  Future<Resultado<Coordenada>> obtenerUbicacionActual() async {
    final override = _coordenadaOverride();
    if (override != null) {
      return Exito(override);
    }

    try {
      final servicioHabilitado = await Geolocator.isLocationServiceEnabled();
      if (!servicioHabilitado) {
        return const Fallo(ValidationFailure(AppStrings.errorGpsDesactivado));
      }

      var permiso = await Geolocator.checkPermission();
      if (permiso == LocationPermission.denied) {
        permiso = await Geolocator.requestPermission();
      }

      if (permiso == LocationPermission.denied ||
          permiso == LocationPermission.deniedForever) {
        return const Fallo(ValidationFailure(AppStrings.errorGpsPermiso));
      }

      try {
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
          return const Fallo(ServerFailure(AppStrings.errorGpsObtener));
        }
      } catch (_) {
        return const Fallo(ServerFailure(AppStrings.errorGpsObtener));
      }
    } catch (_) {
      return const Fallo(ServerFailure(AppStrings.errorGpsObtener));
    }
  }

  Coordenada _desdePosicion(Position posicion) {
    return Coordenada(
      latitud: posicion.latitude,
      longitud: posicion.longitude,
    );
  }

  Coordenada? _coordenadaOverride() {
    final override = AppEnv.gpsOverrideDebug;
    if (override == null) {
      return null;
    }
    return Coordenada(
      latitud: override.latitud,
      longitud: override.longitud,
    );
  }
}

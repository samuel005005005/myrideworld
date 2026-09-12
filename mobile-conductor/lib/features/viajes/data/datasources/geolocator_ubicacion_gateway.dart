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

      final posicion = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
        ),
      );

      return Exito(
        CoordenadaConductor(
          latitud: posicion.latitude,
          longitud: posicion.longitude,
        ),
      );
    } catch (_) {
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
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 8,
      ),
    ).map(
      (posicion) => CoordenadaConductor(
        latitud: posicion.latitude,
        longitud: posicion.longitude,
      ),
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

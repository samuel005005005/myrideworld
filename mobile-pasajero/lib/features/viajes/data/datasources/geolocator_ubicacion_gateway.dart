import 'package:geolocator/geolocator.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/tipos/resultado.dart';
import '../../domain/entities/coordenada.dart';
import '../../domain/repositories/ubicacion_gateway.dart';

class GeolocatorUbicacionGateway implements UbicacionGateway {
  @override
  Future<Resultado<Coordenada>> obtenerUbicacionActual() async {
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

      final posicion = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
        ),
      );

      return Exito(
        Coordenada(
          latitud: posicion.latitude,
          longitud: posicion.longitude,
        ),
      );
    } catch (_) {
      return const Fallo(ServerFailure(AppStrings.errorGpsObtener));
    }
  }
}

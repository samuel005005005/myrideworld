import '../../../../core/tipos/resultado.dart';

abstract class GeocodingRepository {
  Future<Resultado<String>> obtenerDireccion({
    required double latitud,
    required double longitud,
  });
}

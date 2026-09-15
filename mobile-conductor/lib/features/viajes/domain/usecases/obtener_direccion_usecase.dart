import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/geocoding_repository.dart';
import 'obtener_direccion_params.dart';

class ObtenerDireccionUseCase
    implements UseCase<String, ObtenerDireccionParams> {
  ObtenerDireccionUseCase(this._repository);

  final GeocodingRepository _repository;

  @override
  Future<Resultado<String>> call(ObtenerDireccionParams params) {
    return _repository.obtenerDireccion(
      latitud: params.latitud,
      longitud: params.longitud,
    );
  }
}

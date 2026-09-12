import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/estimacion_tarifa.dart';
import '../repositories/tarifa_repository.dart';
import 'estimar_tarifa_params.dart';

class EstimarTarifaUseCase
    implements UseCase<EstimacionTarifa, EstimarTarifaParams> {
  final TarifaRepository repository;

  EstimarTarifaUseCase(this.repository);

  @override
  Future<Resultado<EstimacionTarifa>> call(EstimarTarifaParams params) {
    return repository.estimar(
      origenLat: params.origenLat,
      origenLng: params.origenLng,
      destinoLat: params.destinoLat,
      destinoLng: params.destinoLng,
    );
  }
}

import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/contacto_soporte.dart';
import '../repositories/soporte_repository.dart';

class ObtenerContactoSoporteUseCase
    implements UseCase<ContactoSoporte, NoParams> {
  final SoporteRepository repository;

  ObtenerContactoSoporteUseCase(this.repository);

  @override
  Future<Resultado<ContactoSoporte>> call(NoParams params) {
    return repository.obtenerContacto();
  }
}

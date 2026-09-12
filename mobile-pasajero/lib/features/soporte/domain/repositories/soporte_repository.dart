import '../../../../core/tipos/resultado.dart';
import '../entities/contacto_soporte.dart';

abstract class SoporteRepository {
  Future<Resultado<ContactoSoporte>> obtenerContacto();
}

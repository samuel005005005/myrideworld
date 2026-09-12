import '../../domain/entities/contacto_soporte.dart';

class ContactoSoporteMapper {
  static ContactoSoporte fromConfigList(List<dynamic> items) {
    String? telefono;
    String? whatsapp;

    for (final item in items) {
      if (item is! Map) {
        continue;
      }
      final map = Map<String, dynamic>.from(item);
      final clave = map['clave'] as String?;
      final valor = map['valor'] as String?;
      if (clave == 'SOPORTE_TELEFONO') {
        telefono = valor;
      } else if (clave == 'SOPORTE_WHATSAPP') {
        whatsapp = valor;
      }
    }

    return ContactoSoporte(telefono: telefono, whatsapp: whatsapp);
  }
}

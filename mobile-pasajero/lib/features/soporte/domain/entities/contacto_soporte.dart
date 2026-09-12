class ContactoSoporte {
  final String? telefono;
  final String? whatsapp;

  const ContactoSoporte({this.telefono, this.whatsapp});

  bool get tieneTelefono => telefono != null && telefono!.trim().isNotEmpty;

  bool get tieneWhatsapp => whatsapp != null && whatsapp!.trim().isNotEmpty;
}

class ApiEndpoints {
  static const String login = '/auth/login';
  static const String viajes = '/viajes';

  static String aceptarViaje(String viajeId) {
    return '/viajes/$viajeId/aceptar';
  }

  static String marcarLlegada(String viajeId) {
    return '/viajes/$viajeId/llegada';
  }

  static String iniciarViaje(String viajeId) {
    return '/viajes/$viajeId/iniciar';
  }

  static String completarViaje(String viajeId) {
    return '/viajes/$viajeId/completar';
  }
}

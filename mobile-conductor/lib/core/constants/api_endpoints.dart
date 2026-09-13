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

  static String rechazarViaje(String viajeId) {
    return '/viajes/$viajeId/rechazar';
  }

  static const String disponibilidadConductor =
      '/conductores/me/disponibilidad';
  static const String perfilConductor = '/conductores/me';
  static const String tokenPushConductor = '/conductores/me/token-push';
  static const String ubicacionConductor = '/conductores/me/ubicacion';
  static const String viajeActivo = '/viajes/activo';
  static const String misViajes = '/viajes/mis-viajes';
  static const String misBalances = '/pagos-balances/mis-balances';

  static String pagoPorViaje(String viajeId) {
    return '/pagos-balances/por-viaje/$viajeId';
  }
}

class ApiEndpoints {
  static const String login = '/api/auth/login';
  static const String solicitarViaje = '/api/viajes';
  static const String viajesBase = '/api/viajes';
  static const String estimarTarifa = '/api/tarifas/estimar';
  static const String perfilPasajero = '/api/pasajeros/me';
  static const String misViajes = '/api/viajes/mis-viajes';
  static const String viajeActivo = '/api/viajes/activo';
  static const String configuracionPublica = '/api/configuracion/publica';
  static const String conductoresCercanos = '/api/conductores/cercanos';

  static String viajePorId(String viajeId) => '/api/viajes/$viajeId';

  static String cancelarViaje(String viajeId) => '/api/viajes/$viajeId/cancelar';

  static const String osrmRutaConduccion = '/route/v1/driving';
  static const String osrmGeometriasGeoJson = 'geometries=geojson';

  static String construirRutaOsrmConduccion({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  }) {
    return '$osrmRutaConduccion/'
        '$origenLng,$origenLat;$destinoLng,$destinoLat'
        '?$osrmGeometriasGeoJson';
  }
}

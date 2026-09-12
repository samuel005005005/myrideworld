class ApiEndpoints {
  static const String login = '/api/auth/login';
  static const String solicitarViaje = '/api/viajes';
  static const String viajesBase = '/api/viajes';
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

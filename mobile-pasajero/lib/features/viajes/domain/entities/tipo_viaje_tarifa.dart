/// Clasificación de tarifa según geocerca Cap Cana (API: tipoViaje).
enum TipoViajeTarifa {
  internoCapCana,
  externo;

  static TipoViajeTarifa? desdeApi(String? valor) {
    switch (valor) {
      case 'INTERNO_CAP_CANA':
        return TipoViajeTarifa.internoCapCana;
      case 'EXTERNO':
        return TipoViajeTarifa.externo;
      default:
        return null;
    }
  }
}

class AppStrings {
  static const String appName = 'MyRide Conductor';

  static const String loginTitle = 'MyRide';
  static const String loginSubtitle = 'Conductor';
  static const String loginButton = 'INICIAR SESION DEMO';

  static const String homeEstadoEnLinea = 'EN LINEA';
  static const String homeEstadoConectando = 'CONECTANDO...';
  static const String homeNuevoViajeTitulo = 'NUEVO VIAJE DISPONIBLE';
  static const String homeAceptarViaje = 'ACEPTAR VIAJE';
  static const String homeAceptandoViaje = 'Aceptando viaje...';
  static const String homeMapaSinConexion = 'Esperando conexion con el servidor';

  static const String viajeEstadoEnCamino = 'En camino al pasajero';
  static const String viajeEstadoEsperando = 'Esperando pasajero';
  static const String viajeEstadoEnCurso = 'En viaje';
  static const String viajeBotonLlegada = 'LLEGUE AL PUNTO';
  static const String viajeBotonIniciar = 'INICIAR VIAJE';
  static const String viajeBotonCompletar = 'FINALIZAR VIAJE';
  static const String viajeSinDatos = 'No se recibio un viaje valido';
  static const String viajeMuyCerca = 'Estas muy cerca';
  static const String viajeEsperandoInicio = 'Esperando accion del conductor';

  static const String errorGenerico = 'Ocurrio un error inesperado';
  static const String errorConexionServidor =
      'Error de conexion con el servidor';
  static const String errorAutenticacion =
      'No fue posible iniciar sesion del conductor';
  static const String errorTokenInvalido =
      'No fue posible procesar la sesion del conductor';
  static const String errorRespuestaLogin =
      'La respuesta del login no contiene un token valido';
  static const String errorSinSesion =
      'No hay una sesion activa para el conductor';
  static const String errorViajeInvalido =
      'No fue posible interpretar el viaje recibido';
  static const String errorAceptarViaje = 'No fue posible aceptar el viaje';
  static const String errorMarcarLlegada =
      'No fue posible marcar la llegada';
  static const String errorIniciarViaje = 'No fue posible iniciar el viaje';
  static const String errorCompletarViaje =
      'No fue posible completar el viaje';

  static const String socketSinToken = 'No hay token para conectar el socket';
  static const String socketConectado = 'Socket conectado';
  static const String socketDesconectado = 'Socket desconectado';

  static String formatoOrigen(double latitud, double longitud) {
    return 'Origen: Lat ${latitud.toStringAsFixed(4)}, Lng ${longitud.toStringAsFixed(4)}';
  }

  static String formatoDestino(double latitud, double longitud) {
    return 'Destino: Lat ${latitud.toStringAsFixed(4)}, Lng ${longitud.toStringAsFixed(4)}';
  }

  static String formatoTarifa(double tarifa) {
    return 'Tarifa estimada: US\$${tarifa.toStringAsFixed(2)}';
  }

  static String formatoEta(double kilometros, int minutos) {
    return '${kilometros.toStringAsFixed(1)} km | ~ $minutos min';
  }

  static String formatoError(String detalle) {
    return 'Error: $detalle';
  }
}

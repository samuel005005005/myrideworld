class AppStrings {
  static const String appName = 'MyRide Conductor';

  static const String loginTitle = 'MyRide';
  static const String loginSubtitle = 'Conductor';
  static const String loginButton = 'INICIAR SESION';
  static const String loginEmailLabel = 'Correo';
  static const String loginPasswordLabel = 'Contrasena';
  static const String loginEmptyFields = 'Completa correo y contrasena';
  static const String loginCerrarSesion = 'Cerrar sesion';
  static const String loginEmailHint = 'name@example.com';
  static const String loginPasswordHint = '••••••••';
  static const String loginSuccess = 'Bienvenido conductor';
  static const String errorSinConexion = 'Sin conexion a internet';

  static const String homeEstadoEnLinea = 'EN LINEA';
  static const String homeEstadoConectando = 'CONECTANDO...';
  static const String homeEstadoSinGps = 'SIN GPS';
  static const String homeEsperandoViajes = 'Esperando solicitudes cercanas';
  static const String homeGpsCargando = 'Obteniendo ubicacion...';
  static const String homeDrawerTitulo = 'Conductor';
  static const String homeDrawerSinEmail = '';
  static const String homeDrawerLogout = 'Cerrar Sesion';
  static const String homeNuevoViajeTitulo = 'NUEVO VIAJE DISPONIBLE';
  static const String homeAceptarViaje = 'ACEPTAR VIAJE';
  static const String homeRechazarViaje = 'RECHAZAR';
  static const String homeAceptandoViaje = 'Aceptando viaje...';
  static const String homeRechazandoViaje = 'Rechazando viaje...';
  static const String homeToggleOnline = 'Ponerse en linea';
  static const String homeToggleOffline = 'Salir de linea';
  static const String homeEstadoFueraDeLinea = 'FUERA DE LINEA';
  static const String homeNecesitaGpsParaOnline =
      'Activa el GPS antes de ponerte en linea';
  static const String homeMapaSinConexion =
      'Esperando conexion con el servidor';
  static const String homeFueraDeLineaHint =
      'Activa el interruptor para recibir viajes';

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
  static const String errorRechazarViaje = 'No fue posible rechazar el viaje';
  static const String errorDisponibilidad =
      'No fue posible actualizar tu disponibilidad';
  static const String errorMarcarLlegada =
      'No fue posible marcar la llegada. Si estas lejos del origen, acercate e intenta de nuevo.';
  static const String errorIniciarViaje =
      'No fue posible iniciar el viaje. Debes estar cerca del punto de recogida.';
  static const String errorCompletarViaje =
      'No fue posible finalizar el viaje. Debes estar cerca del destino.';
  static const String errorProximidadGps =
      'El GPS indica que aun no estas lo suficientemente cerca del punto requerido.';

  static const String socketSinToken = 'No hay token para conectar el socket';
  static const String socketConectado = 'Conectado';
  static const String socketDesconectado = 'Desconectado';
  static const String errorGpsDesactivado = 'Activa el GPS para continuar';
  static const String errorGpsPermiso =
      'Se requiere permiso de ubicacion para operar';
  static const String errorGpsObtener = 'No se pudo obtener la ubicacion GPS';
  static const String errorViajeActivo = 'No se pudo consultar el viaje activo';
  static const String errorPerfilObtener = 'No se pudo cargar el perfil';
  static const String errorPerfilActualizar = 'No se pudo actualizar el perfil';
  static const String errorBalances = 'No se pudieron cargar los balances';
  static const String perfilTitulo = 'Mi Perfil';
  static const String perfilNombreLabel = 'Nombre Completo';
  static const String perfilTelefonoLabel = 'Telefono';
  static const String perfilEmailLabel = 'Correo';
  static const String perfilVehiculoSeccion = 'Vehiculo';
  static const String perfilMarcaLabel = 'Marca';
  static const String perfilModeloLabel = 'Modelo';
  static const String perfilColorLabel = 'Color';
  static const String perfilPlacaLabel = 'Placa';
  static const String perfilGuardar = 'Guardar Cambios';
  static const String perfilActualizadoOk = 'Perfil actualizado correctamente';
  static const String balancesTitulo = 'Mis Balances';
  static const String balancesTotalNeto = 'Total neto acumulado';
  static const String balancesVacio = 'Aun no tienes balances registrados';
  static const String balancesReintentar = 'Reintentar';
  static const String reciboTitulo = 'Viaje Completado';
  static const String reciboSubtitulo = 'Resumen de tu ganancia';
  static const String reciboNetoLabel = 'Neto a recibir';
  static const String reciboBrutoLabel = 'Bruto';
  static const String reciboFeeLabel = 'Fee plataforma';
  static const String reciboMetodoLabel = 'Metodo';
  static const String reciboVolverHome = 'VOLVER AL INICIO';
  static const String homeDrawerPerfil = 'Mi Perfil';
  static const String homeDrawerBalances = 'Mis Balances';
  static const String homeDrawerHistorial = 'Historial de Viajes';
  static const String historialTitulo = 'Historial de Viajes';
  static const String historialVacio = 'Aun no tienes viajes registrados';
  static const String historialReintentar = 'Reintentar';
  static const String errorHistorial = 'No se pudo cargar el historial';

  static String formatoMoneda(double valor) {
    return 'US\$${valor.toStringAsFixed(2)}';
  }

  static String formatoOrigenCorto(double latitud, double longitud) {
    return '${latitud.toStringAsFixed(3)}, ${longitud.toStringAsFixed(3)}';
  }

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

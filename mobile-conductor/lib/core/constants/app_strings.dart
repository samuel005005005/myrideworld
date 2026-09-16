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
  static const String homeOfertasTitulo = 'VIAJES DISPONIBLES';
  static String formatoOfertasCantidad(int cantidad) {
    if (cantidad <= 1) {
      return '1 viaje disponible';
    }
    return '$cantidad viajes disponibles — elegí el que te convenga';
  }
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
  static const String viajeMuyCerca = 'Estas muy cerca';
  static const String viajeEsperandoInicio = 'Esperando accion del conductor';
  static const String viajeMarcadorRecogida = 'Recogida';
  static const String viajeMarcadorDestino = 'Destino';
  static const String viajeMarcadorConductor = 'Tu auto';
  static const String viajeMarcadorCerrar = 'Cerrar';
  static const String viajeMarcadorCopiado = 'Coordenadas copiadas';
  static const String viajeDetalleRecogida = 'Punto de recogida del pasajero';
  static const String viajeDetalleDestino = 'Destino del viaje';
  static const String viajeDetalleConductor = 'Tu ubicacion actual';
  static const String viajeCanceladoPorPasajero =
      'El pasajero cancelo el viaje';
  static const String viajeDireccionCargando = 'Obteniendo nombre del lugar...';
  static const String viajeDireccionNoDisponible = 'Nombre del lugar no disponible';
  static const String viajeAbrirGoogleMaps = 'Google Maps';
  static const String viajeAbrirWaze = 'Waze';
  static const String viajeNavegarHacia = 'Navegar hacia el punto';
  static const String errorAbrirNavegacion =
      'No se pudo abrir la app de navegacion';

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
  static const String errorApiUbicacion =
      'No se pudo enviar la ubicacion al servidor';

  static String formatoErrorApiUbicacion(int status) =>
      'No se pudo enviar la ubicacion al servidor (HTTP $status)';
  static const String errorObtenerRuta = 'No se pudo obtener la ruta del viaje';
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
  static const String errorObtenerDireccion =
      'No se pudo obtener la direccion del punto';
  static const String viajeOrigenCargando = 'Origen: obteniendo direccion...';
  static const String viajeDestinoCargando = 'Destino: obteniendo direccion...';
  static const String viajeOrigenSinDireccion = 'Origen: ubicacion del pasajero';
  static const String viajeDestinoSinDireccion = 'Destino: ubicacion elegida';

  static String formatoOrigenCorto(double latitud, double longitud) {
    return '${latitud.toStringAsFixed(3)}, ${longitud.toStringAsFixed(3)}';
  }

  static String formatoOrigenTexto(String direccion) {
    return 'Origen: $direccion';
  }

  static String formatoDestinoTexto(String direccion) {
    return 'Destino: $direccion';
  }

  static String formatoOrigenCoords(double latitud, double longitud) {
    return 'Origen: ${formatoCoordenada(latitud, longitud)}';
  }

  static String formatoDestinoCoords(double latitud, double longitud) {
    return 'Destino: ${formatoCoordenada(latitud, longitud)}';
  }

  /// Etiquetas genéricas del pasajero que no sirven como dirección real.
  static bool esDireccionGenerica(String? texto) {
    if (texto == null) {
      return true;
    }
    final t = texto.trim().toLowerCase();
    if (t.isEmpty) {
      return true;
    }
    const genericas = <String>{
      'mi ubicacion actual',
      'mi ubicación actual',
      'punto seleccionado en el mapa',
      'punto de recogida',
      'punto de destino',
      'ubicacion del pasajero',
      'ubicación del pasajero',
    };
    return genericas.contains(t);
  }

  static String formatoMarcadorConLugar(String rol, String? lugar) {
    if (lugar == null || lugar.trim().isEmpty) {
      return rol;
    }
    return '$rol · $lugar';
  }

  static String formatoMoneda(double valor) {
    return 'US\$${valor.toStringAsFixed(2)}';
  }

  static String formatoCoordenada(double latitud, double longitud) {
    return '${latitud.toStringAsFixed(5)}, ${longitud.toStringAsFixed(5)}';
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

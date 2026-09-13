class AppStrings {
  // General
  static const String appName = 'MyRide Pasajero';

  // Login Page
  static const String loginTitle = 'MyRide';
  static const String loginSubtitle = 'Pasajero';
  static const String loginEmailLabel = 'Correo Electrónico';
  static const String loginPasswordLabel = 'Contraseña';
  static const String loginPasswordHint = 'Obligatorio';
  static const String loginPasswordPlaceholder = '••••••••';
  static const String loginButton = 'INICIAR SESIÓN';
  static const String loginSuccess = '¡Bienvenido!';
  static const String loginForgotPass = '¿Olvidaste tu contraseña?';
  static const String loginNoAccount = '¿No tienes cuenta?';
  static const String loginRegisterHere = 'Regístrate aquí';
  static const String loginEmptyFields = 'Por favor llena todos los campos';
  static const String loginLanguageES = 'ES';
  static const String loginLanguageEN = 'EN';
  static const String loginTurismoSeguro = 'TURISMO SEGURO RD';

  // Home Page
  static const String homeLoadingLocation = 'Obteniendo ubicación...';
  static const String homeWhereTo = '¿A dónde vamos?';
  static const String homeMoveMap =
      'Mueve el mapa para colocar el pin rojo en tu destino.';
  static const String homeRequestTaxi = 'SOLICITAR TAXI AHORA';
  static const String homeTripRequested = '¡Viaje Solicitado!';
  static const String homeSearchingDriver =
      'Buscando al conductor más cercano...';
  static const String homeEstimatedFare = 'Tarifa Estimada: \$';

  // Errors
  static const String errorGeneric = 'Ocurrió un error inesperado';
  static const String errorNoSession = 'No hay sesión activa de pasajero';
  static const String errorServerConnection =
      'Error de conexión con el servidor';
  static const String errorLoginInvalid =
      'Credenciales inválidas o error en login';
  static const String errorRespuestaLogin =
      'La respuesta de login no incluye un token válido';
  static const String errorTokenInvalido = 'Token de sesión inválido';
  static const String errorTripRequest = 'Error al solicitar viaje';
  static const String errorUnexpected = 'Error inesperado: ';
  static const String errorObtenerRuta = 'No se pudo obtener la ruta del viaje';
  static const String errorSinConexion = 'Sin conexión a internet';
  static const String errorSesionExpirada =
      'Tu sesión expiró. Inicia sesión nuevamente';

  // Registro / Bienvenida Turística
  static const String welcomeTitle = '¡Bienvenido al Paraíso!';
  static const String welcomeSubtitle = 'Tu traslado seguro en Punta Cana';
  static const String welcomeDescription =
      'Conéctate en segundos con conductores oficiales certificados para resorts, traslados al aeropuerto PUJ y excursiones.';
  static const String welcomeMiturCert = 'Certificado MITUR & Asotaxi';
  static const String welcomeMiturDesc =
      'Tarifa oficial fijada por zona turística';
  static const String welcomeContinueWhatsApp = 'Continuar con WhatsApp';
  static const String welcomeContinueGoogle = 'Google';
  static const String welcomeContinueApple = 'Apple';
  static const String welcomeOrWithDetails = 'o con tus datos de viaje';
  static const String welcomeFullNameLabel = 'Nombre completo';
  static const String welcomeFullNameHint = 'Como figura en pasaporte';
  static const String welcomeFullNamePlaceholder = 'ej. Sarah Jenkins';
  static const String welcomeEmailLabel = 'Correo electrónico';
  static const String welcomeEmailHint = 'Para recibos y confirmación';
  static const String welcomeEmailPlaceholder = 'sarah.jenkins@gmail.com';
  static const String welcomePhoneLabel = 'Teléfono móvil (WhatsApp activo)';
  static const String welcomePhonePlaceholder = '809 000 0000';
  static const String welcomeResortLabel = 'Hotel o zona de estadía';
  static const String welcomeResortHint = 'Opcional';
  static const String welcomeResortPlaceholder =
      'ej. Hard Rock Punta Cana, Cap Cana, Bávaro...';
  static const String welcomeTermsAgree =
      'Acepto los Términos del Servicio de Taxi Turístico y confirmo tarifas fijas reguladas por el Ministerio de Turismo (MITUR).';
  static const String welcomeStartTraveling = 'Comenzar a Viajar';
  static const String welcomeFixedFaresTitle =
      'Tarifas Oficiales Sin Sorpresas';
  static const String welcomeFixedFaresDesc =
      'Sin tarifas dinámicas ni sobrecargos sorpresa. Los precios entre el Aeropuerto Internacional de Punta Cana (PUJ), Cap Cana, Bávaro, Uvero Alto y Macao son fijos y en USD o DOP.';

  // Búsqueda en Radar
  static const String radarSearchingTitle = 'Buscando Conductor Cercano';
  static const String radarStep2 = 'Paso 2 de 5';
  static const String radarNotifying =
      'Notificando choferes oficiales certificados';
  static const String radarConnecting = 'Conectando chofer prioritario';
  static const String radarPickup = 'Punto de Recogida';
  static const String radarDestination = 'Destino Turístico';
  static const String radarFixedFareGuarantee =
      'Tarifa 100% Congelada y Garantizada';
  static const String radarFixedFareDesc =
      'Sin tarifa dinámica. Valor normado oficialmente por la Asociación de Taxis Turísticos de Punta Cana (ASOTATUR).';
  static const String radarCancelBtn = 'Cancelar Solicitud';
  static const String radarCancelDesc =
      'Cancelación gratuita sin penalización antes de que el conductor confirme.';

  // Fin de Viaje y Calificación
  static const String ratingTripEnded = 'Viaje Concluido Exitosamente';
  static const String ratingArrived = '¡Has llegado a tu destino!';
  static const String ratingOfficial = 'Oficial';
  static const String ratingHowWasIt = '¿Cómo estuvo tu experiencia con';
  static const String ratingCommentLabel =
      'Mensaje de agradecimiento (opcional)';
  static const String ratingCommentHint = 'Escribe un comentario...';
  static const String ratingVoluntaryTip = 'Propina Voluntaria';
  static const String ratingTipDesc = '100% destinada directamente al chofer';
  static const String ratingReceiptTitle = 'Recibo Oficial de Pasaje';
  static const String ratingReceiptSub =
      'Sindicato Autónomo de Choferes de Taxi Turístico';
  static const String ratingPaid = 'PAGADO';
  static const String ratingTotalCharged = 'Total Cobrado';
  static const String ratingIncludesTaxes = 'Incluye ITBIS y tasas locales';
  static const String ratingSubmitBtn = 'Enviar Calificación y Finalizar';
  static const String ratingPdfReceipt = 'Factura PDF';
  static const String ratingReportHelp = 'Reportar Ayuda';

  // Historial de Viajes
  static const String historyTitle = 'Mis Viajes';
  static const String historySubtitle =
      'Historial certificado y soporte oficial MITUR';
  static const String historyCompleted = 'Completados';
  static const String historyCanceled = 'Cancelados';
  static const String historyAll = 'Todos';
  static const String historyPastTrips = 'Viajes Anteriores';
  static const String historySupportTitle = 'Asistencia & Soporte Turístico';
  static const String historyLostItem = '¿Olvidaste un objeto en el taxi?';
  static const String historyLostItemDesc =
      'Radio Despacho centralizado y rastreo inmediato';
  static const String historyInvoice = 'Facturación con NCF (DGII)';
  static const String historyInvoiceDesc =
      'Genera comprobante fiscal corporativo al instante';
  static const String historySupport247 = 'Central de Asistencia 24/7';
  static const String historySupportBilingual =
      'Atención Bilingüe (Español / English)';
  static const String historyCallCenter = 'Llamar Central';
  static const String historyWhatsApp = 'WhatsApp Oficial';
  static const String historyEmpty = 'Aun no tienes viajes registrados';
  static const String historyRetry = 'Reintentar';
  static const String errorHistorial = 'No se pudo cargar el historial';

  static String formatoMoneda(double valor) {
    return 'US\$${valor.toStringAsFixed(2)}';
  }

  static String formatoRutaCoords(
    double origenLat,
    double origenLng,
    double destinoLat,
    double destinoLng,
  ) {
    return '${origenLat.toStringAsFixed(3)}, ${origenLng.toStringAsFixed(3)} → '
        '${destinoLat.toStringAsFixed(3)}, ${destinoLng.toStringAsFixed(3)}';
  }
  // Solicitud y Tarifario Fijo
  static const String homeOfficialRateTitle = 'Tarifa Fija Regulada';
  static const String homeOfficialRateBadge = 'Asociación Oficial';
  static const String homeOfficialRateDesc =
      'Precios transparentes garantizados sin cobros dinámicos ni sorpresas.';
  static const String homePickupLabel = 'Punto de Recogida / Pickup';
  static const String homePickupBadge = 'GPS Preciso';
  static const String homeDropoffLabel = 'Destino / Drop-off';
  static const String homeDropoffBadge = 'Zona Hotelera';
  static const String homeVehicleType = 'Tipo de Vehículo Turístico';
  static const String homeVehicleCertified = 'Taxis Certificados';
  static const String homeVehicleSedan = 'Sedán Turístico';
  static const String homeVehicleSedanBadge = 'Estándar';
  static const String homeVehicleMinivan = 'Van / Minivan';
  static const String homeVehicleMinivanBadge = 'Familiar';
  static const String homeVehicleSuv = 'SUV Premium';
  static const String homeVehicleSuvBadge = 'VIP Executive';
  static const String homePaymentMethod = 'Método de Pago';
  static const String homePaymentSecure = 'SSL 256-Bit Seguro';
  static const String homePaymentCash = 'Efectivo al Conductor';
  static const String homePaymentCashDesc =
      'Acepta Dólares (USD) o Pesos Dominicanos (DOP al cambio oficial de la Asociación). Sin recargos de pasarela.';
  static const String homePaymentCard = 'Tarjeta Débito / Crédito';
  static const String homePaymentCardDesc =
      'Cobro digital seguro en móvil con Visa, Mastercard o American Express.';
  static const String homePaymentBase = 'Tarifa oficial base:';
  static const String homePaymentFee = 'Comisión pasarela bancaria (+7.5%):';
  static const String homePaymentTotal = 'Total a debitar:';
  static const String homeSafetyDesc =
      'Conductor carnetizado por MITUR y Asociación de Taxistas de Punta Cana.';
  static const String homeConfirmBtn = 'Confirmar Solicitud de Taxi';
  static const String homeOfficialRatesMitur =
      'Tarifas Oficiales Reguladas (MITUR)';
  static const String homeRouteEtaLabel = 'ETA';
  static const String homeEtaNoDisponible = '--:--';
  static const String homeVehicleSedanLabel = 'Sedan';
  static const String homeVehicleMinivanLabel = 'Van Familiar';
  static const String homeVehicleSuvLabel = 'SUV Premium';
  static const String homePaymentCashShort = 'Efectivo';
  static const String homePaymentCardShort = 'Tarjeta';
  static const String homeCardFeeIncluded = 'Tarifa segun metodo de pago';
  static const String homeTarifaPendienteApi = 'Obteniendo tarifa oficial...';
  static const String homePrecioNoDisponible = '—';
  static const String homeMiUbicacion = 'Mi ubicacion actual';
  static String formatoPuntoMapa(double latitud, double longitud) {
    return 'Lat ${latitud.toStringAsFixed(5)}, Lng ${longitud.toStringAsFixed(5)}';
  }
  static const String errorGpsDesactivado = 'Activa el GPS para continuar';
  static const String errorGpsPermiso =
      'Se requiere permiso de ubicacion para solicitar viajes';
  static const String errorGpsObtener = 'No se pudo obtener la ubicacion GPS';
  static const String errorEstimarTarifa = 'No se pudo estimar la tarifa oficial';
  static const String homeDrawerSinSesion = 'Pasajero';
  static const String homeDrawerSinEmail = '';
  static const String homeDrawerTrips = 'Mis Viajes';
  static const String homeDrawerPaymentMethods = 'Metodos de Pago';
  static const String homeDrawerPromotions = 'Promociones';
  static const String homeDrawerSupport = 'Ayuda y Soporte';
  static const String homeDrawerLogout = 'Cerrar Sesion';
  static const String perfilTitulo = 'Mi Perfil';
  static const String perfilNombreLabel = 'Nombre Completo';
  static const String perfilTelefonoLabel = 'Telefono';
  static const String perfilEmailLabel = 'Correo Electronico';
  static const String perfilEmailSoloLectura =
      'El correo no se puede cambiar desde la app.';
  static const String perfilGuardar = 'Guardar Cambios';
  static const String perfilActualizadoOk = 'Perfil actualizado correctamente.';

  // Tracking en Vivo y Conductor
  static const String trackingTitle = 'Viaje En Curso';
  static const String trackingLiveGPS = 'GPS en Vivo';
  static const String trackingArrivesIn = 'Llega en';
  static const String trackingStatusTitle = 'Conductor en camino';
  static const String trackingStatusBadge = 'Paso 4/5';
  static const String trackingStatusSubtitle = 'Estado 4 · Confirmado';
  static const String trackingVerifiedDriver =
      'Conductor Oficial Verificado — Asociación Taxis Turísticos Punta Cana';
  static const String trackingCallDriver = 'Llamar al chofer';
  static const String trackingQuickMsg = 'Mensaje rápido';
  static const String trackingSummaryTitle = 'Resumen del Viaje';
  static const String trackingAgreedRate = 'Tarifa acordada';
  static const String trackingAgreedRateDesc = 'Efectivo / Pago al finalizar';
  static const String trackingTouristSafety = 'Seguridad del Turista';
  static const String trackingShareTrip = 'Compartir Viaje';
  static const String trackingSOS = 'SOS 24/7';
  static const String trackingEsperandoConfirmacion =
      'Esperando confirmacion...';
  static const String trackingConductorEnCamino = 'Conductor en camino';
  static const String trackingConductorHaLlegado = 'El conductor ha llegado';
  static const String trackingViajeEnCursoDestino = 'En viaje hacia tu destino';
  static const String trackingLlegandoEnCincoMinutos = 'Llegando en ~ 5 min';
  static const String trackingConductorPendiente = 'Buscando conductor...';
  static const String trackingVehiculoPendiente = 'Vehiculo por confirmar';
  static const String trackingPlacaPendiente = '---';
  static const String errorViajeDetalle =
      'No se pudo cargar el detalle del viaje';
  static const String trackingCallAction = 'Llamar';
  static const String trackingMessageAction = 'Mensaje';
  static const String trackingShareAction = 'Compartir';
  static const String trackingTelefonoNoDisponible =
      'El conductor no tiene telefono registrado';
  static const String trackingLlamadaFallida =
      'No se pudo iniciar la llamada';

  static const String trackingWaitingCompletion =
      'Esperando que el conductor finalice el viaje...';
  static const String trackingCancelarViaje = 'Cancelar viaje';
  static const String trackingViajeCancelado = 'Viaje cancelado';
  static const String trackingCancelando = 'Cancelando…';
  static const String receiptArrivedTitle = 'Llegaste a tu destino';
  static const String receiptThanksMessage =
      'Esperamos que hayas tenido un excelente viaje.';
  static const String receiptTotalPaid = 'Total Pagado';
  static const String receiptDistance = 'Distancia';
  static const String receiptDuration = 'Duracion';
  static const String receiptBackHome = 'VOLVER AL INICIO';
  static const String ratingTitle = 'Calificación del Viaje';
  static const String ratingSubtitle = 'Gracias por elegir nuestro servicio';

  static String homeResumenRuta(double distanciaKm, int duracionMinutos) =>
      '${distanciaKm.toStringAsFixed(1)} km • $duracionMinutos min de viaje';

  static String homeResumenDistancia(double distanciaKm) =>
      '${distanciaKm.toStringAsFixed(1)} km';

  static String homeResumenEta(int duracionMinutos) =>
      '$homeRouteEtaLabel: $duracionMinutos min';

  static String homeSolicitarVehiculo(String vehiculo, double total) =>
      'Pedir $vehiculo • US\$${total.toStringAsFixed(2)}';

  static String homeSolicitarVehiculoSinPrecio(String vehiculo) =>
      'Pedir $vehiculo';

  static String homePrecioVehiculo(double total) =>
      'US\$${total.toStringAsFixed(2)}';

  static String receiptTotalTarifa(double tarifa) =>
      'US\$${tarifa.toStringAsFixed(2)}';

  static String receiptDistanciaValor(double distancia) =>
      '${distancia.toStringAsFixed(1)} km';

  static String receiptDuracionValor(int duracionMinutos) =>
      '$duracionMinutos min';

  static const String pagosTitulo = 'Metodos de Pago';
  static const String pagosSeccionTitulo = 'Metodo activo';
  static const String pagosMvpNota =
      'En el MVP el cobro se registra en efectivo al finalizar el viaje.';
  static const String pagosEfectivoTitulo = 'Efectivo';
  static const String pagosEfectivoDesc = 'Pago al finalizar el viaje';

  static const String ayudaTitulo = 'Ayuda y Soporte';
  static const String ayudaPregunta = 'En que podemos ayudarte?';
  static const String ayudaSubtitulo =
      'Contacto oficial configurado por la asociacion.';
  static const String ayudaLlamarTitulo = 'Llamar a la Central';
  static const String ayudaWhatsappTitulo = 'WhatsApp Oficial';
  static const String ayudaObjetosTitulo = 'Objetos Perdidos';
  static const String ayudaObjetosDesc =
      'Reporta por telefono a la central de asistencia';
  static const String ayudaContactoNoConfigurado =
      'Contacto no configurado por el administrador';
  static const String ayudaNoSePudoAbrir = 'No se pudo abrir la aplicacion';
  static const String ayudaReintentar = 'Reintentar';
  static const String errorSoporteContacto =
      'No se pudieron cargar los contactos de soporte';
  static const String errorCancelarViaje = 'No se pudo cancelar el viaje';
  static const String radarCancelando = 'Cancelando solicitud...';
}

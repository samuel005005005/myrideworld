import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/auth/sesion_invalida_tick.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/logging/app_logger.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/providers/core_providers.dart';
import '../../../../core/tipos/resultado.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/domain/entities/sesion_usuario.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/services/oferta_viaje_alerta_service.dart';
import '../../data/services/push_oferta_viaje_service.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/usecases/aceptar_viaje_params.dart';
import '../../domain/usecases/actualizar_disponibilidad_params.dart';
import '../../domain/usecases/obtener_direccion_params.dart';
import '../../domain/usecases/rechazar_viaje_params.dart';
import '../models/oferta_en_cola.dart';
import '../providers/viaje_cancelado_id_provider.dart';
import '../providers/viajes_provider.dart';
import 'home_conductor_state.dart';

final homeConductorControllerProvider =
    NotifierProvider<HomeConductorController, HomeConductorState>(() {
      return HomeConductorController();
    });

class HomeConductorController extends Notifier<HomeConductorState> {
  SesionUsuario? _sesionUsuario;
  bool _estaInicializado = false;
  StreamSubscription<Viaje>? _subOfertasPush;
  StreamSubscription<String>? _subCancelPush;
  PushOfertaViajeService? _push;
  Timer? _heartbeatGps;
  StreamSubscription? _suscripcionGpsFlota;

  @override
  HomeConductorState build() {
    ref.listen<int>(sesionInvalidaTickProvider, (anterior, siguiente) {
      if (anterior == siguiente) {
        return;
      }
      _heartbeatGps?.cancel();
      _heartbeatGps = null;
      unawaited(_suscripcionGpsFlota?.cancel());
      _suscripcionGpsFlota = null;
      unawaited(OfertaViajeAlertaService.instancia.detener());
    });
    ref.onDispose(() {
      _heartbeatGps?.cancel();
      unawaited(_suscripcionGpsFlota?.cancel());
      unawaited(_subOfertasPush?.cancel());
      unawaited(_subCancelPush?.cancel());
      unawaited(OfertaViajeAlertaService.instancia.detener());
      ref.read(viajeRealtimeGatewayProvider).desconectar();
    });
    return const HomeConductorState();
  }

  Future<void> inicializar() async {
    if (_estaInicializado) {
      return;
    }

    _estaInicializado = true;
    state = state.copyWith(inicializando: true, errorMensaje: null);

    try {
      final sesion = ref.read(authControllerProvider).asData?.value;
      if (sesion == null) {
        _estaInicializado = false;
        state = state.copyWith(
          inicializando: false,
          errorMensaje: AppStrings.errorSinSesion,
        );
        return;
      }

      _sesionUsuario = sesion;
      await _conectarSocketSesion(sesion);

      await OfertaViajeAlertaService.instancia
          .inicializar()
          .timeout(const Duration(seconds: 5));

      _push = PushOfertaViajeService(dio: ref.read(dioProvider));
      // FCM no debe bloquear el home (getToken puede colgarse en emulador).
      unawaited(
        _push!.iniciar().timeout(
          const Duration(seconds: 12),
          onTimeout: () {
            AppLogger.info(
              'HomeConductorController.inicializar',
              'Timeout iniciando FCM; se continua sin push',
            );
          },
        ),
      );
      _escucharAlertasPush();

      final ubicacionResultado = await ref
          .read(ubicacionGatewayProvider)
          .obtenerUbicacionActual();

      ubicacionResultado.foldLogged(
        'HomeConductorController.inicializar',
        (failure) {
          state = state.copyWith(errorMensaje: failure.mensaje);
        },
        (coordenada) {
          state = state.copyWith(
            ubicacionActual: LatLng(coordenada.latitud, coordenada.longitud),
          );
        },
      );

      final activoResultado = await ref
          .read(obtenerViajeActivoProvider)(NoParams())
          .timeout(
            const Duration(seconds: 8),
            onTimeout: () => const Exito(null),
          );
      activoResultado.fold(
        (_) {},
        (viajeActivo) {
          if (viajeActivo != null) {
            state = state.copyWith(viajeActivoParaRestaurar: viajeActivo);
          }
        },
      );
    } catch (error, stack) {
      AppLogger.error('HomeConductorController.inicializar', error, stack);
      _estaInicializado = false;
      state = state.copyWith(errorMensaje: AppStrings.errorGenerico);
    } finally {
      state = state.copyWith(inicializando: false, enLinea: false);
    }
  }

  void _escucharAlertasPush() {
    final alerta = OfertaViajeAlertaService.instancia;
    _subOfertasPush?.cancel();
    _subCancelPush?.cancel();
    _subOfertasPush = alerta.ofertas.listen((viaje) {
      if (!state.enLinea && !state.cambiandoDisponibilidad) {
        return;
      }
      _agregarOferta(viaje);
    });
    _subCancelPush = alerta.cancelaciones.listen(_quitarOferta);
  }

  void consumirViajeActivoRestaurado() {
    state = state.copyWith(viajeActivoParaRestaurar: null);
  }

  Future<void> cambiarDisponibilidad(bool disponible) async {
    if (state.cambiandoDisponibilidad) {
      return;
    }

    final sesion = _sesionUsuario;
    if (sesion == null) {
      state = state.copyWith(errorMensaje: AppStrings.errorSinSesion);
      return;
    }

    if (disponible && state.ubicacionActual == null) {
      state = state.copyWith(
        errorMensaje: AppStrings.homeNecesitaGpsParaOnline,
      );
      return;
    }

    state = state.copyWith(
      cambiandoDisponibilidad: true,
      errorMensaje: null,
    );

    // Socket primero: el backend ofertea en el PATCH y al identificarConductor.
    if (disponible) {
      await _configurarSocket(sesion);
      await _push?.iniciar();
    }

    final ubicacion = state.ubicacionActual;
    final resultado = await ref.read(actualizarDisponibilidadProvider)(
      ActualizarDisponibilidadParams(
        disponible: disponible,
        latitud: disponible ? ubicacion?.latitude : null,
        longitud: disponible ? ubicacion?.longitude : null,
      ),
    );

    final ok = await resultado.foldLogged(
      'HomeConductorController.cambiarDisponibilidad',
      (failure) async {
        if (disponible) {
          ref.read(viajeRealtimeGatewayProvider).desconectar();
          await _conectarSocketSesion(sesion);
        }
        state = state.copyWith(
          cambiandoDisponibilidad: false,
          errorMensaje: failure.mensaje,
        );
        return false;
      },
      (_) async => true,
    );

    if (!ok) {
      return;
    }

    if (disponible) {
      state = state.copyWith(
        cambiandoDisponibilidad: false,
        enLinea: true,
        errorMensaje: null,
      );
      _iniciarPublicacionGpsFlota();
      return;
    }

    await _detenerPublicacionGpsFlota();
    await OfertaViajeAlertaService.instancia.detener();
    ref.read(viajeRealtimeGatewayProvider).desconectar();
    await _conectarSocketSesion(sesion);
    state = state.copyWith(
      cambiandoDisponibilidad: false,
      enLinea: false,
      ofertas: const <OfertaEnCola>[],
      errorMensaje: null,
    );
  }

  void _iniciarPublicacionGpsFlota() {
    _heartbeatGps?.cancel();
    unawaited(_suscripcionGpsFlota?.cancel());
    _suscripcionGpsFlota = ref
        .read(ubicacionGatewayProvider)
        .observarUbicacion()
        .listen((coordenada) {
          if (!state.enLinea) {
            return;
          }
          state = state.copyWith(
            ubicacionActual: LatLng(coordenada.latitud, coordenada.longitud),
          );
          ref.read(viajeRealtimeGatewayProvider).publicarUbicacionFlota(
                latitud: coordenada.latitud,
                longitud: coordenada.longitud,
              );
        });
    // Primer fix inmediato + heartbeat REST de respaldo.
    unawaited(_enviarHeartbeatGps());
    _heartbeatGps = Timer.periodic(const Duration(seconds: 30), (_) {
      unawaited(_enviarHeartbeatGps());
    });
  }

  Future<void> _detenerPublicacionGpsFlota() async {
    _heartbeatGps?.cancel();
    _heartbeatGps = null;
    await _suscripcionGpsFlota?.cancel();
    _suscripcionGpsFlota = null;
    ref.read(viajeRealtimeGatewayProvider).salirDeFlota();
  }

  Future<void> _enviarHeartbeatGps() async {
    if (!state.enLinea) {
      return;
    }
    final resultado = await ref
        .read(ubicacionGatewayProvider)
        .obtenerUbicacionActual();
    await resultado.fold(
      (_) async {},
      (coordenada) async {
        state = state.copyWith(
          ubicacionActual: LatLng(coordenada.latitud, coordenada.longitud),
        );
        ref.read(viajeRealtimeGatewayProvider).publicarUbicacionFlota(
              latitud: coordenada.latitud,
              longitud: coordenada.longitud,
            );
        final rest = await ref
            .read(disponibilidadRepositoryProvider)
            .actualizarUbicacion(
              latitud: coordenada.latitud,
              longitud: coordenada.longitud,
            );
        rest.fold(
          (failure) {
            // No bloquear flota por heartbeat REST; se reintenta al próximo tick.
            AppLogger.warning(
              'HomeConductorController.heartbeatGps',
              failure.mensaje,
            );
          },
          (_) {},
        );
      },
    );
  }

  Future<Viaje?> aceptarViaje(Viaje viaje) async {
    final sesion = _sesionUsuario;
    if (sesion == null) {
      state = state.copyWith(errorMensaje: AppStrings.errorSinSesion);
      return null;
    }

    state = state.copyWith(
      aceptandoViaje: true,
      aceptandoViajeId: viaje.id,
      errorMensaje: null,
    );

    final aceptarViaje = ref.read(aceptarViajeProvider);
    final resultado = await aceptarViaje(
      AceptarViajeParams(viajeId: viaje.id, conductorId: sesion.userId),
    );

    return resultado.foldLogged(
      'HomeConductorController.aceptarViaje',
      (failure) {
        unawaited(
          OfertaViajeAlertaService.instancia.detener(viajeId: viaje.id),
        );
        ref.read(viajeRealtimeGatewayProvider).salirDeViaje(viaje.id);
        state = state.copyWith(
          aceptandoViaje: false,
          aceptandoViajeId: null,
          errorMensaje: failure.mensaje,
        );
        return null;
      },
      (viajeAceptado) {
        unawaited(OfertaViajeAlertaService.instancia.detener());
        unawaited(_detenerPublicacionGpsFlota());
        ref.read(viajeRealtimeGatewayProvider).unirseAViaje(viajeAceptado.id);
        state = state.copyWith(
          aceptandoViaje: false,
          aceptandoViajeId: null,
          ofertas: const <OfertaEnCola>[],
          errorMensaje: null,
        );
        return viajeAceptado;
      },
    );
  }

  Future<bool> rechazarViaje(Viaje viaje) async {
    state = state.copyWith(
      rechazandoViaje: true,
      rechazandoViajeId: viaje.id,
      errorMensaje: null,
    );

    final resultado = await ref.read(rechazarViajeProvider)(
      RechazarViajeParams(viajeId: viaje.id),
    );

    unawaited(OfertaViajeAlertaService.instancia.detener(viajeId: viaje.id));
    ref.read(viajeRealtimeGatewayProvider).salirDeViaje(viaje.id);
    _quitarOferta(viaje.id);
    state = state.copyWith(
      rechazandoViaje: false,
      rechazandoViajeId: null,
      errorMensaje: null,
    );

    return resultado.foldLogged(
      'HomeConductorController.rechazarViaje',
      (_) => true,
      (_) => true,
    );
  }

  Future<void> cerrarSesion() async {
    final token = await ref.read(sessionStorageProvider).obtenerToken();
    if (state.enLinea && token != null && token.isNotEmpty) {
      await ref.read(actualizarDisponibilidadProvider)(
        const ActualizarDisponibilidadParams(disponible: false),
      );
    }
    await OfertaViajeAlertaService.instancia.detener();
    ref.read(viajeRealtimeGatewayProvider).desconectar();
    _estaInicializado = false;
    _sesionUsuario = null;
    state = const HomeConductorState();
    await ref.read(authControllerProvider.notifier).logout();
  }

  void limpiarError() {
    state = state.copyWith(errorMensaje: null);
  }

  /// Tras aceptar se sale de flota; al volver al home hay que reentrar
  /// o el backend deja de ofertar (sigue "EN LÍNEA" en UI sin GPS de flota).
  Future<void> reanudarFlotaSiEnLinea() async {
    if (!state.enLinea) {
      return;
    }
    final sesion = _sesionUsuario;
    if (sesion == null) {
      return;
    }
    await _configurarSocket(sesion);
    unawaited(_push?.iniciar());
    _iniciarPublicacionGpsFlota();
  }

  Future<void> _conectarSocketSesion(SesionUsuario sesion) async {
    final gateway = ref.read(viajeRealtimeGatewayProvider);
    await gateway.conectar();
    gateway.escucharNuevoViaje((viaje) {
      if (!state.enLinea && !state.cambiandoDisponibilidad) {
        return;
      }
      gateway.unirseAViaje(viaje.id);
      unawaited(OfertaViajeAlertaService.instancia.iniciarAlerta(viaje));
    });
    gateway.escucharOfertaCancelada((viajeId) {
      OfertaViajeAlertaService.instancia.avisarCancelacion(viajeId);
      gateway.salirDeViaje(viajeId);
      _quitarOferta(viajeId);
    });
    gateway.escucharViajeCancelado((viajeId) {
      OfertaViajeAlertaService.instancia.avisarCancelacion(viajeId);
      gateway.salirDeViaje(viajeId);
      _quitarOferta(viajeId);
      final paraRestaurar = state.viajeActivoParaRestaurar;
      if (paraRestaurar?.id == viajeId) {
        state = state.copyWith(
          viajeActivoParaRestaurar: null,
          errorMensaje: AppStrings.viajeCanceladoPorPasajero,
        );
      }
      ref.read(viajeCanceladoIdProvider.notifier).notificar(viajeId);
    });
    gateway.escucharEstadoConexion(
      onConnect: () {
        if (state.enLinea || state.cambiandoDisponibilidad) {
          gateway.identificarConductor(sesion.userId);
        }
      },
      onDisconnect: () {
        // Sigue logueado: el socket de sesión se reengancha; FCM cubre app cerrada.
      },
    );
  }

  Future<void> _configurarSocket(SesionUsuario sesion) async {
    final gateway = ref.read(viajeRealtimeGatewayProvider);
    await _conectarSocketSesion(sesion);
    gateway.identificarConductor(sesion.userId);
  }

  void _agregarOferta(Viaje viaje) {
    final existentes = List<OfertaEnCola>.from(state.ofertas);
    final indice = existentes.indexWhere((o) => o.viaje.id == viaje.id);
    if (indice >= 0) {
      existentes[indice] = OfertaEnCola(
        viaje: viaje,
        origenTexto: existentes[indice].origenTexto,
        destinoTexto: existentes[indice].destinoTexto,
      );
    } else {
      existentes.add(OfertaEnCola(viaje: viaje));
    }
    existentes.sort(
      (a, b) => b.viaje.tarifaEstimada.compareTo(a.viaje.tarifaEstimada),
    );
    state = state.copyWith(ofertas: existentes, errorMensaje: null);
    unawaited(_resolverEtiquetasOferta(viaje));
  }

  void _quitarOferta(String viajeId) {
    final quedan = state.ofertas
        .where((o) => o.viaje.id != viajeId)
        .toList(growable: false);
    if (quedan.length == state.ofertas.length) {
      return;
    }
    state = state.copyWith(ofertas: quedan);
    unawaited(_actualizarAlertaTrasQuitarOferta(viajeId, quedan));
  }

  Future<void> _actualizarAlertaTrasQuitarOferta(
    String viajeIdQuitado,
    List<OfertaEnCola> quedan,
  ) async {
    final alerta = OfertaViajeAlertaService.instancia;
    if (quedan.isEmpty) {
      await alerta.detener();
      return;
    }
    await alerta.detener(viajeId: viajeIdQuitado);
    await alerta.reanudarAlerta(quedan.first.viaje);
  }

  Future<void> _resolverEtiquetasOferta(Viaje viaje) async {
    try {
      final obtenerDireccion = ref.read(obtenerDireccionUseCaseProvider);

      String? origenTexto;
      final origenGuardado = viaje.origenDireccion;
      if (!AppStrings.esDireccionGenerica(origenGuardado)) {
        origenTexto = AppStrings.formatoOrigenTexto(origenGuardado!);
      } else {
        final origenResultado = await obtenerDireccion(
          ObtenerDireccionParams(
            latitud: viaje.origenLat,
            longitud: viaje.origenLng,
          ),
        ).timeout(const Duration(seconds: 6));
        origenTexto = origenResultado.fold(
          (_) => AppStrings.formatoOrigenCoords(
            viaje.origenLat,
            viaje.origenLng,
          ),
          AppStrings.formatoOrigenTexto,
        );
        await Future<void>.delayed(const Duration(milliseconds: 1100));
      }

      _actualizarTextosOferta(viaje.id, origenTexto: origenTexto);

      String? destinoTexto;
      final destinoGuardado = viaje.destinoDireccion;
      if (!AppStrings.esDireccionGenerica(destinoGuardado)) {
        destinoTexto = AppStrings.formatoDestinoTexto(destinoGuardado!);
      } else {
        final destinoResultado = await obtenerDireccion(
          ObtenerDireccionParams(
            latitud: viaje.destinoLat,
            longitud: viaje.destinoLng,
          ),
        ).timeout(const Duration(seconds: 6));
        destinoTexto = destinoResultado.fold(
          (_) => AppStrings.formatoDestinoCoords(
            viaje.destinoLat,
            viaje.destinoLng,
          ),
          AppStrings.formatoDestinoTexto,
        );
      }

      _actualizarTextosOferta(viaje.id, destinoTexto: destinoTexto);
    } catch (error, stack) {
      AppLogger.error(
        'HomeConductorController._resolverEtiquetasOferta',
        error,
        stack,
      );
      _actualizarTextosOferta(
        viaje.id,
        origenTexto: !AppStrings.esDireccionGenerica(viaje.origenDireccion)
            ? AppStrings.formatoOrigenTexto(viaje.origenDireccion!)
            : AppStrings.formatoOrigenCoords(viaje.origenLat, viaje.origenLng),
        destinoTexto: !AppStrings.esDireccionGenerica(viaje.destinoDireccion)
            ? AppStrings.formatoDestinoTexto(viaje.destinoDireccion!)
            : AppStrings.formatoDestinoCoords(
                viaje.destinoLat,
                viaje.destinoLng,
              ),
      );
    }
  }

  void _actualizarTextosOferta(
    String viajeId, {
    String? origenTexto,
    String? destinoTexto,
  }) {
    final indice = state.ofertas.indexWhere((o) => o.viaje.id == viajeId);
    if (indice < 0) {
      return;
    }
    final actualizadas = List<OfertaEnCola>.from(state.ofertas);
    actualizadas[indice] = actualizadas[indice].copyWith(
      origenTexto: origenTexto,
      destinoTexto: destinoTexto,
    );
    state = state.copyWith(ofertas: actualizadas);
  }
}

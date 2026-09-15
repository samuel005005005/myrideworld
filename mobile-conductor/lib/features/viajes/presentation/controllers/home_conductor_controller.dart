import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

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
      // También durante el cambio a Conectado (la oferta puede llegar antes de enLinea).
      if (!state.enLinea && !state.cambiandoDisponibilidad) {
        return;
      }
      _mostrarOferta(viaje);
    });
    _subCancelPush = alerta.cancelaciones.listen((viajeId) {
      final pendiente = state.viajePendiente;
      if (pendiente?.id == viajeId) {
        ref.read(viajeRealtimeGatewayProvider).salirDeViaje(viajeId);
        state = state.copyWith(
          viajePendiente: null,
          origenOfertaTexto: null,
          destinoOfertaTexto: null,
        );
      }
    });
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
    state = state.copyWith(
      cambiandoDisponibilidad: false,
      enLinea: false,
      viajePendiente: null,
      origenOfertaTexto: null,
      destinoOfertaTexto: null,
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

    state = state.copyWith(aceptandoViaje: true, errorMensaje: null);

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
          viajePendiente: null,
          origenOfertaTexto: null,
          destinoOfertaTexto: null,
          errorMensaje: failure.mensaje,
        );
        return null;
      },
      (viajeAceptado) {
        unawaited(
          OfertaViajeAlertaService.instancia.detener(viajeId: viaje.id),
        );
        unawaited(_detenerPublicacionGpsFlota());
        ref.read(viajeRealtimeGatewayProvider).unirseAViaje(viajeAceptado.id);
        state = state.copyWith(
          aceptandoViaje: false,
          viajePendiente: null,
          origenOfertaTexto: null,
          destinoOfertaTexto: null,
          errorMensaje: null,
        );
        return viajeAceptado;
      },
    );
  }

  Future<bool> rechazarViaje(Viaje viaje) async {
    state = state.copyWith(rechazandoViaje: true, errorMensaje: null);

    final resultado = await ref.read(rechazarViajeProvider)(
      RechazarViajeParams(viajeId: viaje.id),
    );

    // Siempre liberamos la oferta local: el conductor declinó.
    unawaited(OfertaViajeAlertaService.instancia.detener(viajeId: viaje.id));
    ref.read(viajeRealtimeGatewayProvider).salirDeViaje(viaje.id);
    state = state.copyWith(
      rechazandoViaje: false,
      viajePendiente: null,
      origenOfertaTexto: null,
      destinoOfertaTexto: null,
      errorMensaje: null,
    );

    return resultado.foldLogged(
      'HomeConductorController.rechazarViaje',
      (_) => true,
      (_) => true,
    );
  }

  Future<void> cerrarSesion() async {
    if (state.enLinea) {
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

  Future<void> _configurarSocket(SesionUsuario sesion) async {
    final gateway = ref.read(viajeRealtimeGatewayProvider);
    await gateway.conectar();
    gateway.escucharNuevoViaje((viaje) {
      if (!state.enLinea && !state.cambiandoDisponibilidad) {
        return;
      }
      unawaited(OfertaViajeAlertaService.instancia.iniciarAlerta(viaje));
    });
    gateway.escucharOfertaCancelada((viajeId) {
      OfertaViajeAlertaService.instancia.avisarCancelacion(viajeId);
      final pendiente = state.viajePendiente;
      if (pendiente?.id == viajeId) {
        gateway.salirDeViaje(viajeId);
        state = state.copyWith(
          viajePendiente: null,
          origenOfertaTexto: null,
          destinoOfertaTexto: null,
        );
      }
    });
    gateway.escucharViajeCancelado((viajeId) {
      OfertaViajeAlertaService.instancia.avisarCancelacion(viajeId);
      gateway.salirDeViaje(viajeId);
      final pendiente = state.viajePendiente;
      if (pendiente?.id == viajeId) {
        state = state.copyWith(
          viajePendiente: null,
          origenOfertaTexto: null,
          destinoOfertaTexto: null,
          errorMensaje: AppStrings.viajeCanceladoPorPasajero,
        );
      }
      final paraRestaurar = state.viajeActivoParaRestaurar;
      if (paraRestaurar?.id == viajeId) {
        state = state.copyWith(viajeActivoParaRestaurar: null);
      }
      ref.read(viajeCanceladoIdProvider.notifier).notificar(viajeId);
    });
    gateway.escucharEstadoConexion(
      onConnect: () {
        gateway.identificarConductor(sesion.userId);
      },
      onDisconnect: () {
        // Sigue en línea: FCM cubre app cerrada / sin socket.
      },
    );
    // Une a sala conductor_* y dispara oferta de pendientes en el backend.
    gateway.identificarConductor(sesion.userId);
  }

  void _mostrarOferta(Viaje viaje) {
    if (state.viajePendiente?.id == viaje.id &&
        state.origenOfertaTexto != null) {
      return;
    }
    state = state.copyWith(
      viajePendiente: viaje,
      origenOfertaTexto: null,
      destinoOfertaTexto: null,
      errorMensaje: null,
    );
    unawaited(_resolverEtiquetasOferta(viaje));
  }

  Future<void> _resolverEtiquetasOferta(Viaje viaje) async {
    try {
      final obtenerDireccion = ref.read(obtenerDireccionUseCaseProvider);

      final origenGuardado = viaje.origenDireccion;
      if (!AppStrings.esDireccionGenerica(origenGuardado)) {
        state = state.copyWith(
          origenOfertaTexto: AppStrings.formatoOrigenTexto(origenGuardado!),
        );
      } else {
        final origenResultado = await obtenerDireccion(
          ObtenerDireccionParams(
            latitud: viaje.origenLat,
            longitud: viaje.origenLng,
          ),
        ).timeout(const Duration(seconds: 6));
        if (state.viajePendiente?.id != viaje.id) {
          return;
        }
        state = state.copyWith(
          origenOfertaTexto: origenResultado.fold(
            (_) => AppStrings.formatoOrigenCoords(
              viaje.origenLat,
              viaje.origenLng,
            ),
            AppStrings.formatoOrigenTexto,
          ),
        );
        // Nominatim público: ~1 req/s.
        await Future<void>.delayed(const Duration(milliseconds: 1100));
        if (state.viajePendiente?.id != viaje.id) {
          return;
        }
      }

      final destinoGuardado = viaje.destinoDireccion;
      if (!AppStrings.esDireccionGenerica(destinoGuardado)) {
        state = state.copyWith(
          destinoOfertaTexto: AppStrings.formatoDestinoTexto(destinoGuardado!),
        );
        return;
      }

      final destinoResultado = await obtenerDireccion(
        ObtenerDireccionParams(
          latitud: viaje.destinoLat,
          longitud: viaje.destinoLng,
        ),
      ).timeout(const Duration(seconds: 6));
      if (state.viajePendiente?.id != viaje.id) {
        return;
      }
      state = state.copyWith(
        destinoOfertaTexto: destinoResultado.fold(
          (_) => AppStrings.formatoDestinoCoords(
            viaje.destinoLat,
            viaje.destinoLng,
          ),
          AppStrings.formatoDestinoTexto,
        ),
      );
    } catch (error, stack) {
      AppLogger.error(
        'HomeConductorController._resolverEtiquetasOferta',
        error,
        stack,
      );
      if (state.viajePendiente?.id != viaje.id) {
        return;
      }
      state = state.copyWith(
        origenOfertaTexto: state.origenOfertaTexto ??
            (!AppStrings.esDireccionGenerica(viaje.origenDireccion)
                ? AppStrings.formatoOrigenTexto(viaje.origenDireccion!)
                : AppStrings.formatoOrigenCoords(
                    viaje.origenLat,
                    viaje.origenLng,
                  )),
        destinoOfertaTexto: state.destinoOfertaTexto ??
            (!AppStrings.esDireccionGenerica(viaje.destinoDireccion)
                ? AppStrings.formatoDestinoTexto(viaje.destinoDireccion!)
                : AppStrings.formatoDestinoCoords(
                    viaje.destinoLat,
                    viaje.destinoLng,
                  )),
      );
    }
  }
}
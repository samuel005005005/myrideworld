import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/providers/core_providers.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/domain/entities/sesion_usuario.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../data/services/oferta_viaje_alerta_service.dart';
import '../../data/services/push_oferta_viaje_service.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/usecases/aceptar_viaje_params.dart';
import '../../domain/usecases/actualizar_disponibilidad_params.dart';
import '../../domain/usecases/rechazar_viaje_params.dart';
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

  @override
  HomeConductorState build() {
    ref.onDispose(() {
      _heartbeatGps?.cancel();
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

    await OfertaViajeAlertaService.instancia.inicializar();
    _push = PushOfertaViajeService(dio: ref.read(dioProvider));
    await _push!.iniciar();
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

    final activoResultado = await ref.read(obtenerViajeActivoProvider)(
      NoParams(),
    );
    activoResultado.fold(
      (_) {},
      (viajeActivo) {
        if (viajeActivo != null) {
          state = state.copyWith(viajeActivoParaRestaurar: viajeActivo);
        }
      },
    );

    state = state.copyWith(inicializando: false, enLinea: false);
  }

  void _escucharAlertasPush() {
    final alerta = OfertaViajeAlertaService.instancia;
    _subOfertasPush?.cancel();
    _subCancelPush?.cancel();
    _subOfertasPush = alerta.ofertas.listen((viaje) {
      if (!state.enLinea) {
        return;
      }
      state = state.copyWith(viajePendiente: viaje, errorMensaje: null);
    });
    _subCancelPush = alerta.cancelaciones.listen((viajeId) {
      final pendiente = state.viajePendiente;
      if (pendiente?.id == viajeId) {
        state = state.copyWith(viajePendiente: null);
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
      await _configurarSocket(sesion);
      await _push?.iniciar();
      _iniciarHeartbeatGps();
      state = state.copyWith(
        cambiandoDisponibilidad: false,
        enLinea: true,
        errorMensaje: null,
      );
      return;
    }

    _heartbeatGps?.cancel();
    _heartbeatGps = null;
    await OfertaViajeAlertaService.instancia.detener();
    ref.read(viajeRealtimeGatewayProvider).desconectar();
    state = state.copyWith(
      cambiandoDisponibilidad: false,
      enLinea: false,
      viajePendiente: null,
      errorMensaje: null,
    );
  }

  void _iniciarHeartbeatGps() {
    _heartbeatGps?.cancel();
    _heartbeatGps = Timer.periodic(const Duration(seconds: 20), (_) {
      unawaited(_enviarHeartbeatGps());
    });
    unawaited(_enviarHeartbeatGps());
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
        await ref.read(disponibilidadRepositoryProvider).actualizarUbicacion(
              latitud: coordenada.latitud,
              longitud: coordenada.longitud,
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
        state = state.copyWith(
          aceptandoViaje: false,
          errorMensaje: failure.mensaje,
        );
        return null;
      },
      (viajeAceptado) {
        unawaited(
          OfertaViajeAlertaService.instancia.detener(viajeId: viaje.id),
        );
        ref.read(viajeRealtimeGatewayProvider).unirseAViaje(viajeAceptado.id);
        state = state.copyWith(
          aceptandoViaje: false,
          viajePendiente: null,
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

    return resultado.foldLogged(
      'HomeConductorController.rechazarViaje',
      (failure) {
        state = state.copyWith(
          rechazandoViaje: false,
          errorMensaje: failure.mensaje,
        );
        return false;
      },
      (_) {
        unawaited(
          OfertaViajeAlertaService.instancia.detener(viajeId: viaje.id),
        );
        state = state.copyWith(
          rechazandoViaje: false,
          viajePendiente: null,
          errorMensaje: null,
        );
        return true;
      },
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
    gateway.escucharEstadoConexion(
      onConnect: () {
        gateway.identificarConductor(sesion.userId);
      },
      onDisconnect: () {
        // Sigue en línea: FCM cubre app cerrada / sin socket.
      },
    );
    gateway.escucharNuevoViaje((viaje) {
      if (!state.enLinea) {
        return;
      }
      unawaited(OfertaViajeAlertaService.instancia.iniciarAlerta(viaje));
      state = state.copyWith(
        viajePendiente: viaje,
        errorMensaje: null,
      );
    });
    gateway.escucharOfertaCancelada((viajeId) {
      OfertaViajeAlertaService.instancia.avisarCancelacion(viajeId);
      final pendiente = state.viajePendiente;
      if (pendiente?.id == viajeId) {
        state = state.copyWith(viajePendiente: null);
      }
    });
    gateway.identificarConductor(sesion.userId);
  }
}

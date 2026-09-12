import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/domain/entities/sesion_usuario.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
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

  @override
  HomeConductorState build() {
    ref.onDispose(() {
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

    final ubicacionResultado = await ref
        .read(ubicacionGatewayProvider)
        .obtenerUbicacionActual();

    ubicacionResultado.fold(
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

    final resultado = await ref.read(actualizarDisponibilidadProvider)(
      ActualizarDisponibilidadParams(disponible: disponible),
    );

    final ok = await resultado.fold(
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
      state = state.copyWith(
        cambiandoDisponibilidad: false,
        enLinea: true,
        errorMensaje: null,
      );
      return;
    }

    ref.read(viajeRealtimeGatewayProvider).desconectar();
    state = state.copyWith(
      cambiandoDisponibilidad: false,
      enLinea: false,
      viajePendiente: null,
      errorMensaje: null,
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

    return resultado.fold(
      (failure) {
        state = state.copyWith(
          aceptandoViaje: false,
          errorMensaje: failure.mensaje,
        );
        return null;
      },
      (viajeAceptado) {
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

    return resultado.fold(
      (failure) {
        state = state.copyWith(
          rechazandoViaje: false,
          errorMensaje: failure.mensaje,
        );
        return false;
      },
      (_) {
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
        if (state.enLinea) {
          state = state.copyWith(enLinea: false);
        }
      },
    );
    gateway.escucharNuevoViaje((viaje) {
      if (!state.enLinea) {
        return;
      }
      state = state.copyWith(
        viajePendiente: viaje,
        errorMensaje: null,
      );
    });
    gateway.identificarConductor(sesion.userId);
  }
}

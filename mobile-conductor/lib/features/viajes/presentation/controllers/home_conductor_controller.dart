import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../auth/domain/entities/sesion_usuario.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/usecases/aceptar_viaje_params.dart';
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
    await _configurarSocket(sesion);
    state = state.copyWith(inicializando: false, errorMensaje: null);
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

  void limpiarError() {
    state = state.copyWith(errorMensaje: null);
  }

  Future<void> _configurarSocket(SesionUsuario sesion) async {
    final gateway = ref.read(viajeRealtimeGatewayProvider);
    await gateway.conectar();
    gateway.identificarConductor(sesion.userId);
    gateway.escucharEstadoConexion(
      onConnect: () {
        state = state.copyWith(enLinea: true);
        gateway.identificarConductor(sesion.userId);
      },
      onDisconnect: () {
        state = state.copyWith(enLinea: false);
      },
    );
    gateway.escucharNuevoViaje((viaje) {
      state = state.copyWith(
        enLinea: true,
        viajePendiente: viaje,
        errorMensaje: null,
      );
    });
  }
}

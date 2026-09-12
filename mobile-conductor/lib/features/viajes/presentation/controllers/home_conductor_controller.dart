import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/constants/demo_credentials.dart';
import '../../../../core/services/socket_service.dart';
import '../../../auth/domain/entities/sesion_usuario.dart';
import '../../../auth/domain/usecases/iniciar_sesion_params.dart';
import '../../../auth/presentation/providers/auth_providers.dart';
import '../../data/mappers/viaje_mapper.dart';
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
    return const HomeConductorState();
  }

  Future<void> inicializar() async {
    if (_estaInicializado) {
      return;
    }

    _estaInicializado = true;
    state = state.copyWith(inicializando: true, errorMensaje: null);

    final iniciarSesion = ref.read(iniciarSesionProvider);
    final resultado = await iniciarSesion(
      const IniciarSesionParams(
        email: DemoCredentials.emailConductor,
        password: DemoCredentials.passwordConductor,
        rol: DemoCredentials.rolConductor,
      ),
    );

    SesionUsuario? sesionAutenticada;
    String? errorMensaje;

    resultado.fold(
      (failure) => errorMensaje = failure.mensaje,
      (sesion) => sesionAutenticada = sesion,
    );

    if (errorMensaje != null) {
      _estaInicializado = false;
      state = state.copyWith(
        inicializando: false,
        errorMensaje: errorMensaje,
      );
      return;
    }

    final sesion = sesionAutenticada;
    if (sesion == null) {
      _estaInicializado = false;
      state = state.copyWith(
        inicializando: false,
        errorMensaje: AppStrings.errorAutenticacion,
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
        ref.read(socketServiceProvider).unirseAViaje(viajeAceptado.id);
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
    final socketService = ref.read(socketServiceProvider);
    await socketService.conectar(token: sesion.token);
    socketService.identificarConductor(sesion.userId);
    socketService.escuchar('connect', (_) {
      state = state.copyWith(enLinea: true);
      socketService.identificarConductor(sesion.userId);
    });
    socketService.escuchar('disconnect', (_) {
      state = state.copyWith(enLinea: false);
    });
    socketService.escuchar('nuevoViajeDisponible', (data) {
      _procesarNuevoViaje(data);
    });
  }

  void _procesarNuevoViaje(dynamic data) {
    if (data is! Map) {
      return;
    }

    try {
      final viaje = ViajeMapper.toDomain(
        ViajeMapper.fromApiData(Map<String, dynamic>.from(data)),
      );
      state = state.copyWith(
        enLinea: true,
        viajePendiente: viaje,
        errorMensaje: null,
      );
    } catch (error) {
      state = state.copyWith(errorMensaje: error.toString());
    }
  }
}

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/roles.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/domain/entities/sesion_usuario.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../domain/usecases/actualizar_perfil_conductor_params.dart';
import '../providers/perfil_provider.dart';
import 'perfil_state.dart';
import 'perfil_state_status.dart';

final perfilControllerProvider =
    NotifierProvider<PerfilController, PerfilState>(PerfilController.new);

class PerfilController extends Notifier<PerfilState> {
  @override
  PerfilState build() {
    return const PerfilState(status: PerfilStateStatus.initial);
  }

  Future<void> cargar() async {
    state = state.copyWith(status: PerfilStateStatus.loading);
    final resultado = await ref.read(obtenerPerfilConductorProvider)(
      NoParams(),
    );

    resultado.fold(
      (failure) {
        state = state.copyWith(
          status: PerfilStateStatus.error,
          errorMessage: failure.mensaje,
        );
      },
      (perfil) {
        _sincronizarSesion(perfil.id, perfil.nombreCompleto, perfil.email);
        state = state.copyWith(
          status: PerfilStateStatus.ready,
          perfil: perfil,
          errorMessage: null,
        );
      },
    );
  }

  Future<bool> guardar({
    required String nombreCompleto,
    required String telefono,
    required String vehiculoMarca,
    required String vehiculoModelo,
    required String vehiculoColor,
    required String vehiculoPlaca,
  }) async {
    if (nombreCompleto.trim().isEmpty || telefono.trim().length < 8) {
      state = state.copyWith(
        status: PerfilStateStatus.error,
        errorMessage: 'Completa nombre y telefono (minimo 8 caracteres)',
      );
      return false;
    }

    state = state.copyWith(status: PerfilStateStatus.saving);
    final resultado = await ref.read(actualizarPerfilConductorProvider)(
      ActualizarPerfilConductorParams(
        nombreCompleto: nombreCompleto.trim(),
        telefono: telefono.trim(),
        vehiculoMarca: vehiculoMarca.trim(),
        vehiculoModelo: vehiculoModelo.trim(),
        vehiculoColor: vehiculoColor.trim(),
        vehiculoPlaca: vehiculoPlaca.trim(),
      ),
    );

    return resultado.fold(
      (failure) {
        state = state.copyWith(
          status: PerfilStateStatus.error,
          errorMessage: failure.mensaje,
        );
        return false;
      },
      (perfil) {
        _sincronizarSesion(perfil.id, perfil.nombreCompleto, perfil.email);
        state = state.copyWith(
          status: PerfilStateStatus.ready,
          perfil: perfil,
          guardadoOk: true,
          errorMessage: null,
        );
        return true;
      },
    );
  }

  void _sincronizarSesion(String id, String nombre, String email) {
    final actual = ref.read(authControllerProvider).asData?.value;
    ref.read(authControllerProvider.notifier).actualizarSesionLocal(
          SesionUsuario(
            userId: id,
            rol: actual?.rol ?? Roles.conductor.codigo,
            email: email,
            nombreCompleto: nombre,
          ),
        );
  }
}

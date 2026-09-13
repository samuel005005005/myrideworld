import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/roles.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/domain/entities/usuario.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../domain/usecases/actualizar_perfil_params.dart';
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

    final resultado = await ref.read(obtenerPerfilUseCaseProvider)(NoParams());

    resultado.fold(
      (failure) {
        state = state.copyWith(
          status: PerfilStateStatus.error,
          errorMessage: failure.mensaje,
        );
      },
      (perfil) {
        _refrescarAuth(perfil.id, perfil.nombreCompleto, perfil.email,
            perfil.telefono);
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
  }) async {
    final nombre = nombreCompleto.trim();
    final tel = telefono.trim();

    if (nombre.isEmpty || tel.length < 8) {
      state = state.copyWith(
        status: PerfilStateStatus.error,
        errorMessage: 'Completa nombre y telefono (minimo 8 caracteres)',
      );
      return false;
    }

    state = state.copyWith(status: PerfilStateStatus.saving);

    final resultado = await ref.read(actualizarPerfilUseCaseProvider)(
      ActualizarPerfilParams(nombreCompleto: nombre, telefono: tel),
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
        _refrescarAuth(
          perfil.id,
          perfil.nombreCompleto,
          perfil.email,
          perfil.telefono,
        );
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

  void _refrescarAuth(
    String id,
    String nombreCompleto,
    String email,
    String? telefono,
  ) {
    final actual = ref.read(authControllerProvider).asData?.value;
    ref.read(authControllerProvider.notifier).actualizarUsuarioLocal(
          Usuario(
            id: id,
            nombreCompleto: nombreCompleto,
            email: email,
            telefono: telefono,
            rol: actual?.rol ?? Roles.pasajero.codigo,
          ),
        );
  }
}

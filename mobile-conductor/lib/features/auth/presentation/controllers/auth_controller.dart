import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/auth/sesion_invalida_tick.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/sesion_usuario.dart';
import '../../domain/usecases/iniciar_sesion_params.dart';
import '../providers/auth_providers.dart';

final authControllerProvider =
    AsyncNotifierProvider<AuthController, SesionUsuario?>(AuthController.new);

class AuthController extends AsyncNotifier<SesionUsuario?> {
  @override
  Future<SesionUsuario?> build() async {
    ref.listen<int>(sesionInvalidaTickProvider, (anterior, siguiente) {
      if (anterior == siguiente) {
        return;
      }
      invalidarSesion();
    });

    final resultado = await ref.read(obtenerSesionProvider)(NoParams());
    return resultado.fold((_) => null, (sesion) => sesion);
  }

  Future<bool> login({
    required String email,
    required String password,
    required String rol,
  }) async {
    state = const AsyncLoading();
    final resultado = await ref.read(iniciarSesionProvider)(
      IniciarSesionParams(email: email, password: password, rol: rol),
    );

    return resultado.foldLogged(
      'AuthController.login',
      (failure) {
        state = AsyncError(failure.mensaje, StackTrace.current);
        return false;
      },
      (sesion) {
        state = AsyncData(sesion);
        return true;
      },
    );
  }

  Future<void> logout() async {
    await ref.read(logoutProvider)(NoParams());
    state = const AsyncData(null);
  }

  /// Limpia la sesión en memoria (p. ej. tras 401 / token vencido).
  void invalidarSesion() {
    if (state.asData?.value == null && !state.isLoading) {
      return;
    }
    state = const AsyncData(null);
  }

  void actualizarSesionLocal(SesionUsuario sesion) {
    state = AsyncData(sesion);
  }
}

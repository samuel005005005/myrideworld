import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/entities/usuario.dart';
import '../../domain/usecases/login_usecase.dart';
import '../providers/auth_provider.dart';

final authControllerProvider = AsyncNotifierProvider<AuthController, Usuario?>(
  AuthController.new,
);

class AuthController extends AsyncNotifier<Usuario?> {
  @override
  Future<Usuario?> build() async {
    // Al arrancar, podríamos verificar si hay token en caché
    return null;
  }

  Future<bool> login({
    required String email,
    required String password,
    required String rol,
  }) async {
    state = const AsyncLoading();

    final loginUseCase = ref.read(loginUseCaseProvider);
    final result = await loginUseCase(
      LoginParams(email: email, password: password, rol: rol),
    );

    return result.fold(
      (failure) {
        state = AsyncError(failure.mensaje, StackTrace.current);
        return false;
      },
      (usuario) {
        state = AsyncData(usuario);
        return true;
      },
    );
  }
}

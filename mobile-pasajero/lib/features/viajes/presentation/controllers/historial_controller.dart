import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/providers/core_providers.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../domain/entities/viaje.dart';
import '../providers/viajes_provider.dart';

final historialControllerProvider =
    AsyncNotifierProvider<HistorialController, List<Viaje>>(
      HistorialController.new,
    );

class HistorialController extends AsyncNotifier<List<Viaje>> {
  @override
  Future<List<Viaje>> build() async {
    final usuario = ref.watch(authControllerProvider).asData?.value;
    if (usuario == null) {
      return const <Viaje>[];
    }

    final token = await ref.read(sessionStorageProvider).obtenerToken();
    if (token == null || token.trim().isEmpty) {
      return const <Viaje>[];
    }

    return _cargar();
  }

  Future<void> refrescar() async {
    final usuario = ref.read(authControllerProvider).asData?.value;
    final token = await ref.read(sessionStorageProvider).obtenerToken();
    if (usuario == null || token == null || token.trim().isEmpty) {
      state = const AsyncData(<Viaje>[]);
      return;
    }

    state = const AsyncLoading();
    state = await AsyncValue.guard(_cargar);
  }

  Future<List<Viaje>> _cargar() async {
    final resultado = await ref.read(listarMisViajesUseCaseProvider)(
      NoParams(),
    );
    return resultado.foldLogged(
      'HistorialController.build',
      (failure) => throw failure.mensaje,
      (lista) => lista,
    );
  }
}

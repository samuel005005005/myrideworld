import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/logging/resultado_logging.dart';
import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/viaje.dart';
import '../providers/viajes_provider.dart';

final historialControllerProvider =
    AsyncNotifierProvider<HistorialController, List<Viaje>>(
      HistorialController.new,
    );

class HistorialController extends AsyncNotifier<List<Viaje>> {
  @override
  Future<List<Viaje>> build() async {
    final resultado = await ref.read(listarMisViajesUseCaseProvider)(
      NoParams(),
    );
    return resultado.foldLogged(
      'HistorialController.build',
      (failure) => throw failure.mensaje,
      (lista) => lista,
    );
  }

  Future<void> refrescar() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final resultado = await ref.read(listarMisViajesUseCaseProvider)(
        NoParams(),
      );
      return resultado.foldLogged(
        'HistorialController.refrescar',
        (failure) => throw failure.mensaje,
        (lista) => lista,
      );
    });
  }
}

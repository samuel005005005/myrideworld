import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/contacto_soporte.dart';
import '../providers/soporte_provider.dart';

final ayudaControllerProvider =
    AsyncNotifierProvider<AyudaController, ContactoSoporte>(AyudaController.new);

class AyudaController extends AsyncNotifier<ContactoSoporte> {
  @override
  Future<ContactoSoporte> build() async {
    final resultado = await ref.read(obtenerContactoSoporteUseCaseProvider)(
      NoParams(),
    );
    return resultado.fold((failure) => throw failure.mensaje, (c) => c);
  }

  Future<void> refrescar() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final resultado = await ref.read(obtenerContactoSoporteUseCaseProvider)(
        NoParams(),
      );
      return resultado.fold((failure) => throw failure.mensaje, (c) => c);
    });
  }
}

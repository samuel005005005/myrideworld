import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/pago_balance.dart';
import '../providers/balances_provider.dart';

final balancesControllerProvider =
    AsyncNotifierProvider<BalancesController, List<PagoBalance>>(
      BalancesController.new,
    );

class BalancesController extends AsyncNotifier<List<PagoBalance>> {
  @override
  Future<List<PagoBalance>> build() async {
    final resultado = await ref.read(listarMisBalancesProvider)(NoParams());
    return resultado.fold((failure) => throw failure.mensaje, (lista) => lista);
  }

  Future<void> refrescar() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final resultado = await ref.read(listarMisBalancesProvider)(NoParams());
      return resultado.fold(
        (failure) => throw failure.mensaje,
        (lista) => lista,
      );
    });
  }
}

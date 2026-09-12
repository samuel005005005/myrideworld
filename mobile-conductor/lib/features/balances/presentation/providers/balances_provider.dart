import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/providers/core_providers.dart';
import '../../data/datasources/balance_remote_datasource.dart';
import '../../data/repositories/balance_repository_impl.dart';
import '../../domain/repositories/balance_repository.dart';
import '../../domain/usecases/listar_mis_balances.dart';
import '../../domain/usecases/obtener_pago_por_viaje.dart';

final balanceRemoteDataSourceProvider = Provider<BalanceRemoteDataSource>((
  ref,
) {
  return BalanceRemoteDataSource(dio: ref.watch(dioProvider));
});

final balanceRepositoryProvider = Provider<BalanceRepository>((ref) {
  return BalanceRepositoryImpl(
    remoteDataSource: ref.watch(balanceRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final listarMisBalancesProvider = Provider<ListarMisBalances>((ref) {
  return ListarMisBalances(ref.watch(balanceRepositoryProvider));
});

final obtenerPagoPorViajeProvider = Provider<ObtenerPagoPorViaje>((ref) {
  return ObtenerPagoPorViaje(ref.watch(balanceRepositoryProvider));
});

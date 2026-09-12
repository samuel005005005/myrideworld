import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/providers/core_providers.dart';
import '../../data/datasources/viaje_remote_datasource.dart';
import '../../data/repositories/viaje_repository_impl.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../../domain/usecases/solicitar_viaje_usecase.dart';

// === Data Sources ===
final viajeRemoteDataSourceProvider = Provider<ViajeRemoteDataSource>((ref) {
  return ViajeRemoteDataSourceImpl(dio: ref.watch(dioProvider));
});

// === Repository ===
final viajeRepositoryProvider = Provider<ViajeRepository>((ref) {
  return ViajeRepositoryImpl(
    remoteDataSource: ref.watch(viajeRemoteDataSourceProvider),
  );
});

// === Use Cases ===
final solicitarViajeUseCaseProvider = Provider<SolicitarViajeUseCase>((ref) {
  return SolicitarViajeUseCase(ref.watch(viajeRepositoryProvider));
});

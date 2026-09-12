import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/providers/core_providers.dart';
import '../../data/datasources/routing_remote_datasource.dart';
import '../../data/datasources/viaje_remote_datasource.dart';
import '../../data/repositories/routing_repository_impl.dart';
import '../../data/repositories/viaje_repository_impl.dart';
import '../../domain/repositories/routing_repository.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../../domain/usecases/obtener_ruta_usecase.dart';
import '../../domain/usecases/solicitar_viaje_usecase.dart';

// === Data Sources ===
final viajeRemoteDataSourceProvider = Provider<ViajeRemoteDataSource>((ref) {
  return ViajeRemoteDataSourceImpl(dio: ref.watch(dioProvider));
});

final routingRemoteDataSourceProvider = Provider<RoutingRemoteDataSource>((
  ref,
) {
  return RoutingRemoteDataSourceImpl(dio: ref.watch(routingDioProvider));
});

// === Repository ===
final viajeRepositoryProvider = Provider<ViajeRepository>((ref) {
  return ViajeRepositoryImpl(
    remoteDataSource: ref.watch(viajeRemoteDataSourceProvider),
  );
});

final routingRepositoryProvider = Provider<RoutingRepository>((ref) {
  return RoutingRepositoryImpl(
    remoteDataSource: ref.watch(routingRemoteDataSourceProvider),
  );
});

// === Use Cases ===
final solicitarViajeUseCaseProvider = Provider<SolicitarViajeUseCase>((ref) {
  return SolicitarViajeUseCase(ref.watch(viajeRepositoryProvider));
});

final obtenerRutaUseCaseProvider = Provider<ObtenerRutaUseCase>((ref) {
  return ObtenerRutaUseCase(ref.watch(routingRepositoryProvider));
});

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/providers/core_providers.dart';
import '../../data/datasources/routing_remote_datasource.dart';
import '../../data/datasources/viaje_remote_datasource.dart';
import '../../data/datasources/viaje_socket_datasource.dart';
import '../../data/repositories/routing_repository_impl.dart';
import '../../data/repositories/viaje_repository_impl.dart';
import '../../domain/repositories/routing_repository.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../../domain/usecases/obtener_ruta_usecase.dart';
import '../../domain/usecases/solicitar_viaje_usecase.dart';

final viajeRemoteDataSourceProvider = Provider<ViajeRemoteDataSource>((ref) {
  return ViajeRemoteDataSourceImpl(
    dio: ref.watch(dioProvider),
    sessionStorage: ref.watch(sessionStorageProvider),
  );
});

final routingRemoteDataSourceProvider = Provider<RoutingRemoteDataSource>((
  ref,
) {
  return RoutingRemoteDataSourceImpl(dio: ref.watch(routingDioProvider));
});

final viajeRealtimeGatewayProvider = Provider<ViajeRealtimeGateway>((ref) {
  return ViajeSocketDataSource(
    sessionStorage: ref.watch(sessionStorageProvider),
  );
});

final viajeRepositoryProvider = Provider<ViajeRepository>((ref) {
  return ViajeRepositoryImpl(
    remoteDataSource: ref.watch(viajeRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final routingRepositoryProvider = Provider<RoutingRepository>((ref) {
  return RoutingRepositoryImpl(
    remoteDataSource: ref.watch(routingRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final solicitarViajeUseCaseProvider = Provider<SolicitarViajeUseCase>((ref) {
  return SolicitarViajeUseCase(ref.watch(viajeRepositoryProvider));
});

final obtenerRutaUseCaseProvider = Provider<ObtenerRutaUseCase>((ref) {
  return ObtenerRutaUseCase(ref.watch(routingRepositoryProvider));
});

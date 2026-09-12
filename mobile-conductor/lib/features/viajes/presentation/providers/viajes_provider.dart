import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/providers/core_providers.dart';
import '../../data/datasources/viaje_remote_datasource.dart';
import '../../data/datasources/viaje_socket_datasource.dart';
import '../../data/repositories/viaje_repository_impl.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../../domain/usecases/aceptar_viaje.dart';
import '../../domain/usecases/completar_viaje.dart';
import '../../domain/usecases/iniciar_viaje.dart';
import '../../domain/usecases/marcar_llegada.dart';

final viajeRemoteDataSourceProvider = Provider<ViajeRemoteDataSource>((ref) {
  return ViajeRemoteDataSource(dio: ref.watch(dioProvider));
});

final viajeRealtimeGatewayProvider = Provider<ViajeRealtimeGateway>((ref) {
  return ViajeSocketDataSource(
    sessionStorage: ref.watch(sessionStorageProvider),
    socketUrl: ref.watch(socketBaseUrlProvider),
  );
});

final viajeRepositoryProvider = Provider<ViajeRepository>((ref) {
  return ViajeRepositoryImpl(
    remoteDataSource: ref.watch(viajeRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final aceptarViajeProvider = Provider<AceptarViaje>((ref) {
  return AceptarViaje(ref.watch(viajeRepositoryProvider));
});

final marcarLlegadaProvider = Provider<MarcarLlegada>((ref) {
  return MarcarLlegada(ref.watch(viajeRepositoryProvider));
});

final iniciarViajeProvider = Provider<IniciarViaje>((ref) {
  return IniciarViaje(ref.watch(viajeRepositoryProvider));
});

final completarViajeProvider = Provider<CompletarViaje>((ref) {
  return CompletarViaje(ref.watch(viajeRepositoryProvider));
});

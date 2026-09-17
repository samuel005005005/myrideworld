import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/auth/sesion_invalida_tick.dart';
import '../../../../core/providers/core_providers.dart';
import '../../data/datasources/flota_remote_datasource.dart';
import '../../data/datasources/geocoding_remote_datasource.dart';
import '../../data/datasources/geolocator_ubicacion_gateway.dart';
import '../../data/datasources/routing_remote_datasource.dart';
import '../../data/datasources/tarifa_remote_datasource.dart';
import '../../data/datasources/viaje_remote_datasource.dart';
import '../../data/datasources/viaje_socket_datasource.dart';
import '../../data/repositories/flota_repository_impl.dart';
import '../../data/repositories/geocoding_repository_impl.dart';
import '../../data/repositories/routing_repository_impl.dart';
import '../../data/repositories/tarifa_repository_impl.dart';
import '../../data/repositories/viaje_repository_impl.dart';
import '../../domain/repositories/flota_repository.dart';
import '../../domain/repositories/geocoding_repository.dart';
import '../../domain/repositories/routing_repository.dart';
import '../../domain/repositories/tarifa_repository.dart';
import '../../domain/repositories/ubicacion_gateway.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../../domain/usecases/cancelar_viaje_usecase.dart';
import '../../domain/usecases/estimar_tarifa_usecase.dart';
import '../../domain/usecases/listar_mis_viajes_usecase.dart';
import '../../domain/usecases/obtener_conductores_cercanos_usecase.dart';
import '../../domain/usecases/obtener_direccion_usecase.dart';
import '../../domain/usecases/obtener_ruta_usecase.dart';
import '../../domain/usecases/obtener_viaje_activo_usecase.dart';
import '../../domain/usecases/obtener_viaje_por_id_usecase.dart';
import '../../domain/usecases/solicitar_viaje_usecase.dart';

final viajeRemoteDataSourceProvider = Provider<ViajeRemoteDataSource>((ref) {
  return ViajeRemoteDataSourceImpl(
    dio: ref.watch(dioProvider),
    sessionStorage: ref.watch(sessionStorageProvider),
  );
});

final flotaRemoteDataSourceProvider = Provider<FlotaRemoteDataSource>((ref) {
  return FlotaRemoteDataSourceImpl(dio: ref.watch(dioProvider));
});

final tarifaRemoteDataSourceProvider = Provider<TarifaRemoteDataSource>((ref) {
  return TarifaRemoteDataSourceImpl(dio: ref.watch(dioProvider));
});

final routingRemoteDataSourceProvider = Provider<RoutingRemoteDataSource>((
  ref,
) {
  return RoutingRemoteDataSourceImpl(dio: ref.watch(routingDioProvider));
});

final viajeRealtimeGatewayProvider = Provider<ViajeRealtimeGateway>((ref) {
  final gateway = ViajeSocketDataSource(
    sessionStorage: ref.watch(sessionStorageProvider),
  );
  gateway.escucharSesionReemplazada((_) async {
    gateway.desconectar();
    await ref.read(sessionStorageProvider).limpiar();
    ref.read(sesionInvalidaTickProvider.notifier).notificar();
  });
  return gateway;
});

final ubicacionGatewayProvider = Provider<UbicacionGateway>((ref) {
  return GeolocatorUbicacionGateway();
});

final viajeRepositoryProvider = Provider<ViajeRepository>((ref) {
  return ViajeRepositoryImpl(
    remoteDataSource: ref.watch(viajeRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final flotaRepositoryProvider = Provider<FlotaRepository>((ref) {
  return FlotaRepositoryImpl(
    remoteDataSource: ref.watch(flotaRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final tarifaRepositoryProvider = Provider<TarifaRepository>((ref) {
  return TarifaRepositoryImpl(
    remoteDataSource: ref.watch(tarifaRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final routingRepositoryProvider = Provider<RoutingRepository>((ref) {
  return RoutingRepositoryImpl(
    remoteDataSource: ref.watch(routingRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final geocodingRemoteDataSourceProvider = Provider<GeocodingRemoteDataSource>((
  ref,
) {
  return GeocodingRemoteDataSource(dio: ref.watch(geocodingDioProvider));
});

final geocodingRepositoryProvider = Provider<GeocodingRepository>((ref) {
  return GeocodingRepositoryImpl(
    remoteDataSource: ref.watch(geocodingRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final obtenerDireccionUseCaseProvider = Provider<ObtenerDireccionUseCase>((
  ref,
) {
  return ObtenerDireccionUseCase(ref.watch(geocodingRepositoryProvider));
});

final solicitarViajeUseCaseProvider = Provider<SolicitarViajeUseCase>((ref) {
  return SolicitarViajeUseCase(ref.watch(viajeRepositoryProvider));
});

final obtenerRutaUseCaseProvider = Provider<ObtenerRutaUseCase>((ref) {
  return ObtenerRutaUseCase(ref.watch(routingRepositoryProvider));
});

final estimarTarifaUseCaseProvider = Provider<EstimarTarifaUseCase>((ref) {
  return EstimarTarifaUseCase(ref.watch(tarifaRepositoryProvider));
});

final listarMisViajesUseCaseProvider = Provider<ListarMisViajesUseCase>((ref) {
  return ListarMisViajesUseCase(ref.watch(viajeRepositoryProvider));
});

final obtenerViajePorIdUseCaseProvider = Provider<ObtenerViajePorIdUseCase>((
  ref,
) {
  return ObtenerViajePorIdUseCase(ref.watch(viajeRepositoryProvider));
});

final obtenerViajeActivoUseCaseProvider = Provider<ObtenerViajeActivoUseCase>((
  ref,
) {
  return ObtenerViajeActivoUseCase(ref.watch(viajeRepositoryProvider));
});

final obtenerConductoresCercanosUseCaseProvider =
    Provider<ObtenerConductoresCercanosUseCase>((ref) {
  return ObtenerConductoresCercanosUseCase(ref.watch(flotaRepositoryProvider));
});

final cancelarViajeUseCaseProvider = Provider<CancelarViajeUseCase>((ref) {
  return CancelarViajeUseCase(ref.watch(viajeRepositoryProvider));
});

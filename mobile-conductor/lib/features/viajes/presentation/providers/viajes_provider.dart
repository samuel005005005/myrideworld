import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/providers/core_providers.dart';
import '../../data/datasources/geolocator_ubicacion_gateway.dart';
import '../../data/datasources/viaje_remote_datasource.dart';
import '../../data/datasources/viaje_socket_datasource.dart';
import '../../data/repositories/viaje_repository_impl.dart';
import '../../domain/repositories/ubicacion_gateway.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
import '../../domain/repositories/viaje_repository.dart';
import '../../domain/usecases/aceptar_viaje.dart';
import '../../domain/usecases/actualizar_disponibilidad.dart';
import '../../domain/usecases/completar_viaje.dart';
import '../../domain/usecases/iniciar_viaje.dart';
import '../../domain/usecases/listar_mis_viajes.dart';
import '../../domain/usecases/marcar_llegada.dart';
import '../../domain/usecases/obtener_viaje_activo.dart';
import '../../domain/usecases/rechazar_viaje.dart';
import '../../domain/repositories/disponibilidad_repository.dart';
import '../../data/repositories/disponibilidad_repository_impl.dart';

final viajeRemoteDataSourceProvider = Provider<ViajeRemoteDataSource>((ref) {
  return ViajeRemoteDataSource(dio: ref.watch(dioProvider));
});

final viajeRealtimeGatewayProvider = Provider<ViajeRealtimeGateway>((ref) {
  return ViajeSocketDataSource(
    sessionStorage: ref.watch(sessionStorageProvider),
    socketUrl: ref.watch(socketBaseUrlProvider),
  );
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

final disponibilidadRepositoryProvider = Provider<DisponibilidadRepository>((
  ref,
) {
  return DisponibilidadRepositoryImpl(
    remoteDataSource: ref.watch(viajeRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final aceptarViajeProvider = Provider<AceptarViaje>((ref) {
  return AceptarViaje(ref.watch(viajeRepositoryProvider));
});

final rechazarViajeProvider = Provider<RechazarViaje>((ref) {
  return RechazarViaje(ref.watch(viajeRepositoryProvider));
});

final actualizarDisponibilidadProvider = Provider<ActualizarDisponibilidad>((
  ref,
) {
  return ActualizarDisponibilidad(ref.watch(disponibilidadRepositoryProvider));
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

final obtenerViajeActivoProvider = Provider<ObtenerViajeActivo>((ref) {
  return ObtenerViajeActivo(ref.watch(viajeRepositoryProvider));
});

final listarMisViajesProvider = Provider<ListarMisViajes>((ref) {
  return ListarMisViajes(ref.watch(viajeRepositoryProvider));
});

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/providers/core_providers.dart';
import '../../data/datasources/perfil_remote_datasource.dart';
import '../../data/repositories/perfil_repository_impl.dart';
import '../../domain/repositories/perfil_repository.dart';
import '../../domain/usecases/actualizar_perfil_conductor.dart';
import '../../domain/usecases/obtener_perfil_conductor.dart';

final perfilRemoteDataSourceProvider = Provider<PerfilRemoteDataSource>((ref) {
  return PerfilRemoteDataSource(dio: ref.watch(dioProvider));
});

final perfilRepositoryProvider = Provider<PerfilRepository>((ref) {
  return PerfilRepositoryImpl(
    remoteDataSource: ref.watch(perfilRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
    sessionStorage: ref.watch(sessionStorageProvider),
  );
});

final obtenerPerfilConductorProvider = Provider<ObtenerPerfilConductor>((ref) {
  return ObtenerPerfilConductor(ref.watch(perfilRepositoryProvider));
});

final actualizarPerfilConductorProvider = Provider<ActualizarPerfilConductor>((
  ref,
) {
  return ActualizarPerfilConductor(ref.watch(perfilRepositoryProvider));
});

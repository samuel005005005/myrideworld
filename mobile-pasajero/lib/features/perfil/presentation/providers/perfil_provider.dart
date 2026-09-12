import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/providers/core_providers.dart';
import '../../data/datasources/perfil_remote_datasource.dart';
import '../../data/repositories/perfil_repository_impl.dart';
import '../../domain/repositories/perfil_repository.dart';
import '../../domain/usecases/actualizar_perfil_usecase.dart';
import '../../domain/usecases/obtener_perfil_usecase.dart';

final perfilRemoteDataSourceProvider = Provider<PerfilRemoteDataSource>((ref) {
  return PerfilRemoteDataSourceImpl(dio: ref.watch(dioProvider));
});

final perfilRepositoryProvider = Provider<PerfilRepository>((ref) {
  return PerfilRepositoryImpl(
    remoteDataSource: ref.watch(perfilRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
    sessionStorage: ref.watch(sessionStorageProvider),
  );
});

final obtenerPerfilUseCaseProvider = Provider<ObtenerPerfilUseCase>((ref) {
  return ObtenerPerfilUseCase(ref.watch(perfilRepositoryProvider));
});

final actualizarPerfilUseCaseProvider = Provider<ActualizarPerfilUseCase>((
  ref,
) {
  return ActualizarPerfilUseCase(ref.watch(perfilRepositoryProvider));
});

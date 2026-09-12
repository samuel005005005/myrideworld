import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/providers/core_providers.dart';
import '../../data/datasources/soporte_remote_datasource.dart';
import '../../data/repositories/soporte_repository_impl.dart';
import '../../domain/repositories/soporte_repository.dart';
import '../../domain/usecases/obtener_contacto_soporte_usecase.dart';

final soporteRemoteDataSourceProvider = Provider<SoporteRemoteDataSource>((ref) {
  return SoporteRemoteDataSource(dio: ref.watch(dioProvider));
});

final soporteRepositoryProvider = Provider<SoporteRepository>((ref) {
  return SoporteRepositoryImpl(
    remoteDataSource: ref.watch(soporteRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

final obtenerContactoSoporteUseCaseProvider =
    Provider<ObtenerContactoSoporteUseCase>((ref) {
      return ObtenerContactoSoporteUseCase(ref.watch(soporteRepositoryProvider));
    });

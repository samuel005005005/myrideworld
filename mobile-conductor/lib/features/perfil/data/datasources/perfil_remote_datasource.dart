import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/perfil_conductor.dart';
import '../mappers/perfil_conductor_mapper.dart';

class PerfilRemoteDataSource {
  final Dio dio;

  PerfilRemoteDataSource({required this.dio});

  Future<PerfilConductor> obtenerPerfil() async {
    try {
      final response = await dio.get(ApiEndpoints.perfilConductor);
      return PerfilConductorMapper.fromJson(
        Map<String, dynamic>.from(response.data as Map),
      );
    } on DioException catch (e) {
      throw _mapear(e);
    } catch (_) {
      throw const AppException(AppStrings.errorPerfilObtener);
    }
  }

  Future<PerfilConductor> actualizarPerfil({
    required String nombreCompleto,
    required String telefono,
    required String vehiculoMarca,
    required String vehiculoModelo,
    required String vehiculoColor,
    required String vehiculoPlaca,
  }) async {
    try {
      final response = await dio.patch(
        ApiEndpoints.perfilConductor,
        data: {
          'nombreCompleto': nombreCompleto,
          'telefono': telefono,
          'vehiculoMarca': vehiculoMarca,
          'vehiculoModelo': vehiculoModelo,
          'vehiculoColor': vehiculoColor,
          'vehiculoPlaca': vehiculoPlaca,
        },
      );
      return PerfilConductorMapper.fromJson(
        Map<String, dynamic>.from(response.data as Map),
      );
    } on DioException catch (e) {
      throw _mapear(e);
    } catch (_) {
      throw const AppException(AppStrings.errorPerfilActualizar);
    }
  }

  AppException _mapear(DioException e) {
    final data = e.response?.data;
    if (data is Map && data['message'] != null) {
      final message = data['message'];
      return AppException(
        message is List ? message.first.toString() : message.toString(),
      );
    }
    return const AppException(AppStrings.errorConexionServidor);
  }
}

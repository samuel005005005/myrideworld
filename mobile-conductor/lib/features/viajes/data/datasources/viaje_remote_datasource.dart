import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../mappers/viaje_mapper.dart';
import '../models/viaje_model.dart';

class ViajeRemoteDataSource {
  final Dio dio;

  ViajeRemoteDataSource({required this.dio});

  Future<ViajeModel> aceptarViaje({
    required String viajeId,
    required String conductorId,
  }) async {
    return _ejecutarMutacion(
      endpoint: ApiEndpoints.aceptarViaje(viajeId),
      data: {'conductorId': conductorId},
      mensajeError: AppStrings.errorAceptarViaje,
    );
  }

  Future<ViajeModel> marcarLlegada(String viajeId) async {
    return _ejecutarMutacion(
      endpoint: ApiEndpoints.marcarLlegada(viajeId),
      data: const <String, dynamic>{},
      mensajeError: AppStrings.errorMarcarLlegada,
    );
  }

  Future<ViajeModel> iniciarViaje(String viajeId) async {
    return _ejecutarMutacion(
      endpoint: ApiEndpoints.iniciarViaje(viajeId),
      data: const <String, dynamic>{},
      mensajeError: AppStrings.errorIniciarViaje,
    );
  }

  Future<ViajeModel> completarViaje(String viajeId) async {
    return _ejecutarMutacion(
      endpoint: ApiEndpoints.completarViaje(viajeId),
      data: const <String, dynamic>{},
      mensajeError: AppStrings.errorCompletarViaje,
    );
  }

  Future<ViajeModel> _ejecutarMutacion({
    required String endpoint,
    required Map<String, dynamic> data,
    required String mensajeError,
  }) async {
    try {
      final respuesta = await dio.post(endpoint, data: data);
      return ViajeMapper.fromApiData(
        Map<String, dynamic>.from(respuesta.data as Map),
      );
    } on DioException catch (error) {
      final data = error.response?.data;
      if (data is Map && data['message'] != null) {
        final mensaje = data['message'];
        throw AppException(
          mensaje is List ? mensaje.first.toString() : mensaje.toString(),
        );
      }
      throw AppException(mensajeError);
    } on AppException {
      rethrow;
    } catch (_) {
      throw AppException(mensajeError);
    }
  }
}

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

  Future<ViajeModel> rechazarViaje(String viajeId) async {
    return _ejecutarMutacion(
      endpoint: ApiEndpoints.rechazarViaje(viajeId),
      data: const <String, dynamic>{},
      mensajeError: AppStrings.errorRechazarViaje,
    );
  }

  Future<ViajeModel?> obtenerViajeActivo() async {
    try {
      final respuesta = await dio.get(ApiEndpoints.viajeActivo);
      if (respuesta.data == null) {
        return null;
      }
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
      throw const AppException(AppStrings.errorViajeActivo);
    } on AppException {
      rethrow;
    } catch (_) {
      throw const AppException(AppStrings.errorViajeActivo);
    }
  }

  Future<List<ViajeModel>> listarMisViajes() async {
    try {
      final respuesta = await dio.get(ApiEndpoints.misViajes);
      final data = respuesta.data;
      if (data is! List) {
        throw const AppException(AppStrings.errorHistorial);
      }
      return data
          .map(
            (item) => ViajeMapper.fromApiData(
              Map<String, dynamic>.from(item as Map),
            ),
          )
          .toList();
    } on DioException catch (error) {
      final data = error.response?.data;
      if (data is Map && data['message'] != null) {
        final mensaje = data['message'];
        throw AppException(
          mensaje is List ? mensaje.first.toString() : mensaje.toString(),
        );
      }
      throw const AppException(AppStrings.errorHistorial);
    } on AppException {
      rethrow;
    } catch (_) {
      throw const AppException(AppStrings.errorHistorial);
    }
  }

  Future<void> actualizarDisponibilidad({
    required bool disponible,
    double? latitud,
    double? longitud,
  }) async {
    try {
      final data = <String, dynamic>{
        'estadoDisponibilidad': disponible ? 'Conectado' : 'Desconectado',
      };
      if (disponible && latitud != null && longitud != null) {
        data['lat'] = latitud;
        data['lng'] = longitud;
      }
      await dio.patch(ApiEndpoints.disponibilidadConductor, data: data);
    } on DioException catch (error) {
      final data = error.response?.data;
      if (data is Map && data['message'] != null) {
        final mensaje = data['message'];
        throw AppException(
          mensaje is List ? mensaje.first.toString() : mensaje.toString(),
        );
      }
      throw const AppException(AppStrings.errorDisponibilidad);
    } on AppException {
      rethrow;
    } catch (_) {
      throw const AppException(AppStrings.errorDisponibilidad);
    }
  }

  Future<void> actualizarUbicacionConductor({
    required double latitud,
    required double longitud,
  }) async {
    try {
      await dio.patch(
        ApiEndpoints.ubicacionConductor,
        data: {'lat': latitud, 'lng': longitud},
      );
    } on DioException catch (error) {
      final data = error.response?.data;
      if (data is Map && data['message'] != null) {
        final mensaje = data['message'];
        throw AppException(
          mensaje is List ? mensaje.first.toString() : mensaje.toString(),
        );
      }
      throw const AppException(AppStrings.errorGpsObtener);
    } on AppException {
      rethrow;
    } catch (_) {
      throw const AppException(AppStrings.errorGpsObtener);
    }
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

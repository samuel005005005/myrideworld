import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/logging/app_logger.dart';
import '../../../../core/storage/session_storage.dart';
import '../mappers/viaje_mapper.dart';
import '../models/viaje_model.dart';

abstract class ViajeRemoteDataSource {
  Future<ViajeModel> solicitarViaje({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
    required String origenDireccion,
    required String destinoDireccion,
    required String idempotencyKey,
  });

  Future<List<ViajeModel>> listarMisViajes();

  Future<ViajeModel> obtenerViajePorId(String viajeId);

  Future<ViajeModel?> obtenerViajeActivo();

  Future<ViajeModel> cancelarViaje({
    required String viajeId,
    String? motivo,
  });
}

class ViajeRemoteDataSourceImpl implements ViajeRemoteDataSource {
  final Dio dio;
  final SessionStorage sessionStorage;

  ViajeRemoteDataSourceImpl({
    required this.dio,
    required this.sessionStorage,
  });

  @override
  Future<ViajeModel> solicitarViaje({
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
    required String origenDireccion,
    required String destinoDireccion,
    required String idempotencyKey,
  }) async {
    try {
      final pasajeroId = await sessionStorage.obtenerUsuarioId();

      if (pasajeroId == null) {
        throw ServerException(AppStrings.errorNoSession);
      }

      final response = await dio.post(
        ApiEndpoints.solicitarViaje,
        options: Options(headers: {'Idempotency-Key': idempotencyKey}),
        data: {
          'pasajeroId': pasajeroId,
          'origenLat': origenLat,
          'origenLng': origenLng,
          'destinoLat': destinoLat,
          'destinoLng': destinoLng,
          'origenDireccion': origenDireccion,
          'destinoDireccion': destinoDireccion,
        },
      );

      return ViajeMapper.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _excepcionDesdeDio(e, AppStrings.errorTripRequest);
    } on ServerException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('ViajeRemoteDataSourceImpl.solicitarViaje', e, stack);
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }

  @override
  Future<List<ViajeModel>> listarMisViajes() async {
    try {
      await _exigirToken();
      final response = await dio.get(ApiEndpoints.misViajes);
      final data = response.data;
      if (data is! List) {
        throw ServerException(AppStrings.errorHistorial);
      }
      return data
          .map(
            (item) => ViajeMapper.fromJson(
              Map<String, dynamic>.from(item as Map),
            ),
          )
          .toList();
    } on DioException catch (e) {
      throw _excepcionDesdeDio(e, AppStrings.errorHistorial);
    } on ServerException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('ViajeRemoteDataSourceImpl.listarMisViajes', e, stack);
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }

  @override
  Future<ViajeModel> obtenerViajePorId(String viajeId) async {
    try {
      await _exigirToken();
      final response = await dio.get(ApiEndpoints.viajePorId(viajeId));
      return ViajeMapper.fromJson(
        Map<String, dynamic>.from(response.data as Map),
      );
    } on DioException catch (e) {
      throw _excepcionDesdeDio(e, AppStrings.errorViajeDetalle);
    } on ServerException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('ViajeRemoteDataSourceImpl.obtenerViajePorId', e, stack);
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }

  @override
  Future<ViajeModel?> obtenerViajeActivo() async {
    try {
      await _exigirToken();
      final response = await dio.get(ApiEndpoints.viajeActivo);
      final data = response.data;
      if (data == null || data == '' || data == 'null') {
        return null;
      }
      if (data is! Map) {
        return null;
      }
      return ViajeMapper.fromJson(Map<String, dynamic>.from(data));
    } on DioException catch (e) {
      throw _excepcionDesdeDio(e, AppStrings.errorViajeActivo);
    } on ServerException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('ViajeRemoteDataSourceImpl.obtenerViajeActivo', e, stack);
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }

  @override
  Future<ViajeModel> cancelarViaje({
    required String viajeId,
    String? motivo,
  }) async {
    try {
      await _exigirToken();
      final response = await dio.post(
        ApiEndpoints.cancelarViaje(viajeId),
        data: {?motivo: motivo},
      );
      return ViajeMapper.fromJson(
        Map<String, dynamic>.from(response.data as Map),
      );
    } on DioException catch (e) {
      throw _excepcionDesdeDio(e, AppStrings.errorCancelarViaje);
    } on ServerException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('ViajeRemoteDataSourceImpl.cancelarViaje', e, stack);
      throw ServerException('${AppStrings.errorUnexpected}$e');
    }
  }

  Future<void> _exigirToken() async {
    final token = (await sessionStorage.obtenerToken())?.trim();
    if (token == null || token.isEmpty) {
      throw ServerException(AppStrings.errorNoSession);
    }
  }

  Never _excepcionDesdeDio(DioException e, String fallback) {
    if (e.type == DioExceptionType.cancel) {
      final motivo = e.error;
      throw ServerException(
        motivo is String && motivo.trim().isNotEmpty
            ? motivo
            : AppStrings.errorNoSession,
      );
    }
    if (e.response != null && e.response?.data != null) {
      final message = e.response?.data['message'] ?? fallback;
      throw ServerException(
        message is List ? message.first.toString() : message.toString(),
      );
    }
    throw ServerException(AppStrings.errorServerConnection);
  }
}

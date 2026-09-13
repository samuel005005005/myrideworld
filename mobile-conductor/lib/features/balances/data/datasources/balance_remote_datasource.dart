import 'package:dio/dio.dart';

import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/logging/app_logger.dart';
import '../../domain/entities/pago_balance.dart';
import '../mappers/pago_balance_mapper.dart';

class BalanceRemoteDataSource {
  final Dio dio;

  BalanceRemoteDataSource({required this.dio});

  Future<List<PagoBalance>> listarMisBalances() async {
    try {
      final response = await dio.get(ApiEndpoints.misBalances);
      final data = response.data;
      if (data is! List) {
        return const [];
      }
      return data
          .whereType<Map>()
          .map(
            (item) => PagoBalanceMapper.fromJson(
              Map<String, dynamic>.from(item),
            ),
          )
          .toList();
    } on DioException catch (e) {
      throw _mapear(e, AppStrings.errorBalances);
    } on AppException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('BalanceRemoteDataSource.listarMisBalances', e, stack);
      throw const AppException(AppStrings.errorBalances);
    }
  }

  Future<PagoBalance> obtenerPorViaje(String viajeId) async {
    try {
      final response = await dio.get(ApiEndpoints.pagoPorViaje(viajeId));
      return PagoBalanceMapper.fromJson(
        Map<String, dynamic>.from(response.data as Map),
      );
    } on DioException catch (e) {
      throw _mapear(e, AppStrings.errorBalances);
    } on AppException {
      rethrow;
    } catch (e, stack) {
      AppLogger.error('BalanceRemoteDataSource.obtenerPorViaje', e, stack);
      throw const AppException(AppStrings.errorBalances);
    }
  }

  AppException _mapear(DioException e, String fallback) {
    final data = e.response?.data;
    if (data is Map && data['message'] != null) {
      final message = data['message'];
      return AppException(
        message is List ? message.first.toString() : message.toString(),
      );
    }
    return AppException(fallback);
  }
}

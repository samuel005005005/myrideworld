import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

import '../auth/sesion_invalida_tick.dart';
import '../auth/validador_jwt.dart';
import '../config/app_env.dart';
import '../logging/app_logger.dart';
import '../network/http_logging_interceptor.dart';
import '../network/network_info.dart';
import '../network/network_info_impl.dart';
import '../storage/secure_session_storage.dart';
import '../storage/session_storage.dart';

final sessionStorageProvider = Provider<SessionStorage>((ref) {
  return SecureSessionStorage();
});

final networkInfoProvider = Provider<NetworkInfo>((ref) {
  return NetworkInfoImpl(Connectivity());
});

final apiBaseUrlProvider = Provider<String>((ref) => AppEnv.apiBaseUrl);

final socketBaseUrlProvider = Provider<String>((ref) => AppEnv.socketUrl);

final dioProvider = Provider<Dio>((ref) {
  final sessionStorage = ref.watch(sessionStorageProvider);
  final baseUrl = ref.watch(apiBaseUrlProvider);
  AppLogger.info(
    'Dio',
    'API_BASE_URL=$baseUrl SOCKET_URL=${ref.watch(socketBaseUrlProvider)}',
  );

  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: const {'Content-Type': 'application/json'},
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await sessionStorage.obtenerToken();
        if (token != null && token.isNotEmpty) {
          if (!ValidadorJwt.tieneFormatoValido(token) ||
              ValidadorJwt.estaVencido(token)) {
            await sessionStorage.limpiar();
            Future(() {
              ref.read(sesionInvalidaTickProvider.notifier).notificar();
            });
            return handler.reject(
              DioException(
                requestOptions: options,
                type: DioExceptionType.cancel,
                error: 'Sesion vencida o token invalido',
              ),
            );
          }
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        final status = error.response?.statusCode;
        final path = error.requestOptions.path;
        final esLogin = path.contains('/auth/login');
        if (status == 401 && !esLogin) {
          await sessionStorage.limpiar();
          Future(() {
            ref.read(sesionInvalidaTickProvider.notifier).notificar();
          });
        }
        handler.next(error);
      },
    ),
  );

  if (kDebugMode) {
    dio.interceptors.add(HttpLoggingInterceptor());
  }

  return dio;
});

final routingDioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: AppEnv.osrmBaseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: const {'Content-Type': 'application/json'},
    ),
  );

  if (kDebugMode) {
    dio.interceptors.add(HttpLoggingInterceptor());
  }

  return dio;
});

final geocodingDioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: AppEnv.nominatimBaseUrl,
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 5),
      headers: const {
        'Accept': 'application/json',
        'User-Agent': 'MyRideConductor/1.0 (contacto: dev@myride.local)',
      },
    ),
  );

  if (kDebugMode) {
    dio.interceptors.add(HttpLoggingInterceptor());
  }

  return dio;
});

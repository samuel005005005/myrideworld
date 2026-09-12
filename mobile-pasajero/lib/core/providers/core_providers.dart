import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../constants/env_keys.dart';

/// Cliente HTTP global apuntando al Backend de MyRide
final dioProvider = Provider<Dio>((ref) {
  // Obtenemos la IP base desde .env o fallback por defecto.
  final baseUrl = dotenv.env[EnvKeys.apiBaseUrl] ?? 'http://10.0.2.2:3000';

  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  // Agregamos el interceptor para ver los logs de las peticiones HTTP
  dio.interceptors.add(
    LogInterceptor(
      request: true,
      requestHeader: true,
      requestBody: true,
      responseHeader: true,
      responseBody: true,
      error: true,
    ),
  );

  // Interceptor para inyectar el Token JWT
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('jwt_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ),
  );

  return dio;
});

/// Cliente HTTP dedicado al proveedor de rutas OSRM
final routingDioProvider = Provider<Dio>((ref) {
  final baseUrl =
      dotenv.env[EnvKeys.osrmBaseUrl] ?? 'https://router.project-osrm.org';

  return Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ),
  );
});

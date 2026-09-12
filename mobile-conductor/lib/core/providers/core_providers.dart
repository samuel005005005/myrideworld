import 'dart:io' show Platform;

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

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

final apiBaseUrlProvider = Provider<String>((ref) {
  return dotenv.env['API_BASE_URL'] ??
      (Platform.isAndroid
          ? 'http://10.0.2.2:3000/api'
          : 'http://127.0.0.1:3000/api');
});

final socketBaseUrlProvider = Provider<String>((ref) {
  final apiBaseUrl = ref.watch(apiBaseUrlProvider);
  return dotenv.env['SOCKET_URL'] ??
      apiBaseUrl.replaceFirst(RegExp(r'/api/?$'), '');
});

final dioProvider = Provider<Dio>((ref) {
  final sessionStorage = ref.watch(sessionStorageProvider);

  final dio = Dio(
    BaseOptions(
      baseUrl: ref.watch(apiBaseUrlProvider),
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: const {'Content-Type': 'application/json'},
    ),
  );

  if (kDebugMode) {
    dio.interceptors.add(
      LogInterceptor(
        request: true,
        requestHeader: false,
        requestBody: false,
        responseHeader: false,
        responseBody: false,
        error: true,
      ),
    );
  }

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await sessionStorage.obtenerToken();
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          await sessionStorage.limpiar();
        }
        handler.next(error);
      },
    ),
  );

  return dio;
});

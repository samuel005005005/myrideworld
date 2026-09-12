import 'dart:io' show Platform;

import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final apiBaseUrlProvider = Provider<String>((ref) {
  return dotenv.env['API_BASE_URL'] ??
      (Platform.isAndroid
          ? 'http://10.0.2.2:3000/api'
          : 'http://127.0.0.1:3000/api');
});

final socketBaseUrlProvider = Provider<String>((ref) {
  final apiBaseUrl = ref.watch(apiBaseUrlProvider);
  return dotenv.env['SOCKET_URL'] ?? apiBaseUrl.replaceFirst(RegExp(r'/api/?$'), '');
});

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: ref.watch(apiBaseUrlProvider),
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: const {'Content-Type': 'application/json'},
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final preferencias = await SharedPreferences.getInstance();
        final token = preferencias.getString('jwt_token');
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        options.headers['Bypass-Tunnel-Reminder'] = 'true';
        handler.next(options);
      },
    ),
  );

  return dio;
});

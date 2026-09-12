import 'dart:convert';
import 'dart:io' show Platform;
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});

class ApiService {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl:
          dotenv.env['API_BASE_URL'] ??
          (Platform.isAndroid
              ? 'http://10.0.2.2:3000/api'
              : 'http://127.0.0.1:3000/api'),
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ),
  );

  String? _jwtToken;

  ApiService() {
    _initInterceptor();
    _loadToken();
  }

  void _initInterceptor() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_jwtToken != null) {
            options.headers['Authorization'] = 'Bearer $_jwtToken';
          }
          // Header necesario para evadir la pantalla de advertencia de localtunnel
          options.headers['Bypass-Tunnel-Reminder'] = 'true';
          return handler.next(options);
        },
      ),
    );
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _jwtToken = prefs.getString('jwt_token');
  }

  Future<void> login(String email, String password, String rol) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {'email': email, 'password': password, 'rol': rol},
      );

      final token = response.data['token'];
      if (token != null) {
        _jwtToken = token;
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('jwt_token', token);
      }
    } catch (e) {
      print('Error al iniciar sesión: $e');
      rethrow;
    }
  }

  Future<String> solicitarViaje({
    required String
    pasajeroId, // In a real app, backend can extract this from JWT
    required double origenLat,
    required double origenLng,
    required double destinoLat,
    required double destinoLng,
  }) async {
    try {
      final response = await _dio.post(
        '/viajes',
        data: {
          'pasajeroId': pasajeroId,
          'origenLat': origenLat,
          'origenLng': origenLng,
          'destinoLat': destinoLat,
          'destinoLng': destinoLng,
        },
      );

      return response.data['id']; // Returns the UUID of the requested trip
    } catch (e) {
      print('Error al solicitar viaje: $e');
      rethrow;
    }
  }

  String? get currentToken => _jwtToken;

  String? get currentUserId {
    if (_jwtToken == null) return null;
    try {
      final parts = _jwtToken!.split('.');
      if (parts.length != 3) return null;
      var payload = parts[1];
      // Normalize base64
      while (payload.length % 4 != 0) {
        payload += '=';
      }
      final decoded = utf8.decode(base64Url.decode(payload));
      final payloadMap = json.decode(decoded);
      return payloadMap['sub'] as String?;
    } catch (e) {
      print('Error decoding JWT: $e');
      return null;
    }
  }
}

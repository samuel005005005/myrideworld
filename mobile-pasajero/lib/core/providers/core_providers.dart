import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Cliente HTTP global apuntando al Backend de MyRide
final dioProvider = Provider<Dio>((ref) {
  // Ajusta esta IP si estás probando en dispositivo físico (por ejemplo, IP de la PC en tu red local).
  // 10.0.2.2 es para el emulador de Android apuntando al localhost de la PC.
  const baseUrl = 'http://10.0.2.2:3000';
  
  final dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {'Content-Type': 'application/json'},
  ));
  
  return dio;
});

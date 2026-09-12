import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../features/auth/domain/entities/sesion_usuario.dart';
import 'session_storage.dart';

class SecureSessionStorage implements SessionStorage {
  static const _claveToken = 'jwt_token';
  static const _claveSesion = 'sesion_conductor';

  final FlutterSecureStorage _storage;

  SecureSessionStorage({FlutterSecureStorage? storage})
    : _storage = storage ?? const FlutterSecureStorage();

  @override
  Future<void> guardarSesion({
    required String token,
    required SesionUsuario sesion,
  }) async {
    await _storage.write(key: _claveToken, value: token);
    await _storage.write(
      key: _claveSesion,
      value: jsonEncode({'userId': sesion.userId, 'rol': sesion.rol}),
    );
  }

  @override
  Future<String?> obtenerToken() => _storage.read(key: _claveToken);

  @override
  Future<SesionUsuario?> obtenerSesion() async {
    final raw = await _storage.read(key: _claveSesion);
    if (raw == null || raw.isEmpty) {
      return null;
    }

    final map = jsonDecode(raw) as Map<String, dynamic>;
    final userId = map['userId'] as String?;
    if (userId == null || userId.isEmpty) {
      return null;
    }

    return SesionUsuario(userId: userId, rol: map['rol'] as String? ?? '');
  }

  @override
  Future<void> limpiar() async {
    await _storage.delete(key: _claveToken);
    await _storage.delete(key: _claveSesion);
  }
}

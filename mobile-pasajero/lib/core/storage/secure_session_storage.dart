import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../features/auth/domain/entities/usuario.dart';
import 'session_storage.dart';

class SecureSessionStorage implements SessionStorage {
  static const _claveToken = 'jwt_token';
  static const _claveUsuario = 'usuario_sesion';

  final FlutterSecureStorage _storage;

  SecureSessionStorage({FlutterSecureStorage? storage})
    : _storage = storage ?? const FlutterSecureStorage();

  @override
  Future<void> guardarSesion({
    required String token,
    required Usuario usuario,
  }) async {
    await _storage.write(key: _claveToken, value: token);
    await _storage.write(
      key: _claveUsuario,
      value: jsonEncode({
        'id': usuario.id,
        'nombreCompleto': usuario.nombreCompleto,
        'email': usuario.email,
        'telefono': usuario.telefono,
        'rol': usuario.rol,
      }),
    );
  }

  @override
  Future<String?> obtenerToken() {
    return _storage.read(key: _claveToken);
  }

  @override
  Future<Usuario?> obtenerUsuario() async {
    final raw = await _storage.read(key: _claveUsuario);
    if (raw == null || raw.isEmpty) {
      return null;
    }

    final map = jsonDecode(raw) as Map<String, dynamic>;
    return Usuario(
      id: map['id'] as String,
      nombreCompleto: map['nombreCompleto'] as String,
      email: map['email'] as String,
      telefono: map['telefono'] as String?,
      rol: map['rol'] as String,
    );
  }

  @override
  Future<String?> obtenerUsuarioId() async {
    final usuario = await obtenerUsuario();
    return usuario?.id;
  }

  @override
  Future<void> actualizarUsuario(Usuario usuario) async {
    await _storage.write(
      key: _claveUsuario,
      value: jsonEncode({
        'id': usuario.id,
        'nombreCompleto': usuario.nombreCompleto,
        'email': usuario.email,
        'telefono': usuario.telefono,
        'rol': usuario.rol,
      }),
    );
  }

  @override
  Future<void> limpiar() async {
    await _storage.delete(key: _claveToken);
    await _storage.delete(key: _claveUsuario);
  }
}

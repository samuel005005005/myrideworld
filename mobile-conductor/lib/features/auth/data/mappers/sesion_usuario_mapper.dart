import 'dart:convert';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/sesion_usuario.dart';
import '../models/sesion_usuario_model.dart';

class SesionUsuarioMapper {
  static SesionUsuarioModel fromApiResponse(Map<String, dynamic> respuesta) {
    final token = respuesta['token'] ?? respuesta['access_token'];
    if (token is! String || token.isEmpty) {
      throw const AppException(AppStrings.errorRespuestaLogin);
    }

    final payload = _decodificarPayload(token);
    return SesionUsuarioModel(
      token: token,
      userId: payload['sub'] as String?,
      rol: payload['rol'] as String?,
    );
  }

  static SesionUsuario toDomain(SesionUsuarioModel modelo) {
    if (modelo.userId == null || modelo.userId!.isEmpty) {
      throw const AppException(AppStrings.errorTokenInvalido);
    }

    return SesionUsuario(
      userId: modelo.userId!,
      rol: modelo.rol ?? '',
    );
  }

  static Map<String, dynamic> _decodificarPayload(String token) {
    try {
      final partes = token.split('.');
      if (partes.length != 3) {
        throw const AppException(AppStrings.errorTokenInvalido);
      }

      var payload = partes[1];
      while (payload.length % 4 != 0) {
        payload += '=';
      }

      final texto = utf8.decode(base64Url.decode(payload));
      return Map<String, dynamic>.from(json.decode(texto) as Map);
    } catch (_) {
      throw const AppException(AppStrings.errorTokenInvalido);
    }
  }
}

import 'dart:convert';

import 'package:flutter/foundation.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import '../models/credenciales_auth_model.dart';
import '../models/usuario_model.dart';

class UsuarioMapper {
  /// Parsea la respuesta real del backend: `{ token, nombreCompleto? }`.
  /// El id y rol salen del JWT (`sub`, `rol`).
  static CredencialesAuthModel fromApiResponse(
    Map<String, dynamic> json, {
    required String email,
    required String rolSolicitado,
  }) {
    final token = json['token'] ?? json['access_token'];
    if (token is! String || token.isEmpty) {
      throw ServerException(AppStrings.errorRespuestaLogin);
    }

    final payload = _decodificarPayload(token);
    final id = payload['sub'];
    if (id is! String || id.isEmpty) {
      throw ServerException(AppStrings.errorTokenInvalido);
    }

    final rol = payload['rol'] as String? ?? rolSolicitado;
    final nombreCompleto =
        json['nombreCompleto'] as String? ??
        payload['nombreCompleto'] as String? ??
        email;

    return CredencialesAuthModel(
      accessToken: token,
      usuario: UsuarioModel(
        id: id,
        nombreCompleto: nombreCompleto,
        email: email,
        telefono: json['telefono'] as String?,
        rol: rol,
      ),
    );
  }

  static Map<String, dynamic> toJson(CredencialesAuthModel credenciales) {
    final usuario = credenciales.usuario;
    return {
      'token': credenciales.accessToken,
      'user': {
        'id': usuario.id,
        'nombreCompleto': usuario.nombreCompleto,
        'email': usuario.email,
        'telefono': usuario.telefono,
        'rol': usuario.rol,
      },
    };
  }

  static Map<String, dynamic> _decodificarPayload(String token) {
    try {
      final partes = token.split('.');
      if (partes.length != 3) {
        throw ServerException(AppStrings.errorTokenInvalido);
      }

      var payload = partes[1];
      while (payload.length % 4 != 0) {
        payload += '=';
      }

      final texto = utf8.decode(base64Url.decode(payload));
      return Map<String, dynamic>.from(json.decode(texto) as Map);
    } on ServerException {
      rethrow;
    } catch (error, stack) {
      if (kDebugMode) {
        debugPrint('[MyRide Auth] JWT inválido: $error\n$stack');
      }
      throw ServerException(AppStrings.errorTokenInvalido);
    }
  }
}

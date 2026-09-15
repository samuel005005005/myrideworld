import 'dart:convert';

/// Utilidad pura para inspeccionar JWT (sin verificar firma).
class ValidadorJwt {
  const ValidadorJwt._();

  static bool tieneFormatoValido(String token) {
    final partes = token.split('.');
    return partes.length == 3 && partes.every((p) => p.isNotEmpty);
  }

  static bool estaVencido(String token) {
    final payload = decodificarPayload(token);
    if (payload == null) {
      return true;
    }
    final exp = payload['exp'];
    if (exp is! num) {
      return false;
    }
    final vencimiento = DateTime.fromMillisecondsSinceEpoch(
      exp.toInt() * 1000,
      isUtc: true,
    );
    return DateTime.now().toUtc().isAfter(vencimiento);
  }

  static Map<String, dynamic>? decodificarPayload(String token) {
    try {
      if (!tieneFormatoValido(token)) {
        return null;
      }
      var payload = token.split('.')[1];
      while (payload.length % 4 != 0) {
        payload += '=';
      }
      final texto = utf8.decode(base64Url.decode(payload));
      final decoded = json.decode(texto);
      if (decoded is! Map) {
        return null;
      }
      return Map<String, dynamic>.from(decoded);
    } catch (_) {
      return null;
    }
  }
}

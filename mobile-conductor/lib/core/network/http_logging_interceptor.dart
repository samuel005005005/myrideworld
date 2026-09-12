import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

/// Interceptor de debug: imprime request/response/error completos en consola.
class HttpLoggingInterceptor extends Interceptor {
  static const String _prefijo = '[MyRide HTTP]';

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (kDebugMode) {
      final buffer = StringBuffer()
        ..writeln('$_prefijo → ${options.method} ${options.uri}')
        ..writeln('headers: ${_encabezadosSeguros(options.headers)}');
      if (options.queryParameters.isNotEmpty) {
        buffer.writeln('query: ${options.queryParameters}');
      }
      if (options.data != null) {
        buffer.writeln('body: ${_serializar(options.data)}');
      }
      _imprimir(buffer.toString());
    }
    handler.next(options);
  }

  @override
  void onResponse(Response<dynamic> response, ResponseInterceptorHandler handler) {
    if (kDebugMode) {
      final buffer = StringBuffer()
        ..writeln(
          '$_prefijo ← ${response.statusCode} ${response.requestOptions.method} '
          '${response.requestOptions.uri}',
        )
        ..writeln('body: ${_serializar(response.data)}');
      _imprimir(buffer.toString());
    }
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (kDebugMode) {
      final buffer = StringBuffer()
        ..writeln(
          '$_prefijo ✗ ${err.response?.statusCode ?? 'sin-status'} '
          '${err.requestOptions.method} ${err.requestOptions.uri}',
        )
        ..writeln('type: ${err.type}')
        ..writeln('message: ${err.message}');
      if (err.response?.data != null) {
        buffer.writeln('body: ${_serializar(err.response?.data)}');
      }
      _imprimir(buffer.toString());
    }
    handler.next(err);
  }

  void _imprimir(String mensaje) {
    for (final linea in mensaje.split('\n')) {
      if (linea.isNotEmpty) {
        debugPrint(linea);
      }
    }
  }

  Map<String, dynamic> _encabezadosSeguros(Map<String, dynamic> headers) {
    final copia = Map<String, dynamic>.from(headers);
    final auth = copia['Authorization'] ?? copia['authorization'];
    if (auth is String && auth.isNotEmpty) {
      copia['Authorization'] = _enmascararBearer(auth);
      copia.remove('authorization');
    }
    return copia;
  }

  String _enmascararBearer(String valor) {
    if (!valor.startsWith('Bearer ') || valor.length < 20) {
      return 'Bearer ***';
    }
    final token = valor.substring(7);
    if (token.length <= 12) {
      return 'Bearer ***';
    }
    return 'Bearer ${token.substring(0, 6)}…${token.substring(token.length - 4)}';
  }

  String _serializar(Object? data) {
    if (data == null) {
      return 'null';
    }
    if (data is FormData) {
      final campos = data.fields.map((e) => '${e.key}=${e.value}').join(', ');
      final archivos = data.files.map((e) => e.key).join(', ');
      return 'FormData(fields: [$campos], files: [$archivos])';
    }
    if (data is String) {
      try {
        return const JsonEncoder.withIndent('  ').convert(jsonDecode(data));
      } catch (_) {
        return data;
      }
    }
    try {
      return const JsonEncoder.withIndent('  ').convert(data);
    } catch (_) {
      return data.toString();
    }
  }
}

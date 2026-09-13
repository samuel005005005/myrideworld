import 'package:flutter/foundation.dart';

/// Logger de diagnóstico (solo en debug). Prefijo estable para filtrar en terminal.
class AppLogger {
  const AppLogger._();

  static const String _prefijo = '[MyRide]';

  static void info(String contexto, String mensaje) {
    if (!kDebugMode) return;
    _imprimir('I', contexto, mensaje);
  }

  static void warning(
    String contexto,
    String mensaje, [
    StackTrace? stack,
  ]) {
    if (!kDebugMode) return;
    _imprimir('W', contexto, mensaje);
    if (stack != null) {
      _imprimirStack(stack);
    }
  }

  /// Errores de negocio/técnicos atrapados (repos, datasources, controllers).
  static void error(
    String contexto,
    Object error, [
    StackTrace? stack,
  ]) {
    if (!kDebugMode) return;
    _imprimir('E', contexto, error.toString());
    if (stack != null) {
      _imprimirStack(stack);
    }
  }

  static void _imprimir(String nivel, String contexto, String mensaje) {
    debugPrint('$_prefijo $nivel/$contexto — $mensaje');
  }

  static void _imprimirStack(StackTrace stack) {
    final lineas = stack.toString().split('\n').take(12);
    for (final linea in lineas) {
      if (linea.trim().isNotEmpty) {
        debugPrint('$_prefijo   $linea');
      }
    }
  }
}

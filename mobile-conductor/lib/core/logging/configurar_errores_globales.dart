import 'dart:async';

import 'package:flutter/foundation.dart';

import 'app_logger.dart';

/// Registra errores de framework y zona asíncrona en la terminal (debug).
void configurarManejadoresErroresGlobales() {
  FlutterError.onError = (details) {
    AppLogger.error(
      'FlutterError',
      details.exceptionAsString(),
      details.stack,
    );
    if (kDebugMode) {
      FlutterError.presentError(details);
    }
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    AppLogger.error('PlatformDispatcher', error, stack);
    return true;
  };
}

/// Ejecuta [app] dentro de una zona que loguea errores no capturados.
void ejecutarAppConZonaErrores(FutureOr<void> Function() app) {
  runZonedGuarded(
    () async {
      configurarManejadoresErroresGlobales();
      await app();
    },
    (error, stack) {
      AppLogger.error('ZonaNoCapturada', error, stack);
    },
  );
}

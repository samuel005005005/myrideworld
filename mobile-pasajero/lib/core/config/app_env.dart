import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';

import '../constants/env_keys.dart';

/// Configuración de entorno sin empaquetar `.env` en el binario.
///
/// Preferí `--dart-define` / `--dart-define-from-file=.env` en run/build.
/// En debug, si no hay defines, usa defaults locales (emulador/simulador).
class AppEnv {
  const AppEnv._();

  static String get apiBaseUrl {
    const defined = String.fromEnvironment(EnvKeys.apiBaseUrl);
    if (defined.isNotEmpty) {
      return defined;
    }
    if (kReleaseMode) {
      throw StateError(
        'Falta ${EnvKeys.apiBaseUrl}. Usá --dart-define o --dart-define-from-file=.env',
      );
    }
    return Platform.isAndroid
        ? 'http://10.0.2.2:3000'
        : 'http://127.0.0.1:3000';
  }

  static String get socketUrl {
    const defined = String.fromEnvironment(EnvKeys.socketUrl);
    if (defined.isNotEmpty) {
      return defined;
    }
    if (kReleaseMode) {
      throw StateError(
        'Falta ${EnvKeys.socketUrl}. Usá --dart-define o --dart-define-from-file=.env',
      );
    }
    return apiBaseUrl;
  }

  static String get osrmBaseUrl {
    const defined = String.fromEnvironment(EnvKeys.osrmBaseUrl);
    if (defined.isNotEmpty) {
      return defined;
    }
    return 'https://router.project-osrm.org';
  }
}

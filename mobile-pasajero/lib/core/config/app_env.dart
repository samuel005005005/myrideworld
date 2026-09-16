import '../constants/env_keys.dart';

/// Configuración de entorno sin empaquetar `.env` en el binario.
///
/// Obligatorio: `--dart-define` / `--dart-define-from-file=.env` en run/build.
class AppEnv {
  const AppEnv._();

  static String get apiBaseUrl {
    const defined = String.fromEnvironment(EnvKeys.apiBaseUrl);
    if (defined.isEmpty) {
      throw StateError(
        'Falta ${EnvKeys.apiBaseUrl}. Usá --dart-define o --dart-define-from-file=.env',
      );
    }
    return defined;
  }

  static String get socketUrl {
    const defined = String.fromEnvironment(EnvKeys.socketUrl);
    if (defined.isEmpty) {
      throw StateError(
        'Falta ${EnvKeys.socketUrl}. Usá --dart-define o --dart-define-from-file=.env',
      );
    }
    return defined;
  }

  static String get osrmBaseUrl {
    const defined = String.fromEnvironment(EnvKeys.osrmBaseUrl);
    if (defined.isEmpty) {
      throw StateError(
        'Falta ${EnvKeys.osrmBaseUrl}. Usá --dart-define o --dart-define-from-file=.env',
      );
    }
    return defined;
  }

  static String get nominatimBaseUrl {
    const defined = String.fromEnvironment(EnvKeys.nominatimBaseUrl);
    if (defined.isEmpty) {
      return 'https://nominatim.openstreetmap.org';
    }
    return defined;
  }
}

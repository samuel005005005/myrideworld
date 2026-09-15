import 'package:url_launcher/url_launcher.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/error/exceptions.dart';
import 'app_navegacion_externa.dart';

/// Abre navegación externa hacia un punto (Google Maps o Waze).
class AbrirNavegacionExterna {
  const AbrirNavegacionExterna._();

  static Future<void> abrir({
    required AppNavegacionExterna app,
    required double latitud,
    required double longitud,
  }) async {
    final uris = switch (app) {
      AppNavegacionExterna.googleMaps => [
        Uri.parse(
          'https://www.google.com/maps/dir/?api=1'
          '&destination=$latitud,$longitud&travelmode=driving',
        ),
        Uri.parse(
          'comgooglemaps://?daddr=$latitud,$longitud&directionsmode=driving',
        ),
      ],
      AppNavegacionExterna.waze => [
        Uri.parse('https://waze.com/ul?ll=$latitud,$longitud&navigate=yes'),
        Uri.parse('waze://?ll=$latitud,$longitud&navigate=yes'),
      ],
    };

    for (final uri in uris) {
      final puede = await canLaunchUrl(uri);
      if (!puede) {
        continue;
      }
      final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
      if (ok) {
        return;
      }
    }

    throw const AppException(AppStrings.errorAbrirNavegacion);
  }
}

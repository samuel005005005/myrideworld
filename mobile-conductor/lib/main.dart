import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app.dart';
import 'core/logging/configurar_errores_globales.dart';
import 'features/viajes/data/services/oferta_viaje_alerta_service.dart';

void main() {
  ejecutarAppConZonaErrores(() async {
    WidgetsFlutterBinding.ensureInitialized();
    await OfertaViajeAlertaService.instancia.inicializar();
    runApp(const ProviderScope(child: App()));
  });
}

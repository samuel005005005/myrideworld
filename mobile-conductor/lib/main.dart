import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app.dart';
import 'features/viajes/data/services/oferta_viaje_alerta_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await OfertaViajeAlertaService.instancia.inicializar();
  runApp(const ProviderScope(child: App()));
}

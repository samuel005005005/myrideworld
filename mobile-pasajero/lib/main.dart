import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app.dart';
import 'core/logging/configurar_errores_globales.dart';

void main() {
  ejecutarAppConZonaErrores(() {
    WidgetsFlutterBinding.ensureInitialized();
    runApp(const ProviderScope(child: App()));
  });
}

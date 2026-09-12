import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/viajes/domain/entities/viaje.dart';
import '../../features/viajes/presentation/pages/home_page.dart';
import '../../features/viajes/presentation/pages/viaje_active_page.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/home',
    routes: [
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        path: '/viaje-active',
        builder: (context, state) {
          final viaje = state.extra is Viaje ? state.extra as Viaje : null;
          return ViajeActivePage(viaje: viaje);
        },
      ),
    ],
  );
});

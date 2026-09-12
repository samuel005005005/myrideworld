import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/welcome_page.dart';
import '../../features/viajes/presentation/pages/home_page.dart';
import '../../features/viajes/presentation/pages/viaje_active_page.dart';
import '../../features/viajes/presentation/pages/viaje_recibo_page.dart';
import '../../features/viajes/presentation/pages/viajes_history_page.dart';
import '../../features/viajes/presentation/pages/viaje_searching_page.dart';
import '../../features/viajes/presentation/pages/viaje_rating_page.dart';
import '../../features/viajes/presentation/pages/viaje_search_location_page.dart';
import '../../features/perfil/presentation/pages/perfil_page.dart';
import '../../features/pagos/presentation/pages/pagos_page.dart';
import '../../features/soporte/presentation/pages/ayuda_page.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/home',
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
      GoRoute(
        path: '/welcome',
        builder: (context, state) => const WelcomePage(),
      ),
      GoRoute(path: '/home', builder: (context, state) => const HomePage()),
      GoRoute(
        path: '/radar',
        builder: (context, state) => const ViajeSearchingPage(),
      ),
      GoRoute(
        path: '/viaje-active',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>? ?? {};
          return ViajeActivePage(
            viajeId: extra['viajeId'] as String?,
          );
        },
      ),
      GoRoute(
        path: '/recibo',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>? ?? {};
          final tarifa = (extra['tarifa'] as num?)?.toDouble() ?? 0.0;
          final distancia = (extra['distancia'] as num?)?.toDouble() ?? 0.0;
          final duracion =
              (extra['duracionMinutos'] as num?)?.toInt() ?? 0;
          return ViajeReciboPage(
            tarifa: tarifa,
            distancia: distancia,
            duracionMinutos: duracion,
          );
        },
      ),
      GoRoute(
        path: '/rating',
        builder: (context, state) => const ViajeRatingPage(),
      ),
      GoRoute(
        path: '/history',
        builder: (context, state) => const ViajesHistoryPage(),
      ),
      GoRoute(
        path: '/search-location',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>? ?? {};
          return ViajeSearchLocationPage(
            initialPickup: extra['pickup'] ?? '',
            initialDropoff: extra['dropoff'] ?? '',
            autofocusDropoff: extra['focusDropoff'] ?? true,
          );
        },
      ),
      GoRoute(path: '/perfil', builder: (context, state) => const PerfilPage()),
      GoRoute(path: '/pagos', builder: (context, state) => const PagosPage()),
      GoRoute(path: '/ayuda', builder: (context, state) => const AyudaPage()),
    ],
  );
});

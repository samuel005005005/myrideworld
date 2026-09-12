import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/welcome_page.dart';
import '../../features/viajes/data/mappers/recibo_viaje_mapper.dart';
import '../../features/viajes/data/mappers/viaje_mapper.dart';
import '../../features/viajes/domain/entities/recibo_viaje.dart';
import '../../features/viajes/domain/entities/viaje.dart';
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

String? _resolverViajeId(Object? extra) {
  if (extra is String && extra.isNotEmpty) {
    return extra;
  }

  if (extra is Viaje) {
    return extra.id;
  }

  if (extra is Map) {
    try {
      final viaje = ViajeMapper.fromJson(Map<String, dynamic>.from(extra));
      return viaje.id;
    } catch (_) {
      return extra['viajeId']?.toString();
    }
  }

  return null;
}

ReciboViaje _resolverRecibo(Object? extra) {
  if (extra is ReciboViaje) {
    return extra;
  }

  if (extra is Map) {
    try {
      return ReciboViajeMapper.fromJson(Map<String, dynamic>.from(extra));
    } catch (_) {
      return const ReciboViaje(tarifa: 0, distancia: 0, duracionMinutos: 0);
    }
  }

  return const ReciboViaje(tarifa: 0, distancia: 0, duracionMinutos: 0);
}

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
          final viajeId = _resolverViajeId(state.extra);
          return ViajeActivePage(viajeId: viajeId);
        },
      ),
      GoRoute(
        path: '/recibo',
        builder: (context, state) {
          final recibo = _resolverRecibo(state.extra);
          return ViajeReciboPage(
            tarifa: recibo.tarifa,
            distancia: recibo.distancia,
            duracionMinutos: recibo.duracionMinutos,
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

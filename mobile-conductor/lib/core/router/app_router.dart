import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/viajes/data/mappers/viaje_mapper.dart';
import '../../features/viajes/domain/entities/viaje.dart';
import '../../features/viajes/presentation/pages/home_page.dart';
import '../../features/viajes/presentation/pages/viaje_active_page.dart';

Viaje? _resolverViaje(Object? extra) {
  if (extra is Viaje) {
    return extra;
  }

  if (extra is Map) {
    try {
      return ViajeMapper.toDomain(
        ViajeMapper.fromApiData(Map<String, dynamic>.from(extra)),
      );
    } catch (_) {
      return null;
    }
  }

  return null;
}

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/home',
    routes: [
      GoRoute(path: '/home', builder: (context, state) => const HomePage()),
      GoRoute(
        path: '/viaje-active',
        builder: (context, state) {
          final viaje = _resolverViaje(state.extra);
          return ViajeActivePage(viaje: viaje);
        },
      ),
    ],
  );
});

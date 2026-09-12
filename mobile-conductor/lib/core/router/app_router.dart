import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/controllers/auth_controller.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/viajes/presentation/navigation/viaje_route_args.dart';
import '../../features/viajes/presentation/pages/home_page.dart';
import '../../features/viajes/presentation/pages/viaje_active_page.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final refresh = ValueNotifier<int>(0);
  ref.listen(authControllerProvider, (_, _) {
    refresh.value++;
  });
  ref.onDispose(refresh.dispose);

  return GoRouter(
    initialLocation: '/login',
    refreshListenable: refresh,
    redirect: (context, state) {
      final auth = ref.read(authControllerProvider);
      final ubicacion = state.matchedLocation;
      final esLogin = ubicacion == '/login';

      if (auth.isLoading) {
        return null;
      }

      final autenticado = auth.asData?.value != null;

      if (!autenticado && !esLogin) {
        return '/login';
      }

      if (autenticado && esLogin) {
        return '/home';
      }

      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
      GoRoute(path: '/home', builder: (context, state) => const HomePage()),
      GoRoute(
        path: '/viaje-active',
        builder: (context, state) {
          final viaje = resolverViajeNavegacion(state.extra);
          return ViajeActivePage(viaje: viaje);
        },
      ),
    ],
  );
});

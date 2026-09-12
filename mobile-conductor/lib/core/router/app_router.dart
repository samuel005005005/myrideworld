import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/controllers/auth_controller.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/balances/domain/entities/pago_balance.dart';
import '../../features/balances/presentation/pages/balances_page.dart';
import '../../features/perfil/presentation/pages/perfil_page.dart';
import '../../features/viajes/presentation/navigation/viaje_route_args.dart';
import '../../features/viajes/presentation/pages/historial_page.dart';
import '../../features/viajes/presentation/pages/home_page.dart';
import '../../features/viajes/presentation/pages/viaje_active_page.dart';
import '../../features/viajes/presentation/pages/viaje_recibo_page.dart';

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
      GoRoute(path: '/perfil', builder: (context, state) => const PerfilPage()),
      GoRoute(
        path: '/balances',
        builder: (context, state) => const BalancesPage(),
      ),
      GoRoute(
        path: '/historial',
        builder: (context, state) => const HistorialPage(),
      ),
      GoRoute(
        path: '/viaje-active',
        builder: (context, state) {
          final viaje = resolverViajeNavegacion(state.extra);
          return ViajeActivePage(viaje: viaje);
        },
      ),
      GoRoute(
        path: '/recibo',
        builder: (context, state) {
          final pago = state.extra;
          if (pago is! PagoBalance) {
            return const HomePage();
          }
          return ViajeReciboPage(pago: pago);
        },
      ),
    ],
  );
});

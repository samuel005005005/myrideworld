import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_theme.dart';
import '../controllers/home_conductor_controller.dart';
import '../controllers/home_conductor_state.dart';
import '../widgets/home_conductor_drawer.dart';
import '../widgets/ofertas_viaje_sheet.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final MapController _mapController = MapController();
  static const LatLng _fallbackMapa = LatLng(18.582, -68.3971);
  bool _sheetOfertasAbierto = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(homeConductorControllerProvider.notifier).inicializar();
    });
  }

  Future<void> _abrirSheetOfertas() async {
    if (_sheetOfertasAbierto || !mounted) {
      return;
    }
    _sheetOfertasAbierto = true;
    await showModalBottomSheet<void>(
      context: context,
      isDismissible: false,
      enableDrag: false,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => const OfertasViajeSheet(),
    );
    _sheetOfertasAbierto = false;
  }
  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(homeConductorControllerProvider);

    ref.listen<HomeConductorState>(homeConductorControllerProvider, (
      anterior,
      siguiente,
    ) {
      final viajeActivo = siguiente.viajeActivoParaRestaurar;
      if (viajeActivo != null &&
          viajeActivo.id != anterior?.viajeActivoParaRestaurar?.id) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (!mounted) {
            return;
          }
          ref
              .read(homeConductorControllerProvider.notifier)
              .consumirViajeActivoRestaurado();
          context.go('/viaje-active', extra: viajeActivo);
        });
      }

      if (siguiente.tieneOfertas && !_sheetOfertasAbierto) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            _abrirSheetOfertas();
          }
        });
      }

      if (siguiente.ubicacionActual != null &&
          siguiente.ubicacionActual != anterior?.ubicacionActual) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            _mapController.move(siguiente.ubicacionActual!, 15);
          }
        });
      }

      if (siguiente.errorMensaje != null &&
          siguiente.errorMensaje != anterior?.errorMensaje &&
          mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(siguiente.errorMensaje!)));
        ref.read(homeConductorControllerProvider.notifier).limpiarError();
      }
    });

    final centro = estado.ubicacionActual ?? _fallbackMapa;

    return Scaffold(
      key: _scaffoldKey,
      drawer: const HomeConductorDrawer(),
      body: Stack(
        children: [
          Positioned.fill(
            child: FlutterMap(
              mapController: _mapController,
              options: MapOptions(initialCenter: centro, initialZoom: 15),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.myride.mobile_conductor',
                ),
                if (estado.ubicacionActual != null)
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: estado.ubicacionActual!,
                        width: 52,
                        height: 52,
                        child: Container(
                          decoration: BoxDecoration(
                            color: AppTheme.brandPrimary,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: AppTheme.brandPrimary.withValues(
                                  alpha: 0.35,
                                ),
                                blurRadius: 12,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.directions_car,
                            color: Colors.white,
                            size: 28,
                          ),
                        ),
                      ),
                    ],
                  ),
              ],
            ),
          ),
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            left: 16,
            child: CircleAvatar(
              backgroundColor: Colors.white,
              radius: 24,
              child: IconButton(
                icon: const Icon(Icons.menu, color: AppTheme.textDark),
                onPressed: () => _scaffoldKey.currentState?.openDrawer(),
              ),
            ),
          ),
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            left: 0,
            right: 0,
            child: Center(
              child: _EstadoChip(
                enLinea: estado.enLinea,
                conectando: estado.cambiandoDisponibilidad,
                sinGps: estado.ubicacionActual == null && !estado.inicializando,
              ),
            ),
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 12,
                    offset: Offset(0, -2),
                  ),
                ],
              ),
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              estado.inicializando
                                  ? AppStrings.homeGpsCargando
                                  : (estado.enLinea
                                        ? AppStrings.homeEsperandoViajes
                                        : AppStrings.homeEstadoFueraDeLinea),
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.textDark,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              estado.enLinea
                                  ? AppStrings.socketConectado
                                  : AppStrings.homeFueraDeLineaHint,
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppTheme.textGrey,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Switch.adaptive(
                        value: estado.enLinea,
                        activeThumbColor: Colors.white,
                        activeTrackColor: AppTheme.onlineGreen,
                        onChanged: estado.inicializando ||
                                estado.cambiandoDisponibilidad
                            ? null
                            : (value) {
                                ref
                                    .read(
                                      homeConductorControllerProvider.notifier,
                                    )
                                    .cambiarDisponibilidad(value);
                              },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          if (estado.inicializando)
            const ColoredBox(
              color: Color(0x33FFFFFF),
              child: Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }
}

class _EstadoChip extends StatelessWidget {
  final bool enLinea;
  final bool conectando;
  final bool sinGps;

  const _EstadoChip({
    required this.enLinea,
    required this.conectando,
    required this.sinGps,
  });

  @override
  Widget build(BuildContext context) {
    final color = sinGps
        ? Colors.orange.shade800
        : conectando
        ? Colors.grey.shade700
        : (enLinea ? AppTheme.onlineGreen : Colors.grey.shade800);
    final texto = sinGps
        ? AppStrings.homeEstadoSinGps
        : conectando
        ? AppStrings.homeEstadoConectando
        : (enLinea
              ? AppStrings.homeEstadoEnLinea
              : AppStrings.homeEstadoFueraDeLinea);

    return ConstrainedBox(
      constraints: BoxConstraints(
        maxWidth: MediaQuery.sizeOf(context).width * 0.85,
      ),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(30),
          boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 10)],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 10,
              height: 10,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 10),
            Flexible(
              child: Text(
                texto,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.1,
                  fontSize: 13,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

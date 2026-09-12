import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_theme.dart';
import '../../domain/entities/viaje.dart';
import '../controllers/home_conductor_controller.dart';
import '../controllers/home_conductor_state.dart';
import '../widgets/home_conductor_drawer.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final MapController _mapController = MapController();
  static const LatLng _fallbackMapa = LatLng(18.582, -68.3971);
  String? _ultimoViajeMostradoId;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(homeConductorControllerProvider.notifier).inicializar();
    });
  }

  void _mostrarAlertaViaje(Viaje viaje) {
    showModalBottomSheet(
      context: context,
      isDismissible: false,
      enableDrag: false,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Consumer(
          builder: (context, ref, _) {
            final estado = ref.watch(homeConductorControllerProvider);
            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      AppStrings.homeNuevoViajeTitulo,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.onlineGreen,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 20),
                    _InfoChip(
                      icon: Icons.trip_origin,
                      label: AppStrings.formatoOrigen(
                        viaje.origenLat,
                        viaje.origenLng,
                      ),
                    ),
                    const SizedBox(height: 8),
                    _InfoChip(
                      icon: Icons.flag_outlined,
                      label: AppStrings.formatoDestino(
                        viaje.destinoLat,
                        viaje.destinoLng,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      AppStrings.formatoTarifa(viaje.tarifaEstimada),
                      style: const TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.textDark,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brandPrimary,
                        foregroundColor: Colors.black87,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0,
                      ),
                      onPressed:
                          estado.aceptandoViaje || estado.rechazandoViaje
                          ? null
                          : () async {
                              final viajeAceptado = await ref
                                  .read(
                                    homeConductorControllerProvider.notifier,
                                  )
                                  .aceptarViaje(viaje);
                              if (!context.mounted || viajeAceptado == null) {
                                return;
                              }
                              Navigator.of(ctx).pop();
                              context.go('/viaje-active', extra: viajeAceptado);
                            },
                      child: estado.aceptandoViaje
                          ? const SizedBox(
                              height: 22,
                              width: 22,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.black87,
                              ),
                            )
                          : const Text(
                              AppStrings.homeAceptarViaje,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                    ),
                    const SizedBox(height: 12),
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.textDark,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: const BorderSide(color: AppTheme.borderGrey),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed:
                          estado.aceptandoViaje || estado.rechazandoViaje
                          ? null
                          : () async {
                              final ok = await ref
                                  .read(
                                    homeConductorControllerProvider.notifier,
                                  )
                                  .rechazarViaje(viaje);
                              if (!context.mounted || !ok) {
                                return;
                              }
                              Navigator.of(ctx).pop();
                            },
                      child: estado.rechazandoViaje
                          ? const SizedBox(
                              height: 22,
                              width: 22,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text(
                              AppStrings.homeRechazarViaje,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
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

      final viajePendiente = siguiente.viajePendiente;
      if (viajePendiente != null &&
          viajePendiente.id != _ultimoViajeMostradoId) {
        _ultimoViajeMostradoId = viajePendiente.id;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            _mostrarAlertaViaje(viajePendiente);
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

    return Container(
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
          Text(
            texto,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.1,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderGrey),
      ),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppTheme.brandPrimary),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppTheme.textDark,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

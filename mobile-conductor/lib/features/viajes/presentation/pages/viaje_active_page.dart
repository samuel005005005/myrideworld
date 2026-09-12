import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_theme.dart';
import '../../domain/entities/viaje.dart';
import '../controllers/viaje_activo_controller.dart';
import '../controllers/viaje_activo_state.dart';

class ViajeActivePage extends ConsumerStatefulWidget {
  final Viaje? viaje;

  const ViajeActivePage({super.key, required this.viaje});

  @override
  ConsumerState<ViajeActivePage> createState() => _ViajeActivePageState();
}

class _ViajeActivePageState extends ConsumerState<ViajeActivePage> {
  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final viaje = widget.viaje;
      if (viaje != null) {
        await ref
            .read(viajeActivoControllerProvider.notifier)
            .inicializar(viaje);
      }
    });
  }

  @override
  void dispose() {
    ref.read(viajeActivoControllerProvider.notifier).limpiar();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(viajeActivoControllerProvider);
    ref.listen<ViajeActivoState>(viajeActivoControllerProvider, (
      anterior,
      siguiente,
    ) {
      if (siguiente.errorMensaje != null &&
          siguiente.errorMensaje != anterior?.errorMensaje &&
          mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(siguiente.errorMensaje!),
            duration: const Duration(seconds: 6),
            backgroundColor: const Color(0xFFB91C1C),
          ),
        );
        ref.read(viajeActivoControllerProvider.notifier).limpiarError();
      }

      if (siguiente.finalizado && mounted) {
        final recibo = siguiente.recibo;
        if (recibo != null) {
          context.go('/recibo', extra: recibo);
        } else {
          context.go('/home');
        }
      }
    });

    if (widget.viaje == null || estado.viaje == null) {
      return const Scaffold(
        body: Center(child: Text(AppStrings.viajeSinDatos)),
      );
    }

    final controller = ref.read(viajeActivoControllerProvider.notifier);
    final ubicacionActual = controller.obtenerUbicacionActual();
    final objetivo = controller.obtenerUbicacionObjetivo();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _mapController.move(ubicacionActual, 16);
      }
    });

    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: ubicacionActual,
                initialZoom: 16,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.myride.mobile_conductor',
                ),
                MarkerLayer(
                  markers: [
                    Marker(
                      point: ubicacionActual,
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
                    if (controller.mostrarOrigen())
                      Marker(
                        point: objetivo,
                        width: 40,
                        height: 40,
                        child: const Icon(
                          Icons.person_pin_circle,
                          color: Color(0xFF2563EB),
                          size: 40,
                        ),
                      ),
                    if (controller.mostrarDestino())
                      Marker(
                        point: objetivo,
                        width: 40,
                        height: 40,
                        child: const Icon(
                          Icons.flag,
                          color: Color(0xFFDC2626),
                          size: 40,
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          Positioned(
            top: MediaQuery.of(context).padding.top + 12,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [
                  BoxShadow(color: Colors.black12, blurRadius: 10),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppTheme.brandPrimaryLight,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.navigation_outlined,
                      color: AppTheme.brandPrimary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          controller.obtenerTituloEstado(),
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 15,
                            color: AppTheme.textDark,
                          ),
                        ),
                        if (estado.etaInfo.isNotEmpty &&
                            controller.obtenerTituloEstado() !=
                                AppStrings.viajeEstadoEsperando)
                          Text(
                            estado.etaInfo,
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppTheme.textGrey,
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            left: 16,
            right: 16,
            bottom: MediaQuery.of(context).padding.bottom + 16,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.brandPrimary,
                foregroundColor: Colors.black87,
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                elevation: 0,
              ),
              onPressed: estado.procesando
                  ? null
                  : () {
                      controller.avanzarEstado();
                    },
              child: estado.procesando
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.black87,
                      ),
                    )
                  : Text(
                      controller.obtenerTextoBoton(),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}

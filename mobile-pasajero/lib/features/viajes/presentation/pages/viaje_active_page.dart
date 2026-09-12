import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../core/constants/app_strings.dart';
import '../controllers/viaje_activo_controller.dart';
import '../controllers/viaje_activo_state.dart';

class ViajeActivePage extends ConsumerStatefulWidget {
  final String? viajeId;
  const ViajeActivePage({super.key, this.viajeId});

  @override
  ConsumerState<ViajeActivePage> createState() => _ViajeActivePageState();
}

class _ViajeActivePageState extends ConsumerState<ViajeActivePage> {
  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref
          .read(viajeActivoControllerProvider.notifier)
          .iniciarSeguimiento(widget.viajeId);
    });
  }

  @override
  void dispose() {
    ref.read(viajeActivoControllerProvider.notifier).detenerSeguimiento();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(viajeActivoControllerProvider);

    ref.listen<ViajeActivoState>(viajeActivoControllerProvider, (
      anterior,
      siguiente,
    ) {
      if (anterior?.ubicacionConductor != siguiente.ubicacionConductor) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            _mapController.move(siguiente.ubicacionConductor, 16.0);
          }
        });
      }

      final reciboPendiente = siguiente.reciboPendiente;
      if (reciboPendiente != null &&
          anterior?.reciboPendiente != reciboPendiente &&
          context.mounted) {
        ref
            .read(viajeActivoControllerProvider.notifier)
            .consumirReciboPendiente();
        context.go('/recibo', extra: reciboPendiente);
      }
    });

    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const borderGrey = Color(0xFFE2E8F0);
    const dangerColor = Color(0xFFDC2626);

    return Scaffold(
      body: Stack(
        children: [
          // 1. Full Screen Map
          Positioned.fill(
            child: FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: estado.ubicacionConductor,
                initialZoom: 16.0,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.myride',
                ),
                MarkerLayer(
                  markers: [
                    Marker(
                      point: estado.ubicacionConductor,
                      width: 48,
                      height: 48,
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black26,
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.directions_car,
                            color: Colors.black87,
                            size: 28,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Back
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            left: 16,
            child: CircleAvatar(
              backgroundColor: Colors.white,
              radius: 24,

              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: textDark),
                onPressed: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/home');
                  }
                },
              ),
            ),
          ),

          // SOS → ayuda / central
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            right: 16,
            child: ElevatedButton.icon(
              onPressed: () => context.push('/ayuda'),
              icon: const Icon(Icons.shield, color: Colors.white, size: 18),
              label: const Text(AppStrings.trackingSOS),
              style: ElevatedButton.styleFrom(
                backgroundColor: dangerColor,
                foregroundColor: Colors.white,
                shape: const StadiumBorder(),
                elevation: 4,
              ),
            ),
          ),

          // 3. Draggable Bottom Card
          DraggableScrollableSheet(
            initialChildSize: 0.45,
            minChildSize: 0.15,
            maxChildSize: 0.75,
            builder: (context, scrollController) {
              return Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 20,
                      offset: Offset(0, -5),
                    ),
                  ],
                ),
                child: SingleChildScrollView(
                  controller: scrollController,
                  padding: EdgeInsets.only(
                    left: 20,
                    right: 20,
                    top: 16,
                    bottom: MediaQuery.of(context).padding.bottom + 20,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Drag Handle
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // ETA and Status
                      Text(
                        estado.estadoViaje,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: textDark,
                        ),
                      ),
                      const SizedBox(height: 4),
                      if (estado.infoEta != null)
                        Text(
                          estado.infoEta!,
                          style: const TextStyle(fontSize: 14, color: textGrey),
                        ),
                      const SizedBox(height: 16),
                      const Divider(color: borderGrey),
                      const SizedBox(height: 16),

                      // Driver Info
                      Row(
                        children: [
                          _AvatarConductor(
                            nombre: estado.conductor?.nombreCompleto,
                            fotoUrl: estado.conductor?.fotoUrl,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  estado.conductor?.nombreCompleto ??
                                      AppStrings.trackingConductorPendiente,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: textDark,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  estado.conductor?.vehiculoResumen.isNotEmpty ==
                                          true
                                      ? estado.conductor!.vehiculoResumen
                                      : AppStrings.trackingVehiculoPendiente,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: textGrey,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.grey.shade300),
                            ),
                            child: Text(
                              (estado.conductor?.vehiculoPlaca.isNotEmpty ==
                                      true)
                                  ? estado.conductor!.vehiculoPlaca
                                  : AppStrings.trackingPlacaPendiente,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.0,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 20),

                      // Acciones reales (llamar conductor si hay teléfono)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _buildActionBtn(
                            icon: Icons.call,
                            label: AppStrings.trackingCallAction,
                            onTap: () => _llamarConductor(
                              context,
                              estado.conductor?.telefono,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      if (estado.puedeCancelar)
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton(
                            onPressed: estado.cancelando
                                ? null
                                : () async {
                                    final ok = await ref
                                        .read(
                                          viajeActivoControllerProvider
                                              .notifier,
                                        )
                                        .cancelarViajeActivo();
                                    if (ok && context.mounted) {
                                      context.go('/home');
                                    }
                                  },
                            style: OutlinedButton.styleFrom(
                              foregroundColor: dangerColor,
                              side: const BorderSide(color: dangerColor),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: Text(
                              estado.cancelando
                                  ? AppStrings.trackingCancelando
                                  : AppStrings.trackingCancelarViaje,
                            ),
                          ),
                        ),

                      if (estado.errorCancelacion != null) ...[
                        const SizedBox(height: 8),
                        Text(
                          estado.errorCancelacion!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13,
                            color: dangerColor,
                          ),
                        ),
                      ],

                      const SizedBox(height: 16),

                      const Text(
                        AppStrings.trackingWaitingCompletion,
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 13, color: textGrey),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildActionBtn({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          children: [
            CircleAvatar(
              radius: 24,
              backgroundColor: Colors.grey.shade100,
              child: Icon(icon, color: const Color(0xFF1E293B)),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _llamarConductor(BuildContext context, String? telefono) async {
    final numero = telefono?.trim() ?? '';
    if (numero.isEmpty) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text(AppStrings.trackingTelefonoNoDisponible)),
      );
      return;
    }

    final uri = Uri(scheme: 'tel', path: numero);
    final ok = await launchUrl(uri);
    if (!ok && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text(AppStrings.trackingLlamadaFallida)),
      );
    }
  }
}

class _AvatarConductor extends StatelessWidget {
  final String? nombre;
  final String? fotoUrl;

  const _AvatarConductor({this.nombre, this.fotoUrl});

  @override
  Widget build(BuildContext context) {
    final urlHttp =
        fotoUrl != null &&
        (fotoUrl!.startsWith('http://') || fotoUrl!.startsWith('https://'));

    if (urlHttp) {
      return CircleAvatar(
        radius: 28,
        backgroundColor: Colors.grey.shade200,
        backgroundImage: NetworkImage(fotoUrl!),
      );
    }

    final inicial = (nombre != null && nombre!.isNotEmpty)
        ? nombre![0].toUpperCase()
        : '?';

    return CircleAvatar(
      radius: 28,
      backgroundColor: const Color(0xFFF59E0B).withValues(alpha: 0.2),
      child: Text(
        inicial,
        style: const TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: Color(0xFF1E293B),
        ),
      ),
    );
  }
}

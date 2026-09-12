import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';

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
    const brandPrimary = Color(0xFFF59E0B);
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

          // Menu/Back Button
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            left: 16,
            child: CircleAvatar(
              backgroundColor: Colors.white,
              radius: 24,

              child: IconButton(
                icon: const Icon(Icons.menu, color: textDark),
                onPressed: () {},
              ),
            ),
          ),

          // SOS Button
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            right: 16,
            child: ElevatedButton.icon(
              onPressed: () {},
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
                          // Avatar
                          CircleAvatar(
                            radius: 28,
                            backgroundColor: Colors.grey.shade200,
                            backgroundImage: const NetworkImage(
                              'https://randomuser.me/api/portraits/men/32.jpg', // Placeholder
                            ),
                          ),
                          const SizedBox(width: 16),
                          // Details
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Row(
                                  children: [
                                    Text(
                                      AppStrings.trackingDriverNamePlaceholder,
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: textDark,
                                      ),
                                    ),
                                    SizedBox(width: 8),
                                    Icon(
                                      Icons.star,
                                      color: brandPrimary,
                                      size: 16,
                                    ),
                                    Text(
                                      AppStrings.trackingDriverRatingPlaceholder,
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: textGrey,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  AppStrings.trackingDriverVehiclePlaceholder,
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: textGrey,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // License Plate
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
                            child: const Text(
                              AppStrings.trackingDriverPlatePlaceholder,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.0,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 20),

                      // Actions Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildActionBtn(
                            icon: Icons.call,
                            label: AppStrings.trackingCallAction,
                            onTap: () {},
                          ),
                          _buildActionBtn(
                            icon: Icons.message,
                            label: AppStrings.trackingMessageAction,
                            onTap: () {},
                          ),
                          _buildActionBtn(
                            icon: Icons.share,
                            label: AppStrings.trackingShareAction,
                            onTap: () {},
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

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
}

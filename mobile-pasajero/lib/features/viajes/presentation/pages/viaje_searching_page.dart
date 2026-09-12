import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../controllers/busqueda_conductor_controller.dart';
import '../controllers/busqueda_conductor_state.dart';

class ViajeSearchingPage extends ConsumerStatefulWidget {
  final String viajeId;

  const ViajeSearchingPage({super.key, required this.viajeId});

  @override
  ConsumerState<ViajeSearchingPage> createState() => _ViajeSearchingPageState();
}

class _ViajeSearchingPageState extends ConsumerState<ViajeSearchingPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref
          .read(busquedaConductorControllerProvider.notifier)
          .iniciar(widget.viajeId);
    });
  }

  @override
  Widget build(BuildContext context) {
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const brandPrimary = Color(0xFFF59E0B);
    const borderGrey = Color(0xFFE2E8F0);

    ref.listen<BusquedaConductorState>(busquedaConductorControllerProvider, (
      _,
      siguiente,
    ) {
      if (siguiente.listoParaNavegar && context.mounted) {
        context.go('/viaje-active', extra: widget.viajeId);
      }
      final error = siguiente.error;
      if (error != null && error.isNotEmpty && context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(error)));
      }
    });

    final estado = ref.watch(busquedaConductorControllerProvider);

    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: FlutterMap(
              options: const MapOptions(
                initialCenter: LatLng(18.5820, -68.3971),
                initialZoom: 14.0,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.myride.pasajero',
                ),
              ],
            ),
          ),
          Positioned.fill(
            child: Container(color: Colors.black.withValues(alpha: 0.2)),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
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
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 32,
                bottom: MediaQuery.of(context).padding.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(
                    width: 48,
                    height: 48,
                    child: CircularProgressIndicator(
                      color: brandPrimary,
                      strokeWidth: 4,
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    AppStrings.radarSearchingTitle,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: textDark,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    AppStrings.radarNotifying,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 14, color: textGrey),
                  ),
                  const SizedBox(height: 32),
                  OutlinedButton(
                    onPressed: estado.cancelando
                        ? null
                        : () async {
                            final ok = await ref
                                .read(
                                  busquedaConductorControllerProvider.notifier,
                                )
                                .cancelarSolicitud();
                            if (ok && context.mounted) {
                              context.go('/home');
                            }
                          },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red.shade600,
                      side: const BorderSide(color: borderGrey),
                      minimumSize: const Size.fromHeight(56),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      estado.cancelando
                          ? AppStrings.radarCancelando
                          : AppStrings.radarCancelBtn,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

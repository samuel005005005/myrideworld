import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
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
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final viaje = widget.viaje;
      if (viaje != null) {
        ref.read(viajeActivoControllerProvider.notifier).inicializar(viaje);
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
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(siguiente.errorMensaje!)));
        ref.read(viajeActivoControllerProvider.notifier).limpiarError();
      }

      if (siguiente.finalizado && mounted) {
        context.go('/home');
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
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(controller.obtenerTituloEstado()),
            if (estado.etaInfo.isNotEmpty &&
                controller.obtenerTituloEstado() !=
                    AppStrings.viajeEstadoEsperando)
              Text(
                estado.etaInfo,
                style: const TextStyle(fontSize: 12, color: Colors.white70),
              ),
          ],
        ),
        backgroundColor: const Color(0xFFF59E0B),
        automaticallyImplyLeading: false,
      ),
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: ubicacionActual,
              initialZoom: 16.0,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.example.mobile_conductor',
              ),
              MarkerLayer(
                markers: [
                  Marker(
                    point: ubicacionActual,
                    width: 48,
                    height: 48,
                    child: Container(
                      decoration: const BoxDecoration(
                        color: Color(0xFFF59E0B),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black26,
                            blurRadius: 10,
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
                        color: Colors.blue,
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
                        color: Colors.red,
                        size: 40,
                      ),
                    ),
                ],
              ),
            ],
          ),
          SafeArea(
            child: Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                margin: const EdgeInsets.all(16),
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black87,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: estado.procesando
                      ? null
                      : () {
                          controller.avanzarEstado();
                        },
                  child: Text(
                    controller.obtenerTextoBoton(),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../domain/entities/viaje.dart';
import '../controllers/home_conductor_controller.dart';
import '../controllers/home_conductor_state.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final MapController _mapController = MapController();
  final LatLng _initialLocation = const LatLng(18.582, -68.3971);
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
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Consumer(
          builder: (context, ref, _) {
            final estado = ref.watch(homeConductorControllerProvider);
            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      AppStrings.homeNuevoViajeTitulo,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.green,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      AppStrings.formatoOrigen(
                        viaje.origenLat,
                        viaje.origenLng,
                      ),
                    ),
                    Text(
                      AppStrings.formatoDestino(
                        viaje.destinoLat,
                        viaje.destinoLng,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      AppStrings.formatoTarifa(viaje.tarifaEstimada),
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF59E0B),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: estado.aceptandoViaje
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
                              height: 24,
                              width: 24,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                              ),
                            )
                          : const Text(
                              AppStrings.homeAceptarViaje,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
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

      if (siguiente.errorMensaje != null &&
          siguiente.errorMensaje != anterior?.errorMensaje &&
          mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(siguiente.errorMensaje!)));
        ref.read(homeConductorControllerProvider.notifier).limpiarError();
      }
    });

    return Scaffold(
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _initialLocation,
              initialZoom: 15.0,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.example.mobile_conductor',
              ),
              MarkerLayer(
                markers: [
                  Marker(
                    point: _initialLocation,
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
                ],
              ),
            ],
          ),
          SafeArea(
            child: Align(
              alignment: Alignment.topCenter,
              child: Container(
                margin: const EdgeInsets.only(top: 16),
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: estado.enLinea ? Colors.green : Colors.grey.shade800,
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: const [
                    BoxShadow(color: Colors.black26, blurRadius: 10),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      estado.enLinea
                          ? AppStrings.homeEstadoEnLinea
                          : AppStrings.homeEstadoConectando,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          if (estado.inicializando)
            const Center(child: CircularProgressIndicator()),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile_pasajero/core/services/socket_service.dart';

import '../../../../core/constants/app_strings.dart';

class ViajeActivePage extends ConsumerStatefulWidget {
  final String? viajeId;
  const ViajeActivePage({super.key, this.viajeId});

  @override
  ConsumerState<ViajeActivePage> createState() => _ViajeActivePageState();
}

class _ViajeActivePageState extends ConsumerState<ViajeActivePage> {
  LatLng _driverLocation = const LatLng(18.5820, -68.3971);
  final MapController _mapController = MapController();
  
  String _tripStatus = 'Esperando confirmación...';
  String? _etaInfo;
  double? _tarifaFinal;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initSocket();
    });
  }

  void _initSocket() {
    final socketService = ref.read(socketServiceProvider);
    socketService.connect();

    if (widget.viajeId != null) {
      socketService.unirseAViaje(widget.viajeId!);
    }

    socketService.onUbicacionActualizada = (data) {
      final lat = data['lat'] as num?;
      final lng = data['lng'] as num?;

      if (lat != null && lng != null) {
        setState(() {
          _driverLocation = LatLng(lat.toDouble(), lng.toDouble());
        });
        _mapController.move(_driverLocation, 16.0);
      }
    };

    // Escuchar el ciclo de vida del viaje
    socketService.on('viajeAceptado', (data) {
      setState(() {
        _tripStatus = 'Conductor en camino';
      });
    });

    socketService.on('conductorLlego', (data) {
      setState(() {
        _tripStatus = '¡El conductor ha llegado!';
      });
    });

    socketService.on('viajeIniciado', (data) {
      setState(() {
        _tripStatus = 'En viaje hacia tu destino';
      });
    });

    socketService.on('viajeCompletado', (data) {
      final payload = data is Map ? Map<String, dynamic>.from(data) : <String, dynamic>{};
      _tarifaFinal = (payload['tarifaEstimada'] as num?)?.toDouble() ?? 0.0;
      if (mounted) {
        context.go('/recibo', extra: {
          'tarifa': _tarifaFinal,
          'distancia': 0.0,
          'duracionMinutos': 0,
        });
      }
    });
  }

  @override
  void dispose() {
    // Only disconnect if leaving trip entirely, for MVP we disconnect on pop
    ref.read(socketServiceProvider).disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
                initialCenter: _driverLocation,
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
                      point: _driverLocation,
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
                    _tripStatus,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  if (_tripStatus == 'Conductor en camino')
                    const Text(
                      'Llegando en ~ 5 min',
                      style: TextStyle(fontSize: 14, color: textGrey),
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
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  'Carlos M.',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: textDark,
                                  ),
                                ),
                                SizedBox(width: 8),
                                Icon(Icons.star, color: brandPrimary, size: 16),
                                Text(
                                  '4.9',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: textGrey,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Toyota Corolla • Blanco',
                              style: TextStyle(fontSize: 13, color: textGrey),
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
                          'A849201',
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
                        label: 'Llamar',
                        onTap: () {},
                      ),
                      _buildActionBtn(
                        icon: Icons.message,
                        label: 'Mensaje',
                        onTap: () {},
                      ),
                      _buildActionBtn(
                        icon: Icons.share,
                        label: 'Compartir',
                        onTap: () {},
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  Text(
                    'Esperando que el conductor finalice el viaje…',
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

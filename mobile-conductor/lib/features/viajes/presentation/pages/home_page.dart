import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../../../../core/services/api_service.dart';
import '../../../../core/services/socket_service.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final MapController _mapController = MapController();
  final LatLng _initialLocation = const LatLng(18.582, -68.3971);

  bool _isOnline = false;
  Map<String, dynamic>? _viajePendiente;
  bool _isAccepting = false;

  @override
  void initState() {
    super.initState();
    _autoLogin();
  }

  Future<void> _autoLogin() async {
    try {
      final apiService = ref.read(apiServiceProvider);
      await apiService.login('conductor@myride.com', '12345678', 'CONDUCTOR');
      print('✅ Auto-login conductor exitoso!');

      final socketService = ref.read(socketServiceProvider);
      socketService.connect();

      final conductorId = apiService.currentUserId;
      if (conductorId != null) {
        socketService.identificarConductor(conductorId);
      }

      socketService.on('connect', (_) {
        print('✅ Conductor conectado al WebSocket.');
        setState(() {
          _isOnline = true;
        });
        if (conductorId != null) {
          socketService.identificarConductor(conductorId);
        }
      });

      socketService.on('nuevoViajeDisponible', (data) {
        print('🚕 ¡Nuevo viaje solicitado recibido! $data');
        final viaje = data is Map
            ? Map<String, dynamic>.from(data)
            : <String, dynamic>{};
        setState(() {
          _viajePendiente = viaje;
          _isOnline = true;
        });
        _mostrarAlertaViaje(viaje);
      });
    } catch (e) {
      print('❌ Auto-login failed: $e');
    }
  }

  void _mostrarAlertaViaje(Map<String, dynamic> data) {
    showModalBottomSheet(
      context: context,
      isDismissible: false,
      enableDrag: false,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      '¡NUEVO VIAJE!',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.green,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Origen: Lat ${data['origenLat']}, Lng ${data['origenLng']}',
                    ),
                    Text(
                      'Destino: Lat ${data['destinoLat']}, Lng ${data['destinoLng']}',
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Tarifa Estimada: US\$${data['tarifaEstimada']}',
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
                      onPressed: _isAccepting
                          ? null
                          : () async {
                              setModalState(() {
                                _isAccepting = true;
                              });
                              await _aceptarViaje(data['id']);
                              if (context.mounted) {
                                Navigator.pop(ctx); // close bottomsheet
                                context.go('/viaje-active', extra: data);
                              }
                            },
                      child: _isAccepting
                          ? const SizedBox(
                              height: 24,
                              width: 24,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                              ),
                            )
                          : const Text(
                              'ACEPTAR VIAJE',
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

  Future<void> _aceptarViaje(String viajeId) async {
    try {
      final apiService = ref.read(apiServiceProvider);
      final conductorId = apiService.currentUserId;
      if (conductorId == null) return;

      await apiService.dio.post(
        '/viajes/$viajeId/aceptar',
        data: {'conductorId': conductorId},
      );
      print('✅ Viaje aceptado en backend!');
    } catch (e) {
      print('❌ Error aceptando viaje: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
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
                  color: _isOnline ? Colors.green : Colors.grey.shade800,
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
                      _isOnline ? 'EN LÍNEA' : 'CONECTANDO...',
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
        ],
      ),
    );
  }
}

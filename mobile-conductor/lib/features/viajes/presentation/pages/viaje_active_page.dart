import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../../../../core/services/api_service.dart';
import '../../../../core/services/socket_service.dart';

class ViajeActivePage extends ConsumerStatefulWidget {
  final Map<String, dynamic> viaje;
  const ViajeActivePage({super.key, required this.viaje});

  @override
  ConsumerState<ViajeActivePage> createState() => _ViajeActivePageState();
}

class _ViajeActivePageState extends ConsumerState<ViajeActivePage> {
  final MapController _mapController = MapController();
  final Distance _distanceCalc = const Distance();
  Timer? _gpsTimer;
  late LatLng _currentLocation;
  String _estadoViaje = 'En Camino al Pasajero'; // Estados: En Camino, Esperando, En Viaje
  String _etaInfo = '';

  @override
  void initState() {
    super.initState();
    final origenLat = (widget.viaje['origenLat'] as num).toDouble();
    final origenLng = (widget.viaje['origenLng'] as num).toDouble();
    _currentLocation = LatLng(origenLat - 0.005, origenLng - 0.005);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final socketService = ref.read(socketServiceProvider);
      socketService.connect();
      socketService.unirseAViaje(widget.viaje['id'] as String);
      _startGpsSimulation();
    });
  }

  void _startGpsSimulation() {
    final socketService = ref.read(socketServiceProvider);

    _gpsTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      if (!mounted) return;

      setState(() {
        final targetLat = _estadoViaje == 'En Viaje'
            ? (widget.viaje['destinoLat'] as num).toDouble()
            : (widget.viaje['origenLat'] as num).toDouble();

        final targetLng = _estadoViaje == 'En Viaje'
            ? (widget.viaje['destinoLng'] as num).toDouble()
            : (widget.viaje['origenLng'] as num).toDouble();

        _currentLocation = LatLng(
          _currentLocation.latitude +
              (targetLat - _currentLocation.latitude) * 0.1,
          _currentLocation.longitude +
              (targetLng - _currentLocation.longitude) * 0.1,
        );

        final distMeters = _distanceCalc.as(
          LengthUnit.Meter,
          _currentLocation,
          LatLng(targetLat, targetLng),
        );
        final distKm = distMeters / 1000.0;
        final timeMin = (distMeters / 500.0).ceil();

        if (distMeters < 50) {
          _etaInfo = '¡Estás muy cerca!';
        } else {
          _etaInfo = '${distKm.toStringAsFixed(1)} km • ~ $timeMin min';
        }
      });

      _mapController.move(_currentLocation, 16.0);

      socketService.emit('actualizarUbicacion', {
        'viajeId': widget.viaje['id'],
        'lat': _currentLocation.latitude,
        'lng': _currentLocation.longitude,
      });
    });
  }

  @override
  void dispose() {
    _gpsTimer?.cancel();
    super.dispose();
  }

  Future<void> _cambiarEstadoViaje() async {
    final apiService = ref.read(apiServiceProvider);
    
    if (_estadoViaje == 'En Camino al Pasajero') {
      try {
        await apiService.dio.post('/viajes/${widget.viaje['id']}/llegada');
      } catch (e) {
        print('Error al marcar llegada: $e');
      }
      setState(() {
        _estadoViaje = 'Esperando Pasajero';
      });
    } else if (_estadoViaje == 'Esperando Pasajero') {
      // Iniciar Viaje (Subirse)
      try {
        await apiService.dio.post('/viajes/${widget.viaje['id']}/iniciar');
      } catch (e) {
        print('Error al iniciar viaje: $e');
      }
      setState(() {
        _estadoViaje = 'En Viaje';
      });
    } else if (_estadoViaje == 'En Viaje') {
      // Finalizar Viaje (Bajarse)
      try {
        await apiService.dio.post('/viajes/${widget.viaje['id']}/completar');
      } catch (e) {
        print('Error al finalizar viaje: $e');
      }
      _gpsTimer?.cancel();
      if (context.mounted) {
        context.go('/');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_estadoViaje),
            if (_etaInfo.isNotEmpty && _estadoViaje != 'Esperando Pasajero')
              Text(
                _etaInfo,
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
              initialCenter: _currentLocation,
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
                    point: _currentLocation,
                    width: 48,
                    height: 48,
                    child: Container(
                      decoration: const BoxDecoration(
                        color: Color(0xFFF59E0B),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(color: Colors.black26, blurRadius: 10, spreadRadius: 2)
                        ],
                      ),
                      child: const Icon(Icons.directions_car, color: Colors.white, size: 28),
                    ),
                  ),
                  if (_estadoViaje != 'En Viaje')
                    Marker(
                      point: LatLng(
                        (widget.viaje['origenLat'] as num).toDouble(),
                        (widget.viaje['origenLng'] as num).toDouble(),
                      ),
                      width: 40,
                      height: 40,
                      child: const Icon(Icons.person_pin_circle, color: Colors.blue, size: 40),
                    ),
                  if (_estadoViaje == 'En Viaje')
                    Marker(
                      point: LatLng(
                        (widget.viaje['destinoLat'] as num).toDouble(),
                        (widget.viaje['destinoLng'] as num).toDouble(),
                      ),
                      width: 40,
                      height: 40,
                      child: const Icon(Icons.flag, color: Colors.red, size: 40),
                    ),
                ],
              )
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
                  onPressed: _cambiarEstadoViaje,
                  child: Text(
                    _estadoViaje == 'En Camino al Pasajero'
                        ? 'LLEGUÉ AL PUNTO'
                        : _estadoViaje == 'Esperando Pasajero'
                            ? 'INICIAR VIAJE (Subir Pasajero)'
                            : 'FINALIZAR VIAJE (Bajar Pasajero)',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}

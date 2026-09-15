import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../domain/entities/conductor_cercano.dart';

/// Markers de conductores online con interpolación suave entre updates GPS.
class CapaConductoresFlota extends StatefulWidget {
  final List<ConductorCercano> conductores;

  const CapaConductoresFlota({super.key, required this.conductores});

  @override
  State<CapaConductoresFlota> createState() => _CapaConductoresFlotaState();
}

class _CapaConductoresFlotaState extends State<CapaConductoresFlota>
    with TickerProviderStateMixin {
  final Map<String, _AnimacionConductor> _animaciones = {};

  @override
  void didUpdateWidget(covariant CapaConductoresFlota oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sincronizar(widget.conductores);
  }

  @override
  void initState() {
    super.initState();
    _sincronizar(widget.conductores);
  }

  void _sincronizar(List<ConductorCercano> conductores) {
    final idsVivos = <String>{};
    for (final conductor in conductores) {
      idsVivos.add(conductor.id);
      final existente = _animaciones[conductor.id];
      if (existente == null) {
        final controller = AnimationController(
          vsync: this,
          duration: const Duration(milliseconds: 1400),
        )..addListener(() {
            if (mounted) {
              setState(() {});
            }
          });
        _animaciones[conductor.id] = _AnimacionConductor(
          controller: controller,
          lat: conductor.latitud,
          lng: conductor.longitud,
          rumbo: conductor.rumboGrados ?? 0,
          latAnim: AlwaysStoppedAnimation(conductor.latitud),
          lngAnim: AlwaysStoppedAnimation(conductor.longitud),
        );
        continue;
      }

      final destinoLat = conductor.latitud;
      final destinoLng = conductor.longitud;
      if ((destinoLat - existente.latVisible).abs() < 0.0000001 &&
          (destinoLng - existente.lngVisible).abs() < 0.0000001) {
        if (conductor.rumboGrados != null) {
          existente.rumbo = conductor.rumboGrados!;
        }
        continue;
      }

      if (conductor.rumboGrados != null) {
        existente.rumbo = conductor.rumboGrados!;
      }
      existente.latAnim = Tween<double>(
        begin: existente.latVisible,
        end: destinoLat,
      ).animate(
        CurvedAnimation(parent: existente.controller, curve: Curves.easeInOut),
      );
      existente.lngAnim = Tween<double>(
        begin: existente.lngVisible,
        end: destinoLng,
      ).animate(
        CurvedAnimation(parent: existente.controller, curve: Curves.easeInOut),
      );
      existente.controller
        ..reset()
        ..forward();
    }

    final eliminar = _animaciones.keys
        .where((id) => !idsVivos.contains(id))
        .toList();
    for (final id in eliminar) {
      _animaciones.remove(id)?.controller.dispose();
    }
  }

  @override
  void dispose() {
    for (final anim in _animaciones.values) {
      anim.controller.dispose();
    }
    _animaciones.clear();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MarkerLayer(
      markers: [
        for (final entry in _animaciones.entries)
          Marker(
            key: ValueKey(entry.key),
            width: 48,
            height: 48,
            point: LatLng(entry.value.latVisible, entry.value.lngVisible),
            child: Transform.rotate(
              angle: entry.value.rumbo * 3.1415926535 / 180,
              child: Container(
                width: 42,
                height: 42,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: const Color(0xFF111827),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.local_taxi,
                  color: Colors.white,
                  size: 22,
                  semanticLabel: AppStrings.marcadorConductorFlota,
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _AnimacionConductor {
  final AnimationController controller;
  Animation<double> latAnim;
  Animation<double> lngAnim;
  double rumbo;
  double lat;
  double lng;

  _AnimacionConductor({
    required this.controller,
    required this.lat,
    required this.lng,
    required this.rumbo,
    required this.latAnim,
    required this.lngAnim,
  });

  double get latVisible {
    if (controller.isAnimating) {
      return latAnim.value;
    }
    lat = latAnim.value;
    return lat;
  }

  double get lngVisible {
    if (controller.isAnimating) {
      return lngAnim.value;
    }
    lng = lngAnim.value;
    return lng;
  }
}

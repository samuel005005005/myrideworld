import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../domain/entities/conductor_cercano.dart';
import 'marcador_mapa_viaje.dart';

/// Markers de conductores online con interpolación suave entre updates GPS.
class CapaConductoresFlota extends StatefulWidget {
  final List<ConductorCercano> conductores;
  final void Function(ConductorCercano conductor, LatLng punto)? onTap;
  final void Function(ConductorCercano conductor, LatLng punto)? onLongPress;

  const CapaConductoresFlota({
    super.key,
    required this.conductores,
    this.onTap,
    this.onLongPress,
  });

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
    const colorConductor = Color(0xFFF59E0B);
    return MarkerLayer(
      markers: [
        for (final entry in _animaciones.entries)
          Marker(
            key: ValueKey(entry.key),
            width: 148,
            height: 88,
            alignment: Alignment.center,
            point: LatLng(entry.value.latVisible, entry.value.lngVisible),
            child: MarcadorMapaViaje(
              color: colorConductor,
              icono: Icons.directions_car_filled_rounded,
              etiqueta: AppStrings.marcadorConductorFlota,
              onTap: () {
                final conductor = widget.conductores
                    .where((c) => c.id == entry.key)
                    .firstOrNull;
                if (conductor == null) {
                  return;
                }
                final punto = LatLng(
                  entry.value.latVisible,
                  entry.value.lngVisible,
                );
                widget.onTap?.call(conductor, punto);
              },
              onLongPress: () {
                final conductor = widget.conductores
                    .where((c) => c.id == entry.key)
                    .firstOrNull;
                if (conductor == null) {
                  return;
                }
                final punto = LatLng(
                  entry.value.latVisible,
                  entry.value.lngVisible,
                );
                widget.onLongPress?.call(conductor, punto);
              },
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

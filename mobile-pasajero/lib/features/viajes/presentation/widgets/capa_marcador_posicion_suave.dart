import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

/// Marcador que interpola entre updates GPS (evita saltos del pin).
class CapaMarcadorPosicionSuave extends StatefulWidget {
  final LatLng? destino;
  final double width;
  final double height;
  final Alignment alignment;
  final Widget Function(BuildContext context, LatLng puntoVisible) builder;

  const CapaMarcadorPosicionSuave({
    super.key,
    required this.destino,
    required this.builder,
    this.width = 148,
    this.height = 88,
    this.alignment = Alignment.center,
  });

  @override
  State<CapaMarcadorPosicionSuave> createState() =>
      _CapaMarcadorPosicionSuaveState();
}

class _CapaMarcadorPosicionSuaveState extends State<CapaMarcadorPosicionSuave>
    with SingleTickerProviderStateMixin {
  static const Distance _distancia = Distance();

  late final AnimationController _controller;
  Animation<double>? _latAnim;
  Animation<double>? _lngAnim;
  LatLng? _visible;
  LatLng? _destinoActual;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this)
      ..addListener(() {
        if (mounted) {
          setState(() {});
        }
      });
    final destino = widget.destino;
    if (destino != null) {
      _visible = destino;
      _destinoActual = destino;
      _latAnim = AlwaysStoppedAnimation(destino.latitude);
      _lngAnim = AlwaysStoppedAnimation(destino.longitude);
    }
  }

  @override
  void didUpdateWidget(covariant CapaMarcadorPosicionSuave oldWidget) {
    super.didUpdateWidget(oldWidget);
    final destino = widget.destino;
    if (destino == null) {
      _visible = null;
      _destinoActual = null;
      _controller.stop();
      return;
    }
    if (_destinoActual != null &&
        _casiIgual(_destinoActual!, destino)) {
      return;
    }
    _animarHacia(destino);
  }

  void _animarHacia(LatLng destino) {
    final desde = _puntoVisible() ?? destino;
    _destinoActual = destino;
    if (_casiIgual(desde, destino)) {
      _visible = destino;
      _latAnim = AlwaysStoppedAnimation(destino.latitude);
      _lngAnim = AlwaysStoppedAnimation(destino.longitude);
      _controller.stop();
      return;
    }

    final metros = _distancia.as(LengthUnit.Meter, desde, destino);
    // ~28 m/s visual → fluido entre fixes de emulador/GPS sin “teleport”.
    final ms = (metros / 28.0 * 1000.0).clamp(700.0, 3200.0).round();

    _controller.duration = Duration(milliseconds: ms);
    _latAnim = Tween<double>(begin: desde.latitude, end: destino.latitude)
        .animate(CurvedAnimation(parent: _controller, curve: Curves.linear));
    _lngAnim = Tween<double>(begin: desde.longitude, end: destino.longitude)
        .animate(CurvedAnimation(parent: _controller, curve: Curves.linear));
    _controller
      ..reset()
      ..forward().whenComplete(() {
        if (!mounted) {
          return;
        }
        _visible = destino;
      });
  }

  LatLng? _puntoVisible() {
    final latAnim = _latAnim;
    final lngAnim = _lngAnim;
    if (latAnim == null || lngAnim == null) {
      return _visible;
    }
    if (_controller.isAnimating) {
      return LatLng(latAnim.value, lngAnim.value);
    }
    return _visible ?? LatLng(latAnim.value, lngAnim.value);
  }

  bool _casiIgual(LatLng a, LatLng b) {
    return (a.latitude - b.latitude).abs() < 0.0000005 &&
        (a.longitude - b.longitude).abs() < 0.0000005;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final punto = _puntoVisible();
    if (punto == null) {
      return const SizedBox.shrink();
    }

    return MarkerLayer(
      markers: [
        Marker(
          point: punto,
          width: widget.width,
          height: widget.height,
          alignment: widget.alignment,
          child: widget.builder(context, punto),
        ),
      ],
    );
  }
}

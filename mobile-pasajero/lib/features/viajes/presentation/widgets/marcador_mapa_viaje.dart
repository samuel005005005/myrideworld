import 'package:flutter/material.dart';

/// Pin táctil del mapa de viaje activo (conductor / recogida / destino).
class MarcadorMapaViaje extends StatelessWidget {
  final Color color;
  final IconData icono;
  final String etiqueta;
  final VoidCallback? onTap;
  final bool conPunta;

  const MarcadorMapaViaje({
    super.key,
    required this.color,
    required this.icono,
    required this.etiqueta,
    this.onTap,
    this.conPunta = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            constraints: const BoxConstraints(maxWidth: 120),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.12),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Text(
              etiqueta,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          ),
          const SizedBox(height: 4),
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 3),
              boxShadow: [
                BoxShadow(
                  color: color.withValues(alpha: 0.35),
                  blurRadius: 10,
                  spreadRadius: 1,
                ),
              ],
            ),
            child: Icon(icono, color: Colors.white, size: 22),
          ),
          if (conPunta)
            CustomPaint(
              size: const Size(14, 10),
              painter: _PuntaMarcadorPainter(color),
            ),
        ],
      ),
    );
  }
}

class _PuntaMarcadorPainter extends CustomPainter {
  final Color color;

  _PuntaMarcadorPainter(this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width / 2, size.height)
      ..lineTo(size.width, 0)
      ..close();
    canvas.drawPath(path, Paint()..color = color);
  }

  @override
  bool shouldRepaint(covariant _PuntaMarcadorPainter oldDelegate) {
    return oldDelegate.color != color;
  }
}

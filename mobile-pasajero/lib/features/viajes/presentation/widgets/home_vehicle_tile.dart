import 'package:flutter/material.dart';

import '../../../../core/constants/app_strings.dart';
import '../../domain/entities/metodo_pago.dart';
import '../../domain/services/calculadora_tarifa.dart';

class HomeVehicleTile extends StatelessWidget {
  final String id;
  final String name;
  final String eta;
  final int capacity;
  final double basePrice;
  final IconData icon;
  final String selectedId;
  final MetodoPago metodoPago;
  final Color brandPrimary;
  final VoidCallback onTap;

  const HomeVehicleTile({
    super.key,
    required this.id,
    required this.name,
    required this.eta,
    required this.capacity,
    required this.basePrice,
    required this.icon,
    required this.selectedId,
    required this.metodoPago,
    required this.brandPrimary,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final selected = selectedId == id;
    final borderColor = selected ? brandPrimary : Colors.transparent;
    final bgColor = selected
        ? brandPrimary.withValues(alpha: 0.08)
        : Colors.transparent;
    final finalPrice = metodoPago == MetodoPago.tarjeta
        ? basePrice * (1 + CalculadoraTarifa.comisionTarjeta)
        : basePrice;

    return InkWell(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: bgColor,
          border: Border.all(color: borderColor, width: 2),
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        child: Row(
          children: [
            Icon(icon, size: 40, color: Colors.black87),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.person, size: 14, color: Colors.black54),
                      Text(
                        capacity.toString(),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    eta,
                    style: const TextStyle(fontSize: 13, color: Colors.black54),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  AppStrings.homePrecioVehiculo(finalPrice),
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                if (metodoPago == MetodoPago.tarjeta)
                  const Text(
                    AppStrings.homeCardFeeIncluded,
                    style: TextStyle(fontSize: 10, color: Colors.black54),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';

import '../../../../core/constants/app_strings.dart';

class HomeVehicleTile extends StatelessWidget {
  final String id;
  final String name;
  final String eta;
  final int capacity;
  final double? tarifaOficial;
  final bool estimandoTarifa;
  final IconData icon;
  final String selectedId;
  final Color brandPrimary;
  final VoidCallback onTap;

  const HomeVehicleTile({
    super.key,
    required this.id,
    required this.name,
    required this.eta,
    required this.capacity,
    required this.tarifaOficial,
    this.estimandoTarifa = false,
    required this.icon,
    required this.selectedId,
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
    final precioTexto = tarifaOficial == null
        ? AppStrings.homePrecioNoDisponible
        : AppStrings.homePrecioVehiculo(tarifaOficial!);

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
            Icon(icon, size: 36, color: Colors.black87),
            const SizedBox(width: 12),
            Expanded(
              flex: 3,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: Colors.black87,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
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
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 13, color: Colors.black54),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Flexible(
              flex: 2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerRight,
                    child: Text(
                      precioTexto,
                      maxLines: 1,
                      textAlign: TextAlign.end,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                  if (estimandoTarifa && tarifaOficial == null)
                    Text(
                      AppStrings.homeTarifaPendienteApi,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.end,
                      style: const TextStyle(
                        fontSize: 10,
                        color: Colors.black54,
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

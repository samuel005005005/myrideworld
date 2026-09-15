import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../../domain/entities/viaje.dart';
import '../controllers/historial_controller.dart';
import '../utils/formato_ruta_viaje.dart';

class ViajesHistoryPage extends ConsumerWidget {
  const ViajesHistoryPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const borderGrey = Color(0xFFE2E8F0);
    const bgGrey = Color(0xFFF8FAFC);

    final estado = ref.watch(historialControllerProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          AppStrings.historyTitle,
          style: TextStyle(
            color: textDark,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: textDark),
          onPressed: () => context.pop(),
        ),
      ),
      body: estado.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('$error', textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () =>
                      ref.read(historialControllerProvider.notifier).refrescar(),
                  child: const Text(AppStrings.historyRetry),
                ),
              ],
            ),
          ),
        ),
        data: (viajes) {
          if (viajes.isEmpty) {
            return const Center(child: Text(AppStrings.historyEmpty));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: viajes.length,
            separatorBuilder: (context, index) =>
                const Divider(color: borderGrey, height: 24),
            itemBuilder: (context, index) {
              return _ViajeHistorialTile(
                viaje: viajes[index],
                textDark: textDark,
                textGrey: textGrey,
                bgGrey: bgGrey,
              );
            },
          );
        },
      ),
    );
  }
}

class _ViajeHistorialTile extends StatelessWidget {
  final Viaje viaje;
  final Color textDark;
  final Color textGrey;
  final Color bgGrey;

  const _ViajeHistorialTile({
    required this.viaje,
    required this.textDark,
    required this.textGrey,
    required this.bgGrey,
  });

  @override
  Widget build(BuildContext context) {
    final completado = viaje.estado.toLowerCase() == 'completado';
    final fecha = viaje.fechaCreacion;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bgGrey,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                '${fecha.day}/${fecha.month}/${fecha.year}',
                style: TextStyle(
                  fontSize: 12,
                  color: textGrey,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  AppStrings.formatoMoneda(viaje.tarifaEstimada),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.end,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: textDark,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.directions_car,
                  size: 20,
                  color: textDark,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  FormatoRutaViaje.deViaje(viaje),
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: textDark,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: completado
                  ? Colors.green.withValues(alpha: 0.1)
                  : Colors.orange.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              viaje.estado,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: completado
                    ? Colors.green.shade700
                    : Colors.orange.shade800,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_theme.dart';
import '../../domain/entities/viaje.dart';
import '../controllers/historial_controller.dart';

class HistorialPage extends ConsumerWidget {
  const HistorialPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final estado = ref.watch(historialControllerProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          AppStrings.historialTitulo,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
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
                  child: const Text(AppStrings.historialReintentar),
                ),
              ],
            ),
          ),
        ),
        data: (viajes) {
          if (viajes.isEmpty) {
            return const Center(child: Text(AppStrings.historialVacio));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(20),
            itemCount: viajes.length,
            itemBuilder: (context, index) {
              return _ViajeHistorialTile(viaje: viajes[index]);
            },
          );
        },
      ),
    );
  }
}

class _ViajeHistorialTile extends StatelessWidget {
  final Viaje viaje;

  const _ViajeHistorialTile({required this.viaje});

  @override
  Widget build(BuildContext context) {
    final fecha = viaje.fechaCreacion;

    return Card(
      elevation: 0,
      color: const Color(0xFFF8FAFC),
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppTheme.borderGrey),
      ),
      child: ListTile(
        title: Text(
          AppStrings.formatoMoneda(viaje.tarifaEstimada),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
        subtitle: Text(
          '${viaje.estado} · ${AppStrings.formatoOrigenCorto(viaje.origenLat, viaje.origenLng)}',
        ),
        trailing: Text(
          '${fecha.day}/${fecha.month}/${fecha.year}',
          style: const TextStyle(color: AppTheme.textGrey, fontSize: 12),
        ),
      ),
    );
  }
}

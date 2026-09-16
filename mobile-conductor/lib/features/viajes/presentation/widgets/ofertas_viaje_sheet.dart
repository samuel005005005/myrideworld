import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_theme.dart';
import '../controllers/home_conductor_controller.dart';
import '../controllers/home_conductor_state.dart';
import '../models/oferta_en_cola.dart';

/// Bottom sheet con lista de ofertas para que el conductor elija.
class OfertasViajeSheet extends ConsumerWidget {
  const OfertasViajeSheet({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final estado = ref.watch(homeConductorControllerProvider);
    final ofertas = estado.ofertas;

    ref.listen<HomeConductorState>(homeConductorControllerProvider, (
      _,
      siguiente,
    ) {
      if (siguiente.ofertas.isEmpty &&
          context.mounted &&
          Navigator.of(context).canPop()) {
        Navigator.of(context).pop();
      }
    });

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              AppStrings.homeOfertasTitulo,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: AppTheme.onlineGreen,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              AppStrings.formatoOfertasCantidad(ofertas.length),
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 12),
            ConstrainedBox(
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.55,
              ),
              child: ListView.separated(
                shrinkWrap: true,
                itemCount: ofertas.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  return _TarjetaOferta(
                    oferta: ofertas[index],
                    estado: estado,
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TarjetaOferta extends ConsumerWidget {
  final OfertaEnCola oferta;
  final HomeConductorState estado;

  const _TarjetaOferta({
    required this.oferta,
    required this.estado,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final viaje = oferta.viaje;
    final aceptando =
        estado.aceptandoViaje && estado.aceptandoViajeId == viaje.id;
    final rechazando =
        estado.rechazandoViaje && estado.rechazandoViajeId == viaje.id;
    final ocupado = estado.aceptandoViaje || estado.rechazandoViaje;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderGrey),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            AppStrings.formatoTarifa(viaje.tarifaEstimada),
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: AppTheme.textDark,
            ),
          ),
          const SizedBox(height: 12),
          _InfoChip(
            icon: Icons.trip_origin,
            label: oferta.origenTexto ?? AppStrings.viajeOrigenCargando,
          ),
          const SizedBox(height: 8),
          _InfoChip(
            icon: Icons.flag_outlined,
            label: oferta.destinoTexto ?? AppStrings.viajeDestinoCargando,
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.brandPrimary,
              foregroundColor: Colors.black87,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0,
            ),
            onPressed: ocupado
                ? null
                : () async {
                    final viajeAceptado = await ref
                        .read(homeConductorControllerProvider.notifier)
                        .aceptarViaje(viaje);
                    if (!context.mounted || viajeAceptado == null) {
                      return;
                    }
                    context.go('/viaje-active', extra: viajeAceptado);
                  },
            child: aceptando
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.black87,
                    ),
                  )
                : const Text(
                    AppStrings.homeAceptarViaje,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
          ),
          const SizedBox(height: 8),
          OutlinedButton(
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.textDark,
              padding: const EdgeInsets.symmetric(vertical: 12),
              side: const BorderSide(color: AppTheme.borderGrey),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: ocupado
                ? null
                : () async {
                    await ref
                        .read(homeConductorControllerProvider.notifier)
                        .rechazarViaje(viaje);
                  },
            child: rechazando
                ? const SizedBox(
                    height: 18,
                    width: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text(
                    AppStrings.homeRechazarViaje,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: AppTheme.brandPrimary),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppTheme.textDark,
            ),
          ),
        ),
      ],
    );
  }
}

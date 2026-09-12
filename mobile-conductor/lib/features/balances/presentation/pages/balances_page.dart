import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_theme.dart';
import '../controllers/balances_controller.dart';

class BalancesPage extends ConsumerWidget {
  const BalancesPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final estado = ref.watch(balancesControllerProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          AppStrings.balancesTitulo,
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
                      ref.read(balancesControllerProvider.notifier).refrescar(),
                  child: const Text(AppStrings.balancesReintentar),
                ),
              ],
            ),
          ),
        ),
        data: (pagos) {
          if (pagos.isEmpty) {
            return const Center(child: Text(AppStrings.balancesVacio));
          }

          final totalNeto = pagos.fold<double>(
            0,
            (sum, pago) => sum + pago.montoNeto,
          );

          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.brandPrimaryLight,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      AppStrings.balancesTotalNeto,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: AppTheme.textGrey,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      AppStrings.formatoMoneda(totalNeto),
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.textDark,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              ...pagos.map(
                (pago) => Card(
                  elevation: 0,
                  color: const Color(0xFFF8FAFC),
                  margin: const EdgeInsets.only(bottom: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: const BorderSide(color: AppTheme.borderGrey),
                  ),
                  child: ListTile(
                    title: Text(
                      AppStrings.formatoMoneda(pago.montoNeto),
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                    subtitle: Text(
                      '${pago.metodo} · fee ${AppStrings.formatoMoneda(pago.feeProcesamiento)}',
                    ),
                    trailing: Text(
                      '${pago.fecha.day}/${pago.fecha.month}',
                      style: const TextStyle(color: AppTheme.textGrey),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

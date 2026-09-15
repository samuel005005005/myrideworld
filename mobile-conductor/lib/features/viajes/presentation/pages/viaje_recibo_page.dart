import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../balances/domain/entities/pago_balance.dart';

class ViajeReciboPage extends StatelessWidget {
  final PagoBalance pago;

  const ViajeReciboPage({super.key, required this.pago});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              const Icon(Icons.check_circle, color: AppTheme.onlineGreen, size: 80),
              const SizedBox(height: 20),
              const Text(
                AppStrings.reciboTitulo,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.textDark,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                AppStrings.reciboSubtitulo,
                textAlign: TextAlign.center,
                style: TextStyle(color: AppTheme.textGrey),
              ),
              const SizedBox(height: 32),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderGrey),
                ),
                child: Column(
                  children: [
                    const Text(
                      AppStrings.reciboNetoLabel,
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textGrey,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      AppStrings.formatoMoneda(pago.montoNeto),
                      style: const TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const Divider(height: 32),
                    _fila(AppStrings.reciboBrutoLabel, pago.montoBruto),
                    _fila(AppStrings.reciboFeeLabel, pago.feeProcesamiento),
                    _filaTexto(AppStrings.reciboMetodoLabel, pago.metodo),
                  ],
                ),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () => context.go('/home'),
                child: const Text(AppStrings.reciboVolverHome),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _fila(String label, double valor) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(color: AppTheme.textGrey),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            AppStrings.formatoMoneda(valor),
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }

  Widget _filaTexto(String label, String valor) {
    return Row(
      children: [
        Expanded(
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(color: AppTheme.textGrey),
          ),
        ),
        const SizedBox(width: 8),
        Flexible(
          child: Text(
            valor,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.end,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ),
      ],
    );
  }
}

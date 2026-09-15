import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../controllers/home_conductor_controller.dart';

class HomeConductorDrawer extends ConsumerWidget {
  const HomeConductorDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sesion = ref.watch(authControllerProvider).asData?.value;

    return Drawer(
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: SafeArea(
        child: Column(
          children: [
            InkWell(
              onTap: () {
                context.pop();
                context.push('/perfil');
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.only(
                  left: 24,
                  right: 24,
                  top: 40,
                  bottom: 24,
                ),
                child: Row(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppTheme.brandPrimary,
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.brandPrimary.withValues(alpha: 0.2),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: CircleAvatar(
                        radius: 32,
                        backgroundColor: AppTheme.brandPrimaryLight,
                        child: Text(
                          _inicial(
                            sesion?.nombreCompleto ?? sesion?.email,
                          ),
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textDark,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            sesion?.nombreCompleto ??
                                AppStrings.homeDrawerTitulo,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: AppTheme.textDark,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            sesion?.email ?? AppStrings.homeDrawerSinEmail,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: AppTheme.textDark.withValues(alpha: 0.65),
                              fontWeight: FontWeight.w500,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 32),
              leading: const Icon(Icons.person_outline),
              title: const Text(
                AppStrings.homeDrawerPerfil,
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              onTap: () {
                context.pop();
                context.push('/perfil');
              },
            ),
            ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 32),
              leading: const Icon(Icons.account_balance_wallet_outlined),
              title: const Text(
                AppStrings.homeDrawerBalances,
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              onTap: () {
                context.pop();
                context.push('/balances');
              },
            ),
            ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 32),
              leading: const Icon(Icons.history),
              title: const Text(
                AppStrings.homeDrawerHistorial,
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              onTap: () {
                context.pop();
                context.push('/historial');
              },
            ),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.all(32),
              child: TextButton.icon(
                onPressed: () async {
                  Navigator.of(context).pop();
                  await ref
                      .read(homeConductorControllerProvider.notifier)
                      .cerrarSesion();
                  if (context.mounted) {
                    context.go('/login');
                  }
                },
                style: TextButton.styleFrom(
                  foregroundColor: Colors.red.shade500,
                  alignment: Alignment.centerLeft,
                  padding: EdgeInsets.zero,
                ),
                icon: const Icon(Icons.logout, size: 22),
                label: const Text(
                  AppStrings.homeDrawerLogout,
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _inicial(String? valor) {
    if (valor == null || valor.isEmpty) {
      return 'C';
    }
    return valor[0].toUpperCase();
  }
}

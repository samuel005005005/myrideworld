import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';

class HomeDrawer extends ConsumerWidget {
  const HomeDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const textDark = Color(0xFF1E293B);
    const brandPrimary = Color(0xFFF59E0B);
    final usuario = ref.watch(authControllerProvider).asData?.value;

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
                        border: Border.all(color: brandPrimary, width: 2),
                        boxShadow: [
                          BoxShadow(
                            color: brandPrimary.withValues(alpha: 0.2),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const CircleAvatar(
                        radius: 32,
                        backgroundColor: Colors.white,
                        child: Icon(Icons.person, size: 32),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            usuario?.nombreCompleto ??
                                AppStrings.homeDrawerSinSesion,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: textDark,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            usuario?.email ?? AppStrings.homeDrawerSinEmail,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: textDark.withValues(alpha: 0.65),
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
            const SizedBox(height: 16),
            _DrawerItem(
              icon: Icons.history,
              title: AppStrings.homeDrawerTrips,
              onTap: () {
                context.pop();
                context.push('/history');
              },
            ),
            _DrawerItem(
              icon: Icons.credit_card,
              title: AppStrings.homeDrawerPaymentMethods,
              onTap: () {
                context.pop();
                context.push('/pagos');
              },
            ),
            _DrawerItem(
              icon: Icons.local_offer_outlined,
              title: AppStrings.homeDrawerPromotions,
              onTap: () => context.pop(),
            ),
            _DrawerItem(
              icon: Icons.support_agent,
              title: AppStrings.homeDrawerSupport,
              onTap: () {
                context.pop();
                context.push('/ayuda');
              },
            ),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.all(32),
              child: TextButton.icon(
                onPressed: () async {
                  await ref.read(authControllerProvider.notifier).logout();
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
}

class _DrawerItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _DrawerItem({
    required this.icon,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 32, vertical: 4),
      leading: Icon(icon, color: const Color(0xFF1E293B), size: 26),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: Color(0xFF1E293B),
        ),
      ),
      onTap: onTap,
    );
  }
}

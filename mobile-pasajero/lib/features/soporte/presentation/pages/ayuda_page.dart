import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../core/constants/app_strings.dart';
import '../controllers/ayuda_controller.dart';

class AyudaPage extends ConsumerWidget {
  const AyudaPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const brandPrimary = Color(0xFFF59E0B);
    final estado = ref.watch(ayudaControllerProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          AppStrings.ayudaTitulo,
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
                      ref.read(ayudaControllerProvider.notifier).refrescar(),
                  child: const Text(AppStrings.ayudaReintentar),
                ),
              ],
            ),
          ),
        ),
        data: (contacto) => ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const Text(
              AppStrings.ayudaPregunta,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: textDark,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              AppStrings.ayudaSubtitulo,
              style: TextStyle(fontSize: 14, color: textGrey),
            ),
            const SizedBox(height: 32),
            _SupportCard(
              icon: Icons.phone_in_talk,
              iconColor: Colors.blue.shade600,
              title: AppStrings.ayudaLlamarTitulo,
              subtitle: contacto.tieneTelefono
                  ? contacto.telefono!
                  : AppStrings.ayudaContactoNoConfigurado,
              onTap: contacto.tieneTelefono
                  ? () => _abrirUri(
                        context,
                        Uri(scheme: 'tel', path: contacto.telefono),
                      )
                  : null,
            ),
            const SizedBox(height: 16),
            _SupportCard(
              icon: Icons.message,
              iconColor: Colors.green.shade600,
              title: AppStrings.ayudaWhatsappTitulo,
              subtitle: contacto.tieneWhatsapp
                  ? contacto.whatsapp!
                  : AppStrings.ayudaContactoNoConfigurado,
              onTap: contacto.tieneWhatsapp
                  ? () => _abrirUri(
                        context,
                        Uri.parse(
                          'https://wa.me/${contacto.whatsapp!.replaceAll(RegExp(r'[^0-9]'), '')}',
                        ),
                      )
                  : null,
            ),
            const SizedBox(height: 16),
            _SupportCard(
              icon: Icons.luggage,
              iconColor: brandPrimary,
              title: AppStrings.ayudaObjetosTitulo,
              subtitle: AppStrings.ayudaObjetosDesc,
              onTap: contacto.tieneTelefono
                  ? () => _abrirUri(
                        context,
                        Uri(scheme: 'tel', path: contacto.telefono),
                      )
                  : null,
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _abrirUri(BuildContext context, Uri uri) async {
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text(AppStrings.ayudaNoSePudoAbrir)),
      );
    }
  }
}

class _SupportCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final VoidCallback? onTap;

  const _SupportCard({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final habilitado = onTap != null;

    return Opacity(
      opacity: habilitado ? 1 : 0.5,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: Colors.grey.shade200),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: iconColor, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Color(0xFF1E293B),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }
}

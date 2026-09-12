import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AyudaPage extends StatelessWidget {
  const AyudaPage({super.key});

  @override
  Widget build(BuildContext context) {
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const brandPrimary = Color(0xFFF59E0B);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Ayuda y Soporte',
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
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Text(
            '¿En qué podemos ayudarte?',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: textDark,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Soporte oficial de la Asociación de Taxis Turísticos 24/7.',
            style: TextStyle(fontSize: 14, color: textGrey),
          ),
          const SizedBox(height: 32),

          _buildSupportCard(
            icon: Icons.phone_in_talk,
            iconColor: Colors.blue.shade600,
            title: 'Llamar a la Central',
            subtitle: 'Atención inmediata por operador',
            onTap: () {},
          ),
          const SizedBox(height: 16),
          _buildSupportCard(
            icon: Icons.message,
            iconColor: Colors.green.shade600,
            title: 'WhatsApp Oficial',
            subtitle: 'Escríbenos para asistencia rápida',
            onTap: () {},
          ),
          const SizedBox(height: 16),
          _buildSupportCard(
            icon: Icons.luggage,
            iconColor: brandPrimary,
            title: 'Objetos Perdidos',
            subtitle: 'Reporta algo que olvidaste en el taxi',
            onTap: () {},
          ),
          const SizedBox(height: 16),
          _buildSupportCard(
            icon: Icons.receipt_long,
            iconColor: Colors.purple.shade600,
            title: 'Solicitar Factura (NCF)',
            subtitle: 'Comprobantes fiscales corporativos',
            onTap: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildSupportCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: Colors.grey.shade200),
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.1),
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
    );
  }
}

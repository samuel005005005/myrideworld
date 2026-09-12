import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class PerfilPage extends StatelessWidget {
  const PerfilPage({super.key});

  @override
  Widget build(BuildContext context) {
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const brandPrimary = Color(0xFFF59E0B);
    const bgGrey = Color(0xFFF8FAFC);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Mi Perfil',
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            // Profile Picture
            Center(
              child: Stack(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: brandPrimary, width: 2),
                    ),
                    child: const CircleAvatar(
                      radius: 50,
                      backgroundColor: bgGrey,
                      backgroundImage: NetworkImage(
                        'https://randomuser.me/api/portraits/men/44.jpg',
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: const BoxDecoration(
                        color: brandPrimary,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.edit,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Form Fields
            _buildTextField(
              label: 'Nombre Completo',
              initialValue: 'Juan Pérez',
            ),
            const SizedBox(height: 16),
            _buildTextField(label: 'Teléfono', initialValue: '+1 809 123 4567'),
            const SizedBox(height: 16),
            _buildTextField(
              label: 'Correo Electrónico',
              initialValue: 'juan.perez@email.com',
            ),

            const SizedBox(height: 48),

            // Save Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  context.pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Perfil actualizado exitosamente.'),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: brandPrimary,
                  foregroundColor: Colors.black87,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Guardar Cambios',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required String initialValue,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Color(0xFF64748B),
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          initialValue: initialValue,
          style: const TextStyle(
            fontWeight: FontWeight.w500,
            color: Color(0xFF1E293B),
          ),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.grey.shade100,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 16,
            ),
          ),
        ),
      ],
    );
  }
}

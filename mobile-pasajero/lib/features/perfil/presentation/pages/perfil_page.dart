import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../controllers/perfil_controller.dart';
import '../controllers/perfil_state.dart';
import '../controllers/perfil_state_status.dart';

class PerfilPage extends ConsumerStatefulWidget {
  const PerfilPage({super.key});

  @override
  ConsumerState<PerfilPage> createState() => _PerfilPageState();
}

class _PerfilPageState extends ConsumerState<PerfilPage> {
  final _nombreController = TextEditingController();
  final _telefonoController = TextEditingController();
  final _emailController = TextEditingController();
  var _camposSincronizados = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(perfilControllerProvider.notifier).cargar();
    });
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _telefonoController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _sincronizarCampos(PerfilState estado) {
    final perfil = estado.perfil;
    if (perfil == null || _camposSincronizados) {
      return;
    }
    _nombreController.text = perfil.nombreCompleto;
    _telefonoController.text = perfil.telefono ?? '';
    _emailController.text = perfil.email;
    _camposSincronizados = true;
  }

  @override
  Widget build(BuildContext context) {
    const textDark = Color(0xFF1E293B);
    const brandPrimary = Color(0xFFF59E0B);
    const bgGrey = Color(0xFFF8FAFC);

    final estado = ref.watch(perfilControllerProvider);
    _sincronizarCampos(estado);

    ref.listen<PerfilState>(perfilControllerProvider, (anterior, siguiente) {
      if (siguiente.guardadoOk && !(anterior?.guardadoOk ?? false) && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text(AppStrings.perfilActualizadoOk)),
        );
        context.pop();
      }

      final error = siguiente.errorMessage;
      if (error != null &&
          error != anterior?.errorMessage &&
          siguiente.status == PerfilStateStatus.error &&
          mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error)),
        );
      }
    });

    final cargando = estado.status == PerfilStateStatus.loading;
    final guardando = estado.status == PerfilStateStatus.saving;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          AppStrings.perfilTitulo,
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
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Center(
                    child: Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: brandPrimary, width: 2),
                      ),
                      child: CircleAvatar(
                        radius: 50,
                        backgroundColor: bgGrey,
                        child: Text(
                          _iniciales(_nombreController.text),
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: textDark,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  _buildTextField(
                    label: AppStrings.perfilNombreLabel,
                    controller: _nombreController,
                    enabled: !guardando,
                  ),
                  const SizedBox(height: 16),
                  _buildTextField(
                    label: AppStrings.perfilTelefonoLabel,
                    controller: _telefonoController,
                    enabled: !guardando,
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: 16),
                  _buildTextField(
                    label: AppStrings.perfilEmailLabel,
                    controller: _emailController,
                    enabled: false,
                  ),
                  const SizedBox(height: 8),
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      AppStrings.perfilEmailSoloLectura,
                      style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                    ),
                  ),
                  const SizedBox(height: 48),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: guardando
                          ? null
                          : () async {
                              await ref
                                  .read(perfilControllerProvider.notifier)
                                  .guardar(
                                    nombreCompleto: _nombreController.text,
                                    telefono: _telefonoController.text,
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
                      child: guardando
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text(
                              AppStrings.perfilGuardar,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  String _iniciales(String nombre) {
    final partes = nombre.trim().split(RegExp(r'\s+'));
    if (partes.isEmpty || partes.first.isEmpty) {
      return '?';
    }
    if (partes.length == 1) {
      return partes.first[0].toUpperCase();
    }
    return '${partes.first[0]}${partes.last[0]}'.toUpperCase();
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    required bool enabled,
    TextInputType? keyboardType,
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
        TextField(
          controller: controller,
          enabled: enabled,
          keyboardType: keyboardType,
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

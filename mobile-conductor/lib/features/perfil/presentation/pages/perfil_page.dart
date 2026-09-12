import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_theme.dart';
import '../controllers/perfil_controller.dart';
import '../controllers/perfil_state.dart';
import '../controllers/perfil_state_status.dart';

class PerfilPage extends ConsumerStatefulWidget {
  const PerfilPage({super.key});

  @override
  ConsumerState<PerfilPage> createState() => _PerfilPageState();
}

class _PerfilPageState extends ConsumerState<PerfilPage> {
  final _nombre = TextEditingController();
  final _telefono = TextEditingController();
  final _email = TextEditingController();
  final _marca = TextEditingController();
  final _modelo = TextEditingController();
  final _color = TextEditingController();
  final _placa = TextEditingController();
  var _sincronizado = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(perfilControllerProvider.notifier).cargar();
    });
  }

  @override
  void dispose() {
    _nombre.dispose();
    _telefono.dispose();
    _email.dispose();
    _marca.dispose();
    _modelo.dispose();
    _color.dispose();
    _placa.dispose();
    super.dispose();
  }

  void _sync(PerfilState estado) {
    final perfil = estado.perfil;
    if (perfil == null || _sincronizado) {
      return;
    }
    _nombre.text = perfil.nombreCompleto;
    _telefono.text = perfil.telefono;
    _email.text = perfil.email;
    _marca.text = perfil.vehiculoMarca;
    _modelo.text = perfil.vehiculoModelo;
    _color.text = perfil.vehiculoColor;
    _placa.text = perfil.vehiculoPlaca;
    _sincronizado = true;
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(perfilControllerProvider);
    _sync(estado);

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
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
      }
    });

    final cargando = estado.status == PerfilStateStatus.loading;
    final guardando = estado.status == PerfilStateStatus.saving;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          AppStrings.perfilTitulo,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(24),
              children: [
                Center(
                  child: CircleAvatar(
                    radius: 44,
                    backgroundColor: AppTheme.brandPrimaryLight,
                    child: Text(
                      (_nombre.text.isEmpty ? 'C' : _nombre.text[0])
                          .toUpperCase(),
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textDark,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                _campo(AppStrings.perfilNombreLabel, _nombre, !guardando),
                _campo(AppStrings.perfilTelefonoLabel, _telefono, !guardando,
                    keyboard: TextInputType.phone),
                _campo(AppStrings.perfilEmailLabel, _email, false),
                const SizedBox(height: 8),
                Text(
                  AppStrings.perfilVehiculoSeccion,
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textDark.withValues(alpha: 0.8),
                  ),
                ),
                const SizedBox(height: 12),
                _campo(AppStrings.perfilMarcaLabel, _marca, !guardando),
                _campo(AppStrings.perfilModeloLabel, _modelo, !guardando),
                _campo(AppStrings.perfilColorLabel, _color, !guardando),
                _campo(AppStrings.perfilPlacaLabel, _placa, !guardando),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: guardando
                      ? null
                      : () {
                          ref.read(perfilControllerProvider.notifier).guardar(
                                nombreCompleto: _nombre.text,
                                telefono: _telefono.text,
                                vehiculoMarca: _marca.text,
                                vehiculoModelo: _modelo.text,
                                vehiculoColor: _color.text,
                                vehiculoPlaca: _placa.text,
                              );
                        },
                  child: guardando
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text(AppStrings.perfilGuardar),
                ),
              ],
            ),
    );
  }

  Widget _campo(
    String label,
    TextEditingController controller,
    bool enabled, {
    TextInputType? keyboard,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppTheme.textGrey,
            ),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: controller,
            enabled: enabled,
            keyboardType: keyboard,
            decoration: InputDecoration(
              filled: true,
              fillColor: Colors.grey.shade100,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

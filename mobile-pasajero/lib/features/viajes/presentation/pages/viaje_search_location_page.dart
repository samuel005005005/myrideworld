import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/constants/ubicaciones_turisticas.dart';

class ViajeSearchLocationPage extends StatefulWidget {
  final String initialPickup;
  final String initialDropoff;
  final bool autofocusDropoff;

  const ViajeSearchLocationPage({
    super.key,
    required this.initialPickup,
    required this.initialDropoff,
    this.autofocusDropoff = true,
  });

  @override
  State<ViajeSearchLocationPage> createState() =>
      _ViajeSearchLocationPageState();
}

class _ViajeSearchLocationPageState extends State<ViajeSearchLocationPage> {
  late TextEditingController _pickupController;
  late TextEditingController _dropoffController;
  late TextEditingController _filtroController;

  @override
  void initState() {
    super.initState();
    _pickupController = TextEditingController(text: widget.initialPickup);
    _dropoffController = TextEditingController(text: widget.initialDropoff);
    _filtroController = TextEditingController();
  }

  @override
  void dispose() {
    _pickupController.dispose();
    _dropoffController.dispose();
    _filtroController.dispose();
    super.dispose();
  }

  List<String> get _resultados {
    final filtro = _filtroController.text.trim().toLowerCase();
    final base = <String>[
      AppStrings.homeMiUbicacion,
      ...UbicacionesTuristicas.resultadosBusqueda,
    ];
    if (filtro.isEmpty) {
      return base;
    }
    return base
        .where((nombre) => nombre.toLowerCase().contains(filtro))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    const textDark = Color(0xFF1E293B);
    const bgGrey = Color(0xFFEEEEEE);
    const dividerColor = Color(0xFFE2E2E2);
    final resultados = _resultados;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: textDark),
                  onPressed: () => context.pop(),
                ),
              ],
            ),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Column(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Colors.grey,
                          shape: BoxShape.circle,
                        ),
                      ),
                      Container(
                        width: 1,
                        height: 36,
                        color: Colors.grey,
                        margin: const EdgeInsets.symmetric(vertical: 4),
                      ),
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Colors.black,
                          shape: BoxShape.rectangle,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      children: [
                        _buildSearchInput(
                          controller: _pickupController,
                          hint: 'Punto de partida',
                          autofocus: !widget.autofocusDropoff,
                          bgGrey: bgGrey,
                          onChanged: (value) {
                            if (!widget.autofocusDropoff) {
                              _filtroController.text = value;
                              setState(() {});
                            }
                          },
                        ),
                        const SizedBox(height: 12),
                        _buildSearchInput(
                          controller: _dropoffController,
                          hint: '¿A dónde vas?',
                          autofocus: widget.autofocusDropoff,
                          bgGrey: bgGrey,
                          onChanged: (value) {
                            if (widget.autofocusDropoff) {
                              _filtroController.text = value;
                              setState(() {});
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Divider(color: dividerColor, height: 1),
            Expanded(
              child: ListView.separated(
                itemCount: resultados.length,
                separatorBuilder: (context, index) =>
                    const Divider(color: dividerColor, indent: 56, height: 1),
                itemBuilder: (context, index) {
                  final result = resultados[index];
                  final esGps = result == AppStrings.homeMiUbicacion;
                  return ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        esGps ? Icons.my_location : Icons.location_on,
                        color: textDark,
                        size: 20,
                      ),
                    ),
                    title: Text(
                      result,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        color: textDark,
                      ),
                    ),
                    subtitle: Text(
                      esGps
                          ? 'Usar GPS del dispositivo'
                          : 'Punta Cana, República Dominicana',
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 12,
                      ),
                    ),
                    onTap: () => context.pop(result),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchInput({
    required TextEditingController controller,
    required String hint,
    required bool autofocus,
    required Color bgGrey,
    required ValueChanged<String> onChanged,
  }) {
    return SizedBox(
      height: 40,
      child: TextField(
        controller: controller,
        autofocus: autofocus,
        onChanged: onChanged,
        style: const TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: 14,
          color: Colors.black87,
        ),
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(6),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: bgGrey,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 12,
            vertical: 10,
          ),
          isDense: true,
          hintText: hint,
          hintStyle: const TextStyle(color: Colors.black54),
        ),
      ),
    );
  }
}

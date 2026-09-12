import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

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

  final List<String> _dummyResults = [
    'Aeropuerto Internacional de Punta Cana (PUJ)',
    'Hard Rock Hotel & Casino Punta Cana',
    'Coco Bongo Punta Cana',
    'Bávaro Beach Resort',
    'Cap Cana Marina',
    'Uvero Alto Plaza',
    'BlueMall Puntacana',
    'Downtown Punta Cana',
  ];

  @override
  void initState() {
    super.initState();
    _pickupController = TextEditingController(text: widget.initialPickup);
    _dropoffController = TextEditingController(text: widget.initialDropoff);
  }

  @override
  void dispose() {
    _pickupController.dispose();
    _dropoffController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const textDark = Color(0xFF1E293B);
    const bgGrey = Color(0xFFEEEEEE);
    const dividerColor = Color(0xFFE2E2E2);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: textDark),
                  onPressed: () => context.pop(),
                ),
              ],
            ),

            // Search Inputs
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  // Vertical Dots
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

                  // Inputs
                  Expanded(
                    child: Column(
                      children: [
                        _buildSearchInput(
                          controller: _pickupController,
                          hint: 'Punto de partida',
                          autofocus: !widget.autofocusDropoff,
                          bgGrey: bgGrey,
                        ),
                        const SizedBox(height: 12),
                        _buildSearchInput(
                          controller: _dropoffController,
                          hint: '¿A dónde vas?',
                          autofocus: widget.autofocusDropoff,
                          bgGrey: bgGrey,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            const Divider(color: dividerColor, height: 1),

            // Results List
            Expanded(
              child: ListView.separated(
                itemCount: _dummyResults.length,
                separatorBuilder: (context, index) =>
                    const Divider(color: dividerColor, indent: 56, height: 1),
                itemBuilder: (context, index) {
                  final result = _dummyResults[index];
                  return ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.location_on,
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
                      'Punta Cana, República Dominicana',
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 12,
                      ),
                    ),
                    onTap: () {
                      // Return the selected location
                      context.pop(result);
                    },
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
  }) {
    return SizedBox(
      height: 40,
      child: TextField(
        controller: controller,
        autofocus: autofocus,
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

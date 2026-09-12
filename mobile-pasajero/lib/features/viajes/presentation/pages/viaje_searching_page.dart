import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';

class ViajeSearchingPage extends ConsumerStatefulWidget {
  const ViajeSearchingPage({super.key});

  @override
  ConsumerState<ViajeSearchingPage> createState() => _ViajeSearchingPageState();
}

class _ViajeSearchingPageState extends ConsumerState<ViajeSearchingPage> {
  @override
  void initState() {
    super.initState();
    // Simulate finding a driver after 4 seconds
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        context.go('/active');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const brandPrimary = Color(0xFFF59E0B);
    const borderGrey = Color(0xFFE2E8F0);

    return Scaffold(
      body: Stack(
        children: [
          // 1. Full Screen Map (OSM)
          Positioned.fill(
            child: FlutterMap(
              options: const MapOptions(
                initialCenter: LatLng(18.5820, -68.3971), // Punta Cana
                initialZoom: 14.0,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.myride',
                ),
              ],
            ),
          ),

          // Map Overlay to darken slightly
          Positioned.fill(
            child: Container(color: Colors.black.withValues(alpha: 0.2)),
          ),

          // 3. Bottom Card
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 20,
                    offset: Offset(0, -5),
                  ),
                ],
              ),
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 32,
                bottom: MediaQuery.of(context).padding.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Loading Indicator
                  const SizedBox(
                    width: 48,
                    height: 48,
                    child: CircularProgressIndicator(
                      color: brandPrimary,
                      strokeWidth: 4,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Title
                  const Text(
                    AppStrings.radarSearchingTitle,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: textDark,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Subtitle
                  const Text(
                    AppStrings.radarNotifying,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 14, color: textGrey),
                  ),

                  const SizedBox(height: 32),

                  // Cancel Button
                  OutlinedButton(
                    onPressed: () {
                      context.go('/home');
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red.shade600,
                      side: BorderSide(color: borderGrey),
                      minimumSize: const Size.fromHeight(56),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      AppStrings.radarCancelBtn,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

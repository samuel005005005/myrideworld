import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';

class ViajesHistoryPage extends ConsumerWidget {
  const ViajesHistoryPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const borderGrey = Color(0xFFE2E8F0);
    const bgGrey = Color(0xFFF8FAFC);

    // Dummy data for MVP UI
    final List<Map<String, dynamic>> dummyTrips = [
      {
        'date': 'Ayer, 14:30',
        'route': 'Aeropuerto Punta Cana → Hard Rock Hotel',
        'price': 'US\$35.00',
        'status': 'Completado',
        'car': 'Sedán',
      },
      {
        'date': '10 Sept, 09:15',
        'route': 'Hard Rock Hotel → Coco Bongo',
        'price': 'US\$25.00',
        'status': 'Completado',
        'car': 'Van Familiar',
      },
      {
        'date': '05 Sept, 18:00',
        'route': 'Bávaro Beach → Aeropuerto Punta Cana',
        'price': 'US\$40.00',
        'status': 'Cancelado',
        'car': 'SUV Premium',
      },
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          AppStrings.historyTitle,
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
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: dummyTrips.length,
        separatorBuilder: (context, index) =>
            const Divider(color: borderGrey, height: 24),
        itemBuilder: (context, index) {
          final trip = dummyTrips[index];
          final isCompleted = trip['status'] == 'Completado';

          return InkWell(
            onTap: () {},
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: bgGrey,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        trip['date'],
                        style: const TextStyle(
                          fontSize: 12,
                          color: textGrey,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        trip['price'],
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: textDark,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.directions_car,
                          size: 20,
                          color: textDark,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              trip['route'],
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: textDark,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              trip['car'],
                              style: const TextStyle(
                                fontSize: 12,
                                color: textGrey,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: isCompleted
                          ? Colors.green.withValues(alpha: 0.1)
                          : Colors.red.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      trip['status'],
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isCompleted
                            ? Colors.green.shade700
                            : Colors.red.shade700,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

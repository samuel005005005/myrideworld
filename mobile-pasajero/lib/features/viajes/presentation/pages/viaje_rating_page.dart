import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_strings.dart';

class ViajeRatingPage extends ConsumerStatefulWidget {
  const ViajeRatingPage({super.key});

  @override
  ConsumerState<ViajeRatingPage> createState() => _ViajeRatingPageState();
}

class _ViajeRatingPageState extends ConsumerState<ViajeRatingPage> {
  int _rating = 0;
  final _commentController = TextEditingController();

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const brandPrimary = Color(0xFFF59E0B);
    const borderGrey = Color(0xFFE2E8F0);
    const bgGrey = Color(0xFFF8FAFC);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 32,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Success Icon
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: Colors.green.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.check_circle,
                        color: Colors.green,
                        size: 48,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Receipt Title
                    Text(
                      AppStrings.ratingTitle,
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: textDark,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Paid Amount
                    const Text(
                      'US\$35.00',
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        color: textDark,
                        letterSpacing: -1.0,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Paid with info
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.money, color: textGrey, size: 16),
                        const SizedBox(width: 6),
                        Text(
                          'Pagado en Efectivo',
                          style: TextStyle(
                            fontSize: 14,
                            color: textGrey,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),

                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 32),
                      child: Divider(color: borderGrey),
                    ),

                    // Rating Section
                    const Text(
                      '${AppStrings.ratingSubtitle} Carlos M.?',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: textDark,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Stars
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(5, (index) {
                        return IconButton(
                          onPressed: () {
                            setState(() {
                              _rating = index + 1;
                            });
                          },
                          icon: Icon(
                            index < _rating ? Icons.star : Icons.star_border,
                            size: 40,
                            color: brandPrimary,
                          ),
                        );
                      }),
                    ),
                    const SizedBox(height: 32),

                    // Comment field
                    TextField(
                      controller: _commentController,
                      maxLines: 3,
                      style: const TextStyle(color: textDark),
                      decoration: InputDecoration(
                        hintText: AppStrings.ratingCommentHint,
                        hintStyle: TextStyle(color: textGrey.withValues(alpha: 0.5)),
                        filled: true,
                        fillColor: bgGrey,
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(
                            color: Colors.transparent,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: borderGrey),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Submit Button
            Padding(
              padding: const EdgeInsets.all(24),
              child: ElevatedButton(
                onPressed: _rating == 0
                    ? null
                    : () {
                        // Submit logic here
                        context.go('/home');
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: brandPrimary,
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: bgGrey,
                  disabledForegroundColor: textGrey,
                  minimumSize: const Size.fromHeight(56),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  AppStrings.ratingSubmitBtn,
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

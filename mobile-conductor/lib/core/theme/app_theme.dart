import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color brandPrimary = Color(0xFFF59E0B);
  static const Color brandPrimaryLight = Color(0xFFFEF3C7);
  static const Color textDark = Color(0xFF1E293B);
  static const Color textGrey = Color(0xFF64748B);
  static const Color borderGrey = Color(0xFFE2E8F0);
  static const Color onlineGreen = Color(0xFF16A34A);

  static ThemeData get light {
    final baseTheme = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFFFDB813),
        primary: const Color(0xFF855300),
        primaryContainer: brandPrimary,
        onPrimaryContainer: const Color(0xFF613B00),
        secondary: const Color(0xFF006A61),
        surface: const Color(0xFFFAF8FF),
        onSurface: textDark,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: Colors.white,
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: textDark,
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: Colors.grey.shade100,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: brandPrimary,
          foregroundColor: Colors.black87,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
      ),
    );

    return baseTheme.copyWith(
      textTheme: GoogleFonts.interTextTheme(baseTheme.textTheme).copyWith(
        displayLarge: GoogleFonts.plusJakartaSans(
          textStyle: baseTheme.textTheme.displayLarge,
        ),
        displayMedium: GoogleFonts.plusJakartaSans(
          textStyle: baseTheme.textTheme.displayMedium,
        ),
        displaySmall: GoogleFonts.plusJakartaSans(
          textStyle: baseTheme.textTheme.displaySmall,
        ),
        headlineLarge: GoogleFonts.plusJakartaSans(
          textStyle: baseTheme.textTheme.headlineLarge,
        ),
        headlineMedium: GoogleFonts.plusJakartaSans(
          textStyle: baseTheme.textTheme.headlineMedium,
        ),
        headlineSmall: GoogleFonts.plusJakartaSans(
          textStyle: baseTheme.textTheme.headlineSmall,
        ),
        titleLarge: GoogleFonts.plusJakartaSans(
          textStyle: baseTheme.textTheme.titleLarge,
        ),
        titleMedium: GoogleFonts.plusJakartaSans(
          textStyle: baseTheme.textTheme.titleMedium,
        ),
        titleSmall: GoogleFonts.plusJakartaSans(
          textStyle: baseTheme.textTheme.titleSmall,
        ),
      ),
    );
  }
}

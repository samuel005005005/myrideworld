import 'package:flutter/material.dart';

import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static ThemeData get light {
    final baseTheme = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFFFDB813), // Taxi Turistico Beron Yellow
        primary: const Color(0xFF855300),
        primaryContainer: const Color(0xFFF59E0B),
        onPrimaryContainer: const Color(0xFF613B00),
        secondary: const Color(0xFF006A61),
        secondaryContainer: const Color(0xFF86F2E4),
        onSecondaryContainer: const Color(0xFF006F66),
        tertiary: const Color(0xFF006C49),
        tertiaryContainer: const Color(0xFF30C88F),
        onTertiaryContainer: const Color(0xFF004E34),
        surface: const Color(0xFFFAF8FF),
        onSurface: const Color(0xFF131B2E),
        error: const Color(0xFFBA1A1A),
        brightness: Brightness.light,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: Colors.grey.shade100,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFFDB813),
          foregroundColor: Colors.black, // Texto negro para contraste
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

  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFFFDB813),
        primary: const Color(0xFFFDB813),
        brightness: Brightness.dark,
      ),
      appBarTheme: const AppBarTheme(centerTitle: true, elevation: 0),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: Colors.grey.shade900,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFFDB813),
          foregroundColor: Colors.black,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }
}

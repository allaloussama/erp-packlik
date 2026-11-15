import 'package:flutter/material.dart';

/// Couleurs de la marque PackLik (les mêmes que le site).
const kOrange = Color(0xFFFD6400);
const kInk = Color(0xFF121920);
const kMuted = Color(0xFF6B7682);
const kLine = Color(0xFFE3E6EB);
const kBg = Color(0xFFF6F7F8);
const kGreen = Color(0xFF1F8A4C);
const kRed = Color(0xFFC2453D);

ThemeData packlikTheme() {
  final scheme = ColorScheme.fromSeed(seedColor: kOrange, primary: kOrange, onPrimary: kInk, secondary: kInk, surface: Colors.white);
  final border = OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: kLine));
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: kBg,
    appBarTheme: const AppBarTheme(backgroundColor: Colors.white, foregroundColor: kInk, elevation: 0, scrolledUnderElevation: 1, centerTitle: false),
    inputDecorationTheme: InputDecorationTheme(
      filled: true, fillColor: Colors.white, border: border, enabledBorder: border,
      focusedBorder: border.copyWith(borderSide: const BorderSide(color: kInk, width: 1.5)),
      errorBorder: border.copyWith(borderSide: const BorderSide(color: kRed)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(backgroundColor: kOrange, foregroundColor: kInk, minimumSize: const Size.fromHeight(50), textStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(foregroundColor: kInk, minimumSize: const Size.fromHeight(46), side: const BorderSide(color: kLine), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)), textStyle: const TextStyle(fontWeight: FontWeight.w700)),
    ),
    chipTheme: ChipThemeData(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)), side: const BorderSide(color: kLine)),
    navigationBarTheme: const NavigationBarThemeData(backgroundColor: Colors.white, indicatorColor: Color(0xFFFFE3CF), height: 66),
    cardTheme: CardThemeData(color: Colors.white, elevation: 0, margin: EdgeInsets.zero, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14), side: const BorderSide(color: kLine))),
  );
}

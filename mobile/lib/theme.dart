import 'package:flutter/material.dart';

/// Couleurs de la marque PackLik (les mêmes que le site).
const kOrange = Color(0xFFFD6400);
const kInk = Color(0xFF121920);
const kMuted = Color(0xFF6B7682);
const kLine = Color(0xFFE3E6EB);
const kBg = Color(0xFFF6F7F8);
const kGreen = Color(0xFF1F8A4C);
const kRed = Color(0xFFC2453D);

// Jetons de l'ERP du site (assets/app.css, :root) : l'espace équipe reprend exactement ces valeurs.
const kErpBg = Color(0xFFF6F7F9);
const kErpInk = Color(0xFF182028);
const kInk2 = Color(0xFF3D4856);
const kErpMuted = Color(0xFF667080);
const kLine2 = Color(0xFFEEF0F3);
const kKraftD = Color(0xFFC74B00);
const kKraftL = Color(0xFFFFE7D6);
const kKraftLL = Color(0xFFFFF5EE);
const kErpGreen = Color(0xFF2F7D4F);
const kAmber = Color(0xFFD99A2B);
const kBlue = Color(0xFF2F6690);
const kViolet = Color(0xFF6A4C93);
const kSide = Color(0xFF121920); // menu latéral (.side)
const kSideHover = Color(0xFF1F2A35);
const kSideText = Color(0xFFC3CBD5);
const kSideGroup = Color(0xFF6C7888);
const kSideCount = Color(0xFF2B3745);

/// Ombre des cartes du site (--sh).
const kErpShadow = [BoxShadow(color: Color(0x0D182028), blurRadius: 2, offset: Offset(0, 1)), BoxShadow(color: Color(0x0A182028), blurRadius: 8, offset: Offset(0, 2))];

/// Thème de l'espace équipe : boutons, champs, onglets et cartes comme l'ERP du site.
ThemeData erpTheme() {
  final base = packlikTheme();
  final border = OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: kLine));
  final shape = RoundedRectangleBorder(borderRadius: BorderRadius.circular(8));
  return base.copyWith(
    scaffoldBackgroundColor: kErpBg,
    colorScheme: base.colorScheme.copyWith(primary: kKraftD, onPrimary: Colors.white, secondary: kErpInk, surfaceTint: Colors.transparent, outline: kLine, outlineVariant: kLine2),
    textTheme: base.textTheme.apply(bodyColor: kErpInk, displayColor: kErpInk),
    dividerTheme: const DividerThemeData(color: kLine2, thickness: 1, space: 1),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white, foregroundColor: kErpInk, surfaceTintColor: Colors.transparent, elevation: 0, scrolledUnderElevation: 0,
      centerTitle: false, titleSpacing: 4, shape: Border(bottom: BorderSide(color: kLine)),
      titleTextStyle: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: kErpInk),
    ),
    inputDecorationTheme: base.inputDecorationTheme.copyWith(
      border: border, enabledBorder: border,
      focusedBorder: border.copyWith(borderSide: const BorderSide(color: kOrange, width: 1.6)),
      errorBorder: border.copyWith(borderSide: const BorderSide(color: kRed)),
      labelStyle: const TextStyle(color: kInk2, fontWeight: FontWeight.w600),
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
    ),
    // .btn.primary du site : encre, texte blanc
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(backgroundColor: kErpInk, foregroundColor: Colors.white, minimumSize: const Size.fromHeight(44), textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14), shape: shape),
    ),
    // .btn du site : blanc, bordure grise
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(foregroundColor: kErpInk, backgroundColor: Colors.white, minimumSize: const Size.fromHeight(42), side: const BorderSide(color: kLine), shape: shape, textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13.5)),
    ),
    textButtonTheme: TextButtonThemeData(style: TextButton.styleFrom(foregroundColor: kKraftD, shape: shape, textStyle: const TextStyle(fontWeight: FontWeight.w700))),
    // .tabs du site : soulignés orange
    tabBarTheme: const TabBarThemeData(
      labelColor: kErpInk, unselectedLabelColor: kErpMuted, indicatorColor: kOrange, indicatorSize: TabBarIndicatorSize.label,
      dividerColor: kLine, labelStyle: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5), unselectedLabelStyle: TextStyle(fontWeight: FontWeight.w600, fontSize: 13.5),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: Colors.white, selectedColor: kKraftL, side: const BorderSide(color: kLine), checkmarkColor: kKraftD,
      labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: kInk2), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    ),
    cardTheme: CardThemeData(color: Colors.white, surfaceTintColor: Colors.transparent, elevation: 0, margin: EdgeInsets.zero, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10), side: const BorderSide(color: kLine))),
    listTileTheme: const ListTileThemeData(iconColor: kErpMuted, titleTextStyle: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: kErpInk), subtitleTextStyle: TextStyle(fontSize: 12.5, color: kErpMuted)),
    dialogTheme: DialogThemeData(backgroundColor: Colors.white, surfaceTintColor: Colors.transparent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)), titleTextStyle: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: kErpInk)),
    bottomSheetTheme: const BottomSheetThemeData(backgroundColor: Colors.white, surfaceTintColor: Colors.transparent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(14)))),
    popupMenuTheme: PopupMenuThemeData(color: Colors.white, surfaceTintColor: Colors.transparent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10), side: const BorderSide(color: kLine))),
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? Colors.white : null),
      trackColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? kKraftD : null),
    ),
    checkboxTheme: CheckboxThemeData(fillColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? kKraftD : null), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4))),
    progressIndicatorTheme: const ProgressIndicatorThemeData(color: kOrange, linearTrackColor: kLine2),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(backgroundColor: kErpInk, foregroundColor: Colors.white, elevation: 2),
    snackBarTheme: const SnackBarThemeData(backgroundColor: kErpInk, behavior: SnackBarBehavior.floating),
  );
}

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

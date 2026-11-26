import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'router.dart';
import 'state.dart';
import 'theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  runApp(ProviderScope(overrides: [prefsProvider.overrideWithValue(prefs)], child: const PackLikApp()));
}

class PackLikApp extends ConsumerWidget {
  const PackLikApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(langProvider);
    return MaterialApp.router(
      title: 'PackLik',
      debugShowCheckedModeBanner: false,
      theme: packlikTheme(),
      routerConfig: appRouter,
      // l'espace équipe (/erp et tous ses écrans) prend le thème de l'ERP du site
      builder: (context, child) => ListenableBuilder(
        listenable: appRouter.routerDelegate,
        builder: (context, _) => appRouter.routerDelegate.currentConfiguration.uri.path.startsWith('/erp') ? Theme(data: erpTheme(), child: child!) : child!,
      ),
      locale: Locale(lang),
      supportedLocales: const [Locale('fr'), Locale('ar')],
      localizationsDelegates: const [GlobalMaterialLocalizations.delegate, GlobalWidgetsLocalizations.delegate, GlobalCupertinoLocalizations.delegate],
    );
  }
}

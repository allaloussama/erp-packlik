import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';

import '../config.dart';
import '../theme.dart';

/// Espace équipe : l'ERP complet du site (tous les modules, tous les rôles : admin, gérant, manager, agent,
/// fournisseur, livreur), avec la session gardée par le téléphone. Appels, WhatsApp, cartes et liens externes
/// s'ouvrent dans les applications du téléphone ; l'envoi de photos (produits, catégories…) passe par le sélecteur de fichiers.
class WebScreen extends StatefulWidget {
  const WebScreen({super.key, required this.path, this.title = ''});
  final String path;
  final String title;
  @override
  State<WebScreen> createState() => _WebScreenState();
}

class _WebScreenState extends State<WebScreen> {
  late final WebViewController _c;
  int _progress = 0;
  String? _error;
  final _host = Uri.parse(kBaseUrl).host;

  @override
  void initState() {
    super.initState();
    _c = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(NavigationDelegate(
        onProgress: (p) => mounted ? setState(() => _progress = p) : null,
        onPageStarted: (_) => mounted ? setState(() => _error = null) : null,
        onWebResourceError: (e) {
          if (e.isForMainFrame ?? true) setState(() => _error = 'Connexion impossible. Vérifiez internet puis réessayez.');
        },
        onNavigationRequest: (r) {
          final u = Uri.tryParse(r.url);
          if (u == null) return NavigationDecision.prevent;
          final inside = (u.scheme == 'https' || u.scheme == 'http') && u.host == _host;
          if (inside || u.scheme == 'about' || u.scheme == 'data' || u.scheme == 'blob') return NavigationDecision.navigate;
          launchUrl(u, mode: LaunchMode.externalApplication); // tel:, wa.me, Google Maps, Facebook…
          return NavigationDecision.prevent;
        },
      ))
      ..loadRequest(Uri.parse(kBaseUrl).replace(fragment: widget.path.startsWith('#') ? widget.path.substring(1) : widget.path));
    final platform = _c.platform;
    if (platform is AndroidWebViewController) {
      platform.setOnShowFileSelector((params) async {
        final files = await FilePicker.pickFiles();
        return files.map((f) => f.uri.toString()).toList();
      });
      platform.setMediaPlaybackRequiresUserGesture(false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        if (await _c.canGoBack()) {
          await _c.goBack();
        } else if (context.mounted) {
          Navigator.of(context).pop();
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.title, style: const TextStyle(fontWeight: FontWeight.w800)),
          actions: [IconButton(tooltip: 'Actualiser', onPressed: _c.reload, icon: const Icon(Icons.refresh))],
          bottom: _progress < 100 ? PreferredSize(preferredSize: const Size.fromHeight(2), child: LinearProgressIndicator(value: _progress / 100, color: kOrange, minHeight: 2)) : null,
        ),
        body: _error == null
            ? WebViewWidget(controller: _c)
            : Center(child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(Icons.wifi_off_rounded, size: 42, color: kMuted),
                  const SizedBox(height: 10),
                  Text(_error!, textAlign: TextAlign.center),
                  const SizedBox(height: 14),
                  OutlinedButton(onPressed: () { setState(() => _error = null); _c.reload(); }, child: const Text('Réessayer')),
                ]),
              )),
      ),
    );
  }
}

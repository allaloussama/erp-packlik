import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../state.dart';
import '../theme.dart';
import 'net.dart';
import 'admin_pages.dart';
import 'docs.dart';
import 'finance_pages.dart';
import 'meta_page.dart';
import 'orders.dart';
import 'pages.dart';
import 'rules.dart';
import 'rules2.dart';
import 'site_page.dart';
import 'supplier_pages.dart';
import 'store.dart';
import 'ui.dart';

/// L'ERP de l'application : une seule instance pour toute la session (données, session, synchronisation).
final erpProvider = Provider<ErpStore>((ref) {
  final s0 = ErpStore(ErpNet(ref.read(prefsProvider)));
  ref.onDispose(s0.dispose);
  return s0;
});

/// Entrée de l'espace équipe : chargement, connexion, puis l'ERP du rôle connecté.
class ErpGate extends ConsumerStatefulWidget {
  const ErpGate({super.key});
  @override
  ConsumerState<ErpGate> createState() => _ErpGateState();
}

class _ErpGateState extends ConsumerState<ErpGate> {
  @override
  void initState() {
    super.initState();
    final st = ref.read(erpProvider);
    if (!st.booted || st.user == null) st.boot();
  }

  @override
  Widget build(BuildContext context) {
    final st = ref.watch(erpProvider);
    return ListenableBuilder(
      listenable: st,
      builder: (context, _) {
        if (!st.booted) return const Scaffold(body: Center(child: CircularProgressIndicator(color: kOrange)));
        if (st.user == null) return LoginScreen(store: st);
        if (!kMenus.containsKey(st.role)) {
          return Scaffold(appBar: AppBar(), body: Empty('Rôle « ${st.role} » inconnu', icon: Icons.lock_outline));
        }
        return ErpShell(store: st);
      },
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key, required this.store});
  final ErpStore store;
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController(), _pass = TextEditingController();
  bool _busy = false, _hide = true;
  String? _err;

  @override
  void dispose() {
    _email.dispose();
    _pass.dispose();
    super.dispose();
  }

  Future<void> _go() async {
    if (_email.text.trim().isEmpty || _pass.text.isEmpty) {
      setState(() => _err = 'E-mail et mot de passe requis');
      return;
    }
    setState(() {
      _busy = true;
      _err = null;
    });
    final e = await widget.store.login(_email.text, _pass.text);
    if (mounted) {
      setState(() {
        _busy = false;
        _err = e;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    return Scaffold(
      appBar: AppBar(backgroundColor: kErpBg, shape: const Border(), title: const Text('Espace équipe')),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              const Center(child: BrandMark(dark: false)),
              const SizedBox(height: 22),
              Container(
                decoration: cardBox(),
                child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 22, 20, 20),
                child: AutofillGroup(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                    const Text('Connexion', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 2),
                    const Text('Utilisez le même compte que sur le site.', style: TextStyle(color: kErpMuted, fontSize: 13)),
                    const SizedBox(height: 18),
                    if (st.bootError != null && _err == null)
                      Padding(padding: const EdgeInsets.only(bottom: 10), child: Text(st.bootError!, style: const TextStyle(color: kRed))),
                    TextField(controller: _email, keyboardType: TextInputType.emailAddress, autofillHints: const [AutofillHints.username, AutofillHints.email], textInputAction: TextInputAction.next, decoration: const InputDecoration(labelText: 'E-mail', prefixIcon: Icon(Icons.mail_outline))),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _pass, obscureText: _hide, autofillHints: const [AutofillHints.password], onSubmitted: (_) => _go(),
                      decoration: InputDecoration(labelText: 'Mot de passe', prefixIcon: const Icon(Icons.lock_outline), suffixIcon: IconButton(onPressed: () => setState(() => _hide = !_hide), icon: Icon(_hide ? Icons.visibility_outlined : Icons.visibility_off_outlined))),
                    ),
                    if (_err != null) Padding(padding: const EdgeInsets.only(top: 10), child: Text(_err!, style: const TextStyle(color: kRed))),
                    const SizedBox(height: 18),
                    FilledButton(onPressed: _busy ? null : _go, child: _busy ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2.4, color: Colors.white)) : const Text('Se connecter')),
                  ]),
                ),
                ),
              ),
              const SizedBox(height: 16),
              const Text('Vous restez connecté après la fermeture de l\'application.', textAlign: TextAlign.center, style: TextStyle(color: kErpMuted, fontSize: 12)),
            ]),
          ),
        ),
      ),
    );
  }
}

/// L'ERP du rôle connecté : menu latéral identique au site (mêmes rubriques, mêmes compteurs), page choisie au centre.
class ErpShell extends StatefulWidget {
  const ErpShell({super.key, required this.store});
  final ErpStore store;
  @override
  State<ErpShell> createState() => _ErpShellState();
}

class _ErpShellState extends State<ErpShell> with WidgetsBindingObserver {
  late String _page = kRoleHome[widget.store.role] ?? 'dashboard';
  StreamSubscription<String>? _sub;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _sub = widget.store.messages.listen((msg) {
      if (mounted) toast(context, msg, bad: msg.startsWith('Une modification') || msg.startsWith('Hors ligne'));
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) widget.store.syncNow();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _sub?.cancel();
    super.dispose();
  }

  MenuItem? _item(String key) {
    for (final g in widget.store.menusFor(widget.store.role)) {
      for (final i in g.$2) {
        if (i.key == key) return i;
      }
    }
    return null;
  }

  void _go(String key) => setState(() => _page = key);

  Widget _body(ErpStore st) {
    int byCreated(Doc a, Doc b) => n(b['created']).compareTo(n(a['created']));
    int byNextCall(Doc a, Doc b) => n(a['nextCall'] ?? 9e15).compareTo(n(b['nextCall'] ?? 9e15));
    bool pending(Doc o) => kConfSt.contains(o['status']);
    switch (_page) {
      case 'dashboard':
        return st.role == 'fournisseur' ? SupplierDashPage(store: st, go: _go) : DashboardPage(store: st, go: _go);
      case 'livraison':
        return DeliveryPage(store: st);
      case 'meta':
        return MetaPage(store: st);
      case 'pixels':
        return PixelsPage(store: st);
      case 'stats':
        return StatsPage(store: st);
      case 'fournisseurs':
        return SuppliersPage(store: st);
      case 'achats':
        return PurchasesPage(store: st);
      case 'finance':
        return FinancePage(store: st);
      case 'compta':
        return AccountingPage(store: st);
      case 'documents':
        return DocumentsPage(store: st);
      case 'site':
        return SitePage(store: st);
      case 'repartition':
        return AssignPage(store: st);
      case 'modules':
        return ModulesPage(store: st);
      case 'parametres':
        return SettingsPage(store: st);
      case 'classement':
        return RankingPage(store: st);
      case 'paiements':
        return SupplierPaymentsPage(store: st);
      case 'bons':
        return SupplierPOsPage(store: st);
      case 'receptions':
        return SupplierDeliveriesPage(store: st);
      case 'releve':
        return SupplierStatementPage(store: st);
      case 'confirmer':
        return OrderListPage(store: st, base: () => st.visibleOrders().where((o) => kPreSt.contains(o['status'])).toList(), tabs: [
          ('À traiter', pending), ('Rappels', (o) => o['status'] == 'callback'), ('Injoignables', (o) => o['status'] == 'unreach'),
          ('Confirmées', (o) => ['toprep', 'ready'].contains(o['status'])), ('Annulées', (o) => o['status'] == 'cancelled'), ('Tout', (o) => true),
        ]);
      case 'mafile':
        return OrderListPage(store: st, base: () => st.visibleOrders().where((o) => pending(o) || o['status'] == 'failed').toList(), sort: (a, b) {
          final due = now() + 5 * kMin;
          final da = a['nextCall'] != null && n(a['nextCall']) <= due, db = b['nextCall'] != null && n(b['nextCall']) <= due;
          if (da != db) return da ? -1 : 1;
          return n(a['created']).compareTo(n(b['created']));
        }, tabs: [('À appeler', pending), ('Échecs de livraison', (o) => o['status'] == 'failed')]);
      case 'appel':
        final mine = st.visibleOrders().where(pending).toList();
        final due = mine.where((o) => o['nextCall'] != null && n(o['nextCall']) <= now() + 5 * kMin).toList()..sort(byNextCall);
        final fresh = mine.where((o) => o['status'] == 'new').toList()..sort((a, b) => n(a['created']).compareTo(n(b['created'])));
        final next = due.firstOrNull ?? fresh.firstOrNull ?? mine.firstOrNull;
        return _NextCall(store: st, next: next);
      case 'rappels':
        return OrderListPage(store: st, base: () => st.visibleOrders().where((o) => o['nextCall'] != null && pending(o)).toList(), sort: byNextCall, tabs: [('Mes rappels', (o) => true)]);
      case 'livraisons':
        return OrderListPage(store: st, base: () => st.visibleOrders().where((o) => kShipSt.contains(o['status'])).toList(), tabs: [
          ('Échecs', (o) => o['status'] == 'failed'), ('En cours', (o) => ['sent', 'picked', 'transit', 'outfor'].contains(o['status'])),
          ('Livrées', (o) => ['delivered', 'paid', 'closed'].contains(o['status'])), ('Retours', (o) => ['returning', 'returned'].contains(o['status'])),
        ]);
      case 'file':
        return OrderListPage(store: st, base: () => st.orders.where(pending).toList(), tabs: [('Sans agent', (o) => o['agentId'] == null), ('Toutes', (o) => true)], sort: byCreated);
      case 'cas':
        return OrderListPage(store: st, base: st.hardCases, tabs: [('Cas difficiles', (o) => true)]);
      case 'suivi':
        return OrderListPage(store: st, base: () => st.orders.where((o) => kShipSt.contains(o['status']) || ['toprep', 'ready'].contains(o['status'])).toList(), tabs: [
          ('Tout', (o) => true), ('À préparer', (o) => o['status'] == 'toprep'), ('Prêtes', (o) => o['status'] == 'ready'),
          for (final k in kShipSt) (kStep[k]!.$1, (o) => o['status'] == k),
        ], sort: (a, b) => n(m(b['times'])['sent'] ?? b['created']).compareTo(n(m(a['times'])['sent'] ?? a['created'])));
      case 'preparation':
        return OrderListPage(store: st, base: () => st.orders.where((o) => o['status'] == 'toprep').toList(), tabs: [('À préparer', (o) => true)], bulkReady: true, sort: (a, b) => n(a['created']).compareTo(n(b['created'])));
      case 'expedition':
        return OrderListPage(store: st, base: () => st.orders.where((o) => o['status'] == 'ready').toList(), tabs: [('Prêtes', (o) => true)], bulkSend: true, sort: (a, b) => n(a['created']).compareTo(n(b['created'])));
      case 'retours':
        return OrderListPage(store: st, base: () => st.orders.where((o) => ['returning', 'returned'].contains(o['status'])).toList(), tabs: [('À réceptionner', (o) => o['status'] == 'returning'), ('Retournées', (o) => o['status'] == 'returned')]);
      case 'produits':
        return ProductsPage(store: st);
      case 'stock':
        return StockPage(store: st);
      case 'clients':
        return CustomersPage(store: st);
      case 'equipe':
        return TeamPage(store: st);
      case 'journal':
        return JournalPage(store: st);
      case 'perfs':
        return AgentPerfPage(store: st);
      case 'tournee':
        return LvTourPage(store: st);
      case 'argent':
        return LvCashPage(store: st);
      case 'historique':
        return LvHistoryPage(store: st);
      case 'perf':
        return LvPerfPage(store: st);
      case 'ventes':
        return SupplierSalesPage(store: st);
      default:
        return Empty('Page « ${_item(_page)?.label ?? _page} » introuvable', icon: Icons.search_off);
    }
  }

  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    final item = _item(_page);
    final name = s(st.me['name']);
    return Scaffold(
      appBar: AppBar(
        title: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
          Text(item?.label ?? 'PackLik ERP', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 17)),
          Text('${fDate(now())} · ${kRoleLabel[st.role] ?? st.role}', style: const TextStyle(fontSize: 11.5, color: kErpMuted, fontWeight: FontWeight.w500)),
        ]),
        actions: [
          if (st.offline) const Padding(padding: EdgeInsets.symmetric(horizontal: 6), child: Tooltip(message: 'Hors ligne', child: Icon(Icons.cloud_off, color: kRed, size: 20))),
          IconButton(tooltip: 'Actualiser', onPressed: st.syncNow, icon: const Icon(Icons.sync, size: 21)),
          Padding(padding: const EdgeInsetsDirectional.only(end: 12, start: 2), child: Avatar(name)),
        ],
      ),
      drawer: Drawer(
        backgroundColor: kSide,
        width: 284,
        shape: const RoundedRectangleBorder(),
        child: SafeArea(
          child: _SideMenu(
            store: st,
            page: _page,
            onPick: (k) {
              Navigator.pop(context);
              _go(k);
            },
            onShop: () {
              Navigator.pop(context);
              Navigator.of(context).maybePop();
            },
            onLogout: () async {
              Navigator.pop(context);
              if (await confirmDialog(context, 'Déconnexion', 'Se déconnecter de l\'espace équipe ?', ok: 'Se déconnecter', danger: true)) await st.logout();
            },
          ),
        ),
      ),
      body: _body(st),
    );
  }
}

/// Initiale de l'utilisateur dans un rond (.avatar du site).
class Avatar extends StatelessWidget {
  const Avatar(this.name, {super.key, this.size = 34});
  final String name;
  final double size;
  @override
  Widget build(BuildContext context) => Container(
        width: size,
        height: size,
        alignment: Alignment.center,
        decoration: const BoxDecoration(color: kKraftL, shape: BoxShape.circle),
        child: Text(name.isEmpty ? '?' : name[0].toUpperCase(), style: TextStyle(color: const Color(0xFF8A3600), fontWeight: FontWeight.w800, fontSize: size * .38)),
      );
}

/// Logo de l'espace équipe (.side .brand du site) : carré orange, nom, sous-titre.
class BrandMark extends StatelessWidget {
  const BrandMark({super.key, this.dark = true});
  final bool dark;
  @override
  Widget build(BuildContext context) => Row(mainAxisSize: MainAxisSize.min, children: [
        Container(
          width: 36,
          height: 36,
          alignment: Alignment.center,
          decoration: BoxDecoration(color: kOrange, borderRadius: BorderRadius.circular(9)),
          child: const Icon(Icons.inventory_2_outlined, color: Colors.white, size: 20),
        ),
        const SizedBox(width: 10),
        Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
          Text('PackLik', style: TextStyle(color: dark ? Colors.white : kErpInk, fontWeight: FontWeight.w800, fontSize: 17, height: 1.1)),
          Text('ERP · ESPACE ÉQUIPE', style: TextStyle(color: dark ? const Color(0xFF8996A5) : kErpMuted, fontWeight: FontWeight.w600, fontSize: 10.5, letterSpacing: .7)),
        ]),
      ]);
}

/// Menu latéral sombre, copie de .side du site : groupes en capitales, rubrique active en orange, compteurs.
class _SideMenu extends StatelessWidget {
  const _SideMenu({required this.store, required this.page, required this.onPick, required this.onShop, required this.onLogout});
  final ErpStore store;
  final String page;
  final ValueChanged<String> onPick;
  final VoidCallback onShop, onLogout;
  static const _redCounters = {'fail', 'hard', 'low', 'myfail'}; // mêmes compteurs rouges que le site

  Widget _row(IconData icon, String label, {bool on = false, int count = 0, bool red = false, Color? color, VoidCallback? onTap}) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 1),
        child: Material(
          color: on ? kOrange : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          child: InkWell(
            borderRadius: BorderRadius.circular(8),
            hoverColor: kSideHover,
            splashColor: Colors.white10,
            onTap: onTap,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              child: Row(children: [
                Icon(icon, size: 19, color: on ? Colors.white : color ?? const Color(0xFF8996A5)),
                const SizedBox(width: 12),
                Expanded(child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: on ? Colors.white : color ?? kSideText, fontSize: 13.5, fontWeight: on ? FontWeight.w700 : FontWeight.w500))),
                if (count > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 1),
                    decoration: BoxDecoration(color: on ? Colors.white24 : red ? kRed : kSideCount, borderRadius: BorderRadius.circular(999)),
                    child: Text('$count', style: const TextStyle(color: Color(0xFFE6EAEF), fontSize: 11, fontWeight: FontWeight.w700)),
                  ),
              ]),
            ),
          ),
        ),
      );

  @override
  Widget build(BuildContext context) {
    final st = store, cnt = st.counters(), name = s(st.me['name']);
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      const Padding(padding: EdgeInsets.fromLTRB(16, 18, 16, 10), child: BrandMark()),
      Expanded(
        child: ListView(padding: const EdgeInsets.only(bottom: 10), children: [
          for (final g in st.menusFor(st.role)) ...[
            if (g.$1.isNotEmpty)
              Padding(padding: const EdgeInsets.fromLTRB(20, 16, 18, 6), child: Text(g.$1.toUpperCase(), style: const TextStyle(fontSize: 10.5, letterSpacing: .8, color: kSideGroup, fontWeight: FontWeight.w700))),
            for (final i in g.$2)
              _row(i.icon, i.label, on: i.key == page, count: i.badge.isEmpty ? 0 : cnt[i.badge] ?? 0, red: _redCounters.contains(i.badge), onTap: () => onPick(i.key)),
          ],
        ]),
      ),
      Container(
        decoration: const BoxDecoration(border: Border(top: BorderSide(color: Color(0xFF232E3A)))),
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Column(children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
            child: Row(children: [
              Avatar(name, size: 32),
              const SizedBox(width: 10),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13.5)),
                  Text(kRoleLabel[st.role] ?? st.role, style: const TextStyle(color: Color(0xFF8996A5), fontSize: 12)),
                ]),
              ),
            ]),
          ),
          _row(Icons.storefront_outlined, 'Retour à la boutique', onTap: onShop),
          _row(Icons.logout, 'Déconnexion', color: const Color(0xFFF0A39D), onTap: onLogout),
        ]),
      ),
    ]);
  }
}

/// « Écran d'appel » de l'agent : la prochaine commande à appeler (rappels dus, puis nouvelles, puis le reste).
class _NextCall extends StatelessWidget {
  const _NextCall({required this.store, required this.next});
  final ErpStore store;
  final Doc? next;
  @override
  Widget build(BuildContext context) {
    if (next == null) return const Empty('Aucune commande à appeler pour le moment. Bravo !');
    return ListView(padding: const EdgeInsets.all(12), children: [
      const Padding(padding: EdgeInsets.fromLTRB(4, 0, 4, 8), child: Text('Commande suivante', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15))),
      OrderCard(store: store, o: next!),
      const SizedBox(height: 12),
      FilledButton.icon(
        onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => OrderScreen(store: store, id: ni(next!['id'])))),
        icon: const Icon(Icons.headset_mic_outlined), label: const Text('Ouvrir la fiche d\'appel'),
      ),
    ]);
  }
}

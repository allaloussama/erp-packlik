/// Textes de l'application : le français est la clé, l'arabe la traduction (comme sur le site).
const Map<String, String> _ar = {
  'Accueil': 'الرئيسية', 'Boutique': 'المتجر', 'Panier': 'السلة', 'Plus': 'المزيد',
  'Catégories': 'الفئات', 'Tout voir': 'عرض الكل', 'Nouveautés': 'الجديد', 'Produits': 'المنتجات',
  'Rechercher un emballage…': 'ابحث عن تغليف…', 'Ajouter au panier': 'أضف إلى السلة', 'Acheter maintenant': 'اشترِ الآن',
  'Choisir une option': 'اختر خيارًا', 'Demander un devis': 'اطلب عرض سعر', 'Prix sur devis': 'السعر عند الطلب', 'Rupture': 'نفد المخزون',
  'En stock': 'متوفر', 'Sur commande': 'حسب الطلب', 'Variante': 'النوع', 'Offres par quantité': 'عروض حسب الكمية', 'Quantité': 'الكمية',
  'pièce': 'قطعة', 'pièces': 'قطع', 'À partir de': 'ابتداءً من', 'minimum': 'الحد الأدنى', 'Conditionnement': 'التعبئة',
  'Description du produit': 'وصف المنتج', 'Produits associés': 'منتجات مشابهة',
  'Commandez maintenant, payez à la livraison': 'اطلب الآن وادفع عند الاستلام', 'Commander maintenant': 'اطلب الآن',
  'Nom complet': 'الاسم الكامل', 'Téléphone': 'الهاتف', 'Wilaya': 'الولاية', 'Commune': 'البلدية', 'Adresse (facultatif)': 'العنوان (اختياري)',
  'Mode de livraison': 'طريقة التوصيل', 'À domicile': 'إلى المنزل', 'Bureau de livraison (stop desk)': 'مكتب التوصيل', 'Livraison': 'التوصيل',
  'Gratuite': 'مجاني', 'Total à payer à la livraison': 'المبلغ عند الاستلام', 'Vos produits': 'منتجاتك', 'Sous-total': 'المجموع الفرعي',
  'Votre panier est vide': 'سلتك فارغة', 'Continuer mes achats': 'متابعة التسوق', 'Envoi en cours…': 'جارٍ الإرسال…',
  'Veuillez saisir votre nom': 'يرجى إدخال اسمك', 'Numéro invalide : 05, 06 ou 07 suivi de 8 chiffres': 'رقم غير صالح: 05 أو 06 أو 07 متبوع بـ 8 أرقام',
  'Veuillez indiquer la commune': 'يرجى تحديد البلدية', 'Champ obligatoire': 'حقل إلزامي', '— Choisir —': '— اختر —',
  'Merci ! Votre commande est enregistrée': 'شكرًا! تم تسجيل طلبك', 'N° de commande': 'رقم الطلب',
  'Un agent PackLik va vous appeler pour confirmer votre commande.': 'سيتصل بك أحد أعوان PackLik لتأكيد طلبك.',
  'Espace équipe': 'فضاء الفريق', 'Connexion à l\'administration, confirmation, livraison, livreurs…': 'الدخول إلى الإدارة، التأكيد، التوصيل، الموزعين…',
  'Contact': 'اتصل بنا', 'Appeler': 'اتصال', 'WhatsApp': 'واتساب', 'E-mail': 'البريد', 'Langue': 'اللغة', 'Conditions générales de vente': 'شروط البيع',
  'Paiement à la livraison': 'الدفع عند الاستلام', 'Livraison 69 wilayas': 'التوصيل إلى 69 ولاية', 'Réessayer': 'إعادة المحاولة',
  'Connexion impossible. Vérifiez internet puis réessayez.': 'تعذر الاتصال. تحقق من الإنترنت ثم أعد المحاولة.', 'Ajouté au panier': 'أضيف إلى السلة',
  'Voir le panier': 'عرض السلة', 'Aucun produit': 'لا توجد منتجات', 'Retirer': 'إزالة', 'Version': 'الإصدار', 'Ouvrir le site': 'فتح الموقع',
  'Ajouter aussi au formulaire': 'أضف إلى نموذج الطلب', 'Nouveau': 'جديد', 'Promo': 'تخفيض', 'Trier': 'ترتيب', 'Prix croissant': 'السعر تصاعديًا',
  'Prix décroissant': 'السعر تنازليًا', 'Plus récents': 'الأحدث', 'Pertinence': 'الملاءمة', 'Retrait au bureau le plus proche': 'الاستلام من أقرب مكتب',
  'Livré jusqu\'à votre porte': 'يصل حتى باب منزلك', 'estimée': 'تقديري', 'Total': 'المجموع',
};

String tr(String lang, String fr) => lang == 'ar' ? (_ar[fr] ?? fr) : fr;

"use strict";
/* Wilayas (69) et communes (1541) : jeu de données geoalgeria (MIT, © Yasser's studio), d'après le Journal officiel. */
const GEO_RAW = `1|Adrar|أدرار|Adrar#Adrar|أدرار;Akabli|اقبلي;Aoulef|أولف;Bouda|بودة;Fenoughil|فنوغيل;In Zghmir|إن زغمير;Ouled Ahmed Timmi|أولاد أحمد تيمي;Reggane|رقان;Sali|سالي;Sebaa|السبع;Tamantit|تامنطيط;Tamest|تامست;Timekten|تيمقتن;Tit|تيت;Tsabit|تسابيت;Zaouiet Kounta|زاوية كنتة
2|Chlef|الشلف|Chlef#Abou El Hassane|أبو الحسن;Ain Merane|عين مران;Benairia|بنايرية;Beni Bouattab|بني بوعتاب;Beni Haoua|بني حواء;Beni Rached|بني راشد;Boukadir|بوقادير;Bouzeghaia|بوزغاية;Breira|بريرة;Chettia|الشطية;Chlef|الشلف;Dahra|الظهرة;El Hadjadj|الحجاج;El Karimia|الكريمية;El Marsa|المرسى;Harchoun|حرشون;Herenfa|الهرانفة;Labiod Medjadja|الأبيض مجاجة;Moussadek|مصدق;Oued Fodda|وادي الفضة;Oued Goussine|وادي قوسين;Oued Sly|وادي سلي;Ouled Abbes|أولاد عباس;Ouled Ben Abdelkader|أولاد بن عبد القادر;Ouled Fares|أولاد فارس;Oum Drou|أم الدروع;Sendjas|سنجاس;Sidi Abderrahmane|سيدي عبد الرحمن;Sidi Akkacha|سيدي عكاشة;Sobha|الصبحة;Tadjena|تاجنة;Talassa|تلعصة;Taougrit|تاوقريت;Tenes|تنس;Zeboudja|الزبوجة
3|Laghouat|الأغواط|Laghouat#Aïn Madhi|عين ماضي;Benacer Benchohra|بن ناصر بن شهرة;El Assafia|العسافية;El Haouita|الحويطة;Hassi Delaa|حاسي الدلاعة;Hassi R'Mel|حاسي الرمل;Kheneg|الخنق;Ksar El Hirane|قصر الحيران;Laghouat|الأغواط;Sidi Makhlouf|سيدي مخلوف;Tadjemout|تاجموت;Tadjrouna|تاجرونة
4|Oum El Bouaghi|أم البواقي|Oum El Bouaghi#Ain Babouche|عين ببوش;Ain Beida|عين البيضاء;Ain Diss|عين الديس;Ain Fekroun|عين فكرون;Ain Kercha|عين كرشة;Ain M'lila|عين مليلة;Ain Zitoun|عين الزيتون;Behir Chergui|بحير الشرقي;Berriche|بريش;Bir Chouhada|بئر الشهداء;Dhalaa|الضلعة;El Amiria|العامرية;El Belala|البلالة;El Djazia|الجازية;El Fedjoudj Boughrara Sa|الفجوج بوغرارة سعودي;El Harmilia|الحرملية;Fkirina|فكيرينة;Hanchir Toumghani|هنشير تومغني;Ksar Sbahi|قصر الصباحي;Meskiana|مسكيانة;Oued Nini|وادي نيني;Ouled Gacem|أولاد قاسم;Ouled Hamla|أولاد حملة;Ouled Zouai|أولاد زواي;Oum El Bouaghi|أم البواقي;Rahia|الرحية;Sigus|سيقوس;Souk Naamane|سوق نعمان;Zorg|الزرق
5|Batna|باتنة|Batna#Ain Djasser|عين جاسر;Ain Yagout|عين ياقوت;Arris|آريس;Aïn Touta|عين التوتة;Batna|باتنة;Boulhilat|بولهيلات;Boumagueur|بومقر;Boumia|بومية;Bouzina|بوزينة;Béni Fedhala El Hakania|بني فضالة الحقانية;Chemora|الشمرة;Chir|شير;Djerma|جرمة;El Hassi|الحاسي;Elmadher|المعذر;Fesdis|فسديس;Foum Toub|فم الطوب;Ghassira|غسيرة;Gosbat|القصبات;Guigba|القيقبة;Hidoussa|حيدوسة;Ichmoul|إيشمول;Inoughissene|إينوغيسن;Kimmel|كيمل;Ksar Belezma|قصر بلزمة;Larbaa|لارباع;Lazrou|لازرو;Lemsane|لمسان;Maafa|معافة;Menaa|منعة;Merouana|مروانة;N'Gaous|نقاوس;Oued Chaaba|وادي الشعبة;Oued El Ma|وادي الماء;Oued Taga|وادي الطاقة;Ouled Aouf|أولاد عوف;Ouled Fadel|أولاد فاضل;Ouled Sellem|أولاد سلام;Ouled Si Slimane|أولاد سي سليمان;Ouyoun El Assafir|عيون العصافير;Rahbat|الرحبات;Ras El Aïoun|رأس العيون;Sefiane|سفيان;Seriana|سريانة;T'Kout|تكوت;Talkhamt|تالخمت;Taxlent|تاكسلانت;Tazoult|تازولت;Teniet El Abed|ثنية العابد;Tighanimine|تيغانمين;Tigherghar|تيغرغار;Timgad|تيمقاد;Zana El Beïda|زانة البيضاء
6|Béjaïa|بجاية|Béjaïa#Adekar|أدكار;Ait R'zine|أيت رزين;Ait-Smail|أيت إسماعيل;Akbou|أقبو;Akfadou|أكفادو;Amalou|أمالو;Amizour|أميزور;Aokas|أوقاس;Barbacha|برباشة;Bejaia|بجاية;Beni Djellil|بني جليل;Beni K'sila|بني كسيلة;Beni-Mallikeche|بني مليكش;Benimaouche|بني معوش;Boudjellil|بو جليل;Bouhamza|بوحمزة;Boukhelifa|بوخليفة;Chellata|شلاطة;Chemini|شميني;Darguina|درقينة;Dra El Caid|ذراع القايد;El Kseur|القصر;Fenaia Il Maten|فناية الماثن;Feraoun|فرعون;Ighil-Ali|إغيل علي;Ighram|اغرم;Kendira|كنديرة;Kherrata|خراطة;Leflaye|الفلاي;M'cisna|مسيسنة;Melbou|مالبو;Oued Ghir|وادي غير;Ouzellaguen|أوزلاقن;Seddouk|صدوق;Sidi Ayad|سيدي عياد;Sidi-Aich|سيدي عيش;Smaoun|سمعون;Souk El Tenine|سوق الاثنين;Souk Oufella|سوق اوفلا;Tala Hamza|تالة حمزة;Tamokra|تامقرة;Tamridjet|تامريجت;Taourit Ighil|تاوريرت إغيل;Taskriout|تاسكريوت;Tazmalt|تازمالت;Tibane|طيبان;Tichy|تيشي;Tifra|تيفرة;Timezrit|تيمزريت;Tinebdar|تينبدار;Tizi-N'berber|تيزي نبربر;Toudja|توجة
7|Biskra|بسكرة|Biskra#Aïn Naga|عين الناقة;Biskra|بسكرة;Bordj Ben Azzouz|برج بن عزوز;Bouchagroun|بوشقرون;Chetma|شتمة;El Feïdh|الفيض;El Ghrous|الغروس;El Hadjeb|الحاجب;El Haouch|الحوش;Foughala|فوغالة;Khangat Sidi Nadji|خنقة سيدي ناجي;Lichana|ليشانة;Lioua|ليوة;M'Chounèche|مشونش;M'Lili|أمليلي;Mekhadma|أمخادمة;Meziraa|المزيرعة;Oumache|أوماش;Ourlal|أورلال;Sidi Okba|سيدي عقبة;Tolga|طولقة;Zeribet El Oued|زريبة الوادي
8|Béchar|بشار|Béchar#Abadla|العبادلة;Bechar|بشار;Beni-Ounif|بني ونيف;Boukais|بوكايس;Erg-Ferradj|عرق فراج;Kenadsa|القنادسة;Lahmar|لحمر;Machraa-Houari-Boumediene|مشرع هواري بومدين;Meridja|المريجة;Mogheul|موغل;Taghit|تاغيت
9|Blida|البليدة|Blida#Ain Romana|عين الرمانة;Beni Mered|بني مراد;Beni-Tamou|بني تامو;Benkhelil|بن خليل;Blida|البليدة;Bouarfa|بوعرفة;Boufarik|بوفاريك;Bougara|بوقرة;Bouinan|بوعينان;Chebli|الشبلي;Chiffa|الشفة;Chrea|الشريعة;Djebabra|جبابرة;El-Affroun|العفرون;Guerrouaou|قرواو;Hammam Elouane|حمام ملوان;Larbaa|الأربعاء;Meftah|مفتاح;Mouzaia|موزاية;Oued Djer|وادي جر;Oued El Alleug|وادي العلايق;Ouled Slama|اولاد سلامة;Ouled Yaich|أولاد يعيش;Souhane|صوحان;Soumaa|الصومعة
10|Bouira|البويرة|Bouira#Aghbalou|أغبالو;Ahl El Ksar|أهل القصر;Ain El Hadjar|عين الحجر;Ain Laloui|عين العلوي;Ain Turk|عين الترك;Ain-Bessem|عين بسام;Ait Laaziz|أيت لعزيز;Aomar|أعمر;Ath Mansour|آث منصور;Bechloul|بشلول;Bir Ghbalou|بئر غبالو;Bordj Okhriss|برج أوخريص;Bouderbala|بودربالة;Bouira|البويرة;Boukram|بوكرم;Chorfa|شرفة;Dechmia|الدشمية;Dirah|ديرة;Djebahia|جباحية;El Adjiba|العجيبة;El Asnam|الأسنام;El Hachimia|الهاشمية;El Khabouzia|الخبوزية;El-Hakimia|الحاكمية;El-Mokrani|المقراني;Guerrouma|قرومة;Hadjera Zerga|الحجرة الزرقاء;Haizer|حيزر;Hanif|حنيف;Kadiria|قادرية;Lakhdaria|الأخضرية;M Chedallah|أمشدالة;Maala|معلة;Maamora|المعمورة;Mezdour|مزدور;Oued El Berdi|وادي البردي;Ouled Rached|أولاد راشد;Raouraoua|روراوة;Ridane|ريدان;Saharidj|سحاريج;Souk El Khemis|سوق الخميس;Sour El Ghozlane|سور الغزلان;Taghzout|تاغزوت;Taguedite|تاقديت;Z'barbar|زبربر
11|Tamanrasset|تمنراست|Tamanrasset#Abelsa|ابلسة;Ain Amguel|عين امقل;Idles|أدلس;Tamanrasset|تمنراست;Tazrouk|تاظروك
12|Tébessa|تبسة|Tébessa#Ain Zerga|عين الزرقاء;Bedjene|بجن;Bekkaria|بكارية;Bir Dheheb|بئر الذهب;Bir Mokkadem|بئر مقدم;Boukhadra|بوخضرة;Boulhaf Dyr|بولحاف الدير;Cheria|الشريعة;El Aouinet|العوينات;El Kouif|الكويف;El Ma Labiod|الماء الأبيض;El Meridj|المريج;El Mezeraa|المزرعة;El Ogla|العقلة;Gourrigueur|قريقر;Hammamet|الحمامات;Lahouidjbet|الحويجبات;Morsott|مرسط;Ouenza|الونزة;Oum Ali|أم علي;Safsaf El Ouesra|صفصاف الوسرى;Stah Guentis|السطح قنتيس;Thlidjene|ثليجان;Tébessa|تبسة
13|Tlemcen|تلمسان|Tlemcen#Ain Fezza|عين فزة;Ain Kebira|العين الكبيرة;Ain Nehala|عين النحالة;Ain Youcef|عين يوسف;Amieur|عمير;Azaïls|لعزايل;Aïn Fetah|عين فتاح;Aïn Ghoraba|عين الغرابة;Aïn Tallout|عين تالوت;Bab El Assa|باب العسة;Bensekrane|بن سكران;Bouhlou|بوحلو;Béni Bahdel|بني بحدل;Béni Boussaïd|بني بوسعيد;Béni Khellad|بني خلاد;Béni Mester|بني مستر;Béni Ouarsous|بني ورسوس;Béni Semiel|بني صميل;Béni Snous|بني سنوس;Chetouane|شتوان;Dar Yaghmouracène|دار يغمراسن;Djebala|جبالة;El Fehoul|الفحول;Fellaoucène|فلاوسن;Ghazaouet|الغزوات;Hammam Boughrara|حمام بوغرارة;Hennaya|الحناية;Honaïne|حنين;Maghnia|مغنية;Mansourah|المنصورة;Marsa Ben M'Hidi|مرسى بن مهيدي;Msirda Fouaga|مسيردة الفواقة;Nédroma|ندرومة;Oued Lakhdar|وادي الأخضر;Ouled Mimoun|أولاد ميمون;Ouled Riyah|أولاد رياح;Remchi|الرمشي;Sabra|صبرة;Sebaa Chioukh|السبعة شيوخ;Sebdou|سبدو;Sidi Abdelli|سيدي العبدلي;Sidi Medjahed|سيدي مجاهد;Souahlia|السواحلية;Souani|السواني;Souk Thlata|سوق الثلاثاء;Tianet|تيانت;Tirni Béni Hediel|تيرني بني هديل;Tlemcen|تلمسان;Zenata|زناتة
14|Tiaret|تيارت|Tiaret#Aïn Bouchekif|عين بوشقيف;Aïn Deheb|عين الذهب;Aïn Dzarit|عين دزاريت;Aïn El Hadid|عين الحديد;Aïn Kermes|عين كرمس;Chehaïma|شحيمة;Dahmouni|الدحموني;Djebilet Rosfa|جبيلة الرصفاء;Djileli Ben Amar|جيلالي بن عمار;Faïdja|الفايجة;Frenda|فرندة;Guertoufa|قرطوفة;Madna|مادنة;Mahdia|مهدية;Mechraa Sfa|مشرع الصفا;Medroussa|مدروسة;Meghila|مغيلة;Mellakou|ملاكو;Médrissa|مدريسة;Nadorah|الناظورة;Naïma|النعيمة;Oued Lili|وادي ليلي;Rahouia|الرحوية;Sebaïne|سبعين;Sebt|السبت;Sidi Abdelghani|سيدي عبد الغني;Sidi Abderrahmane|سيدي عبد الرحمان;Sidi Ali Mellal|سيدي علي ملال;Sidi Bakhti|سيدي بختي;Sidi Hosni|سيدي حسني;Sougueur|السوقر;Tagdemt|تاقدمت;Takhemaret|تخمارت;Tiaret|تيارت;Tidda|تيدة;Tousnina|توسنينة
15|Tizi Ouzou|تيزي وزو|Tizi Ouzou#Abi-Youcef|أبي يوسف;Aghribs|أغريب;Agouni-Gueghrane|أقني قغران;Ain-El-Hammam|عين الحمام;Ain-Zaouia|عين الزاوية;Ait Aggouacha|أيت عقواشة;Ait Bouaddou|أيت بوادو;Ait Boumahdi|أيت بومهدي;Ait Khellili|أيت خليلي;Ait Yahia Moussa|أيت يحي موسى;Ait-Aissa-Mimoun|أيت عيسى ميمون;Ait-Chafaa|أيت شافع;Ait-Mahmoud|أيت محمود;Ait-Oumalou|أيت أومالو;Ait-Toudert|أيت تودرت;Ait-Yahia|أيت يحيى;Akbil|اقبيل;Akerrou|أقرو;Assi-Youcef|أسي يوسف;Azazga|عزازقة;Azeffoun|أزفون;Beni Zmenzer|بني زمنزار;Beni-Aissi|بني عيسي;Beni-Douala|بني دوالة;Beni-Yenni|بني يني;Beni-Zikki|بني زيكي;Boghni|بوغني;Boudjima|بوجيمة;Bounouh|بونوح;Bouzeguene|بوزقن;Draa-Ben-Khedda|ذراع بن خدة;Draa-El-Mizan|ذراع الميزان;Freha|فريحة;Frikat|فريقات;Iboudrarene|إبودرارن;Idjeur|إيجار;Iferhounene|إفرحونان;Ifigha|إيفيغاء;Iflissen|إفليسن;Illilten|إيليلتن;Illoula Oumalou|إيلولة أومالو;Imsouhal|إمسوحال;Irdjen|إيرجن;Larbaa Nath Irathen|الأربعاء ناث إيراثن;M'kira|مكيرة;Maatkas|معاتقة;Makouda|ماكودة;Mechtras|مشطراس;Mekla|مقلع;Mizrana|ميزرانة;Ouacif|واسيف;Ouadhias|واضية;Ouaguenoun|واقنون;Sidi Namane|سيدي نعمان;Souama|صوامع;Souk-El-Tenine|سوق الاثنين;Tadmait|تادمايت;Tigzirt|تيقزيرت;Timizart|تيميزار;Tirmitine|تيرمتين;Tizi N'tleta|تيزي نثلاثة;Tizi-Gheniff|تيزي غنيف;Tizi-Ouzou|تيزي وزو;Tizi-Rached|تيزي راشد;Yakourene|إعكورن;Yatafene|يطافن;Zekri|زكري
16|Alger|الجزائر|Algiers#Ain Benian|عين بنيان;Ain Taya|عين طاية;Alger Centre|الجزائر الوسطى;Bab El Oued|باب الوادي;Bab Ezzouar|باب الزوار;Baba Hassen|بابا حسن;Bachedjerah|باش جراح;Baraki|براقي;Ben Aknoun|ابن عكنون;Beni Messous|بني مسوس;Bir Mourad Rais|بئر مراد رايس;Bir Touta|بئر توتة;Birkhadem|بئر خادم;Bologhine Ibnou Ziri|بولوغين بن زيري;Bordj El Bahri|برج البحري;Bordj El Kiffan|برج الكيفان;Bourouba|بوروبة;Bouzareah|بوزريعة;Casbah|القصبة;Cheraga|الشراقة;Dar El Beida|الدار البيضاء;Dely Ibrahim|دالي ابراهيم;Djasr Kasentina|جسر قسنطينة;Douira|الدويرة;Draria|الدرارية;El Achour|العاشور;El Biar|الابيار;El Harrach|الحراش;El Madania|المدنية;El Magharia|المغارية;El Marsa|المرسى;El Mouradia|المرادية;Hammamet|الحمامات;Herraoua|هراوة;Hussein Dey|حسين داي;Hydra|حيدرة;Khraissia|الخرايسية;Kouba|القبة;Les Eucalyptus|الكاليتوس;Maalma|المعالمة;Mohamed Belouzdad|محمد بلوزداد;Mohammadia|المحمدية;Oued Koriche|وادي قريش;Oued Smar|وادي السمار;Ouled Chebel|اولاد شبل;Ouled Fayet|اولاد فايت;Rahmania|الرحمانية;Rais Hamidou|الرايس حميدو;Reghaia|رغاية;Rouiba|الرويبة;Sehaoula|السحاولة;Sidi M'hamed|سيدي امحمد;Sidi Moussa|سيدي موسى;Souidania|سويدانية;Staoueli|سطاوالي;Tessala El Merdja|تسالة المرجة;Zeralda|زرالدة
17|Djelfa|الجلفة|Djelfa#Aïn Chouhada|عين الشهداء;Aïn El Ibel|عين الإبل;Aïn Maabed|عين معبد;Ben Yaagoub|بن يعقوب;Charef|الشارف;Dar Chioukh|دار الشيوخ;Djelfa|الجلفة;Douis|الدويس;El Gueddid|القديد;El Idrissia|الإدريسية;Hassi Bahbah|حاسي بحبح;Hassi El Euch|حاسي العش;M'Liliha|المليليحة;Moudjbara|المجبارة;Sidi Baïzid|سيدي بايزيد;Tadmit|تعظميت;Zaafrane|زعفران;Zaccar|زكار
18|Jijel|جيجل|Jijel#Bordj T'har|برج الطهر;Boudria Beniyadjis|بودريعة بني ياجيس;Bouraoui Belhadef|بوراوي بلهادف;Boussif Ouled Askeur|بوسيف أولاد عسكر;Chahna|الشحنة;Chekfa|الشقفة;Djemaa Beni Habibi|الجمعة بني حبيبي;Djimla|جيملة;El Ancer|العنصر;El Aouana|العوانة;El Kennar Nouchfi|القنار نشفي;El Milia|الميلية;Emir Abdelkader|الامير عبد القادر;Erraguene Souissi|أراقن سويسي;Ghebala|غبالة;Jijel|جيجل;Kaous|قاوس;Khiri Oued Adjoul|خيري واد عجول;Oudjana|وجانة;Ouled Rabah|أولاد رابح;Ouled Yahia Khadrouch|أولاد يحيى خدروش;Selma Benziada|سلمى بن زيادة;Settara|السطارة;Sidi Abdelaziz|سيدي عبد العزيز;Sidi Marouf|سيدي معروف;Taher|الطاهير;Texenna|تاكسنة;Ziama Mansouriah|زيامة منصورية
19|Sétif|سطيف|Sétif#Ain Abessa|عين عباسة;Ain Arnat|عين أرنات;Ain Azel|عين أزال;Ain El Kebira|عين الكبيرة;Ain Lahdjar|عين الحجر;Ain Oulmene|عين ولمان;Ain-Legradj|عين لقراج;Ain-Roua|عين الروى;Ain-Sebt|عين السبت;Ait Naoual Mezada|أيت نوال مزادة;Ait-Tizi|ايت تيزي;Amoucha|عموشة;Babor|بابور;Bazer-Sakra|بازر سكرة;Beidha Bordj|بيضاء برج;Bellaa|بلاعة;Beni Chebana|بني شبانة;Beni Fouda|بني فودة;Beni Ourtilane|بني ورتيلان;Beni Oussine|بني وسين;Beni-Aziz|بني عزيز;Beni-Mouhli|بني موحلي;Bir Haddada|بئر حدادة;Bir-El-Arch|بئر العرش;Bouandas|بوعنداس;Bougaa|بوقاعة;Bousselam|بوسلام;Boutaleb|بوطالب;Dehamcha|الدهامشة;Djemila|جميلة;Draa-Kebila|ذراع قبيلة;El Eulma|العلمة;El Ouricia|أوريسيا;El-Ouldja|الولجة;Guellal|قلال;Guelta Zerka|قلتة زرقاء;Guenzet|قنزات;Guidjel|قجال;Hamam Soukhna|حمام السخنة;Hamma|الحامة;Hammam Guergour|حمام قرقور;Harbil|حربيل;Kasr El Abtal|قصر الابطال;Maaouia|معاوية;Maouaklane|ماوكلان;Mezloug|مزلوق;Oued El Bared|واد البارد;Ouled Addouane|أولاد عدوان;Ouled Sabor|أولاد صابر;Ouled Si Ahmed|أولاد سي أحمد;Ouled Tebben|أولاد تبان;Rosfa|الرصفة;Salah Bey|صالح باي;Serdj-El-Ghoul|سرج الغول;Setif|سطيف;Tachouda|تاشودة;Tala-Ifacene|تالة إيفاسن;Taya|الطاية;Tella|التلة;Tizi N'bechar|تيزي نبشار
20|Saïda|سعيدة|Saïda#Ain El Hadjar|عين الحجر;Ain Sekhouna|عين السخونة;Ain Soltane|عين السلطان;Doui Thabet|دوي ثابت;El Hassasna|الحساسنة;Hounet|هونت;Maamora|المعمورة;Moulay Larbi|مولاي العربي;Ouled Brahim|أولاد إبراهيم;Ouled Khaled|أولاد خالد;Saida|سعيدة;Sidi Ahmed|سيدي احمد;Sidi Amar|سيدي عمر;Sidi Boubekeur|سيدي بوبكر;Tircine|تيرسين;Youb|يوب
21|Skikda|سكيكدة|Skikda#Ain Bouziane|عين بوزيان;Ain Charchar|عين شرشار;Ain Kechra|عين قشرة;Ain Zouit|عين زويت;Azzaba|عزابة;Bekkouche Lakhdar|بكوش لخضر;Ben Azzouz|بن عزوز;Beni Bechir|بني بشير;Beni Oulbane|بني ولبان;Beni Zid|بني زيد;Bin El Ouiden|بين الويدان;Bouchetata|بوشطاطة;Cheraia|الشرايع;Collo|القل;Djendel Saadi Mohamed|جندل سعدي محمد;El Arrouch|الحروش;El Ghedir|الغدير;El Hadaiek|الحدائق;El Marsa|المرسى;Emjez Edchich|مجاز الدشيش;Es Sebt|السبت;Filfila|فلفلة;Hammadi Krouma|حمادي كرومة;Kanoua|قنواع;Kerkara|الكركرة;Khenag Maoune|خناق مايو;Oued Zhour|وادي الزهور;Ouldja Boulbalout|الولجة بولبلوط;Ouled Attia|أولاد عطية;Ouled Habbaba|أولاد حبابة;Oum Toub|أم الطوب;Ramdane Djamel|رمضان جمال;Salah Bouchaour|صالح بو الشعور;Sidi Mezghiche|سيدي مزغيش;Skikda|سكيكدة;Tamalous|تمالوس;Zerdezas|زردازة;Zitouna|الزيتونة
22|Sidi Bel Abbès|سيدي بلعباس|Sidi Bel Abbès#Ain El Berd|عين البرد;Ain Kada|عين قادة;Ain Thrid|عين الثريد;Ain Tindamine|عين تندمين;Ain- Adden|عين أدن;Amarnas|العمارنة;Bedrabine El Mokrani|بضرابين المقراني;Belarbi|بلعربي;Ben Badis|بن باديس;Benachiba Chelia|بن عشيبة شلية;Bir El Hammam|بئر الحمام;Boudjebaa El Bordj|بوجبهة البرج;Boukhanefis|بوخنفيس;Chetouane Belaila|شيطوان البلايلة;Dhaya|الضاية;El Hacaiba|الحصيبة;Hassi Dahou|حاسي دحو;Hassi Zahana|حاسي زهانة;Lamtar|لمطار;M'cid|مسيد;Makedra|مكدرة;Marhoum|مرحوم;Merine|مرين;Mezaourou|مزاورو;Mostefa Ben Brahim|مصطفى بن ابراهيم;Moulay Slissen|مولاي سليسن;Oued Sebaa|وادي السبع;Oued Sefioun|وادي سفيون;Oued Taourira|وادي تاوريرة;Ras El Ma|راس الماء;Redjem Demouche|رجم دموش;Sehala Thaoura|السهالة الثورة;Sfisef|سفيزف;Sidi Ali Benyoub|سيدي علي بن يوب;Sidi Ali Boussidi|سيدي علي بوسيدي;Sidi Bel-Abbes|سيدي بلعباس;Sidi Brahim|سيدي ابراهيم;Sidi Chaib|سيدي شعيب;Sidi Dahou Zairs|سيدي دحو الزاير;Sidi Hamadouche|سيدي حمادوش;Sidi Khaled|سيدي خالد;Sidi Lahcene|سيدي لحسن;Sidi Yacoub|سيدي يعقوب;Tabia|طابية;Taoudmout|تاودموت;Tefessour|تفسور;Teghalimet|تغاليمت;Telagh|تلاغ;Tenira|تنيرة;Tessala|تسالة;Tilmouni|تلموني;Zerouala|زروالة
23|Annaba|عنابة|Annaba#Ain El Berda|عين الباردة;Annaba|عنابة;Berrahal|برحال;Chetaibi|شطايبي;Cheurfa|الشرفة;El Bouni|البوني;El Eulma|العلمة;El Hadjar|الحجار;Oued El Aneb|واد العنب;Seraidi|سرايدي;Sidi Amar|سيدي عمار;Treat|التريعات
24|Guelma|قالمة|Guelma#Ain Ben Beida|عين بن بيضاء;Ain Larbi|عين العربي;Ain Makhlouf|عين مخلوف;Ain Regada|عين رقادة;Ain Sandel|عين صندل;Belkheir|بلخير;Bendjarah|بن جراح;Beni Mezline|بني مزلين;Bordj Sabath|برج صباط;Bou Hachana|بوحشانة;Bou Hamdane|بوحمدان;Bouati Mahmoud|بوعاتي محمود;Bouchegouf|بوشقوف;Boumahra Ahmed|بومهرة أحمد;Dahouara|الدهوارة;Djeballah Khemissi|جبالة الخميسي;El Fedjoudj|الفجوج;Guelaat Bou Sbaa|قلعة بوصبع;Guelma|قالمة;Hammam Debagh|حمام دباغ;Hammam N'bail|حمام النبايل;Heliopolis|هيليوبوليس;Houari Boumedienne|هواري بومدين;Khezaras|لخزارة;Medjez Amar|مجاز عمار;Medjez Sfa|مجاز الصفاء;Nechmaya|نشماية;Oued Cheham|وادي الشحم;Oued Ferragha|وادي فراغة;Oued Zenati|وادي الزناتي;Ras El Agba|رأس العقبة;Roknia|الركنية;Sellaoua Announa|سلاوة عنونة;Tamlouka|تاملوكة
25|Constantine|قسنطينة|Constantine#Ain Abid|عين عبيد;Ain Smara|عين السمارة;Ben Badis|ابن باديس;Beni Hamidane|بني حميدان;Constantine|قسنطينة;Didouche Mourad|ديدوش مراد;El Khroub|الخروب;Hamma Bouziane|حامة بوزيان;Ibn Ziad|ابن زياد;Messaoud Boudjeriou|بوجريو مسعود;Ouled Rahmoun|أولاد رحمون;Zighoud Youcef|زيغود يوسف
26|Médéa|المدية|Médéa#Al Azizia|العزيزية;Aïssaouia|العيساوية;Baata|بعطة;Benchicao|بن شكاو;Berrouaghia|البرواقية;Bir Ben Abed|بئر بن عابد;Bouaïchoune|بوعيشون;Bouchrahil|بوشراحيل;Bouskène|بوسكن;Béni Slimane|بني سليمان;Deux Bassins|الحوضان;Djouab|جواب;Draa Essamar|ذراع السمار;Eddouair|الدواير;El Guelb El Kebir|القلب الكبير;El Hamdania|الحمدانية;El Omaria|العمارية;Hannacha|حناشة;Khamsa Djoumaa|خمس جوامع;Medjebar|مجبر;Meghraoua|مغراوة;Mezghenna|مزغنة;Mihoub|ميهوب;Médéa|المدية;Ouamri|وامري;Oued Harbil|وادي حربيل;Ouled Bouachra|أولاد بوعشرة;Ouled Brahim|أولاد إبراهيم;Ouled Deïde|أولاد ذايد;Ouzera|وزرة;Rebaïa|الربعية;Sedraïa|سدراية;Seghouane|سغوان;Si Mahdjoub|سي المحجوب;Sidi Errabie|سيدي الربيع;Sidi Naamane|سيدي نعمان;Sidi Zahar|سيدي زهار;Sidi Ziane|سيدي زيان;Souagui|السواقي;Tablat|تابلاط;Tamezguida|تمزقيدة;Tizi Mahdi|تيزي مهدي;Zoubiria|الزبيرية
27|Mostaganem|مستغانم|Mostaganem#Achaacha|عشعاشة;Ain-Boudinar|عين بودينار;Ain-Nouissy|عين نويسي;Ain-Sidi Cherif|عين سيدي الشريف;Ain-Tedles|عين تادلس;Benabdelmalek Ramdane|بن عبد المالك رمضان;Bouguirat|بوقيراط;Fornaka|فرناقة;Hadjadj|حجاج;Hassi Mameche|حاسي ماماش;Hassiane|الحسيان (بني ياحي;Khadra|خضرة;Kheir-Eddine|خير الدين;Mansourah|منصورة;Mazagran|مزغران;Mesra|ماسرة;Mostaganem|مستغانم;Nekmaria|نكمارية;Oued El Kheir|وادي الخير;Ouled Boughalem|أولاد بوغالم;Ouled-Maalah|أولاد مع الله;Safsaf|صفصاف;Sayada|صيادة;Sidi Ali|سيدي علي;Sidi Belaattar|سيدي بلعطار;Sidi-Lakhdar|سيدي لخضر;Sirat|سيرات;Souaflia|السوافلية;Sour|سور;Stidia|ستيدية;Tazgait|تزقايت;Touahria|الطواهرية
28|M'Sila|المسيلة|M'Sila#Aïn El Hadjel|عين الحجل;Aïn Khadra|عين الخضراء;Belaïba|بلعايبة;Berhoum|برهوم;Bouti Sayah|بوطي السايح;Béni Ilmane|بني يلمان;Chellal|الشلال;Dehahna|الدهاهنة;Hammam Dhalaa|حمام الضلعة;Khetouti Sed El Djir|خطوطي سد الجير;M'Sila|المسيلة;M'Tarfa|المطارفة;Maadid|المعاضيد;Maarif|المعاريف;Magra|مقرة;Ouanougha|ونوغة;Ouled Addi Guebala|أولاد عدي القبالة;Ouled Derradj|أولاد دراج;Ouled Madhi|أولاد ماضي;Ouled Mansour|أولاد منصور;Sidi Aïssa|سيدي عيسى;Sidi Hadjeres|سيدي هجرس;Souamaa|السوامع;Tarmount|تارمونت
29|Mascara|معسكر|Mascara#Ain Fares|عين فارس;Ain Fekan|عين فكان;Ain Ferah|عين فراح;Ain Frass|عين أفرص;Alaimia|العلايمية;Aouf|عوف;Benian|بنيان;Bou Henni|بوهني;Bouhanifia|بوحنيفية;Chorfa|الشرفاء;El Bordj|البرج;El Gaada|القعدة;El Ghomri|الغمري;El Gueitena|القطنة;El Hachem|الحشم;El Keurt|القرط;El Mamounia|المأمونية;El Menaouer|المنور;Ferraguig|فراقيق;Froha|فروحة;Gharrous|غروس;Ghriss|غريس;Guerdjoum|قرجوم;Hacine|حسين;Khalouia|خلوية;Makhda|ماقضة;Maoussa|ماوسة;Mascara|معسكر;Matemore|المطمور;Mocta-Douz|مقطع الدوز;Mohammadia|المحمدية;Nesmot|نسمط;Oggaz|عقاز;Oued El Abtal|وادي الأبطال;Oued Taria|وادي التاغية;Ras El Ain Amirouche|رأس عين عميروش;Sedjerara|سجرارة;Sehailia|السهايلية;Sidi Abdeldjebar|سيدي عبد الجبار;Sidi Abdelmoumene|سيدي عبد المومن;Sidi Boussaid|سيدي بوسعيد;Sidi Kada|سيدي قادة;Sig|سيق;Tighennif|تيغنيف;Tizi|تيزي;Zahana|زهانة;Zelamta|زلامطة
30|Ouargla|ورقلة|Ouargla#Ain Beida|عين البيضاء;El Borma|البرمة;Hassi Ben Abdellah|حاسي بن عبد الله;Hassi Messaoud|حاسي مسعود;N'goussa|انقوسة;Ouargla|ورقلة;Rouissat|الرويسات;Sidi Khouiled|سيدي خويلد
31|Oran|وهران|Oran#Ain Biya|عين البية;Ain Kerma|عين الكرمة;Ain Turk|عين الترك;Arzew|أرزيو;Ben Freha|بن فريحة;Bethioua|بطيوة;Bir El Djir|بئر الجير;Boufatis|بوفاتيس;Bousfer|بوسفر;Boutlelis|بوتليليس;El Ancor|العنصر;El Braya|البراية;El Kerma|الكرمة;Es Senia|السانية;Gdyel|قديل;Hassi Ben Okba|حاسي بن عقبة;Hassi Bounif|حاسي بونيف;Hassi Mefsoukh|حاسي مفسوخ;Marsat El Hadjadj|مرسى الحجاج;Mers El Kebir|المرسى الكبير;Messerghin|مسرغين;Oran|وهران;Oued Tlelat|وادي تليلات;Sidi Ben Yebka|سيدي بن يبقى;Sidi Chami|سيدي الشحمي;Tafraoui|طفراوي
32|El Bayadh|البيض|El Bayadh#Boualem|بوعلام;Bougtob|بوقطب;Brézina|بريزينة;Cheguig|الشقيق;El Bayadh|البيض;El Kheïther|الخيثر;Ghassoul|الغاسول;Kef El Ahmar|الكاف الأحمر;Krakda|كراكدة;Rogassa|روقاصة;Sidi Amar|سيدي عمر;Sidi Slimane|سيدي سليمان;Sidi Tifour|سيدي طيفور;Stitten|استيتن;Tousmouline|توسمولين
33|Illizi|إليزي|Illizi#Bordj Omar Driss|برج عمر إدريس;Debdeb|دبداب;Illizi|إليزي;In Amenas|إن أمناس
34|Bordj Bou Arreridj|برج بوعريريج|Bordj Bou Arreridj#Ain Taghrout|عين تاغروت;Ain Tesra|عين تسرة;Belimour|بليمور;Ben Daoud|بن داود;Bir Kasdali|بئر قاصد علي;Bordj Bou Arreridj|برج بوعريريج;Bordj Ghedir|برج الغدير;Bordj Zemmoura|برج زمورة;Colla|القلة;Djaafra|جعافرة;El Achir|الياشير;El Annasseur|العناصر;El Euch|العش;El M'hir|المهير;El Main|الماين;Elhammadia|الحمادية;Ghailasa|غيلاسة;Haraza|حرازة;Hasnaoua|حسناوة;Khelil|خليل;Ksour|القصور;Mansoura|المنصورة;Medjana|مجانة;Ouled Brahem|أولاد أبراهم;Ouled Dahmane|أولاد دحمان;Ouled Sidi-Brahim|أولاد سيدي ابراهيم;Rabta|الرابطة;Ras El Oued|رأس الوادي;Sidi-Embarek|سيدي أمبارك;Taglait|تقلعيت;Tassamert|تسامرت;Tefreg|تفرق;Teniet En Nasr|ثنية النصر;Tixter|تيكستار
35|Boumerdès|بومرداس|Boumerdès#Afir|أعفير;Ammal|عمال;Baghlia|بغلية;Ben Choud|بن شود;Beni Amrane|بني عمران;Bordj Menaiel|برج منايل;Boudouaou|بودواو;Boudouaou El Bahri|بودواو البحري;Boumerdes|بومرداس;Bouzegza Keddara|بوزقزة قدارة;Chabet El Ameur|شعبة العامر;Corso|قورصو;Dellys|دلس;Djinet|جنات;El Kharrouba|الخروبة;Hammedi|حمادي;Isser|يسر;Khemis El Khechna|خميس الخشنة;Larbatache|الاربعطاش;Leghata|لقاطة;Naciria|الناصرية;Ouled Aissa|أولاد عيسى;Ouled Hedadj|أولاد هداج;Ouled Moussa|أولاد موسى;Si Mustapha|سي مصطفى;Sidi Daoud|سيدي داود;Souk El Had|سوق الحد;Taourga|تاورقة;Thenia|الثنية;Tidjelabine|تيجلابين;Timezrit|تيمزريت;Zemmouri|زموري
36|El Tarf|الطارف|El Tarf#Ain El Assel|عين العسل;Ain Kerma|عين الكرمة;Asfour|عصفور;Ben M Hidi|بن مهيدي;Berrihane|بريحان;Besbes|البسباس;Bougous|بوقوس;Bouhadjar|بوحجار;Bouteldja|بوثلجة;Chebaita Mokhtar|شبيطة مختار;Chefia|الشافية;Chihani|شحاني;Drean|الذرعان;Echatt|الشط;El Aioun|العيون;El Kala|القالة;El Tarf|الطارف;Hammam Beni Salah|حمام بني صالح;Lac Des Oiseaux|بحيرة الطيور;Oued Zitoun|وادي الزيتون;Raml Souk|رمل السوق;Souarekh|السوارخ;Zerizer|زريزر;Zitouna|الزيتونة
37|Tindouf|تندوف|Tindouf#Oum El Assel|أم العسل;Tindouf|تندوف
38|Tissemsilt|تيسمسيلت|Tissemsilt#Ammari|عماري;Beni Chaib|بني شعيب;Beni Lahcene|بني لحسن;Bordj Bounaama|برج بونعامة;Bordj El Emir Abdelkader|برج الأمير عبد القادر;Boucaid|بوقائد;Khemisti|خميستي;Larbaa|الأربعاء;Lardjem|لرجام;Layoune|العيون;Lazharia|الأزهرية;Maacem|المعاصم;Melaab|الملعب;Ouled Bessam|أولاد بسام;Sidi Abed|سيدي عابد;Sidi Boutouchent|سيدي بوتوشنت;Sidi Lantri|سيدي العنتري;Sidi Slimane|سيدي سليمان;Tamellahet|تملاحت;Theniet El Had|ثنية الاحد;Tissemsilt|تيسمسيلت;Youssoufia|اليوسفية
39|El Oued|الوادي|El Oued#Bayadha|البياضة;Ben Guecha|بن قشة;Debila|الدبيلة;Douar El Maa|دوار الماء;El Ogla|العقلة;El-Oued|الوادي;Guemar|قمار;Hamraia|الحمراية;Hassani Abdelkrim|حساني عبد الكريم;Hassi Khalifa|حاسي خليفة;Kouinine|كوينين;Magrane|المقرن;Mih Ouansa|اميه وانسة;Nakhla|النخلة;Oued El Alenda|وادي العلندة;Ourmes|ورماس;Reguiba|الرقيبة;Robbah|الرباح;Sidi Aoun|سيدي عون;Taghzout|تغزوت;Taleb Larbi|الطالب العربي;Trifaoui|الطريفاوي
40|Khenchela|خنشلة|Khenchela#Ain Touila|عين الطويلة;Babar|بابار;Baghai|بغاي;Bouhmama|بوحمامة;Chechar|ششار;Chelia|شلية;Djellal|جلال;El Hamma|الحامة;El Mahmal|المحمل;El Oueldja|الولجة;Ensigha|انسيغة;Kais|قايس;Khenchela|خنشلة;Khirane|خيران;M'sara|مصارة;M'toussa|متوسة;Ouled Rechache|أولاد رشاش;Remila|الرميلة;Tamza|طامزة;Taouzianat|تاوزيانت;Yabous|يابوس
41|Souk Ahras|سوق أهراس|Souk Ahras#Ain Soltane|عين سلطان;Ain Zana|عين الزانة;Bir Bouhouche|بئر بوحوش;Drea|الدريعة;Haddada|الحدادة;Hanencha|الحنانشة;Khedara|الخضارة;Khemissa|خميسة;M'daourouche|مداوروش;Machroha|المشروحة;Merahna|المراهنة;Oued Kebrit|وادي الكبريت;Ouillen|ويلان;Ouled Driss|أولاد إدريس;Ouled Moumen|أولاد مومن;Oum El Adhaim|أم العظايم;Ragouba|الراقوبة;Safel El Ouiden|سافل الويدان;Sedrata|سدراتة;Sidi Fredj|سيدي فرج;Souk Ahras|سوق أهراس;Taoura|تاورة;Terraguelt|ترقالت;Tiffech|تيفاش;Zaarouria|الزعرورية;Zouabi|الزوابي
42|Tipaza|تيبازة|Tipaza#Aghbal|أغبال;Ahmer El Ain|أحمر العين;Ain Tagourait|عين تاقورايت;Attatba|الحطاطبة;Beni Mileuk|بني ميلك;Bou Haroun|بوهارون;Bou Ismail|بواسماعيل;Bourkika|بورقيقة;Chaiba|الشعيبة;Cherchell|شرشال;Damous|الداموس;Douaouda|دواودة;Fouka|فوكة;Gouraya|قوراية;Hadjout|حجوط;Hadjret Ennous|حجرة النص;Khemisti|خميستي;Kolea|القليعة;Larhat|الأرهاط;Menaceur|مناصر;Merad|مراد;Messelmoun|مسلمون;Nador|الناظور;Sidi Ghiles|سيدي غيلاس;Sidi Rached|سيدي راشد;Sidi Semiane|سيدي سميان;Sidi-Amar|سيدي عامر;Tipaza|تيبازة
43|Mila|ميلة|Mila#Ahmed Rachedi|أحمد راشدي;Ain Beida Harriche|عين البيضاء أحريش;Ain Mellouk|عين الملوك;Ain Tine|عين التين;Amira Arres|اعميرة اراس;Benyahia Abderrahmane|بن يحي عبد الرحمن;Bouhatem|بوحاتم;Chelghoum Laid|شلغوم العيد;Chigara|الشيقارة;Derrahi Bousselah|دراحي بوصلاح;El Ayadi Barbes|العياضي برباس;El Mechira|مشيرة;Ferdjioua|فرجيوة;Grarem Gouga|القرارم قوقة;Hamala|حمالة;Mila|ميلة;Minar Zarza|مينار زارزة;Oued Athmenia|وادي العثمانية;Oued Endja|وادي النجاء;Oued Seguen|وادي سقان;Ouled Khalouf|أولاد اخلوف;Rouached|الرواشد;Sidi Khelifa|سيدي خليفة;Sidi Merouane|سيدي مروان;Tadjenanet|تاجنانت;Tassadane Haddada|تسدان حدادة;Tassala Lematai|تسالة لمطاعي;Teleghma|التلاغمة;Terrai Bainen|ترعي باينان;Tiberguent|تيبرقنت;Yahia Beniguecha|يحي بني قشة;Zeghaia|زغاية
44|Aïn Defla|عين الدفلى|Aïn Defla#Ain-Benian|عين البنيان;Ain-Bouyahia|عين بويحيى;Ain-Defla|عين الدفلى;Ain-Lechiakh|عين الاشياخ;Ain-Soltane|عين السلطان;Ain-Torki|عين التركي;Arib|عريب;Bathia|بطحية;Belaas|بلعاص;Ben Allal|بن علال;Bir-Ould-Khelifa|بئر ولد خليفة;Birbouche|بربوش;Bordj-Emir-Khaled|برج الأمير خالد;Boumedfaa|بومدفع;Bourached|بوراشد;Djelida|جليدة;Djemaa Ouled Cheikh|جمعة أولاد الشيخ;Djendel|جندل;El-Abadia|العبادية;El-Amra|العامرة;El-Attaf|العطاف;El-Maine|الماين;Hammam-Righa|حمام ريغة;Hassania|الحسانية;Hoceinia|الحسينية;Khemis-Miliana|خميس مليانة;Mekhatria|المخاطرية;Miliana|مليانة;Oued Chorfa|وادي الشرفاء;Oued Djemaa|واد الجمعة;Rouina|الروينة;Sidi-Lakhdar|سيدي الأخضر;Tacheta Zegagha|تاشتة زقاغة;Tarik-Ibn-Ziad|طارق بن زياد;Tiberkanine|تبركانين;Zeddine|زدين
45|Naâma|النعامة|Naâma#Ain Ben Khelil|عين بن خليل;Ain Sefra|عين الصفراء;Asla|عسلة;Djenienne Bourezg|جنين بورزق;El Biodh|البيوض;Kasdir|القصدير;Makmen Ben Amar|مكمن بن عمار;Mecheria|المشرية;Moghrar|مغرار;Naama|النعامة;Sfissifa|سفيسيفة;Tiout|تيوت
46|Aïn Témouchent|عين تموشنت|Aïn Témouchent#Aghlal|أغلال;Ain El Arbaa|عين الأربعاء;Ain Kihal|عين الكيحل;Ain Temouchent|عين تموشنت;Ain Tolba|عين الطلبة;Aoubellil|عقب الليل;Beni Saf|بني صاف;Bouzedjar|بوزجار;Chaabat El Ham|شعبة اللحم;Chentouf|شنتوف;El Amria|العامرية;El Maleh|المالح;El Messaid|المساعيد;Emir Abdelkader|الأمير عبد القادر;Hammam Bou Hadjar|حمام بوحجر;Hassasna|الحساسنة;Hassi El Ghella|حاسي الغلة;Oued Berkeche|وادي برقش;Oued Sebbah|وادي الصباح;Ouled Boudjemaa|أولاد بوجمعة;Ouled Kihal|أولاد الكيحل;Oulhaca El Gheraba|ولهاصة الغرابة;Sidi Ben Adda|سيدي بن عدة;Sidi Boumediene|سيدي بومدين;Sidi Ouriache|سيدي ورياش;Sidi Safi|سيدي صافي;Tamzoura|تامزورة;Terga|تارقة
47|Ghardaïa|غرداية|Ghardaïa#Berriane|بريان;Bounoura|بونورة;Dhayet Bendhahoua|ضاية بن ضحوة;El Atteuf|العطف;El Guerrara|القرارة;Ghardaia|غرداية;Mansoura|المنصورة;Metlili|متليلي;Sebseb|سبسب;Zelfana|زلفانة
48|Relizane|غليزان|Relizane#Ain Rahma|عين الرحمة;Ain-Tarek|عين طارق;Ammi Moussa|عمي موسى;Belaassel Bouzagza|بلعسل بوزقزة;Bendaoud|بن داود;Beni Dergoun|بني درقن;Beni Zentis|بني زنطيس;Dar Ben Abdelah|دار بن عبد الله;Djidiouia|جديوية;El H'madna|الحمادنة;El Hassi|الحاسي;El Ouldja|الولجة;El-Guettar|القطار;El-Matmar|المطمر;Had Echkalla|حد الشكالة;Hamri|حمري;Kalaa|القلعة;Lahlef|لحلاف;Mazouna|مازونة;Mediouna|مديونة;Mendes|منداس;Merdja Sidi Abed|مرجة سيدي عابد;Ouarizane|واريزان;Oued El Djemaa|وادي الجمعة;Oued Essalem|وادي السلام;Oued-Rhiou|وادي رهيو;Ouled Aiche|أولاد يعيش;Ouled Sidi Mihoub|أولاد سيدي الميهوب;Ramka|الرمكة;Relizane|غليزان;Sidi Khettab|سيدي خطاب;Sidi Lazreg|سيدي لزرق;Sidi M'hamed Benali|سيدي أمحمد بن علي;Sidi M'hamed Benaouda|سيدي امحمد بن عودة;Sidi Saada|سيدي سعادة;Souk El Had|سوق الحد;Yellel|يلل;Zemmoura|زمورة
49|Timimoun|تيميمون|Timimoun#Aougrout|أوقروت;Charouine|شروين;Deldoul|دلدول;Ksar Kaddour|قصر قدور;Metarfa|المطارفة;Ouled Aissa|أولاد عيسى;Ouled Said|أولاد السعيد;Talmine|طالمين;Timimoun|تيميمون;Tinerkouk|تنركوك
50|Bordj Badji Mokhtar|برج باجي مختار|Bordj Badji Mokhtar#Bordj Badji Mokhtar|برج باجي مختار;Timiaouine|تيمياوين
51|Ouled Djellal|أولاد جلال|Ouled Djellal#Besbes|بسباس;Chaiba|الشعيبة;Doucen|الدوسن;Ouled Djellal|أولاد جلال;Ras El Miad|رأس الميعاد;Sidi Khaled|سيدي خالد
52|Béni Abbès|بني عباس|Béni Abbès#Beni-Abbes|بني عباس;Beni-Ikhlef|بن يخلف;El Ouata|الواتة;Igli|إقلي;Kerzaz|كرزاز;Ksabi|القصابي;Ouled-Khodeir|أولاد خضير;Tabelbala|تبلبالة;Tamtert|تامترت;Timoudi|تيمودي
53|In Salah|عين صالح|In Salah#Ain Salah|عين صالح;Foggaret Ezzoua|فقارة الزوى;Inghar|إينغر
54|In Guezzam|عين قزام|In Guezzam#Ain Guezzam|عين قزام;Tin Zouatine|تين زواتين
55|Touggourt|توقرت|Touggourt#Benaceur|بن ناصر;Blidet Amor|بلدة اعمر;El Alia|العالية;El-Hadjira|الحجيرة;M'naguer|المنقر;Megarine|المقارين;Nezla|النزلة;Sidi Slimane|سيدي سليمان;Taibet|الطيبات;Tebesbest|تبسبست;Temacine|تماسين;Touggourt|تقرت;Zaouia El Abidia|الزاوية العابدية
56|Djanet|جانت|Djanet#Bordj El Haouass|برج الحواس;Djanet|جانت
57|El M'Ghair|المغير|El M'Ghair#Djamaa|جامعة;El-M'ghaier|المغير;M'rara|المرارة;Oum Touyour|أم الطيور;Sidi Amrane|سيدي عمران;Sidi Khelil|سيدي خليل;Still|سطيل;Tenedla|تندلة
58|El Meniaa|المنيعة|El Meniaa#El Meniaa|المنيعة;Hassi Fehal|حاسي الفحل;Hassi Gara|حاسي القارة
59|Aflou|آفلو|Aflou#Aflou|آفلو;Aïn Sidi Ali|عين سيدي علي;Brida|بريدة;El Beïdha|البيضاء;El Ghicha|الغيشة;Gueltat Sidi Saad|قلتة سيدي سعد;Hadj Mechri|الحاج المشري;Oued M'Zi|وادي مزي;Oued Morra|وادي مرة;Sebgag|سبقاق;Sidi Bouzid|سيدي بوزيد;Taouiala|تاويالة
60|Barika|بريكة|Barika#Abdelkader Azil|عبد القادر عزيل;Barika|بريكة;Bitam|بيطام;Djezzar|الجزار;M'Doukal|امدوكال;Ouled Ammar|أولاد عمار;Seggana|سقانة;Tilatou|تيلاطو
61|El Kantara|القنطرة|El Kantara#Aïn Zaatout|عين زعطوط;Branis|البرانيس;Djemourah|جمورة;El Kantara|القنطرة;El Outaya|الوطاية
62|Bir El Ater|بئر العاتر|Bir El Ater#Bir El Ater|بئر العاتر;El Ogla El Melha|العقلة المالحة;Ferkane|فركان;Negrine|نقرين
63|El Aricha|العريشة|El Aricha#El Aricha|العريشة;El Bouihi|البويهي;El Gor|القور;Sidi Djillali|سيدي الجيلالي
64|Ksar Chellala|قصر الشلالة|Ksar Chellala#Bougara|بوقرة;Hamadia|حمادية;Ksar Chellala|قصر الشلالة;Rechaiga|الرشايقة;Serguine|سرقين;Zmalet El Emir Abdelkader|زمالة الأمير عبد القادر
65|Aïn Ouessara|عين وسارة|Aïn Ouessara#Aïn Fekka|عين فقة;Aïn Ouessara|عين وسارة;Benhar|بنهار;Birine|البيرين;Bouira Lahdab|بويرة الأحدب;El Khemis|الخميس;Guernini|قرنيني;Had Sahary|حد الصحاري;Hassi Fedoul|حاسي فدول;Sidi Ladjel|سيدي لعجال
66|Messaad|مسعد|Messaad#Amourah|عمورة;Deldoul|دلدول;Faïdh El Botma|فيض البطمة;Guettara|قطارة;Messaad|مسعد;Oum Laadham|أم العظام;Sed Rahal|سد رحال;Selmana|سلمانة
67|Ksar El Boukhari|قصر البخاري|Ksar El Boukhari#Aziz|عزيز;Aïn Boucif|عين بوسيف;Aïn Ouksir|عين القصير;Boghar|بوغار;Bouaiche|البواعيش;Boughezoul|بوغزول;Chahbounia|الشهبونية;Chelalet El Adhaoura|شلالة العذاورة;Cheniguel|شنيقل;Derrag|دراق;El Ouinet|العوينات;Kef Lakhdar|الكاف الأخضر;Ksar El Boukhari|قصر البخاري;M'Fatha|المفاتحة;Ouled Antar|أولاد عنتر;Ouled Hellal|أولاد هلال;Ouled Maaref|أولاد معرف;Oum El Djallil|أم الجليل;Saneg|السانق;Sidi Damed|سيدي دمد;Tafraout|تافراوت
68|Bou Saâda|بوسعادة|Bou Saâda#Aïn El Meleh|عين الملح;Aïn Errich|عين الريش;Aïn Farès|عين فارس;Ben Srour|بن سرور;Benzouh|بنزوه;Bir Foda|بئر الفضة;Bou Saada|بوسعادة;Djebel Messaad|جبل مساعد;El Hamel|الهامل;El Houamed|الحوامد;Khoubana|الخبانة;M'Cif|امسيف;Medjedel|امجدل;Menaâ|مناعة;Mouhamed Boudiaf|محمد بوضياف;Ouled Sidi Brahim|أولاد سيدي إبراهيم;Ouled Slimane|أولاد سليمان;Oultem|ولتام;Sidi Ameur|سيدي عامر;Sidi M'Hamed|سيدي امحمد;Slim|سليم;Tamsa|تامسة;Zarzour|الزرزور
69|El Abiodh Sidi Cheikh|الأبيض سيدي الشيخ|El Abiodh Sidi Cheikh#Arbaouat|أربوات;Aïn El Orak|عين العراك;Boussemghoun|بوسمغون;Chellala|الشلالة;El Abiodh Sidi Cheikh|الأبيض سيدي الشيخ;El Bnoud|البنود;El Meharra|المحرة`;

/* ============================================================
   DONNÉES FICTIVES — Packlik ERP + Boutique (prototype)
   Toutes les données ci-dessous sont fictives sauf le catalogue
   (91 produits / 17 catégories repris de packlik.shop).
   ============================================================ */
let _seed = 20261113;
function rnd(){ _seed |= 0; _seed = _seed + 0x6D2B79F5 | 0; let t = Math.imul(_seed ^ _seed >>> 15, 1 | _seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
const ri = (a,b)=> a + Math.floor(rnd()*(b-a+1));
const pick = arr => arr[Math.floor(rnd()*arr.length)];
const NOW = Date.now();
const MIN = 60e3, HOUR = 36e5, DAY = 864e5;

const COMPANY = {
  name:'PackLik', address:'Bt 115 cité, Douéra, Alger, Algérie', addressAr:'عمارة 115 حي، الدويرة، الجزائر', addressEn:'Bt 115 Cité, Douéra, Algiers, Algeria',
  phone1:'0549 59 31 60', phone2:'0540 02 19 14', email:'support@packlik.com', site:'packlik.shop'
};

const CATS = [
  ['tout','Tout','الكل',48],['boites','Boites','علب',27],['box-carton','Box Carton','علب كرتون',21],
  ['boite-salade','Boite Salade','علب السلطة',20],['barquettes','Barquettes','صواني',20],['papier-sac','Papier & Sac','ورق وأكياس',19],
  ['pok-bowl','POK BOWL','بوك بول',17],['packlik','PackLik','باكليك',17],['burger','Burger','برغر',16],
  ['boite-sandwiche','Boite Sandwiche','علب السندويش',11],['pack-promo','PACK PROMO','باك برومو',10],['tiramisu','TIRAMISU','تيراميسو',10],
  ['packs-promo','Packs promo','عروض الباقات',7],['boite-suchi','Boite Suchi','علب السوشي',7],['boite-patisseri','Boite Patisseri','علب الحلويات',4],
  ['sac-expedition','Sac Expedition','أكياس الشحن',2],['boite-compartiment','boîte compartiment','علب بخانات',1]
].map(([id,fr,ar,n],i)=>({id,fr,ar,n,order:i+1}));
const CAT_EN = {'tout':'All','boites':'Boxes','box-carton':'Cardboard boxes','boite-salade':'Salad boxes','barquettes':'Trays','papier-sac':'Paper & bags','pok-bowl':'Poke bowls','packlik':'PackLik','burger':'Burger','boite-sandwiche':'Sandwich boxes','pack-promo':'PROMO PACK','tiramisu':'Tiramisu','packs-promo':'Promo packs','boite-suchi':'Sushi boxes','boite-patisseri':'Pastry boxes','sac-expedition':'Shipping bags','boite-compartiment':'Compartment boxes'};
CATS.forEach(c=>c.en=CAT_EN[c.id]);
const CAT_BY_FR = Object.fromEntries(CATS.map(c=>[c.fr,c.id]));

const RAW_PRODUCTS = `BOIT LAYER CAYK 20-20-25 (10p)|1600|Box Carton
boite sauce ovale 60ml. 100p|850|Box Carton
boite 2 compartiment pro 50p|1850|Barquettes
boite sandwiche harachia 100ps|1900|Boite Sandwiche, Burger, Papier & Sac
BOITE BURGER 200P|2500|Burger, PackLik, Tout
boite ovale mécrondable 50p|1600|Boites, Tout
sac craft avev poignée 50p|2300|Packs promo, Papier & Sac
alum 1850 ml cotex / 50 pièces|2100|Barquettes
alum 650 ml cotex / 50 pièces|1100|Barquettes, Boite Salade
aluminium 3 compartiments / 100 pièces|2600|Barquettes
barquette 1000 cc / 100 pièces|1750|Boites, Box Carton
barquette 1250 cc / 100 pièces|2100|Boites, Box Carton
barquette 1500 cc / 100 pièces|2500|Boites, Box Carton
barquette 2000 cc / 100 pièces|2600|Boites, Box Carton
barquette 250 cc / 100 pièces|900|Boites, Box Carton
barquette 500 cc / 100 pièces|1200|Boites, Box Carton
barquette 750 cc / 100 pièces|1500|Boites, Box Carton
boîte 150 g ASP / 50 pièces|500|Boites, Box Carton
boîte 5 compartiments / 10 pièces|700|boîte compartiment
boîte club sandwich/ pâtisserie 120 pièces|2600|Boite Patisseri
boite cokiz 2027 100p|1300|Boite Patisseri, Boites, Box Carton, TIRAMISU
boîte crêpe 50p|850|Box Carton
boîte pizza 40p|620|Box Carton
bowl 26oz craft 70p|1200|Box Carton, PACK PROMO, PackLik, Packs promo, POK BOWL
bowl blanc 1250 ml / 100 pièces|2900|Box Carton
bowl craft 1250 ml / 100 pièces|2900|Box Carton
la boîte crêpes cari 100 pièce|1600|Box Carton
bowl 1100ml 2/3 compartiment 100ps|2800|Boite Salade, PACK PROMO, PackLik, POK BOWL, Tout
BOL 1100 CRAFT MARON 100P|2400|Boite Salade, PackLik, POK BOWL
BOL 1100 blanc 100P|2500|Boite Salade, PACK PROMO, PackLik, POK BOWL
sac doypac 250 g / 50 pièces|1300|Box Carton
sac doypac 500 g / 50 pièces|1500|Box Carton
Bowl imprimé dessert 700ml|2200|PackLik, POK BOWL
bowl imprimé 700ml|2200|PackLik, POK BOWL
Bowl imprimé extra bon 700ml|2200|PackLik, POK BOWL
Bowl imprimé halwa 700ML|2200|PackLik, POK BOWL
bowl imprimé noir 700ml|2200|PackLik, POK BOWL
bowl imprimé orange 700ml|2200|PackLik, POK BOWL
BOIT BURGER CRAFT 100P|1600|Burger, PackLik, Tout
BARKET DE FRITS 50P|400|Burger, PackLik, Tout
SAC CRAFT 3KG/5kg 100P|1500|Burger, PackLik, Papier & Sac, POK BOWL, TIRAMISU
PAPIER ROULOU 100 METR|800|PackLik, Papier & Sac, Tout
SAC CRAFT HAND 100P|4500|PackLik, Sac Expedition
boite layer cake 20-20-25. 10p|1600|Box Carton
Pack Fast Food|3600|Packs promo, Tout
Pack Plats à Emporter|5900|Packs promo, Tout
Pack Resturant|0|Packs promo, Tout
Pack Sadwich|5000|Packs promo, Tout
ALIMINIUM 200METR cotex|2400|Papier & Sac, Tout
barquet de frites 50p|400|Tout
BOITE MICRONDABL 2 compartiment 30P|1350|Barquettes, Boite Salade, Boites, Tout
BOITE MICRONDABL 1 Compartiment 30P|1350|Barquettes, Boite Salade, Boites, Tout
BOITE MICRONDABL 3 Compartiment 30P|1350|Barquettes, Boite Salade, Boites, Tout
BOITE salade NOIR 500 100P|1500|Barquettes, Boite Salade, Tout
BOITE MICRONDABL CRAFT 2C 100P|3700|Barquettes, Boite Salade, Boites, Tout
BOITE MICRONDABL CRAFT 1C 100P|3700|Barquettes, Boite Salade, Boites, Tout
BOITE SALAD OVALE NOIRE 100P|1500|Barquettes, Boite Salade, Tout
BOITE SALADe 400 100P|1500|Barquettes, Boite Salade, Boites, Tout
BOITE SALAD 500 100P|1600|Barquettes, Boite Salade, Boites, Tout
bol a sup caré Craft 100p|1800|Barquettes, Boite Salade, Boite Suchi, Boites, PackLik, POK BOWL, Tout
boite sandwich blanc 100p|1900|Boite Sandwiche
BOITE SANDWICH Craft 100P|1800|Boite Sandwiche, Tout
boite sandwich twila 100p|1900|Boite Sandwiche, Burger
pack promo 1|5500|PACK PROMO, Tout
PACK BURGER 2|5500|PACK PROMO, Tout
Pack Burger|4500|Packs promo, Tout
BOITE SAUCE KBIRA 50P|500|Barquettes, Boite Salade, Boite Sandwiche, Boite Suchi, Boites, Burger, PACK PROMO, Papier & Sac, POK BOWL, Tout
bol a sup noire 750 40P|1000|Barquettes, Boites, POK BOWL, Tout
boîte 100 g / 100 pièces|1100|TIRAMISU
BOITE TACOS 80P|850|Boite Sandwiche, Boites, Burger, POK BOWL, Tout
BOITE TIRAMISU 100g 100P|1100|Boites, TIRAMISU, Tout
TIRAMISU OVAL CRISTAL 1P|70|TIRAMISU, Tout
TIRAMISU CARI CRISTAL 1P|90|TIRAMISU, Tout
BOITE TIRAMISU 150 100P|1600|TIRAMISU, Tout
BOITE TIRAMISU 180 100P|1600|TIRAMISU, Tout
GOBLET 9 OZ 300P|3800|Burger, Papier & Sac, TIRAMISU, Tout
LIGON 100P/50PAIR|1200|Barquettes, Boite Salade, Boite Sandwiche, Boite Suchi, Boites, Burger, Papier & Sac, Tout
MINI SAC BURGEUR 100P|300|Tout
PAPIER SANDICH 400P|750|PACK PROMO, Papier & Sac, Tout
PAPIER SANDWICH JURNAL 300P|750|Papier & Sac, Sac Expedition
PAPIER SANDWICH JURNAL 300P/1,5KG-|750|PACK PROMO, Papier & Sac, Tout
PAPIER SANDWICH ORANGE 400P|750|Tout
PAPIER SILOFAN 200METR|950|Boite Patisseri, Boite Salade, Papier & Sac, Tout
PAPIERR COTEX 4800P|2250|Papier & Sac, Tout
PORTE GOBLET 100P|1800|Boite Sandwiche, Boite Suchi, Boites, Burger, Papier & Sac, Tout
SAC BURGER BLANC 400P|750|Burger, Papier & Sac, Tout
SAC SANDWISH 400P|900|Burger, Papier & Sac, Tout
SORBI 380 + PAYA 100P|2000|Boite Patisseri, Boite Salade, Boite Sandwiche, Boite Suchi, Boites, Burger, Papier & Sac, TIRAMISU, Tout
BOITE SAUCE MOYEN 40P|350|Barquettes, Boite Salade, Boite Sandwiche, Boite Suchi, Boites, Box Carton, Burger, PACK PROMO, Papier & Sac, POK BOWL, Tout
BOITE SAUC SGHIRA 100P|500|Barquettes, Boite Salade, Boite Sandwiche, Boite Suchi, Boites, Burger, PACK PROMO, Papier & Sac, POK BOWL, Tout
barquette bâteau sghira 100P|1500|Barquettes`;

function packSize(name){
  const m = name.match(/(\d+)\s*(p|ps|pièces?|pièce|P)\b/i) || name.match(/\((\d+)p\)/i);
  return m ? +m[1] : 1;
}
const PRODUCTS = RAW_PRODUCTS.split('\n').map((line,i)=>{
  const [name,price,cats] = line.split('|');
  const p = +price;
  const costPct = 0.65 + rnd()*0.10;
  const id = i+1;
  let stock = ri(40,420);
  if([23,36,72,90].includes(id)) stock = ri(6,22);          // stock bas
  if([47,78].includes(id)) stock = 0;                        // rupture
  return {
    id, sku:'PK-'+String(id).padStart(3,'0'), name, nameAr:'', price:p, cost: p? Math.round(p*costPct/10)*10 : 0,
    cats: cats.split(',').map(s=>CAT_BY_FR[s.trim()]).filter(Boolean),
    pack: packSize(name), stock, threshold: 30, weight: ri(3,30)*100, supplierId:1,
    status: stock===0 ? 'rupture' : 'actif', onDemand:false, isNew: id>=60 && id<=72, featured:[5,24,28,39,41,45,46,64,65,67,76,85].includes(id),
    sold30: 0, upsells: [], variants: null, packItems: null, lastSale: NOW - ri(0,20)*DAY, priceHistory:[]
  };
});
PRODUCTS.forEach(p=>{ p.priceHistory = [{at:NOW-120*DAY, sale:Math.round(p.price*0.94/10)*10, cost:Math.round(p.cost*0.95/10)*10},{at:NOW-40*DAY, sale:p.price, cost:p.cost}]; });
const PBY = Object.fromEntries(PRODUCTS.map(p=>[p.id,p]));
PBY[41].variants = [{id:'3kg',label:'3 KG',price:1500,cost:1030,stock:180},{id:'5kg',label:'5 KG',price:2300,cost:1590,stock:96}];
PBY[47].status = 'devis';
[30,44].forEach(id=>PBY[id].lastSale = NOW - 41*DAY); // produits dormants
// packs (composition)
PBY[45].packItems = [{pid:5,q:1},{pid:40,q:2},{pid:79,q:1}];
PBY[46].packItems = [{pid:11,q:1},{pid:13,q:1},{pid:77,q:1}];
PBY[48].packItems = [{pid:4,q:1},{pid:79,q:1},{pid:87,q:1}];
PBY[64].packItems = [{pid:24,q:1},{pid:30,q:1},{pid:67,q:2}];
PBY[65].packItems = [{pid:5,q:1},{pid:39,q:1},{pid:86,q:2}];
PBY[66].packItems = [{pid:5,q:1},{pid:79,q:2}];
// suggestions d'upsell
const UPS_BURGER=[79,41,67,40,86], UPS_BOWL=[77,67,89,7], UPS_TRAY=[77,49,89,42], UPS_SAND=[79,87,90,85], UPS_PAT=[83,72,73,21];
PRODUCTS.forEach(p=>{
  const c=p.cats; let u;
  if(c.includes('burger')) u=UPS_BURGER; else if(c.includes('pok-bowl')||c.includes('boite-salade')) u=UPS_BOWL;
  else if(c.includes('boite-sandwiche')) u=UPS_SAND; else if(c.includes('tiramisu')||c.includes('boite-patisseri')) u=UPS_PAT; else u=UPS_TRAY;
  p.upsells = u.filter(x=>x!==p.id);
});

/* 69 wilayas — frais client (domicile / bureau) et coût DHD */
const WILAYAS_RAW = `Adrar|أدرار|3;Chlef|الشلف|1;Laghouat|الأغواط|2;Oum El Bouaghi|أم البواقي|1;Batna|باتنة|1;Béjaïa|بجاية|1;Biskra|بسكرة|2;Béchar|بشار|3;Blida|البليدة|0;Bouira|البويرة|1;Tamanrasset|تمنراست|3;Tébessa|تبسة|1;Tlemcen|تلمسان|1;Tiaret|تيارت|1;Tizi Ouzou|تيزي وزو|1;Alger|الجزائر|0;Djelfa|الجلفة|2;Jijel|جيجل|1;Sétif|سطيف|1;Saïda|سعيدة|1;Skikda|سكيكدة|1;Sidi Bel Abbès|سيدي بلعباس|1;Annaba|عنابة|1;Guelma|قالمة|1;Constantine|قسنطينة|1;Médéa|المدية|1;Mostaganem|مستغانم|1;M'Sila|المسيلة|1;Mascara|معسكر|1;Ouargla|ورقلة|2;Oran|وهران|1;El Bayadh|البيض|2;Illizi|إليزي|3;Bordj Bou Arréridj|برج بوعريريج|1;Boumerdès|بومرداس|0;El Tarf|الطارف|1;Tindouf|تندوف|3;Tissemsilt|تيسمسيلت|1;El Oued|الوادي|2;Khenchela|خنشلة|1;Souk Ahras|سوق أهراس|1;Tipaza|تيبازة|0;Mila|ميلة|1;Aïn Defla|عين الدفلى|1;Naâma|النعامة|2;Aïn Témouchent|عين تموشنت|1;Ghardaïa|غرداية|2;Relizane|غليزان|1;Timimoun|تيميمون|3;Bordj Badji Mokhtar|برج باجي مختار|3;Ouled Djellal|أولاد جلال|2;Béni Abbès|بني عباس|3;In Salah|عين صالح|3;In Guezzam|عين قزام|3;Touggourt|تقرت|2;Djanet|جانت|3;El M'Ghair|المغير|2;El Meniaa|المنيعة|3;Aflou|آفلو|2;El Abiodh Sidi Cheikh|الأبيض سيدي الشيخ|2;El Aricha|العريشة|2;El Kantara|القنطرة|2;Barika|بريكة|1;Bou Saâda|بوسعادة|2;Bir El Ater|بئر العاتر|2;Ksar El Boukhari|قصر البخاري|1;Ksar Chellala|قصر الشلالة|2;Aïn Oussara|عين وسارة|2;Messaad|مسعد|2`;
const ZONE_FEES = [[400,250],[600,400],[900,650],[1200,900]];
const OLD_ZONE = Object.fromEntries(WILAYAS_RAW.split(';').map(s=>{ const [fr,,z]=s.split('|'); return [fr.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(), +z]; }));
const WILAYAS = [], COMMUNES = {};
GEO_RAW.split('\n').forEach(line=>{
  const [head, list] = line.split('#'); const [code, fr, ar, en] = head.split('|'); const id=+code;
  const key = fr.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const z = OLD_ZONE[key] ?? (id>58? 2 : 1); const [h,dk]=ZONE_FEES[z];
  WILAYAS.push({id, code:String(id).padStart(2,'0'), fr, ar, en, zone:z, home:h, desk:dk, dhdHome:h, dhdDesk:dk, active:true});
  COMMUNES[id] = list.split(';').map(c=>{ const [cf,ca]=c.split('|'); return {fr:cf, ar:ca}; });
});
const WBY = Object.fromEntries(WILAYAS.map(w=>[w.id,w]));
const COMMUNE_AR = {}; Object.values(COMMUNES).forEach(l=>l.forEach(c=>COMMUNE_AR[c.fr]=c.ar));
function communesOf(wid){ return (COMMUNES[wid]||[]).map(c=>c.fr); }

/* Équipe */
const USERS = [
  {id:1, name:'Mourad Bensalem', role:'admin', phone:'0550 11 22 33', email:'mourad@packlik.com', online:true, active:true},
  {id:2, name:'Rachid Hamdi', role:'gerant', phone:'0551 44 21 08', email:'rachid@packlik.com', online:true, active:true},
  {id:3, name:'Nadia Cherif', role:'manager', phone:'0552 90 13 77', email:'nadia@packlik.com', online:true, active:true, teamId:1},
  {id:4, name:'Yasmine Boudiaf', role:'agent', phone:'0660 12 34 56', email:'yasmine@packlik.com', online:true, active:true, teamId:1, weight:40, quota:20, fixed:30000, perDelivery:100, upsellPct:3, lang:'ar', hours:'08:30–17:00'},
  {id:5, name:'Karim Mansouri', role:'agent', phone:'0661 45 67 89', email:'karim@packlik.com', online:true, active:true, teamId:1, weight:35, quota:20, fixed:30000, perDelivery:100, upsellPct:3, lang:'fr', hours:'08:30–17:00'},
  {id:6, name:'Amina Kaci', role:'agent', phone:'0770 98 76 54', email:'amina@packlik.com', online:false, pause:true, active:true, teamId:1, weight:25, quota:20, fixed:28000, perDelivery:100, upsellPct:3, lang:'ar', hours:'12:00–20:00'},
  {id:7, name:'Sofiane Zerrouki', role:'agent', phone:'0771 23 45 67', email:'sofiane@packlik.com', online:true, active:true, teamId:1, weight:0, quota:15, fixed:28000, perDelivery:100, upsellPct:3, lang:'fr', hours:'12:00–20:00'},
  {id:8, name:'Hakim Ait Ali', role:'fournisseur', phone:'0553 77 66 55', email:'contact@mitidja-emballage.dz', online:false, active:true, supplierId:1},
];
const UBY = Object.fromEntries(USERS.map(u=>[u.id,u]));
const AGENTS = USERS.filter(u=>u.role==='agent');
const TEAMS = [{id:1, name:'Équipe Confirmation A', managerId:3}];

const SUPPLIERS = [{id:1, name:'Mitidja Emballage SARL', contact:'Hakim Ait Ali', phone:'0553 77 66 55', email:'contact@mitidja-emballage.dz', address:'Zone industrielle, Oued Smar, Alger', terms:7, termsMax:10, ceiling:null, userId:8}];

/* Clients fictifs */
const FIRST = ['Mohamed','Ahmed','Abdelkader','Yacine','Sofiane','Bilal','Hamza','Amine','Walid','Nassim','Riad','Samir','Farid','Lyes','Khaled','Mehdi','Nabil','Rachid','Sarah','Imane','Lamia','Meriem','Nour','Feriel','Hadjer','Selma','Amel','Kenza','Ryma','Souad'];
const LAST = ['Benali','Boukhalfa','Haddad','Meziane','Saidi','Rahmani','Belkacem','Touati','Ziani','Hamidi','Bouzid','Cherifi','Lounis','Amrani','Brahimi','Djebbar','Ferhat','Guerfi','Kaddour','Larbi','Mokrani','Ouali','Rezki','Slimani','Tahri','Yahiaoui','Zitouni','Bensaid','Messaoudi','Hadj'];
const SHOPS = ['Fast Food El Baraka','Pizzeria Napoli','Pâtisserie Les Délices','Snack Le Gourmet','Burger House','Tacos Factory','Crêperie Douce','Restaurant El Bahia','Sushi Corner','Salon de thé Yasmine','Chawarma Ezzine','Dar El Halwa','Food Truck Dz','Bowl & Co','Le Coin Sandwich'];
const WPOOL = [16,16,16,16,9,9,31,31,19,25,15,6,35,35,42,23,26,2,5,10,27,16,9,31];
const CUSTOMERS = [];
function phoneGen(){ return pick(['05','06','07']) + String(ri(10,99)) + ' ' + String(ri(10,99)) + ' ' + String(ri(10,99)) + ' ' + String(ri(10,99)); }
for(let i=0;i<46;i++){
  const w = pick(WPOOL); const pro = rnd()<0.55;
  CUSTOMERS.push({ id:i+1, name: pick(FIRST)+' '+pick(LAST), business: pro? pick(SHOPS):'', phone: phoneGen(), phone2: rnd()<0.2? phoneGen():'',
    wilaya:w, commune: pick(communesOf(w)), address: 'Rue '+ri(1,120)+', '+pick(['cité 500 logts','lotissement '+ri(1,40),'centre-ville','près de la mosquée','bd de l\'ALN','zone d\'activité']),
    pro, hist:{created:ri(0,6), delivered:0, returned:0, spent:0}, since: NOW - ri(20,400)*DAY, notes:'' });
}
CUSTOMERS.forEach(c=>{ c.hist.delivered = Math.max(0, c.hist.created - ri(0,2)); c.hist.returned = c.hist.created - c.hist.delivered; c.hist.spent = c.hist.delivered * ri(3,9)*1000; });
CUSTOMERS[7].hist = {created:5, delivered:2, returned:3, spent:9800};   // liste noire
CUSTOMERS[13].hist = {created:3, delivered:2, returned:1, spent:11200};  // à risque
CUSTOMERS[2].hist = {created:9, delivered:9, returned:0, spent:61400};   // fidèle pro
const CBY = Object.fromEntries(CUSTOMERS.map(c=>[c.id,c]));

/* Statuts */
const STATUS = {
  new:{fr:'Nouvelle',ph:'conf',c:'blue'}, calling:{fr:'En appel',ph:'conf',c:'violet'}, unreach:{fr:'Injoignable',ph:'conf',c:'amber'},
  callback:{fr:'Rappel programmé',ph:'conf',c:'kraft'}, cancelled:{fr:'Annulée',ph:'conf',c:'red'},
  toprep:{fr:'À préparer',ph:'prep',c:'kraft'}, ready:{fr:'Prête',ph:'prep',c:'green'},
  sent:{fr:'Envoyée à DHD',ph:'liv',c:'blue'}, picked:{fr:'Ramassée',ph:'liv',c:'blue'}, transit:{fr:'En transit',ph:'liv',c:'blue'}, outfor:{fr:'En livraison',ph:'liv',c:'blue'},
  failed:{fr:'Tentative échouée',ph:'liv',c:'red'}, delivered:{fr:'Livrée',ph:'liv',c:'green'},
  returning:{fr:'Retour en cours',ph:'liv',c:'red'}, returned:{fr:'Retournée',ph:'liv',c:'red'},
  paid:{fr:'Payée par DHD',ph:'enc',c:'green'}, closed:{fr:'Clôturée',ph:'enc',c:'dark'}
};
const CANCEL_REASONS = ['Refus','Prix','Doublon','Faux numéro','Hors zone','Autre'];
const FAIL_REASONS = [
  {id:'unreach', fr:'Client injoignable', action:'Rappeler le client + SMS/WhatsApp auto', delay:2*HOUR},
  {id:'postponed', fr:'Client reporté', action:'Saisir la nouvelle date et la transmettre à DHD', delay:24*HOUR},
  {id:'phoneoff', fr:'Téléphone éteint / faux', action:'Alerte Manager ; vérifier un 2e numéro', delay:2*HOUR},
  {id:'address', fr:'Adresse incorrecte', action:'Corriger l\'adresse et la transmettre à DHD', delay:2*HOUR},
  {id:'absent', fr:'Client absent', action:'Proposer la livraison au bureau DHD (stop desk)', delay:24*HOUR},
  {id:'refused', fr:'Refus du colis', action:'Appeler pour connaître la raison et sauver la vente', delay:2*HOUR},
  {id:'damaged', fr:'Colis endommagé', action:'Alerte Gérant ; réclamation DHD', delay:24*HOUR}
];
const FBY = Object.fromEntries(FAIL_REASONS.map(f=>[f.id,f]));

/* Paramètres */
const SETTINGS = {
  assignMode:'weighted', autoAssign:true, quota:20, reassignAfter:30, rrIndex:0,
  discountAgent:5, discountManager:10, supplierTerms:7, usdRate:260, adCostPerDelivered:700, commission:100,
  boxes:{security:20, reinvest:80, securityCap:15}, advanceCap:30, safetyMargin:20000,
  callbackDelays:['30 min','2 h','Lendemain'], dhdSyncMin:15, dhdApiKey:'dhd_live_••••••••3f9a', waKey:'',
  pixelId:'1029384756', capiToken:'EAAG••••••••', maintenance:false, primary:'#FD6400',
  rules:[{type:'wilaya', value:'31', agentId:5},{type:'source', value:'WhatsApp', agentId:4},{type:'montant', value:'10000', agentId:4}],
  templates:{unreach:'Bonjour {nom}, PackLik a essayé de vous joindre pour confirmer votre commande {ref}. Rappelez-nous au 0549 59 31 60.', shipped:'Votre commande {ref} est en route avec DHD. Suivi : {tracking}.'}
};

/* Sociétés de livraison (module Livraison) — DHD connectée, les autres prêtes à brancher */
const CARRIERS = [
  {id:'dhd', name:'DHD Express', short:'DHD', connected:true, isDefault:true, apiKey:'dhd_live_••••3f9a', apiUrl:'https://api.dhd-dz.com/v1', feeFactor:1, baseKg:5, extraPerKg:50, maxParcelKg:10, chargeOverweight:true, desk:true, cod:true, sync:15, color:'#2F6690', lastSync:NOW-7*MIN, status:'ok'},
  {id:'yalidine', name:'Yalidine', short:'YAL', connected:false, isDefault:false, apiKey:'', apiId:'', feeFactor:1.05, baseKg:5, extraPerKg:50, maxParcelKg:30, chargeOverweight:true, desk:true, cod:true, sync:15, color:'#C2453D'},
  {id:'zr', name:'ZR Express', short:'ZR', connected:false, isDefault:false, apiKey:'', apiId:'', feeFactor:0.95, baseKg:5, extraPerKg:40, maxParcelKg:20, chargeOverweight:true, desk:true, cod:true, sync:15, color:'#D99A2B'},
  {id:'maystro', name:'Maystro Delivery', short:'MAY', connected:false, isDefault:false, apiKey:'', feeFactor:1, baseKg:3, extraPerKg:60, maxParcelKg:15, chargeOverweight:true, desk:false, cod:true, sync:30, color:'#6A4C93'},
  {id:'noest', name:'Noest Express', short:'NOE', connected:false, isDefault:false, apiKey:'', apiId:'', feeFactor:0.9, baseKg:5, extraPerKg:50, maxParcelKg:20, chargeOverweight:true, desk:true, cod:true, sync:15, color:'#2F7D4F'},
  {id:'ecotrack', name:'EcoTrack (Procolis, Guepex…)', short:'ECO', connected:false, isDefault:false, apiKey:'', feeFactor:1, baseKg:5, extraPerKg:50, maxParcelKg:20, chargeOverweight:true, desk:true, cod:true, sync:15, color:'#C74B00'},
  {id:'own', name:'Mes livreurs', short:'PKL', connected:true, isDefault:false, internal:true, feeFactor:0.8, baseKg:20, extraPerKg:0, maxParcelKg:40, chargeOverweight:false, desk:false, cod:true, color:'#182028', wilayas:[16,9,35,42]}
];
const CRB = Object.fromEntries(CARRIERS.map(c=>[c.id,c]));
const COURIERS = [
  {id:1, name:'Walid Merabet', phone:'0661 30 44 12', vehicle:'Moto', zones:[16], communes:['Douira','Draria','Baba Hassen','Birtouta','Ouled Fayet'], active:true, online:true, perDelivery:250},
  {id:2, name:'Samir Bouchareb', phone:'0770 81 22 09', vehicle:'Utilitaire', zones:[16,9,35,42], communes:[], active:true, online:true, perDelivery:300},
  {id:3, name:'Fethi Larbi', phone:'0552 66 10 48', vehicle:'Moto', zones:[16], communes:['Bab Ezzouar','Dar El Beida','Rouiba','Reghaia','Bordj El Kiffan'], active:true, online:false, perDelivery:250},
];
const CUB = Object.fromEntries(COURIERS.map(c=>[c.id,c]));
/* Pixels publicitaires (module Pixels) */
const PIXELS = [
  {id:'fb1', platform:'facebook', name:'PackLik – principal', pixelId:'1029384756001', token:'EAAG••••••••ZD', testCode:'', active:true},
  {id:'fb2', platform:'facebook', name:'Compte pub 2 (retargeting)', pixelId:'8812003456712', token:'', testCode:'TEST4821', active:false},
  {id:'tt1', platform:'tiktok', name:'TikTok Ads PackLik', pixelId:'CQ8B1JRC77U5S7E2K4G0', token:'tt_••••••••a91', testCode:'', active:true},
];
const PIXEL_EVENTS = {
  facebook:{PageView:true, ViewContent:true, AddToCart:true, InitiateCheckout:true, Purchase:true, Lead:false},
  tiktok:{PageView:true, ViewContent:true, AddToCart:true, InitiateCheckout:true, CompletePayment:true, SubmitForm:false}
};
SETTINGS.purchaseOn = 'order'; // order | confirmed | delivered
SETTINGS.dedup = true;
SETTINGS.modules = {delivery:true, couriers:true, pixels:true, upsell:true, whatsapp:true, assignment:true, blacklist:true, weight:true};
SETTINGS.carrierRules = [{wilaya:16, carrier:'own'}];

/* ===== Génération des commandes ===== */
const SOURCES = ['Site','Site','Site','Site','WhatsApp','WhatsApp','Messenger','Instagram','Téléphone'];
const PLAN = [ // statut, nombre
  ['new',8],['calling',2],['unreach',5],['callback',3],['cancelled',4],['toprep',5],['ready',3],['sent',3],['transit',5],
  ['failed',7],['delivered',6],['returning',2],['returned',1],['paid',12],
  ['closed',48],['returned',5] // historique : commandes payées au fournisseur (clôturées) et retours
];
const ORDERS = [];
let refSeq = 1001;
function mkItems(){
  const base = pick([5,39,24,28,4,61,62,11,13,16,54,59,71,74,45,46,64,65,29,30,51,8,9,76,23]);
  const items = [{pid:base, q:ri(1,3)}];
  if(rnd()<0.5){ const x = pick([79,67,40,86,77,89,42,87]); if(x!==base) items.push({pid:x, q:ri(1,2)}); }
  return items.map(it=>{ const p=PBY[it.pid]; return {pid:it.pid, v:null, q:it.q, price:p.price, cost:p.cost, up:false}; });
}
function addUpsell(items){
  const p = PBY[items[0].pid]; const add = p.upsells.slice(0, rnd()<0.8?1:2);
  const res = items.map(x=>({...x}));
  add.forEach(pid=>{ const ex=res.find(r=>r.pid===pid); if(ex){ex.q++; ex.up=true;} else { const pp=PBY[pid]; res.push({pid, v:null, q:1, price:pp.price, cost:pp.cost, up:true}); } });
  if(rnd()<0.2) res[0].q++, res[0].up = true;
  return res;
}
let ord = 0;
const custQueue = CUSTOMERS.map(c=>c.id).sort(()=>rnd()-.5);
PLAN.forEach(([st,n])=>{
  for(let k=0;k<n;k++){
    ord++;
    const early = ['new','calling','unreach','callback'].includes(st);
    const ageDays = early ? rnd()*0.9 : st==='cancelled'? ri(0,12)+rnd() : ['toprep','ready'].includes(st)? rnd()*1.5 : ['sent','transit'].includes(st)? 1+rnd()*3 : st==='failed'? 2+rnd()*4 : st==='delivered'? 1.6+rnd()*4 : st==='paid'? 6.5+rnd()*8 : st==='closed'? 10+rnd()*20 : 5+rnd()*24;
    const created = NOW - ageDays*DAY - ri(0,50)*MIN;
    const cid = custQueue[ord % custQueue.length]; const c = CBY[cid];
    const agentPool = [4,4,4,5,5,5,6,6,7];
    const agentId = pick(agentPool);
    const initial = mkItems();
    const confirmedLater = !early && st!=='cancelled';
    const items = confirmedLater && rnd()<0.72 ? addUpsell(initial) : initial.map(x=>({...x}));
    const o = {
      id: ord, ref:'PK-'+(refSeq++), created, source: pick(SOURCES), customerId:cid, agentId,
      wilaya:c.wilaya, commune:c.commune, address:c.address, delivery: rnd()<0.75?'home':'desk', note:'',
      initial, items, discount:0, status:st, unreachN:0, calls:0, nextCall:null, cancelReason:'', tracking:'',
      attempts:[], history:[], lockedBy:null, dhdPaidAt:null, dhdPaymentId:null, lastDhdUpdate:null, riskReturn:false, duplicate:false, firstCallAt:null,
      times:{}, carrier:'dhd', courierId:null, parcels:null
    };
    const H = (dt, who, action, note, color)=> o.history.push({at: created+dt, who, action, note:note||'', color:color||''});
    H(0, 'Système', 'Commande créée', 'Source : '+o.source);
    H(4000, 'Système', 'Assignée à '+UBY[agentId].name.split(' ')[0], 'Mode : pondéré par performance');
    if(st==='new'){ o.calls=0; }
    if(st==='calling'){ o.calls=1; o.lockedBy=agentId; o.firstCallAt=created+ri(5,40)*MIN; H(o.firstCallAt-created,UBY[agentId].name,'Appel en cours','','blue'); }
    if(st==='unreach'){ o.unreachN = ri(1,3); o.calls=o.unreachN; o.firstCallAt=created+ri(5,40)*MIN; for(let u=1;u<=o.unreachN;u++) H(u*40*MIN,UBY[agentId].name,'Injoignable '+u,'Rappel programmé automatiquement','amber'); o.nextCall = NOW + [30*MIN,2*HOUR,20*HOUR][o.unreachN-1] - ri(0,40)*MIN; }
    if(st==='callback'){ o.calls=1; o.firstCallAt=created+ri(5,30)*MIN; o.nextCall = NOW + ri(-20,300)*MIN; H(30*MIN,UBY[agentId].name,'Rappel programmé','Le client demande à être rappelé','kraft'); }
    if(st==='cancelled'){ o.calls=ri(1,3); o.firstCallAt=created+ri(5,60)*MIN; o.cancelReason = pick(CANCEL_REASONS); H(60*MIN,UBY[agentId].name,'Annulée','Motif : '+o.cancelReason,'red'); }
    if(confirmedLater){
      o.calls = ri(1,2); o.firstCallAt=created+ri(5,90)*MIN; o.times.confirmed = o.firstCallAt+ri(3,9)*MIN;
      H(o.times.confirmed-created, UBY[agentId].name, 'Confirmée', items.some(i=>i.up)? 'Upsell ajouté au panier':'', 'green');
      const step = (key, offset, who, label, color)=>{ o.times[key]=o.times.confirmed+offset; H(o.times[key]-created, who, label, '', color); };
      if(st!=='toprep'){ step('ready', 3*HOUR, 'Rachid Hamdi', 'Prête (emballée et pesée)'); }
      if(!['toprep','ready'].includes(st)){ o.tracking = 'DHD'+ri(10000000,99999999); step('sent', 5*HOUR, 'Rachid Hamdi', 'Envoyée à DHD', 'blue'); if(st!=='sent') step('picked', 9*HOUR, 'DHD', 'Ramassée par le livreur', 'blue'); }
      if(['transit','failed','delivered','returning','returned','paid','closed'].includes(st)){ step('transit', 26*HOUR, 'DHD', 'En transit vers '+WBY[o.wilaya].fr, 'blue'); }
      o.lastDhdUpdate = Math.min(NOW-ri(1,20)*HOUR, o.times.transit||o.times.picked||NOW);
    }
    ORDERS.push(o);
  }
});
// Tentatives échouées : 7 "failed", 2 livrées après tentative, 3 retours => 12
const reasonsCycle = ['unreach','postponed','phoneoff','address','absent','refused','damaged','unreach','refused','absent','unreach','refused'];
let rc = 0;
function addAttempts(o, n, finalResolved){
  for(let a=1;a<=n;a++){
    const r = FBY[reasonsCycle[rc++ % reasonsCycle.length]];
    const at = (o.times.transit||o.created) + (20+a*22)*HOUR;
    const last = a===n;
    o.attempts.push({n:a, at, reason:r.id, comment: pick(['Client ne répond pas','Rappeler après 17h','Le client dit qu\'il n\'a rien commandé','Adresse introuvable, pas de repère','Magasin fermé','Colis abîmé au dépôt']), action: last && !finalResolved ? '' : r.action, agentId:o.agentId, due: at + r.delay, result: last && !finalResolved ? '' : 'Traité', resolved: !(last && !finalResolved)});
    o.history.push({at, who:'DHD', action:'Tentative '+a+' échouée', note:r.fr, color:'red'});
  }
}
const failedOrders = ORDERS.filter(o=>o.status==='failed');
failedOrders.forEach((o,i)=>{
  const n = [1,1,2,3,1,2,3][i];
  // tentatives récentes pour avoir des comptes à rebours vivants
  o.times.transit = NOW - (n*22+ri(6,30))*HOUR;
  addAttempts(o, n, false);
  const last = o.attempts[o.attempts.length-1];
  last.at = NOW - ri(10,150)*MIN; last.due = last.at + FBY[last.reason].delay;
  if(i===3) { last.due = NOW - 25*MIN; } // en retard
  o.riskReturn = n>=3;
  o.lastDhdUpdate = last.at;
});
failedOrders[1].lastDhdUpdate = NOW - 53*HOUR; failedOrders[1].attempts[0].at = NOW-53*HOUR; failedOrders[1].attempts[0].due = NOW-51*HOUR; // colis bloqué +48h
ORDERS.filter(o=>o.status==='transit').slice(0,1).forEach(o=>{ o.lastDhdUpdate = NOW - 50*HOUR; }); // bloqué
ORDERS.filter(o=>o.status==='delivered').slice(0,2).forEach(o=>addAttempts(o,1,true));
ORDERS.filter(o=>['returning','returned'].includes(o.status)).forEach(o=>{ addAttempts(o,3,true); o.riskReturn=true; });
// livraisons / paiements
ORDERS.forEach(o=>{
  const lastAtt = o.attempts.length ? o.attempts[o.attempts.length-1].at : 0;
  if(['delivered','paid','closed'].includes(o.status)){ o.times.delivered = Math.max(lastAtt, o.times.transit||o.created) + ri(10,30)*HOUR; if(o.times.delivered>NOW) o.times.delivered = NOW - ri(1,10)*HOUR; o.history.push({at:o.times.delivered, who:'DHD', action:'Livrée', note:'Client a payé le livreur', color:'green'}); o.lastDhdUpdate=o.times.delivered; }
  if(['paid','closed'].includes(o.status)){ o.times.paid = Math.min(NOW - ri(1,48)*HOUR, o.times.delivered + 4.9*DAY); if(o.times.paid < o.times.delivered) o.times.paid = o.times.delivered + DAY; o.history.push({at:o.times.paid, who:'Mourad Bensalem', action:'Payée par DHD (rapprochée)', note:'Répartition financière déclenchée', color:'green'}); }
  if(['returning','returned'].includes(o.status)){ o.times.returning = lastAtt + 6*HOUR; o.history.push({at:o.times.returning, who:'DHD', action:'Retour en cours', note:'Échec final après 3 tentatives', color:'red'}); if(o.status==='returned'){ o.times.returned = o.times.returning+2*DAY; o.history.push({at:o.times.returned, who:'Rachid Hamdi', action:'Retour réceptionné', note:'Stock réintégré', color:''}); } }
  o.history.sort((a,b)=>a.at-b.at);
});
// doublon probable
(function(){ const a = ORDERS.find(o=>o.status==='new'); const b = ORDERS.filter(o=>o.status==='new')[3]; if(a&&b){ b.customerId=a.customerId; b.items=a.items.map(x=>({...x})); b.initial=a.initial.map(x=>({...x})); b.wilaya=a.wilaya; b.commune=a.commune; b.address=a.address; b.duplicate=true; b.created=a.created+40*MIN; } })();
// quelques livraisons faites par nos propres livreurs (Alger)
ORDERS.filter(o=>o.wilaya===16 && ['sent','transit'].includes(o.status)).slice(0,3).forEach((o,i)=>{ o.carrier='own'; o.courierId=[1,2,1][i]; o.tracking='PKL-'+(5000+o.id); });
ORDERS.filter(o=>o.wilaya===16 && o.status==='delivered').slice(0,2).forEach((o,i)=>{ o.carrier='own'; o.courierId=i+1; o.tracking='PKL-'+(5000+o.id); o.cashWithCourier=true; });
// le client liste noire a une nouvelle commande
ORDERS.filter(o=>o.status==='new')[1].customerId = 8;

/* Versements DHD */
const DHD_PAYMENTS = [];
(function(){
  const paid = ORDERS.filter(o=>['paid','closed'].includes(o.status)).sort((a,b)=>a.times.paid-b.times.paid);
  const byDay = {}; paid.forEach(o=>{ const k=new Date(o.times.paid).toDateString(); (byDay[k]=byDay[k]||[]).push(o); });
  Object.values(byDay).forEach((g,i)=>{ const id='VDHD-'+(2240+i); const at=Math.max(...g.map(o=>o.times.paid)); g.forEach(o=>{o.dhdPaymentId=id; o.times.paid=at;}); const gap = i===Object.keys(byDay).length-2? 300:0; DHD_PAYMENTS.push({id, at, orderIds:g.map(o=>o.id), gap, gapNote: gap? 'Frais DHD facturés 300 DZD de plus que prévu':''}); });
})();

/* Dépenses Meta (USD) — 30 jours */
const AD_SPEND = [];
for(let d=29; d>=0; d--) AD_SPEND.push({date: NOW - d*DAY, campaign: pick(['Promo Burger Box','Bowls Pok – Alger','Retargeting panier','Pack Fast Food','Tiramisu cristal']), usd: +(4.5 + rnd()*3.2).toFixed(2)});

/* Fournisseur : bons de commande, réceptions, dettes, paiements */
const PURCHASES = [
  {id:'BC-0412', created:NOW-16*DAY, expected:NOW-13*DAY, status:'received', items:[{pid:5,q:60,cost:PBY[5].cost,recv:60},{pid:24,q:40,cost:PBY[24].cost,recv:38},{pid:79,q:80,cost:PBY[79].cost,recv:80}], receivedAt:NOW-13*DAY},
  {id:'BC-0418', created:NOW-9*DAY, expected:NOW-6*DAY, status:'received', items:[{pid:11,q:50,cost:PBY[11].cost,recv:50},{pid:13,q:50,cost:PBY[13].cost,recv:50},{pid:67,q:120,cost:PBY[67].cost,recv:115},{pid:39,q:40,cost:PBY[39].cost,recv:40}], receivedAt:NOW-6*DAY},
  {id:'BC-0423', created:NOW-4*DAY, expected:NOW-1*DAY, status:'received', items:[{pid:28,q:20,cost:PBY[28].cost,recv:20},{pid:30,q:15,cost:PBY[30].cost,recv:15},{pid:41,q:30,cost:1030,recv:30}], receivedAt:NOW-1*DAY},
  {id:'BC-0427', created:NOW-1*DAY, expected:NOW+2*DAY, status:'confirmed', items:[{pid:23,q:100,cost:PBY[23].cost,recv:0},{pid:72,q:500,cost:PBY[72].cost,recv:0},{pid:90,q:80,cost:PBY[90].cost,recv:0}]},
  {id:'BC-0428', created:NOW-2*HOUR, expected:NOW+4*DAY, status:'sent', items:[{pid:36,q:60,cost:PBY[36].cost,recv:0},{pid:76,q:20,cost:PBY[76].cost,recv:0}]},
];
const poTotal = po => po.items.reduce((s,i)=>s+i.cost*(po.status==='received'?i.recv:i.q),0);
/* Paiements au fournisseur, commande par commande :
   livrée → « en attente DHD » ; payée par DHD → « pending » (à régler) ; réglée → clôturée */
const SUP_PAYMENTS = [];
(function(){
  const closed = ORDERS.filter(o=>o.status==='closed').sort((a,b)=>a.times.paid-b.times.paid);
  const weeks = {}; closed.forEach(o=>{ const k=Math.floor((NOW-o.times.paid)/(5*DAY)); (weeks[k]=weeks[k]||[]).push(o); });
  Object.entries(weeks).sort((a,b)=>b[0]-a[0]).forEach(([k,g],i)=>{
    const at = Math.min(NOW-6*HOUR, Math.max(...g.map(o=>o.times.paid)) + ri(20,60)*HOUR);
    const id = 'PF-'+String(101+i);
    const lines = g.map(o=>({orderId:o.id, ref:o.ref, deliveredAt:o.times.delivered, dhdPaidAt:o.times.paid, items:o.items.map(it=>({pid:it.pid, q:it.q, cost:it.cost})), amount:o.items.reduce((s,it)=>s+it.cost*it.q,0)}));
    SUP_PAYMENTS.push({id, at, orderIds:g.map(o=>o.id), lines, amount:lines.reduce((s,l)=>s+l.amount,0), mode:pick(['Virement','Espèces','CCP']), proof:'recu_'+id+'.pdf', by:'Mourad Bensalem', confirmedAt: at + ri(2,20)*HOUR});
    g.forEach(o=>{ o.supplierPaymentId=id; o.times.closed=at; o.history.push({at, who:'Mourad Bensalem', action:'Clôturée', note:'Fournisseur payé ('+id+') — bénéfice figé', color:''}); });
  });
})();
/* Caisses */
const CASHBOXES = [
  {id:'reserve', fr:'Réserve fournisseur', c:'c1', balance:30000},
  {id:'pub', fr:'Budget pub', c:'c2', balance:30000},
  {id:'security', fr:'Caisse de sécurité', c:'c3', balance:40000},
  {id:'reinvest', fr:'Réinvestissement', c:'c4', balance:150000},
];
const CBX = Object.fromEntries(CASHBOXES.map(c=>[c.id,c]));
const CASH_MOVES = [];
const ADVANCES = [{id:'AV-07', amount:8000, at:NOW-3*DAY, due:NOW+2*DAY, repaidAt:null, note:'Boost campagne Pack Fast Food'}, {id:'AV-05', amount:18000, at:NOW-15*DAY, due:NOW-9*DAY, repaidAt:NOW-9*DAY, note:'Test audience Oran'}];

const EXPENSES = [
  {id:1, cat:'Loyer', amount:45000, cur:'DZD', at:NOW-12*DAY, box:'reinvest', note:'Local Douéra – novembre'},
  {id:2, cat:'Salaires et commissions', amount:116000, cur:'DZD', at:NOW-13*DAY, box:'reinvest', note:'Fixes agents octobre'},
  {id:3, cat:'Transport', amount:6500, cur:'DZD', at:NOW-5*DAY, box:'security', note:'Navette dépôt DHD'},
  {id:4, cat:'Emballage', amount:8200, cur:'DZD', at:NOW-8*DAY, box:'security', note:'Scotch, cartons d\'expédition'},
  {id:5, cat:'Divers', amount:3500, cur:'DZD', at:NOW-3*DAY, box:'security', note:'Recharge téléphones agents'},
];
const ACTIVITY = [];
const NOTIFS = [];

/* ============================================================
   NOYAU : i18n, icônes, formats, état, règles métier
   ============================================================ */
const S = {
  lang:'fr', role:'admin', agentId:4, cart:[], favs:new Set([5,24]), compare:new Set(),
  period:'30', drawer:null, modal:null, erpCollapsed:false, mOpen:false,
  ui:{}, heroIdx:0, lastOrderRef:null, editCart:null
};
const ROLE_USER = {admin:1, gerant:2, manager:3, agent:4, fournisseur:8};
function me(){ return UBY[S.uid] || {id:0, name:'—', role:S.role}; }
const isAdmin = ()=> S.role==='admin';
const seesCost = ()=> S.role==='admin';

/* ---------- i18n ---------- */
const AR = {}, EN = {}; const MISS = new Set();
/* modèles dynamiques (historique, notes, notifications) : [regex, anglais, arabe] — $1, $2 sont eux-mêmes traduits */
const TPAT = [];
function t(s){
  if(S.lang==='fr' || s==null || s==='') return s;
  const D = S.lang==='ar'? AR : EN;
  if(D[s]!==undefined) return D[s];
  for(const [re,en,ar] of TPAT){ const m = String(s).match(re); if(m){ return (S.lang==='ar'?ar:en).replace(/\$(\d)/g,(_,i)=>t(m[+i])); } }
  if(typeof s==='string' && /[a-zà-ÿ]{3}/i.test(s)) MISS.add(s);
  return s;
}
function catName(c){ return S.lang==='ar'? c.ar : S.lang==='en'? (c.en||c.fr) : c.fr; }
function wName(id){ const w=WBY[id]; return w? (S.lang==='ar'? w.ar : S.lang==='en'? (w.en||w.fr) : w.fr) : '—'; }
function langSwitch(dark){ return `<div class="lang-sw ${dark?'dark':''}" role="group" aria-label="Language">${[['ar','العربية'],['en','EN'],['fr','FR']].map(([k,l])=>`<button class="${S.lang===k?'on':''}" data-a="lang" data-v="${k}" lang="${k}">${l}</button>`).join('')}</div>`; }
function cName(fr){ return S.lang==='ar' && COMMUNE_AR[fr] ? COMMUNE_AR[fr] : fr; }
function communeOptions(wid, value){ const l=communesOf(+wid); let h=`<option value="">${t('— Choisir la commune —')}</option>`; if(value && !l.includes(value)) h+=`<option value="${esc(value)}" selected>${esc(value)}</option>`; return h + l.map(c=>`<option value="${esc(c)}" ${c===value?'selected':''}>${esc(cName(c))}</option>`).join(''); }
function stName(st, o){ if(o && st==='sent' && o.carrier && o.carrier!=='dhd'){ const cr=carrierOf(o); return cr.internal? t('Remise au livreur') : t('Envoyée à')+' '+cr.short; } let n = t(STATUS[st].fr); if(st==='unreach' && o) n += ' '+o.unreachN; return n; }

/* ---------- formats ---------- */
const esc = s => String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function nf(n){ return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' '); }
function dzd(n){ return (n<0?'− ':'') + nf(Math.abs(n)) + ' ' + (S.lang==='ar'?'دج':'DZD'); }
const MONTHS_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function pct(a,b){ return b? Math.round(a/b*1000)/10 : 0; }
function fmtPct(v){ return (Math.round(v*10)/10).toString().replace('.',',')+' %'; }
const MONTHS_FR=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const MONTHS_AR=['جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function pad(n){ return String(n).padStart(2,'0'); }
function monthName(i){ return (S.lang==='ar'?MONTHS_AR:S.lang==='en'?MONTHS_EN:MONTHS_FR)[i]; }
function fDate(ts){ const d=new Date(ts); return d.getDate()+' '+monthName(d.getMonth()); }
function fTime(ts){ const d=new Date(ts); return pad(d.getHours())+':'+pad(d.getMinutes()); }
function fDT(ts){ return fDate(ts)+' · '+fTime(ts); }
function ago(ts){ const m=Math.round((Date.now()-ts)/MIN); const L=S.lang; const pre = L==='ar'?'منذ ':L==='en'?'':'il y a '; const post = L==='en'?' ago':'';
  if(m<1) return t('à l\'instant'); if(m<60) return pre+m+' min'+post; const h=Math.floor(m/60); if(h<48) return pre+h+(L==='ar'?' سا':' h')+post; return pre+Math.floor(h/24)+(L==='ar'?' يوم':L==='en'?' d':' j')+post; }
function countdown(due){ const m=Math.round((due-Date.now())/MIN); const L=S.lang; const hh = L==='ar'?' سا ':' h ';
  if(m<0){ const a=-m; return {txt:(L==='ar'?'متأخر ':L==='en'?'late ':'en retard ')+(a<60? a+' min' : Math.floor(a/60)+hh+pad(a%60)), cls:'late'}; }
  return {txt: m<60? m+' min' : Math.floor(m/60)+hh+pad(m%60), cls: m<45?'soon':''}; }
function maskPhone(p){ return p.slice(0,4)+' •• •• '+p.slice(-2); }
function initials(n){ return n.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase(); }

/* ---------- icônes (traits fins) ---------- */
const IC = {
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  store:'<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v8h14v-8"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin:'<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14a6 6 0 0 1 3.5 6"/>',
  heart:'<path d="M12 20s-7.5-4.6-9.3-9.2C1.5 7.6 3.6 4.5 7 4.5c2 0 3.6 1.2 5 3 1.4-1.8 3-3 5-3 3.4 0 5.5 3.1 4.3 6.3C19.5 15.4 12 20 12 20z"/>',
  compare:'<path d="M7 4v16"/><path d="m3 8 4-4 4 4"/><path d="M17 20V4"/><path d="m21 16-4 4-4-4"/>',
  cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 7H6"/>',
  truck:'<path d="M2 6h12v10H2z"/><path d="M14 9h4l3 3.5V16h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>',
  shield:'<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  star:'<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>',
  box:'<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="m3 7.5 9 4.5 9-4.5"/><path d="M12 12v9"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  dash:'<rect x="3" y="3" width="8" height="10" rx="1.5"/><rect x="13" y="3" width="8" height="6" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/><rect x="3" y="15" width="8" height="6" rx="1.5"/>',
  chevR:'<path d="m9 5 7 7-7 7"/>', chevL:'<path d="m15 5-7 7 7 7"/>', chevD:'<path d="m5 9 7 7 7-7"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>', x:'<path d="M6 6l12 12M18 6 6 18"/>', check:'<path d="m4.5 12.5 5 5 10-11"/>',
  trash:'<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4.5M12 17.5v.01"/>',
  refresh:'<path d="M20 11a8 8 0 0 0-14.5-4.5L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.5 4.5L21 15"/><path d="M21 20v-5h-5"/>',
  download:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 20h16"/>',
  upload:'<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M4 4h16"/>',
  print:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  wa:'<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c.3 2.4 2.1 4.2 4.5 4.5l1-1.3 2 .8c-.2 1.3-1.2 2-2.5 2A6 6 0 0 1 8 9.5c0-1.3.7-2.3 2-2.5l.8 2z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  chart:'<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3M20 16V6"/>',
  wallet:'<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2"/><circle cx="16" cy="14.5" r="1.2"/>',
  book:'<path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a2 2 0 0 0-2 1 2 2 0 0 0-2-1H4z"/><path d="M12 5v15"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  shuffle:'<path d="M3 6h4l10 12h4"/><path d="M3 18h4l3-3.6M14 9.6 17 6h4"/><path d="m18 3 3 3-3 3M18 15l3 3-3 3"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  logout:'<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h11"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  edit:'<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="m14 6 4 4"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9"/><path d="M10 13h4"/>',
  arrowR:'<path d="M5 12h14M13 6l6 6-6 6"/>', send:'<path d="M21 3 10 14"/><path d="M21 3 14 21l-4-7-7-4z"/>',
  flag:'<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>', tag:'<path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
  percent:'<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>', file:'<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/>',
  undo:'<path d="M4 10h11a5 5 0 0 1 0 10H9"/><path d="m8 6-4 4 4 4"/>', zap:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  award:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>', headset:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="2.5" y="14" width="4" height="6" rx="1.5"/><rect x="17.5" y="14" width="4" height="6" rx="1.5"/><path d="M19.5 20a3 3 0 0 1-3 2H13"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', drag:'<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  hash:'<path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/>', pause:'<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
  factory:'<path d="M3 21V10l5 3V10l5 3V6l8 4v11z"/><path d="M7 17h2M12 17h2M17 17h2"/>'
};
function ic(name, cls){ return `<svg class="ico ${cls||''}" viewBox="0 0 24 24" aria-hidden="true">${IC[name]||''}</svg>`; }

/* ---------- illustrations produit (SVG placeholder) ---------- */
function prodTone(p){ const n=p.name.toLowerCase();
  if(/noir|black/.test(n)) return ['#2D2D2D','#454545','#1a1a1a'];
  if(/blanc|white|cristal|silofan/.test(n)) return ['#F4F1EC','#FFFFFF','#D9D2C7'];
  if(/alum|alim/.test(n)) return ['#C9CED3','#E6E9EC','#9AA2A9'];
  if(/orange/.test(n)) return ['#E58A3A','#F2A65E','#B9672A'];
  if(/imprim|halwa|dessert|extra/.test(n)) return ['#C99B6D','#E8D2B6','#C74B00'];
  return ['#C69A6B','#DDBA92','#C74B00'];
}
function prodKind(p){ const n=p.name.toLowerCase();
  if(p.packItems || /^pack|pack promo/.test(n)) return 'pack';
  if(/bowl|bol\b|bol /.test(n)) return 'bowl';
  if(/sac|doypac/.test(n)) return 'bag';
  if(/papier|roulou|alim.*metr|silofan|cotex 4800/.test(n)) return 'roll';
  if(/goblet/.test(n)) return 'cup';
  if(/sauce|sauc|sorbi|ligon|tiramisu.*1p/.test(n)) return 'sauce';
  if(/alum|barquette|barket|barquet/.test(n)) return 'tray';
  if(/pizza|layer|cayk|crêpe|crepe|club|cokiz|patisser/.test(n)) return 'flat';
  return 'box';
}
function prodArt(p, size){ if(p && p.images && p.images.length) return '<img src="'+esc(p.images[0])+'" alt="" loading="lazy" style="'+(size && size<=100? 'width:'+size+'px;height:'+size+'px;flex:none;border-radius:6px' : 'width:100%;height:100%')+';object-fit:contain;background:#fff;display:block">'; return prodSvg(p, size); }
function prodSvg(p, size){ if(!p) return '<svg></svg>';
  const [a,b,d] = prodTone(p), k = prodKind(p), s=size||120;
  let g='';
  if(k==='box') g=`<path d="M22 52 60 34l38 18v34L60 104 22 86z" fill="${a}"/><path d="M22 52 60 70l38-18" fill="none" stroke="${d}" stroke-width="2"/><path d="M60 70v34" stroke="${d}" stroke-width="2"/><path d="M22 52 60 34l38 18-38 18z" fill="${b}"/><path d="M38 44l38 18" stroke="${d}" stroke-width="1.5" opacity=".5"/>`;
  if(k==='flat') g=`<path d="M14 64 60 46l46 18v14L60 96 14 78z" fill="${a}"/><path d="M14 64 60 82l46-18-46-18z" fill="${b}"/><path d="M60 82v14" stroke="${d}" stroke-width="2"/><circle cx="60" cy="64" r="7" fill="none" stroke="${d}" stroke-width="1.5" opacity=".6"/>`;
  if(k==='bowl') g=`<ellipse cx="60" cy="52" rx="40" ry="11" fill="${d}"/><path d="M20 52c2 26 18 42 40 42s38-16 40-42c-6 6-22 10-40 10S26 58 20 52z" fill="${a}"/><ellipse cx="60" cy="49" rx="40" ry="11" fill="${b}"/><ellipse cx="60" cy="49" rx="34" ry="8" fill="${d}" opacity=".25"/>`;
  if(k==='tray') g=`<path d="M18 56h84l-10 34H28z" fill="${a}"/><path d="M14 52h92v6H14z" fill="${b}"/><path d="M30 64h60M32 74h56" stroke="${d}" stroke-width="1.5" opacity=".5"/>`;
  if(k==='bag') g=`<path d="M32 40h56l6 62H26z" fill="${a}"/><path d="M32 40h56l-4 8H36z" fill="${d}" opacity=".35"/><path d="M46 40c0-12 4-18 14-18s14 6 14 18" fill="none" stroke="${d}" stroke-width="3"/><path d="M40 60h40" stroke="${b}" stroke-width="3"/>`;
  if(k==='roll') g=`<rect x="26" y="40" width="60" height="44" rx="4" fill="${b}"/><ellipse cx="86" cy="62" rx="10" ry="22" fill="${a}"/><ellipse cx="86" cy="62" rx="4" ry="9" fill="${d}"/><path d="M26 84h60" stroke="${d}" stroke-width="1.5"/><path d="M34 52h40M34 60h40M34 68h30" stroke="${a}" stroke-width="2" opacity=".6"/>`;
  if(k==='cup') g=`<path d="M38 34h44l-6 66H44z" fill="${a}"/><ellipse cx="60" cy="34" rx="22" ry="6" fill="${b}"/><path d="M41 58h38" stroke="${d}" stroke-width="2"/><path d="M68 38h14l-6 62h-8z" fill="${d}" opacity=".18"/>`;
  if(k==='sauce') g=`<ellipse cx="44" cy="72" rx="20" ry="6" fill="${d}"/><path d="M24 58l4 16h32l4-16z" fill="${a}"/><ellipse cx="44" cy="58" rx="20" ry="6" fill="${b}"/><ellipse cx="80" cy="64" rx="16" ry="5" fill="${d}"/><path d="M64 52l3 13h26l3-13z" fill="${a}"/><ellipse cx="80" cy="52" rx="16" ry="5" fill="${b}"/>`;
  if(k==='pack') g=`<rect x="18" y="54" width="44" height="38" rx="3" fill="${a}"/><path d="M18 54h44l-4-8H22z" fill="${b}"/><path d="M58 50 84 38l22 12v26L84 88 58 76z" fill="#DDBA92"/><path d="M58 50l26 12 22-12" fill="none" stroke="#C74B00" stroke-width="1.5"/><rect x="36" y="30" width="22" height="16" rx="3" fill="#2F7D4F"/><text x="47" y="41.5" font-size="9" font-weight="800" fill="#fff" text-anchor="middle" font-family="Inter,sans-serif">%</text>`;
  return `<svg viewBox="0 0 120 120" width="${s}" height="${s}" role="img" aria-label="${esc(p.name)}"><ellipse cx="60" cy="104" rx="42" ry="5" fill="#000" opacity=".06"/>${g}</svg>`;
}
function logoMark(){ return '<img src="assets/brand/mark.png" alt="" width="26" height="26">'; }

/* ---------- règles métier : prix, finance, stock ---------- */
function itemPrice(it){ return it.price; }
function linesTotal(items){ return items.reduce((s,i)=>s+i.price*i.q,0); }
function linesCost(items){ return items.reduce((s,i)=>s+i.cost*i.q,0); }
/* ---------- livraison : société, poids, colis ---------- */
function carrierOf(o){ return CRB[o.carrier||'dhd'] || CRB.dhd; }
function unitWeightKg(pid){ return (PBY[pid].weight||0)/1000; }
function orderWeight(o){ return Math.round(expand(o.items).reduce((s,i)=>s+unitWeightKg(i.pid)*i.q,0)*100)/100; }
function extraKg(c, kg){ return c.extraPerKg? Math.max(0, Math.ceil(kg - c.baseKg)) : 0; }
function baseShip(o, c){ const w=WBY[o.wilaya]; if(!w) return 0; const b = o.delivery==='home'? w.dhdHome : w.dhdDesk; return Math.round(b*(c.feeFactor||1)/10)*10; }
function baseClientFee(o, c){ const w=WBY[o.wilaya]; if(!w) return 0; const b = o.delivery==='home'? w.home : w.desk; return Math.round(b*(c.feeFactor||1)/10)*10; }
function parcelsOf(o){ return o.parcels && o.parcels.length? o.parcels : [{n:1, weight:orderWeight(o), items:expand(o.items)}]; }
function overweightFee(o){ const c=carrierOf(o); return extraKg(c, orderWeight(o))*(c.extraPerKg||0); }
function feeOf(o){ if(o.freeShip) return 0; if(o.feeFixed!=null) return o.feeFixed; const c=carrierOf(o); return baseClientFee(o,c) + (c.chargeOverweight && SETTINGS.modules.weight? overweightFee(o) : 0); }
function dhdFeeOf(o){ if(o.dhdFixed!=null) return o.dhdFixed; const c=carrierOf(o); return parcelsOf(o).reduce((s,p)=>s + baseShip(o,c) + (SETTINGS.modules.weight? extraKg(c,p.weight)*(c.extraPerKg||0) : 0), 0); }
function needsSplit(o){ const c=carrierOf(o); return SETTINGS.modules.weight && !(o.parcels && o.parcels.length>1) && orderWeight(o) > c.maxParcelKg; }
function proposeParcels(o, maxKg){
  const units=[]; expand(o.items).forEach(i=>{ for(let k=0;k<i.q;k++) units.push({pid:i.pid, w:unitWeightKg(i.pid)}); });
  units.sort((a,b)=>b.w-a.w); const P=[];
  units.forEach(u=>{ let p=P.find(x=>x.weight+u.w<=maxKg+1e-9); if(!p){ p={n:P.length+1, weight:0, items:[]}; P.push(p); } p.weight=Math.round((p.weight+u.w)*100)/100; const it=p.items.find(x=>x.pid===u.pid); if(it) it.q++; else p.items.push({pid:u.pid, q:1}); });
  return P;
}
function kg(v){ return (Math.round(v*10)/10).toString().replace('.',',')+' kg'; }
function courierCash(cid){ return ORDERS.filter(o=>o.courierId===cid && o.cashWithCourier).reduce((s,o)=>s+orderTotal(o),0); }
function autoCarrier(o){ const r=(SETTINGS.carrierRules||[]).find(x=>+x.wilaya===+o.wilaya && CRB[x.carrier] && CRB[x.carrier].connected); if(r) return r.carrier; const d=CARRIERS.find(c=>c.isDefault&&c.connected); return d? d.id : 'dhd'; }
function orderSub(o){ return linesTotal(o.items); }
function orderTotal(o){ return orderSub(o) - discountAmt(o) + feeOf(o); }
function discountAmt(o){ return Math.round(orderSub(o) * (o.discount||0) / 100); }
function upsellGain(o){ return Math.max(0, orderSub(o) - linesTotal(o.initial)); }
function upsellPct(o){ const b=linesTotal(o.initial); return b? upsellGain(o)/b*100 : 0; }
function finOf(o){
  const products = orderSub(o) - discountAmt(o), fee = feeOf(o), total = products + fee;
  const cost = linesCost(o.items), dhd = dhdFeeOf(o), ad = SETTINGS.adCostPerDelivered, com = SETTINGS.commission;
  const net = total - cost - dhd - ad - com;
  const state = ['paid','closed'].includes(o.status)? 'encaissée' : o.status==='delivered'? 'acquise' : 'estimée';
  const security = net>0? Math.round(net*SETTINGS.boxes.security/100) : net; // une perte est absorbée par la caisse de sécurité
  return {products, fee, total, cost, dhd, ad, com, net, state, security, reinvest: net>0? net-security : 0};
}
function returnLoss(o){ return dhdFeeOf(o)*2 + SETTINGS.adCostPerDelivered; }
function expand(items){ // packs -> composants
  const out=[]; items.forEach(it=>{ const p=PBY[it.pid]; if(p && p.packItems) p.packItems.forEach(c=>out.push({pid:c.pid, q:c.q*it.q})); else out.push({pid:it.pid, q:it.q, v:it.v}); }); return out;
}
const BLOCK_ST = ['sent','picked','transit','outfor','failed'];
const RESERVED_ST = ['toprep','ready'], ATDHD_ST = ['sent','picked','transit','outfor','failed','returning'];
function stockInfo(pid){
  const p = PBY[pid]; let reserved=0, atDhd=0;
  ORDERS.forEach(o=>{ if(RESERVED_ST.includes(o.status) || ATDHD_ST.includes(o.status)) expand(o.items).forEach(it=>{ if(it.pid===pid){ if(RESERVED_ST.includes(o.status)) reserved+=it.q; else atDhd+=it.q; } }); });
  const physical = p.variants? p.variants.reduce((s,v)=>s+v.stock,0) : p.stock;
  return {physical, reserved, atDhd, available: physical - reserved};
}
const STOCK_MOVES = [];
function stockMove(pid, type, q, ref, motif, who){ STOCK_MOVES.unshift({at:Date.now(), pid, type, q, ref, motif:motif||'', who: who || me().name}); }
(function seedMoves(){
  PURCHASES.filter(p=>p.status==='received').forEach(po=>po.items.forEach(i=>STOCK_MOVES.push({at:po.receivedAt, pid:i.pid, type:'achat', q:i.recv, ref:po.id, motif: i.recv<i.q? 'Écart réception : −'+(i.q-i.recv):'', who:'Rachid Hamdi'})));
  ORDERS.filter(o=>o.times.delivered).forEach(o=>expand(o.items).forEach(i=>STOCK_MOVES.push({at:o.times.delivered, pid:i.pid, type:'vente', q:-i.q, ref:o.ref, motif:'', who:'DHD'})));
  ORDERS.filter(o=>o.status==='returned').forEach(o=>expand(o.items).forEach(i=>STOCK_MOVES.push({at:o.times.returned, pid:i.pid, type:'retour', q:i.q, ref:o.ref, motif:'Colis intact', who:'Rachid Hamdi'})));
  STOCK_MOVES.push({at:NOW-5*DAY, pid:23, type:'casse', q:-12, ref:'INV-11', motif:'Boîtes écrasées (humidité)', who:'Rachid Hamdi'});
  STOCK_MOVES.push({at:NOW-10*DAY, pid:67, type:'ajustement', q:-8, ref:'INV-10', motif:'Écart inventaire', who:'Mourad Bensalem'});
  STOCK_MOVES.sort((a,b)=>b.at-a.at);
})();
function lowStock(){ return PRODUCTS.filter(p=>p.price && p.status!=='devis' && stockInfo(p.id).available <= p.threshold); }

/* ---------- clients ---------- */
function custOrders(cid){ return ORDERS.filter(o=>o.customerId===cid); }
function custStats(cid){
  const c=CBY[cid], os=custOrders(cid);
  const delivered = c.hist.delivered + os.filter(o=>['delivered','paid','closed'].includes(o.status)).length;
  const returned = c.hist.returned + os.filter(o=>['returning','returned'].includes(o.status)).length;
  const created = c.hist.created + os.length;
  const spent = c.hist.spent + os.filter(o=>['delivered','paid','closed'].includes(o.status)).reduce((s,o)=>s+orderTotal(o),0);
  const refused = os.reduce((s,o)=>s+o.attempts.filter(a=>a.reason==='refused').length,0);
  const last = os.length? Math.max(...os.map(o=>o.created)) : c.since;
  const rate = (delivered+returned)? delivered/(delivered+returned)*100 : 0;
  const black = returned>=2;
  let seg = 'nouveau'; if(black) seg='liste noire'; else if(returned>=1 || refused>=1) seg='à risque'; else if(delivered>=3) seg = c.pro? 'professionnel':'fidèle'; else if(c.pro && delivered>=1) seg='professionnel';
  return {created, delivered, returned, spent, rate, black, seg, last, refused};
}
const SEG_C = {'nouveau':'blue','fidèle':'green','professionnel':'kraft','à risque':'amber','liste noire':'red'};

/* ---------- répartition des agents ---------- */
function agentLoad(aid){ return ORDERS.filter(o=>o.agentId===aid && ['new','calling','unreach','callback'].includes(o.status)).length; }
function agentAvailable(a){ return a.active && a.online && !a.pause && agentLoad(a.id) < (a.quota||SETTINGS.quota); }
function assignAgent(o){
  const avail = AGENTS.filter(agentAvailable);
  if(!SETTINGS.autoAssign || SETTINGS.assignMode==='manual' || !avail.length) return {id:null, why:'File commune (attribution manuelle)'};
  const prev = ORDERS.filter(x=>x.customerId===o.customerId && x.id!==o.id && x.agentId).sort((a,b)=>b.created-a.created)[0];
  if(prev && avail.find(a=>a.id===prev.agentId)) return {id:prev.agentId, why:'Client connu → même agent'};
  if(SETTINGS.assignMode==='rule'){
    for(const r of SETTINGS.rules){
      const ok = (r.type==='wilaya' && String(o.wilaya)===String(r.value)) || (r.type==='source' && o.source===r.value) || (r.type==='montant' && orderTotal(o) >= +r.value);
      if(ok && avail.find(a=>a.id===r.agentId)) return {id:r.agentId, why:'Règle '+r.type+' = '+r.value};
    }
  }
  if(SETTINGS.assignMode==='rr' || SETTINGS.assignMode==='rule'){ const a = avail[SETTINGS.rrIndex++ % avail.length]; return {id:a.id, why:'Tour de rôle'}; }
  if(SETTINGS.assignMode==='least'){ const a = avail.slice().sort((x,y)=>agentLoad(x.id)-agentLoad(y.id))[0]; return {id:a.id, why:'Charge la plus faible ('+agentLoad(a.id)+' en attente)'}; }
  // pondéré
  const tot = avail.reduce((s,a)=>s+(a.weight||1),0); let r = Math.random()*tot;
  for(const a of avail){ r -= (a.weight||1); if(r<=0) return {id:a.id, why:'Pondéré par performance ('+a.weight+' %)'}; }
  return {id:avail[0].id, why:'Pondéré'};
}

/* ---------- statut / historique / journal ---------- */
function log(action, entity, details){ ACTIVITY.unshift({at:Date.now(), user: me().name, role:S.role, action, entity, details:details||''}); }
function hist(o, action, note, color){ o.history.push({at:Date.now(), who: me().name, action, note:note||'', color:color||''}); }
function setStatus(o, st, note){
  const prev = o.status; if(prev===st) return;
  o.status = st; o.times[st] = Date.now(); o.lastDhdUpdate = Date.now();
  const color = STATUS[st].c==='red'?'red': STATUS[st].c==='green'?'green': STATUS[st].c==='amber'?'amber':'blue';
  hist(o, stName(st,o), note, color);
  if(st==='sent'){ o.feeFixed=feeOf(o); o.dhdFixed=dhdFeeOf(o); const cr=carrierOf(o); o.tracking = o.tracking || (cr.internal? 'PKL-' : cr.short)+Math.floor(10000000+Math.random()*89999999); if(o.parcels && o.parcels.length>1) o.parcels.forEach(p=>p.tracking=p.tracking||o.tracking+'-'+p.n); if(cr.internal && !o.courierId){ const cu=COURIERS.find(x=>x.active&&x.online&&x.zones.includes(o.wilaya)); if(cu) o.courierId=cu.id; } hist(o, 'Poids transmis à '+cr.name, kg(orderWeight(o))+' · '+parcelsOf(o).length+' colis','blue'); expand(o.items).forEach(i=>stockMove(i.pid,'expédition',-i.q,o.ref,'Remis à DHD')); expand(o.items).forEach(i=>{ const p=PBY[i.pid]; if(p.variants && i.v){ const v=p.variants.find(x=>x.id===i.v); if(v) v.stock-=i.q; } else p.stock-=i.q; }); }
  if(st==='returned'){ expand(o.items).forEach(i=>{ PBY[i.pid].stock+=i.q; stockMove(i.pid,'retour',i.q,o.ref,'Retour réintégré'); }); }
  if(st==='delivered'){ expand(o.items).forEach(i=>{ PBY[i.pid].sold30 += i.q; PBY[i.pid].lastSale = Date.now(); }); if(carrierOf(o).internal) o.cashWithCourier=true; if(SETTINGS.purchaseOn==='delivered') fbq('Purchase',{value:orderTotal(o), ref:o.ref}); }
  if(st==='toprep' && SETTINGS.purchaseOn==='confirmed') fbq('Purchase',{value:orderTotal(o), ref:o.ref});
  if(st==='paid'){ distribute(o); }
  log('Statut '+t(STATUS[prev].fr)+' → '+t(STATUS[st].fr), o.ref, note);
}
function cashMove(box, amount, type, ref, note){ CBX[box].balance += amount; CASH_MOVES.unshift({at:Date.now(), box, amount, type, ref, note:note||'', who: me().name}); }
function distribute(o){
  const f = finOf(o);
  cashMove('reserve', f.cost, 'Coût d\'achat', o.ref, 'Part fournisseur');
  cashMove('pub', f.ad, 'Remboursement pub', o.ref, 'Coût pub alloué');
  cashMove('security', f.security, 'Bénéfice ('+SETTINGS.boxes.security+' %)', o.ref);
  cashMove('reinvest', f.reinvest, 'Bénéfice ('+SETTINGS.boxes.reinvest+' %)', o.ref);
}
(function seedCash(){
  const M=(at,box,amount,type,ref,note,who)=>{ CASH_MOVES.push({at,box,amount,type,ref,note:note||'',who:who||'Système'}); CBX[box].balance+=amount; };
  ORDERS.filter(o=>['paid','closed'].includes(o.status)).forEach(o=>{ const f=finOf(o); const at=o.times.paid;
    M(at,'reserve',f.cost,'Coût d\'achat',o.ref,'Part fournisseur'); M(at,'pub',f.ad,'Remboursement pub',o.ref);
    M(at,'security',f.security,'Bénéfice ('+SETTINGS.boxes.security+' %)',o.ref); M(at,'reinvest',f.reinvest,'Bénéfice ('+SETTINGS.boxes.reinvest+' %)',o.ref); });
  SUP_PAYMENTS.forEach(p=>M(p.at,'reserve',-p.amount,'Paiement fournisseur',p.id,p.orderIds.length+' commandes','Mourad Bensalem'));
  ORDERS.filter(o=>o.status==='returned').forEach(o=>M(o.times.returned||o.created,'security',-returnLoss(o),'Perte retour (aller-retour DHD + pub)',o.ref));
  AD_SPEND.forEach(a=>M(a.date,'pub',-Math.round(a.usd*SETTINGS.usdRate),'Dépense Meta du jour','META',a.usd.toFixed(2)+' USD'));
  M(NOW-3*DAY,'reserve',-8000,'Avance pub','AV-07','Prêt interne → Budget pub','Mourad Bensalem'); M(NOW-3*DAY,'pub',8000,'Avance pub reçue','AV-07','À rembourser','Mourad Bensalem');
  EXPENSES.forEach(e=>M(e.at,e.box,-e.amount,'Dépense '+e.cat,'EXP-'+e.id,e.note,'Mourad Bensalem'));
  CASH_MOVES.sort((a,b)=>b.at-a.at);
})();

/* ---------- fournisseur : réglement commande par commande ---------- */
function supShare(o){ return linesCost(o.items); }
function supState(o){ if(o.status==='closed') return 'settled'; if(o.status==='paid') return 'due'; if(o.status==='delivered') return 'dhd'; if(['sent','picked','transit','outfor','failed'].includes(o.status)) return 'road'; return null; }
const SUP_STATE = {settled:['Payé (validé)','green'], due:['Pending — à régler','amber'], dhd:['En attente de paiement DHD','blue'], road:['En cours de livraison','']};
function supplierBalance(){
  const sum = st=>ORDERS.filter(o=>supState(o)===st).reduce((s,o)=>s+supShare(o),0);
  const paid = SUP_PAYMENTS.reduce((s,p)=>s+p.amount,0);
  return {due:sum('due'), dhd:sum('dhd'), road:sum('road'), paid, rest:sum('due')};
}
function supplierDues(){ // part fournisseur encaissée de DHD, échéance = paiement DHD + délai fournisseur
  return ORDERS.filter(o=>o.status==='paid').map(o=>({ref:o.ref, orderId:o.id, rest:supShare(o), due:(o.times.paid||Date.now())+SETTINGS.supplierTerms*DAY})).sort((a,b)=>a.due-b.due);
}
function moneyAtDhd(){ return ORDERS.filter(o=>o.status==='delivered').reduce((s,o)=>s+orderTotal(o)-dhdFeeOf(o),0); }
function moneyOnRoad(){ const rate = deliveryRate()/100; return Math.round(ORDERS.filter(o=>['sent','picked','transit','outfor','failed'].includes(o.status)).reduce((s,o)=>s+orderTotal(o)-dhdFeeOf(o),0)*rate); }
function deliveryRate(list){ const os=list||ORDERS; const d=os.filter(o=>['delivered','paid','closed'].includes(o.status)).length, r=os.filter(o=>['returning','returned'].includes(o.status)).length; return (d+r)? d/(d+r)*100 : 0; }
function advanceable(){ const dues3 = supplierDues().filter(d=>d.due <= Date.now()+3*DAY).reduce((s,d)=>s+d.rest,0); const open = ADVANCES.filter(a=>!a.repaidAt).reduce((s,a)=>s+a.amount,0); const cap = Math.round(CBX.reserve.balance*SETTINGS.advanceCap/100) - open; return Math.max(0, Math.min(cap, CBX.reserve.balance - dues3 - SETTINGS.safetyMargin)); }
/* journal quotidien : pub réelle du jour, CA livré du jour, bénéfice net du jour */
function dayStart(ts){ const d=new Date(ts); d.setHours(0,0,0,0); return d.getTime(); }
function dailyLedger(from, to){
  const rows=[]; for(let d=dayStart(to); d>=dayStart(from); d-=DAY){
    const e=d+DAY; const del = ORDERS.filter(o=>o.times.delivered>=d && o.times.delivered<e);
    const ca = del.reduce((s,o)=>s+orderTotal(o),0);
    const gross = del.reduce((s,o)=>{ const f=finOf(o); return s+f.total-f.cost-f.dhd-f.com; },0);
    const usd = AD_SPEND.filter(a=>a.date>=d && a.date<e).reduce((s,a)=>s+a.usd,0); const ad = Math.round(usd*SETTINGS.usdRate);
    const ret = ORDERS.filter(o=>(o.times.returning||0)>=d && o.times.returning<e).reduce((s,o)=>s+dhdFeeOf(o)*2,0);
    rows.push({d, rec:ORDERS.filter(o=>o.created>=d&&o.created<e).length, deliv:del.length, ca, usd, ad, ret, net:gross-ad-ret});
  } return rows;
}
/* ---------- toasts / modales ---------- */
function toast(msg, kind){ const el=document.createElement('div'); el.className='toast '+(kind||''); el.setAttribute('role','status'); el.innerHTML=ic(kind==='bad'?'alert':'check','sm')+'<span>'+msg+'</span>'; document.getElementById('toasts').appendChild(el); setTimeout(()=>el.remove(), 3600); }
function openModal(html, wide){ S.modal = {html, wide}; renderOverlay(); setTimeout(()=>{ const f=document.querySelector('.modal input,.modal select,.modal textarea'); if(f) f.focus(); },30); }
function closeModal(){ S.modal=null; renderOverlay(); }
function modalTpl(title, body, foot, wide){ return `<div class="overlay" data-a="overlayClose"><div class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-h"><h3>${title}</h3><button class="btn icon ghost" data-a="closeModal" aria-label="${t('Fermer')}">${ic('x')}</button></div><div class="modal-b">${body}</div>${foot?`<div class="modal-f">${foot}</div>`:''}</div></div>`; }
function renderOverlay(){
  const ov = document.getElementById('ov');
  let h = '';
  if(S.drawer && !S.drawer.page) h += renderDrawer();
  if(S.modal) h += S.modal.html;
  ov.innerHTML = h;
}
function val(id){ const el=document.getElementById(id); return el? el.value : ''; }

/* ---------- graphiques SVG ---------- */
function lineChart(series, labels, opts){
  opts=opts||{}; const W=opts.w||640,H=opts.h||220,pl=46,pr=12,pt=12,pb=26;
  const all = series.flatMap(s=>s.data); const max = Math.max(1,...all)*1.1;
  const x = i=> pl + i*(W-pl-pr)/Math.max(1,labels.length-1), y=v=> pt + (H-pt-pb)*(1-v/max);
  let g='';
  for(let k=0;k<=4;k++){ const v=max*k/4, yy=y(v); g+=`<line x1="${pl}" x2="${W-pr}" y1="${yy}" y2="${yy}" stroke="#EFEAE2"/><text x="${pl-6}" y="${yy+4}" font-size="10" fill="#6B746F" text-anchor="end">${v>=1000? Math.round(v/1000)+'k': Math.round(v)}</text>`; }
  labels.forEach((l,i)=>{ if(i%Math.ceil(labels.length/8)===0) g+=`<text x="${x(i)}" y="${H-8}" font-size="10" fill="#6B746F" text-anchor="middle">${l}</text>`; });
  series.forEach(s=>{
    const pts = s.data.map((v,i)=>x(i)+','+y(v)).join(' ');
    if(s.area) g+=`<polygon points="${pl},${y(0)} ${pts} ${x(s.data.length-1)},${y(0)}" fill="${s.color}" opacity=".10"/>`;
    g+=`<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" ${s.dash?'stroke-dasharray="5 4"':''}/>`;
    s.data.forEach((v,i)=>{ g+=`<circle cx="${x(i)}" cy="${y(v)}" r="7" fill="transparent"><title>${labels[i]} · ${s.name} : ${nf(v)}</title></circle>`; });
  });
  return `<div class="chart" dir="ltr"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label||'graphique')}">${g}</svg></div>`;
}
function barChart(data, opts){ // data [{l, v, c}]
  opts=opts||{}; const W=opts.w||640,H=opts.h||200,pl=40,pt=10,pb=28; const max=Math.max(1,...data.map(d=>d.v))*1.1; const bw=(W-pl-10)/data.length;
  let g=''; for(let k=0;k<=4;k++){ const v=max*k/4, yy=pt+(H-pt-pb)*(1-k/4); g+=`<line x1="${pl}" x2="${W-10}" y1="${yy}" y2="${yy}" stroke="#EFEAE2"/><text x="${pl-6}" y="${yy+4}" font-size="10" fill="#6B746F" text-anchor="end">${v>=1000?Math.round(v/1000)+'k':Math.round(v)}</text>`; }
  data.forEach((d,i)=>{ const h=(H-pt-pb)*d.v/max, xx=pl+i*bw+bw*.18; g+=`<rect x="${xx}" y="${H-pb-h}" width="${bw*.64}" height="${h}" rx="3" fill="${d.c||'#FD6400'}"><title>${esc(d.l)} : ${nf(d.v)}</title></rect><text x="${xx+bw*.32}" y="${H-10}" font-size="10" fill="#6B746F" text-anchor="middle">${esc(d.l)}</text>`; });
  return `<div class="chart" dir="ltr"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label||'graphique')}">${g}</svg></div>`;
}
function donut(parts, size){ // [{v,c,l}]
  const tot = parts.reduce((s,p)=>s+p.v,0)||1; let a=0; const r=40, C=2*Math.PI*r; let g='';
  parts.forEach(p=>{ const len=C*p.v/tot; g+=`<circle cx="50" cy="50" r="${r}" fill="none" stroke="${p.c}" stroke-width="16" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-a}" transform="rotate(-90 50 50)"><title>${esc(p.l)} : ${nf(p.v)}</title></circle>`; a+=len; });
  return `<svg viewBox="0 0 100 100" width="${size||120}" height="${size||120}" role="img" aria-label="répartition">${g}</svg>`;
}
function barsList(rows, money){ const max=Math.max(1,...rows.map(r=>r.v)); return `<div class="bars">${rows.map(r=>`<div class="b"><span>${r.l}</span><b class="num">${money? dzd(r.v): nf(r.v)}${r.extra?' <span class="muted small">'+r.extra+'</span>':''}</b><div class="t"><i style="width:${r.v/max*100}%;${r.c?'background:'+r.c:''}"></i></div></div>`).join('')}</div>`; }

/* ============================================================
   BOUTIQUE EN LIGNE (copie de packlik.shop, branchée sur l'ERP)
   ============================================================ */
S.ui.shop = {cat:null, min:'', max:'', sort:'pop', per:12, page:1, q:'', tab:'new'};

function cartCount(){ return S.cart.reduce((s,i)=>s+i.q,0); }
function cartTotal(){ return S.cart.reduce((s,i)=>s+i.price*i.q,0); }
function pName(p){ return p.name; }
function pPrice(p){ if(p.status==='devis' || !p.price) return t('Prix sur devis'); if(p.variants) return dzd(Math.min(...p.variants.map(v=>v.price)))+' – '+dzd(Math.max(...p.variants.map(v=>v.price))); return dzd(p.price); }
function canOrder(p){ if(p.status==='devis' || !p.price) return false; return stockInfo(p.id).available>0 || p.onDemand; }

function shopShell(content, active){
  const cats = CATS;
  return `
  <div class="demo-bar"><div class="in">
    <span class="row">${ic('zap','sm')} ${t('Emballage alimentaire livré partout en Algérie')}</span>
    <span class="row">
      ${langSwitch()}
      <a href="#/erp/dashboard" class="btn sm" style="background:#fff;color:var(--ink);border-color:#fff">${ic('dash','sm')} ${t('Espace équipe')}</a>
    </span>
  </div></div>
  <div class="shop-top"><div class="in">
    <span class="row">${ic('phone','sm')} <a href="tel:0549593160">${COMPANY.phone1}</a> (WhatsApp) · <a href="tel:0540021914">${COMPANY.phone2}</a></span>
    <span class="row">${ic('mail','sm')} <a href="mailto:${COMPANY.email}">${COMPANY.email}</a></span>
    <span class="row grow">${ic('pin','sm')} ${S.lang==='ar'?COMPANY.addressAr:S.lang==='en'?COMPANY.addressEn:COMPANY.address}</span>
    <span class="row">${ic('truck','sm')} ${t('Livraison 69 wilayas')} · ${t('Paiement à la livraison')}</span>
  </div></div>
  <header class="shop-h"><div class="in">
    <a href="#/" class="logo" aria-label="PackLik — accueil"><img src="assets/brand/logo.png" alt="PackLik" width="560" height="111"></a>
    <form class="search" data-sub="shopSearch" role="search"><input id="shopQ" type="search" placeholder="${t('Rechercher un emballage…')}" value="${esc(S.ui.shop.q)}" aria-label="${t('Rechercher')}"><button type="submit" aria-label="${t('Rechercher')}">${ic('search')}</button></form>
    <div class="hicons">
      <a class="hicon" href="#/compte">${ic('user')}<span class="lbl">${t('Connexion')}</span></a>
      <a class="hicon" href="#/favoris">${ic('heart')}<span class="lbl">${t('Favoris')}</span>${S.favs.size?`<span class="n">${S.favs.size}</span>`:''}</a>
      <a class="hicon" href="#/comparer">${ic('compare')}<span class="lbl">${t('Comparer')}</span>${S.compare.size?`<span class="n">${S.compare.size}</span>`:''}</a>
      <a class="cart-pill" href="#/panier" aria-label="${t('Panier')}">${ic('cart')}<span class="num">${cartCount()}</span><span class="num">${dzd(cartTotal())}</span></a>
    </div>
  </div></header>
  <nav class="nav" aria-label="Menu principal"><div class="in"><span class="navlinks"><a href="#/" class="${active==='home'?'on':''}">${t('Accueil')}</a><a href="#/boutique" class="${active==='shop'?'on':''}">${t('Boutique')}</a><a href="#/contact" class="${active==='contact'?'on':''}">${t('Contact')}</a><a href="#/suivi" class="${active==='track'?'on':''}">${t('Suivi de commande')}</a></span></div></nav>
  <div class="catbar"><div class="in">${cats.map(c=>`<a href="#/categorie/${c.id}" class="${S.ui.shop.cat===c.id && active==='shop'?'on':''}">${esc(catName(c))}</a>`).join('')}</div></div>
  <main id="main">${content}</main>
  ${shopFooter()}
  <a class="wa-float" href="https://wa.me/213549593160" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('wa','lg')}</a>`;
}
function shopFooter(){
  return `<footer class="footer"><div class="in">
    <div><a href="#/" class="logo" style="color:#fff"><span class="mk">${logoMark()}</span><span>Pack<b>Lik</b></span></a><p style="margin:12px 0 0;max-width:320px">${t('PackLik, votre partenaire de confiance pour l\'emballage et les solutions alimentaires en Algérie.')}</p></div>
    <div><h4>${t('Contact')}</h4><a>${S.lang==='ar'?COMPANY.addressAr:S.lang==='en'?COMPANY.addressEn:COMPANY.address}</a><a href="tel:0549593160">${COMPANY.phone1}</a><a href="tel:0540021914">${COMPANY.phone2}</a><a href="mailto:${COMPANY.email}">${COMPANY.email}</a></div>
    <div><h4>${t('Liens utiles')}</h4><a href="#/boutique">${t('Boutique')}</a><a href="#/suivi">${t('Suivi de commande')}</a><a href="#/compte">${t('Mon compte')}</a><a href="#/contact">${t('Contact')}</a><a href="#/cgv">${t('Conditions générales de vente')}</a></div>
    <div><h4>${t('Paiement à la livraison')}</h4><p style="margin:0">${t('Vous payez en espèces au livreur DHD à la réception de votre colis, dans les 69 wilayas.')}</p></div>
  </div><div class="bot">© 2026 PackLik · packlik.shop</div></footer>`;
}
function pcard(p){
  const st = stockInfo(p.id); const out = st.available<=0 && !p.onDemand && p.status!=='devis';
  const tag = out? `<span class="badge red tag">${t('Rupture')}</span>` : p.isNew? `<span class="badge blue tag">${t('Nouveau')}</span>` : p.featured? `<span class="badge kraft tag">${t('En vedette')}</span>`:'';
  return `<article class="pcard">
    <a class="im" href="#/produit/${p.id}" aria-label="${esc(p.name)}">${prodArt(p,130)}${tag}</a>
    <div class="bd">
      <span class="ct">${esc(p.cats.slice(0,2).map(c=>catName(CATS.find(x=>x.id===c))).join(' · '))}</span>
      <a class="nm" href="#/produit/${p.id}">${esc(p.name)}</a>
      <span class="pr num">${pPrice(p)}</span>
      ${p.variants || p.status==='devis' ? `<div class="row"><a class="btn sm grow" href="#/produit/${p.id}">${p.status==='devis'?t('Demander un devis'):t('Choisir une option')}</a><button class="btn sm icon" data-a="fav" data-id="${p.id}" aria-label="${t('Ajouter aux favoris')}" style="${S.favs.has(p.id)?'color:var(--red)':''}">${ic('heart','sm')}</button></div>` : `
      <button class="btn sm primary block" data-a="buyNow" data-id="${p.id}" ${out?'disabled':''}>${ic('zap','sm')} ${out?t('Rupture'):t('Acheter maintenant')}</button>
      <div class="row"><button class="btn sm kraft grow" data-a="addCart" data-id="${p.id}" ${out?'disabled':''}>${ic('cart','sm')} ${t('Ajouter au panier')}</button><button class="btn sm icon" data-a="fav" data-id="${p.id}" aria-label="${t('Ajouter aux favoris')}" style="${S.favs.has(p.id)?'color:var(--red)':''}">${ic('heart','sm')}</button></div>`}
    </div>
  </article>`;
}

/* ---- Accueil ---- */
function viewHome(){
  const sh=S.ui.shop;
  const tabs = {new:PRODUCTS.filter(p=>p.isNew), featured:PRODUCTS.filter(p=>p.featured), best:PRODUCTS.slice().sort((a,b)=>bestScore(b)-bestScore(a)).slice(0,10)};
  const list = tabs[sh.tab].slice(0,10);
  const popular = CATS.filter(c=>c.id!=='tout').slice(0,12);
  const heroArt1 = `<svg viewBox="0 0 440 300" aria-hidden="true"><g transform="translate(10,30) scale(1.4)">${prodSvg(PBY[5],0).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g><g transform="translate(170,90) scale(1.25)">${prodSvg(PBY[28],0).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g><g transform="translate(300,40) scale(1.1)">${prodSvg(PBY[43],0).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g></svg>`;
  const heroArt2 = `<svg viewBox="0 0 440 300" aria-hidden="true"><g transform="translate(60,30) scale(1.9)">${prodSvg(PBY[45],0).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g><circle cx="360" cy="70" r="46" fill="#D99A2B"/><text x="360" y="66" text-anchor="middle" font-size="26" font-weight="800" fill="#2b1d03" font-family="Inter,sans-serif">-15%</text><text x="360" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#2b1d03" font-family="Inter,sans-serif">PACKS</text></svg>`;
  return shopShell(`<div class="container">
    <section class="hero" aria-roledescription="carrousel" style="background:var(--kraft-l)">
      <div class="slide ${S.heroIdx===0?'on':''}" style="background:linear-gradient(0deg,#FFD8BD,#FFE7D6)">
        <div style="position:relative;z-index:1"><span class="badge kraft">${t('Emballage personnalisé')}</span><h2 style="margin-top:10px">${t('Prix compétitifs – emballage personnalisé selon votre marque')}</h2><p class="muted">${t('Boîtes, barquettes, bowls, sacs craft et papier imprimés à votre logo, pour restaurants, fast-foods et pâtisseries.')}</p><a href="#/contact" class="btn primary lg">${ic('phone','sm')} ${t('Contactez-nous')}</a></div>
        <div class="art">${heroPhoto(5) || heroArt1}</div>
      </div>
      <div class="slide ${S.heroIdx===1?'on':''}" style="background:#182028;color:#fff">
        <div style="position:relative;z-index:1"><span class="badge amber">PACK PROMO</span><h2 style="margin-top:10px">${t('Offres exclusives à ne pas manquer')}</h2><p style="color:#C8D1CC">${t('Des packs complets prêts à l\'emploi pour démarrer votre service à emporter au meilleur prix.')}</p><a href="#/categorie/pack-promo" class="btn kraft lg">${ic('cart','sm')} ${t('Acheter')}</a></div>
        <div class="art">${heroPhoto(45) || heroArt2}</div>
      </div>
      <div class="dots">${[0,1].map(i=>`<button class="${S.heroIdx===i?'on':''}" data-a="hero" data-v="${i}" aria-label="Slide ${i+1}"></button>`).join('')}</div>
    </section>
    <section class="perks">
      <div class="perk"><span class="i">${ic('award')}</span><div><b>${t('Haute qualité')}</b><div class="muted small">${t('Matériaux alimentaires certifiés')}</div></div></div>
      <div class="perk"><span class="i">${ic('cash')}</span><div><b>${t('Paiement à la livraison')}</b><div class="muted small">${t('Payez en espèces à la réception')}</div></div></div>
      <div class="perk"><span class="i">${ic('truck')}</span><div><b>${t('Livraison 69 wilayas')}</b><div class="muted small">${t('À domicile ou au bureau DHD')}</div></div></div>
    </section>
    <div class="sec-t"><h2>${t('Catégories populaires')}</h2><a href="#/boutique" class="row">${t('Tout voir')} ${ic('chevR','sm flip')}</a></div>
    <div class="cat-tiles">${popular.map(c=>{ const p=PRODUCTS.find(x=>x.cats.includes(c.id)); return `<a class="cat-tile" href="#/categorie/${c.id}"><div class="im">${p?prodArt(p,84):''}</div><b>${esc(catName(c))}</b><span class="muted small">${c.n} ${t('produits')}</span></a>`; }).join('')}</div>
    <div class="sec-t"><h2>${t('Nouvelles offres')}</h2><div class="seg" role="tablist">${[['new','NOUVEAU'],['featured','EN VEDETTE'],['best','MEILLEURES VENTES']].map(([k,l])=>`<button role="tab" aria-selected="${sh.tab===k}" class="${sh.tab===k?'on':''}" data-a="homeTab" data-v="${k}">${t(l)}</button>`).join('')}</div></div>
    <div class="pgrid">${list.map(pcard).join('')}</div>
  </div>`,'home');
}
function bestScore(p){ return ORDERS.reduce((s,o)=>s+o.items.filter(i=>i.pid===p.id).reduce((a,i)=>a+i.q,0),0)*10 + (p.featured?3:0); }

/* ---- Boutique / catégorie ---- */
function viewShop(){
  const sh=S.ui.shop; let list = PRODUCTS.slice();
  if(sh.cat) list = list.filter(p=>p.cats.includes(sh.cat));
  if(sh.q) { const q=sh.q.toLowerCase(); list = list.filter(p=>p.name.toLowerCase().includes(q)); }
  if(sh.min!=='') list = list.filter(p=>p.price>=+sh.min);
  if(sh.max!=='') list = list.filter(p=>p.price<=+sh.max);
  if(sh.sort==='asc') list.sort((a,b)=>(a.price||9e9)-(b.price||9e9));
  if(sh.sort==='desc') list.sort((a,b)=>b.price-a.price);
  if(sh.sort==='new') list.sort((a,b)=>b.id-a.id);
  if(sh.sort==='pop') list.sort((a,b)=>bestScore(b)-bestScore(a));
  const pages = Math.max(1, Math.ceil(list.length/sh.per)); if(sh.page>pages) sh.page=pages;
  const view = list.slice((sh.page-1)*sh.per, sh.page*sh.per);
  const cat = CATS.find(c=>c.id===sh.cat);
  return shopShell(`<div class="container">
    <div class="row small muted" style="margin-top:16px"><a href="#/">${t('Accueil')}</a> ${ic('chevR','sm flip')} <a href="#/boutique">${t('Boutique')}</a>${cat?' '+ic('chevR','sm flip')+' '+esc(catName(cat)):''}</div>
    <div class="shop-layout">
      <aside class="filters" aria-label="${t('Filtres')}">
        <h4>${t('Catégories')}</h4>
        <div class="fl"><a href="#/boutique" class="${!sh.cat?'on':''}"><span>${t('Tous les produits')}</span><span class="muted">91</span></a>${CATS.map(c=>`<a href="#/categorie/${c.id}" class="${sh.cat===c.id?'on':''}"><span>${esc(catName(c))}</span><span class="muted">${c.n}</span></a>`).join('')}</div>
        <h4>${t('Prix (DZD)')}</h4>
        <div class="row"><input class="input" id="pmin" type="number" placeholder="Min" value="${sh.min}" aria-label="${t('Prix minimum')}"><input class="input" id="pmax" type="number" placeholder="Max" value="${sh.max}" aria-label="${t('Prix maximum')}"></div>
        <div class="row" style="margin-top:8px"><button class="btn sm primary grow" data-a="priceFilter">${t('Filtrer')}</button><button class="btn sm" data-a="priceReset">${t('Effacer')}</button></div>
      </aside>
      <section>
        <div class="toolbar">
          <h1 style="font-size:22px" class="grow">${cat? esc(catName(cat)) : sh.q? t('Résultats pour')+' « '+esc(sh.q)+' »' : t('Boutique')} <span class="muted small" style="font-weight:500">· ${list.length} ${t('produits')}</span></h1>
          <label class="row small">${t('Trier')} <select class="select" style="width:auto" data-ch="shopSort">${[['pop','Popularité'],['new','Nouveautés'],['asc','Prix croissant'],['desc','Prix décroissant']].map(([k,l])=>`<option value="${k}" ${sh.sort===k?'selected':''}>${t(l)}</option>`).join('')}</select></label>
          <div class="seg" aria-label="${t('Par page')}">${[9,12,18,24].map(n=>`<button class="${sh.per===n?'on':''}" data-a="perPage" data-v="${n}">${n}</button>`).join('')}</div>
        </div>
        ${view.length? `<div class="pgrid">${view.map(pcard).join('')}</div>` : `<div class="card empty">${ic('search')}<div><b>${t('Aucun produit trouvé')}</b></div><div class="small">${t('Essayez une autre recherche ou une autre catégorie.')}</div><a href="#/boutique" class="btn sm" style="margin-top:10px">${t('Voir tous les produits')}</a></div>`}
        ${pages>1? `<nav class="pager" aria-label="pagination">${Array.from({length:pages},(_,i)=>`<button class="${sh.page===i+1?'on':''}" data-a="page" data-v="${i+1}" aria-label="Page ${i+1}">${i+1}</button>`).join('')}</nav>`:''}
      </section>
    </div></div>`,'shop');
}

/* ---- Fiche produit ---- */
function viewProduct(id){
  const p = PBY[id]; if(!p) return shopShell(`<div class="container"><div class="card empty" style="margin-top:20px">${t('Produit introuvable')}</div></div>`,'shop');
  S.ui.pdp = S.ui.pdp && S.ui.pdp.id===p.id ? S.ui.pdp : {id:p.id, q:1, v: p.variants? p.variants[0].id : null};
  const st = stockInfo(p.id), ok = canOrder(p);
  const v = p.variants? p.variants.find(x=>x.id===S.ui.pdp.v) : null;
  const related = PRODUCTS.filter(x=>x.id!==p.id && x.cats.some(c=>p.cats.includes(c) && c!=='tout')).slice(0,5);
  return shopShell(`<div class="container">
    <div class="row small muted" style="margin-top:16px"><a href="#/">${t('Accueil')}</a> ${ic('chevR','sm flip')} <a href="#/categorie/${p.cats[0]}">${esc(catName(CATS.find(c=>c.id===p.cats[0])))}</a> ${ic('chevR','sm flip')} ${esc(p.name)}</div>
    <div class="pdp">
      <div class="gal">${prodArt(p,340)}</div>
      <div class="col" style="gap:14px">
        <div class="row wrap">${p.cats.map(c=>`<a class="badge kraft" href="#/categorie/${c}">${esc(catName(CATS.find(x=>x.id===c)))}</a>`).join('')}</div>
        <h1>${esc(p.name)}</h1>
        <div class="price num">${v? dzd(v.price) : pPrice(p)}</div>
        <div class="row small"><span class="badge">${t('Conditionnement')} : ${p.pack} ${t('pièces')}</span><span class="badge">${t('Réf.')} ${p.sku}</span>${p.status==='devis'?'':st.available>0? `<span class="badge green">${t('En stock')}</span>` : p.onDemand? `<span class="badge amber">${t('Sur commande')}</span>` : `<span class="badge red">${t('Rupture')}</span>`}</div>
        ${p.variants? `<div><div class="small" style="font-weight:700;margin-bottom:6px">${t('Variante')}</div><div class="row">${p.variants.map(x=>`<button class="var-opt ${S.ui.pdp.v===x.id?'on':''}" data-a="pdpVar" data-v="${x.id}" aria-pressed="${S.ui.pdp.v===x.id}">${x.label} · ${dzd(x.price)}</button>`).join('')}</div></div>`:''}
        ${p.packItems? `<div class="card card-b small"><b>${t('Contenu du pack')}</b><ul style="margin:6px 0 0;padding-inline-start:18px">${p.packItems.map(c=>`<li>${c.q} × ${esc(PBY[c.pid].name)}</li>`).join('')}</ul></div>`:''}
        ${p.status==='devis'? `<div class="lock-note">${ic('phone','sm')} ${t('Ce pack est composé sur mesure : contactez-nous pour un devis.')}</div><a class="btn wa lg" href="https://wa.me/213549593160" target="_blank" rel="noopener">${ic('wa')} ${t('Demander sur WhatsApp')}</a>` : `
        <div class="row wrap" style="gap:10px">
          <div class="qty"><button data-a="pdpQ" data-v="-1" aria-label="moins">−</button><input id="pdpQ" type="number" min="1" value="${S.ui.pdp.q}" aria-label="${t('Quantité')}" data-ch="pdpQset"><button data-a="pdpQ" data-v="1" aria-label="plus">+</button></div>
          <button class="btn kraft lg grow" data-a="pdpAdd" ${ok?'':'disabled'}>${ic('cart')} ${t('Ajouter au panier')}</button>
        </div>
        <div class="row wrap"><button class="btn primary lg grow" data-a="pdpBuy" ${ok?'':'disabled'}>${t('Commander maintenant')}</button><a class="btn wa lg" href="https://wa.me/213549593160?text=${encodeURIComponent('Bonjour, je veux commander : '+p.name)}" target="_blank" rel="noopener">${ic('wa')} WhatsApp</a></div>`}
        <div class="row small muted wrap" style="gap:14px"><span class="row">${ic('cash','sm')} ${t('Paiement à la livraison')}</span><span class="row">${ic('truck','sm')} ${t('Livraison 69 wilayas')}</span><button class="btn sm ghost" data-a="cmp" data-id="${p.id}">${ic('compare','sm')} ${t('Comparer')}</button></div>
      </div>
    </div>
    <div class="sec-t"><h2>${t('Produits associés')}</h2></div>
    <div class="pgrid">${related.map(pcard).join('')}</div>
  </div>`,'shop');
}

/* ---- Panier ---- */
function viewCart(){
  const sub = cartTotal();
  return shopShell(`<div class="container" style="margin-top:20px">
    <h1 style="font-size:24px;margin-bottom:14px">${t('Panier')}</h1>
    ${!S.cart.length? `<div class="card empty">${ic('cart')}<div><b>${t('Votre panier est vide')}</b></div><a class="btn kraft" href="#/boutique" style="margin-top:10px">${t('Continuer mes achats')}</a></div>` : `
    <div class="checkout">
      <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Produit')}</th><th>${t('Prix')}</th><th>${t('Quantité')}</th><th class="r">${t('Total')}</th><th></th></tr></thead><tbody>
      ${S.cart.map((it,i)=>{ const p=PBY[it.pid]; return `<tr><td><div class="row">${prodArt(p,44)}<div><b>${esc(p.name)}</b>${it.v?`<div class="small muted">${t('Variante')} : ${esc(p.variants.find(v=>v.id===it.v).label)}</div>`:''}</div></div></td><td class="num">${dzd(it.price)}</td><td><div class="qty sm"><button data-a="cartQ" data-i="${i}" data-v="-1" aria-label="moins">−</button><input value="${it.q}" readonly aria-label="${t('Quantité')}"><button data-a="cartQ" data-i="${i}" data-v="1" aria-label="plus">+</button></div></td><td class="r num"><b>${dzd(it.price*it.q)}</b></td><td><button class="btn icon sm ghost" data-a="cartDel" data-i="${i}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button></td></tr>`; }).join('')}
      </tbody></table></div></div>
      <div class="card card-b col" style="align-self:start">
        <div class="sumbox" style="border:0;padding:0"><div class="ln"><span>${t('Sous-total')}</span><b class="num">${dzd(sub)}</b></div><div class="ln"><span>${t('Livraison')}</span><span class="muted small">${t('calculée selon la wilaya')}</span></div><div class="ln tot"><span>${t('Total')}</span><span class="num">${dzd(sub)}</span></div></div>
        <a href="#/commande" class="btn primary lg block">${t('Passer la commande')} ${ic('arrowR','sm flip')}</a>
        <a href="#/boutique" class="btn block">${t('Continuer mes achats')}</a>
      </div>
    </div>`}
  </div>`,'shop');
}

/* ---- Checkout COD ---- */
S.ui.co = {name:'', phone:'', wilaya:16, commune:'', address:'', delivery:'home', note:'', err:{}};
function viewCheckout(){
  if(!S.cart.length) return viewCart();
  const co=S.ui.co, w=WBY[co.wilaya]; const tmp={wilaya:+co.wilaya, items:S.cart, delivery:co.delivery}; tmp.carrier=autoCarrier(tmp); const feeH=feeOf({...tmp,delivery:'home'}), feeD=feeOf({...tmp,delivery:'desk'}); const fee = co.delivery==='home'? feeH : feeD; const sub=cartTotal(); const wkg=orderWeight(tmp), ow=overweightFee(tmp);
  return shopShell(`<div class="container" style="margin-top:20px">
    <div class="steps" aria-hidden="true"><div class="s done"><div class="c">1</div>${t('Panier')}</div><div class="s cur"><div class="c">2</div>${t('Vos informations')}</div><div class="s"><div class="c">3</div>${t('Confirmation')}</div></div>
    <form class="checkout" data-sub="placeOrder" novalidate>
      <div class="card card-b col" style="gap:14px">
        <h2 style="font-size:18px">${t('Livraison — paiement à la livraison')}</h2>
        <div class="grid2">
          <div class="field"><label for="coName">${t('Nom complet')} *</label><input class="input ${co.err.name?'err':''}" id="coName" value="${esc(co.name)}" autocomplete="name" required>${co.err.name?`<span class="err-msg">${t(co.err.name)}</span>`:''}</div>
          <div class="field"><label for="coPhone">${t('Téléphone')} *</label><input class="input ${co.err.phone?'err':''}" id="coPhone" value="${esc(co.phone)}" inputmode="tel" placeholder="05 / 06 / 07 + 8 chiffres" dir="ltr" required>${co.err.phone?`<span class="err-msg">${t(co.err.phone)}</span>`:''}</div>
          <div class="field"><label for="coW">${t('Wilaya')} *</label><select class="select" id="coW" data-ch="coWilaya">${WILAYAS.map(x=>`<option value="${x.id}" ${x.id===+co.wilaya?'selected':''}>${x.code} - ${esc(wName(x.id))}</option>`).join('')}</select></div>
          <div class="field"><label for="coC">${t('Commune')} *</label><select class="select ${co.err.commune?'err':''}" id="coC">${communeOptions(co.wilaya, co.commune)}</select>${co.err.commune?`<span class="err-msg">${t(co.err.commune)}</span>`:''}</div>
        </div>
        <div class="field"><label for="coA">${t('Adresse')}</label><input class="input" id="coA" value="${esc(co.address)}" placeholder="${t('Rue, cité, repère…')}"></div>
        <fieldset style="border:0;padding:0;margin:0"><legend class="small" style="font-weight:700;margin-bottom:6px">${t('Type de livraison')}</legend>
          <div class="grid2">
            <label class="card card-b check" style="${co.delivery==='home'?'border-color:var(--kraft-d);background:var(--kraft-ll)':''}"><input type="radio" name="dl" value="home" ${co.delivery==='home'?'checked':''} data-ch="coDelivery"> <span class="grow"><b>${t('À domicile')}</b><br><span class="small muted">DHD</span></span><b class="num">${dzd(feeH)}</b></label>
            <label class="card card-b check" style="${co.delivery==='desk'?'border-color:var(--kraft-d);background:var(--kraft-ll)':''}"><input type="radio" name="dl" value="desk" ${co.delivery==='desk'?'checked':''} data-ch="coDelivery"> <span class="grow"><b>${t('Bureau DHD (stop desk)')}</b><br><span class="small muted">${t('Retrait au bureau')}</span></span><b class="num">${dzd(feeD)}</b></label>
          </div>
        </fieldset>
        <div class="field"><label for="coN">${t('Note (facultatif)')}</label><textarea class="input" id="coN">${esc(co.note)}</textarea></div>
      </div>
      <div class="card card-b col" style="align-self:start;gap:12px">
        <h2 style="font-size:16px">${t('Votre commande')}</h2>
        ${S.cart.map(it=>`<div class="row between small"><span>${it.q} × ${esc(PBY[it.pid].name)}${it.v?' ('+esc(PBY[it.pid].variants.find(v=>v.id===it.v).label)+')':''}</span><b class="num">${dzd(it.price*it.q)}</b></div>`).join('')}
        <div class="sumbox"><div class="ln"><span>${t('Sous-total')}</span><span class="num">${dzd(sub)}</span></div><div class="ln"><span>${t('Livraison')} (${esc(wName(w.id))})</span><span class="num">${dzd(fee)}</span></div>${ow&&carrierOf(tmp).chargeOverweight? `<div class="ln xs muted"><span>${t('dont surpoids')} (${kg(wkg)})</span><span class="num">${dzd(ow)}</span></div>`:''}<div class="ln tot"><span>${t('Total à payer à la livraison')}</span><span class="num">${dzd(sub+fee)}</span></div></div>
        <div class="row small">${ic('cash','sm')} ${t('Paiement à la livraison uniquement')}</div>
        <button type="submit" class="btn primary lg block">${t('Confirmer la commande')}</button>
      </div>
    </form>
  </div>`,'shop');
}
function validPhone(p){ return /^0[567]\d{8}$/.test(p.replace(/\s/g,'')); }
function fmtPhone(p){ const d=p.replace(/\s/g,''); return d.slice(0,4)+' '+d.slice(4,6)+' '+d.slice(6,8)+' '+d.slice(8,10); }

/* ---- Confirmation / suivi / contact / compte ---- */
function viewConfirm(ref){
  const o = ORDERS.find(x=>x.ref===ref); if(!o) return viewHome();
  const c = CBY[o.customerId];
  return shopShell(`<div class="container" style="margin-top:20px;max-width:760px">
    <div class="steps" aria-hidden="true"><div class="s done"><div class="c">1</div>${t('Panier')}</div><div class="s done"><div class="c">2</div>${t('Vos informations')}</div><div class="s done"><div class="c">3</div>${t('Confirmation')}</div></div>
    <div class="card card-b col" style="gap:14px;text-align:center;align-items:center">
      <span style="width:62px;height:62px;border-radius:50%;background:var(--green-l);color:var(--green);display:grid;place-items:center">${ic('check','lg')}</span>
      <h1 style="font-size:24px">${t('Merci ! Votre commande est enregistrée')}</h1>
      <div class="badge dark" style="font-size:14px;padding:6px 14px">${t('N° de commande')} : ${o.ref}</div>
      <p class="muted" style="margin:0;max-width:460px">${t('Un agent PackLik va vous appeler pour confirmer votre commande. Gardez votre téléphone à portée de main.')}</p>
    </div>
    <div class="card card-b" style="margin-top:14px">
      ${o.items.map(it=>`<div class="row between small" style="padding:4px 0"><span>${it.q} × ${esc(PBY[it.pid].name)}</span><b class="num">${dzd(it.price*it.q)}</b></div>`).join('')}
      <div class="sumbox" style="margin-top:8px"><div class="ln"><span>${t('Livraison')} · ${esc(wName(o.wilaya))} · ${o.delivery==='home'?t('À domicile'):t('Bureau DHD (stop desk)')}</span><span class="num">${dzd(feeOf(o))}</span></div><div class="ln tot"><span>${t('Total à payer à la livraison')}</span><span class="num">${dzd(orderTotal(o))}</span></div></div>
      <p class="small muted">${esc(c.name)} · ${esc(c.phone)} · ${esc(cName(o.commune))}</p>
    </div>
    <div class="row wrap" style="margin-top:14px;justify-content:center"><a class="btn" href="#/suivi">${t('Suivre ma commande')}</a><a class="btn kraft" href="#/erp/confirmer?open=${o.id}">${ic('dash','sm')} ${t('Voir la commande dans l\'ERP')}</a></div>
  </div>`,'shop');
}
function trackSteps(o){
  const order = ['conf','prep','liv','enc']; const ph = STATUS[o.status].ph;
  const labels = [['conf','Confirmation'],['prep','Préparation'],['liv','Livraison'],['enc','Livrée']];
  const idx = o.status==='delivered'||ph==='enc'? 3 : order.indexOf(ph);
  return `<div class="steps">${labels.map(([k,l],i)=>`<div class="s ${i<idx?'done': i===idx?'cur':''}"><div class="c">${i+1}</div>${t(l)}</div>`).join('')}</div>`;
}
function viewTrack(){
  const r = S.ui.track || {};
  const o = r.found ? ORDERS.find(x=>x.id===r.found) : null;
  return shopShell(`<div class="container" style="margin-top:20px;max-width:760px">
    <h1 style="font-size:24px">${t('Suivi de commande')}</h1>
    <p class="muted">${t('Saisissez votre numéro de téléphone et votre numéro de commande.')}</p>
    <form class="card card-b grid3" data-sub="track" style="align-items:end">
      <div class="field"><label for="trP">${t('Téléphone')}</label><input class="input" id="trP" value="${esc(r.phone||'')}" dir="ltr" placeholder="0550 12 34 56"></div>
      <div class="field"><label for="trR">${t('N° de commande')}</label><input class="input" id="trR" value="${esc(r.ref||'')}" dir="ltr" placeholder="PK-1001"></div>
      <button class="btn primary" type="submit">${ic('search','sm')} ${t('Rechercher')}</button>
    </form>
    ${r.err? `<div class="card empty" style="margin-top:14px">${ic('alert')}<div>${t(r.err)}</div></div>`:''}
    ${o? `<div class="card card-b" style="margin-top:14px"><div class="row between"><b>${o.ref}</b><span class="badge ${STATUS[o.status].c}">${stName(o.status,o)}</span></div>${trackSteps(o)}<div class="timeline">${o.history.filter(h=>!/Assignée/.test(h.action)).slice().reverse().map(h=>`<div class="tl ${h.color}"><span class="d"></span><div class="tx"><b>${esc(t(h.action))}</b> <span class="muted">· ${fDT(h.at)}</span></div></div>`).join('')}</div>${o.tracking?`<p class="small">${t('Suivi DHD')} : <b dir="ltr">${o.tracking}</b></p>`:''}</div>`:''}
    <p class="small muted" style="margin-top:12px">${t('Exemple pour la démo')} : ${esc(CBY[ORDERS[40].customerId].phone)} · ${ORDERS[40].ref}</p>
  </div>`,'track');
}
function viewContact(){
  return shopShell(`<div class="container" style="margin-top:20px">
    <h1 style="font-size:24px;margin-bottom:14px">${t('Contact')}</h1>
    <div class="g2">
      <div class="card card-b col" style="gap:12px">
        <div class="row">${ic('pin')} <span>${S.lang==='ar'?COMPANY.addressAr:S.lang==='en'?COMPANY.addressEn:COMPANY.address}</span></div>
        <div class="row">${ic('phone')} <a href="tel:0549593160">${COMPANY.phone1}</a> (WhatsApp)</div>
        <div class="row">${ic('phone')} <a href="tel:0540021914">${COMPANY.phone2}</a></div>
        <div class="row">${ic('mail')} <a href="mailto:${COMPANY.email}">${COMPANY.email}</a></div>
        <div style="border-radius:10px;overflow:hidden;border:1px solid var(--line);aspect-ratio:16/9;background:#E9E4DA;position:relative" role="img" aria-label="Carte : Douéra, Alger">
          <svg viewBox="0 0 400 225" width="100%" height="100%" aria-hidden="true"><rect width="400" height="225" fill="#EAE5DB"/><path d="M0 150 C80 120 140 170 220 140 S340 90 400 110" stroke="#fff" stroke-width="14" fill="none"/><path d="M120 0 L170 225" stroke="#fff" stroke-width="10"/><path d="M260 0 C250 80 300 140 290 225" stroke="#fff" stroke-width="8" fill="none"/><rect x="40" y="30" width="60" height="40" fill="#DCD5C8"/><rect x="300" y="160" width="70" height="40" fill="#DCD5C8"/><circle cx="200" cy="105" r="16" fill="#C2453D"/><circle cx="200" cy="105" r="6" fill="#fff"/><text x="200" y="140" text-anchor="middle" font-size="12" font-weight="700" fill="#182028" font-family="Inter,sans-serif">PackLik · Douéra</text></svg>
        </div>
        <a class="btn wa" href="https://wa.me/213549593160" target="_blank" rel="noopener">${ic('wa')} ${t('Écrire sur WhatsApp')}</a>
      </div>
      <form class="card card-b col" style="gap:12px" data-sub="contact">
        <h2 style="font-size:17px">${t('Envoyer un message')}</h2>
        <div class="field"><label for="ctN">${t('Nom complet')}</label><input class="input" id="ctN" required></div>
        <div class="field"><label for="ctP">${t('Téléphone')}</label><input class="input" id="ctP" dir="ltr" required></div>
        <div class="field"><label for="ctM">${t('Message')}</label><textarea class="input" id="ctM" placeholder="${t('Ex. : devis pour 1 000 boîtes burger imprimées à notre logo')}"></textarea></div>
        <button class="btn primary" type="submit">${ic('send','sm')} ${t('Envoyer')}</button>
      </form>
    </div></div>`,'contact');
}
function viewAccount(){
  const c = CUSTOMERS[2]; const os = custOrders(c.id);
  return shopShell(`<div class="container" style="margin-top:20px">
    <div class="row between wrap"><h1 style="font-size:24px">${t('Mon compte')}</h1><span class="small muted">${t('Démo : connecté en tant que')} ${esc(c.name)}${c.business?' — '+esc(c.business):''}</span></div>
    <div class="g21" style="margin-top:14px">
      <div class="card"><div class="card-h"><h3>${t('Historique des commandes')}</h3></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('N°')}</th><th>${t('Date')}</th><th>${t('Statut')}</th><th class="r">${t('Total')}</th></tr></thead><tbody>${os.length? os.map(o=>`<tr><td><b>${o.ref}</b></td><td>${fDate(o.created)}</td><td><span class="badge ${STATUS[o.status].c}">${stName(o.status,o)}</span></td><td class="r num">${dzd(orderTotal(o))}</td></tr>`).join('') : `<tr><td colspan="4" class="empty">${t('Aucune commande pour le moment')}</td></tr>`}</tbody></table></div></div>
      <div class="col" style="gap:16px">
        <div class="card card-b"><h3 style="font-size:14px;margin-bottom:8px">${t('Mes adresses')}</h3><div class="small">${esc(c.name)}<br>${esc(c.address)}<br>${esc(cName(c.commune))}, ${esc(wName(c.wilaya))}<br><span dir="ltr">${esc(c.phone)}</span></div></div>
        <div class="card card-b"><h3 style="font-size:14px;margin-bottom:8px">${t('Favoris')}</h3>${[...S.favs].map(id=>`<a class="row small" href="#/produit/${id}" style="padding:3px 0">${ic('heart','sm')} ${esc(PBY[id].name)}</a>`).join('') || `<span class="small muted">${t('Aucun favori')}</span>`}</div>
      </div>
    </div></div>`,'');
}
function viewList(kind){
  const ids = [...(kind==='fav'? S.favs : S.compare)];
  const title = kind==='fav'? t('Favoris') : t('Comparer');
  if(kind==='cmp' && ids.length){
    const ps = ids.map(i=>PBY[i]);
    return shopShell(`<div class="container" style="margin-top:20px"><h1 style="font-size:24px;margin-bottom:14px">${title}</h1><div class="card tbl-wrap"><table class="tbl"><tbody>
      <tr><th></th>${ps.map(p=>`<td style="text-align:center">${prodArt(p,90)}<div><b>${esc(p.name)}</b></div></td>`).join('')}</tr>
      <tr><th>${t('Prix')}</th>${ps.map(p=>`<td style="text-align:center" class="num">${pPrice(p)}</td>`).join('')}</tr>
      <tr><th>${t('Conditionnement')}</th>${ps.map(p=>`<td style="text-align:center">${p.pack} ${t('pièces')}</td>`).join('')}</tr>
      <tr><th>${t('Prix unitaire')}</th>${ps.map(p=>`<td style="text-align:center" class="num">${p.price? (p.price/p.pack).toFixed(1).replace('.',',')+' DZD':'—'}</td>`).join('')}</tr>
      <tr><th>${t('Disponibilité')}</th>${ps.map(p=>`<td style="text-align:center">${stockInfo(p.id).available>0? `<span class="badge green">${t('En stock')}</span>`:`<span class="badge red">${t('Rupture')}</span>`}</td>`).join('')}</tr>
      <tr><th></th>${ps.map(p=>`<td style="text-align:center"><button class="btn sm" data-a="cmp" data-id="${p.id}">${t('Retirer')}</button></td>`).join('')}</tr>
    </tbody></table></div></div>`,'');
  }
  return shopShell(`<div class="container" style="margin-top:20px"><h1 style="font-size:24px;margin-bottom:14px">${title}</h1>${ids.length? `<div class="pgrid">${ids.map(i=>pcard(PBY[i])).join('')}</div>` : `<div class="card empty">${ic(kind==='fav'?'heart':'compare')}<div>${t('La liste est vide.')}</div><a class="btn kraft" href="#/boutique" style="margin-top:10px">${t('Voir la boutique')}</a></div>`}</div>`,'');
}
function viewCGV(){ return shopShell(`<div class="container" style="margin-top:20px;max-width:760px"><h1 style="font-size:24px">${t('Conditions générales de vente')}</h1><div class="card card-b" style="margin-top:12px"><p>${t('Paiement à la livraison (espèces) dans les 69 wilayas via DHD. Les frais de livraison dépendent de la wilaya et du type de livraison (domicile ou bureau DHD).')}</p><p>${t('Chaque commande est confirmée par téléphone par un agent PackLik avant expédition.')}</p><p class="muted small">${t('Texte complet à fournir par PackLik (modifiable dans Paramètres du site).')}</p></div></div>`,''); }

/* ---- actions boutique ---- */
function addToCart(pid, q, v){
  const p = PBY[pid]; if(!canOrder(p)){ toast(t('Produit en rupture'),'bad'); return; }
  const price = v? p.variants.find(x=>x.id===v).price : p.price; const cost = v? p.variants.find(x=>x.id===v).cost : p.cost;
  const ex = S.cart.find(i=>i.pid===pid && i.v===v); if(ex) ex.q+=q; else S.cart.push({pid, v, q, price, cost});
  toast(t('Ajouté au panier')+' · '+esc(p.name),'ok'); fbq('AddToCart',{value:price*q});
}
const TT_EVENT = {Purchase:'CompletePayment', Lead:'SubmitForm'};
function fbq(ev, data){
  if(!SETTINGS.modules.pixels) return; S.pixel = S.pixel||[];
  PIXELS.filter(p=>p.active).forEach(p=>{ const name = p.platform==='tiktok'? (TT_EVENT[ev]||ev) : ev; if(!PIXEL_EVENTS[p.platform][name]) return;
    S.pixel.unshift({at:Date.now(), platform:p.platform, pixel:p.name, pixelId:p.pixelId, ev:name, data:data||{}, server: !!p.token, test:p.testCode||''}); });
  if(S.pixel.length>200) S.pixel.length=200;
}
function placeOrder(){
  const co=S.ui.co; co.name=val('coName').trim(); co.phone=val('coPhone').trim(); co.commune=val('coC').trim(); co.address=val('coA').trim(); co.note=val('coN').trim(); co.wilaya=+val('coW');
  co.err={};
  if(co.name.length<3) co.err.name='Veuillez saisir votre nom';
  if(!validPhone(co.phone)) co.err.phone='Numéro invalide : 05, 06 ou 07 suivi de 8 chiffres';
  if(!co.commune) co.err.commune='Veuillez indiquer la commune';
  if(Object.keys(co.err).length){ render(); toast(t('Merci de corriger le formulaire'),'bad'); return; }
  const phone = fmtPhone(co.phone);
  let c = CUSTOMERS.find(x=>x.phone.replace(/\s/g,'')===co.phone.replace(/\s/g,''));
  if(!c){ c = {id:CUSTOMERS.length+1, name:co.name, business:'', phone, phone2:'', wilaya:co.wilaya, commune:co.commune, address:co.address, pro:false, hist:{created:0,delivered:0,returned:0,spent:0}, since:Date.now(), notes:''}; CUSTOMERS.push(c); CBY[c.id]=c; }
  const items = S.cart.map(i=>({pid:i.pid, v:i.v, q:i.q, price:i.price, cost:i.cost, up:false}));
  const o = { id:ORDERS.length+1, ref:'PK-'+(refSeq++), created:Date.now(), source:'Site', customerId:c.id, agentId:null, wilaya:co.wilaya, commune:co.commune, address:co.address, delivery:co.delivery, note:co.note,
    initial: items.map(x=>({...x})), items, discount:0, status:'new', unreachN:0, calls:0, nextCall:null, cancelReason:'', tracking:'', attempts:[], history:[], lockedBy:null, dhdPaidAt:null, dhdPaymentId:null, lastDhdUpdate:Date.now(), riskReturn:false, duplicate:false, times:{}, fresh:true };
  // anti-doublon 24 h
  const key = items.map(i=>i.pid+'x'+i.q).sort().join(',');
  if(ORDERS.some(x=>x.customerId===c.id && Date.now()-x.created<DAY && x.items.map(i=>i.pid+'x'+i.q).sort().join(',')===key)) o.duplicate = true;
  ORDERS.push(o);
  o.history.push({at:Date.now(), who:'Système', action:'Commande créée', note:'Source : Site', color:''});
  o.carrier = autoCarrier(o);
  const a = assignAgent(o); o.agentId = a.id;
  o.history.push({at:Date.now()+1, who:'Système', action: a.id? 'Assignée à '+UBY[a.id].name.split(' ')[0] : 'Placée dans la file commune', note:a.why, color:''});
  ACTIVITY.unshift({at:Date.now(), user:'Boutique', role:'site', action:'Nouvelle commande', entity:o.ref, details:a.why});
  NOTIFS.unshift({at:Date.now(), txt:'Nouvelle commande '+o.ref+' (Site) → '+(a.id?UBY[a.id].name:'file commune')});
  if(SETTINGS.purchaseOn==='order') fbq('Purchase',{value:orderTotal(o), ref:o.ref});
  S.cart=[]; S.ui.co={name:'', phone:'', wilaya:16, commune:'', address:'', delivery:'home', note:'', err:{}};
  location.hash = '#/confirmation/'+o.ref;
}

/* ============================================================
   ERP : coque, menus par rôle, tableau de bord, confirmation, écran d'appel
   ============================================================ */
const MENUS = {
  admin:[
    ['Pilotage',[['dashboard','dash','Tableau de bord']]],
    ['Ventes',[['confirmer','headset','Commandes à confirmer','conf'],['suivi','truck','Suivi des commandes'],['tentatives','alert','Tentatives de livraison','fail']]],
    ['Opérations',[['achats','file','Achats'],['produits','box','Produits'],['stock','layers','Gestion de stock','low']]],
    ['Relations',[['fournisseurs','factory','Fournisseurs'],['clients','users','Clients']]],
    ['Équipe',[['equipe','user','Équipe et accès'],['repartition','shuffle','Répartition des agents']]],
    ['Finance',[['finance','wallet','Finance'],['compta','book','Comptabilité'],['stats','chart','Statistiques']]],
    ['Système',[['modules','grid','Modules'],['livraison','truck','Livraison et livreurs'],['pixels','target','Pixels Facebook et TikTok'],['parametres','gear','Paramètres'],['journal','file','Journal d\'activité']]]
  ],
  gerant:[
    ['Opérations',[['dashboard','dash','Tableau de bord'],['preparation','box','Préparation','prep'],['expedition','truck','Expédition','ready'],['suivi','layers','Suivi des commandes'],['tentatives','alert','Tentatives de livraison','fail'],['retours','undo','Retours','ret'],['livraison','user','Livraison et livreurs']]],
    ['Stock et achats',[['stock','layers','Gestion de stock','low'],['achats','file','Achats'],['produits','grid','Produits']]]
  ],
  manager:[
    ['Centre d\'appel',[['dashboard','dash','Tableau de bord équipe'],['file','drag','File globale','conf'],['confirmer','headset','Commandes à confirmer'],['cas','flag','Cas difficiles','hard'],['tentatives','alert','Tentatives de livraison','fail']]],
    ['Pilotage',[['repartition','shuffle','Répartition'],['classement','award','Classement et objectifs'],['clients','users','Clients'],['equipe','user','Mon équipe'],['journal','file','Journal (mes agents)']]]
  ],
  agent:[
    ['Mon espace',[['mafile','headset','Ma file','mine'],['appel','phone','Écran d\'appel'],['rappels','cal','Mes rappels','cb'],['livraisons','truck','Mes livraisons','myfail'],['perfs','target','Mes performances']]]
  ],
  fournisseur:[
    ['Portail fournisseur',[['dashboard','dash','Tableau de bord'],['paiements','cash','Paiements et commandes','supdue'],['bons','file','Bons de commande','po'],['receptions','truck','Livraisons'],['releve','book','Relevé de compte'],['ventes','chart','Ventes de mes produits']]]
  ]
};
const ROLE_LABEL = {admin:'Admin', gerant:'Gérant', manager:'Manager', agent:'Agent de confirmation', fournisseur:'Fournisseur'};
const CONF_ST = ['new','calling','unreach','callback'];
function visibleOrders(){ if(S.role==='agent') return ORDERS.filter(o=>o.agentId===S.agentId); if(S.role==='fournisseur') return []; return ORDERS; }
function counters(){
  const vo = visibleOrders();
  return {
    conf: vo.filter(o=>CONF_ST.includes(o.status)).length,
    fail: vo.filter(o=>o.status==='failed').length,
    low: lowStock().length,
    prep: ORDERS.filter(o=>o.status==='toprep').length, ready: ORDERS.filter(o=>o.status==='ready').length,
    ret: ORDERS.filter(o=>o.status==='returning').length,
    hard: hardCases().length,
    mine: vo.filter(o=>CONF_ST.includes(o.status)).length + vo.filter(o=>o.status==='failed').length,
    cb: vo.filter(o=>o.nextCall && CONF_ST.includes(o.status)).length,
    myfail: vo.filter(o=>o.status==='failed').length,
    po: PURCHASES.filter(p=>p.status==='sent').length,
    supdue: ORDERS.filter(o=>o.status==='paid').length
  };
}
function hardCases(){ return ORDERS.filter(o=>o.riskReturn && ['failed','returning'].includes(o.status) || (o.status==='unreach' && o.unreachN>=3) || o.discountPending || (o.status==='failed' && o.attempts.some(a=>a.reason==='refused' && !a.resolved))); }
function allowedPages(){ return MENUS[S.role].flatMap(g=>g[1].map(i=>i[0])); }

function erpShell(page, title, sub, body, actions){
  const cnt = counters(); const u = me();
  const modOff = id=> (id==='livraison' && !SETTINGS.modules.delivery && !SETTINGS.modules.couriers) || (id==='pixels' && !SETTINGS.modules.pixels);
  const nav = MENUS[S.role].map(([g,items])=>`<div class="grp">${t(g)}</div>`+items.filter(i=>!modOff(i[0])).map(([id,icon,label,ck])=>{ const n = ck? cnt[ck] : 0; return `<a class="it ${page===id?'on':''}" href="#/erp/${id}" title="${esc(t(label))}" ${page===id?'aria-current="page"':''}>${ic(icon)}<span class="lbl">${t(label)}</span>${n? `<span class="cnt ${['fail','hard','low','myfail'].includes(ck)?'red':''}">${n}</span>`:''}</a>`; }).join('')).join('');
  return `<div class="erp ${S.erpCollapsed?'collapsed':''} ${S.mOpen?'mopen':''}">
    <aside class="side" aria-label="Menu ERP">
      <div class="brand"><span class="mk">${logoMark()}</span><span>PackLik ERP<small>${t(ROLE_LABEL[S.role])}</small></span></div>
      <nav>${nav}</nav>
      <div class="foot"><a class="it" href="#/" style="display:flex;gap:10px;align-items:center;color:#C3CBD5;padding:8px">${ic('store')}<span class="lbl">${t('Voir la boutique')}</span></a></div>
    </aside>
    <div style="min-width:0">
      <header class="topbar">
        <button class="btn icon ghost" data-a="toggleSide" aria-label="${t('Menu')}">${ic('menu')}</button>
        <div class="grow" style="min-width:0"><h1>${title}</h1>${sub?`<div class="small muted">${sub}</div>`:''}</div>
        ${langSwitch(true)}
        <button class="btn icon ghost" data-a="notifs" aria-label="${t('Notifications')}" style="position:relative">${ic('bell')}${NOTIFS.length?`<span style="position:absolute;top:5px;inset-inline-end:6px;width:8px;height:8px;border-radius:50%;background:var(--red)"></span>`:''}</button>
        <div class="role-sel"><span class="small lbl" style="font-weight:700;color:var(--ink2)">${esc(u.name)}</span><span class="avatar sm" title="${esc(u.name)}">${initials(u.name)}</span><button class="btn sm" data-a="logout">${t('Déconnexion')}</button></div>
      </header>
      <main class="main" id="main"><div class="pg">${actions? `<div class="pg-h"><div></div><div class="row wrap">${actions}</div></div>`:''}${body}</div></main>
    </div>
  </div>`;
}
function card(title, body, right, cls){ return `<section class="card ${cls||''}">${title?`<div class="card-h"><h3>${title}</h3>${right?`<div class="row wrap">${right}</div>`:''}</div>`:''}${body}</section>`; }
function kpi(l, v, d, cls){ return `<div class="kpi ${cls||''}"><div class="l">${l}</div><div class="v num">${v}</div>${d?`<div class="d">${d}</div>`:''}</div>`; }
function stBadge(o){ let b = `<span class="badge ${STATUS[o.status].c}">${stName(o.status,o)}</span>`; if(o.riskReturn && ['failed','returning'].includes(o.status)) b+=` <span class="badge red">${t('Risque de retour')}</span>`; return b; }
function srcBadge(s){ const m={Site:'kraft',WhatsApp:'green',Messenger:'blue',Instagram:'violet','Téléphone':''}; return `<span class="badge ${m[s]||''}">${t(s)}</span>`; }
function custCell(o, full){ const c=CBY[o.customerId]; const cs=custStats(c.id); const mine = S.role!=='agent' || o.agentId===S.agentId;
  return `<div><b>${esc(c.name)}</b>${cs.black?` <span class="badge red" title="${t('2 retours ou plus')}">${t('Liste noire')}</span>`: cs.refused?` <span class="badge amber">${t('1 refus')}</span>`:''}${o.duplicate?` <span class="badge amber">${t('Doublon probable')}</span>`:''}${c.business&&full?`<div class="xs muted">${esc(c.business)}</div>`:''}</div>`; }
function phoneCell(o){ const c=CBY[o.customerId]; const mine = S.role!=='agent' || o.agentId===S.agentId; return `<span dir="ltr" class="num">${mine? esc(c.phone) : `<span class="masked">${maskPhone(c.phone)}</span>`}</span>`; }
function itemsSummary(items){ const s = items.map(i=>i.q+'× '+PBY[i.pid].name).join(', '); return `<span class="small" title="${esc(s)}">${esc(s.length>48? s.slice(0,46)+'…' : s)}</span>`; }
function agentCell(id){ if(!id) return `<span class="badge amber">${t('Non assignée')}</span>`; const a=UBY[id]; return `<span class="row" style="gap:6px"><span class="avatar sm">${initials(a.name)}</span>${esc(a.name.split(' ')[0])}</span>`; }
function emptyRow(cols, msg, icon){ return `<tr><td colspan="${cols}"><div class="empty">${ic(icon||'check')}<div>${t(msg)}</div></div></td></tr>`; }
function isoDay(ts){ const d=new Date(ts); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
function periodRange(){ const today=dayStart(Date.now());
  if(S.period==='0') return {from:today, to:Date.now()}; if(S.period==='1') return {from:today-DAY, to:today-1}; if(S.period==='7') return {from:today-6*DAY, to:Date.now()};
  if(S.period==='m'){ const m=new Date(); m.setDate(1); m.setHours(0,0,0,0); return {from:m.getTime(), to:Date.now()}; }
  if(S.period==='custom'){ const f=new Date(S.pFrom+'T00:00').getTime(), t2=new Date(S.pTo+'T23:59:59').getTime(); return {from:isNaN(f)?today-29*DAY:f, to:isNaN(t2)?Date.now():t2}; }
  return {from:today-29*DAY, to:Date.now()}; }
function periodFilter(){
  if(!S.pFrom){ S.pFrom=isoDay(Date.now()-13*DAY); S.pTo=isoDay(Date.now()); }
  return `<div class="row wrap" style="gap:8px"><div class="seg" role="group" aria-label="${t('Période')}">${[['0','Aujourd\'hui'],['1','Hier'],['7','7 jours'],['30','30 jours'],['m','Ce mois'],['custom','Personnalisé']].map(([k,l])=>`<button class="${S.period===k?'on':''}" data-a="period" data-v="${k}">${t(l)}</button>`).join('')}</div>${S.period==='custom'? `<label class="row small">${t('Du')} <input class="input" type="date" style="height:34px;width:auto" value="${S.pFrom}" data-ch="pFrom"></label><label class="row small">${t('au')} <input class="input" type="date" style="height:34px;width:auto" value="${S.pTo}" data-ch="pTo"></label>`:''}</div>`; }
function inPeriod(ts){ if(!ts) return false; const r=periodRange(); return ts>=r.from && ts<=r.to; }
const DELIVERED_ST = ['delivered','paid','closed'], SHIPPED_ST = ['sent','picked','transit','outfor','failed','delivered','returning','returned','paid','closed'], CONFIRMED_ST = ['toprep','ready',...SHIPPED_ST];

/* ---------- Tableau de bord Admin ---------- */
function dashStats(list){
  const rec=list.length, conf=list.filter(o=>CONFIRMED_ST.includes(o.status)).length, canc=list.filter(o=>o.status==='cancelled').length;
  const ship=list.filter(o=>SHIPPED_ST.includes(o.status)).length, deliv=list.filter(o=>DELIVERED_ST.includes(o.status)).length, ret=list.filter(o=>['returning','returned'].includes(o.status)).length;
  const paid=list.filter(o=>['paid','closed'].includes(o.status)).length;
  const ca = list.filter(o=>DELIVERED_ST.includes(o.status)).reduce((s,o)=>s+orderTotal(o),0);
  const net = list.filter(o=>DELIVERED_ST.includes(o.status)).reduce((s,o)=>s+finOf(o).net,0) - list.filter(o=>['returning','returned'].includes(o.status)).reduce((s,o)=>s+returnLoss(o),0);
  const up = list.filter(o=>CONFIRMED_ST.includes(o.status)).reduce((s,o)=>s+upsellGain(o),0);
  const avg = conf? list.filter(o=>CONFIRMED_ST.includes(o.status)).reduce((s,o)=>s+orderTotal(o),0)/conf : 0;
  return {rec,conf,canc,ship,deliv,ret,paid,ca,net,up,avg, confRate: pct(conf, conf+canc), delivRate: pct(deliv, deliv+ret)};
}
function agentPerf(a, list){
  const os = (list||ORDERS).filter(o=>o.agentId===a.id);
  const conf = os.filter(o=>CONFIRMED_ST.includes(o.status)), canc = os.filter(o=>o.status==='cancelled');
  const deliv = os.filter(o=>DELIVERED_ST.includes(o.status)).length, ret = os.filter(o=>['returning','returned'].includes(o.status)).length;
  const ups = conf.filter(o=>upsellGain(o)>0);
  const firstCalls = os.filter(o=>o.firstCallAt).map(o=>(o.firstCallAt-o.created)/MIN);
  const gain = conf.reduce((s,o)=>s+upsellGain(o),0);
  const commission = deliv*(a.perDelivery||100) + Math.round(gain*(a.upsellPct||3)/100);
  return {total:os.length, treated: os.filter(o=>o.status!=='new').length, conf:conf.length, canc:canc.length, confRate:pct(conf.length,conf.length+canc.length), upRate:pct(ups.length,conf.length), upAvg: conf.length? conf.reduce((s,o)=>s+upsellPct(o),0)/conf.length : 0, gain, deliv, ret, delivRate:pct(deliv,deliv+ret), firstCall: firstCalls.length? firstCalls.reduce((a,b)=>a+b,0)/firstCalls.length : 0, pending: agentLoad(a.id), commission, attempts: os.reduce((s,o)=>s+o.attempts.length,0)};
}
function dailySeries(days, fn){ const labels=[], data=[]; for(let d=days-1; d>=0; d--){ const s=new Date(); s.setHours(0,0,0,0); const st=s.getTime()-d*DAY; labels.push(new Date(st).getDate()+'/'+(new Date(st).getMonth()+1)); data.push(fn(st, st+DAY)); } return {labels,data}; }
function alertsList(){
  const A=[];
  lowStock().slice(0,4).forEach(p=>{ const s=stockInfo(p.id); A.push(['amber','layers', t('Stock bas')+' : '+esc(p.name), s.available+' '+t('disponibles')+' · '+t('seuil')+' '+p.threshold, '#/erp/stock']); });
  ORDERS.filter(o=>BLOCK_ST.includes(o.status) && o.lastDhdUpdate && Date.now()-o.lastDhdUpdate>48*HOUR).forEach(o=>A.push(['red','clock', t('Colis bloqué +48 h')+' : '+o.ref, t('Aucune mise à jour DHD depuis')+' '+ago(o.lastDhdUpdate).replace(/^il y a |^منذ /,''), '#/erp/tentatives']));
  const fd = ORDERS.filter(o=>o.status==='failed' && o.attempts.length && Date.now()-o.attempts[o.attempts.length-1].at<DAY).length; if(fd) A.push(['red','alert', fd+' '+t('tentatives échouées aujourd\'hui'), t('À traiter par les agents'), '#/erp/tentatives']);
  const due = supplierDues().filter(d=>d.due-Date.now()<48*HOUR); if(due.length && S.role!=='gerant') A.push(['amber','factory', t('Échéance fournisseur dans 48 h'), dzd(due.reduce((s,d)=>s+d.rest,0))+' · '+fDate(due[0].due), '#/erp/fournisseurs']);
  const late = ORDERS.filter(o=>['new'].includes(o.status) && Date.now()-o.created>2*HOUR).length; if(late) A.push(['blue','headset', late+' '+t('commandes non traitées depuis +2 h'), t('Réassigner ou relancer les agents'), '#/erp/confirmer']);
  return A;
}
function alertsCard(){ const A=alertsList(); return card(t('Alertes'), `<div class="alerts">${A.length? A.map(([c,i,ti,sub,href])=>`<a class="alert ${c}" href="${href}"><span class="ai">${ic(i,'sm')}</span><div><b style="color:var(--ink)">${ti}</b><div class="small muted">${sub}</div></div></a>`).join('') : `<div class="empty">${ic('check')}<div>${t('Aucune alerte')}</div></div>`}</div>`, `<span class="badge ${A.length?'red':'green'}">${A.length}</span>`); }
function treasuryCard(){
  const dues = supplierDues(); const sb = supplierBalance();
  return card(t('Trésorerie'), `<div class="card-b col" style="gap:12px">
    <div class="g2" style="gap:10px">${CASHBOXES.map(b=>`<div class="cashbox ${b.c}"><div class="l">${t(b.fr)}</div><div class="v num">${dzd(b.balance)}</div></div>`).join('')}</div>
    <div class="row between small"><span class="muted">${t('Argent en attente chez DHD')}</span><b class="num">${dzd(moneyAtDhd())}</b></div>
    <div class="row between small"><span class="muted">${t('Argent en route (× taux de livraison)')}</span><b class="num">${dzd(moneyOnRoad())}</b></div>
    <div class="row between small"><span class="muted">${t('Dette fournisseur')}</span><b class="num">${dzd(sb.rest)}</b></div>
    ${dues[0]? `<div class="lock-note">${ic('clock','sm')} ${t('Prochaine échéance')} : ${dzd(dues[0].rest)} · ${fDate(dues[0].due)}</div>`:''}
  </div>`, `<a class="btn sm" href="#/erp/finance">${t('Finance')}</a>`);
}
function viewDashboard(){
  const list = ORDERS.filter(o=>inPeriod(o.created)); const s = dashStats(list);
  const ser = dailySeries(30,(a,b)=>ORDERS.filter(o=>o.created>=a&&o.created<b).length);
  const ca = dailySeries(30,(a,b)=>ORDERS.filter(o=>o.times.delivered>=a&&o.times.delivered<b).reduce((x,o)=>x+orderTotal(o),0)/1000);
  const funnel = [['Reçues',s.rec],['Confirmées',s.conf],['Expédiées',s.ship],['Livrées',s.deliv],['Payées',s.paid]];
  const topP = {}; list.filter(o=>CONFIRMED_ST.includes(o.status)).forEach(o=>o.items.forEach(i=>topP[i.pid]=(topP[i.pid]||0)+i.q*i.price));
  const topW = {}; list.forEach(o=>topW[o.wilaya]=(topW[o.wilaya]||0)+1);
  const body = `
    <div class="pg-h"><div><p>${t('Vue globale : ventes, livraisons, trésorerie')}</p></div>${periodFilter()}</div>
    <div class="kpis">
      ${kpi(t('Commandes reçues'), nf(s.rec))}${kpi(t('Confirmées'), nf(s.conf), fmtPct(s.confRate)+' '+t('de confirmation'))}
      ${kpi(t('Expédiées'), nf(s.ship))}${kpi(t('Livrées'), nf(s.deliv), `<span class="${s.delivRate>=75?'up':'down'}">${fmtPct(s.delivRate)}</span> ${t('taux de livraison')} · ${t('objectif')} 75 %`)}
      ${kpi(t('Retours'), nf(s.ret), `<span class="down">${dzd(list.filter(o=>['returning','returned'].includes(o.status)).reduce((x,o)=>x+returnLoss(o),0))}</span> ${t('de pertes')}`)}
      ${kpi(t('CA livré'), dzd(s.ca))}${kpi(t('Bénéfice net'), dzd(s.net), t('après fournisseur, DHD, pub, commissions'), 'accent')}
      ${kpi(t('Panier moyen'), dzd(s.avg))}${kpi(t('Gain d\'upsell'), dzd(s.up), '<span class="up">+'+fmtPct(pct(s.up, list.filter(o=>CONFIRMED_ST.includes(o.status)).reduce((x,o)=>x+linesTotal(o.initial),0)))+'</span>')}
    </div>
    <div class="g21">
      ${card(t('Commandes et CA livré — 30 jours'), `<div class="card-b">${lineChart([{name:t('Commandes'),data:ser.data,color:'#FD6400',area:true},{name:t('CA livré (k DZD)'),data:ca.data,color:'#2F7D4F'}], ser.labels,{label:'commandes et CA'})}<div class="legend" style="margin-top:6px"><span><i style="background:#FD6400"></i>${t('Commandes')}</span><span><i style="background:#2F7D4F"></i>${t('CA livré (k DZD)')}</span></div></div>`)}
      ${treasuryCard()}
    </div>
    <div class="g2">${supplierDashCard()}${adsDashCard()}</div>
    ${dailyCard()}
    <div class="g3">
      ${card(t('Entonnoir'), `<div class="card-b funnel">${funnel.map(([l,v],i)=>`<div class="f"><span class="lb">${t(l)}</span><div class="b"><i style="width:${Math.max(8,v/Math.max(1,s.rec)*100)}%;background:${['#C74B00','#FD6400','#2F6690','#2F7D4F','#1F5C38'][i]}">${v}</i></div><span class="pc">${i? fmtPct(pct(v,funnel[i-1][1])):'100 %'}</span></div>`).join('')}</div>`)}
      ${card(t('Top 10 produits'), `<div class="card-b">${barsList(Object.entries(topP).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([pid,v])=>({l:esc(PBY[pid].name),v})), true)}</div>`)}
      ${card(t('Top wilayas'), `<div class="card-b">${barsList(Object.entries(topW).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([w,v])=>({l:esc(wName(+w)),v, extra: fmtPct(deliveryRate(ORDERS.filter(o=>o.wilaya===+w)))+' '+t('livr.'), c:'#2F6690'})))}</div>`)}
    </div>
    <div class="g21">
      ${card(t('Performance des agents'), agentTable(list), `<a class="btn sm" href="#/erp/repartition">${t('Répartition')}</a>`)}
      ${alertsCard()}
    </div>`;
  return erpShell('dashboard', t('Tableau de bord'), fDate(Date.now())+' · '+t('Admin'), body);
}

function syncBadge(){ return `<span class="row small muted" style="gap:6px"><span class="dot green"></span>${t('DHD synchronisé')} ${fTime(S.lastSync||NOW-7*MIN)} · ${t('auto toutes les')} ${SETTINGS.dhdSyncMin} min</span>`; }
function supplierDashCard(){
  const b = supplierBalance(); const paidP = SUP_PAYMENTS.filter(p=>inPeriod(p.at)).reduce((s,p)=>s+p.amount,0);
  const dues = supplierDues();
  return card(t('Fournisseur'), `<div class="card-b col" style="gap:10px">
    <div class="g2" style="gap:10px">
      <div class="cashbox c1"><div class="l">${t('Dû au fournisseur')}</div><div class="v num">${dzd(b.due)}</div><div class="xs muted">${t('part fournisseur des commandes déjà payées par DHD')}</div></div>
      <div class="cashbox c2"><div class="l">${t('Pending — pas encore reçu de DHD')}</div><div class="v num">${dzd(b.dhd)}</div><div class="xs muted">${t('commandes livrées, DHD n\'a pas encore versé')}</div></div>
    </div>
    <div class="row between small"><span class="muted">${t('En cours de livraison (part fournisseur)')}</span><b class="num">${dzd(b.road)}</b></div>
    <div class="row between small"><span class="muted">${t('Payé au fournisseur sur la période')}</span><b class="num up">− ${dzd(paidP)}</b></div>
    ${dues[0]? `<div class="lock-note">${ic('clock','sm')} ${t('Prochaine échéance')} : ${fDate(dues[0].due)} · ${dzd(dues.filter(d=>dayStart(d.due)===dayStart(dues[0].due)).reduce((s,d)=>s+d.rest,0))}</div>`:''}
  </div>`, `<button class="btn sm primary" data-a="payNew" ${b.due?'':'disabled'}>${ic('cash','sm')} ${t('Payer')}</button><a class="btn sm" href="#/erp/fournisseurs">${t('Détail')}</a>`);
}
function adsDashCard(){
  const {from,to} = periodRange(); const list = AD_SPEND.filter(a=>a.date>=from && a.date<=to);
  const usd = list.reduce((s,a)=>s+a.usd,0), dz = Math.round(usd*SETTINGS.usdRate);
  const today = AD_SPEND.filter(a=>a.date>=dayStart(Date.now())).reduce((s,a)=>s+a.usd,0);
  const deliv = ORDERS.filter(o=>DELIVERED_ST.includes(o.status) && inPeriod(o.times.delivered)).length;
  const days = Math.max(1, Math.round((Math.min(to,Date.now())-from)/DAY));
  return card(t('Publicité Meta'), `<div class="card-b col" style="gap:10px">
    <div class="g2" style="gap:10px">
      <div class="cashbox c2"><div class="l">${t('Dépense sur la période')}</div><div class="v num">${dzd(dz)}</div><div class="xs muted">${usd.toFixed(2).replace('.',',')} USD × ${SETTINGS.usdRate}</div></div>
      <div class="cashbox c3"><div class="l">${t('Dépense aujourd\'hui')}</div><div class="v num">${dzd(Math.round(today*SETTINGS.usdRate))}</div><div class="xs muted">${today.toFixed(2).replace('.',',')} USD</div></div>
    </div>
    <div class="row between small"><span class="muted">${t('Moyenne par jour')}</span><b class="num">${dzd(dz/days)}</b></div>
    <div class="row between small"><span class="muted">${t('Coût par commande livrée')}</span><b class="num">${dzd(dz/Math.max(1,deliv))}</b></div>
  </div>`, `<button class="btn sm" data-a="adDay">${ic('plus','sm')} ${t('Saisir la dépense du jour')}</button>`);
}
function dailyCard(){
  const {from,to} = periodRange(); const rows = dailyLedger(Math.max(from, to-30*DAY), to);
  const asc = rows.slice().reverse(); const labels = asc.map(r=>new Date(r.d).getDate()+'/'+(new Date(r.d).getMonth()+1));
  const tot = rows.reduce((a,r)=>({rec:a.rec+r.rec, deliv:a.deliv+r.deliv, ca:a.ca+r.ca, usd:a.usd+r.usd, ad:a.ad+r.ad, ret:a.ret+r.ret, net:a.net+r.net}),{rec:0,deliv:0,ca:0,usd:0,ad:0,ret:0,net:0});
  return card(t('Chaque jour : pub, chiffre d\'affaires et bénéfice net'), `<div class="card-b">
    ${asc.length>1? lineChart([{name:t('CA livré'),data:asc.map(r=>r.ca),color:'#2F6690'},{name:t('Dépense pub'),data:asc.map(r=>r.ad),color:'#D99A2B'},{name:t('Bénéfice net'),data:asc.map(r=>Math.max(0,r.net)),color:'#2F7D4F',area:true}], labels,{w:1100,h:230,label:'journal quotidien'})+`<div class="legend" style="margin:6px 0 12px"><span><i style="background:#2F6690"></i>${t('CA livré')}</span><span><i style="background:#D99A2B"></i>${t('Dépense pub')}</span><span><i style="background:#2F7D4F"></i>${t('Bénéfice net')}</span></div>`:''}
    <div class="tbl-wrap" style="max-height:420px"><table class="tbl"><thead><tr><th>${t('Jour')}</th><th class="r">${t('Commandes reçues')}</th><th class="r">${t('Livrées')}</th><th class="r">${t('CA livré')}</th><th class="r">${t('Pub (USD)')}</th><th class="r">${t('Pub (DZD)')}</th><th class="r">${t('Frais retours')}</th><th class="r">${t('Bénéfice net')}</th></tr></thead><tbody>
    ${rows.map(r=>`<tr><td><b>${fDate(r.d)}</b>${dayStart(Date.now())===r.d?` <span class="badge blue">${t('aujourd\'hui')}</span>`:''}</td><td class="r num">${r.rec}</td><td class="r num">${r.deliv}</td><td class="r num">${dzd(r.ca)}</td><td class="r num">${r.usd.toFixed(2).replace('.',',')}</td><td class="r num">${dzd(r.ad)}</td><td class="r num ${r.ret?'down':''}">${r.ret?'− '+dzd(r.ret):'—'}</td><td class="r num"><b class="${r.net>=0?'up':'down'}">${dzd(r.net)}</b></td></tr>`).join('')}
    <tr style="background:var(--kraft-ll)"><td><b>${t('Total')}</b></td><td class="r num"><b>${tot.rec}</b></td><td class="r num"><b>${tot.deliv}</b></td><td class="r num"><b>${dzd(tot.ca)}</b></td><td class="r num"><b>${tot.usd.toFixed(2).replace('.',',')}</b></td><td class="r num"><b>${dzd(tot.ad)}</b></td><td class="r num"><b>${tot.ret?'− '+dzd(tot.ret):'—'}</b></td><td class="r num"><b class="${tot.net>=0?'up':'down'}">${dzd(tot.net)}</b></td></tr>
    </tbody></table></div>
    <p class="xs muted" style="margin:10px 0 0">${t('Bénéfice net du jour = CA des colis livrés ce jour − coût fournisseur − frais DHD − commissions − dépense pub réelle du jour − frais des retours. Les livraisons et versements viennent de DHD, la pub de Meta Ads.')}</p>
  </div>`, `${syncBadge()}<button class="btn sm" data-a="dhdSync">${ic('refresh','sm')} ${t('Actualiser DHD')}</button><button class="btn sm" data-a="exportDaily">${ic('download','sm')} Excel</button>`);
}
function agentTable(list){
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Agent')}</th><th>${t('Statut')}</th><th class="r">${t('Traitées')}</th><th class="r">${t('Confirmation')}</th><th class="r">${t('Upsell')}</th><th class="r">${t('Livraison')}</th><th class="r">${t('Gain upsell')}</th></tr></thead><tbody>
  ${AGENTS.map(a=>{ const p=agentPerf(a,list); return `<tr><td>${agentCell(a.id)}</td><td>${a.online&&!a.pause? `<span class="badge green"><span class="dot green"></span>${t('En ligne')}</span>` : a.pause? `<span class="badge amber">${t('En pause')}</span>` : `<span class="badge">${t('Hors ligne')}</span>`}</td><td class="r num">${p.treated}</td><td class="r num">${fmtPct(p.confRate)}</td><td class="r num">${fmtPct(p.upRate)}</td><td class="r num"><b class="${p.delivRate>=75?'up':'down'}">${fmtPct(p.delivRate)}</b></td><td class="r num">${dzd(p.gain)}</td></tr>`; }).join('')}
  </tbody></table></div>`;
}

/* ---------- Commandes à confirmer ---------- */
S.ui.conf = {tab:'all', q:'', src:'', agent:'', sel:new Set()};
function viewConfList(){
  const u=S.ui.conf; const base = visibleOrders().filter(o=>CONF_ST.includes(o.status));
  const tabs = [['all','Toutes',base.length],['new','Nouvelle',base.filter(o=>o.status==='new').length],['calling','En appel',base.filter(o=>o.status==='calling').length],['unreach','Injoignable 1-2-3',base.filter(o=>o.status==='unreach').length],['callback','Rappel programmé',base.filter(o=>o.status==='callback').length],['cancelled','Annulées', visibleOrders().filter(o=>o.status==='cancelled').length]];
  let list = u.tab==='cancelled'? visibleOrders().filter(o=>o.status==='cancelled') : u.tab==='all'? base : base.filter(o=>o.status===u.tab);
  if(u.q){ const q=u.q.toLowerCase(); list=list.filter(o=>o.ref.toLowerCase().includes(q)||CBY[o.customerId].name.toLowerCase().includes(q)||CBY[o.customerId].phone.replace(/\s/g,'').includes(q.replace(/\s/g,''))); }
  if(u.src) list=list.filter(o=>o.source===u.src); if(u.agent) list=list.filter(o=>String(o.agentId)===u.agent || (u.agent==='none'&&!o.agentId));
  list.sort((a,b)=> (a.nextCall||a.created) - (b.nextCall||b.created));
  const canBulk = S.role!=='agent';
  const table = `<div class="tabs" role="tablist">${tabs.map(([k,l,n])=>`<button role="tab" aria-selected="${u.tab===k}" class="${u.tab===k?'on':''}" data-a="confTab" data-v="${k}">${t(l)} <span class="c">${n}</span></button>`).join('')}</div>
    <div class="filters-bar">
      <input class="input s" placeholder="${t('Rechercher n°, client, téléphone…')}" value="${esc(u.q)}" data-in="confQ" aria-label="${t('Rechercher')}">
      <select class="select" data-ch="confSrc" aria-label="Source"><option value="">${t('Toutes les sources')}</option>${['Site','WhatsApp','Messenger','Instagram','Téléphone'].map(s=>`<option ${u.src===s?'selected':''} value="${s}">${t(s)}</option>`).join('')}</select>
      ${S.role!=='agent'? `<select class="select" data-ch="confAgent" aria-label="Agent"><option value="">${t('Tous les agents')}</option><option value="none" ${u.agent==='none'?'selected':''}>${t('Non assignées')}</option>${AGENTS.map(a=>`<option value="${a.id}" ${u.agent==String(a.id)?'selected':''}>${a.name}</option>`).join('')}</select>`:''}
      <span class="grow"></span>
      ${canBulk && u.sel.size? `<span class="small"><b>${u.sel.size}</b> ${t('sélectionnée(s)')}</span><select class="select" id="bulkAgent" aria-label="${t('Réassigner à')}"><option value="">${t('Réassigner à…')}</option>${AGENTS.map(a=>`<option value="${a.id}">${a.name}</option>`).join('')}</select><button class="btn sm" data-a="bulkReassign">${t('Réassigner')}</button><button class="btn sm" data-a="bulkCancelDup">${t('Annuler les doublons')}</button>`:''}
    </div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr>${canBulk?`<th><input type="checkbox" class="check" data-ch="selAll" aria-label="${t('Tout sélectionner')}"></th>`:''}<th>${t('N°')}</th><th>${t('Date')}</th><th>${t('Source')}</th><th>${t('Client')}</th><th>${t('Téléphone')}</th><th>${t('Wilaya')}</th><th>${t('Produits')}</th><th class="r">${t('Total')}</th><th>${t('Agent')}</th><th class="r">${t('Appels')}</th><th>${t('Prochain rappel')}</th><th>${t('Statut')}</th></tr></thead><tbody>
    ${list.length? list.map(o=>{ const cd = o.nextCall? countdown(o.nextCall) : null; return `<tr class="clickable ${o.fresh?'':''}" data-a="openOrder" data-id="${o.id}">${canBulk?`<td data-stop="1"><input type="checkbox" ${u.sel.has(o.id)?'checked':''} data-ch="sel" data-id="${o.id}" aria-label="${o.ref}"></td>`:''}<td><b>${o.ref}</b>${o.fresh?` <span class="badge green">${t('nouveau')}</span>`:''}</td><td class="small">${fDT(o.created)}</td><td>${srcBadge(o.source)}</td><td>${custCell(o)}</td><td>${phoneCell(o)}</td><td>${esc(wName(o.wilaya))}</td><td>${itemsSummary(o.items)}</td><td class="r num"><b>${dzd(orderTotal(o))}</b></td><td>${agentCell(o.agentId)}</td><td class="r num">${o.calls}</td><td>${cd? `<span class="countdown ${cd.cls}">${cd.txt}</span><div class="xs muted">${fTime(o.nextCall)}</div>`:'<span class="muted">—</span>'}</td><td>${stBadge(o)}${o.status==='cancelled'?`<div class="xs muted">${t(o.cancelReason)}</div>`:''}</td></tr>`; }).join('') : emptyRow(13,'Aucune commande dans cet onglet')}
    </tbody></table></div>`;
  const actions = `<button class="btn" data-a="exportConf">${ic('download','sm')} ${t('Exporter')}</button><button class="btn primary" data-a="manualOrder">${ic('plus','sm')} ${t('Nouvelle commande manuelle')}</button>`;
  return erpShell('confirmer', t('Commandes à confirmer'), t('Cliquez sur une commande pour ouvrir l\'écran d\'appel'), card('', table), actions);
}

/* ---------- Écran d'appel (panneau latéral et plein écran) ---------- */
function drawerOrder(){ return S.drawer? ORDERS.find(o=>o.id===S.drawer.id) : null; }
function callScreenParts(o){
  const c = CBY[o.customerId], cs = custStats(c.id), past = custOrders(c.id).filter(x=>x.id!==o.id);
  const editable = CONF_ST.includes(o.status) && (S.role!=='agent' || o.agentId===S.agentId) && ['admin','manager','agent'].includes(S.role);
  const sub = orderSub(o), init = linesTotal(o.initial), gain = upsellGain(o), f = finOf(o);
  const inCart = new Set(o.items.map(i=>i.pid));
  const sugg = [...new Set(o.items.flatMap(i=>PBY[i.pid].upsells))].filter(pid=>!inCart.has(pid) && PBY[pid].price).slice(0,6);
  const q = (S.drawer && S.drawer.addQ || '').toLowerCase();
  const search = q? PRODUCTS.filter(p=>p.price && p.name.toLowerCase().includes(q)).slice(0,6) : [];
  const left = `
    <div class="card card-b col" style="gap:10px">
      <div class="row"><span class="avatar">${initials(c.name)}</span><div class="grow"><b>${esc(c.name)}</b>${c.business?`<div class="small muted">${esc(c.business)}</div>`:''}</div><span class="badge ${SEG_C[cs.seg]}">${t(cs.seg)}</span></div>
      ${cs.black? `<div class="lock-note" style="background:var(--red-l);color:#962F28">${ic('flag','sm')} ${t('Liste noire : 2 retours ou plus. Vérifiez bien avant de confirmer.')}</div>` : cs.refused? `<div class="lock-note">${ic('alert','sm')} ${t('Ce client a déjà refusé un colis.')}</div>`:''}
      ${o.duplicate? `<div class="lock-note">${ic('copy','sm')} ${t('Doublon probable : même téléphone et mêmes produits en moins de 24 h.')}</div>`:''}
      <div class="row between"><span dir="ltr" class="num" style="font-size:17px;font-weight:800">${esc(c.phone)}</span><span class="row"><a class="btn sm green" href="tel:${c.phone.replace(/\s/g,'')}" data-a="logCall" data-id="${o.id}">${ic('phone','sm')} ${t('Appeler')}</a><a class="btn sm wa" href="https://wa.me/213${c.phone.replace(/\s/g,'').slice(1)}" target="_blank" rel="noopener">${ic('wa','sm')}</a></span></div>
      ${c.phone2?`<div class="small muted">${t('2e numéro')} : <span dir="ltr">${esc(c.phone2)}</span></div>`:''}
      <div class="grid3" style="gap:6px;text-align:center">
        <div class="sumbox" style="padding:8px"><div class="xs muted">${t('Créées')}</div><b class="num">${cs.created}</b></div>
        <div class="sumbox" style="padding:8px"><div class="xs muted">${t('Livrées')}</div><b class="num up">${cs.delivered}</b></div>
        <div class="sumbox" style="padding:8px"><div class="xs muted">${t('Retournées')}</div><b class="num ${cs.returned?'down':''}">${cs.returned}</b></div>
      </div>
      <div class="small muted">${t('Total dépensé')} : <b style="color:var(--ink)">${dzd(cs.spent)}</b> · ${t('Taux de livraison')} ${fmtPct(cs.rate)}</div>
      ${past.length? `<div class="small"><b>${t('Commandes passées')}</b>${past.slice(-4).reverse().map(p=>`<div class="row between" style="padding:3px 0"><span>${p.ref} · ${fDate(p.created)}</span><span class="badge ${STATUS[p.status].c}">${stName(p.status,p)}</span></div>`).join('')}</div>`:''}
    </div>
    <div class="card card-b col" style="gap:8px">
      <b>${t('Livraison')}</b>
      <div class="field"><label for="dW">${t('Wilaya')}</label><select class="select" id="dW" data-ch="oWilaya" ${editable?'':'disabled'}>${WILAYAS.map(w=>`<option value="${w.id}" ${w.id===o.wilaya?'selected':''}>${w.code} - ${esc(wName(w.id))}</option>`).join('')}</select></div>
      <div class="field"><label for="dC">${t('Commune')}</label><select class="select" id="dC" data-ch="oCommune" ${editable?'':'disabled'}>${communeOptions(o.wilaya, o.commune)}</select></div>
      <div class="field"><label for="dA">${t('Adresse')}</label><input class="input" id="dA" value="${esc(o.address)}" data-ch="oAddress" ${editable?'':'disabled'}></div>
      <div class="seg" role="group" aria-label="${t('Type de livraison')}"><button class="${o.delivery==='home'?'on':''}" data-a="oDelivery" data-v="home" ${editable?'':'disabled'}>${t('Domicile')} · ${dzd(feeOf({...o,delivery:'home'}))}</button><button class="${o.delivery==='desk'?'on':''}" data-a="oDelivery" data-v="desk" ${editable?'':'disabled'}>${t('Bureau DHD')} · ${dzd(feeOf({...o,delivery:'desk'}))}</button></div>
      ${o.note?`<div class="small"><b>${t('Note client')} :</b> ${esc(o.note)}</div>`:''}
    </div>`;
  const center = `
    <div class="card"><div class="card-h"><h3>${t('Panier')} ${editable? `<span class="badge green">${t('modifiable')}</span>`:''}</h3><span class="small muted">${t('Initial')} : ${dzd(init)}</span></div><div class="card-b" style="padding-top:4px">
      ${o.items.map((it,i)=>{ const p=PBY[it.pid]; const was = o.initial.find(x=>x.pid===it.pid && x.v===it.v); const isUp = !was || it.q>was.q; const avail=stockInfo(it.pid).available; return `<div class="cart-line ${isUp?'up':''}">
        <div class="row" style="min-width:0">${prodArt(p,38)}<div style="min-width:0"><b class="small">${esc(p.name)}</b>${it.v?` <span class="badge">${esc(p.variants.find(v=>v.id===it.v).label)}</span>`:''}<div class="xs muted">${dzd(it.price)} · ${t('dispo')} ${avail}${isUp?` · <b class="up">${t('upsell')}</b>`:''}</div></div></div>
        ${editable? `<div class="qty sm"><button data-a="lineQ" data-i="${i}" data-v="-1" aria-label="moins">−</button><input value="${it.q}" aria-label="${t('Quantité')}" data-ch="lineQset" data-i="${i}"><button data-a="lineQ" data-i="${i}" data-v="1" aria-label="plus">+</button></div>` : `<span class="num">× ${it.q}</span>`}
        <b class="num" style="min-width:90px;text-align:end">${dzd(it.price*it.q)}</b>
        ${editable? `<button class="btn icon sm ghost" data-a="lineDel" data-i="${i}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button>`:'<span></span>'}
      </div>`; }).join('')}
      ${editable? `<div style="margin-top:10px;position:relative"><input class="input" placeholder="${t('Ajouter un produit (recherche)…')}" value="${esc(S.drawer?S.drawer.addQ:'')}" data-in="addQ" aria-label="${t('Ajouter un produit')}" id="addQ">${search.length? `<div class="card" style="position:absolute;inset-inline:0;top:42px;z-index:5;max-height:240px;overflow:auto">${search.map(p=>`<button class="btn ghost block" style="justify-content:space-between;border-radius:0" data-a="addLine" data-id="${p.id}"><span>${esc(p.name)}</span><span class="num">${dzd(p.variants?p.variants[0].price:p.price)}</span></button>`).join('')}</div>`:''}</div>`:''}
    </div></div>
    ${editable? upsellBlock(o, sugg, inCart):''}
    ${card(t('Script d\'appel'), `<div class="card-b small" style="line-height:1.7"><p style="margin:0 0 6px">« ${t('Bonjour')} ${esc(c.name.split(' ')[0])}, ${t('ici')} ${esc(me().name.split(' ')[0])} ${t('de PackLik. Vous avez commandé')} <b>${esc(PBY[o.items[0]?.pid||5].name)}</b>. ${t('Je vous appelle pour confirmer votre commande.')} »</p><p style="margin:0 0 6px">→ ${t('Vérifier nom, wilaya, commune et adresse exacte.')}</p><p style="margin:0">→ ${t('Proposer')} : <b>${sugg.slice(0,2).map(pid=>esc(PBY[pid].name)).join(' / ') || '—'}</b> ${t('(souvent pris ensemble).')}</p></div>`)}`;
  const limit = S.role==='agent'? SETTINGS.discountAgent : S.role==='manager'? SETTINGS.discountManager : 100;
  const right = `
    <div class="sumbox col" style="gap:2px">
      <div class="ln"><span>${t('Sous-total')}</span><span class="num">${dzd(sub)}</span></div>
      ${editable? `<div class="ln"><label for="disc">${t('Remise')} (%) <span class="xs muted">max ${limit===100?'∞':limit+' %'}</span></label><input id="disc" class="input" type="number" min="0" max="100" style="width:70px;height:30px" value="${o.discount||0}" data-ch="oDiscount"></div>` : o.discount? `<div class="ln"><span>${t('Remise')}</span><span>${o.discount} %</span></div>`:''}
      ${o.discount? `<div class="ln"><span>${t('Montant remise')}</span><span class="num down">− ${dzd(discountAmt(o))}</span></div>`:''}
      <div class="ln"><span>${t('Livraison')}</span><span class="num">${dzd(feeOf(o))}</span></div>
      <div class="ln tot"><span>${t('Total')}</span><span class="num">${dzd(orderTotal(o))}</span></div>
    </div>
    <div class="sumbox col" style="gap:2px">
      <div class="ln"><span class="muted">${t('Version initiale')}</span><span class="num">${dzd(init)}</span></div>
      <div class="ln"><span class="muted">${t('Version confirmée')}</span><span class="num">${dzd(sub)}</span></div>
      <div class="ln" style="font-weight:800"><span>${t('Gain d\'upsell')}</span><span class="num up">+ ${dzd(gain)} (${fmtPct(upsellPct(o))})</span></div>
      ${seesCost()? `<div class="ln"><span class="muted">${t('Marge estimée')}</span><b class="num ${f.net>=0?'up':'down'}">${dzd(f.net)}</b></div>` : `<div class="ln xs muted">${ic('lock','sm')} ${t('Marge visible par l\'Admin uniquement')}</div>`}
    </div>
    ${shipBox(o, editable)}
    ${o.discountPending? `<div class="lock-note">${ic('percent','sm')} ${t('Remise au-delà du seuil : validation requise')}</div>`:''}
    <div class="card card-b"><b class="small">${t('Historique')}</b><div class="timeline" style="margin-top:8px;max-height:260px;overflow:auto">${o.history.slice().reverse().map(h=>`<div class="tl ${h.color}"><span class="d"></span><div class="tx"><b>${esc(t(h.action))}</b>${h.note?` <span class="muted">— ${esc(t(h.note))}</span>`:''}<div class="xs muted">${fDT(h.at)} · ${esc(t(h.who))}</div></div></div>`).join('')}</div></div>`;
  const foot = editable? `
    <button class="btn green lg" data-a="resConfirm">${ic('check')} ${t('Confirmée')}</button>
    <button class="btn amber lg" data-a="resUnreach">${ic('phone')} ${t('Injoignable')}${o.status==='unreach'?' '+(o.unreachN+1>3?3:o.unreachN+1):''}</button>
    <button class="btn lg" data-a="resCallback">${ic('cal')} ${t('Rappel')}</button>
    <button class="btn red lg" data-a="resCancel">${ic('x')} ${t('Annulée')}</button>
    <span class="grow"></span><span class="small muted">${t('Appels')} : ${o.calls}</span>` : orderActions(o);
  return {left, center, right, foot, editable};
}
function upsellBlock(o, sugg, inCart){
  const cat = S.drawer && S.drawer.upCat || '';
  const list = cat? PRODUCTS.filter(p=>p.price && p.status!=='archivé' && p.cats.includes(cat)) : sugg.map(pid=>PBY[pid]);
  const cats = CATS.filter(c=>c.id!=='tout');
  const chips = `<div class="row wrap" style="gap:6px;padding:12px 16px 0"><button class="chipf ${!cat?'on':''}" data-a="upCat" data-v="">${ic('zap','sm')} ${t('Suggestions')}</button>${cats.map(c=>`<button class="chipf ${cat===c.id?'on':''}" data-a="upCat" data-v="${c.id}">${esc(catName(c))} <span class="xs muted">${PRODUCTS.filter(p=>p.price&&p.cats.includes(c.id)).length}</span></button>`).join('')}</div>`;
  const grid = list.length? `<div class="card-b upsell" style="max-height:330px;overflow:auto">${list.map(p=>{ const pr=p.variants?p.variants[0].price:p.price; const av=stockInfo(p.id).available; return `<div class="u"><div class="row">${prodArt(p,34)}<b>${esc(p.name)}</b></div><div class="row between"><span class="num small">${dzd(pr)}${inCart.has(p.id)?` <span class="badge green">${t('dans le panier')}</span>`:''}${av<=0?` <span class="badge red">${t('Rupture')}</span>`:''}</span><button class="btn sm kraft" data-a="addLine" data-id="${p.id}" ${av<=0&&!p.onDemand?'disabled':''}>${ic('plus','sm')} ${t('Ajouter')}</button></div></div>`; }).join('')}</div>` : `<div class="empty">${t('Aucun produit')}</div>`;
  return card(t('Suggestions d\'upsell'), chips + grid, `<span class="small muted">${t('~70 % des commandes acceptent un upsell')}</span>`);
}
function shipBox(o, editable){
  const c=carrierOf(o), w=orderWeight(o), ow=overweightFee(o), P=parcelsOf(o);
  const canEdit = editable || (['toprep','ready'].includes(o.status) && ['admin','gerant'].includes(S.role));
  return `<div class="sumbox col" style="gap:6px">
    <div class="ln"><label for="oCar" class="muted">${t('Société de livraison')}</label><select id="oCar" class="select" style="width:auto;height:30px" data-ch="oCarrier" ${canEdit?'':'disabled'}>${CARRIERS.filter(x=>x.connected||x.id===o.carrier).map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${esc(t(x.name))}</option>`).join('')}</select></div>
    ${c.internal? `<div class="ln"><span class="muted">${t('Livreur')}</span><select class="select" style="width:auto;height:30px" data-ch="oCourier" ${['admin','gerant'].includes(S.role)?'':'disabled'}><option value="">${t('Automatique')}</option>${COURIERS.filter(x=>x.active).map(x=>`<option value="${x.id}" ${o.courierId===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div>`:''}
    <div class="ln"><span class="muted">${t('Poids de la commande')}</span><b class="num">${kg(w)}</b></div>
    <div class="ln"><span class="muted">${t('Inclus')} ${c.baseKg} kg · ${t('puis')} ${dzd(c.extraPerKg||0)}/kg</span><span class="num ${ow?'down':''}">${ow? '+ '+dzd(ow) : t('pas de surpoids')}</span></div>
    <div class="ln"><span class="muted">${t('Colis')}</span><span>${P.length>1? `<b>${P.length}</b> (${P.map(p=>kg(p.weight)).join(' + ')})` : '1'}${needsSplit(o)? ` <span class="badge red">${t('à découper')} &gt; ${c.maxParcelKg} kg</span>`:''}</span></div>
    ${(needsSplit(o)||P.length>1) && ['admin','gerant'].includes(S.role)? `<button class="btn sm" data-a="splitOrder" data-id="${o.id}">${ic('layers','sm')} ${P.length>1? t('Modifier le découpage') : t('Découper la commande')}</button>`:''}
  </div>`;
}
function orderActions(o){
  const st=o.status, A=[];
  if(S.role==='fournisseur') return '';
  if(st==='toprep' && ['admin','gerant'].includes(S.role)) A.push(`<button class="btn green" data-a="oSet" data-v="ready">${ic('box','sm')} ${t('Marquer prête')}</button>`);
  if(st==='ready' && ['admin','gerant'].includes(S.role)) A.push(`<button class="btn primary" data-a="oSet" data-v="sent">${ic('send','sm')} ${t('Envoyer à DHD')}</button>`);
  if(['sent','picked','transit','outfor'].includes(st) && ['admin','gerant'].includes(S.role)) A.push(`<button class="btn" data-a="simAttempt">${ic('alert','sm')} ${t('Simuler une tentative échouée')}</button><button class="btn green" data-a="oSet" data-v="delivered">${ic('check','sm')} ${t('Marquer livrée')}</button>`);
  if(st==='failed') A.push(`<a class="btn" href="#/erp/tentatives">${ic('alert','sm')} ${t('Traiter la tentative')}</a>`);
  if(st==='delivered' && isAdmin()) A.push(`<button class="btn green" data-a="oSet" data-v="paid">${ic('cash','sm')} ${t('Marquer payée par DHD')}</button>`);
  if(st==='paid' && isAdmin()) A.push(`<button class="btn primary" data-a="oSet" data-v="closed">${ic('lock','sm')} ${t('Clôturer')}</button>`);
  if(st==='returning' && ['admin','gerant'].includes(S.role)) A.push(`<button class="btn" data-a="receiveReturn" data-id="${o.id}">${ic('undo','sm')} ${t('Réceptionner le retour')}</button>`);
  if(['toprep','ready','sent','picked','transit'].includes(st) && ['admin','gerant','manager'].includes(S.role)) A.push(`<button class="btn red" data-a="cancelConfirmed">${ic('x','sm')} ${t('Annuler (motif obligatoire)')}</button>`);
  A.push(`<button class="btn" data-a="printLabel" data-id="${o.id}">${ic('print','sm')} ${t('Étiquette')}</button>`);
  return A.join('');
}
function renderDrawer(){
  const o = drawerOrder(); if(!o) return '';
  const c = CBY[o.customerId]; const P = callScreenParts(o);
  const tab = S.drawer.tab || 'call';
  let body;
  if(tab==='fin' && seesCost()) body = `<div style="grid-column:1/-1">${financeCascade(o)}</div>`;
  else if(tab==='att') body = `<div style="grid-column:1/-1">${attemptsBlock(o)}</div>`;
  else body = `<div class="col" style="gap:16px">${P.left}</div><div class="col" style="gap:16px">${P.center}${P.right}</div>`;
  return `<div class="drawer-ov" data-a="closeDrawer"></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="${o.ref}">
    <div class="drawer-h"><div class="grow"><div class="row wrap"><b style="font-size:17px">${o.ref}</b>${stBadge(o)}${srcBadge(o.source)}${o.lockedBy && o.status==='calling'? `<span class="badge violet">${ic('lock','sm')} ${t('Verrouillée par')} ${esc(UBY[o.lockedBy].name.split(' ')[0])}</span>`:''}</div><div class="small muted">${fDT(o.created)} · ${t('Agent')} : ${o.agentId? esc(UBY[o.agentId].name) : t('Non assignée')}${o.tracking?' · DHD <span dir="ltr">'+o.tracking+'</span>':''}</div></div>
      <div class="seg">${[['call', CONF_ST.includes(o.status)?'Écran d\'appel':'Commande'],['att','Tentatives ('+o.attempts.length+')'], ...(seesCost()?[['fin','Fiche financière']]:[])].map(([k,l])=>`<button class="${tab===k?'on':''}" data-a="drawerTab" data-v="${k}">${t(l)}</button>`).join('')}</div>
      ${S.role!=='agent'? `<a class="btn sm" href="#/erp/appel/${o.id}" title="${t('Plein écran')}" data-a="closeDrawerSoft">${ic('arrowR','sm flip')}</a>`:''}
      <button class="btn icon ghost" data-a="closeDrawer" aria-label="${t('Fermer')}">${ic('x')}</button></div>
    <div class="drawer-b">${body}</div>
    <div class="drawer-f">${P.foot}</div>
  </aside>`;
}
function financeCascade(o){
  const f = finOf(o);
  const L = (l,a,d,cls)=>`<div class="ln ${cls||''}"><span>${l}</span><b class="num a">${a}</b><span class="ds small muted">${d}</span></div>`;
  return card(t('Fiche financière')+' — '+o.ref, `<div class="card-b cascade">
    <div class="row between" style="margin-bottom:8px"><span class="small muted">${t('État')} :</span><span class="badge ${f.state==='encaissée'?'green':f.state==='acquise'?'blue':'amber'}">${t(f.state)}</span></div>
    ${L(t('Produits')+' ('+o.items.map(i=>i.q+'×'+nf(i.price)).join(' + ')+(o.discount?' − '+o.discount+' %':'')+')', dzd(f.products), '—')}
    ${L(t('Frais de livraison facturés au client'), dzd(f.fee), '—')}
    ${L(t('Total encaissé par DHD'), dzd(f.total), '—','sub')}
    ${L(t('Coût d\'achat fournisseur'), '− '+dzd(f.cost), '→ '+t('Réserve fournisseur'),'neg')}
    ${L(t('Frais DHD retenus'), '− '+dzd(f.dhd), '→ '+t('Payé à DHD (déduit du versement)'),'neg')}
    ${L(t('Coût pub alloué à la commande'), '− '+dzd(f.ad), '→ '+t('Remboursement du Budget pub'),'neg')}
    ${L(t('Commission agent'), '− '+dzd(f.com), '→ '+t('Dette salariale'),'neg')}
    ${L(t('Bénéfice net'), dzd(f.net), f.net>0? '→ '+SETTINGS.boxes.security+' % '+t('Caisse de sécurité')+' ('+dzd(f.security)+') · '+SETTINGS.boxes.reinvest+' % '+t('Réinvestissement')+' ('+dzd(f.reinvest)+')' : '→ '+t('Perte absorbée par la Caisse de sécurité'), f.net>0?'tot':'tot neg')}
    <p class="xs muted" style="margin-top:10px">${t('Coût pub alloué = dépense Meta de la période ÷ commandes livrées sur la période.')} ${t('Prix d\'achat fictifs (65–75 % du prix de vente) à remplacer par les vrais.')}</p>
  </div>`);
}
function attemptsBlock(o){
  if(!o.attempts.length) return card(t('Tentatives de livraison'), `<div class="empty">${ic('check')}<div>${t('Aucune tentative échouée pour cette commande')}</div></div>`);
  return card(t('Tentatives de livraison'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>${t('Date')}</th><th>${t('Motif DHD')}</th><th>${t('Commentaire livreur')}</th><th>${t('Action PackLik')}</th><th>${t('Agent')}</th><th>${t('Résultat')}</th></tr></thead><tbody>${o.attempts.map(a=>`<tr><td><span class="badge red">${a.n}/3</span></td><td class="small">${fDT(a.at)}</td><td>${t(FBY[a.reason].fr)}</td><td class="small">${esc(t(a.comment))}</td><td class="small">${esc(t(a.action||'—'))}</td><td>${agentCell(a.agentId)}</td><td>${a.resolved? `<span class="badge green">${t(a.result||'Traité')}</span>` : `<span class="badge amber">${t('À traiter')}</span>`}</td></tr>`).join('')}</tbody></table></div>`);
}
function viewCallPage(id){
  let o = ORDERS.find(x=>x.id===+id);
  if(!o && S.role==='agent'){ o = nextForAgent(); }
  if(!o) return erpShell('appel', t('Écran d\'appel'), '', card('', `<div class="empty">${ic('check')}<div><b>${t('Aucune commande en attente')}</b></div><div class="small">${t('Votre file est vide. Bravo !')}</div></div>`));
  if(S.role==='agent' && o.agentId!==S.agentId) return erpShell('appel', t('Écran d\'appel'), '', card('', `<div class="empty">${ic('lock')}<div>${t('Cette commande est assignée à un autre agent.')}</div></div>`));
  const keep = S.drawer&&S.drawer.id===o.id? S.drawer : {}; S.drawer = {id:o.id, tab:'call', page:true, addQ:keep.addQ||'', upCat:keep.upCat||''};
  lockOrder(o);
  const P = callScreenParts(o);
  const body = `<div class="card card-b row wrap" style="gap:10px"><b style="font-size:18px">${o.ref}</b>${stBadge(o)}${srcBadge(o.source)}<span class="small muted">${fDT(o.created)} · ${esc(wName(o.wilaya))}</span><span class="grow"></span>${o.attempts.length?`<span class="badge red">${o.attempts.length} ${t('tentative(s) échouée(s)')}</span>`:''}</div>
    <div class="call-screen"><div class="col" style="gap:16px">${P.left}</div><div class="col" style="gap:16px">${P.center}</div><div class="col" style="gap:16px">${P.right}</div></div>
    <div class="card card-b row wrap" style="position:sticky;bottom:0;gap:8px;box-shadow:var(--sh2)">${P.foot}${S.role==='agent'?`<button class="btn" data-a="nextCall">${t('Commande suivante')} ${ic('arrowR','sm flip')}</button>`:''}</div>`;
  return erpShell('appel', t('Écran d\'appel'), t('Une commande à la fois, tout sur un écran'), body);
}
function lockOrder(o){
  if(['new','unreach','callback'].includes(o.status) && ['agent','manager','admin'].includes(S.role)){
    o.prevStatus = o.status; o.status='calling'; o.lockedBy = me().id; hist(o,'En appel','Fiche ouverte — verrouillée pour les autres agents','blue'); if(!o.firstCallAt) o.firstCallAt=Date.now(); o.fresh=false;
  }
}
function unlockOrder(o){ if(o && o.status==='calling' && o.prevStatus){ o.status=o.prevStatus; o.lockedBy=null; delete o.prevStatus; } }
function nextForAgent(){
  const mine = ORDERS.filter(o=>o.agentId===S.agentId && CONF_ST.includes(o.status));
  const due = mine.filter(o=>o.nextCall && o.nextCall<=Date.now()+5*MIN).sort((a,b)=>a.nextCall-b.nextCall);
  const nw = mine.filter(o=>o.status==='new').sort((a,b)=>a.created-b.created);
  return due[0] || nw[0] || mine.filter(o=>o.status==='calling')[0] || mine.sort((a,b)=>(a.nextCall||0)-(b.nextCall||0))[0] || null;
}

/* ============================================================
   ERP : suivi, tentatives, achats, produits, stock, fournisseurs, clients
   ============================================================ */
S.ui.track2 = {tab:'toprep', q:'', sel:new Set()};
const TRACK_TABS = [['toprep','À préparer',['toprep']],['ready','Prête',['ready']],['sent','Envoyée à DHD',['sent','picked']],['transit','En transit',['transit','outfor']],['failed','Tentatives échouées',['failed']],['delivered','Livrée',['delivered']],['ret','Retour',['returning','returned']],['paid','Payée',['paid','closed']]];
function viewTracking(page){
  const u=S.ui.track2; const vo = visibleOrders();
  const tabDef = TRACK_TABS.find(x=>x[0]===u.tab) || TRACK_TABS[0];
  let list = vo.filter(o=>tabDef[2].includes(o.status));
  if(u.q){ const q=u.q.toLowerCase(); list=list.filter(o=>o.ref.toLowerCase().includes(q)||CBY[o.customerId].name.toLowerCase().includes(q)||(o.tracking||'').toLowerCase().includes(q)); }
  list.sort((a,b)=>b.created-a.created);
  const ops = ['admin','gerant'].includes(S.role);
  const bulk = ops && u.sel.size ? `<span class="small"><b>${u.sel.size}</b> ${t('sélectionnée(s)')}</span>${u.tab==='toprep'?`<button class="btn sm green" data-a="bulkReady">${t('Marquer prêtes')}</button><button class="btn sm" data-a="picking">${ic('print','sm')} ${t('Bon de préparation')}</button>`:''}${u.tab==='ready'?`<button class="btn sm primary" data-a="bulkSend">${ic('send','sm')} ${t('Envoyer à DHD en masse')}</button><button class="btn sm" data-a="bordereau">${ic('print','sm')} ${t('Bordereau')}</button>`:''}${u.tab==='delivered' && isAdmin()?`<button class="btn sm green" data-a="reconcile">${ic('cash','sm')} ${t('Rapprocher un versement DHD')}</button>`:''}` : '';
  const body = card('', `<div class="tabs" role="tablist">${TRACK_TABS.map(([k,l,sts])=>{ const n=vo.filter(o=>sts.includes(o.status)).length; return `<button role="tab" aria-selected="${u.tab===k}" class="${u.tab===k?'on':''} ${k==='failed'?'danger':''}" data-a="trackTab" data-v="${k}">${t(l)} <span class="c">${n}</span></button>`; }).join('')}</div>
    <div class="filters-bar"><input class="input s" placeholder="${t('Rechercher n°, client, suivi DHD…')}" value="${esc(u.q)}" data-in="trackQ" aria-label="${t('Rechercher')}"><span class="grow"></span>${bulk}</div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr>${ops?`<th><input type="checkbox" data-ch="selAllT" aria-label="${t('Tout sélectionner')}"></th>`:''}<th>${t('N°')}</th><th>${t('Client')}</th><th>${t('Wilaya')}</th><th>${t('Produits')}</th><th class="r">${t('Total')}</th><th>${t('Agent')}</th><th>${t('Suivi DHD')}</th><th>${t('Dernière mise à jour')}</th><th>${t('Statut')}</th></tr></thead><tbody>
    ${list.length? list.map(o=>{ const blocked = BLOCK_ST.includes(o.status) && Date.now()-o.lastDhdUpdate>48*HOUR; return `<tr class="clickable ${o.riskReturn&&o.status==='failed'?'risk':''}" data-a="openOrder" data-id="${o.id}">${ops?`<td data-stop="1"><input type="checkbox" ${u.sel.has(o.id)?'checked':''} data-ch="selT" data-id="${o.id}" aria-label="${o.ref}"></td>`:''}<td><b>${o.ref}</b></td><td>${custCell(o)}</td><td>${esc(wName(o.wilaya))}<div class="xs muted">${o.delivery==='home'?t('Domicile'):t('Bureau DHD')}</div></td><td>${itemsSummary(o.items)}</td><td class="r num">${dzd(orderTotal(o))}</td><td>${agentCell(o.agentId)}</td><td class="small" dir="ltr">${o.tracking||'—'}</td><td class="small">${o.lastDhdUpdate? ago(o.lastDhdUpdate):'—'}${blocked?` <span class="badge red">${t('bloqué +48 h')}</span>`:''}</td><td>${stBadge(o)}</td></tr>`; }).join('') : emptyRow(10,'Aucune commande dans cet onglet','box')}
    </tbody></table></div>`);
  const actions = `${ops?`<button class="btn" data-a="dhdSync">${ic('refresh','sm')} ${t('Actualiser DHD')}</button>`:''}<a class="btn kraft" href="#/erp/tentatives">${ic('alert','sm')} ${t('Onglet Tentatives')}</a>${isAdmin()?`<button class="btn" data-a="reconcile">${ic('cash','sm')} ${t('Rapprochement DHD')}</button>`:''}`;
  return erpShell(page||'suivi', t('Suivi des commandes'), t('Synchronisation DHD toutes les 15 minutes')+' · '+t('dernière')+' : '+fTime(S.lastSync||NOW-7*MIN), body, actions);
}

/* ---------- Tentatives de livraison (zone à risque) ---------- */
S.ui.att = {filter:'all', agent:''};
function viewAttempts(page){
  const vo = visibleOrders();
  let list = vo.filter(o=>o.status==='failed' || (['returning'].includes(o.status)));
  const today = new Date(); today.setHours(0,0,0,0);
  const attToday = vo.reduce((s,o)=>s+o.attempts.filter(a=>a.at>=today.getTime()).length,0);
  const risk = vo.filter(o=>o.riskReturn && o.status==='failed').length;
  const retIn = vo.filter(o=>o.status==='returning').length;
  const blockedVal = vo.filter(o=>ATDHD_ST.includes(o.status)).reduce((s,o)=>s+orderTotal(o),0);
  const blocked = vo.filter(o=>BLOCK_ST.includes(o.status) && Date.now()-o.lastDhdUpdate>48*HOUR);
  const u = S.ui.att;
  if(u.filter==='risk') list = list.filter(o=>o.riskReturn); if(u.filter==='late') list = list.filter(o=>{ const a=o.attempts[o.attempts.length-1]; return a && !a.resolved && a.due<Date.now(); });
  if(u.agent) list = list.filter(o=>String(o.agentId)===u.agent);
  const urg = o=>{ const a=o.attempts[o.attempts.length-1]; return (o.riskReturn?-1e13:0) + (a&&!a.resolved? a.due : 9e12); };
  list.sort((a,b)=>urg(a)-urg(b));
  const body = `
    <div class="kpis">
      ${kpi(t('Tentatives du jour'), attToday, t('échecs enregistrés aujourd\'hui'))}
      ${kpi(t('Colis à risque'), `<span class="down">${risk}</span>`, t('3 tentatives échouées'))}
      ${kpi(t('Retours en cours'), retIn, dzd(vo.filter(o=>o.status==='returning').reduce((s,o)=>s+returnLoss(o),0))+' '+t('de pertes estimées'))}
      ${kpi(t('Valeur bloquée chez DHD'), dzd(blockedVal), t('colis expédiés non livrés'), 'accent')}
    </div>
    ${blocked.length? `<div class="card card-b row wrap" style="border-color:#E9B8B3;background:#FDF4F3"><span class="row" style="color:var(--red);font-weight:700">${ic('clock')} ${blocked.length} ${t('colis bloqué(s) +48 h sans mise à jour DHD')}</span>${blocked.map(o=>`<button class="badge red" data-a="openOrder" data-id="${o.id}" style="border:0;cursor:pointer">${o.ref} · ${esc(wName(o.wilaya))} · ${ago(o.lastDhdUpdate)}</button>`).join('')}${['admin','gerant'].includes(S.role)?`<button class="btn sm" data-a="dhdClaim">${t('Ouvrir une réclamation DHD')}</button>`:''}</div>`:''}
    ${card(t('Commandes avec tentative échouée — triées par urgence'), `
      <div class="filters-bar"><div class="seg">${[['all','Toutes'],['risk','Risque de retour'],['late','Délai dépassé']].map(([k,l])=>`<button class="${u.filter===k?'on':''}" data-a="attFilter" data-v="${k}">${t(l)}</button>`).join('')}</div>${S.role!=='agent'?`<select class="select" data-ch="attAgent" aria-label="Agent"><option value="">${t('Tous les agents')}</option>${AGENTS.map(a=>`<option value="${a.id}" ${u.agent==String(a.id)?'selected':''}>${a.name}</option>`).join('')}</select>`:''}<span class="grow"></span><span class="small muted">${t('Synchro DHD')} : ${fTime(S.lastSync||NOW-7*MIN)}</span><button class="btn sm" data-a="dhdSync">${ic('refresh','sm')} ${t('Actualiser')}</button></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Commande')}</th><th>${t('Client')}</th><th>${t('Wilaya')}</th><th>${t('Tentative')}</th><th>${t('Motif DHD')}</th><th>${t('Action requise')}</th><th>${t('Agent responsable')}</th><th>${t('Délai')}</th><th class="r">${t('Valeur')}</th><th>${t('Actions')}</th></tr></thead><tbody>
      ${list.length? list.map(o=>{ const a=o.attempts[o.attempts.length-1]||{}; const r=FBY[a.reason]||{}; const cd = a.due && !a.resolved? countdown(a.due) : null; const isRet=o.status==='returning';
        return `<tr class="${o.riskReturn?'risk':''}">
        <td><button class="btn ghost sm" data-a="openOrder" data-id="${o.id}" style="padding:0;font-weight:800">${o.ref}</button>${o.riskReturn?`<div><span class="badge red">${t('Risque de retour')}</span></div>`:''}</td>
        <td>${custCell(o)}<div class="xs">${phoneCell(o)}</div></td><td>${esc(wName(o.wilaya))}</td>
        <td><span class="badge ${o.attempts.length>=3?'red':o.attempts.length===2?'amber':'kraft'}">${t('Tentative')} ${o.attempts.length}/3</span></td>
        <td><b class="small">${t(r.fr||'—')}</b><div class="xs muted">${esc(t(a.comment||''))}</div></td>
        <td class="small" style="max-width:220px">${isRet? t('Réceptionner le retour au dépôt') : t(r.action||'')}</td>
        <td>${agentCell(o.agentId)}</td>
        <td>${isRet? `<span class="badge red">${t('Retour en cours')}</span>` : cd? `<span class="countdown ${cd.cls}">${ic('clock','sm')} ${cd.txt}</span>` : `<span class="badge green">${t('Traité')}</span>`}</td>
        <td class="r num">${dzd(orderTotal(o))}</td>
        <td><div class="row" style="gap:4px;flex-wrap:nowrap">${isRet? (['admin','gerant'].includes(S.role)?`<button class="btn sm" data-a="receiveReturn" data-id="${o.id}">${ic('undo','sm')} ${t('Réceptionner')}</button>`:'') : `
          <button class="btn sm icon green" data-a="attCall" data-id="${o.id}" title="${t('Rappeler le client')}" aria-label="${t('Rappeler le client')}">${ic('phone','sm')}</button>
          <button class="btn sm icon" data-a="attDate" data-id="${o.id}" title="${t('Nouvelle date')}" aria-label="${t('Nouvelle date')}">${ic('cal','sm')}</button>
          <button class="btn sm icon" data-a="attAddr" data-id="${o.id}" title="${t('Changer l\'adresse')}" aria-label="${t('Changer l\'adresse')}">${ic('pin','sm')}</button>
          <button class="btn sm icon" data-a="attDesk" data-id="${o.id}" title="${t('Passer en stop desk')}" aria-label="${t('Passer en stop desk')}">${ic('store','sm')}</button>
          ${S.role!=='agent'?`<button class="btn sm icon red" data-a="attReturn" data-id="${o.id}" title="${t('Marquer retour')}" aria-label="${t('Marquer retour')}">${ic('undo','sm')}</button>`:''}`}</div></td></tr>`; }).join('') : emptyRow(10,'Aucune tentative échouée en cours','check')}
      </tbody></table></div>`)}
    ${card(t('Règles appliquées automatiquement'), `<div class="card-b g2 small" style="gap:10px">
      <div>${FAIL_REASONS.map(r=>`<div class="row between" style="padding:4px 0;border-bottom:1px dashed var(--line)"><b>${t(r.fr)}</b><span class="muted">${t(r.action)} · ${r.delay>=DAY? '24 h':'2 h'}</span></div>`).join('')}</div>
      <ul style="margin:0;padding-inline-start:18px;line-height:1.8"><li>${t('Après 3 tentatives échouées : « Risque de retour », remonte en rouge chez le Manager.')}</li><li>${t('Colis immobile plus de 48 h sans mise à jour DHD : alerte « colis bloqué ».')}</li><li>${t('Chaque tentative est rattachée à l\'agent qui a confirmé : son taux de livraison en dépend.')}</li><li>${t('Badge après 1 refus ; liste noire après 2 retours.')}</li><li>${t('Synchronisation DHD toutes les 15 minutes + bouton « actualiser ».')}</li></ul>
    </div>`)}`;
  return erpShell(page||'tentatives', t('Tentatives de livraison'), t('Zone à haut risque : chaque colis non livré coûte l\'aller, le retour et la pub'), body);
}

/* ---------- Achats ---------- */
function purchaseSuggestions(){
  return PRODUCTS.filter(p=>p.price && !p.packItems && p.status!=='devis').map(p=>{ const s=stockInfo(p.id); const sold14 = ORDERS.filter(o=>o.created>Date.now()-14*DAY && CONFIRMED_ST.includes(o.status)).reduce((x,o)=>x+expand(o.items).filter(i=>i.pid===p.id).reduce((a,i)=>a+i.q,0),0) + (p.id%7===0? 2+p.id%5 : 0); const need = Math.max(0, Math.ceil(sold14/14*21) + p.threshold - s.available); return {p, s, sold14, need}; }).filter(x=>x.need>0 && (x.s.available<=x.p.threshold*1.5 || x.sold14>0)).sort((a,b)=>a.s.available-b.s.available).slice(0,10);
}
const PO_ST = {draft:['Brouillon',''], sent:['Envoyé au fournisseur','blue'], confirmed:['Confirmé par le fournisseur','kraft'], received:['Reçu','green']};
function viewPurchases(){
  const sug = purchaseSuggestions(); const sc = seesCost();
  const body = `<div class="g21">
    ${card(t('Bons de commande fournisseur'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('N°')}</th><th>${t('Créé le')}</th><th>${t('Livraison prévue')}</th><th>${t('Lignes')}</th>${sc?`<th class="r">${t('Montant (achat)')}</th>`:''}<th>${t('Statut')}</th><th></th></tr></thead><tbody>
      ${PURCHASES.slice().reverse().map(po=>`<tr><td><b>${po.id}</b></td><td class="small">${fDate(po.created)}</td><td class="small">${fDate(po.expected)}</td><td class="small">${po.items.length} ${t('produits')} · ${po.items.reduce((s,i)=>s+i.q,0)} ${t('unités')}${po.items.some(i=>po.status==='received'&&i.recv<i.q)?` <span class="badge amber">${t('écart')}</span>`:''}</td>${sc?`<td class="r num">${dzd(poTotal(po))}</td>`:''}<td><span class="badge ${PO_ST[po.status][1]}">${t(PO_ST[po.status][0])}</span></td><td>${po.status!=='received'?`<button class="btn sm" data-a="poReceive" data-id="${po.id}">${ic('truck','sm')} ${t('Réceptionner')}</button>`:`<button class="btn sm ghost" data-a="poView" data-id="${po.id}">${t('Détail')}</button>`}</td></tr>`).join('')}
    </tbody></table></div>`, `<button class="btn sm primary" data-a="poNew">${ic('plus','sm')} ${t('Nouveau bon de commande')}</button>`)}
    ${card(t('Suggestion d\'achat automatique'), `<div class="card-b small muted" style="padding-bottom:0">${t('Basée sur les ventes des 14 derniers jours et le seuil d\'alerte.')}</div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Produit')}</th><th class="r">${t('Dispo')}</th><th class="r">${t('Vendu 14 j')}</th><th class="r">${t('À commander')}</th></tr></thead><tbody>${sug.map(x=>`<tr><td class="small"><b>${esc(x.p.name)}</b></td><td class="r num ${x.s.available<=x.p.threshold?'down':''}">${x.s.available}</td><td class="r num">${x.sold14}</td><td class="r num"><b>${x.need}</b></td></tr>`).join('') || emptyRow(4,'Aucun besoin pour le moment')}</tbody></table></div><div class="card-b"><button class="btn kraft block" data-a="poFromSug">${ic('file','sm')} ${t('Créer un bon depuis les suggestions')}</button></div>`)}
  </div>
  ${card(t('Règle de paiement'), `<div class="card-b small">${t('La marchandise reçue entre en stock. Le fournisseur est payé commande par commande : sa part devient « Pending — à régler » dès que DHD verse l\'argent, puis « Payé » quand vous validez le paiement.')} <a href="#/erp/fournisseurs">${t('Voir le compte fournisseur')} →</a></div>`)}`;
  return erpShell('achats', t('Achats'), t('Bons de commande, réceptions et suggestions'), body);
}

/* ---------- Produits ---------- */
S.ui.prod = {tab:'list', q:'', cat:'', st:''};
function viewProducts(){
  const u=S.ui.prod, sc=seesCost(), canEdit=['admin','gerant'].includes(S.role);
  let list = PRODUCTS.slice(); if(u.q){ const q=u.q.toLowerCase(); list=list.filter(p=>p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q)); } if(u.cat) list=list.filter(p=>p.cats.includes(u.cat)); if(u.st) list=list.filter(p=>p.status===u.st);
  const tabs = `<div class="tabs">${[['list','Produits ('+PRODUCTS.length+')'],['cats','Catégories (17)'],['packs','Packs'],['var','Variantes']].map(([k,l])=>`<button class="${u.tab===k?'on':''}" data-a="prodTab" data-v="${k}">${t(l)}</button>`).join('')}</div>`;
  let inner;
  if(u.tab==='list') inner = `<div class="filters-bar"><input class="input s" placeholder="${t('Rechercher nom ou SKU…')}" value="${esc(u.q)}" data-in="prodQ" aria-label="${t('Rechercher')}"><select class="select" data-ch="prodCat" aria-label="${t('Catégorie')}"><option value="">${t('Toutes les catégories')}</option>${CATS.map(c=>`<option value="${c.id}" ${u.cat===c.id?'selected':''}>${esc(catName(c))}</option>`).join('')}</select><select class="select" data-ch="prodSt" aria-label="${t('Statut')}"><option value="">${t('Tous les statuts')}</option>${['actif','masqué','rupture','devis','archivé'].map(s=>`<option ${u.st===s?'selected':''} value="${s}">${t(s)}</option>`).join('')}</select><span class="grow"></span><span class="small muted">${list.length} ${t('produits')}</span></div>
    <div class="tbl-wrap" style="max-height:640px"><table class="tbl"><thead><tr><th>SKU</th><th>${t('Produit')}</th><th>${t('Catégories')}</th><th class="r">${t('Prix de vente')}</th>${sc?`<th class="r">${t('Prix d\'achat')}</th><th class="r">${t('Marge unitaire')}</th>`:''}<th class="r">${t('Stock dispo')}</th><th>${t('Statut')}</th>${canEdit?'<th></th>':''}</tr></thead><tbody>
    ${list.map(p=>{ const s=stockInfo(p.id); const m=p.price-p.cost; return `<tr><td class="small muted">${p.sku}</td><td><div class="row">${prodArt(p,34)}<div><b class="small">${esc(p.name)}</b><div class="xs muted">${p.pack} ${t('pièces')} · ${kg((p.weight||0)/1000)}${p.variants?' · '+p.variants.length+' '+t('variantes'):''}${p.packItems?' · '+t('pack'):''}</div></div></div></td><td class="xs">${p.cats.slice(0,3).map(c=>esc(catName(CATS.find(x=>x.id===c)))).join(', ')}${p.cats.length>3?' +'+(p.cats.length-3):''}</td><td class="r num">${p.price? dzd(p.price): t('sur devis')}</td>${sc?`<td class="r num">${p.cost?dzd(p.cost):'—'}</td><td class="r num">${p.price? `<b class="up">${dzd(m)}</b><div class="xs muted">${fmtPct(pct(m,p.price))}</div>`:'—'}</td>`:''}<td class="r num ${s.available<=p.threshold?'down':''}"><b>${s.available}</b></td><td><span class="badge ${p.status==='actif'?'green':p.status==='rupture'?'red':p.status==='devis'?'amber':''}">${t(p.status)}</span></td>${canEdit?`<td><div class="row" style="gap:2px;flex-wrap:nowrap"><button class="btn icon sm ghost" data-a="prodEdit" data-id="${p.id}" aria-label="${t('Modifier')}">${ic('edit','sm')}</button><button class="btn icon sm ghost" data-a="prodDup" data-id="${p.id}" aria-label="${t('Dupliquer')}">${ic('copy','sm')}</button><button class="btn icon sm ghost" data-a="prodArch" data-id="${p.id}" aria-label="${t('Archiver')}">${ic('archive','sm')}</button></div></td>`:''}</tr>`; }).join('')}
    </tbody></table></div>`;
  if(u.tab==='cats') inner = `<div class="card-b small muted">${t('Recommandation : fusionner « PACK PROMO » et « Packs promo », corriger l\'orthographe (Sushi, Pâtisserie, Sandwich) avec redirection des anciennes URL.')}</div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Ordre')}</th><th>${t('Nom FR')}</th><th>${t('Nom AR')}</th><th>Slug</th><th class="r">${t('Produits')}</th><th>${t('Parent')}</th></tr></thead><tbody>${CATS.map(c=>`<tr><td class="num">${c.order}</td><td><b>${esc(c.fr)}</b>${['pack-promo','packs-promo'].includes(c.id)?` <span class="badge amber">${t('à fusionner')}</span>`:''}${['boite-suchi','boite-patisseri','boite-sandwiche'].includes(c.id)?` <span class="badge blue">${t('orthographe')}</span>`:''}</td><td dir="rtl">${esc(c.ar)}</td><td class="small muted">${c.id}</td><td class="r num">${c.n}</td><td class="muted">—</td></tr>`).join('')}</tbody></table></div>`;
  if(u.tab==='packs') inner = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Pack')}</th><th>${t('Composition')}</th><th class="r">${t('Prix')}</th>${sc?`<th class="r">${t('Coût composants')}</th>`:''}<th class="r">${t('Stock possible')}</th></tr></thead><tbody>${PRODUCTS.filter(p=>p.packItems).map(p=>`<tr><td><b>${esc(p.name)}</b></td><td class="small">${p.packItems.map(c=>c.q+' × '+esc(PBY[c.pid].name)).join('<br>')}</td><td class="r num">${dzd(p.price)}</td>${sc?`<td class="r num">${dzd(p.packItems.reduce((s,c)=>s+PBY[c.pid].cost*c.q,0))}</td>`:''}<td class="r num">${Math.min(...p.packItems.map(c=>Math.floor(stockInfo(c.pid).available/c.q)))}</td></tr>`).join('')}</tbody></table></div><div class="card-b small muted">${t('La vente d\'un pack décrémente le stock de chaque composant.')}</div>`;
  if(u.tab==='var') inner = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Produit')}</th><th>${t('Variante')}</th><th class="r">${t('Prix')}</th>${sc?`<th class="r">${t('Prix d\'achat')}</th>`:''}<th class="r">${t('Stock')}</th></tr></thead><tbody>${PRODUCTS.filter(p=>p.variants).flatMap(p=>p.variants.map(v=>`<tr><td><b>${esc(p.name)}</b></td><td>${v.label}</td><td class="r num">${dzd(v.price)}</td>${sc?`<td class="r num">${dzd(v.cost)}</td>`:''}<td class="r num">${v.stock}</td></tr>`)).join('')}</tbody></table></div>`;
  const actions = canEdit? `<button class="btn" data-a="exportProducts">${ic('download','sm')} ${t('Export Excel')}</button><button class="btn" data-a="importProducts">${ic('upload','sm')} ${t('Import Excel')}</button><button class="btn primary" data-a="prodEdit" data-id="0">${ic('plus','sm')} ${t('Ajouter un produit')}</button>` : '';
  const note = !sc? `<div class="lock-note">${ic('lock','sm')} ${t('Prix d\'achat et marges masqués pour votre rôle.')}</div>`:'';
  return erpShell('produits', t('Produits et catégories'), t('91 produits · 17 catégories repris de packlik.shop'), note + card('', tabs+inner), actions);
}

/* ---------- Stock ---------- */
S.ui.stock = {tab:'state', q:'', only:''};
function viewStock(){
  const u=S.ui.stock, sc=seesCost(); const canAdj = ['admin','gerant'].includes(S.role);
  const rows = PRODUCTS.filter(p=>!p.packItems && p.status!=='devis').map(p=>({p, s:stockInfo(p.id)}));
  const valCost = rows.reduce((x,r)=>x+r.s.physical*r.p.cost,0), valSale = rows.reduce((x,r)=>x+r.s.physical*r.p.price,0);
  const dormant = PRODUCTS.filter(p=>p.price && Date.now()-p.lastSale>30*DAY);
  let list = rows; if(u.q){ const q=u.q.toLowerCase(); list=list.filter(r=>r.p.name.toLowerCase().includes(q)); } if(u.only==='low') list=list.filter(r=>r.s.available<=r.p.threshold); if(u.only==='dormant') list=list.filter(r=>dormant.includes(r.p));
  const tabs = `<div class="tabs">${[['state','État du stock'],['moves','Mouvements'],['inv','Inventaire']].map(([k,l])=>`<button class="${u.tab===k?'on':''}" data-a="stockTab" data-v="${k}">${t(l)}</button>`).join('')}</div>`;
  let inner;
  if(u.tab==='state') inner = `<div class="filters-bar"><input class="input s" placeholder="${t('Rechercher un produit…')}" value="${esc(u.q)}" data-in="stockQ" aria-label="${t('Rechercher')}"><div class="seg">${[['','Tous'],['low','Stock bas / rupture'],['dormant','Dormants (30 j)']].map(([k,l])=>`<button class="${u.only===k?'on':''}" data-a="stockOnly" data-v="${k}">${t(l)}</button>`).join('')}</div></div>
    <div class="tbl-wrap" style="max-height:620px"><table class="tbl"><thead><tr><th>${t('Produit')}</th><th class="r">${t('Physique')}</th><th class="r">${t('Réservé')}</th><th class="r">${t('Chez DHD')}</th><th class="r">${t('Disponible')}</th><th class="r">${t('Seuil')}</th>${sc?`<th class="r">${t('Valeur (achat)')}</th>`:''}<th>${t('État')}</th>${canAdj?'<th></th>':''}</tr></thead><tbody>
    ${list.map(({p,s})=>`<tr><td><b class="small">${esc(p.name)}</b><div class="xs muted">${p.sku}${dormant.includes(p)?' · <span class="badge">'+t('dormant')+'</span>':''}</div></td><td class="r num">${s.physical}</td><td class="r num">${s.reserved||'—'}</td><td class="r num">${s.atDhd||'—'}</td><td class="r num"><b class="${s.available<=p.threshold?'down':''}">${s.available}</b></td><td class="r num muted">${p.threshold}</td>${sc?`<td class="r num">${dzd(s.physical*p.cost)}</td>`:''}<td>${s.available<=0?`<span class="badge red">${t('Rupture')}</span>`: s.available<=p.threshold?`<span class="badge amber">${t('Stock bas')}</span>`:`<span class="badge green">OK</span>`}</td>${canAdj?`<td><button class="btn sm ghost" data-a="stockAdj" data-id="${p.id}">${t('Ajuster')}</button></td>`:''}</tr>`).join('')}
    </tbody></table></div>`;
  if(u.tab==='moves') inner = `<div class="tbl-wrap" style="max-height:620px"><table class="tbl"><thead><tr><th>${t('Date')}</th><th>${t('Produit')}</th><th>${t('Type')}</th><th class="r">${t('Quantité')}</th><th>${t('Référence')}</th><th>${t('Motif')}</th><th>${t('Auteur')}</th></tr></thead><tbody>${STOCK_MOVES.slice(0,120).map(m=>`<tr><td class="small">${fDT(m.at)}</td><td class="small"><b>${esc(PBY[m.pid].name)}</b></td><td><span class="badge ${m.type==='achat'||m.type==='retour'?'green':m.type==='casse'?'red':m.type==='vente'?'blue':m.type==='expédition'?'violet':''}">${t(m.type)}</span></td><td class="r num ${m.q<0?'down':'up'}">${m.q>0?'+':''}${m.q}</td><td class="small">${m.ref}</td><td class="small muted">${esc(t(m.motif))}</td><td class="small">${esc(m.who)}</td></tr>`).join('')}</tbody></table></div>`;
  if(u.tab==='inv'){ S.ui.inv = S.ui.inv || {}; inner = `<div class="card-b small muted">${t('Saisissez le comptage physique. Les écarts sont calculés et l\'inventaire est validé par l\'Admin.')}</div><div class="tbl-wrap" style="max-height:560px"><table class="tbl"><thead><tr><th>${t('Produit')}</th><th class="r">${t('Théorique')}</th><th class="r">${t('Compté')}</th><th class="r">${t('Écart')}</th></tr></thead><tbody>${rows.slice(0,40).map(({p,s})=>{ const c=S.ui.inv[p.id]; const d = c===undefined||c===''? null : +c - s.physical; return `<tr><td class="small"><b>${esc(p.name)}</b></td><td class="r num">${s.physical}</td><td class="r"><input class="input" style="width:90px;height:30px;text-align:end" type="number" value="${c??''}" data-ch="invCount" data-id="${p.id}" aria-label="${t('Compté')} ${esc(p.name)}"></td><td class="r num ${d? (d<0?'down':'up'):''}">${d===null?'—':(d>0?'+':'')+d}</td></tr>`; }).join('')}</tbody></table></div><div class="card-b row" style="justify-content:flex-end"><button class="btn" data-a="invReset">${t('Effacer')}</button><button class="btn primary" data-a="invValidate" ${isAdmin()?'':'disabled title="Validation Admin"'}>${ic('check','sm')} ${t('Valider l\'inventaire')}${isAdmin()?'':' ('+t('Admin')+')'}</button></div>`; }
  const body = `<div class="kpis">${sc?kpi(t('Valeur du stock (prix d\'achat)'), dzd(valCost)):''}${kpi(t('Valeur du stock (prix de vente)'), dzd(valSale))}${kpi(t('Stock bas / rupture'), `<span class="down">${lowStock().length}</span>`)}${kpi(t('Produits dormants'), dormant.length, t('aucune vente depuis 30 jours'))}${kpi(t('Unités réservées'), rows.reduce((x,r)=>x+r.s.reserved,0), t('commandes confirmées non expédiées'))}${kpi(t('Unités chez DHD'), rows.reduce((x,r)=>x+r.s.atDhd,0))}</div>${card('', tabs+inner)}`;
  return erpShell('stock', t('Gestion de stock'), t('Disponible = physique − réservé'), body);
}

/* ---------- Fournisseurs ---------- */
S.ui.sup = {tab:'due'};
function supOrderRows(list, opts){ opts=opts||{};
  return `<div class="tbl-wrap" style="max-height:${opts.h||520}px"><table class="tbl"><thead><tr>${opts.check?`<th><input type="checkbox" checked data-ch="supAll" aria-label="${t('Tout sélectionner')}"></th>`:''}<th>${t('Commande')}</th><th>${t('Livrée le')}</th><th>${t('Payée par DHD le')}</th><th>${t('Produits (quantité × prix fournisseur)')}</th><th class="r">${t('Montant fournisseur')}</th><th>${t('État')}</th></tr></thead><tbody>
  ${list.length? list.map(o=>{ const st=supState(o); return `<tr>${opts.check?`<td><input type="checkbox" class="supChk" value="${o.id}" checked data-ch="supChk" aria-label="${o.ref}"></td>`:''}<td><b>${o.ref}</b></td><td class="small">${o.times.delivered?fDate(o.times.delivered):'—'}</td><td class="small">${o.times.paid?fDate(o.times.paid):'—'}</td><td class="small">${o.items.map(i=>`${i.q} × ${esc(PBY[i.pid].name)} <span class="muted">@ ${dzd(i.cost)}</span>`).join('<br>')}</td><td class="r num"><b>${dzd(supShare(o))}</b></td><td><span class="badge ${SUP_STATE[st][1]}">${t(SUP_STATE[st][0])}</span>${o.supplierPaymentId?`<div class="xs muted">${o.supplierPaymentId}</div>`:''}</td></tr>`; }).join('') : emptyRow(opts.check?7:6,'Aucune commande','check')}
  </tbody></table></div>`;
}
function supPaymentsTable(isSupplier){
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Paiement')}</th><th>${t('Date')}</th><th>${t('Mode')}</th><th class="r">${t('Commandes')}</th><th class="r">${t('Montant')}</th><th>${t('Réception confirmée')}</th><th></th></tr></thead><tbody>${SUP_PAYMENTS.slice().sort((a,b)=>b.at-a.at).map(p=>`<tr><td><b>${p.id}</b></td><td class="small">${fDT(p.at)}</td><td class="small">${t(p.mode)}</td><td class="r num">${p.orderIds.length}</td><td class="r num"><b>${dzd(p.amount)}</b></td><td>${p.confirmedAt?`<span class="badge green">${ic('check','sm')} ${fDate(p.confirmedAt)}</span>`: isSupplier?`<button class="btn sm green" data-a="supConfirm" data-id="${p.id}">${t('Confirmer la réception')}</button>`:`<span class="badge amber">${t('En attente du fournisseur')}</span>`}</td><td><button class="btn sm" data-a="supPayView" data-id="${p.id}">${ic('eye','sm')} ${t('Détail')}</button></td></tr>`).join('') || emptyRow(7,'Aucun paiement')}</tbody></table></div>`;
}
function supPayDetail(id){
  const p = SUP_PAYMENTS.find(x=>x.id===id);
  return modalTpl(t('Paiement fournisseur')+' '+p.id, `<div class="row wrap between" style="margin-bottom:10px"><span class="small">${fDT(p.at)} · ${t(p.mode)} · ${esc(p.by||'')} · ${ic('file','sm')} ${esc(p.proof||'')}</span><b style="font-size:18px" class="num">${dzd(p.amount)}</b></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Commande')}</th><th>${t('Livrée le')}</th><th>${t('Payée par DHD le')}</th><th>${t('Produit')}</th><th class="r">${t('Qté')}</th><th class="r">${t('Prix fournisseur')}</th><th class="r">${t('Montant')}</th></tr></thead><tbody>
    ${p.lines.map(l=>l.items.map((it,k)=>`<tr><td>${k?'':'<b>'+l.ref+'</b>'}</td><td class="small">${k?'':fDate(l.deliveredAt)}</td><td class="small">${k?'':fDate(l.dhdPaidAt)}</td><td class="small">${esc(PBY[it.pid].name)}</td><td class="r num">${it.q}</td><td class="r num">${dzd(it.cost)}</td><td class="r num">${dzd(it.cost*it.q)}</td></tr>`).join('')+`<tr><td colspan="6" class="r small muted">${t('Sous-total')} ${l.ref}</td><td class="r num"><b>${dzd(l.amount)}</b></td></tr>`).join('')}
    <tr><td colspan="6" class="r"><b>${t('Total payé')}</b></td><td class="r num"><b>${dzd(p.amount)}</b></td></tr></tbody></table></div>`,
    `<button class="btn" data-a="closeModal">${t('Fermer')}</button><button class="btn" data-a="supPayCsv" data-id="${p.id}">${ic('download','sm')} Excel</button><button class="btn primary" data-a="printPage">${ic('print','sm')} PDF</button>`, true);
}
function viewSuppliers(){
  const s = SUPPLIERS[0], b = supplierBalance(), dues = supplierDues(), sc = seesCost(); const u=S.ui.sup;
  if(!sc) return erpShell('fournisseurs', t('Fournisseurs'), '', `<div class="lock-note">${ic('lock','sm')} ${t('Montants visibles par l\'Admin uniquement.')}</div>`);
  const lists = {due:ORDERS.filter(o=>o.status==='paid'), dhd:ORDERS.filter(o=>o.status==='delivered'), road:ORDERS.filter(o=>supState(o)==='road'), settled:ORDERS.filter(o=>o.status==='closed').sort((a,b)=>b.times.closed-a.times.closed)};
  const tabs = [['due','Pending — à régler',b.due],['dhd','En attente de paiement DHD',b.dhd],['road','En cours de livraison',b.road],['settled','Payé (validé)',null],['payments','Historique des paiements',null]];
  const body = `
    <div class="kpis">${kpi(t('Pending — à régler'), dzd(b.due), lists.due.length+' '+t('commandes payées par DHD'), 'accent')}${kpi(t('En attente de paiement DHD'), dzd(b.dhd), lists.dhd.length+' '+t('commandes livrées, argent pas encore reçu'))}${kpi(t('En cours de livraison'), dzd(b.road), lists.road.length+' '+t('colis chez DHD'))}${kpi(t('Total déjà payé'), dzd(b.paid), SUP_PAYMENTS.length+' '+t('paiements'))}${kpi(t('Prochaine échéance'), dues[0]? fDate(dues[0].due):'—', t('délai')+' J+'+SETTINGS.supplierTerms+' '+t('après paiement DHD'))}</div>
    <div class="g12">
      ${card(t('Fiche fournisseur'), `<div class="card-b col" style="gap:8px"><div class="row"><span class="avatar">${ic('factory','sm')}</span><div><b>${esc(s.name)}</b><div class="small muted">${esc(s.contact)}</div></div></div><div class="small row">${ic('phone','sm')} <span dir="ltr">${s.phone}</span></div><div class="small row">${ic('mail','sm')} ${s.email}</div><div class="small row">${ic('pin','sm')} ${esc(s.address)}</div><div class="small"><b>${t('Conditions')} :</b> ${t('paiement par commande, sous')} ${s.terms}–${s.termsMax} ${t('jours après le versement DHD')}</div><div class="small row">${ic('lock','sm')} ${t('Accès portail actif')} : ${esc((UBY[s.userId]||{}).email||'—')}</div><label class="check small"><input type="checkbox" ${SETTINGS.supplierSales?'checked':''} data-ch="supSales"> ${t('Partager « Ventes de mes produits » avec le fournisseur')}</label></div>`)}
      ${card(t('Comment ça marche'), `<div class="card-b small" style="line-height:1.8">1. ${t('La commande est livrée : sa part fournisseur passe en « En attente de paiement DHD ».')}<br>2. ${t('DHD verse l\'argent : la part fournisseur passe en « Pending — à régler » chez le fournisseur.')}<br>3. ${t('Vous payez : vous cochez les commandes réglées et validez. Elles passent en « Payé » (commande clôturée) et le fournisseur reçoit le détail complet.')}</div>`, `<button class="btn primary" data-a="payNew" ${lists.due.length?'':'disabled'}>${ic('cash','sm')} ${t('Payer le fournisseur')}</button>`)}
    </div>
    ${card('', `<div class="tabs">${tabs.map(([k,l,v])=>`<button class="${u.tab===k?'on':''}" data-a="supTab" data-v="${k}">${t(l)}${v!==null?` <span class="c">${dzd(v)}</span>`:''}</button>`).join('')}</div>${u.tab==='payments'? supPaymentsTable(false) : supOrderRows(lists[u.tab]||[])}`)}`;
  return erpShell('fournisseurs', t('Fournisseurs'), t('Le fournisseur est payé commande par commande, après le versement DHD'), body);
}
/* ---------- Clients ---------- */
S.ui.cli = {seg:'', q:'', sort:'last'};
function viewCustomers(){
  const u=S.ui.cli;
  let rows = CUSTOMERS.map(c=>({c, s:custStats(c.id)}));
  if(S.role==='agent') rows = rows.filter(r=>ORDERS.some(o=>o.customerId===r.c.id && o.agentId===S.agentId));
  const segs = ['nouveau','fidèle','professionnel','à risque','liste noire'];
  const counts = Object.fromEntries(segs.map(s=>[s, rows.filter(r=>r.s.seg===s).length]));
  if(u.seg) rows = rows.filter(r=>r.s.seg===u.seg);
  if(u.q){ const q=u.q.toLowerCase(); rows=rows.filter(r=>r.c.name.toLowerCase().includes(q)||r.c.phone.replace(/\s/g,'').includes(q.replace(/\s/g,''))||(r.c.business||'').toLowerCase().includes(q)); }
  const sorters = {last:(a,b)=>b.s.last-a.s.last, created:(a,b)=>b.s.created-a.s.created, spent:(a,b)=>b.s.spent-a.s.spent, rate:(a,b)=>a.s.rate-b.s.rate};
  rows.sort(sorters[u.sort]);
  const body = card('', `<div class="tabs">${[['','Tous',CUSTOMERS.length],...segs.map(s=>[s, s.charAt(0).toUpperCase()+s.slice(1), counts[s]])].map(([k,l,n])=>`<button class="${u.seg===k?'on':''} ${k==='liste noire'?'danger':''}" data-a="cliSeg" data-v="${k}">${t(l)} <span class="c">${n}</span></button>`).join('')}</div>
    <div class="filters-bar"><input class="input s" placeholder="${t('Nom, téléphone, commerce…')}" value="${esc(u.q)}" data-in="cliQ" aria-label="${t('Rechercher')}"><label class="row small">${t('Trier')} <select class="select" data-ch="cliSort">${[['last','Dernière commande'],['created','Nombre de commandes'],['spent','Total dépensé'],['rate','Taux de livraison (bas)']].map(([k,l])=>`<option value="${k}" ${u.sort===k?'selected':''}>${t(l)}</option>`).join('')}</select></label></div>
    <div class="tbl-wrap" style="max-height:640px"><table class="tbl"><thead><tr><th>${t('Client')}</th><th>${t('Téléphone')}</th><th>${t('Wilaya')}</th><th class="r">${t('Commandes créées')}</th><th class="r">${t('Livrées')}</th><th class="r">${t('Retournées')}</th><th class="r">${t('Taux de livraison')}</th><th class="r">${t('Total dépensé')}</th><th>${t('Dernière commande')}</th><th>${t('Segment')}</th></tr></thead><tbody>
    ${rows.map(({c,s})=>`<tr class="clickable" data-a="openCustomer" data-id="${c.id}"><td><b>${esc(c.name)}</b>${c.business?`<div class="xs muted">${esc(c.business)}</div>`:''}</td><td dir="ltr" class="num small">${S.role==='agent'? esc(c.phone) : esc(c.phone)}</td><td>${esc(wName(c.wilaya))}</td><td class="r num"><b>${s.created}</b></td><td class="r num up">${s.delivered}</td><td class="r num ${s.returned?'down':''}">${s.returned}</td><td class="r num">${fmtPct(s.rate)}</td><td class="r num">${dzd(s.spent)}</td><td class="small">${fDate(s.last)}</td><td><span class="badge ${SEG_C[s.seg]}">${t(s.seg)}</span></td></tr>`).join('') || emptyRow(10,'Aucun client','users')}
    </tbody></table></div>`);
  const actions = S.role!=='agent'? `<button class="btn" data-a="exportCustomers" data-v="wa">${ic('wa','sm')} ${t('Export WhatsApp')}</button><button class="btn" data-a="exportCustomers" data-v="meta">${ic('download','sm')} ${t('Audience Meta')}</button>` : '';
  return erpShell('clients', t('Clients'), t('Fiche créée automatiquement à la première commande, identifiée par le téléphone'), body, actions);
}
function customerModal(id){
  const c=CBY[id], s=custStats(id), os=custOrders(id);
  return modalTpl(esc(c.name)+(c.business?' — '+esc(c.business):''), `
    <div class="row wrap" style="margin-bottom:12px"><span class="badge ${SEG_C[s.seg]}">${t(s.seg)}</span><span class="small" dir="ltr">${esc(c.phone)}</span><span class="small muted">${esc(c.address)}, ${esc(cName(c.commune))}, ${esc(wName(c.wilaya))}</span></div>
    <div class="kpis" style="grid-template-columns:repeat(5,1fr)">${kpi(t('Créées'),s.created)}${kpi(t('Livrées'),s.delivered)}${kpi(t('Retournées'),s.returned)}${kpi(t('Taux'),fmtPct(s.rate))}${kpi(t('Dépensé'),dzd(s.spent))}</div>
    <h4 style="margin:16px 0 8px">${t('Historique complet')}</h4>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('N°')}</th><th>${t('Date')}</th><th>${t('Produits')}</th><th class="r">${t('Montant')}</th><th>${t('Statut')}</th><th class="r">${t('Appels')}</th></tr></thead><tbody>${os.map(o=>`<tr class="clickable" data-a="openOrder" data-id="${o.id}"><td><b>${o.ref}</b></td><td class="small">${fDate(o.created)}</td><td>${itemsSummary(o.items)}</td><td class="r num">${dzd(orderTotal(o))}</td><td>${stBadge(o)}</td><td class="r num">${o.calls}</td></tr>`).join('')}${c.hist.created? `<tr><td colspan="6" class="small muted">+ ${c.hist.created} ${t('commandes antérieures (historique importé)')}</td></tr>`:''}</tbody></table></div>
    <div class="field" style="margin-top:12px"><label for="cNote">${t('Notes')}</label><textarea class="input" id="cNote">${esc(c.notes)}</textarea></div>`,
    `<button class="btn" data-a="closeModal">${t('Fermer')}</button><button class="btn primary" data-a="saveCustNote" data-id="${id}">${t('Enregistrer')}</button>`, true);
}

/* ============================================================
   ERP : équipe, répartition, finance, comptabilité, statistiques, paramètres, journal
   ============================================================ */
const MODULES = ['Tableau de bord','Commandes à confirmer','Suivi des commandes / livraisons','Achats','Produits et catégories','Gestion de stock','Fournisseurs','Clients','Équipe et accès','Répartition des agents','Finance et comptabilité','Statistiques','Paramètres du site','Paramètres ERP','Journal d\'activité'];
const MATRIX = {
  admin:   ['Total','Total','Total','Total','Total','Total','Total','Total','Total','Total','Total','Total','Total','Total','Total'],
  gerant:  ['Opérations','Lecture','Total','Total','Modif. (sans prix d\'achat)','Total','Lecture','Lecture','—','—','Lecture (encaissements DHD)','Opérations','—','—','—'],
  manager: ['Centre d\'appel','Total','Modif.','—','Lecture','Lecture','—','Total','Lecture (ses agents)','Total','—','Centre d\'appel','—','—','Lecture (ses agents)'],
  agent:   ['Siennes','Siennes (assignées)','Siennes','—','Lecture (prix de vente)','Lecture (dispo)','—','Siennes','—','—','Ses commissions','Siennes','—','—','—'],
  fournisseur:['Siennes','—','—','Siennes (lecture + validation)','Lecture (ses produits)','—','Sa fiche','—','—','—','Ses dettes et paiements','—','—','—','—']
};
function viewTeam(){
  const canEdit = isAdmin();
  const staff = USERS.filter(u=>u.role!=='fournisseur' && (S.role!=='manager' || u.role==='agent' || u.id===3));
  const body = `
    ${card(t('Membres'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Nom')}</th><th>${t('Rôle')}</th><th>${t('Téléphone')}</th><th>${t('E-mail')}</th><th>${t('Équipe')}</th><th>${t('Horaires')}</th><th>${t('Statut')}</th>${canEdit?`<th>${t('Rémunération')}</th>`:''}<th></th></tr></thead><tbody>
    ${staff.map(u=>`<tr><td>${agentCell(u.id)}</td><td><span class="badge ${u.role==='admin'?'dark':u.role==='agent'?'kraft':'blue'}">${t(ROLE_LABEL[u.role])}</span></td><td dir="ltr" class="small">${u.phone}</td><td class="small">${u.email}</td><td class="small">${u.teamId? esc((TEAMS[0]||{}).name||''):'—'}</td><td class="small">${u.hours||'08:00–17:00'}</td><td>${u.role==='agent'? `<div class="seg"><button class="${u.online&&!u.pause?'on':''}" data-a="agentState" data-id="${u.id}" data-v="online">${t('En ligne')}</button><button class="${u.pause?'on':''}" data-a="agentState" data-id="${u.id}" data-v="pause">${t('Pause')}</button><button class="${!u.online&&!u.pause?'on':''}" data-a="agentState" data-id="${u.id}" data-v="off">${t('Hors ligne')}</button></div>` : `<span class="badge ${u.active?'green':''}">${u.active?t('Actif'):t('Inactif')}</span>`}</td>${canEdit?`<td class="small">${u.role==='agent'? dzd(u.fixed)+' + '+u.perDelivery+' / '+t('livrée')+' + '+u.upsellPct+' % upsell' : '—'}</td>`:''}<td>${canEdit?`<button class="btn sm ghost" data-a="memberEdit" data-id="${u.id}">${ic('edit','sm')}</button>`:''}</td></tr>`).join('')}
    </tbody></table></div>`, canEdit? `<button class="btn sm" data-a="teamNew">${ic('users','sm')} ${t('Créer une équipe')}</button><button class="btn sm primary" data-a="memberEdit" data-id="0">${ic('plus','sm')} ${t('Ajouter un membre')}</button>`:'')}
    ${card(t('Équipes'), `<div class="card-b">${TEAMS.map(tm=>`<div class="row between"><div><b>${esc(tm.name)}</b><div class="small muted">${t('Manager')} : ${esc((UBY[tm.managerId]||{}).name||'—')}</div></div><div class="row">${AGENTS.filter(a=>a.teamId===tm.id).map(a=>`<span class="avatar sm" title="${esc(a.name)}">${initials(a.name)}</span>`).join('')}</div></div>`).join('<hr style="border:0;border-top:1px solid var(--line2)">')}</div>`)}
    ${card(t('Matrice des accès'), `<div class="card-b small muted" style="padding-bottom:0">${t('Total = lire, créer, modifier, supprimer · Modif. = lire et modifier · Lecture = consulter · Siennes = ses propres données · — = aucun accès. Permissions fines case par case ; l\'Admin peut créer un rôle personnalisé.')}</div><div class="tbl-wrap"><table class="tbl matrix"><thead><tr><th>${t('Module')}</th>${Object.keys(MATRIX).map(r=>`<th>${t(ROLE_LABEL[r])}</th>`).join('')}</tr></thead><tbody>${MODULES.map((m,i)=>`<tr><td><b class="small">${t(m)}</b></td>${Object.keys(MATRIX).map(r=>{ const v=MATRIX[r][i]; return `<td class="small"><label class="check" style="justify-content:center"><input type="checkbox" ${v!=='—'?'checked':''} ${canEdit&&r!=='admin'?'':'disabled'} data-ch="perm" data-r="${r}" data-i="${i}" aria-label="${esc(t(m))} — ${esc(t(ROLE_LABEL[r]))}"><span class="${v==='—'?'muted':''}">${t(v)}</span></label></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`, canEdit?`<button class="btn sm" data-a="roleNew">${ic('plus','sm')} ${t('Rôle personnalisé')}</button>`:'')}
    ${card(t('Règles de sécurité'), `<div class="card-b"><ul class="small" style="margin:0;padding-inline-start:18px;line-height:1.9"><li>${t('Prix d\'achat et bénéfices visibles uniquement par l\'Admin.')}</li><li>${t('Un agent ne voit jamais les commandes d\'un autre agent, ni le numéro complet d\'un client hors de ses commandes.')}</li><li>${t('Remise : agent jusqu\'à')} ${SETTINGS.discountAgent} %, ${t('Manager jusqu\'à')} ${SETTINGS.discountManager} %, ${t('au-delà validation Admin.')}</li><li>${t('Annulation d\'une commande confirmée ou expédiée : Manager ou Gérant, motif obligatoire.')}</li><li>${t('Connexion téléphone ou e-mail + mot de passe ; 2FA pour l\'Admin ; déconnexion après 30 min d\'inactivité.')}</li></ul></div>`)}`;
  return erpShell('equipe', S.role==='manager'? t('Mon équipe') : t('Équipe et accès'), '', body);
}

/* ---------- Répartition ---------- */
const MODES = [['rr','Tour de rôle (round robin)','Commande 1 → agent A, commande 2 → agent B…','Équipe homogène, démarrage'],['least','Charge la plus faible','L\'agent qui a le moins de commandes en attente reçoit la suivante','Volume irrégulier'],['weighted','Pondéré par performance','Les agents au meilleur taux de livraison reçoivent plus','Équipe mature, objectif de rentabilité'],['rule','Par règle','Par wilaya, langue, source ou montant','Spécialisation'],['manual','Manuel','Le Manager attribue lui-même','Cas particuliers']];
function viewAssign(){
  const can = ['admin','manager'].includes(S.role);
  const sim = S.ui.sim;
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const body = `
    <div class="card card-b row wrap between"><div class="row"><span class="badge ${SETTINGS.autoAssign?'green':'amber'}">${SETTINGS.autoAssign? t('Attribution automatique active') : t('Attribution automatique suspendue')}</span><span class="small muted">${t('Chaque nouvelle commande est attribuée en moins de 5 secondes à un agent en ligne.')}</span></div>${can?`<button class="btn ${SETTINGS.autoAssign?'':'green'}" data-a="toggleAuto">${SETTINGS.autoAssign? ic('pause','sm')+' '+t('Suspendre') : ic('zap','sm')+' '+t('Activer')}</button>`:''}</div>
    <div class="g3" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${MODES.map(([k,l,d,w])=>`<label class="card card-b col" style="gap:6px;cursor:pointer;${SETTINGS.assignMode===k?'border-color:var(--kraft-d);box-shadow:0 0 0 3px rgba(184,135,90,.18)':''}"><span class="row"><input type="radio" name="mode" value="${k}" ${SETTINGS.assignMode===k?'checked':''} data-ch="assignMode" ${can?'':'disabled'}><b>${t(l)}</b></span><span class="small">${t(d)}</span><span class="xs muted">${t('Quand')} : ${t(w)}</span></label>`).join('')}</div>
    <div class="g2">
      ${card(t('Agents, poids et quotas'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Agent')}</th><th>${t('Statut')}</th><th class="r">${t('En attente')}</th><th class="r">${t('Taux livraison')}</th><th>${t('Poids %')}</th><th>${t('Quota max')}</th></tr></thead><tbody>${AGENTS.map(a=>{ const p=agentPerf(a); return `<tr><td>${agentCell(a.id)}</td><td>${a.online&&!a.pause?`<span class="badge green">${t('En ligne')}</span>`:a.pause?`<span class="badge amber">${t('En pause')}</span>`:`<span class="badge">${t('Hors ligne')}</span>`}</td><td class="r num">${p.pending} / ${a.quota}</td><td class="r num">${fmtPct(p.delivRate)}</td><td><input class="input" type="number" style="width:70px;height:30px" value="${a.weight}" data-ch="agentWeight" data-id="${a.id}" ${can?'':'disabled'} aria-label="Poids ${esc(a.name)}"></td><td><input class="input" type="number" style="width:70px;height:30px" value="${a.quota}" data-ch="agentQuota" data-id="${a.id}" ${can?'':'disabled'} aria-label="Quota ${esc(a.name)}"></td></tr>`; }).join('')}</tbody></table></div>`)}
      ${card(t('Règles (mode « Par règle »)'), `<div class="card-b col" style="gap:8px">${SETTINGS.rules.map((r,i)=>`<div class="row between sumbox"><span class="small"><b>${t(r.type)}</b> = ${r.type==='wilaya'? esc(wName(+r.value)) : r.type==='montant'? '≥ '+dzd(+r.value) : esc(r.value)} → ${esc(UBY[r.agentId].name)}</span>${can?`<button class="btn icon sm ghost" data-a="ruleDel" data-i="${i}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button>`:''}</div>`).join('')}
        ${can?`<div class="row wrap"><select class="select" id="rType" style="width:auto"><option value="wilaya">${t('Wilaya')}</option><option value="source">${t('Source')}</option><option value="montant">${t('Montant ≥')}</option></select><input class="input" id="rVal" placeholder="16 / WhatsApp / 10000" style="width:150px"><select class="select" id="rAgent" style="width:auto">${AGENTS.map(a=>`<option value="${a.id}">${a.name.split(' ')[0]}</option>`).join('')}</select><button class="btn sm" data-a="ruleAdd">${ic('plus','sm')} ${t('Ajouter')}</button></div>`:''}
        <hr style="border:0;border-top:1px solid var(--line2);width:100%">
        <div class="grid2"><div class="field"><label for="qMax">${t('Quota par défaut')}</label><input class="input" id="qMax" type="number" value="${SETTINGS.quota}" data-ch="setQuota" ${can?'':'disabled'}></div><div class="field"><label for="rAfter">${t('Réattribution après (min)')}</label><input class="input" id="rAfter" type="number" value="${SETTINGS.reassignAfter}" data-ch="setReassign" ${can?'':'disabled'}></div></div>
        <ul class="small muted" style="margin:0;padding-inline-start:18px;line-height:1.7"><li>${t('Seuls les agents « en ligne » et dans leurs horaires reçoivent des commandes.')}</li><li>${t('Client connu : sa commande va à l\'agent qui l\'a déjà servi, s\'il est disponible.')}</li><li>${t('Agent en pause : ses commandes non traitées retournent dans la file commune.')}</li><li>${t('Les tentatives échouées reviennent à l\'agent qui a confirmé.')}</li></ul>
      </div>`)}
    </div>
    ${card(t('Prévisualisation de la répartition du jour'), `<div class="card-b g2">
      <div>${barsList(AGENTS.map(a=>({l:esc(a.name), v: ORDERS.filter(o=>o.agentId===a.id && o.created>=todayStart.getTime()).length + (sim? sim[a.id]||0 : 0), extra: sim&&sim[a.id]? '(+'+sim[a.id]+' '+t('simulées')+')':'', c: a.online&&!a.pause? '#FD6400':'#C9C2B6'})))}</div>
      <div class="col"><p class="small muted" style="margin:0">${t('Testez le mode choisi : simulez 20 nouvelles commandes et voyez qui les recevrait.')}</p><button class="btn kraft" data-a="simAssign">${ic('shuffle','sm')} ${t('Simuler 20 commandes')}</button>${sim?`<button class="btn" data-a="simReset">${t('Effacer la simulation')}</button>`:''}</div>
    </div>`)}`;
  return erpShell('repartition', t('Répartition des agents'), '', body);
}

/* ---------- Finance ---------- */
S.ui.fin = {order:null};
function viewFinance(){
  const paid = ORDERS.filter(o=>CONFIRMED_ST.includes(o.status));
  const sel = ORDERS.find(o=>o.id===S.ui.fin.order) || ORDERS.filter(o=>o.status==='paid').sort((a,b)=>finOf(b).net-finOf(a).net)[0] || paid[0];
  const sb = supplierBalance(), dues = supplierDues();
  const adv = advanceable(); const openAdv = ADVANCES.filter(a=>!a.repaidAt);
  const adSpend30 = AD_SPEND.reduce((s,a)=>s+a.usd,0)*SETTINGS.usdRate;
  const profit30 = ORDERS.filter(o=>DELIVERED_ST.includes(o.status)).reduce((s,o)=>s+finOf(o).net,0) + ORDERS.filter(o=>DELIVERED_ST.includes(o.status)).length*SETTINGS.adCostPerDelivered;
  const selfFund = Math.min(100, pct(profit30, adSpend30));
  // projection 30 j
  const days = 30; const labels=[], inflow=[], outSup=[], outAd=[], bal=[]; let b = Object.values(CBX).reduce((s,x)=>s+x.balance,0);
  const atDhd = ORDERS.filter(o=>o.status==='delivered'), onRoad = ORDERS.filter(o=>['sent','picked','transit','outfor','failed'].includes(o.status)); const rate=deliveryRate()/100;
  const dailyAd = adSpend30/30;
  for(let d=0; d<days; d++){
    const ds = Date.now()+d*DAY, de = ds+DAY; labels.push(new Date(ds).getDate()+'/'+(new Date(ds).getMonth()+1));
    let inn = atDhd.filter(o=>{ const e=o.times.delivered+4.9*DAY; return (d===0? e<de : e>=ds && e<de); }).reduce((s,o)=>s+orderTotal(o)-dhdFeeOf(o),0);
    inn += onRoad.filter(o=>{ const e=(o.times.sent||o.created)+6.9*DAY; return (d===0? e<de : e>=ds&&e<de); }).reduce((s,o)=>s+(orderTotal(o)-dhdFeeOf(o))*rate,0);
    inn += d>=5? 4200*(1+(d%3)) : 0; // nouvelles commandes estimées
    const sup = dues.filter(x=> d===0? x.due<de : x.due>=ds && x.due<de).reduce((s,x)=>s+x.rest,0);
    b += inn - sup - dailyAd; inflow.push(Math.round(inn)); outSup.push(Math.round(sup)); outAd.push(Math.round(dailyAd)); bal.push(Math.max(0,Math.round(b)));
  }
  const body = `
    <div class="kpis" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">${CASHBOXES.map((bx,i)=>`<div class="cashbox ${bx.c}"><div class="l">${ic(['factory','target','shield','zap'][i],'sm')} ${t(bx.fr)}</div><div class="v num">${dzd(bx.balance)}</div><div class="xs muted">${[t('100 % du coût d\'achat ; ne sort que pour payer le fournisseur'), t('Remboursement pub de chaque commande + réinvestissement'), SETTINGS.boxes.security+' % '+t('du bénéfice net, plafond')+' '+SETTINGS.boxes.securityCap+' '+t('jours de pub'), SETTINGS.boxes.reinvest+' % '+t('du bénéfice net ; l\'Admin décide')][i]}</div></div>`).join('')}</div>
    <div class="row wrap"><button class="btn" data-a="boxTransfer">${ic('shuffle','sm')} ${t('Mouvement entre caisses')}</button><button class="btn" data-a="withdraw">${ic('cash','sm')} ${t('Retrait / décision réinvestissement')}</button><span class="grow"></span><span class="small muted">${t('Argent chez DHD')} : <b>${dzd(moneyAtDhd())}</b> · ${t('En route')} : <b>${dzd(moneyOnRoad())}</b> · ${t('Dette fournisseur')} : <b>${dzd(sb.rest)}</b></span></div>
    <div class="g2">
      <div class="col" style="gap:16px">
        <div class="card card-b row wrap"><label for="finSel" class="small" style="font-weight:700">${t('Fiche financière de la commande')}</label><select id="finSel" class="select grow" data-ch="finOrder">${paid.map(o=>`<option value="${o.id}" ${sel&&sel.id===o.id?'selected':''}>${o.ref} · ${t(STATUS[o.status].fr)} · ${dzd(orderTotal(o))}</option>`).join('')}</select></div>
        ${sel? financeCascade(sel):''}
      </div>
      <div class="col" style="gap:16px">
        ${card(t('Avance pub sur la réserve fournisseur'), `<div class="card-b col" style="gap:10px">
          <div class="row between"><span class="small muted">${t('Montant avançable maintenant')}</span><b class="num" style="font-size:20px;color:${adv>0?'var(--green)':'var(--red)'}">${dzd(adv)}</b></div>
          <div class="xs muted">= ${t('Réserve')} ${dzd(CBX.reserve.balance)} − ${t('dettes échues sous 3 j')} ${dzd(dues.filter(d=>d.due<=Date.now()+3*DAY).reduce((s,d)=>s+d.rest,0))} − ${t('marge de sécurité')} ${dzd(SETTINGS.safetyMargin)} · ${t('plafond')} ${SETTINGS.advanceCap} % ${t('de la réserve')}</div>
          ${openAdv.map(a=>`<div class="row between sumbox" style="border-color:#E9B8B3;background:#FDF4F3"><div><b style="color:var(--red)">${a.id} · ${dzd(a.amount)}</b><div class="xs muted">${esc(a.note)} · ${t('à rembourser le')} ${fDate(a.due)}</div></div>${isAdmin()?`<button class="btn sm" data-a="advRepay" data-id="${a.id}">${t('Rembourser')}</button>`:''}</div>`).join('')}
          ${ADVANCES.filter(a=>a.repaidAt).map(a=>`<div class="row between small muted"><span>${a.id} · ${dzd(a.amount)} · ${esc(a.note)}</span><span class="badge green">${t('Remboursée')} ${fDate(a.repaidAt)}</span></div>`).join('')}
          <button class="btn kraft" data-a="advNew" ${adv>0?'':'disabled'}>${ic('zap','sm')} ${t('Nouvelle avance pub')}</button>
          ${adv<=0?`<div class="lock-note" style="background:var(--red-l);color:#962F28">${ic('lock','sm')} ${t('Avance bloquée : une échéance fournisseur deviendrait impossible à tenir.')}</div>`:''}
        </div>`)}
        ${card(t('Indicateur « Pub autofinancée »'), `<div class="card-b row" style="gap:16px">${donut([{v:selfFund,c:'#2F7D4F',l:'autofinancée'},{v:100-selfFund,c:'#EFE7DC',l:'avance / apport'}],96)}<div><div style="font-size:26px;font-weight:800" class="num">${fmtPct(selfFund)}</div><div class="small muted">${t('des dépenses Meta (30 j) couvertes par les bénéfices, sans avance ni apport.')}</div><div class="xs muted">${t('Dépense Meta 30 j')} : ${dzd(adSpend30)}</div></div></div>`)}
      </div>
    </div>
    ${card(t('Projection de trésorerie — 30 jours'), `<div class="card-b">${lineChart([{name:t('Entrées DHD prévues'),data:inflow,color:'#2F7D4F',area:true},{name:t('Échéances fournisseur'),data:outSup,color:'#C2453D'},{name:t('Pub prévue'),data:outAd,color:'#2F6690',dash:true}], labels,{label:'projection',h:260,w:1100})}<div class="legend" style="margin-top:6px"><span><i style="background:#2F7D4F"></i>${t('Entrées DHD prévues')}</span><span><i style="background:#C2453D"></i>${t('Échéances fournisseur')}</span><span><i style="background:#2F6690"></i>${t('Pub prévue')}</span></div></div>`)}
    <div class="g2">
      ${card(t('Calendrier des échéances fournisseur (30 j)'), `<div class="tbl-wrap"><table class="tbl"><tbody>${dues.map(d=>`<tr><td>${fDate(d.due)}</td><td>${d.ref}</td><td class="r num"><b>${dzd(d.rest)}</b></td><td><span class="badge ${d.due<Date.now()?'red':d.due-Date.now()<48*HOUR?'amber':'blue'}">${d.due<Date.now()?t('En retard'):t('dans')+' '+Math.ceil((d.due-Date.now())/DAY)+' '+t('j')}</span></td></tr>`).join('') || emptyRow(4,'Aucune échéance')}</tbody></table></div>`)}
      ${card(t('Mouvements des caisses'), `<div class="tbl-wrap" style="max-height:340px"><table class="tbl"><thead><tr><th>${t('Date')}</th><th>${t('Caisse')}</th><th>${t('Type')}</th><th>${t('Réf.')}</th><th class="r">${t('Montant')}</th><th>${t('Auteur')}</th></tr></thead><tbody>${CASH_MOVES.slice(0,60).map(m=>`<tr><td class="small">${fDT(m.at)}</td><td class="small"><b>${t(CBX[m.box].fr)}</b></td><td class="small">${esc(t(m.type))}</td><td class="small">${m.ref}</td><td class="r num ${m.amount<0?'down':'up'}">${m.amount>0?'+':''}${dzd(m.amount)}</td><td class="small muted">${esc(m.who)}</td></tr>`).join('')}</tbody></table></div>`)}
    </div>
    ${card(t('Les 4 principes'), `<div class="card-b g2 small"><div>1. ${t('Une commande enregistrée n\'est pas une commande livrée.')}<br>2. ${t('Un colis livré n\'est pas de l\'argent reçu (DHD paie ~4,9 j après livraison, ~6,9 j après envoi).')}</div><div>3. ${t('L\'argent reçu de DHD n\'est pas du bénéfice.')}<br>4. ${t('La dette fournisseur est réservée avant tout calcul de trésorerie libre.')}</div></div>`)}`;
  return erpShell('finance', t('Finance'), t('Séparation instantanée : part fournisseur, livraison, pub et bénéfice'), body);
}

/* ---------- Comptabilité ---------- */
S.ui.acc = {tab:'journal', locked:false};
function journalEntries(){
  const E = [];
  DHD_PAYMENTS.forEach(p=>{ const os=p.orderIds.map(id=>ORDERS.find(o=>o.id===id)); const brut=os.reduce((s,o)=>s+orderTotal(o),0), fees=os.reduce((s,o)=>s+dhdFeeOf(o),0)+p.gap; E.push({at:p.at, cat:'Ventes', label:'Versement DHD '+p.id+' ('+os.length+' colis)', in:brut, out:0}); E.push({at:p.at, cat:'Frais DHD', label:'Frais retenus '+p.id, in:0, out:fees}); });
  SUP_PAYMENTS.forEach(p=>E.push({at:p.at, cat:'Achats fournisseur', label:'Paiement fournisseur '+p.id+' ('+p.orderIds.length+' commandes, '+p.mode+')', in:0, out:p.amount}));
  const byWeek = {}; AD_SPEND.forEach(a=>{ const k=Math.floor((Date.now()-a.date)/(7*DAY)); byWeek[k]=(byWeek[k]||0)+a.usd; }); Object.entries(byWeek).forEach(([k,usd])=>E.push({at:Date.now()-k*7*DAY-DAY, cat:'Pub Meta', label:'Meta Ads semaine −'+k+' ('+usd.toFixed(2)+' USD × '+SETTINGS.usdRate+')', in:0, out:Math.round(usd*SETTINGS.usdRate)}));
  EXPENSES.forEach(e=>E.push({at:e.at, cat:e.cat, label:e.note, in:0, out:e.amount}));
  ORDERS.filter(o=>DELIVERED_ST.includes(o.status)).forEach(o=>{});
  return E.sort((a,b)=>b.at-a.at);
}
function viewAccounting(){
  const u = S.ui.acc; const E = journalEntries();
  const delivered = ORDERS.filter(o=>DELIVERED_ST.includes(o.status));
  const ca = delivered.reduce((s,o)=>s+orderTotal(o),0), cogs = delivered.reduce((s,o)=>s+linesCost(o.items),0), dhd = delivered.reduce((s,o)=>s+dhdFeeOf(o),0)+ORDERS.filter(o=>['returning','returned'].includes(o.status)).reduce((s,o)=>s+dhdFeeOf(o)*2,0);
  const pub = Math.round(AD_SPEND.reduce((s,a)=>s+a.usd,0)*SETTINGS.usdRate), sal = delivered.length*SETTINGS.commission + 116000, charges = EXPENSES.filter(e=>!/Salaires/.test(e.cat)).reduce((s,e)=>s+e.amount,0);
  const tabs = `<div class="tabs">${[['journal','Journal'],['meta','Dépenses Meta'],['dhd','Rapprochement DHD'],['pl','Compte de résultat'],['renta','Rentabilité'],['tiers','Comptes de tiers']].map(([k,l])=>`<button class="${u.tab===k?'on':''}" data-a="accTab" data-v="${k}">${t(l)}</button>`).join('')}</div>`;
  let inner='';
  if(u.tab==='journal') inner = `<div class="filters-bar"><span class="small muted">${E.length} ${t('écritures')}</span><span class="grow"></span><button class="btn sm" data-a="expNew" ${u.locked?'disabled':''}>${ic('plus','sm')} ${t('Ajouter une dépense')}</button></div><div class="tbl-wrap" style="max-height:560px"><table class="tbl"><thead><tr><th>${t('Date')}</th><th>${t('Catégorie')}</th><th>${t('Libellé')}</th><th class="r">${t('Recette')}</th><th class="r">${t('Dépense')}</th></tr></thead><tbody>${E.map(e=>`<tr><td class="small">${fDate(e.at)}</td><td><span class="badge ${e.in?'green':''}">${t(e.cat)}</span></td><td class="small">${esc(t(e.label))}</td><td class="r num up">${e.in?dzd(e.in):''}</td><td class="r num down">${e.out?dzd(e.out):''}</td></tr>`).join('')}</tbody></table></div>`;
  if(u.tab==='meta') inner = `<div class="filters-bar"><span class="small">${t('Taux de change')} : <input class="input" type="number" style="width:80px;height:30px" value="${SETTINGS.usdRate}" data-ch="usdRate" aria-label="Taux USD/DZD"> DZD / USD</span><span class="grow"></span><button class="btn sm" data-a="metaImport">${ic('upload','sm')} ${t('Importer (fichier ou API)')}</button></div><div class="tbl-wrap" style="max-height:520px"><table class="tbl"><thead><tr><th>${t('Date')}</th><th>${t('Campagne')}</th><th class="r">USD</th><th class="r">DZD</th></tr></thead><tbody>${AD_SPEND.slice().reverse().map(a=>`<tr><td class="small">${fDate(a.date)}</td><td class="small">${esc(a.campaign)}</td><td class="r num">${a.usd.toFixed(2)}</td><td class="r num">${dzd(a.usd*SETTINGS.usdRate)}</td></tr>`).join('')}<tr><td colspan="2"><b>${t('Total')}</b></td><td class="r num"><b>${AD_SPEND.reduce((s,a)=>s+a.usd,0).toFixed(2)}</b></td><td class="r num"><b>${dzd(pub)}</b></td></tr></tbody></table></div><div class="card-b small muted">${t('Coût par commande livrée')} = ${dzd(pub)} ÷ ${delivered.length} = <b>${dzd(pub/Math.max(1,delivered.length))}</b> (${t('paramètre appliqué aux fiches')} : ${dzd(SETTINGS.adCostPerDelivered)})</div>`;
  if(u.tab==='dhd') inner = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Versement')}</th><th>${t('Date')}</th><th>${t('Colis payés')}</th><th class="r">${t('Brut')}</th><th class="r">${t('Frais DHD')}</th><th class="r">${t('Net reçu')}</th><th>${t('Écart')}</th></tr></thead><tbody>${DHD_PAYMENTS.map(p=>{ const os=p.orderIds.map(id=>ORDERS.find(o=>o.id===id)); const brut=os.reduce((s,o)=>s+orderTotal(o),0), fee=os.reduce((s,o)=>s+dhdFeeOf(o),0)+p.gap; return `<tr><td><b>${p.id}</b></td><td class="small">${fDate(p.at)}</td><td class="small">${os.map(o=>o.ref).join(', ')}</td><td class="r num">${dzd(brut)}</td><td class="r num down">${dzd(fee)}</td><td class="r num"><b>${dzd(brut-fee)}</b></td><td>${p.gap?`<span class="badge red">${dzd(p.gap)}</span><div class="xs muted">${esc(t(p.gapNote))}</div>${p.justified?'<span class="badge green">'+t('Justifié')+'</span>':`<button class="btn sm" data-a="gapJustify" data-id="${p.id}">${t('Justifier')}</button>`}`:`<span class="badge green">${t('OK')}</span>`}</td></tr>`; }).join('')}</tbody></table></div><div class="card-b row"><span class="small muted grow">${ORDERS.filter(o=>o.status==='delivered').length} ${t('colis livrés en attente de versement')} · ${dzd(moneyAtDhd())}</span><button class="btn primary" data-a="reconcile">${ic('cash','sm')} ${t('Rapprocher un nouveau versement')}</button></div>`;
  if(u.tab==='pl'){ const marg = ca-cogs, net = marg - dhd - pub - sal - charges; const L=(l,v,b)=>`<tr${b?' style="font-weight:800;background:var(--kraft-ll)"':''}><td>${t(l)}</td><td class="r num ${v<0?'down':''}">${dzd(v)}</td><td class="r num muted">${ca?fmtPct(v/ca*100):''}</td></tr>`;
    inner = `<div class="card-b row between"><b>${t('Compte de résultat')} — ${monthName(new Date().getMonth())} 2026</b><span class="row">${u.locked?`<span class="badge dark">${ic('lock','sm')} ${t('Clôturé')}</span>`:''}<button class="btn sm" data-a="exportPL">${ic('download','sm')} Excel</button><button class="btn sm" data-a="printPL">${ic('print','sm')} PDF</button><button class="btn sm ${u.locked?'':'primary'}" data-a="closeMonth" ${u.locked||!isAdmin()?'disabled':''}>${ic('lock','sm')} ${t('Clôture mensuelle')}</button></span></div><div class="tbl-wrap"><table class="tbl"><tbody>${L('CA livré',ca)}${L('Coût d\'achat',-cogs)}${L('Marge brute',marg,1)}${L('Frais DHD (aller + retours)',-dhd)}${L('Publicité Meta',-pub)}${L('Salaires et commissions',-sal)}${L('Charges (loyer, emballage, transport, divers)',-charges)}${L('Résultat net',net,1)}</tbody></table></div><div class="card-b small muted">${t('Question ouverte : régime fiscal (IFU ou réel) à préciser avec le comptable.')}</div>`; }
  if(u.tab==='renta'){ const by=(keyFn,labelFn)=>{ const m={}; delivered.forEach(o=>{ const k=keyFn(o); const f=finOf(o); m[k]=m[k]||{ca:0,net:0,n:0}; m[k].ca+=f.total; m[k].net+=f.net; m[k].n++; }); return Object.entries(m).sort((a,b)=>b[1].net-a[1].net).slice(0,8).map(([k,v])=>`<tr><td class="small">${esc(labelFn(k))}</td><td class="r num">${v.n}</td><td class="r num">${dzd(v.ca)}</td><td class="r num ${v.net<0?'down':'up'}"><b>${dzd(v.net)}</b></td></tr>`).join(''); };
    const prodRows = (()=>{ const m={}; delivered.forEach(o=>o.items.forEach(i=>{ m[i.pid]=m[i.pid]||{q:0,marg:0}; m[i.pid].q+=i.q; m[i.pid].marg+=(i.price-i.cost)*i.q; })); return Object.entries(m).sort((a,b)=>b[1].marg-a[1].marg).slice(0,8).map(([pid,v])=>`<tr><td class="small">${esc(PBY[pid].name)}</td><td class="r num">${v.q}</td><td class="r num up"><b>${dzd(v.marg)}</b></td></tr>`).join(''); })();
    const head = `<thead><tr><th></th><th class="r">${t('Cmd')}</th><th class="r">${t('CA')}</th><th class="r">${t('Bénéfice net')}</th></tr></thead>`;
    inner = `<div class="card-b g2"><div><h4 style="margin-bottom:8px">${t('Par produit (marge brute)')}</h4><table class="tbl"><thead><tr><th></th><th class="r">${t('Qté')}</th><th class="r">${t('Marge')}</th></tr></thead><tbody>${prodRows}</tbody></table></div><div><h4 style="margin-bottom:8px">${t('Par wilaya')}</h4><table class="tbl">${head}<tbody>${by(o=>o.wilaya,k=>wName(+k))}</tbody></table></div><div><h4 style="margin-bottom:8px">${t('Par agent')}</h4><table class="tbl">${head}<tbody>${by(o=>o.agentId,k=>UBY[k]?UBY[k].name:'—')}</tbody></table></div><div><h4 style="margin-bottom:8px">${t('Par catégorie')}</h4><table class="tbl">${head}<tbody>${by(o=>PBY[o.items[0].pid].cats[0],k=>catName(CATS.find(c=>c.id===k)))}</tbody></table></div></div>`; }
  if(u.tab==='tiers'){ const sb=supplierBalance(); const comm = AGENTS.map(a=>({a, c:agentPerf(a).commission}));
    inner = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Tiers')}</th><th>${t('Nature')}</th><th class="r">${t('Solde')}</th></tr></thead><tbody><tr><td><b>${esc(SUPPLIERS[0].name)}</b></td><td>${t('Fournisseur — à payer')}</td><td class="r num down"><b>${dzd(sb.rest)}</b></td></tr><tr><td><b>DHD</b></td><td>${t('Livreur — à recevoir (colis livrés non payés)')}</td><td class="r num up"><b>${dzd(moneyAtDhd())}</b></td></tr>${comm.map(x=>`<tr><td>${esc(x.a.name)}</td><td>${t('Agent — commissions du mois')}</td><td class="r num down">${dzd(x.c)}</td></tr>`).join('')}</tbody></table></div>`; }
  return erpShell('compta', t('Comptabilité'), t('Recettes, dépenses, rapprochements et résultat mensuel'), card('', tabs+inner), `<button class="btn" data-a="exportJournal">${ic('download','sm')} ${t('Export pour le comptable')}</button>`);
}

/* ---------- Statistiques ---------- */
S.ui.stats = {tab:'ventes', agent:'', wilaya:''};
function viewStats(page){
  const u=S.ui.stats; let list = ORDERS.filter(o=>inPeriod(o.created));
  if(S.role==='agent') list = list.filter(o=>o.agentId===S.agentId);
  if(u.agent) list = list.filter(o=>String(o.agentId)===u.agent); if(u.wilaya) list = list.filter(o=>String(o.wilaya)===u.wilaya);
  const s = dashStats(list);
  const doms = S.role==='admin'? [['ventes','Ventes'],['appel','Centre d\'appel'],['livraison','Livraison'],['produits','Produits'],['clients','Clients'],['marketing','Marketing'],['finance','Finance']] : [['ventes','Ventes'],['appel','Centre d\'appel'],['livraison','Livraison'],['produits','Produits']];
  let inner='';
  if(u.tab==='ventes'){ const bySrc={}; list.forEach(o=>bySrc[o.source]=(bySrc[o.source]||0)+1); const ser=dailySeries(30,(a,b)=>list.filter(o=>o.created>=a&&o.created<b).length);
    inner = `<div class="kpis">${kpi(t('Reçues'),s.rec)}${kpi(t('Confirmées'),s.conf)}${kpi(t('Livrées'),s.deliv)}${kpi(t('Payées'),s.paid)}${kpi(t('CA livré'),dzd(s.ca))}${kpi(t('Panier moyen'),dzd(s.avg))}</div><div class="g21">${card(t('Commandes par jour'), `<div class="card-b">${lineChart([{name:t('Commandes'),data:ser.data,color:'#FD6400',area:true}],ser.labels)}</div>`)}${card(t('Par source'), `<div class="card-b row" style="gap:16px">${donut(Object.entries(bySrc).map(([k,v],i)=>({v,l:k,c:['#FD6400','#2F7D4F','#2F6690','#6A4C93','#D99A2B'][i%5]})),120)}<div class="col small">${Object.entries(bySrc).map(([k,v],i)=>`<span class="row"><i class="dot" style="background:${['#FD6400','#2F7D4F','#2F6690','#6A4C93','#D99A2B'][i%5]}"></i>${t(k)} · <b>${v}</b></span>`).join('')}</div></div>`)}</div>`; }
  if(u.tab==='appel'){ const reasons={}; list.filter(o=>o.status==='cancelled').forEach(o=>reasons[o.cancelReason]=(reasons[o.cancelReason]||0)+1);
    inner = `<div class="kpis">${kpi(t('Taux de confirmation'),fmtPct(s.confRate))}${kpi(t('Délai moyen 1er appel'), Math.round(AGENTS.reduce((x,a)=>x+agentPerf(a,list).firstCall,0)/AGENTS.length)+' min', t('objectif')+' < 2 h')}${kpi(t('Appels par commande'), (list.reduce((x,o)=>x+o.calls,0)/Math.max(1,list.length)).toFixed(1).replace('.',','))}${kpi(t('Gain d\'upsell'), dzd(s.up))}${kpi(t('Taux d\'upsell'), fmtPct(pct(list.filter(o=>CONFIRMED_ST.includes(o.status)&&upsellGain(o)>0).length, s.conf)))}</div><div class="g21">${card(t('Par agent'), agentTable(list))}${card(t('Motifs d\'annulation'), `<div class="card-b">${barsList(Object.entries(reasons).map(([k,v])=>({l:t(k),v,c:'#C2453D'})))||'—'}</div>`)}</div>`; }
  if(u.tab==='livraison'){ const byW={}; list.forEach(o=>{ byW[o.wilaya]=byW[o.wilaya]||[]; byW[o.wilaya].push(o); }); const reasons={}; list.forEach(o=>o.attempts.forEach(a=>reasons[a.reason]=(reasons[a.reason]||0)+1));
    const sh = list.filter(o=>o.times.sent&&o.times.delivered); const d1 = sh.length? sh.reduce((x,o)=>x+(o.times.delivered-o.times.sent),0)/sh.length/DAY : 0;
    inner = `<div class="kpis">${kpi(t('Taux de livraison'),fmtPct(s.delivRate), t('objectif')+' > 75 %')}${kpi(t('Taux de retour'),fmtPct(pct(s.ret,s.deliv+s.ret)))}${kpi(t('Tentatives par colis'),(list.reduce((x,o)=>x+o.attempts.length,0)/Math.max(1,s.ship)).toFixed(2).replace('.',','))}${kpi(t('Délai envoi → livraison'), d1.toFixed(1).replace('.',',')+' '+t('j'))}${kpi(t('Délai livraison → paiement'), '4,9 '+t('j'))}</div><div class="g2">${card(t('Par wilaya'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Wilaya')}</th><th class="r">${t('Cmd')}</th><th class="r">${t('Livrées')}</th><th class="r">${t('Retours')}</th><th class="r">${t('Taux')}</th></tr></thead><tbody>${Object.entries(byW).sort((a,b)=>b[1].length-a[1].length).map(([w,os])=>{ const r=deliveryRate(os); return `<tr><td>${esc(wName(+w))}</td><td class="r num">${os.length}</td><td class="r num">${os.filter(o=>DELIVERED_ST.includes(o.status)).length}</td><td class="r num">${os.filter(o=>['returning','returned'].includes(o.status)).length}</td><td class="r num"><b class="${r>=75?'up':r?'down':''}">${fmtPct(r)}</b></td></tr>`; }).join('')}</tbody></table></div>`)}${card(t('Motifs d\'échec'), `<div class="card-b">${barsList(Object.entries(reasons).map(([k,v])=>({l:t(FBY[k].fr),v,c:'#C2453D'})))}</div>`)}</div>`; }
  if(u.tab==='produits'){ const m={}, up={}; list.filter(o=>CONFIRMED_ST.includes(o.status)).forEach(o=>o.items.forEach(i=>{ m[i.pid]=(m[i.pid]||0)+i.q; const was=o.initial.find(x=>x.pid===i.pid); const add = was? Math.max(0,i.q-was.q) : i.q; if(add) up[i.pid]=(up[i.pid]||0)+add; }));
    inner = `<div class="g3">${card(t('Top ventes (unités)'), `<div class="card-b">${barsList(Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([p,v])=>({l:esc(PBY[p].name),v})))}</div>`)}${card(t('Les plus ajoutés en upsell'), `<div class="card-b">${barsList(Object.entries(up).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([p,v])=>({l:esc(PBY[p].name),v,c:'#2F7D4F'})))}</div>`)}${card(t('Produits dormants'), `<div class="card-b small">${PRODUCTS.filter(p=>p.price&&Date.now()-p.lastSale>30*DAY).map(p=>`<div class="row between" style="padding:3px 0"><span>${esc(p.name)}</span><span class="muted">${ago(p.lastSale)}</span></div>`).join('')}</div>`)}</div>${seesCost()?card(t('Marge par produit (top 10)'), `<div class="card-b">${barsList(PRODUCTS.filter(p=>p.price).sort((a,b)=>(b.price-b.cost)-(a.price-a.cost)).slice(0,10).map(p=>({l:esc(p.name),v:p.price-p.cost,extra:fmtPct(pct(p.price-p.cost,p.price)),c:'#2F7D4F'})),true)}</div>`):''}`; }
  if(u.tab==='clients'){ const rows=CUSTOMERS.map(c=>({c,s:custStats(c.id)})); const segs={}; rows.forEach(r=>segs[r.s.seg]=(segs[r.s.seg]||0)+1); const rep = rows.filter(r=>r.s.created>=2).length;
    inner = `<div class="kpis">${kpi(t('Clients'),rows.length)}${kpi(t('Taux de recommande'),fmtPct(pct(rep,rows.length)))}${kpi(t('Valeur client moyenne'),dzd(rows.reduce((x,r)=>x+r.s.spent,0)/rows.length))}${kpi(t('Liste noire'),segs['liste noire']||0)}</div><div class="g2">${card(t('Segments'), `<div class="card-b">${barsList(Object.entries(segs).map(([k,v])=>({l:t(k),v})))}</div>`)}${card(t('Top clients professionnels'), `<div class="tbl-wrap"><table class="tbl"><tbody>${rows.filter(r=>r.c.pro).sort((a,b)=>b.s.spent-a.s.spent).slice(0,8).map(r=>`<tr><td><b>${esc(r.c.business)}</b><div class="xs muted">${esc(r.c.name)}</div></td><td class="r num">${r.s.delivered} ${t('livrées')}</td><td class="r num"><b>${dzd(r.s.spent)}</b></td></tr>`).join('')}</tbody></table></div>`)}</div>`; }
  if(u.tab==='marketing'){ const spend=AD_SPEND.reduce((x,a)=>x+a.usd,0)*SETTINGS.usdRate; const net=list.filter(o=>DELIVERED_ST.includes(o.status)).reduce((x,o)=>x+finOf(o).net+SETTINGS.adCostPerDelivered,0); const camp={}; AD_SPEND.forEach(a=>camp[a.campaign]=(camp[a.campaign]||0)+a.usd*SETTINGS.usdRate);
    inner = `<div class="kpis">${kpi(t('Dépense Meta (30 j)'),dzd(spend))}${kpi(t('Coût par commande reçue'),dzd(spend/Math.max(1,ORDERS.length)))}${kpi(t('Coût par commande livrée'),dzd(spend/Math.max(1,ORDERS.filter(o=>DELIVERED_ST.includes(o.status)).length)))}${kpi(t('ROAS réel (bénéfice / pub)'), (net/Math.max(1,spend)).toFixed(2).replace('.',',')+' ×','', 'accent')}</div>${card(t('Dépense par campagne'), `<div class="card-b">${barsList(Object.entries(camp).map(([k,v])=>({l:esc(k),v:Math.round(v),c:'#2F6690'})),true)}</div>`)}`; }
  if(u.tab==='finance'){ const ser = dailySeries(30,(a,b)=>ORDERS.filter(o=>o.times.delivered>=a&&o.times.delivered<b).reduce((x,o)=>x+finOf(o).net,0));
    inner = `<div class="kpis">${CASHBOXES.map(b=>kpi(t(b.fr),dzd(b.balance))).join('')}${kpi(t('Dette fournisseur'),dzd(supplierBalance().rest))}${kpi(t('Argent chez DHD'),dzd(moneyAtDhd()))}</div>${card(t('Bénéfice net par jour (date de livraison)'), `<div class="card-b">${lineChart([{name:t('Bénéfice net'),data:ser.data,color:'#2F7D4F',area:true}],ser.labels,{w:1100})}</div>`)}`; }
  const filters = `<div class="card card-b row wrap">${periodFilter()}${S.role!=='agent'?`<select class="select" style="width:auto" data-ch="statAgent" aria-label="Agent"><option value="">${t('Tous les agents')}</option>${AGENTS.map(a=>`<option value="${a.id}" ${u.agent==String(a.id)?'selected':''}>${a.name}</option>`).join('')}</select>`:''}<select class="select" style="width:auto" data-ch="statWilaya" aria-label="${t('Wilaya')}"><option value="">${t('Toutes les wilayas')}</option>${[...new Set(ORDERS.map(o=>o.wilaya))].sort((a,b)=>a-b).map(w=>`<option value="${w}" ${u.wilaya==String(w)?'selected':''}>${esc(wName(w))}</option>`).join('')}</select><span class="grow"></span><button class="btn sm" data-a="exportStats">${ic('download','sm')} Excel</button><button class="btn sm" data-a="printPage">${ic('print','sm')} PDF</button></div>`;
  return erpShell(page||'stats', t('Statistiques'), '', filters + card('', `<div class="tabs">${doms.map(([k,l])=>`<button class="${u.tab===k?'on':''}" data-a="statTab" data-v="${k}">${t(l)}</button>`).join('')}</div>`) + `<div class="col" style="gap:16px">${inner}</div>`);
}

/* ---------- Paramètres ---------- */
S.ui.set = {tab:'site'};
function viewSettings(){
  const u=S.ui.set;
  const tabs = `<div class="tabs">${[['site','Paramètres du site'],['fees','Frais de livraison (69 wilayas)'],['erp','Paramètres ERP'],['msg','Modèles de messages'],['api','Intégrations']].map(([k,l])=>`<button class="${u.tab===k?'on':''}" data-a="setTab" data-v="${k}">${t(l)}</button>`).join('')}</div>`;
  const F=(id,l,v,type)=>`<div class="field"><label for="${id}">${t(l)}</label><input class="input" id="${id}" type="${type||'text'}" value="${esc(v)}"></div>`;
  let inner='';
  if(u.tab==='site') inner = `<div class="card-b col" style="gap:14px"><div class="grid3">${F('sName','Nom commercial','PackLik')}${F('sPhone','Téléphone (WhatsApp)',COMPANY.phone1)}${F('sPhone2','Téléphone 2',COMPANY.phone2)}${F('sMail','E-mail',COMPANY.email)}${F('sAddr','Adresse',COMPANY.address)}<div class="field"><label for="sColor">${t('Couleur principale')}</label><input class="input" id="sColor" type="color" value="${SETTINGS.primary}" style="padding:2px"></div></div>
    <div class="grid2"><div class="field"><label for="b1">${t('Bannière 1 (AR)')}</label><input class="input" id="b1" dir="rtl" value="أسعار تنافسية – تغليف مخصص حسب علامتك التجارية"></div><div class="field"><label for="b2">${t('Bannière 2 (AR)')}</label><input class="input" id="b2" dir="rtl" value="عروض حصرية لا تتكرر"></div></div>
    <div class="grid3">${F('seoT','Titre SEO','PackLik – Emballage alimentaire en Algérie')}${F('seoD','Description SEO','Boîtes, barquettes, bowls, sacs craft – paiement à la livraison 69 wilayas')}${F('fb','Facebook / Instagram','@packlik.dz')}</div>
    <div class="row wrap"><label class="check"><input type="checkbox" checked> ${t('Arabe (RTL)')}</label><label class="check"><input type="checkbox" checked> ${t('Français')}</label><label class="check"><input type="checkbox" checked> ${t('Anglais')}</label><label class="check"><input type="checkbox" ${SETTINGS.maintenance?'checked':''} data-ch="maint"> ${t('Mode maintenance')}</label><label class="check"><input type="checkbox" ${PRODUCTS.some(p=>p.onDemand)?'checked':''} data-ch="onDemand"> ${t('Autoriser « commande sur demande » pour les ruptures')}</label></div>
    <div class="row"><button class="btn primary" data-a="saveSettings">${t('Enregistrer')}</button></div></div>`;
  if(u.tab==='fees') inner = `<div class="tbl-wrap" style="max-height:600px"><table class="tbl"><thead><tr><th>${t('Code')}</th><th>${t('Wilaya')}</th><th>${t('Desservie')}</th><th>${t('Frais domicile')}</th><th>${t('Frais bureau')}</th><th>${t('Coût DHD domicile')}</th><th>${t('Coût DHD bureau')}</th></tr></thead><tbody>${WILAYAS.map(w=>`<tr><td class="num">${w.code}</td><td><b>${esc(w.fr)}</b> <span class="muted small" dir="rtl">${w.ar}</span>${w.id>58?` <span class="badge blue">${t('nouvelle')}</span>`:''}</td><td><input type="checkbox" ${w.active?'checked':''} data-ch="wActive" data-id="${w.id}" aria-label="${esc(w.fr)}"></td>${['home','desk','dhdHome','dhdDesk'].map(k=>`<td><input class="input" type="number" style="width:90px;height:30px" value="${w[k]}" data-ch="wFee" data-id="${w.id}" data-k="${k}" aria-label="${k} ${esc(w.fr)}"></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if(u.tab==='erp') inner = `<div class="card-b col" style="gap:14px"><div class="grid3">
    <div class="field"><label for="dA1">${t('Remise max agent (%)')}</label><input class="input" id="dA1" type="number" value="${SETTINGS.discountAgent}" data-ch="setNum" data-k="discountAgent"></div>
    <div class="field"><label for="dM1">${t('Remise max manager (%)')}</label><input class="input" id="dM1" type="number" value="${SETTINGS.discountManager}" data-ch="setNum" data-k="discountManager"></div>
    <div class="field"><label for="st1">${t('Délai fournisseur par défaut (jours)')}</label><input class="input" id="st1" type="number" min="7" max="10" value="${SETTINGS.supplierTerms}" data-ch="setNum" data-k="supplierTerms"></div>
    <div class="field"><label for="bx1">${t('Caisse de sécurité (% du bénéfice)')}</label><input class="input" id="bx1" type="number" value="${SETTINGS.boxes.security}" data-ch="setBox"></div>
    <div class="field"><label>${t('Réinvestissement (% du bénéfice)')}</label><input class="input" value="${SETTINGS.boxes.reinvest}" disabled></div>
    <div class="field"><label for="ac1">${t('Plafond d\'avance pub (% de la réserve)')}</label><input class="input" id="ac1" type="number" value="${SETTINGS.advanceCap}" data-ch="setNum" data-k="advanceCap"></div>
    <div class="field"><label for="ux1">${t('Taux USD/DZD')}</label><input class="input" id="ux1" type="number" value="${SETTINGS.usdRate}" data-ch="setNum" data-k="usdRate"></div>
    <div class="field"><label for="cm1">${t('Commission par commande livrée (DZD)')}</label><input class="input" id="cm1" type="number" value="${SETTINGS.commission}" data-ch="setNum" data-k="commission"></div>
    <div class="field"><label for="ad1">${t('Coût pub alloué par commande livrée (DZD)')}</label><input class="input" id="ad1" type="number" value="${SETTINGS.adCostPerDelivered}" data-ch="setNum" data-k="adCostPerDelivered"></div>
    </div>
    <div class="grid2"><div class="field"><label>${t('Délais de rappel « Injoignable » 1 / 2 / 3')}</label><input class="input" value="${SETTINGS.callbackDelays.join(' · ')}"></div><div class="field"><label>${t('Motifs d\'annulation')}</label><input class="input" value="${CANCEL_REASONS.join(', ')}"></div></div>
    <div class="field"><label>${t('Motifs d\'échec de livraison')}</label><input class="input" value="${FAIL_REASONS.map(f=>f.fr).join(', ')}"></div>
    <div class="row wrap"><button class="btn primary" data-a="saveSettings">${t('Enregistrer')}</button><button class="btn" data-a="backup">${ic('download','sm')} ${t('Sauvegarde maintenant')}</button><span class="small muted">${t('Sauvegarde quotidienne chiffrée, conservée 30 jours.')}</span></div></div>`;
  if(u.tab==='msg') inner = `<div class="card-b col" style="gap:12px">${Object.entries(SETTINGS.templates).map(([k,v])=>`<div class="field"><label for="tpl${k}">${k==='unreach'?t('Client injoignable (SMS/WhatsApp)'):t('Colis expédié')}</label><textarea class="input" id="tpl${k}">${esc(v)}</textarea></div>`).join('')}<div class="small muted">${t('Variables')} : {nom} {ref} {tracking} {total}</div><button class="btn primary" data-a="saveSettings" style="align-self:start">${t('Enregistrer')}</button></div>`;
  if(u.tab==='api') inner = `<div class="card-b col" style="gap:14px"><div class="grid2">${F('kDhd','Clé API DHD',SETTINGS.dhdApiKey)}<div class="field"><label>${t('Synchronisation DHD')}</label><input class="input" value="${t('Toutes les')} ${SETTINGS.dhdSyncMin} min (cron)"></div>${F('kWa','WhatsApp Business API (v2)',SETTINGS.waKey||'—')}${F('kPx','Pixel Meta',SETTINGS.pixelId)}${F('kCapi','Conversions API (token)',SETTINGS.capiToken)}</div>
    <div class="small"><b>${t('Événements Pixel envoyés (session)')}</b> : ${(S.pixel||[]).slice(0,8).map(p=>`<span class="badge">${p.ev}</span>`).join(' ') || '<span class="muted">ViewContent · AddToCart · InitiateCheckout · Purchase</span>'}</div>
    <div class="row"><button class="btn" data-a="testDhd">${ic('refresh','sm')} ${t('Tester la connexion DHD')}</button><button class="btn primary" data-a="saveSettings">${t('Enregistrer')}</button></div></div>`;
  return erpShell('parametres', t('Paramètres'), t('Site et ERP'), card('', tabs+inner));
}
function viewJournal(){
  const rows = ACTIVITY.concat(ORDERS.flatMap(o=>o.history.filter(h=>h.who!=='Système'&&h.who!=='DHD').map(h=>({at:h.at, user:h.who, action:h.action, entity:o.ref, details:h.note})))).sort((a,b)=>b.at-a.at);
  const filtered = S.role==='manager'? rows.filter(r=>AGENTS.some(a=>a.name===r.user)) : rows;
  return erpShell('journal', t('Journal d\'activité'), t('Non modifiable — chaque action sensible est tracée'), card('', `<div class="tbl-wrap" style="max-height:680px"><table class="tbl"><thead><tr><th>${t('Date')}</th><th>${t('Utilisateur')}</th><th>${t('Action')}</th><th>${t('Entité')}</th><th>${t('Détails')}</th></tr></thead><tbody>${filtered.slice(0,200).map(r=>`<tr><td class="small">${fDT(r.at)}</td><td class="small"><b>${esc(t(r.user))}</b></td><td class="small">${esc(t(r.action))}</td><td class="small">${esc(r.entity)}</td><td class="small muted">${esc(t(r.details||''))}</td></tr>`).join('')}</tbody></table></div>`));
}

/* ============================================================
   ESPACES : Gérant, Manager, Agent, Fournisseur
   ============================================================ */
/* ---------- Gérant ---------- */
function viewGerantDash(){
  const c = (sts)=>ORDERS.filter(o=>sts.includes(o.status)).length;
  const sentToday = ORDERS.filter(o=>o.times.sent && o.times.sent>=new Date().setHours(0,0,0,0)).length;
  const body = `<div class="kpis">${kpi(t('À préparer'),c(['toprep']))}${kpi(t('Prêtes'),c(['ready']))}${kpi(t('Envoyées aujourd\'hui'),sentToday)}${kpi(t('En transit'),c(['sent','picked','transit','outfor']))}${kpi(t('Tentatives échouées'),`<span class="down">${c(['failed'])}</span>`)}${kpi(t('Retours à réceptionner'),c(['returning']))}</div>
    <div class="g21">${card(t('Flux du jour'), `<div class="card-b funnel">${[['À préparer',['toprep'],'#C74B00'],['Prêtes',['ready'],'#FD6400'],['Chez DHD',['sent','picked','transit','outfor'],'#2F6690'],['Échecs',['failed'],'#C2453D'],['Retours',['returning'],'#962F28']].map(([l,s,col])=>{ const n=c(s); return `<div class="f"><span class="lb">${t(l)}</span><div class="b"><i style="width:${Math.max(6,n/Math.max(1,c(['toprep','ready','sent','picked','transit','outfor','failed','returning']))*100)}%;background:${col}">${n}</i></div></div>`; }).join('')}</div><div class="card-b row wrap" style="padding-top:0"><a class="btn kraft" href="#/erp/preparation">${ic('box','sm')} ${t('Préparer')}</a><a class="btn primary" href="#/erp/expedition">${ic('send','sm')} ${t('Expédier')}</a><a class="btn" href="#/erp/retours">${ic('undo','sm')} ${t('Retours')}</a></div>`)}${alertsCard()}</div>
    <div class="lock-note">${ic('lock','sm')} ${t('Espace Gérant : prix d\'achat, bénéfices, caisses et salaires masqués.')}</div>`;
  return erpShell('dashboard', t('Tableau de bord opérations'), t('Préparation, expédition DHD, retours, stock'), body);
}
function viewPreparation(){
  const list = ORDERS.filter(o=>o.status==='toprep').sort((a,b)=>a.times.confirmed-b.times.confirmed); const sel=S.ui.track2.sel;
  const pick = {}; list.filter(o=>!sel.size||sel.has(o.id)).forEach(o=>expand(o.items).forEach(i=>pick[i.pid]=(pick[i.pid]||0)+i.q));
  const body = `<div class="g21">${card(t('Commandes confirmées à préparer'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th><input type="checkbox" data-ch="selAllT" aria-label="${t('Tout sélectionner')}"></th><th>${t('N°')}</th><th>${t('Confirmée')}</th><th>${t('Client')}</th><th>${t('Wilaya')}</th><th>${t('Produits')}</th><th></th></tr></thead><tbody>${list.map(o=>`<tr><td><input type="checkbox" ${sel.has(o.id)?'checked':''} data-ch="selT" data-id="${o.id}" aria-label="${o.ref}"></td><td><button class="btn ghost sm" style="padding:0;font-weight:800" data-a="openOrder" data-id="${o.id}">${o.ref}</button></td><td class="small">${ago(o.times.confirmed||o.created)}</td><td>${custCell(o)}</td><td>${esc(wName(o.wilaya))}</td><td>${itemsSummary(o.items)}</td><td><button class="btn sm green" data-a="oneReady" data-id="${o.id}">${ic('check','sm')} ${t('Prête')}</button></td></tr>`).join('') || emptyRow(7,'Rien à préparer','box')}</tbody></table></div>`, `<button class="btn sm green" data-a="bulkReady" ${list.length?'':'disabled'}>${t('Valider « Prête »')} ${sel.size?'('+sel.size+')':''}</button>`)}
    ${card(t('Bon de préparation groupé (picking)'), `<div class="card-b"><div class="small muted" style="margin-bottom:8px">${sel.size? sel.size+' '+t('commandes sélectionnées') : t('Toutes les commandes à préparer')}</div>${Object.entries(pick).sort((a,b)=>b[1]-a[1]).map(([pid,q])=>`<div class="row between" style="padding:6px 0;border-bottom:1px dashed var(--line)"><span class="row small">${prodArt(PBY[pid],28)} ${esc(PBY[pid].name)}</span><b class="num">× ${q}</b></div>`).join('') || '<span class="muted">—</span>'}<button class="btn block" style="margin-top:10px" data-a="picking">${ic('print','sm')} ${t('Imprimer le bon')}</button></div>`)}</div>`;
  return erpShell('preparation', t('Préparation'), t('Stock réservé à la confirmation · emballer, peser, valider'), body);
}
function viewExpedition(){
  const list = ORDERS.filter(o=>o.status==='ready'); const sel=S.ui.track2.sel;
  const sentToday = ORDERS.filter(o=>o.times.sent && o.times.sent>=new Date().setHours(0,0,0,0));
  const conn = CARRIERS.filter(c=>c.connected);
  const body = `${card(t('Colis prêts à envoyer'), `<div class="filters-bar"><span class="small muted">${t('Avant envoi, l\'ERP vérifie : stock, téléphone valide, wilaya, commune et poids.')}</span><span class="grow"></span>${sel.size? `<select class="select" id="bulkCar" aria-label="${t('Société de livraison')}">${conn.map(c=>`<option value="${c.id}">${esc(t(c.name))}</option>`).join('')}</select><button class="btn sm" data-a="bulkCarrier">${t('Changer de société')}</button>`:''}<button class="btn sm primary" data-a="bulkSend" ${list.length?'':'disabled'}>${ic('send','sm')} ${t('Envoyer')} ${sel.size?'('+sel.size+')':'('+t('tous')+')'}</button></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th><input type="checkbox" data-ch="selAllT" aria-label="${t('Tout sélectionner')}"></th><th>${t('N°')}</th><th>${t('Client')}</th><th>${t('Wilaya')}</th><th>${t('Société de livraison')}</th><th class="r">${t('Poids')}</th><th>${t('Colis')}</th><th class="r">${t('Frais')}</th><th class="r">${t('À encaisser')}</th><th>${t('Contrôles')}</th></tr></thead><tbody>${list.map(o=>{ const chk = preSendCheck(o); const c=carrierOf(o); const ow=overweightFee(o); const P=parcelsOf(o); return `<tr><td><input type="checkbox" ${sel.has(o.id)?'checked':''} data-ch="selT" data-id="${o.id}" aria-label="${o.ref}"></td><td><button class="btn ghost sm" style="padding:0;font-weight:800" data-a="openOrder" data-id="${o.id}">${o.ref}</button></td><td>${custCell(o)}</td><td>${esc(wName(o.wilaya))} · ${esc(cName(o.commune))}<div class="xs muted">${o.delivery==='home'?t('Domicile'):t('Bureau DHD')}</div></td><td><select class="select" style="width:auto;height:30px" data-ch="rowCarrier" data-id="${o.id}" aria-label="${t('Société de livraison')}">${conn.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${esc(t(x.name))}</option>`).join('')}</select>${c.internal? `<div class="xs muted">${o.courierId? esc(CUB[o.courierId].name) : t('Livreur automatique')}</div>`:''}</td><td class="r num">${kg(orderWeight(o))}${ow?`<div class="xs down">+ ${dzd(ow)}</div>`:''}</td><td>${P.length>1? `<span class="badge blue">${P.length} ${t('colis')}</span>` : needsSplit(o)? `<button class="btn sm" data-a="splitOrder" data-id="${o.id}">${ic('layers','sm')} ${t('Découper')}</button>` : '1'}</td><td class="r num">${dzd(dhdFeeOf(o))}</td><td class="r num"><b>${dzd(orderTotal(o))}</b></td><td>${chk.length? chk.map(c=>`<span class="badge red">${t(c)}</span>`).join(' ') : `<span class="badge green">${ic('check','sm')} OK</span>`}</td></tr>`; }).join('') || emptyRow(10,'Aucun colis prêt','truck')}</tbody></table></div>`)}
    ${card(t('Envoyés aujourd\'hui'), `<div class="tbl-wrap"><table class="tbl"><tbody>${sentToday.map(o=>`<tr><td><b>${o.ref}</b></td><td>${esc(t(carrierOf(o).name))}</td><td dir="ltr" class="small">${o.tracking}${parcelsOf(o).length>1?' · '+parcelsOf(o).length+' '+t('colis'):''}</td><td>${esc(wName(o.wilaya))}</td><td class="r num">${kg(orderWeight(o))}</td><td class="r num">${dzd(orderTotal(o))}</td><td><button class="btn sm" data-a="printLabel" data-id="${o.id}">${ic('print','sm')} ${t('Étiquette')}</button></td></tr>`).join('') || emptyRow(7,'Aucun envoi aujourd\'hui','truck')}</tbody></table></div>`, sentToday.length?`<button class="btn sm" data-a="bordereau">${ic('print','sm')} ${t('Bordereau de remise')}</button>`:'')}`;
  return erpShell('expedition', t('Expédition'), t('Société de livraison, poids, colis, étiquettes et bordereau'), body);
}
function preSendCheck(o){ const e=[]; if(needsSplit(o)) e.push('Poids trop élevé : découper la commande'); if(!carrierOf(o).connected) e.push('Société non connectée'); if(!validPhone(CBY[o.customerId].phone)) e.push('Téléphone invalide'); if(!o.commune) e.push('Commune manquante'); expand(o.items).forEach(i=>{ if(PBY[i.pid].stock < i.q) e.push('Stock insuffisant'); }); return [...new Set(e)]; }
function viewReturns(){
  const list = ORDERS.filter(o=>['returning','returned'].includes(o.status));
  const body = card(t('Retours'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('N°')}</th><th>${t('Client')}</th><th>${t('Wilaya')}</th><th>${t('Produits')}</th><th>${t('Motif')}</th><th class="r">${t('Perte estimée')}</th><th>${t('Statut')}</th><th></th></tr></thead><tbody>${list.map(o=>{ const a=o.attempts[o.attempts.length-1]; return `<tr><td><b>${o.ref}</b></td><td>${custCell(o)}</td><td>${esc(wName(o.wilaya))}</td><td>${itemsSummary(o.items)}</td><td class="small">${a? t(FBY[a.reason].fr):'—'}</td><td class="r num down">${dzd(returnLoss(o))}</td><td>${stBadge(o)}</td><td>${o.status==='returning'?`<button class="btn sm" data-a="receiveReturn" data-id="${o.id}">${ic('undo','sm')} ${t('Réceptionner')}</button>`:''}</td></tr>`; }).join('') || emptyRow(8,'Aucun retour','check')}</tbody></table></div>`);
  return erpShell('retours', t('Retours'), t('Réception, contrôle de l\'état, réintégration en stock ou casse'), body);
}

/* ---------- Manager ---------- */
function viewManagerDash(){
  const online = AGENTS.filter(a=>a.online&&!a.pause);
  const list = ORDERS.filter(o=>inPeriod(o.created)); const s=dashStats(list);
  const fc = AGENTS.map(a=>agentPerf(a,list).firstCall).filter(x=>x>0);
  const body = `<div class="pg-h"><div></div>${periodFilter()}</div>
    <div class="kpis">${kpi(t('Agents en ligne'), online.length+' / '+AGENTS.length)}${kpi(t('En attente'), ORDERS.filter(o=>CONF_ST.includes(o.status)).length, ORDERS.filter(o=>CONF_ST.includes(o.status)&&!o.agentId).length+' '+t('non assignées'))}${kpi(t('Délai moyen 1er appel'), Math.round(fc.reduce((a,b)=>a+b,0)/Math.max(1,fc.length))+' min', t('objectif')+' < 120 min')}${kpi(t('Taux de confirmation'), fmtPct(s.confRate))}${kpi(t('Taux d\'upsell'), fmtPct(pct(list.filter(o=>CONFIRMED_ST.includes(o.status)&&upsellGain(o)>0).length,s.conf)))}${kpi(t('Taux de livraison'), fmtPct(s.delivRate))}</div>
    <div class="g21">${card(t('File par agent'), `<div class="card-b">${barsList(AGENTS.map(a=>({l:`${esc(a.name)} ${a.online&&!a.pause?'':'<span class="badge">'+(a.pause?t('pause'):t('hors ligne'))+'</span>'}`, v:agentLoad(a.id), extra:'/ '+a.quota})))}</div>`, `<a class="btn sm" href="#/erp/file">${t('File globale')}</a>`)}${card(t('Cas difficiles'), `<div class="alerts">${hardCases().slice(0,6).map(o=>`<button class="alert red" style="border:0;background:none;text-align:start;width:100%;cursor:pointer" data-a="openOrder" data-id="${o.id}"><span class="ai">${ic('flag','sm')}</span><div><b>${o.ref} · ${esc(CBY[o.customerId].name)}</b><div class="small muted">${hardReason(o)}</div></div></button>`).join('') || `<div class="empty">${t('Aucun cas difficile')}</div>`}</div>`)}</div>
    ${card(t('Performance des agents'), agentTable(list))}`;
  return erpShell('dashboard', t('Tableau de bord équipe'), t('Centre d\'appel'), body);
}
function hardReason(o){ if(o.discountPending) return t('Remise à valider')+' ('+o.discount+' %)'; if(o.riskReturn) return t('3 tentatives échouées — risque de retour'); if(o.status==='unreach') return t('Injoignable 3 fois'); return t('Refus du colis à traiter'); }
function viewQueue(){
  const pending = ORDERS.filter(o=>CONF_ST.includes(o.status));
  const col = (aid, title, sub)=>`<div class="card" style="min-width:230px;flex:1"><div class="card-h"><div><h3>${title}</h3><div class="xs muted">${sub}</div></div><span class="badge">${pending.filter(o=>(o.agentId||null)===aid).length}</span></div><div class="card-b"><div class="dz" data-drop="${aid||0}">${pending.filter(o=>(o.agentId||null)===aid).sort((a,b)=>a.created-b.created).map(o=>`<div class="chip" draggable="true" data-drag="${o.id}"><span><b>${o.ref}</b><br><span class="xs muted">${esc(CBY[o.customerId].name)} · ${esc(wName(o.wilaya))}</span></span><span class="col" style="gap:2px;align-items:flex-end"><span class="badge ${STATUS[o.status].c}">${stName(o.status,o)}</span><span class="xs num">${dzd(orderTotal(o))}</span></span></div>`).join('') || `<div class="xs muted" style="text-align:center;padding:10px">${t('Déposez ici')}</div>`}</div></div></div>`;
  const body = `<div class="lock-note">${ic('drag','sm')} ${t('Glissez-déposez une commande vers un agent pour la réassigner. Chaque réattribution est tracée.')}</div>
    <div class="row" style="align-items:stretch;overflow-x:auto;gap:12px;padding-bottom:8px">${col(null, t('File commune'), t('non assignées'))}${AGENTS.map(a=>col(a.id, esc(a.name), (a.online&&!a.pause? t('En ligne'):a.pause?t('En pause'):t('Hors ligne'))+' · '+t('quota')+' '+a.quota)).join('')}</div>
    <div class="row"><button class="btn" data-a="pauseReturn">${ic('undo','sm')} ${t('Renvoyer en file commune les commandes des agents en pause')}</button><button class="btn" data-a="autoReassign">${ic('refresh','sm')} ${t('Réattribuer les commandes non ouvertes depuis 30 min')}</button></div>`;
  return erpShell('file', t('File globale'), t('Toutes les commandes à confirmer'), body);
}
function viewHard(){
  const list = hardCases();
  const body = card(t('Cas difficiles'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Commande')}</th><th>${t('Client')}</th><th>${t('Raison')}</th><th>${t('Agent')}</th><th class="r">${t('Valeur')}</th><th></th></tr></thead><tbody>${list.map(o=>`<tr class="${o.riskReturn?'risk':''}"><td><b>${o.ref}</b><div>${stBadge(o)}</div></td><td>${custCell(o)}</td><td class="small">${hardReason(o)}</td><td>${agentCell(o.agentId)}</td><td class="r num">${dzd(orderTotal(o))}</td><td><div class="row">${o.discountPending?`<button class="btn sm green" data-a="discOk" data-id="${o.id}">${t('Valider la remise')}</button><button class="btn sm" data-a="discNo" data-id="${o.id}">${t('Refuser')}</button>`:`<button class="btn sm" data-a="openOrder" data-id="${o.id}">${t('Ouvrir')}</button>`}</div></td></tr>`).join('') || emptyRow(6,'Aucun cas difficile')}</tbody></table></div>`)
    + card(t('Contrôle qualité — annulations récentes'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Commande')}</th><th>${t('Agent')}</th><th>${t('Motif')}</th><th>${t('Appels')}</th><th>${t('Note d\'appel')}</th><th></th></tr></thead><tbody>${ORDERS.filter(o=>o.status==='cancelled').map(o=>`<tr><td><b>${o.ref}</b></td><td>${agentCell(o.agentId)}</td><td><span class="badge red">${t(o.cancelReason)}</span></td><td class="num">${o.calls}</td><td class="small muted">${esc(t(o.history.filter(h=>h.note).slice(-1)[0]?.note||'—'))}</td><td>${o.qc? `<span class="badge green">${t('Vérifiée')}</span>`:`<button class="btn sm" data-a="qcOk" data-id="${o.id}">${t('Marquer vérifiée')}</button>`}</td></tr>`).join('')}</tbody></table></div>`);
  return erpShell('cas', t('Cas difficiles'), t('Commandes à risque, refus, remises à valider'), body);
}
function viewRanking(){
  const rows = AGENTS.map(a=>({a, p:agentPerf(a)})).sort((x,y)=>(y.p.delivRate*0.5+y.p.confRate*0.3+y.p.upRate*0.2)-(x.p.delivRate*0.5+x.p.confRate*0.3+x.p.upRate*0.2));
  const goals = S.ui.goals || (S.ui.goals = {conf:20, up:60, deliv:75});
  const body = `<div class="g21">${card(t('Classement'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>${t('Agent')}</th><th class="r">${t('Confirmées')}</th><th class="r">${t('Confirmation')}</th><th class="r">${t('Upsell')}</th><th class="r">${t('Livraison')}</th><th class="r">${t('Gain upsell')}</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i===0?`<span class="badge amber">${ic('award','sm')} 1</span>`:i+1}</td><td>${agentCell(r.a.id)}</td><td class="r num">${r.p.conf}</td><td class="r num">${fmtPct(r.p.confRate)}</td><td class="r num">${fmtPct(r.p.upRate)}</td><td class="r num"><b class="${r.p.delivRate>=75?'up':'down'}">${fmtPct(r.p.delivRate)}</b></td><td class="r num">${dzd(r.p.gain)}</td></tr>`).join('')}</tbody></table></div>`)}
    ${card(t('Objectifs de la semaine'), `<div class="card-b col" style="gap:12px"><div class="field"><label for="g1">${t('Confirmations par agent')}</label><input class="input" id="g1" type="number" value="${goals.conf}" data-ch="goal" data-k="conf"></div><div class="field"><label for="g2">${t('Taux d\'upsell (%)')}</label><input class="input" id="g2" type="number" value="${goals.up}" data-ch="goal" data-k="up"></div><div class="field"><label for="g3">${t('Taux de livraison (%)')}</label><input class="input" id="g3" type="number" value="${goals.deliv}" data-ch="goal" data-k="deliv"></div></div>`)}</div>
    <div class="g2" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${rows.map(r=>`<div class="card card-b col" style="gap:8px"><div class="row">${agentCell(r.a.id)}</div>${[['Confirmations',r.p.conf,goals.conf,''],['Upsell',r.p.upRate,goals.up,'%'],['Livraison',r.p.delivRate,goals.deliv,'%']].map(([l,v,g,u])=>`<div class="small row between"><span>${t(l)}</span><b class="num">${u?fmtPct(v):v} / ${g}${u?' %':''}</b></div><div class="progress"><i style="width:${Math.min(100,v/g*100)}%;background:${v>=g?'var(--green)':'var(--kraft)'}"></i></div>`).join('')}</div>`).join('')}</div>`;
  return erpShell('classement', t('Classement et objectifs'), '', body);
}

/* ---------- Agent ---------- */
function viewMyQueue(){
  const a = me(); const mine = ORDERS.filter(o=>o.agentId===a.id);
  const dueCb = mine.filter(o=>CONF_ST.includes(o.status) && o.nextCall && o.nextCall<=Date.now()+15*MIN).sort((x,y)=>x.nextCall-y.nextCall);
  const nw = mine.filter(o=>o.status==='new' || o.status==='calling').sort((x,y)=>x.created-y.created);
  const save = mine.filter(o=>o.status==='failed');
  const later = mine.filter(o=>CONF_ST.includes(o.status) && o.nextCall && o.nextCall>Date.now()+15*MIN);
  const row = (o, why)=>`<tr class="clickable" data-a="goCall" data-id="${o.id}"><td><b>${o.ref}</b></td><td>${custCell(o)}</td><td>${phoneCell(o)}</td><td>${esc(wName(o.wilaya))}</td><td>${itemsSummary(o.items)}</td><td class="r num">${dzd(orderTotal(o))}</td><td>${why}</td><td>${stBadge(o)}</td></tr>`;
  const sect = (title, arr, why, cls)=>`<tr><td colspan="8" style="background:var(--kraft-ll);font-weight:800;font-size:12px">${title} <span class="badge ${cls||''}">${arr.length}</span></td></tr>${arr.map(o=>row(o, why(o))).join('') || `<tr><td colspan="8" class="small muted">—</td></tr>`}`;
  const p = agentPerf(a);
  const body = `<div class="card card-b row wrap" style="gap:16px"><span class="avatar">${initials(a.name)}</span><div class="grow"><b>${t('Bonjour')} ${esc(a.name.split(' ')[0])}</b><div class="small muted">${dueCb.length+nw.length+save.length} ${t('commandes à traiter maintenant')}</div></div><div class="seg"><button class="${a.online&&!a.pause?'on':''}" data-a="agentState" data-id="${a.id}" data-v="online">${t('En ligne')}</button><button class="${a.pause?'on':''}" data-a="agentState" data-id="${a.id}" data-v="pause">${t('Pause')}</button></div><button class="btn primary lg" data-a="nextCall">${ic('phone')} ${t('Commencer l\'appel suivant')}</button></div>
    <div class="kpis">${kpi(t('Traitées'),p.treated)}${kpi(t('Taux de confirmation'),fmtPct(p.confRate))}${kpi(t('Upsell moyen'),'+'+fmtPct(p.upAvg))}${kpi(t('Taux de livraison'),fmtPct(p.delivRate))}${kpi(t('Commission du mois'),dzd(p.commission),'','accent')}</div>
    ${card(t('Ma file — triée par priorité'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('N°')}</th><th>${t('Client')}</th><th>${t('Téléphone')}</th><th>${t('Wilaya')}</th><th>${t('Produits')}</th><th class="r">${t('Total')}</th><th>${t('Priorité')}</th><th>${t('Statut')}</th></tr></thead><tbody>
      ${sect('1. '+t('Rappels à l\'heure'), dueCb, o=>{ const c=countdown(o.nextCall); return `<span class="countdown ${c.cls}">${ic('clock','sm')} ${c.txt}</span>`; }, 'amber')}
      ${sect('2. '+t('Nouvelles commandes'), nw, o=>`<span class="small">${ago(o.created)}</span>`, 'blue')}
      ${sect('3. '+t('Tentatives de livraison à sauver'), save, o=>{ const at=o.attempts[o.attempts.length-1]; return `<span class="badge red">${t(FBY[at.reason].fr)}</span>`; }, 'red')}
      ${sect('4. '+t('Rappels plus tard'), later, o=>`<span class="small">${fDT(o.nextCall)}</span>`)}
    </tbody></table></div>`)}`;
  return erpShell('mafile', t('Ma file'), t('Une commande à la fois, tout en un écran'), body);
}
function viewMyCallbacks(){
  const mine = ORDERS.filter(o=>o.agentId===S.agentId && CONF_ST.includes(o.status) && o.nextCall).sort((a,b)=>a.nextCall-b.nextCall);
  const groups = {}; mine.forEach(o=>{ const k=fDate(o.nextCall); (groups[k]=groups[k]||[]).push(o); });
  const body = card(t('Agenda des rappels'), `<div class="card-b agenda">${Object.entries(groups).map(([d,os])=>`<h4 style="margin:6px 0">${d}</h4>${os.map(o=>{ const c=countdown(o.nextCall); return `<div class="slot"><b class="num">${fTime(o.nextCall)}</b><div class="row between wrap"><div><b>${o.ref}</b> · ${esc(CBY[o.customerId].name)} · ${stBadge(o)}<div class="xs muted">${itemsSummary(o.items)}</div></div><div class="row"><span class="countdown ${c.cls}">${c.txt}</span><button class="btn sm primary" data-a="goCall" data-id="${o.id}">${ic('phone','sm')} ${t('Appeler')}</button></div></div></div>`; }).join('')}`).join('') || `<div class="empty">${ic('cal')}<div>${t('Aucun rappel programmé')}</div></div>`}</div>`) + `<div class="small muted">${ic('bell','sm')} ${t('Une notification apparaît 5 minutes avant chaque rappel.')}</div>`;
  return erpShell('rappels', t('Mes rappels'), '', body);
}
function viewMyDeliveries(){
  const mine = ORDERS.filter(o=>o.agentId===S.agentId && CONFIRMED_ST.includes(o.status)).sort((a,b)=>(b.status==='failed')-(a.status==='failed') || b.created-a.created);
  const p = agentPerf(me());
  const body = `<div class="kpis">${kpi(t('Confirmées'),mine.length)}${kpi(t('Livrées'),p.deliv)}${kpi(t('Retours'),p.ret)}${kpi(t('Mon taux de livraison'),fmtPct(p.delivRate), t('objectif')+' 75 %','accent')}</div>`
    + (mine.some(o=>o.status==='failed')? `<div class="lock-note" style="background:var(--red-l);color:#962F28">${ic('alert','sm')} ${mine.filter(o=>o.status==='failed').length} ${t('tentative(s) échouée(s) à traiter : elles comptent dans votre taux de livraison.')} <a href="#/erp/tentatives" style="margin-inline-start:auto">${t('Traiter')} →</a></div>`:'')
    + card(t('Mes commandes confirmées jusqu\'à la livraison'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('N°')}</th><th>${t('Client')}</th><th>${t('Wilaya')}</th><th class="r">${t('Total')}</th><th>${t('Suivi')}</th><th>${t('Statut')}</th></tr></thead><tbody>${mine.map(o=>`<tr class="clickable ${o.status==='failed'?'risk':''}" data-a="openOrder" data-id="${o.id}"><td><b>${o.ref}</b></td><td>${custCell(o)}</td><td>${esc(wName(o.wilaya))}</td><td class="r num">${dzd(orderTotal(o))}</td><td>${trackMini(o)}</td><td>${stBadge(o)}</td></tr>`).join('') || emptyRow(6,'Aucune commande confirmée')}</tbody></table></div>`);
  return erpShell('livraisons', t('Mes livraisons'), '', body);
}
function trackMini(o){ const steps=['toprep','sent','transit','delivered']; const map={toprep:0,ready:0,sent:1,picked:1,transit:2,outfor:2,failed:2,delivered:3,paid:3,closed:3,returning:2,returned:2}; const k=map[o.status]; return `<span class="row" style="gap:3px">${steps.map((s,i)=>`<i style="width:22px;height:5px;border-radius:3px;background:${i<=k? (o.status==='failed'&&i===2 || /return/.test(o.status)&&i===2 ?'var(--red)':'var(--green)') :'var(--line)'}"></i>`).join('')}</span>`; }
function viewMyPerf(){
  const a=me(), p=agentPerf(a);
  const ser = dailySeries(14,(x,y)=>ORDERS.filter(o=>o.agentId===a.id && o.times.confirmed>=x && o.times.confirmed<y).length);
  const body = `<div class="kpis">${kpi(t('Commandes traitées'),p.treated)}${kpi(t('Taux de confirmation'),fmtPct(p.confRate))}${kpi(t('Upsell moyen'),'+'+fmtPct(p.upAvg), dzd(p.gain)+' '+t('gagnés'))}${kpi(t('Taux de livraison'),fmtPct(p.delivRate))}${kpi(t('Commission du mois'),dzd(p.commission),'','accent')}</div>
    <div class="g21">${card(t('Confirmations — 14 jours'), `<div class="card-b">${barChart(ser.data.map((v,i)=>({l:ser.labels[i],v})))}</div>`)}${card(t('Calcul de ma commission'), `<div class="card-b sumbox" style="border:0"><div class="ln"><span>${t('Fixe')}</span><span class="num">${dzd(a.fixed)}</span></div><div class="ln"><span>${p.deliv} ${t('livrées')} × ${dzd(a.perDelivery)}</span><span class="num">${dzd(p.deliv*a.perDelivery)}</span></div><div class="ln"><span>${t('Bonus upsell')} (${a.upsellPct} % ${t('de')} ${dzd(p.gain)})</span><span class="num">${dzd(Math.round(p.gain*a.upsellPct/100))}</span></div><div class="ln tot"><span>${t('Total estimé')}</span><span class="num">${dzd(a.fixed+p.commission)}</span></div></div>`)}</div>
    <div class="lock-note">${ic('lock','sm')} ${t('Vous ne voyez pas les prix d\'achat, les marges ni les commandes des autres agents.')}</div>`;
  return erpShell('perfs', t('Mes performances'), '', body);
}

/* ---------- Fournisseur ---------- */
function viewSupplierDash(){
  const b=supplierBalance(), dues=supplierDues(); const last = SUP_PAYMENTS.slice().sort((a,b)=>b.at-a.at).slice(0,5);
  const toConfirm = SUP_PAYMENTS.filter(p=>!p.confirmedAt);
  const body = `<div class="kpis">${kpi(t('Pending — à régler par PackLik'),dzd(b.due), ORDERS.filter(o=>o.status==='paid').length+' '+t('commandes déjà encaissées par PackLik'),'accent')}${kpi(t('En attente de paiement DHD'),dzd(b.dhd), t('commandes livrées, argent pas encore versé par DHD'))}${kpi(t('En cours de livraison'),dzd(b.road))}${kpi(t('Total reçu'),dzd(b.paid), SUP_PAYMENTS.length+' '+t('paiements'))}${kpi(t('Prochaine échéance'), dues[0]? fDate(dues[0].due):'—', dues[0]? dzd(dues.filter(d=>dayStart(d.due)===dayStart(dues[0].due)).reduce((s,d)=>s+d.rest,0)):'')}</div>
    ${toConfirm.length? `<div class="lock-note">${ic('bell','sm')} ${toConfirm.length} ${t('paiement(s) à confirmer')} <a href="#/erp/paiements" style="margin-inline-start:auto">${t('Voir')} →</a></div>`:''}
    <div class="g2">${card(t('Derniers paiements reçus'), supPaymentsTable(true))}${card(t('Pending — commandes à régler'), supOrderRows(ORDERS.filter(o=>o.status==='paid'),{h:360}), `<a class="btn sm" href="#/erp/paiements">${t('Tout voir')}</a>`)}</div>
    <div class="lock-note">${ic('lock','sm')} ${t('Portail fournisseur : vous ne voyez ni les prix de vente, ni les clients, ni les bénéfices de PackLik.')}</div>`;
  return erpShell('dashboard', t('Portail fournisseur'), esc(SUPPLIERS[0].name), body);
}
S.ui.sp = {tab:'due'};
function viewSupplierPayments(){
  const u=S.ui.sp, b=supplierBalance();
  const lists = {due:ORDERS.filter(o=>o.status==='paid'), dhd:ORDERS.filter(o=>o.status==='delivered'), road:ORDERS.filter(o=>supState(o)==='road'), settled:ORDERS.filter(o=>o.status==='closed').sort((a,b)=>b.times.closed-a.times.closed)};
  const tabs = [['due','Pending — à régler',b.due],['dhd','En attente de paiement DHD',b.dhd],['road','En cours de livraison',b.road],['settled','Payé (validé)',b.paid],['payments','Paiements reçus',null]];
  const body = card('', `<div class="tabs">${tabs.map(([k,l,v])=>`<button class="${u.tab===k?'on':''}" data-a="spTab" data-v="${k}">${t(l)}${v!==null?` <span class="c">${dzd(v)}</span>`:''}</button>`).join('')}</div>
    <div class="card-b small muted" style="padding-bottom:0">${u.tab==='due'? t('PackLik a déjà reçu l\'argent de DHD pour ces commandes : elles seront validées à votre prochain paiement.') : u.tab==='dhd'? t('Commandes livrées au client : DHD n\'a pas encore versé l\'argent à PackLik.') : u.tab==='road'? t('Colis en cours de livraison : montants indicatifs (un colis peut être retourné).') : u.tab==='payments'? t('Chaque paiement contient le détail complet des commandes réglées.') : t('Commandes réglées et validées.')}</div>
    ${u.tab==='payments'? supPaymentsTable(true) : supOrderRows(lists[u.tab])}`, '');
  return erpShell('paiements', t('Paiements et commandes'), t('Votre argent commande par commande'), body, `<button class="btn" data-a="supExport">${ic('download','sm')} Excel</button>`);
}
function viewSupplierPOs(){
  const body = card(t('Bons de commande reçus de PackLik'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('N°')}</th><th>${t('Reçu le')}</th><th>${t('Produits')}</th><th class="r">${t('Montant')}</th><th>${t('Livraison prévue')}</th><th>${t('Statut')}</th><th></th></tr></thead><tbody>${PURCHASES.slice().reverse().map(po=>`<tr><td><b>${po.id}</b></td><td class="small">${fDate(po.created)}</td><td class="small">${po.items.map(i=>i.q+' × '+esc(PBY[i.pid].name)).join('<br>')}</td><td class="r num">${dzd(poTotal(po))}</td><td>${po.status==='sent'? `<input class="input" type="date" style="width:150px;height:32px" id="d_${po.id}" value="${new Date(po.expected).toISOString().slice(0,10)}" aria-label="${t('Date de livraison')}">` : fDate(po.expected)}</td><td><span class="badge ${PO_ST[po.status][1]}">${t(PO_ST[po.status][0])}</span></td><td>${po.status==='sent'?`<button class="btn sm green" data-a="poConfirm" data-id="${po.id}">${ic('check','sm')} ${t('Confirmer quantités et date')}</button>`:''}</td></tr>`).join('')}</tbody></table></div>`);
  return erpShell('bons', t('Bons de commande'), '', body);
}
function viewSupplierDeliveries(){
  const rec = PURCHASES.filter(p=>p.status==='received');
  const body = card(t('Historique des livraisons à PackLik'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Bon')}</th><th>${t('Reçu le')}</th><th>${t('Produit')}</th><th class="r">${t('Commandé')}</th><th class="r">${t('Reçu')}</th><th>${t('Écart')}</th></tr></thead><tbody>${rec.flatMap(po=>po.items.map((i,k)=>`<tr><td>${k?'':'<b>'+po.id+'</b>'}</td><td class="small">${k?'':fDate(po.receivedAt)}</td><td class="small">${esc(PBY[i.pid].name)}</td><td class="r num">${i.q}</td><td class="r num">${i.recv}</td><td>${i.recv<i.q?`<span class="badge red">−${i.q-i.recv}</span>`:`<span class="badge green">OK</span>`}</td></tr>`)).join('')}</tbody></table></div>`);
  return erpShell('receptions', t('Livraisons'), '', body);
}
function viewSupplierStatement(){
  const rows=[]; ORDERS.filter(o=>['paid','closed'].includes(o.status)).forEach(o=>rows.push({at:o.times.paid, type:'due', ref:o.ref, amount:supShare(o)})); SUP_PAYMENTS.forEach(p=>rows.push({at:p.at, type:'pay', ref:p.id, amount:p.amount, mode:p.mode}));
  rows.sort((a,b)=>a.at-b.at); let run=0;
  const body = card(t('Relevé de compte'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Date')}</th><th>${t('Opération')}</th><th>${t('Réf.')}</th><th class="r">${t('Débit')}</th><th class="r">${t('Crédit')}</th><th class="r">${t('Solde')}</th></tr></thead><tbody>${rows.map(r=>{ run += r.type==='due'? r.amount : -r.amount; return `<tr><td class="small">${fDate(r.at)}</td><td>${r.type==='due'?t('Commande encaissée par PackLik (part fournisseur)'):t('Paiement reçu')+' ('+t(r.mode)+')'}</td><td class="small">${r.type==='pay'?`<button class="btn ghost sm" style="padding:0" data-a="supPayView" data-id="${r.ref}">${r.ref}</button>`:r.ref}</td><td class="r num">${r.type==='due'?dzd(r.amount):''}</td><td class="r num up">${r.type==='pay'?dzd(r.amount):''}</td><td class="r num"><b>${dzd(run)}</b></td></tr>`; }).join('')}</tbody></table></div>`, `<button class="btn sm" data-a="printPage">${ic('print','sm')} ${t('Export PDF')}</button>`);
  return erpShell('releve', t('Relevé de compte'), '', body);
}
function viewSupplierSales(){
  if(!SETTINGS.supplierSales) return erpShell('ventes', t('Ventes de mes produits'), '', card('', `<div class="empty">${ic('lock')}<div><b>${t('Option non activée par PackLik')}</b></div><div class="small">${t('L\'Admin peut activer ce partage pour vous aider à anticiper le réapprovisionnement.')}</div></div>`));
  const sold = ORDERS.filter(o=>DELIVERED_ST.includes(o.status) && inPeriod(o.times.delivered));
  const m={}; sold.forEach(o=>expand(o.items).forEach(i=>{ const p=PBY[i.pid]; m[i.pid]=m[i.pid]||{q:0,amt:0,n:0}; m[i.pid].q+=i.q; m[i.pid].amt+=i.q*p.cost; m[i.pid].n++; }));
  const rows = Object.entries(m).sort((a,b)=>b[1].q-a[1].q);
  const {from,to} = periodRange(); const days = Math.max(1, Math.round((to-from)/DAY));
  const ser = []; const labels=[]; for(let d=dayStart(from); d<=to; d+=DAY){ labels.push(new Date(d).getDate()+'/'+(new Date(d).getMonth()+1)); ser.push(sold.filter(o=>o.times.delivered>=d && o.times.delivered<d+DAY).reduce((s,o)=>s+expand(o.items).reduce((a,i)=>a+i.q,0),0)); }
  const body = `<div class="card card-b row wrap">${periodFilter(true)}</div>
    <div class="kpis">${kpi(t('Unités vendues'), nf(rows.reduce((s,r)=>s+r[1].q,0)))}${kpi(t('Montant (prix fournisseur)'), dzd(rows.reduce((s,r)=>s+r[1].amt,0)))}${kpi(t('Commandes livrées'), sold.length)}${kpi(t('Moyenne par jour'), (rows.reduce((s,r)=>s+r[1].q,0)/days).toFixed(1).replace('.',',')+' '+t('unités'))}</div>
    ${labels.length>1? card(t('Unités vendues par jour'), `<div class="card-b">${barChart(ser.map((v,i)=>({l:labels[i],v})).slice(-31),{w:1100})}</div>`):''}
    ${card(t('Détail par produit'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Produit')}</th><th class="r">${t('Unités vendues')}</th><th class="r">${t('Commandes')}</th><th class="r">${t('Montant (prix fournisseur)')}</th><th class="r">${t('Stock restant chez PackLik')}</th><th class="r">${t('Couverture')}</th></tr></thead><tbody>${rows.map(([pid,v])=>{ const s=stockInfo(+pid).available; const per=v.q/days; return `<tr><td><b class="small">${esc(PBY[pid].name)}</b></td><td class="r num">${v.q}</td><td class="r num">${v.n}</td><td class="r num">${dzd(v.amt)}</td><td class="r num">${s}</td><td class="r num ${per&&s/per<14?'down':''}">${per? Math.round(s/per)+' '+t('j'):'—'}</td></tr>`; }).join('') || emptyRow(6,'Aucune vente sur la période')}</tbody></table></div>`, `<button class="btn sm" data-a="supSalesCsv">${ic('download','sm')} Excel</button>`)}`;
  return erpShell('ventes', t('Ventes de mes produits'), t('Quantités livrées aux clients sur la période choisie'), body);
}

/* ============================================================
   MODULES : Livraison (sociétés + mes livreurs), Pixels, hub Modules
   ============================================================ */
S.ui.liv = {tab:'carriers', feeCar:'dhd'};
function carrierCard(c){
  const on = c.connected;
  const field = (k,l,type,extra)=>`<div class="field"><label for="c_${c.id}_${k}">${t(l)}</label><input class="input" id="c_${c.id}_${k}" type="${type||'text'}" value="${esc(c[k]??'')}" data-ch="carField" data-id="${c.id}" data-k="${k}" ${extra||''}></div>`;
  return `<div class="card" style="${c.isDefault?'border-color:var(--kraft-d);box-shadow:0 0 0 3px rgba(184,135,90,.15)':''}">
    <div class="card-h"><div class="row"><span class="avatar" style="background:${c.color};color:#fff">${esc(c.short.slice(0,2))}</span><div><h3>${esc(t(c.name))}</h3><div class="xs muted">${c.internal? t('Vos propres livreurs') : (c.desk? t('Domicile + bureau (stop desk)') : t('Domicile uniquement'))} · COD</div></div></div>
      <div class="row">${c.isDefault? `<span class="badge kraft">${t('Par défaut')}</span>`:''}<span class="badge ${on?'green':''}">${on? t('Connectée') : t('Non connectée')}</span></div></div>
    <div class="card-b col" style="gap:10px">
      ${c.internal? `<div class="small muted">${t('Pas de clé API : vos livreurs utilisent l\'ERP. Zones')} : ${(c.wilayas||[]).map(w=>esc(wName(w))).join(', ')}</div>` : `<div class="grid2">${field('apiKey','Clé API / Token','text','autocomplete="off"')}${c.id==='dhd'? field('apiUrl','URL de l\'API') : field('apiId','ID API (si demandé)')}</div>`}
      <div class="grid3">${field('baseKg','Poids inclus (kg)','number','min="0" step="0.5"')}${field('extraPerKg','Prix par kg en plus (DZD)','number','min="0"')}${field('maxParcelKg','Poids max par colis (kg)','number','min="1"')}</div>
      <div class="row wrap"><label class="check small"><input type="checkbox" ${c.chargeOverweight?'checked':''} data-ch="carBool" data-id="${c.id}" data-k="chargeOverweight"> ${t('Facturer le surpoids au client')}</label><label class="row small">${t('Coefficient tarifaire')} <input class="input" type="number" step="0.05" style="width:80px;height:32px" value="${c.feeFactor}" data-ch="carField" data-id="${c.id}" data-k="feeFactor"></label></div>
      <div class="row wrap">${on? `${c.internal?'':`<button class="btn sm" data-a="carTest" data-id="${c.id}">${ic('refresh','sm')} ${t('Tester la connexion')}</button><button class="btn sm" data-a="carSync" data-id="${c.id}">${ic('download','sm')} ${t('Importer la grille tarifaire')}</button>`}${c.isDefault?'':`<button class="btn sm" data-a="carDefault" data-id="${c.id}">${t('Définir par défaut')}</button>`}${c.internal||c.isDefault?'':`<button class="btn sm ghost" data-a="carOff" data-id="${c.id}">${t('Déconnecter')}</button>`}` : `<button class="btn sm primary" data-a="carOn" data-id="${c.id}">${ic('zap','sm')} ${t('Connecter')}</button>`}
        ${on&&!c.internal&&c.lastSync? `<span class="xs muted">${t('Dernière synchro')} ${fTime(c.lastSync)}</span>`:''}</div>
    </div></div>`;
}
function viewDelivery(){
  const u=S.ui.liv; const tabs=[['carriers','Sociétés de livraison'],['couriers','Mes livreurs'],['rules','Règles d\'attribution'],['fees','Tarifs par wilaya']];
  let inner='';
  if(u.tab==='carriers') inner = `<div class="card-b small muted" style="padding-bottom:0">${t('Connectez une société avec sa clé API : l\'ERP crée les envois, récupère les étiquettes, suit les statuts et importe les versements automatiquement.')}</div><div class="card-b g2">${CARRIERS.map(carrierCard).join('')}</div>`;
  if(u.tab==='couriers'){
    const jobs = ORDERS.filter(o=>carrierOf(o).internal && ['sent','picked','transit','outfor','failed'].includes(o.status));
    const today = dayStart(Date.now());
    inner = `<div class="card-b row wrap between"><span class="small muted">${t('Vos livreurs livrent à Alger et environs. Ils encaissent le client et vous remettent l\'argent.')}</span><button class="btn sm primary" data-a="courierEdit" data-id="0">${ic('plus','sm')} ${t('Ajouter un livreur')}</button></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Livreur')}</th><th>${t('Téléphone')}</th><th>${t('Véhicule')}</th><th>${t('Zones')}</th><th>${t('Statut')}</th><th class="r">${t('En cours')}</th><th class="r">${t('Livrées aujourd\'hui')}</th><th class="r">${t('Argent en main')}</th><th></th></tr></thead><tbody>
    ${COURIERS.map(cu=>{ const cash=courierCash(cu.id); return `<tr><td><b>${esc(cu.name)}</b><div class="xs muted">${dzd(cu.perDelivery)} / ${t('livraison')}</div></td><td dir="ltr" class="small">${cu.phone}</td><td class="small">${t(cu.vehicle)}</td><td class="small wrapc">${cu.zones.map(w=>esc(wName(w))).join(', ')}${cu.communes.length?`<div class="xs muted">${cu.communes.map(cName).join(', ')}</div>`:''}</td><td><div class="seg"><button class="${cu.online?'on':''}" data-a="courierState" data-id="${cu.id}" data-v="1">${t('En service')}</button><button class="${!cu.online?'on':''}" data-a="courierState" data-id="${cu.id}" data-v="0">${t('Repos')}</button></div></td><td class="r num">${jobs.filter(o=>o.courierId===cu.id).length}</td><td class="r num">${ORDERS.filter(o=>o.courierId===cu.id && (o.times.delivered||0)>=today).length}</td><td class="r num"><b class="${cash?'down':''}">${dzd(cash)}</b></td><td><div class="row" style="gap:4px;flex-wrap:nowrap">${cash?`<button class="btn sm green" data-a="courierCash" data-id="${cu.id}">${ic('cash','sm')} ${t('Encaisser')}</button>`:''}<button class="btn icon sm ghost" data-a="courierEdit" data-id="${cu.id}" aria-label="${t('Modifier')}">${ic('edit','sm')}</button></div></td></tr>`; }).join('')}
    </tbody></table></div>
    <div class="card-h" style="border-top:1px solid var(--line2)"><h3>${t('Courses en cours')}</h3><span class="badge">${jobs.length}</span></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Commande')}</th><th>${t('Client')}</th><th>${t('Adresse')}</th><th class="r">${t('À encaisser')}</th><th>${t('Livreur')}</th><th>${t('Statut')}</th><th>${t('Actions')}</th></tr></thead><tbody>
    ${jobs.map(o=>`<tr><td><button class="btn ghost sm" style="padding:0;font-weight:800" data-a="openOrder" data-id="${o.id}">${o.ref}</button></td><td>${custCell(o)}<div class="xs">${phoneCell(o)}</div></td><td class="small wrapc">${esc(o.address)}, ${esc(cName(o.commune))}</td><td class="r num"><b>${dzd(orderTotal(o))}</b></td><td><select class="select" style="width:auto;height:30px" data-ch="jobCourier" data-id="${o.id}" aria-label="${t('Livreur')}"><option value="">—</option>${COURIERS.filter(x=>x.active).map(x=>`<option value="${x.id}" ${o.courierId===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></td><td>${stBadge(o)}</td><td><div class="row" style="gap:4px;flex-wrap:nowrap"><button class="btn sm green" data-a="jobDone" data-id="${o.id}">${ic('check','sm')} ${t('Livrée')}</button><button class="btn sm" data-a="jobFail" data-id="${o.id}">${ic('alert','sm')} ${t('Échec')}</button></div></td></tr>`).join('') || emptyRow(7,'Aucune course en cours','truck')}
    </tbody></table></div>`;
  }
  if(u.tab==='rules') inner = `<div class="card-b col" style="gap:12px">
    <div class="small muted">${t('Choisissez automatiquement la société selon la wilaya. Sinon, la société par défaut est utilisée.')}</div>
    <div class="row between sumbox"><span><b>${t('Société par défaut')}</b></span><select class="select" style="width:auto" data-ch="carDefaultSel">${CARRIERS.filter(c=>c.connected).map(c=>`<option value="${c.id}" ${c.isDefault?'selected':''}>${esc(t(c.name))}</option>`).join('')}</select></div>
    ${(SETTINGS.carrierRules||[]).map((r,i)=>`<div class="row between sumbox"><span>${t('Wilaya')} <b>${esc(wName(+r.wilaya))}</b> → <b>${esc(t(CRB[r.carrier].name))}</b></span><button class="btn icon sm ghost" data-a="carRuleDel" data-i="${i}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button></div>`).join('')}
    <div class="row wrap"><select class="select" id="crW" style="width:auto">${WILAYAS.map(w=>`<option value="${w.id}">${w.code} - ${esc(wName(w.id))}</option>`).join('')}</select><select class="select" id="crC" style="width:auto">${CARRIERS.filter(c=>c.connected).map(c=>`<option value="${c.id}">${esc(t(c.name))}</option>`).join('')}</select><button class="btn sm" data-a="carRuleAdd">${ic('plus','sm')} ${t('Ajouter la règle')}</button></div>
  </div>`;
  if(u.tab==='fees'){ const c=CRB[u.feeCar]||CRB.dhd; inner = `<div class="filters-bar"><label class="row small">${t('Société')} <select class="select" data-ch="feeCar">${CARRIERS.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${esc(t(x.name))}</option>`).join('')}</select></label><span class="small muted">${t('Coefficient')} ${c.feeFactor} · ${t('poids inclus')} ${c.baseKg} kg · +${dzd(c.extraPerKg||0)}/kg</span></div><div class="tbl-wrap" style="max-height:560px"><table class="tbl"><thead><tr><th>${t('Code')}</th><th>${t('Wilaya')}</th><th class="r">${t('Client domicile')}</th><th class="r">${t('Client bureau')}</th><th class="r">${t('Coût domicile')}</th><th class="r">${t('Coût bureau')}</th></tr></thead><tbody>${WILAYAS.map(w=>{ const o={wilaya:w.id}; return `<tr><td class="num">${w.code}</td><td>${esc(wName(w.id))}</td><td class="r num">${dzd(baseClientFee({...o,delivery:'home'},c))}</td><td class="r num">${c.desk? dzd(baseClientFee({...o,delivery:'desk'},c)) : '—'}</td><td class="r num">${dzd(baseShip({...o,delivery:'home'},c))}</td><td class="r num">${c.desk? dzd(baseShip({...o,delivery:'desk'},c)) : '—'}</td></tr>`; }).join('')}</tbody></table></div>`; }
  const body = card('', `<div class="tabs">${tabs.map(([k,l])=>`<button class="${u.tab===k?'on':''}" data-a="livTab" data-v="${k}">${t(l)}</button>`).join('')}</div>${inner}`);
  return erpShell('livraison', t('Livraison'), t('Sociétés de livraison, vos livreurs et le poids des colis'), body);
}

/* ---------- Pixels Facebook + TikTok ---------- */
function pixelBlock(platform){
  const list = PIXELS.filter(p=>p.platform===platform); const ev = PIXEL_EVENTS[platform];
  const logo = platform==='facebook'? `<span class="avatar" style="background:#1877F2;color:#fff">f</span>` : `<span class="avatar" style="background:#111;color:#fff">♪</span>`;
  return card(`<span class="row">${logo} ${platform==='facebook'? 'Facebook / Meta Pixel' : 'TikTok Pixel'}</span>`, `<div class="card-b col" style="gap:10px">
    ${list.map(p=>`<div class="sumbox col" style="gap:8px"><div class="row between"><b>${esc(p.name)}</b><label class="check small"><input type="checkbox" ${p.active?'checked':''} data-ch="pxActive" data-id="${p.id}"> ${p.active?t('Actif'):t('Inactif')}</label></div>
      <div class="grid2"><div class="field"><label>${t('ID du pixel')}</label><input class="input" value="${esc(p.pixelId)}" data-ch="pxField" data-id="${p.id}" data-k="pixelId" dir="ltr"></div><div class="field"><label>${platform==='facebook'? t('Token API de conversions') : t('Token Events API')}</label><input class="input" value="${esc(p.token)}" data-ch="pxField" data-id="${p.id}" data-k="token" dir="ltr" placeholder="${t('facultatif mais recommandé')}"></div></div>
      <div class="row wrap"><label class="row small">${t('Code de test')} <input class="input" style="width:130px;height:32px" value="${esc(p.testCode)}" data-ch="pxField" data-id="${p.id}" data-k="testCode" dir="ltr"></label><span class="grow"></span><button class="btn sm" data-a="pxTest" data-id="${p.id}">${ic('send','sm')} ${t('Envoyer un événement test')}</button><button class="btn icon sm ghost" data-a="pxDel" data-id="${p.id}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button></div></div>`).join('') || `<div class="empty">${t('Aucun pixel')}</div>`}
    <button class="btn sm" data-a="pxAdd" data-v="${platform}">${ic('plus','sm')} ${t('Ajouter un pixel')}</button>
    <div><div class="small" style="font-weight:700;margin-bottom:6px">${t('Événements envoyés')}</div><div class="row wrap">${Object.keys(ev).map(k=>`<label class="chipf ${ev[k]?'on':''}" style="cursor:pointer"><input type="checkbox" ${ev[k]?'checked':''} data-ch="pxEvent" data-p="${platform}" data-k="${k}" style="display:none"> ${k}</label>`).join('')}</div></div>
  </div>`);
}
function viewPixels(){
  const log = (S.pixel||[]).slice(0,40);
  const body = `<div class="g2">${pixelBlock('facebook')}${pixelBlock('tiktok')}</div>
    ${card(t('Quand envoyer l\'achat (Purchase) ?'), `<div class="card-b col" style="gap:8px">${[['order','À la commande sur le site'],['confirmed','Quand l\'agent confirme la commande (recommandé en COD)'],['delivered','Quand la commande est livrée']].map(([k,l])=>`<label class="check"><input type="radio" name="pon" value="${k}" ${SETTINGS.purchaseOn===k?'checked':''} data-ch="purchaseOn"> ${t(l)}</label>`).join('')}<label class="check small"><input type="checkbox" ${SETTINGS.dedup?'checked':''} data-ch="pxDedup"> ${t('Dédoublonnage navigateur + serveur (event_id)')}</label><div class="xs muted">${t('En paiement à la livraison, envoyer l\'achat à la confirmation apprend aux publicités à trouver des clients qui confirment vraiment.')}</div></div>`)}
    ${card(t('Journal des événements (session)'), `<div class="tbl-wrap" style="max-height:380px"><table class="tbl"><thead><tr><th>${t('Heure')}</th><th>${t('Plateforme')}</th><th>${t('Pixel')}</th><th>${t('Événement')}</th><th class="r">${t('Valeur')}</th><th>${t('Envoi')}</th></tr></thead><tbody>${log.map(e=>`<tr><td class="small">${fTime(e.at)}</td><td>${e.platform==='facebook'?'<span class="badge blue">Facebook</span>':'<span class="badge dark">TikTok</span>'}</td><td class="small">${esc(e.pixel)}</td><td><b>${e.ev}</b>${e.test?` <span class="badge amber">test ${esc(e.test)}</span>`:''}</td><td class="r num">${e.data&&e.data.value? dzd(e.data.value):'—'}</td><td class="small">${t('Navigateur')}${e.server?' + '+t('Serveur'):''}</td></tr>`).join('') || emptyRow(6,'Aucun événement : visitez la boutique ou passez une commande','zap')}</tbody></table></div>`, `<a class="btn sm" href="#/">${ic('store','sm')} ${t('Ouvrir la boutique')}</a>`)}`;
  return erpShell('pixels', t('Pixels Facebook et TikTok'), t('Suivi des publicités : navigateur + API serveur'), body);
}

/* ---------- Hub Modules ---------- */
const MODULE_LIST = [
  ['delivery','truck','Sociétés de livraison','DHD, Yalidine, ZR Express, Maystro, Noest, EcoTrack… : envois, étiquettes, suivi et versements.','#/erp/livraison'],
  ['couriers','user','Mes livreurs','Vos propres livreurs : courses, encaissement, remise de la caisse.','#/erp/livraison'],
  ['weight','layers','Poids et découpage des colis','Poids calculé par commande, surpoids facturé, découpage automatique en plusieurs colis.','#/erp/livraison'],
  ['pixels','target','Pixels Facebook et TikTok','Plusieurs pixels, API de conversions, choix du moment de l\'achat.','#/erp/pixels'],
  ['upsell','zap','Upsell au téléphone','Suggestions par catégorie dans l\'écran d\'appel, gain crédité à l\'agent.','#/erp/confirmer'],
  ['assignment','shuffle','Répartition automatique','Tour de rôle, charge, performance ou règles.','#/erp/repartition'],
  ['blacklist','flag','Liste noire et doublons','Badge après 1 refus, liste noire après 2 retours, doublons 24 h.','#/erp/clients'],
  ['whatsapp','wa','WhatsApp','Boutons WhatsApp, messages automatiques (API en v2).','#/erp/parametres'],
];
function viewModules(){
  const body = `<div class="small muted">${t('Activez ou désactivez chaque module en un clic. Un module désactivé disparaît des menus.')}</div>
  <div class="g3" style="grid-template-columns:repeat(auto-fill,minmax(270px,1fr))">${MODULE_LIST.map(([k,i,l,d,href])=>{ const on=SETTINGS.modules[k]; return `<div class="card card-b col" style="gap:10px;${on?'':'opacity:.75'}"><div class="row between"><span class="avatar" style="background:${on?'var(--kraft-l)':'var(--line2)'}">${ic(i,'sm')}</span><label class="check small"><input type="checkbox" ${on?'checked':''} data-ch="modToggle" data-k="${k}"> ${on?t('Activé'):t('Désactivé')}</label></div><b>${t(l)}</b><span class="small muted grow">${t(d)}</span>${on?`<a class="btn sm" href="${href}">${ic('gear','sm')} ${t('Configurer')}</a>`:''}</div>`; }).join('')}</div>`;
  return erpShell('modules', t('Modules'), t('Tout se configure ici, simplement'), body);
}

/* Traductions anglaises et arabes (générées depuis tr/*.tsv) */
Object.assign(EN, {"(souvent pris ensemble).": "(often bought together).", "1 refus": "1 refusal", "100 % du coût d'achat ; ne sort que pour payer le fournisseur": "100% of purchase cost; only used to pay the supplier", "2 retours ou plus": "2 or more returns", "2e numéro": "2nd number", "2e numéro (facultatif)": "2nd number (optional)", "3 tentatives échouées": "3 failed attempts", "3 tentatives échouées — risque de retour": "3 failed attempts — return risk", "30 jours": "30 days", "4 produits maximum": "4 products maximum", "7 jours": "7 days", "91 produits · 17 catégories repris de packlik.shop": "91 products · 17 categories from packlik.shop", "Abîmé — passer en casse": "Damaged — write off", "Accorder l'avance": "Grant the advance", "accordée": "granted", "Accueil": "Home", "Accès portail actif": "Portal access active", "achat": "purchase", "Achats": "Purchasing", "Achats fournisseur": "Supplier purchases", "Acheter": "Shop now", "actif": "active", "Actif": "Active", "Action": "Action", "Action PackLik": "PackLik action", "Action requise": "Required action", "Actions": "Actions", "Activer": "Enable", "Actualiser": "Refresh", "Actualiser DHD": "Refresh DHD", "Admin": "Admin", "Adresse": "Address", "Adresse corrigée et transmise à DHD": "Address corrected and sent to DHD", "Adresse incorrecte": "Wrong address", "Adresse introuvable, pas de repère": "Address not found, no landmark", "Agenda des rappels": "Callback calendar", "Agent": "Agent", "Agent de confirmation": "Confirmation agent", "Agent en pause : ses commandes non traitées retournent dans la file commune.": "Agent on break: their unprocessed orders go back to the shared queue.", "Agent responsable": "Responsible agent", "Agent — commissions du mois": "Agent — monthly commissions", "Agents en ligne": "Agents online", "Agents, poids et quotas": "Agents, weights and quotas", "Ajouter": "Add", "Ajouter au panier": "Add to cart", "Ajouter aux favoris": "Add to favorites", "Ajouter un membre": "Add a member", "Ajouter un produit": "Add a product", "Ajouter un produit (recherche)…": "Add a product (search)…", "Ajouter une dépense": "Add an expense", "Ajoutez au moins une ligne": "Add at least one line", "Ajouté": "Added", "Ajouté au panier": "Added to cart", "Ajouté à la comparaison": "Added to comparison", "ajustement": "adjustment", "Ajustement": "Adjustment", "Ajuster": "Adjust", "Ajuster le stock": "Adjust stock", "Alerte Gérant ; réclamation DHD": "Alert operations manager; DHD claim", "Alerte Manager ; vérifier un 2e numéro": "Alert manager; check a 2nd number", "Alertes": "Alerts", "Anglais": "English", "Annulation d'une commande confirmée ou expédiée : Manager ou Gérant, motif obligatoire.": "Cancelling a confirmed or shipped order: Manager or Operations manager, reason required.", "Annuler": "Cancel", "Annuler (motif obligatoire)": "Cancel (reason required)", "Annuler la commande": "Cancel order", "Annuler les doublons": "Cancel duplicates", "Annulée": "Cancelled", "annulée": "cancelled", "Annulées": "Cancelled", "Appel en cours": "Call in progress", "Appeler": "Call", "Appeler pour connaître la raison et sauver la vente": "Call to find the reason and save the sale", "Appels": "Calls", "Appels par commande": "Calls per order", "Après 3 tentatives échouées : « Risque de retour », remonte en rouge chez le Manager.": "After 3 failed attempts: \"Return risk\", flagged red for the Manager.", "après fournisseur, DHD, pub, commissions": "after supplier, DHD, ads, commissions", "après paiement DHD": "after DHD payment", "Arabe (RTL)": "Arabic (RTL)", "Archiver": "Archive", "archivé": "archived", "Argent chez DHD": "Money held by DHD", "Argent en attente chez DHD": "Money pending at DHD", "Argent en route (× taux de livraison)": "Money on the way (× delivery rate)", "Attribution automatique active": "Auto-assignment on", "Attribution automatique suspendue": "Auto-assignment paused", "au": "to", "Au-delà de": "Above", "au-delà validation Admin.": "above that, Admin approval.", "Aucun cas difficile": "No difficult cases", "Aucun colis livré en attente de versement": "No delivered parcels awaiting payment", "Aucun doublon dans la sélection": "No duplicates in the selection", "Aucun envoi aujourd'hui": "No shipments today", "Aucun favori": "No favorites", "Aucun produit": "No products", "Aucun produit trouvé": "No products found", "Aucun rappel programmé": "No scheduled callbacks", "Aucune alerte": "No alerts", "Aucune commande en attente": "No pending orders", "Aucune commande pour le moment": "No orders yet", "Aucune commande à régler": "No orders to settle", "Aucune mise à jour DHD depuis": "No DHD update for", "Aucune notification. Passez une commande sur la boutique pour la voir arriver ici.": "No notifications. Place an order in the shop to see it arrive here.", "Aucune tentative échouée pour cette commande": "No failed attempts for this order", "aucune vente depuis 30 jours": "no sales for 30 days", "Audience Meta": "Meta audience", "aujourd'hui": "today", "Aujourd'hui": "Today", "Auteur": "Author", "auto toutes les": "auto every", "Autoriser « commande sur demande » pour les ruptures": "Allow \"order on request\" for out-of-stock items", "Autre": "Other", "Avance bloquée : une échéance fournisseur deviendrait impossible à tenir.": "Advance blocked: a supplier due date could no longer be met.", "Avance pub": "Ad advance", "Avance pub reçue": "Ad advance received", "Avance pub sur la réserve fournisseur": "Ad advance from the supplier reserve", "Avant envoi, l'ERP vérifie : stock, téléphone valide, wilaya et commune.": "Before shipping, the ERP checks: stock, valid phone, wilaya and commune.", "Badge après 1 refus ; liste noire après 2 retours.": "Badge after 1 refusal; blacklist after 2 returns.", "Bannière 1 (AR)": "Banner 1 (AR)", "Bannière 2 (AR)": "Banner 2 (AR)", "Basée sur les ventes des 14 derniers jours et le seuil d'alerte.": "Based on the last 14 days of sales and the alert threshold.", "bloqué +48 h": "stuck 48h+", "bloqué(s)": "blocked", "Bloquée : l'échéance fournisseur du": "Blocked: the supplier due date of", "Bon": "PO", "Bon de préparation": "Picking list", "Bon de préparation groupé": "Grouped picking list", "Bon de préparation groupé (picking)": "Grouped picking list", "Bonjour": "Hello", "Bons de commande": "Purchase orders", "Bons de commande fournisseur": "Supplier purchase orders", "Bons de commande reçus de PackLik": "Purchase orders from PackLik", "Bons de commande, réceptions et suggestions": "Purchase orders, receipts and suggestions", "Bonus upsell": "Upsell bonus", "Bordereau": "Handover slip", "Bordereau de remise": "Handover slip", "Bordereau de remise DHD": "DHD handover slip", "Boutique": "Shop", "Boîtes écrasées (humidité)": "Crushed boxes (humidity)", "Boîtes, barquettes, bowls, sacs craft et papier imprimés à votre logo, pour restaurants, fast-foods et pâtisseries.": "Boxes, trays, bowls, kraft bags and paper printed with your logo, for restaurants, fast-food outlets and pastry shops.", "Brut": "Gross", "Budget pub": "Ad budget", "Bureau DHD": "DHD office", "Bureau DHD (stop desk)": "DHD office (stop desk)", "Bénéfice net": "Net profit", "Bénéfice net du jour = CA des colis livrés ce jour − coût fournisseur − frais DHD − commissions − dépense pub réelle du jour − frais des retours. Les livraisons et versements viennent de DHD, la pub de Meta Ads.": "Daily net profit = revenue of parcels delivered that day − supplier cost − DHD fees − commissions − actual ad spend that day − return costs. Deliveries and payouts come from DHD, ad spend from Meta Ads.", "Bénéfice net par jour (date de livraison)": "Net profit per day (delivery date)", "CA": "Revenue", "CA livré": "Delivered revenue", "CA livré (k DZD)": "Delivered revenue (k DZD)", "Caisse": "Cash box", "Caisse de sécurité": "Safety fund", "Caisse de sécurité (% du bénéfice)": "Safety fund (% of profit)", "Calcul de ma commission": "My commission breakdown", "calculée selon la wilaya": "calculated by wilaya", "Calendrier des échéances fournisseur (30 j)": "Supplier due dates (30 days)", "Campagne": "Campaign", "Cas difficiles": "Difficult cases", "Cas particuliers": "Special cases", "Casse": "Breakage", "casse": "breakage", "Catégorie": "Category", "Catégories": "Categories", "Catégories (17)": "Categories (17)", "Catégories populaires": "Popular categories", "CCP": "CCP", "Ce client a déjà refusé un colis.": "This customer has already refused a parcel.", "Ce mois": "This month", "Ce pack est composé sur mesure : contactez-nous pour un devis.": "This pack is made to measure: contact us for a quote.", "Centre d'appel": "Call center", "Cette commande est assignée à un autre agent.": "This order is assigned to another agent.", "Changer de rôle": "Switch role", "Changer l'adresse": "Change address", "Chaque commande est confirmée par téléphone par un agent PackLik avant expédition.": "Every order is confirmed by phone by a PackLik agent before shipping.", "Chaque jour : pub, chiffre d'affaires et bénéfice net": "Every day: ads, revenue and net profit", "Chaque nouvelle commande est attribuée en moins de 5 secondes à un agent en ligne.": "Each new order is assigned to an online agent in under 5 seconds.", "Chaque paiement contient le détail complet des commandes réglées.": "Each payment includes the full details of the settled orders.", "Chaque tentative est rattachée à l'agent qui a confirmé : son taux de livraison en dépend.": "Each attempt is linked to the agent who confirmed the order: it affects their delivery rate.", "Charge la plus faible": "Lowest workload", "Charges (loyer, emballage, transport, divers)": "Overheads (rent, packaging, transport, misc.)", "Chez DHD": "At DHD", "Choisir une option": "Choose an option", "Choisissez un agent": "Choose an agent", "Classement": "Ranking", "Classement et objectifs": "Ranking and goals", "Client": "Customer", "Client absent": "Customer absent", "Client connu : sa commande va à l'agent qui l'a déjà servi, s'il est disponible.": "Returning customer: the order goes to the agent who served them before, if available.", "Client injoignable": "Customer unreachable", "Client injoignable (SMS/WhatsApp)": "Customer unreachable (SMS/WhatsApp)", "Client ne répond pas": "Customer not answering", "client rappelé, relivraison demandée": "customer called back, redelivery requested", "Client reporté": "Customer postponed", "Clients": "Customers", "Cliquez sur une commande pour ouvrir l'écran d'appel": "Click an order to open the call screen", "Clé API DHD": "DHD API key", "Clôture mensuelle": "Month-end close", "Clôturer": "Close", "Clôturé": "Closed", "Clôturée": "Closed", "Cmd": "Orders", "Cochez au moins une commande": "Tick at least one order", "Cochez ensuite les permissions case par case dans la matrice.": "Then tick the permissions one by one in the matrix.", "Cochez les colis payés par ce versement. La répartition dans les 4 caisses est déclenchée automatiquement.": "Tick the parcels paid by this payout. The split across the 4 cash boxes runs automatically.", "Cochez les commandes que vous réglez. Elles seront validées (clôturées) et le fournisseur recevra le détail complet de chaque commande.": "Tick the orders you are paying for. They will be validated (closed) and the supplier will receive the full details of each order.", "Code": "Code", "colis": "parcels", "Colis abîmé au dépôt": "Parcel damaged at the depot", "Colis bloqué +48 h": "Parcel stuck 48h+", "colis bloqué(s) +48 h sans mise à jour DHD": "parcel(s) stuck 48h+ with no DHD update", "colis chez DHD": "parcels at DHD", "Colis en cours de livraison : montants indicatifs (un colis peut être retourné).": "Parcels being delivered: indicative amounts (a parcel may be returned).", "Colis endommagé": "Damaged parcel", "colis envoyé(s) à DHD": "parcel(s) sent to DHD", "Colis expédié": "Parcel shipped", "colis expédiés non livrés": "shipped parcels not yet delivered", "Colis immobile plus de 48 h sans mise à jour DHD : alerte « colis bloqué ».": "Parcel idle for 48h+ with no DHD update: \"stuck parcel\" alert.", "Colis intact": "Parcel intact", "colis livrés en attente de versement": "delivered parcels awaiting payout", "Colis payés": "Parcels paid", "Colis prêts à envoyer à DHD": "Parcels ready to send to DHD", "colis rapprochés, caisses mises à jour": "parcels reconciled, cash boxes updated", "Colis à risque": "Parcels at risk", "Collez ici le message WhatsApp / Messenger…": "Paste the WhatsApp / Messenger message here…", "Colonnes : SKU, Nom FR, Nom AR, Catégories, Prix vente, Prix achat, Conditionnement, Stock, Seuil": "Columns: SKU, FR name, AR name, Categories, Sale price, Purchase price, Pack size, Stock, Threshold", "Commande": "Order", "Commande 1 → agent A, commande 2 → agent B…": "Order 1 → agent A, order 2 → agent B…", "Commande créée": "Order created", "Commande d'un autre agent": "Another agent's order", "Commande encaissée par PackLik (part fournisseur)": "Order collected by PackLik (supplier share)", "Commande suivante": "Next order", "commande(s) prête(s)": "order(s) ready", "commande(s) renvoyée(s) dans la file commune": "order(s) sent back to the shared queue", "commande(s) réassignée(s)": "order(s) reassigned", "commande(s) réattribuée(s)": "order(s) reassigned", "Commander maintenant": "Order now", "commandes": "orders", "Commandes": "Orders", "commandes antérieures (historique importé)": "earlier orders (imported history)", "Commandes avec tentative échouée — triées par urgence": "Orders with a failed attempt — sorted by urgency", "commandes confirmées non expédiées": "confirmed orders not yet shipped", "Commandes confirmées à préparer": "Confirmed orders to prepare", "Commandes créées": "Orders created", "commandes déjà encaissées par PackLik": "orders already collected by PackLik", "Commandes et CA livré — 30 jours": "Orders and delivered revenue — 30 days", "Commandes livrées": "Delivered orders", "Commandes livrées au client : DHD n'a pas encore versé l'argent à PackLik.": "Orders delivered to the customer: DHD has not paid PackLik yet.", "commandes livrées, argent pas encore reçu": "delivered orders, money not received yet", "commandes livrées, argent pas encore versé par DHD": "delivered orders, not yet paid out by DHD", "commandes livrées, DHD n'a pas encore versé": "delivered orders, DHD has not paid yet", "commandes non traitées depuis +2 h": "orders untouched for 2h+", "Commandes par jour": "Orders per day", "Commandes passées": "Past orders", "commandes payées par DHD": "orders paid by DHD", "Commandes reçues": "Orders received", "Commandes réglées et validées.": "Orders settled and validated.", "commandes sélectionnées": "orders selected", "Commandes traitées": "Orders processed", "Commandes à confirmer": "Orders to confirm", "Commandes à risque, refus, remises à valider": "At-risk orders, refusals, discounts to approve", "commandes à traiter maintenant": "orders to handle now", "Commandé": "Ordered", "Commencer l'appel suivant": "Start next call", "Comment ça marche": "How it works", "Commentaire": "Comment", "Commentaire livreur": "Courier comment", "Commission agent": "Agent commission", "Commission du mois": "Commission this month", "Commission par commande livrée (DZD)": "Commission per delivered order (DZD)", "Commune": "Commune", "commune manquante": "missing commune", "Comparer": "Compare", "Composition": "Contents", "Comptabilité": "Accounting", "Compte de résultat": "Income statement", "Comptes de tiers": "Third-party accounts", "Compté": "Counted", "Conditionnement": "Pack size", "Conditionnement (pièces)": "Pack size (pieces)", "Conditions": "Terms", "Conditions générales de vente": "Terms of sale", "Confirmation": "Confirmation", "Confirmations": "Confirmations", "Confirmations par agent": "Confirmations per agent", "Confirmations — 14 jours": "Confirmations — 14 days", "Confirmer l'annulation": "Confirm cancellation", "Confirmer la commande": "Place order", "Confirmer la réception": "Confirm receipt", "Confirmer quantités et date": "Confirm quantities and date", "confirmé": "confirmed", "Confirmé par le fournisseur": "Confirmed by supplier", "Confirmée": "Confirmed", "confirmée": "confirmed", "Confirmées": "Confirmed", "Connexion": "Log in", "Connexion DHD OK (démo)": "DHD connection OK (demo)", "Connexion téléphone ou e-mail + mot de passe ; 2FA pour l'Admin ; déconnexion après 30 min d'inactivité.": "Login by phone or email + password; 2FA for Admin; sign-out after 30 min of inactivity.", "Contact": "Contact", "Contactez-nous": "Contact us", "Contenu du pack": "Pack contents", "Continuer mes achats": "Continue shopping", "Contrôle qualité — annulations récentes": "Quality control — recent cancellations", "Contrôles": "Checks", "Contrôlez l'état du colis": "Check the parcel's condition", "Conversions API (token)": "Conversions API (token)", "Corriger l'adresse": "Correct the address", "Corriger l'adresse et la transmettre à DHD": "Correct the address and send it to DHD", "Couleur principale": "Primary color", "Couverture": "Coverage", "Coût composants": "Components cost", "Coût d'achat": "Purchase cost", "Coût d'achat fournisseur": "Supplier purchase cost", "Coût DHD bureau": "DHD cost (office)", "Coût DHD domicile": "DHD cost (home)", "Coût par commande livrée": "Cost per delivered order", "Coût par commande reçue": "Cost per received order", "Coût pub alloué = dépense Meta de la période ÷ commandes livrées sur la période.": "Allocated ad cost = Meta spend for the period ÷ orders delivered in the period.", "Coût pub alloué par commande livrée (DZD)": "Allocated ad cost per delivered order (DZD)", "Coût pub alloué à la commande": "Ad cost allocated to the order", "Création d'envoi par API, étiquettes et bordereau": "Shipment creation via API, labels and handover slip", "Crédit": "Credit", "Créer": "Create", "Créer la commande": "Create order", "Créer un bon depuis les suggestions": "Create a PO from suggestions", "Créer une équipe": "Create a team", "Créé le": "Created on", "créée": "created", "Créées": "Created", "dans": "in", "dans le panier": "in cart", "Date": "Date", "Date de livraison": "Delivery date", "Date de remboursement": "Repayment date", "Date et heure": "Date and time", "Date invalide": "Invalid date", "Date souhaitée par le client": "Date requested by customer", "de": "of", "De": "From", "de confirmation": "confirmation rate", "de la réserve": "of the reserve", "de PackLik. Vous avez commandé": "from PackLik. You ordered", "de pertes": "in losses", "de pertes estimées": "estimated losses", "Demander sur WhatsApp": "Ask on WhatsApp", "Demander un devis": "Request a quote", "Derniers paiements reçus": "Latest payments received", "dernière": "last", "Dernière commande": "Last order", "Dernière mise à jour": "Last update", "des dépenses Meta (30 j) couvertes par les bénéfices, sans avance ni apport.": "of Meta spend (30 days) covered by profits, with no advance or capital injection.", "Des packs complets prêts à l'emploi pour démarrer votre service à emporter au meilleur prix.": "Complete ready-to-use packs to launch your takeaway service at the best price.", "Description SEO": "SEO description", "Desservie": "Served", "Destinataire": "Recipient", "Dette fournisseur": "Supplier debt", "Dette salariale": "Payroll liability", "dettes échues sous 3 j": "debts due within 3 days", "deviendrait impossible à tenir": "could no longer be met", "devis": "quote", "DHD synchronisé": "DHD synced", "DHD verse l'argent : la part fournisseur passe en « Pending — à régler » chez le fournisseur.": "DHD pays out: the supplier share moves to \"Pending — to settle\" on the supplier side.", "dispo": "avail.", "Dispo": "Avail.", "Disponibilité": "Availability", "Disponible": "Available", "Disponible = physique − réservé": "Available = physical − reserved", "disponibles": "available", "Divers": "Miscellaneous", "Domicile": "Home", "dormant": "dormant", "Dormants (30 j)": "Dormant (30 days)", "Doublon": "Duplicate", "Doublon probable": "Probable duplicate", "Doublon probable : même téléphone et mêmes produits en moins de 24 h.": "Probable duplicate: same phone and same products within 24h.", "doublon(s) annulé(s)": "duplicate(s) cancelled", "Du": "From", "du bénéfice net ; l'Admin décide": "of net profit; Admin decides", "du bénéfice net, plafond": "of net profit, cap", "Dupliquer": "Duplicate", "Débit": "Debit", "Délai": "Deadline", "délai": "terms", "Délai dépassé": "Overdue", "Délai envoi → livraison": "Time shipping → delivery", "Délai fournisseur par défaut (jours)": "Default supplier terms (days)", "Délai livraison → paiement": "Time delivery → payout", "Délai moyen 1er appel": "Avg. time to 1st call", "Délais de rappel « Injoignable » 1 / 2 / 3": "\"Unreachable\" callback delays 1 / 2 / 3", "Démo : connecté en tant que": "Demo: logged in as", "Dépense": "Expense", "Dépense aujourd'hui": "Spend today", "Dépense enregistrée": "Expense saved", "Dépense Meta (30 j)": "Meta spend (30 days)", "Dépense Meta 30 j": "Meta spend 30 days", "Dépense Meta du jour": "Daily Meta spend", "Dépense par campagne": "Spend per campaign", "Dépense pub": "Ad spend", "Dépense sur la période": "Spend for the period", "Dépenses Meta": "Meta spend", "Dépenses Meta importées (API)": "Meta spend imported (API)", "Dépensé": "Spent", "Déposez ici": "Drop here", "Déposez votre fichier .xlsx ou .csv": "Drop your .xlsx or .csv file", "Détail": "Details", "Détail par produit": "Breakdown by product", "Détails": "Details", "Dû au fournisseur": "Owed to supplier", "E-mail": "Email", "Effacer": "Clear", "Effacer la simulation": "Clear simulation", "Emballage": "Packaging", "Emballage personnalisé": "Custom packaging", "En appel": "On call", "En attente": "Pending", "En attente de paiement DHD": "Awaiting DHD payout", "En attente du fournisseur": "Awaiting supplier", "En cours de livraison": "Out for delivery", "En cours de livraison (part fournisseur)": "Out for delivery (supplier share)", "En ligne": "Online", "En pause": "On break", "En production, la dépense est importée automatiquement depuis l'API Meta Ads. Taux": "In production, spend is imported automatically from the Meta Ads API. Rate", "En retard": "Late", "En route": "On the way", "En stock": "In stock", "En transit": "In transit", "EN VEDETTE": "FEATURED", "En vedette": "Featured", "encaissée": "collected", "Enregistrer": "Save", "Entité": "Entity", "Entonnoir": "Funnel", "Entrée achat": "Purchase receipt", "Entrée automatique en stock.": "Automatically added to stock.", "Entrées DHD prévues": "Expected DHD inflows", "Envoyer": "Send", "Envoyer au fournisseur": "Send to supplier", "Envoyer un message": "Send a message", "Envoyer à DHD": "Send to DHD", "Envoyer à DHD en masse": "Bulk send to DHD", "Envoyé au fournisseur": "Sent to supplier", "envoyé au fournisseur": "sent to supplier", "Envoyée à DHD": "Sent to DHD", "Envoyées aujourd'hui": "Sent today", "Envoyés aujourd'hui": "Sent today", "Espace Gérant : prix d'achat, bénéfices, caisses et salaires masqués.": "Operations area: purchase prices, profits, cash boxes and salaries hidden.", "Espèces": "Cash", "Essayez une autre recherche ou une autre catégorie.": "Try another search or category.", "estimée": "estimated", "Ex. : augmenter la pub": "E.g. increase ads", "Ex. : Comptable externe": "E.g. External accountant", "Ex. : devis pour 1 000 boîtes burger imprimées à notre logo": "E.g. quote for 1,000 burger boxes printed with our logo", "Ex. : rappeler après 17h, gérant absent": "E.g. call back after 5pm, manager away", "Exemple pour la démo": "Demo example", "Export Excel": "Export Excel", "Export PDF": "Export PDF", "Export pour le comptable": "Export for the accountant", "Export WhatsApp": "WhatsApp export", "Exporter": "Export", "Expédier": "Ship", "Expédition DHD": "DHD shipping", "Expédiées": "Shipped", "Facebook / Instagram": "Facebook / Instagram", "Faux numéro": "Wrong number", "Favoris": "Favorites", "Fermer": "Close", "Fiche créée automatiquement à la première commande, identifiée par le téléphone": "Profile created automatically at the first order, identified by phone number", "Fiche financière": "Financial sheet", "Fiche financière de la commande": "Order financial sheet", "Fiche fournisseur": "Supplier profile", "Fiche ouverte — verrouillée pour les autres agents": "Order opened — locked for other agents", "Fichier": "File", "Fichier exporté": "File exported", "fidèle": "loyal", "Fidèle": "Loyal", "file commune": "shared queue", "File commune": "Shared queue", "File globale": "Global queue", "File par agent": "Queue per agent", "Filtrer": "Filter", "Filtres": "Filters", "Finance": "Finance", "Finance et comptabilité": "Finance and accounting", "Fixe": "Base salary", "Flux du jour": "Today's flow", "Fournisseur": "Supplier", "Fournisseur — à payer": "Supplier — payable", "Fournisseurs": "Suppliers", "Frais bureau": "Office fee", "Frais de livraison (69 wilayas)": "Delivery fees (69 wilayas)", "Frais de livraison facturés au client": "Delivery fee charged to customer", "Frais DHD": "DHD fees", "Frais DHD (aller + retours)": "DHD fees (outbound + returns)", "Frais DHD facturés 300 DZD de plus que prévu": "DHD fees billed 300 DZD more than expected", "Frais DHD retenus": "DHD fees withheld", "Frais domicile": "Home fee", "Frais mis à jour — appliqués à la boutique": "Fees updated — applied to the shop", "Frais retours": "Return costs", "Français": "French", "gagnés": "earned", "Gain d'upsell": "Upsell gain", "Gain upsell": "Upsell gain", "Gestion de stock": "Inventory", "Glissez-déposez une commande vers un agent pour la réassigner. Chaque réattribution est tracée.": "Drag and drop an order onto an agent to reassign it. Every reassignment is logged.", "Gérant": "Operations manager", "Haute qualité": "High quality", "Hier": "Yesterday", "Historique": "History", "Historique complet": "Full history", "Historique des commandes": "Order history", "Historique des livraisons à PackLik": "Deliveries to PackLik", "Historique des paiements": "Payment history", "Horaires": "Working hours", "hors ligne": "offline", "Hors ligne": "Offline", "Hors zone": "Out of area", "ici": "here", "Import Excel": "Import Excel", "Import simulé : 91 produits vérifiés, 0 erreur": "Simulated import: 91 products checked, 0 errors", "Importer": "Import", "Importer (fichier ou API)": "Import (file or API)", "Impossible de confirmer": "Cannot confirm", "Imprimer": "Print", "Imprimer le bon": "Print list", "Inactif": "Inactive", "Indicateur « Pub autofinancée »": "\"Self-funded ads\" indicator", "Initial": "Initial", "Injoignable": "Unreachable", "Injoignable 1-2-3": "Unreachable 1-2-3", "Injoignable 3 fois": "Unreachable 3 times", "Instagram": "Instagram", "Intact — réintégrer en stock": "Intact — return to stock", "Intégrations": "Integrations", "Inventaire": "Stock count", "Inventaire validé": "Stock count validated", "Je vous appelle pour confirmer votre commande.": "I'm calling to confirm your order.", "Jour": "Day", "Journal": "Journal", "Journal (mes agents)": "Log (my agents)", "Journal d'activité": "Activity log", "jours après le versement DHD": "days after the DHD payout", "jours de pub": "days of ad spend", "Justificatif": "Receipt", "Justifier": "Justify", "Justifié": "Justified", "L'Admin peut activer ce partage pour vous aider à anticiper le réapprovisionnement.": "The Admin can turn on this sharing to help you plan restocking.", "L'agent qui a le moins de commandes en attente reçoit la suivante": "The agent with the fewest pending orders gets the next one", "L'argent reçu de DHD n'est pas du bénéfice.": "Money received from DHD is not profit.", "La commande doit contenir au moins un produit": "The order must contain at least one product", "La commande est livrée : sa part fournisseur passe en « En attente de paiement DHD ».": "The order is delivered: its supplier share moves to \"Awaiting DHD payout\".", "La dette fournisseur est réservée avant tout calcul de trésorerie libre.": "Supplier debt is set aside before any free cash calculation.", "La liste est vide.": "The list is empty.", "La marchandise reçue entre en stock. Le fournisseur est payé commande par commande : sa part devient « Pending — à régler » dès que DHD verse l'argent, puis « Payé » quand vous validez le paiement.": "Received goods go into stock. The supplier is paid order by order: their share becomes \"Pending — to settle\" as soon as DHD pays out, then \"Paid\" when you validate the payment.", "La Réserve fournisseur ne peut sortir que pour payer le fournisseur (ou via une avance pub contrôlée).": "The supplier reserve can only be used to pay the supplier (or via a controlled ad advance).", "La vente d'un pack décrémente le stock de chaque composant.": "Selling a pack deducts stock from each component.", "Le client demande à être rappelé": "Customer asked to be called back", "Le client dit qu'il n'a rien commandé": "Customer says they ordered nothing", "Le fournisseur est payé commande par commande, après le versement DHD": "The supplier is paid order by order, after the DHD payout", "Le Manager attribue lui-même": "The Manager assigns manually", "Le montant sort de la Réserve fournisseur": "The amount comes out of the supplier reserve", "Lecture": "Read", "Lecture (dispo)": "Read (availability)", "Lecture (encaissements DHD)": "Read (DHD collections)", "Lecture (prix de vente)": "Read (sale prices)", "Lecture (ses agents)": "Read (own agents)", "Lecture (ses produits)": "Read (own products)", "Les 4 principes": "The 4 principles", "Les agents au meilleur taux de livraison reçoivent plus": "Agents with the best delivery rate get more", "Les plus ajoutés en upsell": "Most added as upsell", "Les tentatives échouées reviennent à l'agent qui a confirmé.": "Failed attempts go back to the agent who confirmed.", "Libellé": "Label", "Liens utiles": "Useful links", "Ligne": "Line", "Lignes": "Lines", "Liste noire": "Blacklist", "liste noire": "blacklist", "Liste noire : 2 retours ou plus. Vérifiez bien avant de confirmer.": "Blacklisted: 2 or more returns. Check carefully before confirming.", "livr.": "deliv.", "Livraison": "Delivery", "Livraison 69 wilayas": "Delivery to 69 wilayas", "Livraison prévue": "Expected delivery", "Livraison souhaitée": "Requested delivery", "Livraison — paiement à la livraison": "Delivery — cash on delivery", "Livraisons": "Deliveries", "Livreur — à recevoir (colis livrés non payés)": "Courier — receivable (delivered parcels not paid)", "Livrée": "Delivered", "livrée": "delivered", "Livrée le": "Delivered on", "livrées": "delivered", "Livrées": "Delivered", "Loyer": "Rent", "Ma file": "My queue", "Ma file — triée par priorité": "My queue — sorted by priority", "Magasin fermé": "Shop closed", "Manager": "Manager", "Manager jusqu'à": "Manager up to", "Manuel": "Manual", "Marge": "Margin", "Marge brute": "Gross margin", "marge de sécurité": "safety margin", "Marge estimée": "Estimated margin", "Marge par produit (top 10)": "Margin per product (top 10)", "Marge unitaire": "Unit margin", "Marge unitaire calculée": "Calculated unit margin", "Marge visible par l'Admin uniquement": "Margin visible to Admin only", "Marketing": "Marketing", "Marquer livrée": "Mark delivered", "Marquer payée par DHD": "Mark paid by DHD", "Marquer prête": "Mark ready", "Marquer prêtes": "Mark ready", "Marquer retour": "Mark as return", "Marquer vérifiée": "Mark checked", "marquée en retour": "marked as return", "masqué": "hidden", "Matrice des accès": "Access matrix", "Matériaux alimentaires certifiés": "Certified food-grade materials", "MEILLEURES VENTES": "BEST SELLERS", "Membre enregistré": "Member saved", "Membres": "Members", "Menu": "Menu", "Merci ! Votre commande est enregistrée": "Thank you! Your order has been placed", "Merci de corriger le formulaire": "Please correct the form", "Mes adresses": "My addresses", "Mes commandes confirmées jusqu'à la livraison": "My confirmed orders through to delivery", "Mes livraisons": "My deliveries", "Mes performances": "My performance", "Mes rappels": "My callbacks", "Message": "Message", "Message envoyé — nous vous répondons rapidement": "Message sent — we'll get back to you shortly", "Message reçu / note": "Message received / note", "Messenger": "Messenger", "mise(s) à jour": "update(s)", "Mode": "Method", "Mode de répartition": "Assignment mode", "Mode maintenance": "Maintenance mode", "Modif.": "Edit", "Modif. (sans prix d'achat)": "Edit (no purchase prices)", "modifiable": "editable", "Modifier": "Edit", "Modifier le produit": "Edit product", "Modifier un membre": "Edit member", "Module": "Module", "Modèles de messages": "Message templates", "Mois clôturé et verrouillé": "Month closed and locked", "Mon compte": "My account", "Mon espace": "My area", "Mon taux de livraison": "My delivery rate", "Mon équipe": "My team", "montant": "amount", "Montant": "Amount", "Montant (achat)": "Amount (cost)", "Montant (DZD)": "Amount (DZD)", "Montant (max": "Amount (max", "Montant (prix fournisseur)": "Amount (supplier price)", "Montant (USD)": "Amount (USD)", "Montant au-delà du montant avançable : avance bloquée": "Amount above what can be advanced: advance blocked", "Montant avançable maintenant": "Amount available to advance now", "Montant fournisseur": "Supplier amount", "Montant invalide": "Invalid amount", "Montant net reçu (DZD)": "Net amount received (DZD)", "Montant remise": "Discount amount", "Montant à payer": "Amount to pay", "Montant ≥": "Amount ≥", "Montants visibles par l'Admin uniquement.": "Amounts visible to Admin only.", "Mot de passe": "Password", "Motif": "Reason", "Motif (obligatoire)": "Reason (required)", "Motif DHD": "DHD reason", "Motif obligatoire": "Reason required", "Motifs d'annulation": "Cancellation reasons", "Motifs d'échec": "Failure reasons", "Motifs d'échec de livraison": "Delivery failure reasons", "Mouvement enregistré": "Movement saved", "Mouvement entre caisses": "Transfer between cash boxes", "Mouvements": "Movements", "Mouvements des caisses": "Cash box movements", "Moyenne par jour": "Daily average", "Nature": "Type", "Net": "Net", "Net reçu": "Net received", "Nom": "Name", "Nom AR": "AR name", "Nom commercial": "Trade name", "Nom complet": "Full name", "Nom de l'équipe": "Team name", "Nom du client": "Customer name", "Nom du rôle": "Role name", "Nom et téléphone valides requis": "Valid name and phone required", "Nom FR": "FR name", "Nom requis": "Name required", "Nom, téléphone, commerce…": "Name, phone, business…", "Nombre de commandes": "Number of orders", "Non assignée": "Unassigned", "Non assignées": "Unassigned", "non assignées": "unassigned", "Non modifiable — chaque action sensible est tracée": "Read-only — every sensitive action is logged", "Note": "Note", "Note (facultatif)": "Note (optional)", "Note client": "Customer note", "Note d'appel": "Call note", "Note enregistrée": "Note saved", "Notes": "Notes", "Notifications": "Notifications", "Nouveau": "New", "NOUVEAU": "NEW", "nouveau": "new", "Nouveau bon de commande": "New purchase order", "Nouveau bon de commande fournisseur": "New supplier purchase order", "Nouveautés": "Newest", "nouvelle": "new", "Nouvelle": "New", "Nouvelle avance pub": "New ad advance", "Nouvelle commande manuelle": "New manual order", "Nouvelle date": "New date", "Nouvelle date de livraison": "New delivery date", "Nouvelle date transmise à DHD": "New date sent to DHD", "Nouvelles commandes": "New orders", "Nouvelles offres": "New offers", "N° de commande": "Order number", "objectif": "target", "Objectifs de la semaine": "This week's goals", "Objet": "Purpose", "Offres exclusives à ne pas manquer": "Exclusive deals not to miss", "OK": "OK", "Onglet Tentatives": "Attempts tab", "Option non activée par PackLik": "Option not enabled by PackLik", "Opération": "Transaction", "Opérations": "Operations", "Ordre": "Order", "orthographe": "spelling", "Ouvrir": "Open", "Ouvrir l'ERP": "Open the ERP", "Ouvrir une réclamation DHD": "Open a DHD claim", "pack": "pack", "Pack": "Pack", "PackLik a déjà reçu l'argent de DHD pour ces commandes : elles seront validées à votre prochain paiement.": "PackLik has already received the money from DHD for these orders: they will be validated in your next payment.", "PackLik, votre partenaire de confiance pour l'emballage et les solutions alimentaires en Algérie.": "PackLik, your trusted partner for packaging and food solutions in Algeria.", "Packs": "Packs", "Paiement": "Payment", "Paiement fournisseur": "Supplier payment", "paiement par commande, sous": "payment per order, within", "Paiement reçu": "Payment received", "Paiement validé": "Payment validated", "Paiement à la livraison": "Cash on delivery", "Paiement à la livraison (espèces) dans les 69 wilayas via DHD. Les frais de livraison dépendent de la wilaya et du type de livraison (domicile ou bureau DHD).": "Cash on delivery in all 69 wilayas via DHD. Delivery fees depend on the wilaya and the delivery type (home or DHD office).", "Paiement à la livraison uniquement": "Cash on delivery only", "paiement(s) à confirmer": "payment(s) to confirm", "paiements": "payments", "Paiements et commandes": "Payments and orders", "Paiements reçus": "Payments received", "Panier": "Cart", "Panier moyen": "Average order value", "Par agent": "By agent", "Par catégorie": "By category", "Par page": "Per page", "Par produit (marge brute)": "By product (gross margin)", "Par règle": "By rule", "Par source": "By source", "Par wilaya": "By wilaya", "Par wilaya, langue, source ou montant": "By wilaya, language, source or amount", "paramètre appliqué aux fiches": "setting applied to order sheets", "Paramètres": "Settings", "Paramètres du site": "Website settings", "Paramètres enregistrés": "Settings saved", "Paramètres ERP": "ERP settings", "Parent": "Parent", "part fournisseur des commandes déjà payées par DHD": "supplier share of orders already paid by DHD", "Partager « Ventes de mes produits » avec le fournisseur": "Share \"My product sales\" with the supplier", "Passer en stop desk": "Switch to stop desk", "Passer la commande": "Checkout", "passée en stop desk": "switched to stop desk", "Pause": "Break", "pause": "break", "Payer": "Pay", "Payer le fournisseur": "Pay the supplier", "Payer le fournisseur — commandes encaissées de DHD": "Pay the supplier — orders collected from DHD", "Payez en espèces à la réception": "Pay cash on receipt", "Payé (validé)": "Paid (validated)", "Payé au fournisseur sur la période": "Paid to supplier in the period", "Payé depuis": "Paid from", "Payé à DHD (déduit du versement)": "Paid to DHD (deducted from payout)", "Payée": "Paid", "Payée par DHD": "Paid by DHD", "Payée par DHD (rapprochée)": "Paid by DHD (reconciled)", "Payée par DHD le": "Paid by DHD on", "Payées": "Paid", "Pending — commandes à régler": "Pending — orders to settle", "Pending — pas encore reçu de DHD": "Pending — not yet received from DHD", "Pending — à régler": "Pending — to settle", "Pending — à régler par PackLik": "Pending — to be settled by PackLik", "Performance des agents": "Agent performance", "Personnalisé": "Custom", "Perte absorbée par la Caisse de sécurité": "Loss absorbed by the safety fund", "Perte estimée": "Estimated loss", "Physique": "Physical", "Pilotage": "Overview", "Pixel Meta": "Meta Pixel", "pièces": "pieces", "plafond": "cap", "Plafond d'avance pub (% de la réserve)": "Ad advance cap (% of reserve)", "Plein écran": "Full screen", "Poids": "Weight", "Poids %": "Weight %", "Poids (g)": "Weight (g)", "Pondéré par performance": "Weighted by performance", "Popularité": "Popularity", "Portail fournisseur": "Supplier portal", "Portail fournisseur : vous ne voyez ni les prix de vente, ni les clients, ni les bénéfices de PackLik.": "Supplier portal: you don't see PackLik's sale prices, customers or profits.", "Priorité": "Priority", "Prix": "Price", "Prix (DZD)": "Price (DZD)", "Prix compétitifs – emballage personnalisé selon votre marque": "Competitive prices – packaging customized to your brand", "Prix croissant": "Price: low to high", "Prix d'achat": "Purchase price", "Prix d'achat (DZD)": "Purchase price (DZD)", "Prix d'achat et bénéfices visibles uniquement par l'Admin.": "Purchase prices and profits visible to Admin only.", "Prix d'achat et marges masqués pour votre rôle.": "Purchase prices and margins hidden for your role.", "Prix d'achat fictifs (65–75 % du prix de vente) à remplacer par les vrais.": "Sample purchase prices (65–75% of sale price), to be replaced with the real ones.", "Prix de vente": "Sale price", "Prix de vente (DZD)": "Sale price (DZD)", "Prix décroissant": "Price: high to low", "Prix fournisseur": "Supplier price", "Prix sur devis": "Price on request", "Prix unitaire": "Unit price", "Prochain rappel": "Next callback", "Prochaine échéance": "Next due date", "Produit": "Product", "Produit dupliqué (masqué)": "Product duplicated (hidden)", "Produit en rupture": "Product out of stock", "Produit enregistré — visible immédiatement sur la boutique": "Product saved — visible immediately in the shop", "Produit introuvable": "Product not found", "Produits": "Products", "produits": "products", "Produits (91)": "Products (91)", "Produits (quantité × prix fournisseur)": "Products (quantity × supplier price)", "Produits associés": "Related products", "Produits dormants": "Dormant products", "Produits et catégories": "Products and categories", "Produits suggérés pour l'upsell": "Suggested upsell products", "professionnel": "business", "Professionnel": "Business", "Programmer": "Schedule", "Programmer un rappel": "Schedule a callback", "Projection de trésorerie — 30 jours": "Cash forecast — 30 days", "Proposer": "Suggest", "Proposer la livraison au bureau DHD (stop desk)": "Offer delivery to the DHD office (stop desk)", "Prototype interactif — la boutique est branchée en direct sur l'ERP": "Interactive prototype — the shop is connected live to the ERP", "Préparation": "Preparation", "Préparation, expédition DHD, retours, stock": "Preparation, DHD shipping, returns, stock", "Préparer": "Prepare", "Prévisualisation de la répartition du jour": "Preview of today's distribution", "Prête": "Ready", "prête": "ready", "Prête (emballée et pesée)": "Ready (packed and weighed)", "Prêtes": "Ready", "Pub (DZD)": "Ads (DZD)", "Pub (USD)": "Ads (USD)", "Pub Meta": "Meta ads", "Pub prévue": "Planned ads", "Publicité Meta": "Meta advertising", "Période": "Period", "Qté": "Qty", "Quand": "When", "Quantité": "Quantity", "Quantité (+/−)": "Quantity (+/−)", "Quantités livrées aux clients sur la période choisie": "Quantities delivered to customers in the selected period", "Question ouverte : régime fiscal (IFU ou réel) à préciser avec le comptable.": "Open question: tax regime (IFU or real) to confirm with the accountant.", "quota": "quota", "Quota max": "Max quota", "Quota par défaut": "Default quota", "Raison": "Reason", "Rappel": "Callback", "Rappel programmé": "Callback scheduled", "Rappel programmé automatiquement": "Callback scheduled automatically", "rappel programmé à": "callback scheduled at", "Rappeler après 17h": "Call back after 5pm", "Rappeler le client": "Call the customer back", "Rappeler le client + SMS/WhatsApp auto": "Call the customer back + automatic SMS/WhatsApp", "Rappels plus tard": "Later callbacks", "Rappels à l'heure": "Callbacks due now", "Rapprochement d'un versement DHD": "Reconcile a DHD payout", "Rapprochement DHD": "DHD reconciliation", "Rapprocher un nouveau versement": "Reconcile a new payout", "Rapprocher un versement DHD": "Reconcile a DHD payout", "Recette": "Income", "Recettes, dépenses, rapprochements et résultat mensuel": "Income, expenses, reconciliations and monthly result", "Rechercher": "Search", "Rechercher nom ou SKU…": "Search name or SKU…", "Rechercher n°, client, suivi DHD…": "Search no., customer, DHD tracking…", "Rechercher n°, client, téléphone…": "Search no., customer, phone…", "Rechercher un emballage…": "Search packaging…", "Rechercher un produit…": "Search a product…", "Recommandation : fusionner « PACK PROMO » et « Packs promo », corriger l'orthographe (Sushi, Pâtisserie, Sandwich) avec redirection des anciennes URL.": "Recommendation: merge \"PACK PROMO\" and \"Packs promo\", fix spelling (Sushi, Pâtisserie, Sandwich) with redirects for old URLs.", "Refus": "Refusal", "Refus du colis": "Parcel refused", "Refus du colis à traiter": "Parcel refusal to handle", "Refuser": "Reject", "Relations": "Relations", "Relevé de compte": "Account statement", "Remboursement du Budget pub": "Ad budget reimbursement", "Remboursement pub": "Ad reimbursement", "Remboursement pub de chaque commande + réinvestissement": "Ad reimbursement from each order + reinvestment", "Rembourser": "Repay", "Remboursée": "Repaid", "remboursée": "repaid", "Remise": "Discount", "Remise : agent jusqu'à": "Discount: agent up to", "Remise au-delà du seuil : validation requise": "Discount above threshold: approval required", "Remise max agent (%)": "Max agent discount (%)", "Remise max manager (%)": "Max manager discount (%)", "Remise refusée": "Discount rejected", "Remise validée": "Discount approved", "Remise à valider": "Discount to approve", "Rentabilité": "Profitability", "Renvoyer en file commune les commandes des agents en pause": "Send orders of agents on break back to the shared queue", "Retirer": "Remove", "Retour": "Return", "retour": "return", "Retour en cours": "Return in progress", "Retour réceptionné": "Return received", "Retournée": "Returned", "Retournées": "Returned", "Retours": "Returns", "Retours en cours": "Returns in progress", "Retours à réceptionner": "Returns to receive", "Retrait / décision réinvestissement": "Withdrawal / reinvestment decision", "Retrait au bureau": "Pick up at office", "Reçu": "Received", "Reçu le": "Received on", "Reçues": "Received", "Risque de retour": "Return risk", "ROAS réel (bénéfice / pub)": "Real ROAS (profit / ads)", "Rue, cité, repère…": "Street, neighborhood, landmark…", "Rupture": "Out of stock", "rupture": "out of stock", "Ruptures commandables sur demande": "Out-of-stock items orderable on request", "Ruptures non commandables": "Out-of-stock items not orderable", "Règle ajoutée": "Rule added", "Règle de paiement": "Payment rule", "Règles (mode « Par règle »)": "Rules (\"By rule\" mode)", "Règles appliquées automatiquement": "Rules applied automatically", "Règles de sécurité": "Security rules", "Réassigner": "Reassign", "Réassigner ou relancer les agents": "Reassign or nudge agents", "Réassigner à": "Reassign to", "Réassigner à…": "Reassign to…", "Réattribuer les commandes non ouvertes depuis 30 min": "Reassign orders not opened for 30 min", "Réattribution après (min)": "Reassign after (min)", "Réception confirmée": "Receipt confirmed", "Réception de marchandise": "Goods receipt", "Réception du retour": "Return receipt", "Réception, contrôle de l'état, réintégration en stock ou casse": "Receipt, condition check, back to stock or write-off", "Réceptionner": "Receive", "Réceptionner le retour": "Receive the return", "Réceptionner le retour au dépôt": "Receive the return at the depot", "réceptionné · stock mis à jour": "received · stock updated", "réceptionnée": "received", "Réclamation envoyée à DHD pour les colis bloqués": "Claim sent to DHD for stuck parcels", "Réf.": "Ref.", "Référence": "Reference", "Réinvestissement": "Reinvestment", "Réinvestissement (% du bénéfice)": "Reinvestment (% of profit)", "Rémunération": "Pay", "Répartition": "Distribution", "Répartition des agents": "Agent assignment", "Répartition financière déclenchée": "Financial split triggered", "Réserve": "Reserve", "Réserve fournisseur": "Supplier reserve", "Réservé": "Reserved", "Résultat": "Result", "Résultat net": "Net result", "Résultats pour": "Results for", "Rôle": "Role", "Rôle créé": "Role created", "Rôle démo": "Demo role", "Rôle personnalisé": "Custom role", "Sa fiche": "Own profile", "Saisir la dépense du jour": "Enter today's spend", "Saisir la dépense pub du jour": "Enter today's ad spend", "Saisir la nouvelle date et la transmettre à DHD": "Enter the new date and send it to DHD", "Saisissez le comptage physique. Les écarts sont calculés et l'inventaire est validé par l'Admin.": "Enter the physical count. Gaps are calculated and the count is validated by the Admin.", "Saisissez votre numéro de téléphone et votre numéro de commande.": "Enter your phone number and your order number.", "Salaires et commissions": "Salaries and commissions", "Sauvegarde chiffrée créée": "Encrypted backup created", "Sauvegarde maintenant": "Back up now", "Sauvegarde quotidienne chiffrée, conservée 30 jours.": "Daily encrypted backup, kept for 30 days.", "Script d'appel": "Call script", "Segment": "Segment", "Segments": "Segments", "Ses commissions": "Own commissions", "Ses dettes et paiements": "Own debts and payments", "seuil": "threshold", "Seuil": "Threshold", "Seuil d'alerte": "Alert threshold", "Seuls les agents « en ligne » et dans leurs horaires reçoivent des commandes.": "Only agents who are \"online\" and within their working hours receive orders.", "Siennes": "Own", "Siennes (assignées)": "Own (assigned)", "Siennes (lecture + validation)": "Own (read + approve)", "Signature livreur DHD": "DHD courier signature", "Signature PackLik": "PackLik signature", "Simuler 20 commandes": "Simulate 20 orders", "Simuler une tentative échouée": "Simulate a failed attempt", "simulées": "simulated", "Site": "Website", "Site et ERP": "Website and ERP", "Solde": "Balance", "Solde insuffisant": "Insufficient balance", "Solde insuffisant pour rembourser": "Insufficient balance to repay", "source": "source", "Source": "Source", "Sous-total": "Subtotal", "Spécialisation": "Specialization", "Statistiques": "Statistics", "Statut": "Status", "Stock": "Stock", "Stock bas": "Low stock", "Stock bas / rupture": "Low stock / out of stock", "Stock dispo": "Available stock", "Stock et achats": "Stock and purchasing", "Stock initial": "Opening stock", "stock insuffisant": "insufficient stock", "Stock possible": "Possible stock", "Stock restant chez PackLik": "Stock left at PackLik", "Stock réintégré": "Returned to stock", "Stock réservé à la confirmation · emballer, peser, valider": "Stock reserved at confirmation · pack, weigh, validate", "Suggestion d'achat automatique": "Automatic purchase suggestion", "Suggestions": "Suggestions", "Suggestions d'upsell": "Upsell suggestions", "Suivi": "Tracking", "Suivi de commande": "Order tracking", "Suivi des commandes": "Order tracking", "Suivi des commandes / livraisons": "Order / delivery tracking", "Suivi DHD": "DHD tracking", "Suivre ma commande": "Track my order", "Supprimer": "Delete", "Sur commande": "On request", "sur devis": "on quote", "Suspendre": "Pause", "Synchro DHD": "DHD sync", "Synchronisation DHD": "DHD synchronization", "Synchronisation DHD terminée": "DHD sync complete", "Synchronisation DHD toutes les 15 minutes": "DHD sync every 15 minutes", "Synchronisation DHD toutes les 15 minutes + bouton « actualiser ».": "DHD sync every 15 minutes + a \"refresh\" button.", "Système": "System", "sélectionnée(s)": "selected", "Séparation instantanée : part fournisseur, livraison, pub et bénéfice": "Instant split: supplier share, delivery, ads and profit", "Tableau de bord": "Dashboard", "Tableau de bord opérations": "Operations dashboard", "Tableau de bord équipe": "Team dashboard", "Taux": "Rate", "Taux d'upsell": "Upsell rate", "Taux d'upsell (%)": "Upsell rate (%)", "Taux de change": "Exchange rate", "Taux de confirmation": "Confirmation rate", "taux de livraison": "delivery rate", "Taux de livraison": "Delivery rate", "Taux de livraison (%)": "Delivery rate (%)", "Taux de livraison (bas)": "Delivery rate (lowest)", "Taux de recommande": "Repeat order rate", "Taux de retour": "Return rate", "Taux livraison": "Delivery rate", "Taux USD/DZD": "USD/DZD rate", "Tentative": "Attempt", "tentative": "attempt", "Tentative échouée": "Failed attempt", "tentative(s) échouée(s)": "failed attempt(s)", "tentative(s) échouée(s) à traiter : elles comptent dans votre taux de livraison.": "failed attempt(s) to handle: they count in your delivery rate.", "Tentatives de livraison": "Delivery attempts", "Tentatives de livraison à sauver": "Delivery attempts to save", "Tentatives du jour": "Today's attempts", "Tentatives par colis": "Attempts per parcel", "Tentatives échouées": "Failed attempts", "tentatives échouées aujourd'hui": "failed attempts today", "Tester la connexion DHD": "Test DHD connection", "Testez le mode choisi : simulez 20 nouvelles commandes et voyez qui les recevrait.": "Test the chosen mode: simulate 20 new orders and see who would receive them.", "Texte complet à fournir par PackLik (modifiable dans Paramètres du site).": "Full text to be provided by PackLik (editable in Website settings).", "Théorique": "Expected", "Tiers": "Third party", "Titre SEO": "SEO title", "Top 10 produits": "Top 10 products", "Top clients professionnels": "Top business customers", "Top ventes (unités)": "Best sellers (units)", "Top wilayas": "Top wilayas", "Total": "Total", "Total = lire, créer, modifier, supprimer · Modif. = lire et modifier · Lecture = consulter · Siennes = ses propres données · — = aucun accès. Permissions fines case par case ; l'Admin peut créer un rôle personnalisé.": "Full = read, create, edit, delete · Edit = read and edit · Read = view only · Own = own data only · — = no access. Fine-grained permissions box by box; the Admin can create a custom role.", "Total déjà payé": "Total already paid", "Total dépensé": "Total spent", "Total encaissé par DHD": "Total collected by DHD", "Total estimé": "Estimated total", "Total payé": "Total paid", "Total reçu": "Total received", "Total à payer à la livraison": "Total to pay on delivery", "Tour de rôle (round robin)": "Round robin", "Tous": "All", "tous": "all", "Tous les agents": "All agents", "Tous les produits": "All products", "Tous les statuts": "All statuses", "Tout effacer": "Clear all", "Tout sélectionner": "Select all", "Tout voir": "See all", "Toutes": "All", "Toutes les": "Every", "Toutes les catégories": "All categories", "Toutes les commandes à confirmer": "All orders to confirm", "Toutes les commandes à préparer": "All orders to prepare", "Toutes les sources": "All sources", "Toutes les wilayas": "All wilayas", "Traiter": "Handle", "Traiter la tentative": "Handle the attempt", "Traité": "Handled", "Traitées": "Processed", "Transmettre à DHD": "Send to DHD", "Transport": "Transport", "Trier": "Sort", "Trésorerie": "Cash position", "Type": "Type", "Type de livraison": "Delivery type", "Téléphone": "Phone", "Téléphone (WhatsApp)": "Phone (WhatsApp)", "Téléphone 2": "Phone 2", "téléphone invalide": "invalid phone", "Téléphone éteint / faux": "Phone off / wrong", "Un agent ne voit jamais les commandes d'un autre agent, ni le numéro complet d'un client hors de ses commandes.": "An agent never sees another agent's orders, nor a customer's full number outside their own orders.", "Un agent PackLik va vous appeler pour confirmer votre commande. Gardez votre téléphone à portée de main.": "A PackLik agent will call you to confirm your order. Keep your phone close.", "Un colis livré n'est pas de l'argent reçu (DHD paie ~4,9 j après livraison, ~6,9 j après envoi).": "A delivered parcel is not money received (DHD pays ~4.9 days after delivery, ~6.9 days after shipping).", "Une commande enregistrée n'est pas une commande livrée.": "A registered order is not a delivered order.", "Une commande à la fois, tout en un écran": "One order at a time, everything on one screen", "Une commande à la fois, tout sur un écran": "One order at a time, everything on one screen", "Une notification apparaît 5 minutes avant chaque rappel.": "A notification appears 5 minutes before each callback.", "unités": "units", "Unités chez DHD": "Units at DHD", "Unités réservées": "Reserved units", "Unités vendues": "Units sold", "Unités vendues par jour": "Units sold per day", "upsell": "upsell", "Upsell": "Upsell", "Upsell ajouté au panier": "Upsell added to cart", "Upsell moyen": "Average upsell", "Utilisateur": "User", "Utilisez « Avance pub » pour sortir de la Réserve fournisseur": "Use \"Ad advance\" to take money from the supplier reserve", "Valeur": "Value", "Valeur (achat)": "Value (cost)", "Valeur bloquée chez DHD": "Value held at DHD", "Valeur client moyenne": "Average customer value", "Valeur du stock (prix d'achat)": "Stock value (cost)", "Valeur du stock (prix de vente)": "Stock value (sale price)", "Valeur requise": "Value required", "validation requise à la confirmation": "approval required at confirmation", "Valider": "Validate", "Valider l'inventaire": "Validate stock count", "Valider la remise": "Approve discount", "Valider la réception": "Validate receipt", "Valider le paiement": "Validate payment", "Valider le rapprochement": "Validate reconciliation", "Valider « Prête »": "Mark \"Ready\"", "Variables": "Variables", "Variante": "Variant", "Variantes": "Variants", "variantes": "variants", "Vendu 14 j": "Sold 14 days", "vente": "sale", "Ventes": "Sales", "Ventes de mes produits": "My product sales", "Verrouillée par": "Locked by", "Vers": "To", "Versement": "Payout", "Version confirmée": "Confirmed version", "Version initiale": "Initial version", "Veuillez indiquer la commune": "Please select the commune", "Virement": "Bank transfer", "Voir": "View", "Voir la boutique": "View the shop", "Voir la commande dans l'ERP": "View the order in the ERP", "Voir le compte fournisseur": "View supplier account", "Voir tous les produits": "See all products", "Volume irrégulier": "Irregular volume", "Vos informations": "Your details", "Votre argent commande par commande": "Your money, order by order", "Votre commande": "Your order", "Votre file est vide": "Your queue is empty", "Votre file est vide. Bravo !": "Your queue is empty. Well done!", "Votre panier est vide": "Your cart is empty", "Vous ne voyez pas les prix d'achat, les marges ni les commandes des autres agents.": "You don't see purchase prices, margins or other agents' orders.", "Vous payez : vous cochez les commandes réglées et validez. Elles passent en « Payé » (commande clôturée) et le fournisseur reçoit le détail complet.": "You pay: tick the settled orders and validate. They move to \"Paid\" (order closed) and the supplier receives the full details.", "Vous payez en espèces au livreur DHD à la réception de votre colis, dans les 69 wilayas.": "You pay the DHD courier in cash when you receive your parcel, in all 69 wilayas.", "Vous êtes maintenant": "You are now", "Vue globale : ventes, livraisons, trésorerie": "Overview: sales, deliveries, cash", "Vérifier nom, wilaya, commune et adresse exacte.": "Check name, wilaya, commune and exact address.", "Vérifiez les caisses, le montant et le motif": "Check the cash boxes, amount and reason", "Vérifiée": "Checked", "WhatsApp": "WhatsApp", "WhatsApp Business API (v2)": "WhatsApp Business API (v2)", "wilaya": "wilaya", "Wilaya": "Wilaya", "Zone à haut risque : chaque colis non livré coûte l'aller, le retour et la pub": "High-risk zone: every undelivered parcel costs the outbound trip, the return and the ads", "~70 % des commandes acceptent un upsell": "~70% of orders accept an upsell", "À commander": "To order", "À domicile": "Home delivery", "À domicile ou au bureau DHD": "Home or DHD office", "À encaisser": "To collect", "à fusionner": "to merge", "à l'instant": "just now", "À préparer": "To prepare", "à rembourser le": "to repay on", "à risque": "at risk", "À risque": "At risk", "À traiter": "To handle", "À traiter par les agents": "For agents to handle", "Écart": "Gap", "écart": "gap", "Écart inventaire": "Stock count gap", "Écart justifié": "Gap justified", "écart(s) corrigé(s)": "gap(s) corrected", "Échecs": "Failures", "échecs enregistrés aujourd'hui": "failures logged today", "échouée": "failed", "Échéance fournisseur dans 48 h": "Supplier payment due within 48h", "Échéances fournisseur": "Supplier due dates", "Écran d'appel": "Call screen", "Écrire sur WhatsApp": "Message on WhatsApp", "écritures": "entries", "Équipe": "Team", "Équipe créée": "Team created", "Équipe et accès": "Team and access", "Équipe homogène, démarrage": "Even team, getting started", "Équipe mature, objectif de rentabilité": "Mature team, profitability goal", "Équipes": "Teams", "État": "Status", "État du stock": "Stock status", "Étiquette": "Label", "Étiquette DHD": "DHD label", "Événements Pixel envoyés (session)": "Pixel events sent (session)", "— Choisir la commune —": "— Choose the commune —", "pondéré par performance": "weighted by performance", "Expéditeur": "Sender", "Prix minimum": "Minimum price", "Prix maximum": "Maximum price", "j": "d", "Acheter maintenant": "Buy now", "Connectez une société avec sa clé API : l'ERP crée les envois, récupère les étiquettes, suit les statuts et importe les versements automatiquement.": "Connect a company with its API key: the ERP creates shipments, gets labels, tracks statuses and imports payouts automatically.", "DHD Express": "DHD Express", "Domicile + bureau (stop desk)": "Home + office (stop desk)", "Domicile uniquement": "Home only", "Par défaut": "Default", "Connectée": "Connected", "Non connectée": "Not connected", "Clé API / Token": "API key / Token", "URL de l'API": "API URL", "ID API (si demandé)": "API ID (if required)", "Poids inclus (kg)": "Included weight (kg)", "Prix par kg en plus (DZD)": "Price per extra kg (DZD)", "Poids max par colis (kg)": "Max weight per parcel (kg)", "Facturer le surpoids au client": "Charge overweight to the customer", "Coefficient tarifaire": "Rate coefficient", "Coefficient": "Coefficient", "Tester la connexion": "Test connection", "Importer la grille tarifaire": "Import rate table", "Dernière synchro": "Last sync", "Connecter": "Connect", "Déconnecter": "Disconnect", "Définir par défaut": "Set as default", "Yalidine": "Yalidine", "ZR Express": "ZR Express", "Maystro Delivery": "Maystro Delivery", "Noest Express": "Noest Express", "EcoTrack (Procolis, Guepex…)": "EcoTrack (Procolis, Guepex…)", "Mes livreurs": "My couriers", "Vos propres livreurs": "Your own couriers", "Pas de clé API : vos livreurs utilisent l'ERP. Zones": "No API key: your couriers use the ERP. Areas", "Sociétés de livraison": "Delivery companies", "Règles d'attribution": "Assignment rules", "Tarifs par wilaya": "Rates by wilaya", "Sociétés de livraison, vos livreurs et le poids des colis": "Delivery companies, your couriers and parcel weights", "Modules": "Modules", "Livraison et livreurs": "Delivery and couriers", "Pixels Facebook et TikTok": "Facebook and TikTok pixels", "Vos livreurs livrent à Alger et environs. Ils encaissent le client et vous remettent l'argent.": "Your couriers deliver in Algiers and nearby. They collect from the customer and hand you the cash.", "Ajouter un livreur": "Add a courier", "Modifier le livreur": "Edit courier", "Livreur": "Courier", "Livreur automatique": "Automatic courier", "Automatique": "Automatic", "Véhicule": "Vehicle", "Zones": "Areas", "En cours": "In progress", "Livrées aujourd'hui": "Delivered today", "Argent en main": "Cash in hand", "livraison": "delivery", "Moto": "Motorbike", "Voiture": "Car", "Utilitaire": "Van", "En service": "On duty", "Repos": "Off duty", "Encaisser": "Collect", "Courses en cours": "Deliveries in progress", "Aucune course en cours": "No deliveries in progress", "Remise au livreur": "Handed to courier", "Remis au livreur": "Handed to courier", "Échec": "Failed", "Choisissez automatiquement la société selon la wilaya. Sinon, la société par défaut est utilisée.": "Pick the company automatically by wilaya. Otherwise the default company is used.", "Société par défaut": "Default company", "Ajouter la règle": "Add rule", "Société": "Company", "poids inclus": "included weight", "Client domicile": "Customer home", "Client bureau": "Customer office", "Coût domicile": "Cost home", "Coût bureau": "Cost office", "Rémunération par livraison (DZD)": "Pay per delivery (DZD)", "Wilayas couvertes": "Wilayas covered", "Livreur enregistré": "Courier saved", "encaissés de": "collected from", "ID du pixel": "Pixel ID", "ID du pixel manquant": "Pixel ID missing", "Token API de conversions": "Conversions API token", "Token Events API": "Events API token", "facultatif mais recommandé": "optional but recommended", "Code de test": "Test code", "Envoyer un événement test": "Send test event", "Événement test envoyé à": "Test event sent to", "Ajouter un pixel": "Add a pixel", "Aucun pixel": "No pixel", "Événements envoyés": "Events sent", "Quand envoyer l'achat (Purchase) ?": "When to send the purchase (Purchase)?", "À la commande sur le site": "When the order is placed on the website", "Quand l'agent confirme la commande (recommandé en COD)": "When the agent confirms the order (recommended for COD)", "Quand la commande est livrée": "When the order is delivered", "Dédoublonnage navigateur + serveur (event_id)": "Browser + server deduplication (event_id)", "En paiement à la livraison, envoyer l'achat à la confirmation apprend aux publicités à trouver des clients qui confirment vraiment.": "With cash on delivery, sending the purchase at confirmation teaches the ads to find customers who actually confirm.", "Journal des événements (session)": "Event log (session)", "Aucun événement : visitez la boutique ou passez une commande": "No events: visit the shop or place an order", "Heure": "Time", "Plateforme": "Platform", "Pixel": "Pixel", "Événement": "Event", "Envoi": "Sent via", "Navigateur": "Browser", "Serveur": "Server", "Ouvrir la boutique": "Open the shop", "Suivi des publicités : navigateur + API serveur": "Ad tracking: browser + server API", "Enregistré": "Saved", "Activez ou désactivez chaque module en un clic. Un module désactivé disparaît des menus.": "Turn each module on or off in one click. A disabled module disappears from the menus.", "Activé": "On", "Désactivé": "Off", "Configurer": "Configure", "Tout se configure ici, simplement": "Configure everything here, simply", "DHD, Yalidine, ZR Express, Maystro, Noest, EcoTrack… : envois, étiquettes, suivi et versements.": "DHD, Yalidine, ZR Express, Maystro, Noest, EcoTrack…: shipments, labels, tracking and payouts.", "Vos propres livreurs : courses, encaissement, remise de la caisse.": "Your own couriers: deliveries, collection, cash handover.", "Poids et découpage des colis": "Parcel weight and splitting", "Poids calculé par commande, surpoids facturé, découpage automatique en plusieurs colis.": "Weight calculated per order, overweight charged, automatic split into several parcels.", "Plusieurs pixels, API de conversions, choix du moment de l'achat.": "Multiple pixels, conversions API, choice of when to send the purchase.", "Upsell au téléphone": "Phone upsell", "Suggestions par catégorie dans l'écran d'appel, gain crédité à l'agent.": "Suggestions by category on the call screen, gain credited to the agent.", "Répartition automatique": "Automatic assignment", "Tour de rôle, charge, performance ou règles.": "Round robin, workload, performance or rules.", "Liste noire et doublons": "Blacklist and duplicates", "Badge après 1 refus, liste noire après 2 retours, doublons 24 h.": "Badge after 1 refusal, blacklist after 2 returns, 24h duplicates.", "Boutons WhatsApp, messages automatiques (API en v2).": "WhatsApp buttons, automatic messages (API in v2).", "Découper la commande": "Split the order", "Modifier le découpage": "Edit the split", "Annuler le découpage": "Undo the split", "Découper": "Split", "à découper": "to split", "Poids total": "Total weight", "max par colis": "max per parcel", "Poids max par colis (kg) ": "Max weight per parcel (kg)", "Recalculer": "Recalculate", "Colis": "Parcels", "Frais de livraison en 1 colis": "Shipping cost as 1 parcel", "Frais de livraison en": "Shipping cost as", "Chaque colis reçoit son propre numéro de suivi ; le poids de chaque colis est transmis à la société de livraison.": "Each parcel gets its own tracking number; each parcel's weight is sent to the delivery company.", "Colis prêts à envoyer": "Parcels ready to ship", "Avant envoi, l'ERP vérifie : stock, téléphone valide, wilaya, commune et poids.": "Before shipping, the ERP checks: stock, valid phone, wilaya, commune and weight.", "Société de livraison": "Delivery company", "Frais": "Fees", "Expédition": "Shipping", "Société de livraison, poids, colis, étiquettes et bordereau": "Delivery company, weight, parcels, labels and handover slip", "Poids de la commande": "Order weight", "Inclus": "Included", "puis": "then", "pas de surpoids": "no overweight", "dont surpoids": "incl. overweight", "Poids trop élevé : découper la commande": "Too heavy: split the order", "Société non connectée": "Company not connected", "Changer de société": "Change company", "Envoyée à": "Sent to", "Envoi créé via API · étiquette récupérée": "Shipment created via API · label retrieved", "Commande découpée": "Order split", "Découpage annulé": "Split undone", "Poids d'un paquet (grammes)": "Weight of one pack (grams)", "Utilisé pour le poids de la commande, les frais de surpoids et le découpage en colis.": "Used for the order weight, overweight fees and parcel splitting.", "Saisissez d'abord la clé API": "Enter the API key first", "connectée": "connected", "déconnectée": "disconnected", "connexion OK (démo)": "connection OK (demo)", "grille tarifaire importée (69 wilayas)": "rate table imported (69 wilayas)"});
Object.assign(AR, {"(souvent pris ensemble).": "(غالبًا ما تُشترى معًا).", "1 refus": "رفض واحد", "100 % du coût d'achat ; ne sort que pour payer le fournisseur": "100% من تكلفة الشراء؛ لا يُصرف إلا لدفع مستحقات المورد", "2 retours ou plus": "مرتجعان أو أكثر", "2e numéro": "الرقم الثاني", "2e numéro (facultatif)": "الرقم الثاني (اختياري)", "3 tentatives échouées": "3 محاولات فاشلة", "3 tentatives échouées — risque de retour": "3 محاولات فاشلة — خطر الإرجاع", "30 jours": "30 يومًا", "4 produits maximum": "4 منتجات كحد أقصى", "7 jours": "7 أيام", "91 produits · 17 catégories repris de packlik.shop": "91 منتجًا · 17 فئة من packlik.shop", "Abîmé — passer en casse": "تالف — تسجيله كإتلاف", "Accorder l'avance": "منح التسبيق", "accordée": "تم منحه", "Accueil": "الرئيسية", "Accès portail actif": "الوصول إلى البوابة مفعّل", "achat": "شراء", "Achats": "المشتريات", "Achats fournisseur": "مشتريات المورد", "Acheter": "اشترِ الآن", "actif": "نشط", "Actif": "نشط", "Action": "الإجراء", "Action PackLik": "إجراء باكليك", "Action requise": "الإجراء المطلوب", "Actions": "إجراءات", "Activer": "تفعيل", "Actualiser": "تحديث", "Actualiser DHD": "تحديث DHD", "Admin": "المدير", "Adresse": "العنوان", "Adresse corrigée et transmise à DHD": "تم تصحيح العنوان وإرساله إلى DHD", "Adresse incorrecte": "عنوان خاطئ", "Adresse introuvable, pas de repère": "العنوان غير موجود، لا يوجد معلم", "Agenda des rappels": "أجندة إعادة الاتصال", "Agent": "العون", "Agent de confirmation": "عون التأكيد", "Agent en pause : ses commandes non traitées retournent dans la file commune.": "العون في استراحة: تعود طلباته غير المعالجة إلى القائمة العامة.", "Agent responsable": "العون المسؤول", "Agent — commissions du mois": "العون — عمولات الشهر", "Agents en ligne": "الأعوان المتصلون", "Agents, poids et quotas": "الأعوان، الأوزان والحصص", "Ajouter": "إضافة", "Ajouter au panier": "أضف إلى السلة", "Ajouter aux favoris": "أضف إلى المفضلة", "Ajouter un membre": "إضافة عضو", "Ajouter un produit": "إضافة منتج", "Ajouter un produit (recherche)…": "أضف منتجًا (بحث)…", "Ajouter une dépense": "إضافة مصروف", "Ajoutez au moins une ligne": "أضف سطرًا واحدًا على الأقل", "Ajouté": "تمت الإضافة", "Ajouté au panier": "تمت الإضافة إلى السلة", "Ajouté à la comparaison": "أضيف إلى المقارنة", "ajustement": "تسوية", "Ajustement": "تسوية", "Ajuster": "تعديل", "Ajuster le stock": "تعديل المخزون", "Alerte Gérant ; réclamation DHD": "تنبيه المسيّر؛ شكوى لدى DHD", "Alerte Manager ; vérifier un 2e numéro": "تنبيه المشرف؛ التحقق من رقم ثانٍ", "Alertes": "التنبيهات", "Anglais": "الإنجليزية", "Annulation d'une commande confirmée ou expédiée : Manager ou Gérant, motif obligatoire.": "إلغاء طلب مؤكد أو مشحون: المشرف أو المسيّر، مع سبب إلزامي.", "Annuler": "إلغاء", "Annuler (motif obligatoire)": "إلغاء (السبب إلزامي)", "Annuler la commande": "إلغاء الطلب", "Annuler les doublons": "إلغاء المكررات", "Annulée": "ملغى", "annulée": "ملغى", "Annulées": "الملغاة", "Appel en cours": "مكالمة جارية", "Appeler": "اتصال", "Appeler pour connaître la raison et sauver la vente": "الاتصال لمعرفة السبب وإنقاذ البيع", "Appels": "المكالمات", "Appels par commande": "المكالمات لكل طلب", "Après 3 tentatives échouées : « Risque de retour », remonte en rouge chez le Manager.": "بعد 3 محاولات فاشلة: «خطر الإرجاع»، يظهر بالأحمر لدى المشرف.", "après fournisseur, DHD, pub, commissions": "بعد المورد وDHD والإشهار والعمولات", "après paiement DHD": "بعد دفع DHD", "Arabe (RTL)": "العربية (من اليمين لليسار)", "Archiver": "أرشفة", "archivé": "مؤرشف", "Argent chez DHD": "أموال لدى DHD", "Argent en attente chez DHD": "أموال معلّقة لدى DHD", "Argent en route (× taux de livraison)": "أموال في الطريق (× نسبة التوصيل)", "Attribution automatique active": "التعيين التلقائي مفعّل", "Attribution automatique suspendue": "التعيين التلقائي موقوف", "au": "إلى", "Au-delà de": "أكثر من", "au-delà validation Admin.": "وما فوق ذلك بموافقة المدير.", "Aucun cas difficile": "لا توجد حالات صعبة", "Aucun colis livré en attente de versement": "لا توجد طرود مسلّمة في انتظار الدفع", "Aucun doublon dans la sélection": "لا توجد مكررات في التحديد", "Aucun envoi aujourd'hui": "لا توجد شحنات اليوم", "Aucun favori": "لا توجد مفضلات", "Aucun produit": "لا توجد منتجات", "Aucun produit trouvé": "لم يتم العثور على أي منتج", "Aucun rappel programmé": "لا توجد اتصالات مبرمجة", "Aucune alerte": "لا توجد تنبيهات", "Aucune commande en attente": "لا توجد طلبات في الانتظار", "Aucune commande pour le moment": "لا توجد طلبات حاليًا", "Aucune commande à régler": "لا توجد طلبات للتسوية", "Aucune mise à jour DHD depuis": "لا تحديث من DHD منذ", "Aucune notification. Passez une commande sur la boutique pour la voir arriver ici.": "لا توجد إشعارات. اطلب من المتجر لترى الطلب يصل هنا.", "Aucune tentative échouée pour cette commande": "لا توجد محاولات فاشلة لهذا الطلب", "aucune vente depuis 30 jours": "لا مبيعات منذ 30 يومًا", "Audience Meta": "جمهور ميتا", "aujourd'hui": "اليوم", "Aujourd'hui": "اليوم", "Auteur": "المنفّذ", "auto toutes les": "تلقائيًا كل", "Autoriser « commande sur demande » pour les ruptures": "السماح بـ«الطلب المسبق» للمنتجات غير المتوفرة", "Autre": "أخرى", "Avance bloquée : une échéance fournisseur deviendrait impossible à tenir.": "التسبيق محظور: سيصبح الوفاء بأحد استحقاقات المورد مستحيلًا.", "Avance pub": "تسبيق الإشهار", "Avance pub reçue": "تسبيق إشهار مستلم", "Avance pub sur la réserve fournisseur": "تسبيق الإشهار من احتياطي المورد", "Avant envoi, l'ERP vérifie : stock, téléphone valide, wilaya et commune.": "قبل الإرسال يتحقق النظام من: المخزون، صحة الهاتف، الولاية والبلدية.", "Badge après 1 refus ; liste noire après 2 retours.": "شارة بعد رفض واحد؛ قائمة سوداء بعد مرتجعين.", "Bannière 1 (AR)": "اللافتة 1 (عربي)", "Bannière 2 (AR)": "اللافتة 2 (عربي)", "Basée sur les ventes des 14 derniers jours et le seuil d'alerte.": "بناءً على مبيعات آخر 14 يومًا وحد التنبيه.", "bloqué +48 h": "عالق +48 سا", "bloqué(s)": "محظور", "Bloquée : l'échéance fournisseur du": "محظور: استحقاق المورد بتاريخ", "Bon": "أمر", "Bon de préparation": "وصل التحضير", "Bon de préparation groupé": "وصل تحضير مجمّع", "Bon de préparation groupé (picking)": "وصل تحضير مجمّع", "Bonjour": "مرحبًا", "Bons de commande": "أوامر الشراء", "Bons de commande fournisseur": "أوامر الشراء من المورد", "Bons de commande reçus de PackLik": "أوامر الشراء الواردة من باكليك", "Bons de commande, réceptions et suggestions": "أوامر الشراء، الاستلامات والاقتراحات", "Bonus upsell": "مكافأة البيع الإضافي", "Bordereau": "وصل التسليم", "Bordereau de remise": "وصل التسليم", "Bordereau de remise DHD": "وصل التسليم لـ DHD", "Boutique": "المتجر", "Boîtes écrasées (humidité)": "علب مسحوقة (رطوبة)", "Boîtes, barquettes, bowls, sacs craft et papier imprimés à votre logo, pour restaurants, fast-foods et pâtisseries.": "علب، صواني، أوعية، أكياس كرافت وورق مطبوع بشعارك، للمطاعم والوجبات السريعة ومحلات الحلويات.", "Brut": "الإجمالي", "Budget pub": "ميزانية الإشهار", "Bureau DHD": "مكتب DHD", "Bureau DHD (stop desk)": "مكتب DHD (ستوب ديسك)", "Bénéfice net": "الربح الصافي", "Bénéfice net du jour = CA des colis livrés ce jour − coût fournisseur − frais DHD − commissions − dépense pub réelle du jour − frais des retours. Les livraisons et versements viennent de DHD, la pub de Meta Ads.": "الربح الصافي لليوم = رقم أعمال الطرود المسلّمة في ذلك اليوم − تكلفة المورد − رسوم DHD − العمولات − مصروف الإشهار الفعلي لليوم − تكاليف المرتجعات. التوصيلات والدفعات من DHD، والإشهار من Meta Ads.", "Bénéfice net par jour (date de livraison)": "الربح الصافي يوميًا (تاريخ التوصيل)", "CA": "رقم الأعمال", "CA livré": "رقم الأعمال المسلّم", "CA livré (k DZD)": "رقم الأعمال المسلّم (ألف دج)", "Caisse": "الصندوق", "Caisse de sécurité": "صندوق الأمان", "Caisse de sécurité (% du bénéfice)": "صندوق الأمان (% من الربح)", "Calcul de ma commission": "حساب عمولتي", "calculée selon la wilaya": "تُحسب حسب الولاية", "Calendrier des échéances fournisseur (30 j)": "جدول استحقاقات المورد (30 يومًا)", "Campagne": "الحملة", "Cas difficiles": "الحالات الصعبة", "Cas particuliers": "حالات خاصة", "Casse": "تلف", "casse": "تلف", "Catégorie": "الفئة", "Catégories": "الفئات", "Catégories (17)": "الفئات (17)", "Catégories populaires": "الفئات الشائعة", "CCP": "CCP", "Ce client a déjà refusé un colis.": "هذا الزبون رفض طردًا من قبل.", "Ce mois": "هذا الشهر", "Ce pack est composé sur mesure : contactez-nous pour un devis.": "هذه الباقة تُركّب حسب الطلب: اتصل بنا للحصول على عرض سعر.", "Centre d'appel": "مركز الاتصال", "Cette commande est assignée à un autre agent.": "هذا الطلب معيّن لعون آخر.", "Changer de rôle": "تغيير الدور", "Changer l'adresse": "تغيير العنوان", "Chaque commande est confirmée par téléphone par un agent PackLik avant expédition.": "يتم تأكيد كل طلب هاتفيًا من طرف عون باكليك قبل الشحن.", "Chaque jour : pub, chiffre d'affaires et bénéfice net": "كل يوم: الإشهار، رقم الأعمال والربح الصافي", "Chaque nouvelle commande est attribuée en moins de 5 secondes à un agent en ligne.": "يُسند كل طلب جديد إلى عون متصل في أقل من 5 ثوانٍ.", "Chaque paiement contient le détail complet des commandes réglées.": "كل دفعة تحتوي على التفاصيل الكاملة للطلبات المسددة.", "Chaque tentative est rattachée à l'agent qui a confirmé : son taux de livraison en dépend.": "كل محاولة مرتبطة بالعون الذي أكد الطلب: نسبة توصيله تعتمد عليها.", "Charge la plus faible": "الأقل حملًا", "Charges (loyer, emballage, transport, divers)": "الأعباء (الإيجار، التغليف، النقل، متفرقات)", "Chez DHD": "لدى DHD", "Choisir une option": "اختر خيارًا", "Choisissez un agent": "اختر عونًا", "Classement": "الترتيب", "Classement et objectifs": "الترتيب والأهداف", "Client": "الزبون", "Client absent": "الزبون غائب", "Client connu : sa commande va à l'agent qui l'a déjà servi, s'il est disponible.": "زبون معروف: يُسند طلبه إلى العون الذي خدمه سابقًا إن كان متاحًا.", "Client injoignable": "الزبون لا يرد", "Client injoignable (SMS/WhatsApp)": "الزبون لا يرد (SMS/واتساب)", "Client ne répond pas": "الزبون لا يجيب", "client rappelé, relivraison demandée": "تم الاتصال بالزبون وطلب إعادة التوصيل", "Client reporté": "الزبون أجّل", "Clients": "الزبائن", "Cliquez sur une commande pour ouvrir l'écran d'appel": "انقر على طلب لفتح شاشة الاتصال", "Clé API DHD": "مفتاح API لـ DHD", "Clôture mensuelle": "الإقفال الشهري", "Clôturer": "إغلاق", "Clôturé": "مُقفل", "Clôturée": "مغلق", "Cmd": "طلبات", "Cochez au moins une commande": "حدّد طلبًا واحدًا على الأقل", "Cochez ensuite les permissions case par case dans la matrice.": "ثم حدّد الصلاحيات خانة بخانة في المصفوفة.", "Cochez les colis payés par ce versement. La répartition dans les 4 caisses est déclenchée automatiquement.": "حدّد الطرود المدفوعة بهذه الدفعة. يتم التوزيع على الصناديق الأربعة تلقائيًا.", "Cochez les commandes que vous réglez. Elles seront validées (clôturées) et le fournisseur recevra le détail complet de chaque commande.": "حدّد الطلبات التي تسددها. سيتم اعتمادها (إغلاقها) وسيتلقى المورد التفاصيل الكاملة لكل طلب.", "Code": "الرمز", "colis": "طرود", "Colis abîmé au dépôt": "طرد تالف في المستودع", "Colis bloqué +48 h": "طرد عالق +48 سا", "colis bloqué(s) +48 h sans mise à jour DHD": "طرد/طرود عالقة +48 سا دون تحديث من DHD", "colis chez DHD": "طرود لدى DHD", "Colis en cours de livraison : montants indicatifs (un colis peut être retourné).": "طرود قيد التوصيل: مبالغ تقديرية (قد يُرجع الطرد).", "Colis endommagé": "طرد تالف", "colis envoyé(s) à DHD": "طرد/طرود أُرسلت إلى DHD", "Colis expédié": "تم شحن الطرد", "colis expédiés non livrés": "طرود مشحونة غير مسلّمة", "Colis immobile plus de 48 h sans mise à jour DHD : alerte « colis bloqué ».": "طرد متوقف أكثر من 48 سا دون تحديث من DHD: تنبيه «طرد عالق».", "Colis intact": "طرد سليم", "colis livrés en attente de versement": "طرود مسلّمة في انتظار الدفع", "Colis payés": "الطرود المدفوعة", "Colis prêts à envoyer à DHD": "طرود جاهزة للإرسال إلى DHD", "colis rapprochés, caisses mises à jour": "تمت مطابقة الطرود وتحديث الصناديق", "Colis à risque": "طرود في خطر", "Collez ici le message WhatsApp / Messenger…": "الصق رسالة واتساب / ماسنجر هنا…", "Colonnes : SKU, Nom FR, Nom AR, Catégories, Prix vente, Prix achat, Conditionnement, Stock, Seuil": "الأعمدة: المرجع، الاسم بالفرنسية، الاسم بالعربية، الفئات، سعر البيع، سعر الشراء، التعبئة، المخزون، الحد", "Commande": "الطلب", "Commande 1 → agent A, commande 2 → agent B…": "الطلب 1 ← العون أ، الطلب 2 ← العون ب…", "Commande créée": "تم إنشاء الطلب", "Commande d'un autre agent": "طلب عون آخر", "Commande encaissée par PackLik (part fournisseur)": "طلب حصّلته باكليك (حصة المورد)", "Commande suivante": "الطلب التالي", "commande(s) prête(s)": "طلب/طلبات جاهزة", "commande(s) renvoyée(s) dans la file commune": "طلب/طلبات أُعيدت إلى القائمة العامة", "commande(s) réassignée(s)": "طلب/طلبات أُعيد تعيينها", "commande(s) réattribuée(s)": "طلب/طلبات أُعيد إسنادها", "Commander maintenant": "اطلب الآن", "commandes": "طلبات", "Commandes": "الطلبات", "commandes antérieures (historique importé)": "طلبات سابقة (سجل مستورد)", "Commandes avec tentative échouée — triées par urgence": "طلبات بمحاولة فاشلة — مرتبة حسب الاستعجال", "commandes confirmées non expédiées": "طلبات مؤكدة لم تُشحن بعد", "Commandes confirmées à préparer": "طلبات مؤكدة للتحضير", "Commandes créées": "الطلبات المنشأة", "commandes déjà encaissées par PackLik": "طلبات حصّلتها باكليك", "Commandes et CA livré — 30 jours": "الطلبات ورقم الأعمال المسلّم — 30 يومًا", "Commandes livrées": "الطلبات المسلّمة", "Commandes livrées au client : DHD n'a pas encore versé l'argent à PackLik.": "طلبات سُلّمت للزبون: لم تدفع DHD المبلغ لباكليك بعد.", "commandes livrées, argent pas encore reçu": "طلبات مسلّمة، لم يُستلم المبلغ بعد", "commandes livrées, argent pas encore versé par DHD": "طلبات مسلّمة، لم تدفعها DHD بعد", "commandes livrées, DHD n'a pas encore versé": "طلبات مسلّمة، لم تدفع DHD بعد", "commandes non traitées depuis +2 h": "طلبات غير معالجة منذ +2 سا", "Commandes par jour": "الطلبات يوميًا", "Commandes passées": "الطلبات السابقة", "commandes payées par DHD": "طلبات دفعتها DHD", "Commandes reçues": "الطلبات المستلمة", "Commandes réglées et validées.": "طلبات مسددة ومعتمدة.", "commandes sélectionnées": "طلبات محددة", "Commandes traitées": "الطلبات المعالجة", "Commandes à confirmer": "طلبات للتأكيد", "Commandes à risque, refus, remises à valider": "طلبات في خطر، رفض، تخفيضات للموافقة", "commandes à traiter maintenant": "طلبات للمعالجة الآن", "Commandé": "المطلوب", "Commencer l'appel suivant": "بدء المكالمة التالية", "Comment ça marche": "كيف يعمل", "Commentaire": "تعليق", "Commentaire livreur": "تعليق عامل التوصيل", "Commission agent": "عمولة العون", "Commission du mois": "عمولة الشهر", "Commission par commande livrée (DZD)": "العمولة لكل طلب مسلّم (دج)", "Commune": "البلدية", "commune manquante": "البلدية ناقصة", "Comparer": "مقارنة", "Composition": "المكوّنات", "Comptabilité": "المحاسبة", "Compte de résultat": "حساب النتائج", "Comptes de tiers": "حسابات الغير", "Compté": "المعدود", "Conditionnement": "التعبئة", "Conditionnement (pièces)": "التعبئة (قطع)", "Conditions": "الشروط", "Conditions générales de vente": "الشروط العامة للبيع", "Confirmation": "التأكيد", "Confirmations": "التأكيدات", "Confirmations par agent": "التأكيدات لكل عون", "Confirmations — 14 jours": "التأكيدات — 14 يومًا", "Confirmer l'annulation": "تأكيد الإلغاء", "Confirmer la commande": "تأكيد الطلب", "Confirmer la réception": "تأكيد الاستلام", "Confirmer quantités et date": "تأكيد الكميات والتاريخ", "confirmé": "مؤكد", "Confirmé par le fournisseur": "أكّده المورد", "Confirmée": "مؤكد", "confirmée": "مؤكد", "Confirmées": "المؤكدة", "Connexion": "تسجيل الدخول", "Connexion DHD OK (démo)": "الاتصال بـ DHD ناجح (تجربة)", "Connexion téléphone ou e-mail + mot de passe ; 2FA pour l'Admin ; déconnexion après 30 min d'inactivité.": "الدخول بالهاتف أو البريد + كلمة المرور؛ مصادقة ثنائية للمدير؛ خروج تلقائي بعد 30 دقيقة من عدم النشاط.", "Contact": "اتصل بنا", "Contactez-nous": "اتصل بنا", "Contenu du pack": "محتوى الباقة", "Continuer mes achats": "مواصلة التسوق", "Contrôle qualité — annulations récentes": "مراقبة الجودة — الإلغاءات الأخيرة", "Contrôles": "الفحوصات", "Contrôlez l'état du colis": "افحص حالة الطرد", "Conversions API (token)": "Conversions API (رمز)", "Corriger l'adresse": "تصحيح العنوان", "Corriger l'adresse et la transmettre à DHD": "تصحيح العنوان وإرساله إلى DHD", "Couleur principale": "اللون الرئيسي", "Couverture": "التغطية", "Coût composants": "تكلفة المكوّنات", "Coût d'achat": "تكلفة الشراء", "Coût d'achat fournisseur": "تكلفة الشراء من المورد", "Coût DHD bureau": "تكلفة DHD (مكتب)", "Coût DHD domicile": "تكلفة DHD (منزل)", "Coût par commande livrée": "التكلفة لكل طلب مسلّم", "Coût par commande reçue": "التكلفة لكل طلب مستلم", "Coût pub alloué = dépense Meta de la période ÷ commandes livrées sur la période.": "تكلفة الإشهار المخصصة = مصروف ميتا للفترة ÷ الطلبات المسلّمة خلال الفترة.", "Coût pub alloué par commande livrée (DZD)": "تكلفة الإشهار المخصصة لكل طلب مسلّم (دج)", "Coût pub alloué à la commande": "تكلفة الإشهار المخصصة للطلب", "Création d'envoi par API, étiquettes et bordereau": "إنشاء الشحنات عبر API، الملصقات ووصل التسليم", "Crédit": "دائن", "Créer": "إنشاء", "Créer la commande": "إنشاء الطلب", "Créer un bon depuis les suggestions": "إنشاء أمر شراء من الاقتراحات", "Créer une équipe": "إنشاء فريق", "Créé le": "أُنشئ في", "créée": "تم الإنشاء", "Créées": "المنشأة", "dans": "خلال", "dans le panier": "في السلة", "Date": "التاريخ", "Date de livraison": "تاريخ التوصيل", "Date de remboursement": "تاريخ التسديد", "Date et heure": "التاريخ والوقت", "Date invalide": "تاريخ غير صالح", "Date souhaitée par le client": "التاريخ الذي يريده الزبون", "de": "من", "De": "من", "de confirmation": "نسبة التأكيد", "de la réserve": "من الاحتياطي", "de PackLik. Vous avez commandé": "من باكليك. لقد طلبت", "de pertes": "خسائر", "de pertes estimées": "خسائر مقدّرة", "Demander sur WhatsApp": "اطلب عبر واتساب", "Demander un devis": "طلب عرض سعر", "Derniers paiements reçus": "آخر الدفعات المستلمة", "dernière": "آخر", "Dernière commande": "آخر طلب", "Dernière mise à jour": "آخر تحديث", "des dépenses Meta (30 j) couvertes par les bénéfices, sans avance ni apport.": "من مصاريف ميتا (30 يومًا) مغطاة بالأرباح، دون تسبيق أو مساهمة.", "Des packs complets prêts à l'emploi pour démarrer votre service à emporter au meilleur prix.": "باقات كاملة جاهزة لبدء خدمة الطلبات الخارجية بأفضل سعر.", "Description SEO": "وصف SEO", "Desservie": "مخدومة", "Destinataire": "المستلم", "Dette fournisseur": "دين المورد", "Dette salariale": "دين الأجور", "dettes échues sous 3 j": "ديون تستحق خلال 3 أيام", "deviendrait impossible à tenir": "سيصبح الوفاء به مستحيلًا", "devis": "حسب الطلب", "DHD synchronisé": "تمت مزامنة DHD", "DHD verse l'argent : la part fournisseur passe en « Pending — à régler » chez le fournisseur.": "تدفع DHD المبلغ: تنتقل حصة المورد إلى «معلّق — للتسوية» لدى المورد.", "dispo": "متوفر", "Dispo": "المتاح", "Disponibilité": "التوفر", "Disponible": "المتاح", "Disponible = physique − réservé": "المتاح = الفعلي − المحجوز", "disponibles": "متوفرة", "Divers": "متفرقات", "Domicile": "المنزل", "dormant": "راكد", "Dormants (30 j)": "راكدة (30 يومًا)", "Doublon": "مكرر", "Doublon probable": "تكرار محتمل", "Doublon probable : même téléphone et mêmes produits en moins de 24 h.": "تكرار محتمل: نفس الهاتف ونفس المنتجات خلال أقل من 24 سا.", "doublon(s) annulé(s)": "مكرر/مكررات أُلغيت", "Du": "من", "du bénéfice net ; l'Admin décide": "من الربح الصافي؛ يقرر المدير", "du bénéfice net, plafond": "من الربح الصافي، الحد الأقصى", "Dupliquer": "نسخ", "Débit": "مدين", "Délai": "المهلة", "délai": "المهلة", "Délai dépassé": "تجاوز المهلة", "Délai envoi → livraison": "المدة من الشحن إلى التوصيل", "Délai fournisseur par défaut (jours)": "مهلة المورد الافتراضية (أيام)", "Délai livraison → paiement": "المدة من التوصيل إلى الدفع", "Délai moyen 1er appel": "متوسط مدة أول اتصال", "Délais de rappel « Injoignable » 1 / 2 / 3": "مهل إعادة الاتصال «لا يرد» 1 / 2 / 3", "Démo : connecté en tant que": "تجربة: متصل باسم", "Dépense": "مصروف", "Dépense aujourd'hui": "مصروف اليوم", "Dépense enregistrée": "تم تسجيل المصروف", "Dépense Meta (30 j)": "مصروف ميتا (30 يومًا)", "Dépense Meta 30 j": "مصروف ميتا 30 يومًا", "Dépense Meta du jour": "مصروف ميتا لليوم", "Dépense par campagne": "المصروف حسب الحملة", "Dépense pub": "مصروف الإشهار", "Dépense sur la période": "المصروف خلال الفترة", "Dépenses Meta": "مصاريف ميتا", "Dépenses Meta importées (API)": "تم استيراد مصاريف ميتا (API)", "Dépensé": "المُنفَق", "Déposez ici": "أفلت هنا", "Déposez votre fichier .xlsx ou .csv": "أفلت ملف ‎.xlsx أو ‎.csv", "Détail": "التفاصيل", "Détail par produit": "التفصيل حسب المنتج", "Détails": "التفاصيل", "Dû au fournisseur": "المستحق للمورد", "E-mail": "البريد الإلكتروني", "Effacer": "مسح", "Effacer la simulation": "مسح المحاكاة", "Emballage": "التغليف", "Emballage personnalisé": "تغليف مخصص", "En appel": "قيد الاتصال", "En attente": "في الانتظار", "En attente de paiement DHD": "في انتظار دفع DHD", "En attente du fournisseur": "في انتظار المورد", "En cours de livraison": "قيد التوصيل", "En cours de livraison (part fournisseur)": "قيد التوصيل (حصة المورد)", "En ligne": "متصل", "En pause": "في استراحة", "En production, la dépense est importée automatiquement depuis l'API Meta Ads. Taux": "في الإنتاج يُستورد المصروف تلقائيًا من API ميتا. سعر الصرف", "En retard": "متأخر", "En route": "في الطريق", "En stock": "متوفر", "En transit": "في الطريق", "EN VEDETTE": "مميز", "En vedette": "مميز", "encaissée": "محصّلة", "Enregistrer": "حفظ", "Entité": "الكيان", "Entonnoir": "مسار التحويل", "Entrée achat": "إدخال شراء", "Entrée automatique en stock.": "إدخال تلقائي إلى المخزون.", "Entrées DHD prévues": "مداخيل DHD المتوقعة", "Envoyer": "إرسال", "Envoyer au fournisseur": "إرسال إلى المورد", "Envoyer un message": "أرسل رسالة", "Envoyer à DHD": "إرسال إلى DHD", "Envoyer à DHD en masse": "إرسال جماعي إلى DHD", "Envoyé au fournisseur": "أُرسل إلى المورد", "envoyé au fournisseur": "أُرسل إلى المورد", "Envoyée à DHD": "أُرسل إلى DHD", "Envoyées aujourd'hui": "المرسلة اليوم", "Envoyés aujourd'hui": "المرسلة اليوم", "Espace Gérant : prix d'achat, bénéfices, caisses et salaires masqués.": "مساحة المسيّر: أسعار الشراء والأرباح والصناديق والأجور مخفية.", "Espèces": "نقدًا", "Essayez une autre recherche ou une autre catégorie.": "جرّب بحثًا أو فئة أخرى.", "estimée": "تقديرية", "Ex. : augmenter la pub": "مثال: زيادة الإشهار", "Ex. : Comptable externe": "مثال: محاسب خارجي", "Ex. : devis pour 1 000 boîtes burger imprimées à notre logo": "مثال: عرض سعر لـ 1000 علبة برغر مطبوعة بشعارنا", "Ex. : rappeler après 17h, gérant absent": "مثال: إعادة الاتصال بعد 17:00، المسير غائب", "Exemple pour la démo": "مثال للتجربة", "Export Excel": "تصدير Excel", "Export PDF": "تصدير PDF", "Export pour le comptable": "تصدير للمحاسب", "Export WhatsApp": "تصدير واتساب", "Exporter": "تصدير", "Expédier": "شحن", "Expédition DHD": "الشحن عبر DHD", "Expédiées": "المشحونة", "Facebook / Instagram": "فيسبوك / إنستغرام", "Faux numéro": "رقم خاطئ", "Favoris": "المفضلة", "Fermer": "إغلاق", "Fiche créée automatiquement à la première commande, identifiée par le téléphone": "بطاقة تُنشأ تلقائيًا عند أول طلب، معرّفة برقم الهاتف", "Fiche financière": "البطاقة المالية", "Fiche financière de la commande": "البطاقة المالية للطلب", "Fiche fournisseur": "بطاقة المورد", "Fiche ouverte — verrouillée pour les autres agents": "تم فتح الطلب — مقفل للأعوان الآخرين", "Fichier": "الملف", "Fichier exporté": "تم تصدير الملف", "fidèle": "وفيّ", "Fidèle": "وفيّ", "file commune": "القائمة العامة", "File commune": "القائمة العامة", "File globale": "القائمة العامة", "File par agent": "القائمة لكل عون", "Filtrer": "تصفية", "Filtres": "التصفية", "Finance": "المالية", "Finance et comptabilité": "المالية والمحاسبة", "Fixe": "الأجر الثابت", "Flux du jour": "تدفق اليوم", "Fournisseur": "المورد", "Fournisseur — à payer": "المورد — مستحق الدفع", "Fournisseurs": "الموردون", "Frais bureau": "رسوم المكتب", "Frais de livraison (69 wilayas)": "رسوم التوصيل (69 ولاية)", "Frais de livraison facturés au client": "رسوم التوصيل المفوترة للزبون", "Frais DHD": "رسوم DHD", "Frais DHD (aller + retours)": "رسوم DHD (ذهاب + مرتجعات)", "Frais DHD facturés 300 DZD de plus que prévu": "رسوم DHD أعلى بـ 300 دج من المتوقع", "Frais DHD retenus": "رسوم DHD المقتطعة", "Frais domicile": "رسوم المنزل", "Frais mis à jour — appliqués à la boutique": "تم تحديث الرسوم — مطبقة على المتجر", "Frais retours": "تكاليف المرتجعات", "Français": "الفرنسية", "gagnés": "مكتسبة", "Gain d'upsell": "ربح البيع الإضافي", "Gain upsell": "ربح البيع الإضافي", "Gestion de stock": "إدارة المخزون", "Glissez-déposez une commande vers un agent pour la réassigner. Chaque réattribution est tracée.": "اسحب طلبًا وأفلته عند عون لإعادة تعيينه. كل إعادة تعيين مسجلة.", "Gérant": "المسيّر", "Haute qualité": "جودة عالية", "Hier": "أمس", "Historique": "السجل", "Historique complet": "السجل الكامل", "Historique des commandes": "سجل الطلبات", "Historique des livraisons à PackLik": "سجل التوريدات إلى باكليك", "Historique des paiements": "سجل الدفعات", "Horaires": "أوقات العمل", "hors ligne": "غير متصل", "Hors ligne": "غير متصل", "Hors zone": "خارج المنطقة", "ici": "معك", "Import Excel": "استيراد Excel", "Import simulé : 91 produits vérifiés, 0 erreur": "استيراد تجريبي: 91 منتجًا، 0 أخطاء", "Importer": "استيراد", "Importer (fichier ou API)": "استيراد (ملف أو API)", "Impossible de confirmer": "تعذّر التأكيد", "Imprimer": "طباعة", "Imprimer le bon": "طباعة الوصل", "Inactif": "غير نشط", "Indicateur « Pub autofinancée »": "مؤشر «الإشهار الممول ذاتيًا»", "Initial": "الأولي", "Injoignable": "لا يرد", "Injoignable 1-2-3": "لا يرد 1-2-3", "Injoignable 3 fois": "لا يرد 3 مرات", "Instagram": "إنستغرام", "Intact — réintégrer en stock": "سليم — إعادته إلى المخزون", "Intégrations": "التكاملات", "Inventaire": "الجرد", "Inventaire validé": "تم اعتماد الجرد", "Je vous appelle pour confirmer votre commande.": "أتصل بك لتأكيد طلبك.", "Jour": "اليوم", "Journal": "اليومية", "Journal (mes agents)": "السجل (أعواني)", "Journal d'activité": "سجل النشاط", "jours après le versement DHD": "أيام بعد دفعة DHD", "jours de pub": "أيام من الإشهار", "Justificatif": "الإثبات", "Justifier": "تبرير", "Justifié": "مبرر", "L'Admin peut activer ce partage pour vous aider à anticiper le réapprovisionnement.": "يمكن للمدير تفعيل هذه المشاركة لمساعدتك على توقع إعادة التموين.", "L'agent qui a le moins de commandes en attente reçoit la suivante": "العون الذي لديه أقل طلبات في الانتظار يتلقى الطلب التالي", "L'argent reçu de DHD n'est pas du bénéfice.": "المال المستلم من DHD ليس ربحًا.", "La commande doit contenir au moins un produit": "يجب أن يحتوي الطلب على منتج واحد على الأقل", "La commande est livrée : sa part fournisseur passe en « En attente de paiement DHD ».": "تم توصيل الطلب: تنتقل حصة المورد إلى «في انتظار دفع DHD».", "La dette fournisseur est réservée avant tout calcul de trésorerie libre.": "يُحجز دين المورد قبل أي حساب للخزينة المتاحة.", "La liste est vide.": "القائمة فارغة.", "La marchandise reçue entre en stock. Le fournisseur est payé commande par commande : sa part devient « Pending — à régler » dès que DHD verse l'argent, puis « Payé » quand vous validez le paiement.": "تدخل البضاعة المستلمة إلى المخزون. يُدفع للمورد طلبًا بطلب: تصبح حصته «معلّق — للتسوية» بمجرد دفع DHD، ثم «مدفوع» عند اعتمادك للدفعة.", "La Réserve fournisseur ne peut sortir que pour payer le fournisseur (ou via une avance pub contrôlée).": "لا يُصرف احتياطي المورد إلا لدفع مستحقات المورد (أو عبر تسبيق إشهار مضبوط).", "La vente d'un pack décrémente le stock de chaque composant.": "بيع الباقة يخصم من مخزون كل مكوّن.", "Le client demande à être rappelé": "الزبون طلب إعادة الاتصال", "Le client dit qu'il n'a rien commandé": "الزبون يقول إنه لم يطلب شيئًا", "Le fournisseur est payé commande par commande, après le versement DHD": "يُدفع للمورد طلبًا بطلب بعد دفعة DHD", "Le Manager attribue lui-même": "المشرف يُسند بنفسه", "Le montant sort de la Réserve fournisseur": "يُخصم المبلغ من احتياطي المورد", "Lecture": "قراءة", "Lecture (dispo)": "قراءة (التوفر)", "Lecture (encaissements DHD)": "قراءة (تحصيلات DHD)", "Lecture (prix de vente)": "قراءة (أسعار البيع)", "Lecture (ses agents)": "قراءة (أعوانه)", "Lecture (ses produits)": "قراءة (منتجاته)", "Les 4 principes": "المبادئ الأربعة", "Les agents au meilleur taux de livraison reçoivent plus": "الأعوان ذوو أفضل نسبة توصيل يتلقون أكثر", "Les plus ajoutés en upsell": "الأكثر إضافة كبيع إضافي", "Les tentatives échouées reviennent à l'agent qui a confirmé.": "تعود المحاولات الفاشلة إلى العون الذي أكد الطلب.", "Libellé": "البيان", "Liens utiles": "روابط مفيدة", "Ligne": "سطر", "Lignes": "الأسطر", "Liste noire": "القائمة السوداء", "liste noire": "قائمة سوداء", "Liste noire : 2 retours ou plus. Vérifiez bien avant de confirmer.": "قائمة سوداء: مرتجعان أو أكثر. تحقق جيدًا قبل التأكيد.", "livr.": "توصيل", "Livraison": "التوصيل", "Livraison 69 wilayas": "التوصيل إلى 69 ولاية", "Livraison prévue": "التوصيل المتوقع", "Livraison souhaitée": "التوصيل المطلوب", "Livraison — paiement à la livraison": "التوصيل — الدفع عند الاستلام", "Livraisons": "التوريدات", "Livreur — à recevoir (colis livrés non payés)": "عامل التوصيل — مستحق (طرود مسلّمة غير مدفوعة)", "Livrée": "تم التوصيل", "livrée": "مسلّم", "Livrée le": "سُلّم في", "livrées": "مسلّمة", "Livrées": "المسلّمة", "Loyer": "الإيجار", "Ma file": "قائمتي", "Ma file — triée par priorité": "قائمتي — مرتبة حسب الأولوية", "Magasin fermé": "المحل مغلق", "Manager": "المشرف", "Manager jusqu'à": "المشرف حتى", "Manuel": "يدوي", "Marge": "الهامش", "Marge brute": "الهامش الإجمالي", "marge de sécurité": "هامش الأمان", "Marge estimée": "الهامش المقدّر", "Marge par produit (top 10)": "الهامش حسب المنتج (أفضل 10)", "Marge unitaire": "هامش الوحدة", "Marge unitaire calculée": "هامش الوحدة المحسوب", "Marge visible par l'Admin uniquement": "الهامش مرئي للمدير فقط", "Marketing": "التسويق", "Marquer livrée": "تحديد كمسلّم", "Marquer payée par DHD": "تحديد كمدفوع من DHD", "Marquer prête": "تحديد كجاهز", "Marquer prêtes": "تحديد كجاهزة", "Marquer retour": "تحديد كمرتجع", "Marquer vérifiée": "تحديد كمُراجَع", "marquée en retour": "حُدد كمرتجع", "masqué": "مخفي", "Matrice des accès": "مصفوفة الصلاحيات", "Matériaux alimentaires certifiés": "مواد غذائية معتمدة", "MEILLEURES VENTES": "الأكثر مبيعًا", "Membre enregistré": "تم حفظ العضو", "Membres": "الأعضاء", "Menu": "القائمة", "Merci ! Votre commande est enregistrée": "شكرًا! تم تسجيل طلبك", "Merci de corriger le formulaire": "يرجى تصحيح الاستمارة", "Mes adresses": "عناويني", "Mes commandes confirmées jusqu'à la livraison": "طلباتي المؤكدة حتى التوصيل", "Mes livraisons": "توصيلاتي", "Mes performances": "أدائي", "Mes rappels": "مواعيد الاتصال", "Message": "الرسالة", "Message envoyé — nous vous répondons rapidement": "تم إرسال الرسالة — سنرد عليك قريبًا", "Message reçu / note": "الرسالة المستلمة / ملاحظة", "Messenger": "ماسنجر", "mise(s) à jour": "تحديث/تحديثات", "Mode": "الطريقة", "Mode de répartition": "طريقة التوزيع", "Mode maintenance": "وضع الصيانة", "Modif.": "تعديل", "Modif. (sans prix d'achat)": "تعديل (دون أسعار الشراء)", "modifiable": "قابل للتعديل", "Modifier": "تعديل", "Modifier le produit": "تعديل المنتج", "Modifier un membre": "تعديل عضو", "Module": "الوحدة", "Modèles de messages": "نماذج الرسائل", "Mois clôturé et verrouillé": "تم إقفال الشهر", "Mon compte": "حسابي", "Mon espace": "مساحتي", "Mon taux de livraison": "نسبة توصيلي", "Mon équipe": "فريقي", "montant": "المبلغ", "Montant": "المبلغ", "Montant (achat)": "المبلغ (شراء)", "Montant (DZD)": "المبلغ (دج)", "Montant (max": "المبلغ (الحد الأقصى", "Montant (prix fournisseur)": "المبلغ (سعر المورد)", "Montant (USD)": "المبلغ (دولار)", "Montant au-delà du montant avançable : avance bloquée": "المبلغ يتجاوز القابل للتسبيق: التسبيق محظور", "Montant avançable maintenant": "المبلغ القابل للتسبيق الآن", "Montant fournisseur": "مبلغ المورد", "Montant invalide": "مبلغ غير صالح", "Montant net reçu (DZD)": "صافي المبلغ المستلم (دج)", "Montant remise": "مبلغ التخفيض", "Montant à payer": "المبلغ الواجب دفعه", "Montant ≥": "المبلغ ≥", "Montants visibles par l'Admin uniquement.": "المبالغ مرئية للمدير فقط.", "Mot de passe": "كلمة المرور", "Motif": "السبب", "Motif (obligatoire)": "السبب (إلزامي)", "Motif DHD": "سبب DHD", "Motif obligatoire": "السبب إلزامي", "Motifs d'annulation": "أسباب الإلغاء", "Motifs d'échec": "أسباب الإخفاق", "Motifs d'échec de livraison": "أسباب فشل التوصيل", "Mouvement enregistré": "تم تسجيل الحركة", "Mouvement entre caisses": "تحويل بين الصناديق", "Mouvements": "الحركات", "Mouvements des caisses": "حركات الصناديق", "Moyenne par jour": "المتوسط اليومي", "Nature": "الطبيعة", "Net": "الصافي", "Net reçu": "الصافي المستلم", "Nom": "الاسم", "Nom AR": "الاسم بالعربية", "Nom commercial": "الاسم التجاري", "Nom complet": "الاسم الكامل", "Nom de l'équipe": "اسم الفريق", "Nom du client": "اسم الزبون", "Nom du rôle": "اسم الدور", "Nom et téléphone valides requis": "الاسم والهاتف الصحيحان مطلوبان", "Nom FR": "الاسم بالفرنسية", "Nom requis": "الاسم مطلوب", "Nom, téléphone, commerce…": "الاسم، الهاتف، المحل…", "Nombre de commandes": "عدد الطلبات", "Non assignée": "غير معيّن", "Non assignées": "غير معيّنة", "non assignées": "غير معيّنة", "Non modifiable — chaque action sensible est tracée": "غير قابل للتعديل — كل إجراء حساس مسجّل", "Note": "ملاحظة", "Note (facultatif)": "ملاحظة (اختياري)", "Note client": "ملاحظة الزبون", "Note d'appel": "ملاحظة المكالمة", "Note enregistrée": "تم حفظ الملاحظة", "Notes": "ملاحظات", "Notifications": "الإشعارات", "Nouveau": "جديد", "NOUVEAU": "جديد", "nouveau": "جديد", "Nouveau bon de commande": "أمر شراء جديد", "Nouveau bon de commande fournisseur": "أمر شراء جديد من المورد", "Nouveautés": "الأحدث", "nouvelle": "جديدة", "Nouvelle": "جديد", "Nouvelle avance pub": "تسبيق إشهار جديد", "Nouvelle commande manuelle": "طلب يدوي جديد", "Nouvelle date": "تاريخ جديد", "Nouvelle date de livraison": "تاريخ توصيل جديد", "Nouvelle date transmise à DHD": "تم إرسال التاريخ الجديد إلى DHD", "Nouvelles commandes": "طلبات جديدة", "Nouvelles offres": "عروض جديدة", "N° de commande": "رقم الطلب", "objectif": "الهدف", "Objectifs de la semaine": "أهداف الأسبوع", "Objet": "الغرض", "Offres exclusives à ne pas manquer": "عروض حصرية لا تتكرر", "OK": "جيد", "Onglet Tentatives": "قسم المحاولات", "Option non activée par PackLik": "الخيار غير مفعّل من طرف باكليك", "Opération": "العملية", "Opérations": "العمليات", "Ordre": "الترتيب", "orthographe": "الإملاء", "Ouvrir": "فتح", "Ouvrir l'ERP": "فتح نظام ERP", "Ouvrir une réclamation DHD": "فتح شكوى لدى DHD", "pack": "باقة", "Pack": "الباقة", "PackLik a déjà reçu l'argent de DHD pour ces commandes : elles seront validées à votre prochain paiement.": "استلمت باكليك المبلغ من DHD لهذه الطلبات: سيتم اعتمادها في دفعتك القادمة.", "PackLik, votre partenaire de confiance pour l'emballage et les solutions alimentaires en Algérie.": "باكليك، شريككم الموثوق في التغليف والحلول الغذائية في الجزائر.", "Packs": "الباقات", "Paiement": "الدفع", "Paiement fournisseur": "دفعة المورد", "paiement par commande, sous": "الدفع حسب الطلب، خلال", "Paiement reçu": "دفعة مستلمة", "Paiement validé": "تم اعتماد الدفعة", "Paiement à la livraison": "الدفع عند الاستلام", "Paiement à la livraison (espèces) dans les 69 wilayas via DHD. Les frais de livraison dépendent de la wilaya et du type de livraison (domicile ou bureau DHD).": "الدفع عند الاستلام (نقدًا) في 69 ولاية عبر DHD. تختلف رسوم التوصيل حسب الولاية ونوع التوصيل (منزل أو مكتب DHD).", "Paiement à la livraison uniquement": "الدفع عند الاستلام فقط", "paiement(s) à confirmer": "دفعة/دفعات للتأكيد", "paiements": "دفعات", "Paiements et commandes": "الدفعات والطلبات", "Paiements reçus": "الدفعات المستلمة", "Panier": "السلة", "Panier moyen": "متوسط السلة", "Par agent": "حسب العون", "Par catégorie": "حسب الفئة", "Par page": "لكل صفحة", "Par produit (marge brute)": "حسب المنتج (الهامش الإجمالي)", "Par règle": "حسب القاعدة", "Par source": "حسب المصدر", "Par wilaya": "حسب الولاية", "Par wilaya, langue, source ou montant": "حسب الولاية أو اللغة أو المصدر أو المبلغ", "paramètre appliqué aux fiches": "الإعداد المطبق على البطاقات", "Paramètres": "الإعدادات", "Paramètres du site": "إعدادات الموقع", "Paramètres enregistrés": "تم حفظ الإعدادات", "Paramètres ERP": "إعدادات ERP", "Parent": "الأصل", "part fournisseur des commandes déjà payées par DHD": "حصة المورد من الطلبات التي دفعتها DHD", "Partager « Ventes de mes produits » avec le fournisseur": "مشاركة «مبيعات منتجاتي» مع المورد", "Passer en stop desk": "التحويل إلى مكتب DHD", "Passer la commande": "إتمام الطلب", "passée en stop desk": "حُوّل إلى مكتب DHD", "Pause": "استراحة", "pause": "استراحة", "Payer": "دفع", "Payer le fournisseur": "دفع مستحقات المورد", "Payer le fournisseur — commandes encaissées de DHD": "دفع مستحقات المورد — طلبات حُصّلت من DHD", "Payez en espèces à la réception": "ادفع نقدًا عند الاستلام", "Payé (validé)": "مدفوع (معتمد)", "Payé au fournisseur sur la période": "المدفوع للمورد خلال الفترة", "Payé depuis": "مدفوع من", "Payé à DHD (déduit du versement)": "مدفوع لـ DHD (مخصوم من الدفعة)", "Payée": "مدفوع", "Payée par DHD": "مدفوع من DHD", "Payée par DHD (rapprochée)": "مدفوع من DHD (مطابق)", "Payée par DHD le": "دفعته DHD في", "Payées": "المدفوعة", "Pending — commandes à régler": "معلّق — طلبات للتسوية", "Pending — pas encore reçu de DHD": "معلّق — لم يُستلم بعد من DHD", "Pending — à régler": "معلّق — للتسوية", "Pending — à régler par PackLik": "معلّق — ستسدده باكليك", "Performance des agents": "أداء الأعوان", "Personnalisé": "مخصص", "Perte absorbée par la Caisse de sécurité": "خسارة يتحملها صندوق الأمان", "Perte estimée": "الخسارة المقدّرة", "Physique": "الفعلي", "Pilotage": "القيادة", "Pixel Meta": "بكسل ميتا", "pièces": "قطعة", "plafond": "الحد الأقصى", "Plafond d'avance pub (% de la réserve)": "سقف تسبيق الإشهار (% من الاحتياطي)", "Plein écran": "ملء الشاشة", "Poids": "الوزن", "Poids %": "الوزن %", "Poids (g)": "الوزن (غ)", "Pondéré par performance": "مرجّح حسب الأداء", "Popularité": "الأكثر شعبية", "Portail fournisseur": "بوابة المورد", "Portail fournisseur : vous ne voyez ni les prix de vente, ni les clients, ni les bénéfices de PackLik.": "بوابة المورد: لا ترى أسعار بيع باكليك ولا زبائنها ولا أرباحها.", "Priorité": "الأولوية", "Prix": "السعر", "Prix (DZD)": "السعر (دج)", "Prix compétitifs – emballage personnalisé selon votre marque": "أسعار تنافسية – تغليف مخصص حسب علامتك التجارية", "Prix croissant": "السعر تصاعديًا", "Prix d'achat": "سعر الشراء", "Prix d'achat (DZD)": "سعر الشراء (دج)", "Prix d'achat et bénéfices visibles uniquement par l'Admin.": "أسعار الشراء والأرباح مرئية للمدير فقط.", "Prix d'achat et marges masqués pour votre rôle.": "أسعار الشراء والهوامش مخفية لدورك.", "Prix d'achat fictifs (65–75 % du prix de vente) à remplacer par les vrais.": "أسعار شراء تجريبية (65–75% من سعر البيع) يجب استبدالها بالأسعار الحقيقية.", "Prix de vente": "سعر البيع", "Prix de vente (DZD)": "سعر البيع (دج)", "Prix décroissant": "السعر تنازليًا", "Prix fournisseur": "سعر المورد", "Prix sur devis": "السعر حسب الطلب", "Prix unitaire": "سعر الوحدة", "Prochain rappel": "الاتصال القادم", "Prochaine échéance": "الاستحقاق القادم", "Produit": "المنتج", "Produit dupliqué (masqué)": "تم نسخ المنتج (مخفي)", "Produit en rupture": "المنتج غير متوفر", "Produit enregistré — visible immédiatement sur la boutique": "تم حفظ المنتج — يظهر فورًا في المتجر", "Produit introuvable": "المنتج غير موجود", "Produits": "المنتجات", "produits": "منتجات", "Produits (91)": "المنتجات (91)", "Produits (quantité × prix fournisseur)": "المنتجات (الكمية × سعر المورد)", "Produits associés": "منتجات ذات صلة", "Produits dormants": "منتجات راكدة", "Produits et catégories": "المنتجات والفئات", "Produits suggérés pour l'upsell": "منتجات مقترحة للبيع الإضافي", "professionnel": "محترف", "Professionnel": "محترف", "Programmer": "برمجة", "Programmer un rappel": "برمجة اتصال", "Projection de trésorerie — 30 jours": "توقعات الخزينة — 30 يومًا", "Proposer": "اقترح", "Proposer la livraison au bureau DHD (stop desk)": "اقتراح التوصيل إلى مكتب DHD (ستوب ديسك)", "Prototype interactif — la boutique est branchée en direct sur l'ERP": "نموذج تفاعلي — المتجر مربوط مباشرة بنظام ERP", "Préparation": "التحضير", "Préparation, expédition DHD, retours, stock": "التحضير، الشحن عبر DHD، المرتجعات، المخزون", "Préparer": "تحضير", "Prévisualisation de la répartition du jour": "معاينة توزيع اليوم", "Prête": "جاهز", "prête": "جاهزة", "Prête (emballée et pesée)": "جاهز (مغلف وموزون)", "Prêtes": "الجاهزة", "Pub (DZD)": "الإشهار (دج)", "Pub (USD)": "الإشهار (دولار)", "Pub Meta": "إشهار ميتا", "Pub prévue": "الإشهار المتوقع", "Publicité Meta": "إشهار ميتا", "Période": "الفترة", "Qté": "الكمية", "Quand": "متى", "Quantité": "الكمية", "Quantité (+/−)": "الكمية (+/−)", "Quantités livrées aux clients sur la période choisie": "الكميات المسلّمة للزبائن خلال الفترة المختارة", "Question ouverte : régime fiscal (IFU ou réel) à préciser avec le comptable.": "سؤال مفتوح: النظام الجبائي (IFU أو الحقيقي) يُحدد مع المحاسب.", "quota": "الحصة", "Quota max": "الحصة القصوى", "Quota par défaut": "الحصة الافتراضية", "Raison": "السبب", "Rappel": "إعادة الاتصال", "Rappel programmé": "اتصال مبرمج", "Rappel programmé automatiquement": "تمت برمجة الاتصال تلقائيًا", "rappel programmé à": "اتصال مبرمج على الساعة", "Rappeler après 17h": "إعادة الاتصال بعد 17:00", "Rappeler le client": "إعادة الاتصال بالزبون", "Rappeler le client + SMS/WhatsApp auto": "إعادة الاتصال بالزبون + SMS/واتساب تلقائي", "Rappels plus tard": "اتصالات لاحقة", "Rappels à l'heure": "اتصالات حان وقتها", "Rapprochement d'un versement DHD": "مطابقة دفعة DHD", "Rapprochement DHD": "مطابقة DHD", "Rapprocher un nouveau versement": "مطابقة دفعة جديدة", "Rapprocher un versement DHD": "مطابقة دفعة DHD", "Recette": "إيراد", "Recettes, dépenses, rapprochements et résultat mensuel": "الإيرادات، المصاريف، المطابقات والنتيجة الشهرية", "Rechercher": "بحث", "Rechercher nom ou SKU…": "ابحث بالاسم أو المرجع…", "Rechercher n°, client, suivi DHD…": "ابحث برقم، زبون، تتبع DHD…", "Rechercher n°, client, téléphone…": "ابحث برقم، زبون، هاتف…", "Rechercher un emballage…": "ابحث عن تغليف…", "Rechercher un produit…": "ابحث عن منتج…", "Recommandation : fusionner « PACK PROMO » et « Packs promo », corriger l'orthographe (Sushi, Pâtisserie, Sandwich) avec redirection des anciennes URL.": "توصية: دمج «PACK PROMO» و«Packs promo» وتصحيح الإملاء (Sushi، Pâtisserie، Sandwich) مع إعادة توجيه الروابط القديمة.", "Refus": "رفض", "Refus du colis": "رفض الطرد", "Refus du colis à traiter": "رفض طرد للمعالجة", "Refuser": "رفض", "Relations": "العلاقات", "Relevé de compte": "كشف الحساب", "Remboursement du Budget pub": "تعويض ميزانية الإشهار", "Remboursement pub": "تعويض الإشهار", "Remboursement pub de chaque commande + réinvestissement": "تعويض الإشهار من كل طلب + إعادة الاستثمار", "Rembourser": "تسديد", "Remboursée": "مسدّدة", "remboursée": "مسدّدة", "Remise": "التخفيض", "Remise : agent jusqu'à": "التخفيض: العون حتى", "Remise au-delà du seuil : validation requise": "تخفيض فوق الحد: يتطلب موافقة", "Remise max agent (%)": "أقصى تخفيض للعون (%)", "Remise max manager (%)": "أقصى تخفيض للمشرف (%)", "Remise refusée": "تم رفض التخفيض", "Remise validée": "تمت الموافقة على التخفيض", "Remise à valider": "تخفيض للموافقة", "Rentabilité": "المردودية", "Renvoyer en file commune les commandes des agents en pause": "إعادة طلبات الأعوان في الاستراحة إلى القائمة العامة", "Retirer": "إزالة", "Retour": "مرتجع", "retour": "إرجاع", "Retour en cours": "إرجاع جارٍ", "Retour réceptionné": "تم استلام المرتجع", "Retournée": "مُرجع", "Retournées": "المرجعة", "Retours": "المرتجعات", "Retours en cours": "مرتجعات جارية", "Retours à réceptionner": "مرتجعات للاستلام", "Retrait / décision réinvestissement": "سحب / قرار إعادة الاستثمار", "Retrait au bureau": "الاستلام من المكتب", "Reçu": "مستلم", "Reçu le": "استُلم في", "Reçues": "المستلمة", "Risque de retour": "خطر الإرجاع", "ROAS réel (bénéfice / pub)": "العائد الفعلي على الإشهار (ربح / إشهار)", "Rue, cité, repère…": "الشارع، الحي، معلم قريب…", "Rupture": "نفاد المخزون", "rupture": "نفاد", "Ruptures commandables sur demande": "المنتجات غير المتوفرة قابلة للطلب المسبق", "Ruptures non commandables": "المنتجات غير المتوفرة غير قابلة للطلب", "Règle ajoutée": "تمت إضافة القاعدة", "Règle de paiement": "قاعدة الدفع", "Règles (mode « Par règle »)": "القواعد (وضع «حسب القاعدة»)", "Règles appliquées automatiquement": "قواعد مطبقة تلقائيًا", "Règles de sécurité": "قواعد الأمان", "Réassigner": "إعادة التعيين", "Réassigner ou relancer les agents": "إعادة التعيين أو تذكير الأعوان", "Réassigner à": "إعادة التعيين إلى", "Réassigner à…": "إعادة التعيين إلى…", "Réattribuer les commandes non ouvertes depuis 30 min": "إعادة إسناد الطلبات غير المفتوحة منذ 30 دقيقة", "Réattribution après (min)": "إعادة الإسناد بعد (دقيقة)", "Réception confirmée": "تم تأكيد الاستلام", "Réception de marchandise": "استلام البضاعة", "Réception du retour": "استلام المرتجع", "Réception, contrôle de l'état, réintégration en stock ou casse": "الاستلام، فحص الحالة، الإعادة إلى المخزون أو الإتلاف", "Réceptionner": "استلام", "Réceptionner le retour": "استلام المرتجع", "Réceptionner le retour au dépôt": "استلام المرتجع في المستودع", "réceptionné · stock mis à jour": "تم الاستلام · تم تحديث المخزون", "réceptionnée": "تم الاستلام", "Réclamation envoyée à DHD pour les colis bloqués": "تم إرسال شكوى إلى DHD بخصوص الطرود العالقة", "Réf.": "المرجع", "Référence": "المرجع", "Réinvestissement": "إعادة الاستثمار", "Réinvestissement (% du bénéfice)": "إعادة الاستثمار (% من الربح)", "Rémunération": "الأجر", "Répartition": "التوزيع", "Répartition des agents": "توزيع الأعوان", "Répartition financière déclenchée": "تم تفعيل التوزيع المالي", "Réserve": "الاحتياطي", "Réserve fournisseur": "احتياطي المورد", "Réservé": "المحجوز", "Résultat": "النتيجة", "Résultat net": "النتيجة الصافية", "Résultats pour": "نتائج البحث عن", "Rôle": "الدور", "Rôle créé": "تم إنشاء الدور", "Rôle démo": "دور التجربة", "Rôle personnalisé": "دور مخصص", "Sa fiche": "بطاقته", "Saisir la dépense du jour": "إدخال مصروف اليوم", "Saisir la dépense pub du jour": "إدخال مصروف الإشهار لليوم", "Saisir la nouvelle date et la transmettre à DHD": "إدخال التاريخ الجديد وإرساله إلى DHD", "Saisissez le comptage physique. Les écarts sont calculés et l'inventaire est validé par l'Admin.": "أدخل الجرد الفعلي. تُحسب الفروقات ويعتمد المدير الجرد.", "Saisissez votre numéro de téléphone et votre numéro de commande.": "أدخل رقم هاتفك ورقم طلبك.", "Salaires et commissions": "الأجور والعمولات", "Sauvegarde chiffrée créée": "تم إنشاء نسخة احتياطية مشفرة", "Sauvegarde maintenant": "نسخ احتياطي الآن", "Sauvegarde quotidienne chiffrée, conservée 30 jours.": "نسخة احتياطية يومية مشفرة، تُحفظ 30 يومًا.", "Script d'appel": "نص المكالمة", "Segment": "الشريحة", "Segments": "الشرائح", "Ses commissions": "عمولاته", "Ses dettes et paiements": "ديونه ودفعاته", "seuil": "الحد", "Seuil": "الحد", "Seuil d'alerte": "حد التنبيه", "Seuls les agents « en ligne » et dans leurs horaires reçoivent des commandes.": "يتلقى الطلبات فقط الأعوان «المتصلون» وضمن أوقات عملهم.", "Siennes": "الخاصة به", "Siennes (assignées)": "الخاصة به (المعيّنة)", "Siennes (lecture + validation)": "الخاصة به (قراءة + اعتماد)", "Signature livreur DHD": "توقيع عامل توصيل DHD", "Signature PackLik": "توقيع باكليك", "Simuler 20 commandes": "محاكاة 20 طلبًا", "Simuler une tentative échouée": "محاكاة محاولة فاشلة", "simulées": "محاكاة", "Site": "الموقع", "Site et ERP": "الموقع وERP", "Solde": "الرصيد", "Solde insuffisant": "رصيد غير كافٍ", "Solde insuffisant pour rembourser": "رصيد غير كافٍ للتسديد", "source": "المصدر", "Source": "المصدر", "Sous-total": "المجموع الفرعي", "Spécialisation": "التخصص", "Statistiques": "الإحصائيات", "Statut": "الحالة", "Stock": "المخزون", "Stock bas": "مخزون منخفض", "Stock bas / rupture": "مخزون منخفض / نفاد", "Stock dispo": "المخزون المتاح", "Stock et achats": "المخزون والمشتريات", "Stock initial": "المخزون الأولي", "stock insuffisant": "مخزون غير كافٍ", "Stock possible": "المخزون الممكن", "Stock restant chez PackLik": "المخزون المتبقي لدى باكليك", "Stock réintégré": "أُعيد إلى المخزون", "Stock réservé à la confirmation · emballer, peser, valider": "المخزون يُحجز عند التأكيد · تغليف، وزن، اعتماد", "Suggestion d'achat automatique": "اقتراح شراء تلقائي", "Suggestions": "الاقتراحات", "Suggestions d'upsell": "اقتراحات البيع الإضافي", "Suivi": "التتبع", "Suivi de commande": "تتبع الطلب", "Suivi des commandes": "متابعة الطلبات", "Suivi des commandes / livraisons": "متابعة الطلبات / التوصيل", "Suivi DHD": "تتبع DHD", "Suivre ma commande": "تتبع طلبي", "Supprimer": "حذف", "Sur commande": "حسب الطلب", "sur devis": "حسب الطلب", "Suspendre": "إيقاف", "Synchro DHD": "مزامنة DHD", "Synchronisation DHD": "مزامنة DHD", "Synchronisation DHD terminée": "اكتملت مزامنة DHD", "Synchronisation DHD toutes les 15 minutes": "مزامنة DHD كل 15 دقيقة", "Synchronisation DHD toutes les 15 minutes + bouton « actualiser ».": "مزامنة DHD كل 15 دقيقة + زر «تحديث».", "Système": "النظام", "sélectionnée(s)": "محددة", "Séparation instantanée : part fournisseur, livraison, pub et bénéfice": "فصل فوري: حصة المورد، التوصيل، الإشهار والربح", "Tableau de bord": "لوحة القيادة", "Tableau de bord opérations": "لوحة قيادة العمليات", "Tableau de bord équipe": "لوحة قيادة الفريق", "Taux": "النسبة", "Taux d'upsell": "نسبة البيع الإضافي", "Taux d'upsell (%)": "نسبة البيع الإضافي (%)", "Taux de change": "سعر الصرف", "Taux de confirmation": "نسبة التأكيد", "taux de livraison": "نسبة التوصيل", "Taux de livraison": "نسبة التوصيل", "Taux de livraison (%)": "نسبة التوصيل (%)", "Taux de livraison (bas)": "نسبة التوصيل (الأدنى)", "Taux de recommande": "نسبة إعادة الطلب", "Taux de retour": "نسبة الإرجاع", "Taux livraison": "نسبة التوصيل", "Taux USD/DZD": "سعر الدولار/الدينار", "Tentative": "المحاولة", "tentative": "المحاولة", "Tentative échouée": "محاولة فاشلة", "tentative(s) échouée(s)": "محاولة/محاولات فاشلة", "tentative(s) échouée(s) à traiter : elles comptent dans votre taux de livraison.": "محاولة/محاولات فاشلة للمعالجة: تُحتسب في نسبة توصيلك.", "Tentatives de livraison": "محاولات التوصيل", "Tentatives de livraison à sauver": "محاولات توصيل يجب إنقاذها", "Tentatives du jour": "محاولات اليوم", "Tentatives par colis": "المحاولات لكل طرد", "Tentatives échouées": "المحاولات الفاشلة", "tentatives échouées aujourd'hui": "محاولات فاشلة اليوم", "Tester la connexion DHD": "اختبار الاتصال بـ DHD", "Testez le mode choisi : simulez 20 nouvelles commandes et voyez qui les recevrait.": "اختبر الطريقة المختارة: حاكِ 20 طلبًا جديدًا وشاهد من سيتلقاها.", "Texte complet à fournir par PackLik (modifiable dans Paramètres du site).": "النص الكامل تقدمه باكليك (قابل للتعديل في إعدادات الموقع).", "Théorique": "النظري", "Tiers": "الغير", "Titre SEO": "عنوان SEO", "Top 10 produits": "أفضل 10 منتجات", "Top clients professionnels": "أفضل الزبائن المحترفين", "Top ventes (unités)": "الأكثر مبيعًا (وحدات)", "Top wilayas": "أفضل الولايات", "Total": "المجموع", "Total = lire, créer, modifier, supprimer · Modif. = lire et modifier · Lecture = consulter · Siennes = ses propres données · — = aucun accès. Permissions fines case par case ; l'Admin peut créer un rôle personnalisé.": "كامل = قراءة، إنشاء، تعديل، حذف · تعديل = قراءة وتعديل · قراءة = اطلاع فقط · الخاصة = بياناته فقط · — = لا وصول. صلاحيات دقيقة خانة بخانة؛ يمكن للمدير إنشاء دور مخصص.", "Total déjà payé": "إجمالي المدفوع", "Total dépensé": "إجمالي الإنفاق", "Total encaissé par DHD": "المبلغ المحصّل من DHD", "Total estimé": "المجموع المقدّر", "Total payé": "إجمالي المدفوع", "Total reçu": "إجمالي المستلم", "Total à payer à la livraison": "المبلغ المستحق عند الاستلام", "Tour de rôle (round robin)": "بالتناوب", "Tous": "الكل", "tous": "الكل", "Tous les agents": "كل الأعوان", "Tous les produits": "كل المنتجات", "Tous les statuts": "كل الحالات", "Tout effacer": "مسح الكل", "Tout sélectionner": "تحديد الكل", "Tout voir": "عرض الكل", "Toutes": "الكل", "Toutes les": "كل", "Toutes les catégories": "كل الفئات", "Toutes les commandes à confirmer": "كل الطلبات للتأكيد", "Toutes les commandes à préparer": "كل الطلبات للتحضير", "Toutes les sources": "كل المصادر", "Toutes les wilayas": "كل الولايات", "Traiter": "معالجة", "Traiter la tentative": "معالجة المحاولة", "Traité": "تمت المعالجة", "Traitées": "المعالجة", "Transmettre à DHD": "إرسال إلى DHD", "Transport": "النقل", "Trier": "ترتيب", "Trésorerie": "الخزينة", "Type": "النوع", "Type de livraison": "نوع التوصيل", "Téléphone": "الهاتف", "Téléphone (WhatsApp)": "الهاتف (واتساب)", "Téléphone 2": "الهاتف 2", "téléphone invalide": "هاتف غير صالح", "Téléphone éteint / faux": "الهاتف مغلق / خاطئ", "Un agent ne voit jamais les commandes d'un autre agent, ni le numéro complet d'un client hors de ses commandes.": "لا يرى العون أبدًا طلبات عون آخر، ولا الرقم الكامل لزبون خارج طلباته.", "Un agent PackLik va vous appeler pour confirmer votre commande. Gardez votre téléphone à portée de main.": "سيتصل بك أحد أعوان باكليك لتأكيد طلبك. أبقِ هاتفك قريبًا منك.", "Un colis livré n'est pas de l'argent reçu (DHD paie ~4,9 j après livraison, ~6,9 j après envoi).": "الطرد المسلّم ليس مالًا مستلمًا (تدفع DHD بعد ~4,9 يوم من التوصيل، ~6,9 يوم من الشحن).", "Une commande enregistrée n'est pas une commande livrée.": "الطلب المسجل ليس طلبًا مسلّمًا.", "Une commande à la fois, tout en un écran": "طلب واحد في كل مرة، كل شيء في شاشة واحدة", "Une commande à la fois, tout sur un écran": "طلب واحد في كل مرة، كل شيء في شاشة واحدة", "Une notification apparaît 5 minutes avant chaque rappel.": "يظهر إشعار قبل 5 دقائق من كل اتصال.", "unités": "وحدات", "Unités chez DHD": "وحدات لدى DHD", "Unités réservées": "وحدات محجوزة", "Unités vendues": "الوحدات المباعة", "Unités vendues par jour": "الوحدات المباعة يوميًا", "upsell": "بيع إضافي", "Upsell": "البيع الإضافي", "Upsell ajouté au panier": "أضيف بيع إضافي إلى السلة", "Upsell moyen": "متوسط البيع الإضافي", "Utilisateur": "المستخدم", "Utilisez « Avance pub » pour sortir de la Réserve fournisseur": "استخدم «تسبيق الإشهار» للسحب من احتياطي المورد", "Valeur": "القيمة", "Valeur (achat)": "القيمة (شراء)", "Valeur bloquée chez DHD": "القيمة العالقة لدى DHD", "Valeur client moyenne": "متوسط قيمة الزبون", "Valeur du stock (prix d'achat)": "قيمة المخزون (سعر الشراء)", "Valeur du stock (prix de vente)": "قيمة المخزون (سعر البيع)", "Valeur requise": "القيمة مطلوبة", "validation requise à la confirmation": "تتطلب موافقة عند التأكيد", "Valider": "اعتماد", "Valider l'inventaire": "اعتماد الجرد", "Valider la remise": "الموافقة على التخفيض", "Valider la réception": "اعتماد الاستلام", "Valider le paiement": "اعتماد الدفعة", "Valider le rapprochement": "اعتماد المطابقة", "Valider « Prête »": "اعتماد «جاهز»", "Variables": "المتغيرات", "Variante": "النوع", "Variantes": "الأنواع", "variantes": "أنواع", "Vendu 14 j": "المباع 14 يومًا", "vente": "بيع", "Ventes": "المبيعات", "Ventes de mes produits": "مبيعات منتجاتي", "Verrouillée par": "مقفل من طرف", "Vers": "إلى", "Versement": "الدفعة", "Version confirmée": "النسخة المؤكدة", "Version initiale": "النسخة الأولية", "Veuillez indiquer la commune": "يرجى تحديد البلدية", "Virement": "تحويل بنكي", "Voir": "عرض", "Voir la boutique": "عرض المتجر", "Voir la commande dans l'ERP": "عرض الطلب في نظام ERP", "Voir le compte fournisseur": "عرض حساب المورد", "Voir tous les produits": "عرض كل المنتجات", "Volume irrégulier": "حجم غير منتظم", "Vos informations": "معلوماتك", "Votre argent commande par commande": "أموالك طلبًا بطلب", "Votre commande": "طلبك", "Votre file est vide": "قائمتك فارغة", "Votre file est vide. Bravo !": "قائمتك فارغة. أحسنت!", "Votre panier est vide": "سلتك فارغة", "Vous ne voyez pas les prix d'achat, les marges ni les commandes des autres agents.": "لا ترى أسعار الشراء ولا الهوامش ولا طلبات الأعوان الآخرين.", "Vous payez : vous cochez les commandes réglées et validez. Elles passent en « Payé » (commande clôturée) et le fournisseur reçoit le détail complet.": "تدفع: تحدد الطلبات المسددة وتعتمدها. تنتقل إلى «مدفوع» (طلب مغلق) ويتلقى المورد التفاصيل الكاملة.", "Vous payez en espèces au livreur DHD à la réception de votre colis, dans les 69 wilayas.": "تدفع نقدًا لعامل توصيل DHD عند استلام طردك، في 69 ولاية.", "Vous êtes maintenant": "أنت الآن", "Vue globale : ventes, livraisons, trésorerie": "نظرة شاملة: المبيعات، التوصيل، الخزينة", "Vérifier nom, wilaya, commune et adresse exacte.": "تحقق من الاسم والولاية والبلدية والعنوان بدقة.", "Vérifiez les caisses, le montant et le motif": "تحقق من الصناديق والمبلغ والسبب", "Vérifiée": "تمت المراجعة", "WhatsApp": "واتساب", "WhatsApp Business API (v2)": "WhatsApp Business API (v2)", "wilaya": "ولاية", "Wilaya": "الولاية", "Zone à haut risque : chaque colis non livré coûte l'aller, le retour et la pub": "منطقة عالية الخطورة: كل طرد غير مسلّم يكلّف الذهاب والإياب والإشهار", "~70 % des commandes acceptent un upsell": "~70% من الطلبات تقبل بيعًا إضافيًا", "À commander": "للطلب", "À domicile": "إلى المنزل", "À domicile ou au bureau DHD": "إلى المنزل أو مكتب DHD", "À encaisser": "للتحصيل", "à fusionner": "للدمج", "à l'instant": "الآن", "À préparer": "للتحضير", "à rembourser le": "للتسديد في", "à risque": "معرّض للخطر", "À risque": "معرّض للخطر", "À traiter": "للمعالجة", "À traiter par les agents": "للمعالجة من طرف الأعوان", "Écart": "الفرق", "écart": "فرق", "Écart inventaire": "فرق الجرد", "Écart justifié": "تم تبرير الفرق", "écart(s) corrigé(s)": "فرق/فروقات مصححة", "Échecs": "الإخفاقات", "échecs enregistrés aujourd'hui": "إخفاقات اليوم", "échouée": "فاشلة", "Échéance fournisseur dans 48 h": "استحقاق المورد خلال 48 سا", "Échéances fournisseur": "استحقاقات المورد", "Écran d'appel": "شاشة الاتصال", "Écrire sur WhatsApp": "راسلنا على واتساب", "écritures": "قيود", "Équipe": "الفريق", "Équipe créée": "تم إنشاء الفريق", "Équipe et accès": "الفريق والصلاحيات", "Équipe homogène, démarrage": "فريق متجانس، مرحلة البداية", "Équipe mature, objectif de rentabilité": "فريق متمرس، هدف المردودية", "Équipes": "الفرق", "État": "الحالة", "État du stock": "حالة المخزون", "Étiquette": "الملصق", "Étiquette DHD": "ملصق DHD", "Événements Pixel envoyés (session)": "أحداث البكسل المرسلة (الجلسة)", "— Choisir la commune —": "— اختر البلدية —", "pondéré par performance": "مرجّح حسب الأداء", "Expéditeur": "المرسل", "Prix minimum": "أدنى سعر", "Prix maximum": "أقصى سعر", "j": "يوم", "Acheter maintenant": "اشترِ الآن", "Connectez une société avec sa clé API : l'ERP crée les envois, récupère les étiquettes, suit les statuts et importe les versements automatiquement.": "اربط شركة بمفتاح API الخاص بها: ينشئ النظام الشحنات، يجلب الملصقات، يتتبع الحالات ويستورد الدفعات تلقائيًا.", "DHD Express": "DHD Express", "Domicile + bureau (stop desk)": "منزل + مكتب (ستوب ديسك)", "Domicile uniquement": "المنزل فقط", "Par défaut": "افتراضية", "Connectée": "متصلة", "Non connectée": "غير متصلة", "Clé API / Token": "مفتاح API / الرمز", "URL de l'API": "رابط API", "ID API (si demandé)": "معرّف API (إن طُلب)", "Poids inclus (kg)": "الوزن المشمول (كغ)", "Prix par kg en plus (DZD)": "السعر لكل كغ إضافي (دج)", "Poids max par colis (kg)": "الوزن الأقصى للطرد (كغ)", "Facturer le surpoids au client": "فوترة الوزن الزائد على الزبون", "Coefficient tarifaire": "معامل التسعير", "Coefficient": "المعامل", "Tester la connexion": "اختبار الاتصال", "Importer la grille tarifaire": "استيراد جدول الأسعار", "Dernière synchro": "آخر مزامنة", "Connecter": "ربط", "Déconnecter": "فصل", "Définir par défaut": "تعيين كافتراضية", "Yalidine": "ياليدين", "ZR Express": "ZR Express", "Maystro Delivery": "Maystro Delivery", "Noest Express": "Noest Express", "EcoTrack (Procolis, Guepex…)": "EcoTrack (Procolis، Guepex…)", "Mes livreurs": "موزّعيّ", "Vos propres livreurs": "موزّعوك الخاصون", "Pas de clé API : vos livreurs utilisent l'ERP. Zones": "لا يوجد مفتاح API: موزّعوك يستخدمون النظام. المناطق", "Sociétés de livraison": "شركات التوصيل", "Règles d'attribution": "قواعد الإسناد", "Tarifs par wilaya": "الأسعار حسب الولاية", "Sociétés de livraison, vos livreurs et le poids des colis": "شركات التوصيل، موزّعوك ووزن الطرود", "Modules": "الوحدات", "Livraison et livreurs": "التوصيل والموزّعون", "Pixels Facebook et TikTok": "بكسلات فيسبوك وتيك توك", "Vos livreurs livrent à Alger et environs. Ils encaissent le client et vous remettent l'argent.": "يوصل موزّعوك في الجزائر العاصمة وضواحيها. يحصّلون من الزبون ويسلّمونك المال.", "Ajouter un livreur": "إضافة موزّع", "Modifier le livreur": "تعديل الموزّع", "Livreur": "الموزّع", "Livreur automatique": "موزّع تلقائي", "Automatique": "تلقائي", "Véhicule": "المركبة", "Zones": "المناطق", "En cours": "جارية", "Livrées aujourd'hui": "المسلّمة اليوم", "Argent en main": "المال في اليد", "livraison": "توصيل", "Moto": "دراجة نارية", "Voiture": "سيارة", "Utilitaire": "شاحنة صغيرة", "En service": "في الخدمة", "Repos": "راحة", "Encaisser": "تحصيل", "Courses en cours": "توصيلات جارية", "Aucune course en cours": "لا توجد توصيلات جارية", "Remise au livreur": "سُلّم للموزّع", "Remis au livreur": "سُلّم للموزّع", "Échec": "فشل", "Choisissez automatiquement la société selon la wilaya. Sinon, la société par défaut est utilisée.": "اختر الشركة تلقائيًا حسب الولاية، وإلا تُستعمل الشركة الافتراضية.", "Société par défaut": "الشركة الافتراضية", "Ajouter la règle": "إضافة القاعدة", "Société": "الشركة", "poids inclus": "الوزن المشمول", "Client domicile": "الزبون منزل", "Client bureau": "الزبون مكتب", "Coût domicile": "التكلفة منزل", "Coût bureau": "التكلفة مكتب", "Rémunération par livraison (DZD)": "الأجر لكل توصيل (دج)", "Wilayas couvertes": "الولايات المغطاة", "Livreur enregistré": "تم حفظ الموزّع", "encaissés de": "حُصّلت من", "ID du pixel": "معرّف البكسل", "ID du pixel manquant": "معرّف البكسل ناقص", "Token API de conversions": "رمز Conversions API", "Token Events API": "رمز Events API", "facultatif mais recommandé": "اختياري لكن موصى به", "Code de test": "رمز الاختبار", "Envoyer un événement test": "إرسال حدث تجريبي", "Événement test envoyé à": "تم إرسال حدث تجريبي إلى", "Ajouter un pixel": "إضافة بكسل", "Aucun pixel": "لا يوجد بكسل", "Événements envoyés": "الأحداث المرسلة", "Quand envoyer l'achat (Purchase) ?": "متى يُرسل حدث الشراء (Purchase)؟", "À la commande sur le site": "عند الطلب على الموقع", "Quand l'agent confirme la commande (recommandé en COD)": "عند تأكيد العون للطلب (موصى به في الدفع عند الاستلام)", "Quand la commande est livrée": "عند توصيل الطلب", "Dédoublonnage navigateur + serveur (event_id)": "إزالة التكرار بين المتصفح والخادم (event_id)", "En paiement à la livraison, envoyer l'achat à la confirmation apprend aux publicités à trouver des clients qui confirment vraiment.": "في الدفع عند الاستلام، إرسال الشراء عند التأكيد يعلّم الإعلانات إيجاد زبائن يؤكدون فعلًا.", "Journal des événements (session)": "سجل الأحداث (الجلسة)", "Aucun événement : visitez la boutique ou passez une commande": "لا توجد أحداث: زر المتجر أو اطلب", "Heure": "الوقت", "Plateforme": "المنصة", "Pixel": "البكسل", "Événement": "الحدث", "Envoi": "الإرسال", "Navigateur": "المتصفح", "Serveur": "الخادم", "Ouvrir la boutique": "فتح المتجر", "Suivi des publicités : navigateur + API serveur": "تتبع الإعلانات: المتصفح + API الخادم", "Enregistré": "تم الحفظ", "Activez ou désactivez chaque module en un clic. Un module désactivé disparaît des menus.": "فعّل أو عطّل كل وحدة بنقرة. الوحدة المعطّلة تختفي من القوائم.", "Activé": "مفعّل", "Désactivé": "معطّل", "Configurer": "إعداد", "Tout se configure ici, simplement": "كل شيء يُضبط هنا ببساطة", "DHD, Yalidine, ZR Express, Maystro, Noest, EcoTrack… : envois, étiquettes, suivi et versements.": "DHD، ياليدين، ZR Express، Maystro، Noest، EcoTrack…: الشحنات، الملصقات، التتبع والدفعات.", "Vos propres livreurs : courses, encaissement, remise de la caisse.": "موزّعوك الخاصون: التوصيلات، التحصيل، تسليم الصندوق.", "Poids et découpage des colis": "وزن الطرود وتقسيمها", "Poids calculé par commande, surpoids facturé, découpage automatique en plusieurs colis.": "وزن محسوب لكل طلب، فوترة الوزن الزائد، تقسيم تلقائي إلى عدة طرود.", "Plusieurs pixels, API de conversions, choix du moment de l'achat.": "عدة بكسلات، Conversions API، اختيار توقيت الشراء.", "Upsell au téléphone": "البيع الإضافي بالهاتف", "Suggestions par catégorie dans l'écran d'appel, gain crédité à l'agent.": "اقتراحات حسب الفئة في شاشة الاتصال، والربح يُحتسب للعون.", "Répartition automatique": "التوزيع التلقائي", "Tour de rôle, charge, performance ou règles.": "بالتناوب، حسب الحمل، الأداء أو القواعد.", "Liste noire et doublons": "القائمة السوداء والمكررات", "Badge après 1 refus, liste noire après 2 retours, doublons 24 h.": "شارة بعد رفض واحد، قائمة سوداء بعد مرتجعين، مكررات 24 سا.", "Boutons WhatsApp, messages automatiques (API en v2).": "أزرار واتساب، رسائل تلقائية (API في الإصدار 2).", "Découper la commande": "تقسيم الطلب", "Modifier le découpage": "تعديل التقسيم", "Annuler le découpage": "إلغاء التقسيم", "Découper": "تقسيم", "à découper": "للتقسيم", "Poids total": "الوزن الإجمالي", "max par colis": "الحد الأقصى للطرد", "Poids max par colis (kg) ": "الوزن الأقصى للطرد (كغ)", "Recalculer": "إعادة الحساب", "Colis": "الطرود", "Frais de livraison en 1 colis": "تكلفة الشحن في طرد واحد", "Frais de livraison en": "تكلفة الشحن في", "Chaque colis reçoit son propre numéro de suivi ; le poids de chaque colis est transmis à la société de livraison.": "يحصل كل طرد على رقم تتبع خاص؛ ويُرسل وزن كل طرد إلى شركة التوصيل.", "Colis prêts à envoyer": "طرود جاهزة للإرسال", "Avant envoi, l'ERP vérifie : stock, téléphone valide, wilaya, commune et poids.": "قبل الإرسال يتحقق النظام من: المخزون، صحة الهاتف، الولاية، البلدية والوزن.", "Société de livraison": "شركة التوصيل", "Frais": "الرسوم", "Expédition": "الشحن", "Société de livraison, poids, colis, étiquettes et bordereau": "شركة التوصيل، الوزن، الطرود، الملصقات ووصل التسليم", "Poids de la commande": "وزن الطلب", "Inclus": "مشمول", "puis": "ثم", "pas de surpoids": "لا يوجد وزن زائد", "dont surpoids": "منها وزن زائد", "Poids trop élevé : découper la commande": "الوزن مرتفع جدًا: قسّم الطلب", "Société non connectée": "الشركة غير متصلة", "Changer de société": "تغيير الشركة", "Envoyée à": "أُرسل إلى", "Envoi créé via API · étiquette récupérée": "تم إنشاء الشحنة عبر API · تم جلب الملصق", "Commande découpée": "تم تقسيم الطلب", "Découpage annulé": "تم إلغاء التقسيم", "Poids d'un paquet (grammes)": "وزن الحزمة (غرام)", "Utilisé pour le poids de la commande, les frais de surpoids et le découpage en colis.": "يُستعمل لحساب وزن الطلب ورسوم الوزن الزائد وتقسيم الطرود.", "Saisissez d'abord la clé API": "أدخل مفتاح API أولًا", "connectée": "متصلة", "déconnectée": "مفصولة", "connexion OK (démo)": "الاتصال ناجح (تجربة)", "grille tarifaire importée (69 wilayas)": "تم استيراد جدول الأسعار (69 ولاية)"});
WILAYAS.forEach(w=>{ EN[w.fr]=w.en||w.fr; AR[w.fr]=w.ar; });
CATS.forEach(c=>{ EN[c.fr]=c.en; AR[c.fr]=c.ar; });

TPAT.push(
 [/^Assignée à (.+)$/,'Assigned to $1','أُسندت إلى $1'],
 [/^Source : (.+)$/,'Source: $1','المصدر: $1'],
 [/^Mode : (.+)$/,'Mode: $1','الطريقة: $1'],
 [/^Motif : (.+)$/,'Reason: $1','السبب: $1'],
 [/^Injoignable (\d)$/,'Unreachable $1','لا يرد $1'],
 [/^Tentative (\d+) échouée$/,'Attempt $1 failed','المحاولة $1 فاشلة'],
 [/^Tentatives \((\d+)\)$/,'Attempts ($1)','المحاولات ($1)'],
 [/^En transit vers (.+)$/,'In transit to $1','في الطريق إلى $1'],
 [/^Fournisseur payé \((.+)\) — bénéfice figé$/,'Supplier paid ($1) — profit locked','تم الدفع للمورد ($1) — الربح ثابت'],
 [/^Écart réception : (.+)$/,'Receiving gap: $1','فرق الاستلام: $1'],
 [/^Bénéfice \((\d+ %)\)$/,'Profit ($1)','الربح ($1)'],
 [/^Dépense (Loyer|Salaires et commissions|Emballage|Transport|Divers)$/,'Expense: $1','مصروف: $1'],
 [/^Statut (.+) → (.+)$/,'Status $1 → $2','الحالة $1 ← $2'],
 [/^Rappel le (.+?)( — .+)?$/,'Callback on $1$2','إعادة الاتصال في $1$2'],
 [/^Rappel auto : (.+) · SMS\/WhatsApp envoyé$/,'Auto callback: $1 · SMS/WhatsApp sent','اتصال تلقائي: $1 · تم إرسال SMS/واتساب'],
 [/^Confirmée avec upsell \+(.+)$/,'Confirmed with upsell +$1','مؤكد مع بيع إضافي +$1'],
 [/^Nouvelle date : (.+) \(transmise à DHD\)$/,'New date: $1 (sent to DHD)','تاريخ جديد: $1 (أُرسل إلى DHD)'],
 [/^Passage en stop desk \(bureau DHD (.+)\)$/,'Switched to stop desk (DHD office $1)','تحويل إلى مكتب DHD ($1)'],
 [/^Annulation après confirmation — motif : (.+)$/,'Cancelled after confirmation — reason: $1','إلغاء بعد التأكيد — السبب: $1'],
 [/^Versement DHD (\S+) \((\d+) colis\)$/,'DHD payout $1 ($2 parcels)','دفعة DHD $1 ($2 طرود)'],
 [/^Frais retenus (\S+)$/,'Fees withheld $1','رسوم مقتطعة $1'],
 [/^Meta Ads semaine −(\d+) \((.+)\)$/,'Meta Ads week −$1 ($2)','إشهار ميتا الأسبوع −$1 ($2)'],
 [/^Paiement fournisseur (\S+) \((\d+) commandes, (.+)\)$/,'Supplier payment $1 ($2 orders, $3)','دفعة المورد $1 ($2 طلبات، $3)'],
 [/^Versement (VDHD-\d+)$/,'Payout $1','الدفعة $1'],
 [/^(\d+) commandes$/,'$1 orders','$1 طلبات'],
 [/^Saisie manuelle · (.+)$/,'Manual entry · $1','إدخال يدوي · $1'],
 [/^Rappel programmé à (.+)$/,'Callback scheduled at $1','اتصال مبرمج على $1'],
 [/^Remise à valider$/,'Discount to approve','تخفيض للموافقة'],
 [/^Confirmée → À préparer$/,'Confirmed → To prepare','مؤكد ← للتحضير'],
 [/^Client rappelé, relivraison demandée à DHD$/,'Customer called back, redelivery requested from DHD','تم الاتصال بالزبون وطلب إعادة التوصيل من DHD'],
 [/^Adresse corrigée et transmise à DHD$/,'Address corrected and sent to DHD','تم تصحيح العنوان وإرساله إلى DHD'],
 [/^Colis emballé et pesé$/,'Parcel packed and weighed','تم تغليف الطرد ووزنه'],
 [/^Envoi créé via API DHD · étiquette récupérée$/,'Shipment created via DHD API · label retrieved','تم إنشاء الشحنة عبر API DHD · تم جلب الملصق'],
 [/^Tâche « rappeler le client » créée pour (.+)$/,'"Call the customer" task created for $1','تم إنشاء مهمة «الاتصال بالزبون» لـ $1'],
 [/^(.+) — (Rappel|Remise) (.+)$/,'$1 — $2 $3','$1 — $2 $3'],
 [/^(.+?) \+ SMS\/WhatsApp envoyé$/,'$1 + SMS/WhatsApp sent','$1 + تم إرسال SMS/واتساب'],
 [/^(.+?) — Risque de retour$/,'$1 — Return risk','$1 — خطر الإرجاع'],
 [/^Poids transmis à (.+)$/,'Weight sent to $1','تم إرسال الوزن إلى $1'],
 [/^Livrée par (.+) — argent chez le livreur$/,'Delivered by $1 — cash with courier','سلّمه $1 — المال لدى الموزّع'],
 [/^Argent remis par le livreur (.+)$/,'Cash handed over by courier $1','سلّم الموزّع $1 المال'],
 [/^(\d+) colis : (.+)$/,'$1 parcels: $2','$1 طرود: $2'],
 [/^(.+) kg · (\d+) colis$/,'$1 kg · $2 parcel(s)','$1 كغ · $2 طرد'],
 [/^(.+) → (.+) · (.+)$/,'$1 → $2 · $3','$1 ← $2 · $3']
);

/* ============================================================
   ROUTEUR, RENDU, ÉVÉNEMENTS, ACTIONS
   ============================================================ */
SETTINGS.supplierSales = true;
function route(){
  const h = location.hash.replace(/^#/,'') || '/';
  const [path, qs] = h.split('?'); const parts = path.split('/').filter(Boolean);
  const q = Object.fromEntries(new URLSearchParams(qs||''));
  return {parts, q};
}
const ERP_VIEWS = {
  admin:{dashboard:viewDashboard, confirmer:viewConfList, suivi:()=>viewTracking(), tentatives:()=>viewAttempts(), achats:viewPurchases, produits:viewProducts, stock:viewStock, fournisseurs:viewSuppliers, clients:viewCustomers, equipe:viewTeam, repartition:viewAssign, finance:viewFinance, compta:viewAccounting, stats:()=>viewStats(), parametres:viewSettings, journal:viewJournal, modules:viewModules, livraison:viewDelivery, pixels:viewPixels},
  gerant:{dashboard:viewGerantDash, preparation:viewPreparation, expedition:viewExpedition, suivi:()=>viewTracking(), tentatives:()=>viewAttempts(), retours:viewReturns, livraison:viewDelivery, stock:viewStock, achats:viewPurchases, produits:viewProducts},
  manager:{dashboard:viewManagerDash, file:viewQueue, confirmer:viewConfList, cas:viewHard, tentatives:()=>viewAttempts(), repartition:viewAssign, classement:viewRanking, clients:viewCustomers, equipe:viewTeam, journal:viewJournal},
  agent:{mafile:viewMyQueue, rappels:viewMyCallbacks, livraisons:viewMyDeliveries, perfs:viewMyPerf, confirmer:viewConfList, tentatives:()=>viewAttempts(), clients:viewCustomers},
  fournisseur:{dashboard:viewSupplierDash, paiements:viewSupplierPayments, bons:viewSupplierPOs, receptions:viewSupplierDeliveries, releve:viewSupplierStatement, ventes:viewSupplierSales}
};
const ROLE_HOME = {admin:'dashboard', gerant:'dashboard', manager:'dashboard', agent:'mafile', fournisseur:'dashboard'};
let lastPath = '';
function render(){
  const {parts, q} = route();
  document.documentElement.lang = S.lang; document.documentElement.dir = S.lang==='ar'?'rtl':'ltr';
  let html;
  const sh = S.ui.shop;
  if(parts[0]==='erp'){
    const page = parts[1] || ROLE_HOME[S.role];
    if(page==='appel'){ html = viewCallPage(parts[2]); }
    else {
      const v = ERP_VIEWS[S.role][page];
      if(!v){ location.replace('#/erp/'+ROLE_HOME[S.role]); return; }
      html = v();
      if(q.open && !S.drawer){ const o=ORDERS.find(x=>x.id===+q.open); if(o && (S.role!=='agent'||o.agentId===S.agentId)){ S.drawer={id:o.id, tab:'call', addQ:''}; lockOrder(o); html = v(); } history.replaceState(null,'','#/erp/'+page); }
    }
    document.title = 'PackLik ERP';
  } else {
    if(S.drawer && !S.drawer.page){ S.drawer=null; }
    const p0 = parts[0];
    if(!p0) html = viewHome();
    else if(p0==='boutique'){ if(lastPath.split('/')[1]!=='boutique' && lastPath.split('/')[1]!=='categorie'){ /* garder les filtres */ } sh.cat=null; html = viewShop(); }
    else if(p0==='categorie'){ if(sh.cat!==parts[1]){ sh.page=1; } sh.cat=parts[1]; html = viewShop(); }
    else if(p0==='recherche'){ html = viewShop(); }
    else if(p0==='produit'){ html = viewProduct(+parts[1]); fbq('ViewContent',{id:+parts[1]}); }
    else if(p0==='panier') html = viewCart();
    else if(p0==='commande'){ html = viewCheckout(); fbq('InitiateCheckout',{}); }
    else if(p0==='confirmation') html = viewConfirm(parts[1]);
    else if(p0==='suivi') html = viewTrack();
    else if(p0==='contact') html = viewContact();
    else if(p0==='compte') html = viewAccount();
    else if(p0==='favoris') html = viewList('fav');
    else if(p0==='comparer') html = viewList('cmp');
    else if(p0==='cgv') html = viewCGV();
    else html = viewHome();
    document.title = 'PackLik – Emballage alimentaire en Algérie';
  }
  // préserver le focus d'un champ de recherche
  const ae = document.activeElement; const keep = ae && ae.dataset && ae.dataset.in ? ae.dataset.in : null; const caret = keep? ae.selectionStart : 0;
  document.getElementById('app').innerHTML = html;
  renderOverlay();
  if(keep){ const el = document.querySelector(`[data-in="${keep}"]`); if(el){ el.focus(); try{ el.setSelectionRange(caret,caret); }catch(e){} } }
  const cur = location.hash; if(cur!==lastPath){ if(!keep) window.scrollTo(0,0); lastPath = cur; }
}
window.addEventListener('hashchange', ()=>{ const {parts}=route(); if(S.drawer && !(parts[0]==='erp' && parts[1]==='appel')){ unlockOrder(drawerOrder()); S.drawer=null; } S.mOpen=false; render(); });

/* ---------- délégation d'événements ---------- */
document.addEventListener('click', e=>{
  const el = e.target.closest('[data-a]'); if(!el) return;
  if(e.target.closest('[data-stop]') && el.dataset.a==='openOrder') return;
  const a = el.dataset.a;
  if(a==='overlayClose' && e.target!==el) return;
  const fn = A[a]; if(!fn) return;
  if(el.tagName==='A' && el.getAttribute('href') && !['logCall','closeDrawerSoft'].includes(a)) {} else if(el.tagName==='A' && a==='logCall') {} else e.preventDefault();
  fn(el, e);
});
document.addEventListener('change', e=>{ const el=e.target.closest('[data-ch]'); if(el && CH[el.dataset.ch]) CH[el.dataset.ch](el, e); });
let inTimer; document.addEventListener('input', e=>{ const el=e.target.closest('[data-in]'); if(!el) return; clearTimeout(inTimer); inTimer=setTimeout(()=>{ IN[el.dataset.in] && IN[el.dataset.in](el); }, 180); });
document.addEventListener('submit', e=>{ const f=e.target.closest('[data-sub]'); if(!f) return; e.preventDefault(); SUB[f.dataset.sub] && SUB[f.dataset.sub](f); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ if(S.modal) closeModal(); else if(S.drawer && !S.drawer.page){ A.closeDrawer(); } } });
// glisser-déposer (file globale)
document.addEventListener('dragstart', e=>{ const c=e.target.closest('[data-drag]'); if(c){ e.dataTransfer.setData('text/plain', c.dataset.drag); e.dataTransfer.effectAllowed='move'; } });
document.addEventListener('dragover', e=>{ const z=e.target.closest('[data-drop]'); if(z){ e.preventDefault(); z.classList.add('over'); } });
document.addEventListener('dragleave', e=>{ const z=e.target.closest('[data-drop]'); if(z) z.classList.remove('over'); });
document.addEventListener('drop', e=>{ const z=e.target.closest('[data-drop]'); if(!z) return; e.preventDefault(); const id=+e.dataTransfer.getData('text/plain'); const o=ORDERS.find(x=>x.id===id); const to=+z.dataset.drop||null; if(o && o.agentId!==to){ reassign(o,to,'Glisser-déposer'); toast(o.ref+' → '+(to?UBY[to].name:t('File commune')),'ok'); render(); } });

function reassign(o, to, why){ const from=o.agentId; o.agentId=to; hist(o, 'Réassignée', (from?UBY[from].name:t('File commune'))+' → '+(to?UBY[to].name:t('File commune'))+' · '+why); log('Réattribution', o.ref, (from?UBY[from].name:'—')+' → '+(to?UBY[to].name:'—')+' ('+why+')'); }
function downloadCSV(name, rows){ const csv = '﻿'+rows.map(r=>r.map(c=>{ const s=String(c??''); return /[;"\n]/.test(s)? '"'+s.replace(/"/g,'""')+'"' : s; }).join(';')).join('\n'); const b=new Blob([csv],{type:'text/csv;charset=utf-8'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000); toast(t('Fichier exporté')+' : '+name,'ok'); }
function curOrder(el){ return el && el.dataset.id ? ORDERS.find(o=>o.id===+el.dataset.id) : drawerOrder(); }
function rerender(){ render(); }

/* ---------- actions (clic) ---------- */
const A = {
  lang:(el)=>{ S.lang = el.dataset.v; render(); },
  toggleSide:()=>{ if(window.innerWidth<=900) S.mOpen=!S.mOpen; else S.erpCollapsed=!S.erpCollapsed; render(); },
  notifs:()=>{ openModal(modalTpl(t('Notifications'), NOTIFS.length? NOTIFS.slice(0,20).map(n=>`<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line2)"><span class="small">${esc(n.txt)}</span><span class="xs muted">${ago(n.at)}</span></div>`).join('') : `<div class="empty">${ic('bell')}<div>${t('Aucune notification. Passez une commande sur la boutique pour la voir arriver ici.')}</div></div>`, `<button class="btn" data-a="clearNotifs">${t('Tout effacer')}</button>`)); },
  clearNotifs:()=>{ NOTIFS.length=0; closeModal(); render(); },
  period:(el)=>{ S.period=el.dataset.v; render(); },
  closeModal:()=>closeModal(),
  overlayClose:()=>closeModal(),
  closeDrawer:()=>{ const o=drawerOrder(); unlockOrder(o); S.drawer=null; render(); },
  closeDrawerSoft:()=>{ S.drawer=null; },
  upCat:(el)=>{ S.drawer.upCat=el.dataset.v; if(S.drawer.page) render(); else renderOverlay(); },
  drawerTab:(el)=>{ S.drawer.tab=el.dataset.v; renderOverlay(); if(S.drawer.page) render(); },
  openOrder:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); if(!o) return; if(S.role==='agent' && o.agentId!==S.agentId){ toast(t('Commande d\'un autre agent'),'bad'); return; } S.modal=null; if(o.lockedBy && o.status==='calling' && o.lockedBy!==me().id && S.role==='agent'){ toast(t('Verrouillée par')+' '+UBY[o.lockedBy].name,'bad'); return; } S.drawer={id:o.id, tab:'call', addQ:''}; lockOrder(o); render(); },
  openCustomer:(el)=>openModal(customerModal(+el.dataset.id), true),
  saveCustNote:(el)=>{ CBY[+el.dataset.id].notes = val('cNote'); closeModal(); toast(t('Note enregistrée'),'ok'); },
  // boutique
  hero:(el)=>{ S.heroIdx=+el.dataset.v; render(); },
  homeTab:(el)=>{ S.ui.shop.tab=el.dataset.v; render(); },
  addCart:(el)=>{ addToCart(+el.dataset.id, 1, null); render(); },
  buyNow:(el)=>{ const p=PBY[+el.dataset.id]; if(!canOrder(p)){ toast(t('Produit en rupture'),'bad'); return; } if(!S.cart.find(i=>i.pid===p.id)) addToCart(p.id,1,null); location.hash='#/commande'; },
  fav:(el)=>{ const id=+el.dataset.id; S.favs.has(id)? S.favs.delete(id) : S.favs.add(id); render(); },
  cmp:(el)=>{ const id=+el.dataset.id; if(S.compare.has(id)) S.compare.delete(id); else { if(S.compare.size>=4){ toast(t('4 produits maximum'),'bad'); return; } S.compare.add(id); toast(t('Ajouté à la comparaison'),'ok'); } render(); },
  priceFilter:()=>{ S.ui.shop.min=val('pmin'); S.ui.shop.max=val('pmax'); S.ui.shop.page=1; render(); },
  priceReset:()=>{ S.ui.shop.min=''; S.ui.shop.max=''; render(); },
  perPage:(el)=>{ S.ui.shop.per=+el.dataset.v; S.ui.shop.page=1; render(); },
  page:(el)=>{ S.ui.shop.page=+el.dataset.v; render(); window.scrollTo(0,0); },
  pdpVar:(el)=>{ S.ui.pdp.v=el.dataset.v; render(); },
  pdpQ:(el)=>{ S.ui.pdp.q=Math.max(1,(+val('pdpQ')||1)+(+el.dataset.v)); render(); },
  pdpAdd:()=>{ const p=PBY[S.ui.pdp.id]; addToCart(p.id, Math.max(1,+val('pdpQ')||1), S.ui.pdp.v); render(); },
  pdpBuy:()=>{ const p=PBY[S.ui.pdp.id]; addToCart(p.id, Math.max(1,+val('pdpQ')||1), S.ui.pdp.v); location.hash='#/commande'; },
  cartQ:(el)=>{ const it=S.cart[+el.dataset.i]; it.q=Math.max(1,it.q+(+el.dataset.v)); render(); },
  cartDel:(el)=>{ S.cart.splice(+el.dataset.i,1); render(); },
  // confirmation
  confTab:(el)=>{ S.ui.conf.tab=el.dataset.v; S.ui.conf.sel.clear(); render(); },
  bulkReassign:()=>{ const to=+val('bulkAgent'); if(!to){ toast(t('Choisissez un agent'),'bad'); return; } S.ui.conf.sel.forEach(id=>reassign(ORDERS.find(o=>o.id===id), to, 'Action en masse')); toast(S.ui.conf.sel.size+' '+t('commande(s) réassignée(s)'),'ok'); S.ui.conf.sel.clear(); render(); },
  bulkCancelDup:()=>{ let n=0; S.ui.conf.sel.forEach(id=>{ const o=ORDERS.find(x=>x.id===id); if(o.duplicate){ o.cancelReason='Doublon'; setStatus(o,'cancelled','Motif : Doublon'); n++; } }); toast(n? n+' '+t('doublon(s) annulé(s)') : t('Aucun doublon dans la sélection'), n?'ok':'bad'); S.ui.conf.sel.clear(); render(); },
  exportConf:()=>downloadCSV('commandes_a_confirmer.csv', [['N°','Date','Source','Client','Téléphone','Wilaya','Produits','Total','Agent','Appels','Statut'], ...visibleOrders().filter(o=>CONF_ST.includes(o.status)).map(o=>[o.ref, fDT(o.created), o.source, CBY[o.customerId].name, CBY[o.customerId].phone, WBY[o.wilaya].fr, o.items.map(i=>i.q+'x '+PBY[i.pid].name).join(' | '), orderTotal(o), o.agentId?UBY[o.agentId].name:'', o.calls, STATUS[o.status].fr])]),
  manualOrder:()=>{ openModal(modalTpl(t('Nouvelle commande manuelle'), `<div class="col" style="gap:12px">
      <div class="grid2"><div class="field"><label for="mSrc">${t('Source')}</label><select class="select" id="mSrc">${['WhatsApp','Messenger','Instagram','Téléphone'].map(s=>`<option>${s}</option>`).join('')}</select></div><div class="field"><label for="mPhone">${t('Téléphone')} *</label><input class="input" id="mPhone" dir="ltr" placeholder="0550123456"></div>
      <div class="field"><label for="mName">${t('Nom du client')} *</label><input class="input" id="mName"></div><div class="field"><label for="mW">${t('Wilaya')}</label><select class="select" id="mW" data-ch="mWilaya">${WILAYAS.map(w=>`<option value="${w.id}" ${w.id===16?'selected':''}>${w.code} - ${esc(wName(w.id))}</option>`).join('')}</select></div>
      <div class="field"><label for="mC">${t('Commune')} *</label><select class="select" id="mC">${communeOptions(16,'')}</select></div><div class="field"><label for="mD">${t('Livraison')}</label><select class="select" id="mD"><option value="home">${t('Domicile')}</option><option value="desk">${t('Bureau DHD')}</option></select></div></div>
      <div class="grid2"><div class="field"><label for="mP">${t('Produit')}</label><select class="select" id="mP">${PRODUCTS.filter(p=>p.price).map(p=>`<option value="${p.id}">${esc(p.name)} — ${dzd(p.price)}</option>`).join('')}</select></div><div class="field"><label for="mQ">${t('Quantité')}</label><input class="input" id="mQ" type="number" value="1" min="1"></div></div>
      <div class="field"><label for="mN">${t('Message reçu / note')}</label><textarea class="input" id="mN" placeholder="${t('Collez ici le message WhatsApp / Messenger…')}"></textarea></div></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="manualSave">${t('Créer la commande')}</button>`)); },
  manualSave:()=>{ const phone=val('mPhone').trim(), name=val('mName').trim(); if(!validPhone(phone)||name.length<2){ toast(t('Nom et téléphone valides requis'),'bad'); return; } if(!val('mC')){ toast(t('Veuillez indiquer la commune'),'bad'); return; }
    let c = CUSTOMERS.find(x=>x.phone.replace(/\s/g,'')===phone.replace(/\s/g,'')); if(!c){ c={id:CUSTOMERS.length+1, name, business:'', phone:fmtPhone(phone), phone2:'', wilaya:+val('mW'), commune:val('mC'), address:'', pro:false, hist:{created:0,delivered:0,returned:0,spent:0}, since:Date.now(), notes:''}; CUSTOMERS.push(c); CBY[c.id]=c; }
    const p=PBY[+val('mP')]; const items=[{pid:p.id, v:p.variants?p.variants[0].id:null, q:Math.max(1,+val('mQ')||1), price:p.variants?p.variants[0].price:p.price, cost:p.variants?p.variants[0].cost:p.cost, up:false}];
    const o={ id:ORDERS.length+1, ref:'PK-'+(refSeq++), created:Date.now(), source:val('mSrc'), customerId:c.id, agentId:null, wilaya:+val('mW'), commune:val('mC'), address:'', delivery:val('mD'), note:val('mN'), initial:items.map(x=>({...x})), items, discount:0, status:'new', unreachN:0, calls:0, nextCall:null, cancelReason:'', tracking:'', attempts:[], history:[], lockedBy:null, lastDhdUpdate:Date.now(), riskReturn:false, duplicate:false, times:{}, fresh:true };
    o.carrier = autoCarrier(o); ORDERS.push(o); o.history.push({at:Date.now(), who:me().name, action:'Commande créée', note:'Saisie manuelle · '+o.source, color:''});
    const asg = S.role==='agent'? {id:S.agentId, why:'Saisie par l\'agent'} : assignAgent(o); o.agentId=asg.id; hist(o, asg.id? 'Assignée à '+UBY[asg.id].name.split(' ')[0] : 'Placée dans la file commune', asg.why);
    log('Création manuelle', o.ref, o.source); closeModal(); toast(o.ref+' '+t('créée')+' → '+(asg.id?UBY[asg.id].name:t('file commune')),'ok'); render(); },
  // écran d'appel
  oDelivery:(el)=>{ const o=drawerOrder(); o.delivery=el.dataset.v; render(); },
  lineQ:(el)=>{ const o=drawerOrder(); const it=o.items[+el.dataset.i]; it.q=Math.max(1,it.q+(+el.dataset.v)); render(); },
  lineDel:(el)=>{ const o=drawerOrder(); if(o.items.length===1){ toast(t('La commande doit contenir au moins un produit'),'bad'); return; } o.items.splice(+el.dataset.i,1); render(); },
  addLine:(el)=>{ const o=drawerOrder(); const p=PBY[+el.dataset.id]; const v=p.variants?p.variants[0]:null; const ex=o.items.find(i=>i.pid===p.id); if(ex) ex.q++; else o.items.push({pid:p.id, v:v?v.id:null, q:1, price:v?v.price:p.price, cost:v?v.cost:p.cost, up:true}); S.drawer.addQ=''; toast(t('Ajouté')+' : '+esc(p.name)+' (+'+dzd(v?v.price:p.price)+')','ok'); render(); },
  logCall:(el)=>{ const o=curOrder(el); o.calls++; hist(o,'Appel sortant','','blue'); setTimeout(render,50); },
  resConfirm:()=>{ const o=drawerOrder(); const c=CBY[o.customerId]; const err=[];
    if(!validPhone(c.phone)) err.push(t('téléphone invalide')); if(!o.commune) err.push(t('commune manquante'));
    expand(o.items).forEach(i=>{ const s=stockInfo(i.pid); if(s.available<i.q && !PBY[i.pid].onDemand) err.push(t('stock insuffisant')+' : '+PBY[i.pid].name); });
    if(err.length){ toast(t('Impossible de confirmer')+' : '+err.join(', '),'bad'); return; }
    const limit = S.role==='agent'? SETTINGS.discountAgent : S.role==='manager'? SETTINGS.discountManager : 100;
    if(o.discount>limit){ o.discountPending=true; hist(o,'Remise à valider',o.discount+' % > '+limit+' %','amber'); }
    o.calls = Math.max(1,o.calls); o.lockedBy=null; delete o.prevStatus; o.times.confirmed=Date.now(); o.status='calling';
    setStatus(o,'toprep', upsellGain(o)>0? 'Confirmée avec upsell +'+dzd(upsellGain(o)) : 'Confirmée'); o.history[o.history.length-1].action='Confirmée → À préparer'; o.history[o.history.length-1].color='green';
    toast(o.ref+' '+t('confirmée')+(upsellGain(o)>0? ' · upsell +'+dzd(upsellGain(o)):''),'ok'); afterResult(); },
  resUnreach:()=>{ const o=drawerOrder(); o.calls++; o.unreachN=Math.min(3,(o.unreachN||0)+1); const delays=[30*MIN,2*HOUR,null]; let next; if(o.unreachN<3) next=Date.now()+delays[o.unreachN-1]; else { const d=new Date(); d.setDate(d.getDate()+1); d.setHours(9,30,0,0); next=d.getTime(); }
    o.nextCall=next; o.lockedBy=null; delete o.prevStatus; o.status='calling'; setStatus(o,'unreach','Rappel auto : '+fDT(next)+' · SMS/WhatsApp envoyé'); toast(t('Injoignable')+' '+o.unreachN+' — '+t('rappel programmé à')+' '+fTime(next),'ok'); afterResult(); },
  resCallback:()=>{ const d=new Date(Date.now()+2*HOUR); const v = d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes());
    openModal(modalTpl(t('Programmer un rappel'), `<div class="field"><label for="cbAt">${t('Date et heure')}</label><input class="input" type="datetime-local" id="cbAt" value="${v}"></div><div class="field" style="margin-top:10px"><label for="cbN">${t('Note')}</label><input class="input" id="cbN" placeholder="${t('Ex. : rappeler après 17h, gérant absent')}"></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="cbSave">${t('Programmer')}</button>`)); },
  cbSave:()=>{ const o=drawerOrder(); const at=new Date(val('cbAt')).getTime(); if(!at){ toast(t('Date invalide'),'bad'); return; } o.calls++; o.nextCall=at; o.lockedBy=null; delete o.prevStatus; o.status='calling'; setStatus(o,'callback','Rappel le '+fDT(at)+(val('cbN')?' — '+val('cbN'):'')); closeModal(); toast(t('Rappel programmé')+' : '+fDT(at),'ok'); afterResult(); },
  resCancel:()=>{ openModal(modalTpl(t('Annuler la commande'), `<fieldset style="border:0;padding:0;margin:0"><legend class="small" style="font-weight:700;margin-bottom:8px">${t('Motif obligatoire')}</legend><div class="col">${CANCEL_REASONS.map((r,i)=>`<label class="check"><input type="radio" name="cr" value="${r}" ${i===0?'checked':''}> ${t(r)}</label>`).join('')}</div></fieldset><div class="field" style="margin-top:10px"><label for="crN">${t('Commentaire')}</label><input class="input" id="crN"></div>`, `<button class="btn" data-a="closeModal">${t('Retour')}</button><button class="btn red" data-a="cancelSave">${t('Confirmer l\'annulation')}</button>`)); },
  cancelSave:()=>{ const o=drawerOrder(); const r=(document.querySelector('input[name=cr]:checked')||{}).value; if(!r){ toast(t('Motif obligatoire'),'bad'); return; } o.cancelReason=r; o.lockedBy=null; delete o.prevStatus; o.status='calling'; setStatus(o,'cancelled','Motif : '+r+(val('crN')?' — '+val('crN'):'')); closeModal(); toast(o.ref+' '+t('annulée')+' ('+t(r)+')','ok'); afterResult(); },
  cancelConfirmed:()=>{ A.resCancel(); setTimeout(()=>{ const b=document.querySelector('[data-a=cancelSave]'); if(b) b.dataset.a='cancel2Save'; },0); },
  cancel2Save:()=>{ const o=drawerOrder(); const r=(document.querySelector('input[name=cr]:checked')||{}).value; o.cancelReason=r; setStatus(o,'cancelled','Annulation après confirmation — motif : '+r); closeModal(); toast(o.ref+' '+t('annulée'),'ok'); render(); },
  oSet:(el)=>{ const o=drawerOrder(); const st=el.dataset.v; if(st==='sent'){ const chk=preSendCheck(o); if(chk.length){ toast(chk.map(t).join(', '),'bad'); return; } } if(st==='paid'){ const id='VDHD-'+(2260+DHD_PAYMENTS.length); DHD_PAYMENTS.push({id, at:Date.now(), orderIds:[o.id], gap:0}); o.dhdPaymentId=id; } setStatus(o, st); toast(o.ref+' → '+stName(st,o),'ok'); render(); },
  splitOrder:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); const c=carrierOf(o); S.ui.split={id:o.id, max:c.maxParcelKg}; openSplit(); },
  splitMax:()=>{ S.ui.split.max=Math.max(1,+val('spMax')||1); openSplit(); },
  splitSave:()=>{ const o=ORDERS.find(x=>x.id===S.ui.split.id); const P=proposeParcels(o,S.ui.split.max); o.parcels = P.length>1? P : null; hist(o,'Commande découpée', P.length+' colis : '+P.map(p=>kg(p.weight)).join(' + '),'blue'); log('Découpage colis', o.ref, P.length+' colis'); closeModal(); toast(o.ref+' : '+P.length+' '+t('colis'),'ok'); render(); },
  splitReset:()=>{ const o=ORDERS.find(x=>x.id===S.ui.split.id); o.parcels=null; hist(o,'Découpage annulé','','amber'); closeModal(); render(); },
  bulkCarrier:()=>{ const c=val('bulkCar'); S.ui.track2.sel.forEach(id=>{ const o=ORDERS.find(x=>x.id===id); if(o){ o.carrier=c; o.parcels=null; hist(o,'Société de livraison', CRB[c].name); } }); toast(t('Société de livraison')+' : '+t(CRB[c].name),'ok'); render(); },
  simAttempt:()=>{ const o=drawerOrder(); addFailedAttempt(o); render(); },
  receiveReturn:(el)=>{ const id=+el.dataset.id; openModal(modalTpl(t('Réception du retour'), `<p class="small">${t('Contrôlez l\'état du colis')} ${ORDERS.find(o=>o.id===id).ref}.</p><div class="col"><label class="check"><input type="radio" name="rs" value="ok" checked> ${t('Intact — réintégrer en stock')}</label><label class="check"><input type="radio" name="rs" value="ko"> ${t('Abîmé — passer en casse')}</label></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="retSave" data-id="${id}">${t('Valider la réception')}</button>`)); },
  retSave:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); const ok=(document.querySelector('input[name=rs]:checked')||{}).value==='ok';
    if(ok){ setStatus(o,'returned','Colis intact, stock réintégré'); } else { o.status='returned'; o.times.returned=Date.now(); hist(o,'Retournée','Colis abîmé → casse','red'); expand(o.items).forEach(i=>stockMove(i.pid,'casse',0,o.ref,'Retour abîmé')); }
    const loss=returnLoss(o); CASH_MOVES.unshift({at:Date.now(), box:'security', amount:-loss, type:'Perte retour (aller-retour DHD + pub)', ref:o.ref, note:'', who:me().name}); CBX.security.balance-=loss;
    closeModal(); toast(o.ref+' '+t('réceptionnée'),'ok'); render(); },
  printLabel:(el)=>{ const o=curOrder(el); const c=CBY[o.customerId]; const cr=carrierOf(o); const P=parcelsOf(o);
    openModal(modalTpl(t('Étiquette')+' — '+esc(t(cr.name)), P.map(p=>`<div style="border:2px dashed var(--ink);border-radius:8px;padding:16px;font-family:monospace;margin-bottom:12px" dir="ltr"><div class="row between"><b style="font-size:18px">${esc(cr.name)}</b><b>${o.delivery==='home'?'DOMICILE':'STOP DESK'}</b></div><svg viewBox="0 0 300 50" width="100%" height="50" aria-label="code-barres">${Array.from({length:60},(_,i)=>`<rect x="${i*5}" y="0" width="${(i*7%3)+1}" height="50" fill="#000"/>`).join('')}</svg><div style="text-align:center;font-weight:700">${(p.tracking||o.tracking)||'—'}</div><div class="row between"><b>COLIS ${p.n}/${P.length}</b><b>${kg(p.weight)}</b></div><hr><div><b>${t('Destinataire')}</b> : ${esc(c.name)}<br>${esc(c.phone)}<br>${esc(o.address)}, ${esc(o.commune)}<br>${WBY[o.wilaya].code} - ${esc(WBY[o.wilaya].fr)}</div><hr><div><b>COD : ${p.n===1? nf(orderTotal(o))+' DZD' : '0 DZD'}</b> · ${t('Réf.')} ${o.ref}</div><div class="xs">${t('Expéditeur')} : PackLik, Douéra, Alger · ${COMPANY.phone1}</div></div>`).join(''), `<button class="btn" data-a="closeModal">${t('Fermer')}</button><button class="btn primary" data-a="printPage">${ic('print','sm')} ${t('Imprimer')}</button>`)); },
  printPage:()=>window.print(),
  goCall:(el)=>{ location.hash='#/erp/appel/'+el.dataset.id; },
  nextCall:()=>{ const cur=drawerOrder(); if(cur) unlockOrder(cur); S.drawer=null; const n=nextForAgent(); if(n) location.hash='#/erp/appel/'+n.id; else { toast(t('Votre file est vide'),'ok'); location.hash='#/erp/mafile'; } },
  // suivi
  trackTab:(el)=>{ S.ui.track2.tab=el.dataset.v; S.ui.track2.sel.clear(); render(); },
  bulkReady:()=>{ const sel=S.ui.track2.sel; const list=ORDERS.filter(o=>o.status==='toprep' && (!sel.size||sel.has(o.id))); list.forEach(o=>setStatus(o,'ready','Colis emballé et pesé')); sel.clear(); toast(list.length+' '+t('commande(s) prête(s)'),'ok'); render(); },
  oneReady:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); setStatus(o,'ready','Colis emballé et pesé'); toast(o.ref+' '+t('prête'),'ok'); render(); },
  picking:()=>{ const sel=S.ui.track2.sel; const list=ORDERS.filter(o=>o.status==='toprep' && (!sel.size||sel.has(o.id))); const pick={}; list.forEach(o=>expand(o.items).forEach(i=>pick[i.pid]=(pick[i.pid]||0)+i.q));
    openModal(modalTpl(t('Bon de préparation groupé'), `<div class="small muted">${fDT(Date.now())} · ${list.length} ${t('commandes')} : ${list.map(o=>o.ref).join(', ')}</div><table class="tbl" style="margin-top:10px"><thead><tr><th>☐</th><th>${t('Produit')}</th><th>SKU</th><th class="r">${t('Quantité')}</th></tr></thead><tbody>${Object.entries(pick).map(([p,q])=>`<tr><td>☐</td><td>${esc(PBY[p].name)}</td><td>${PBY[p].sku}</td><td class="r"><b>${q}</b></td></tr>`).join('')}</tbody></table>`, `<button class="btn" data-a="closeModal">${t('Fermer')}</button><button class="btn primary" data-a="printPage">${ic('print','sm')} ${t('Imprimer')}</button>`, true)); },
  bulkSend:()=>{ const sel=S.ui.track2.sel; const list=ORDERS.filter(o=>o.status==='ready' && (!sel.size||sel.has(o.id))); let ok=0, ko=[]; list.forEach(o=>{ const c=preSendCheck(o); if(c.length) ko.push(o.ref); else { setStatus(o,'sent', carrierOf(o).internal? 'Remis au livreur' : 'Envoi créé via API · étiquette récupérée'); ok++; } }); sel.clear(); toast(ok+' '+t('colis envoyé(s) à DHD')+(ko.length?' · '+ko.length+' '+t('bloqué(s)'):''), ko.length?'bad':'ok'); render(); },
  bordereau:()=>{ const list=ORDERS.filter(o=>o.times.sent && o.times.sent>=new Date().setHours(0,0,0,0)); openModal(modalTpl(t('Bordereau de remise DHD'), `<div class="small">${fDT(Date.now())} · PackLik → DHD · ${list.length} ${t('colis')}</div><table class="tbl" style="margin-top:8px"><thead><tr><th>${t('Réf.')}</th><th>${t('Suivi')}</th><th>${t('Wilaya')}</th><th class="r">COD</th></tr></thead><tbody>${list.map(o=>`<tr><td>${o.ref}</td><td dir="ltr">${o.tracking}</td><td>${esc(WBY[o.wilaya].fr)}</td><td class="r">${dzd(orderTotal(o))}</td></tr>`).join('')}<tr><td colspan="3"><b>${t('Total')}</b></td><td class="r"><b>${dzd(list.reduce((s,o)=>s+orderTotal(o),0))}</b></td></tr></tbody></table><div class="grid2" style="margin-top:30px"><div class="small">${t('Signature PackLik')}<br><br>__________________</div><div class="small">${t('Signature livreur DHD')}<br><br>__________________</div></div>`, `<button class="btn" data-a="closeModal">${t('Fermer')}</button><button class="btn primary" data-a="printPage">${ic('print','sm')} ${t('Imprimer')}</button>`, true)); },
  dhdSync:()=>{ let moved=0; ORDERS.forEach(o=>{ if(carrierOf(o).internal) return; const r=Math.random(); if(o.status==='sent'&&r<.6){ setStatus(o,'picked','Synchro DHD'); moved++; } else if(o.status==='picked'&&r<.6){ setStatus(o,'transit','Synchro DHD'); moved++; } else if(o.status==='transit'&&Date.now()-o.lastDhdUpdate<48*HOUR&&r<.35){ if(Math.random()<.75){ setStatus(o,'delivered','Synchro DHD — client a payé le livreur'); } else addFailedAttempt(o); moved++; } }); S.lastSync=Date.now(); toast(t('Synchronisation DHD terminée')+' · '+moved+' '+t('mise(s) à jour'),'ok'); render(); },
  reconcile:()=>{ const del=ORDERS.filter(o=>o.status==='delivered'); if(!del.length){ toast(t('Aucun colis livré en attente de versement'),'bad'); return; }
    openModal(modalTpl(t('Rapprochement d\'un versement DHD'), `<p class="small muted">${t('Cochez les colis payés par ce versement. La répartition dans les 4 caisses est déclenchée automatiquement.')}</p><table class="tbl"><thead><tr><th></th><th>${t('Commande')}</th><th>${t('Livrée')}</th><th class="r">COD</th><th class="r">${t('Frais DHD')}</th><th class="r">${t('Net')}</th></tr></thead><tbody>${del.map(o=>`<tr><td><input type="checkbox" class="recChk" value="${o.id}" checked aria-label="${o.ref}"></td><td>${o.ref}</td><td class="small">${fDate(o.times.delivered)}</td><td class="r num">${dzd(orderTotal(o))}</td><td class="r num">${dzd(dhdFeeOf(o))}</td><td class="r num"><b>${dzd(orderTotal(o)-dhdFeeOf(o))}</b></td></tr>`).join('')}</tbody></table><div class="field" style="margin-top:10px"><label for="recAmt">${t('Montant net reçu (DZD)')}</label><input class="input" id="recAmt" type="number" value="${del.reduce((s,o)=>s+orderTotal(o)-dhdFeeOf(o),0)}"></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn green" data-a="recSave">${t('Valider le rapprochement')}</button>`, true)); },
  recSave:()=>{ const ids=[...document.querySelectorAll('.recChk:checked')].map(x=>+x.value); if(!ids.length) return; const os=ids.map(id=>ORDERS.find(o=>o.id===id)); const exp=os.reduce((s,o)=>s+orderTotal(o)-dhdFeeOf(o),0); const got=+val('recAmt')||0; const id='VDHD-'+(2260+DHD_PAYMENTS.length);
    DHD_PAYMENTS.push({id, at:Date.now(), orderIds:ids, gap:Math.max(0,exp-got), gapNote: exp>got? 'Écart à justifier : '+nf(exp-got)+' DZD':''}); os.forEach(o=>{ o.dhdPaymentId=id; setStatus(o,'paid','Versement '+id); });
    closeModal(); toast(id+' : '+ids.length+' '+t('colis rapprochés, caisses mises à jour')+(exp>got?' · '+t('écart')+' '+dzd(exp-got):''), exp>got?'bad':'ok'); render(); },
  // tentatives
  attFilter:(el)=>{ S.ui.att.filter=el.dataset.v; render(); },
  attCall:(el)=>{ const o=curOrder(el); const a=o.attempts[o.attempts.length-1]; o.calls++; a.resolved=true; a.result='Client rappelé — nouvelle tentative'; a.action='Rappel effectué par '+me().name; setStatus(o,'outfor','Client rappelé, relivraison demandée à DHD'); toast(o.ref+' : '+t('client rappelé, relivraison demandée'),'ok'); render(); },
  attDate:(el)=>{ const id=+el.dataset.id; const d=new Date(Date.now()+DAY); openModal(modalTpl(t('Nouvelle date de livraison'), `<div class="field"><label for="ndD">${t('Date souhaitée par le client')}</label><input class="input" type="date" id="ndD" value="${d.toISOString().slice(0,10)}"></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="attDateSave" data-id="${id}">${t('Transmettre à DHD')}</button>`)); },
  attDateSave:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); const a=o.attempts[o.attempts.length-1]; a.resolved=true; a.result='Reporté au '+val('ndD'); a.action='Nouvelle date transmise à DHD'; setStatus(o,'outfor','Nouvelle date : '+val('ndD')+' (transmise à DHD)'); closeModal(); toast(t('Nouvelle date transmise à DHD'),'ok'); render(); },
  attAddr:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); openModal(modalTpl(t('Corriger l\'adresse'), `<div class="col" style="gap:10px"><div class="field"><label for="naC">${t('Commune')} (${esc(wName(o.wilaya))})</label><select class="select" id="naC">${communeOptions(o.wilaya,o.commune)}</select></div><div class="field"><label for="naA">${t('Adresse')}</label><input class="input" id="naA" value="${esc(o.address)}"></div><div class="field"><label for="naP">${t('2e numéro (facultatif)')}</label><input class="input" id="naP" dir="ltr" value="${esc(CBY[o.customerId].phone2)}"></div></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="attAddrSave" data-id="${o.id}">${t('Transmettre à DHD')}</button>`)); },
  attAddrSave:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); o.commune=val('naC'); o.address=val('naA'); if(val('naP')) CBY[o.customerId].phone2=val('naP'); const a=o.attempts[o.attempts.length-1]; a.resolved=true; a.result='Adresse corrigée'; a.action='Adresse transmise à DHD'; setStatus(o,'outfor','Adresse corrigée et transmise à DHD'); closeModal(); toast(t('Adresse corrigée et transmise à DHD'),'ok'); render(); },
  attDesk:(el)=>{ const o=curOrder(el); o.delivery='desk'; const a=o.attempts[o.attempts.length-1]; a.resolved=true; a.result='Passé en stop desk'; a.action='Livraison au bureau DHD proposée et acceptée'; setStatus(o,'outfor','Passage en stop desk (bureau DHD '+WBY[o.wilaya].fr+')'); toast(o.ref+' '+t('passée en stop desk'),'ok'); render(); },
  attReturn:(el)=>{ const o=curOrder(el); const a=o.attempts[o.attempts.length-1]; if(a){ a.resolved=true; a.result='Retour'; } o.riskReturn=true; setStatus(o,'returning','Marquée retour'); toast(o.ref+' '+t('marquée en retour'),'ok'); render(); },
  dhdClaim:()=>{ toast(t('Réclamation envoyée à DHD pour les colis bloqués'),'ok'); log('Réclamation DHD','colis bloqués'); },
  // achats
  poNew:()=>openPOModal([]),
  poFromSug:()=>openPOModal(purchaseSuggestions().map(x=>({pid:x.p.id, q:x.need}))),
  poSave:()=>{ const rows=[...document.querySelectorAll('.poRow')].map(r=>({pid:+r.querySelector('select').value, q:+r.querySelector('input').value})).filter(r=>r.q>0); if(!rows.length){ toast(t('Ajoutez au moins une ligne'),'bad'); return; } const id='BC-0'+(429+PURCHASES.length-5); PURCHASES.push({id, created:Date.now(), expected:new Date(val('poDate')).getTime()||Date.now()+3*DAY, status:'sent', items:rows.map(r=>({pid:r.pid, q:r.q, cost:PBY[r.pid].cost, recv:0}))}); log('Bon de commande créé', id); closeModal(); toast(id+' '+t('envoyé au fournisseur'),'ok'); render(); },
  poAddRow:()=>{ const tb=document.getElementById('poRows'); tb.insertAdjacentHTML('beforeend', poRow({pid:5,q:10})); },
  poReceive:(el)=>{ const po=PURCHASES.find(p=>p.id===el.dataset.id); openModal(modalTpl(t('Réception de marchandise')+' — '+po.id, `<table class="tbl"><thead><tr><th>${t('Produit')}</th><th class="r">${t('Commandé')}</th><th class="r">${t('Reçu')}</th></tr></thead><tbody>${po.items.map((i,k)=>`<tr><td>${esc(PBY[i.pid].name)}</td><td class="r">${i.q}</td><td class="r"><input class="input recvQ" data-k="${k}" type="number" value="${i.q}" style="width:90px;height:30px;text-align:end" aria-label="${t('Reçu')}"></td></tr>`).join('')}</tbody></table><p class="small muted" style="margin-top:10px">${t('Entrée automatique en stock.')}</p>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn green" data-a="poRecvSave" data-id="${po.id}">${t('Valider la réception')}</button>`, true)); },
  poRecvSave:(el)=>{ const po=PURCHASES.find(p=>p.id===el.dataset.id); document.querySelectorAll('.recvQ').forEach(inp=>{ const it=po.items[+inp.dataset.k]; it.recv=Math.max(0,+inp.value||0); const p=PBY[it.pid]; if(p.variants) p.variants[0].stock+=it.recv; else p.stock+=it.recv; if(p.status==='rupture'&&it.recv>0) p.status='actif'; stockMove(it.pid,'achat',it.recv,po.id, it.recv<it.q? 'Écart réception : −'+(it.q-it.recv):''); }); po.status='received'; po.receivedAt=Date.now(); log('Réception', po.id, dzd(poTotal(po))); closeModal(); toast(po.id+' '+t('réceptionné · stock mis à jour'),'ok'); render(); },
  poView:(el)=>{ const po=PURCHASES.find(p=>p.id===el.dataset.id); openModal(modalTpl(po.id, `<table class="tbl"><thead><tr><th>${t('Produit')}</th><th class="r">${t('Commandé')}</th><th class="r">${t('Reçu')}</th>${seesCost()?`<th class="r">${t('Prix d\'achat')}</th>`:''}</tr></thead><tbody>${po.items.map(i=>`<tr><td>${esc(PBY[i.pid].name)}</td><td class="r">${i.q}</td><td class="r ${i.recv<i.q?'down':''}">${i.recv}</td>${seesCost()?`<td class="r">${dzd(i.cost)}</td>`:''}</tr>`).join('')}</tbody></table>`, '', true)); },
  poConfirm:(el)=>{ const po=PURCHASES.find(p=>p.id===el.dataset.id); const d=new Date(val('d_'+po.id)).getTime(); po.status='confirmed'; if(d) po.expected=d; log('Bon confirmé par le fournisseur', po.id); NOTIFS.unshift({at:Date.now(), txt:'Le fournisseur a confirmé '+po.id+' (livraison '+fDate(po.expected)+')'}); toast(po.id+' '+t('confirmé'),'ok'); render(); },
  // produits
  prodTab:(el)=>{ S.ui.prod.tab=el.dataset.v; render(); },
  prodEdit:(el)=>{ const id=+el.dataset.id; const p=id? PBY[id] : {id:0, sku:'PK-'+String(PRODUCTS.length+1).padStart(3,'0'), name:'', price:0, cost:0, cats:[], pack:100, threshold:30, weight:500, status:'actif', stock:0, upsells:[]}; const sc=seesCost();
    openModal(modalTpl(id? t('Modifier le produit') : t('Ajouter un produit'), `<div class="col" style="gap:12px"><div class="grid2"><div class="field"><label for="pfN">${t('Nom FR')}</label><input class="input" id="pfN" value="${esc(p.name)}"></div><div class="field"><label for="pfA">${t('Nom AR')}</label><input class="input" id="pfA" dir="rtl" value="${esc(p.nameAr||'')}"></div><div class="field"><label for="pfS">SKU</label><input class="input" id="pfS" value="${p.sku}"></div><div class="field"><label for="pfK">${t('Conditionnement (pièces)')}</label><input class="input" id="pfK" type="number" value="${p.pack}"></div><div class="field"><label for="pfP">${t('Prix de vente (DZD)')}</label><input class="input" id="pfP" type="number" value="${p.price}"></div>${sc?`<div class="field"><label for="pfC">${t('Prix d\'achat (DZD)')}</label><input class="input" id="pfC" type="number" value="${p.cost}"></div>`:`<div class="field"><label>${t('Prix d\'achat')}</label><input class="input" value="••••" disabled></div>`}<div class="field"><label for="pfT">${t('Seuil d\'alerte')}</label><input class="input" id="pfT" type="number" value="${p.threshold}"></div><div class="field"><label for="pfW">${t('Poids d\'un paquet (grammes)')} *</label><input class="input" id="pfW" type="number" min="1" value="${p.weight}"><span class="xs muted">${t('Utilisé pour le poids de la commande, les frais de surpoids et le découpage en colis.')}</span></div><div class="field"><label for="pfSt">${t('Statut')}</label><select class="select" id="pfSt">${['actif','masqué','rupture','devis'].map(s=>`<option value="${s}" ${p.status===s?'selected':''}>${t(s)}</option>`).join('')}</select></div>${!id?`<div class="field"><label for="pfQ">${t('Stock initial')}</label><input class="input" id="pfQ" type="number" value="0"></div>`:''}</div>
      <fieldset style="border:0;padding:0;margin:0"><legend class="small" style="font-weight:700;margin-bottom:6px">${t('Catégories')}</legend><div class="row wrap">${CATS.map(c=>`<label class="check small"><input type="checkbox" class="pfCat" value="${c.id}" ${p.cats.includes(c.id)?'checked':''}> ${esc(catName(c))}</label>`).join('')}</div></fieldset>
      <div class="small muted">${t('Produits suggérés pour l\'upsell')} : ${p.upsells.map(u=>esc(PBY[u].name)).join(', ')||'—'}</div>
      ${sc? `<div class="small">${t('Marge unitaire calculée')} : <b class="up">${dzd(p.price-p.cost)}</b></div>`:''}</div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="prodSave" data-id="${id}">${t('Enregistrer')}</button>`, true)); },
  prodSave:(el)=>{ const id=+el.dataset.id; let p = id? PBY[id] : null; const name=val('pfN').trim(); if(!name){ toast(t('Nom requis'),'bad'); return; }
    if(!p){ p={...PRODUCTS[0], id:PRODUCTS.length+1, variants:null, packItems:null, upsells:[79,67], isNew:true, featured:false, priceHistory:[], lastSale:Date.now(), sold30:0, stock:+val('pfQ')||0}; PRODUCTS.push(p); PBY[p.id]=p; }
    const newPrice=+val('pfP')||0, newCost = seesCost()? (+val('pfC')||0) : p.cost; if(newPrice!==p.price || newCost!==p.cost) p.priceHistory.push({at:Date.now(), sale:newPrice, cost:newCost});
    Object.assign(p, {name, nameAr:val('pfA'), sku:val('pfS'), pack:+val('pfK')||1, price:newPrice, cost:newCost, threshold:+val('pfT')||0, weight:+val('pfW')||0, status:val('pfSt'), cats:[...document.querySelectorAll('.pfCat:checked')].map(x=>x.value)});
    log(id?'Produit modifié':'Produit créé', p.sku, name); closeModal(); toast(t('Produit enregistré — visible immédiatement sur la boutique'),'ok'); render(); },
  prodDup:(el)=>{ const s=PBY[+el.dataset.id]; const p={...s, id:PRODUCTS.length+1, sku:'PK-'+String(PRODUCTS.length+1).padStart(3,'0'), name:s.name+' (copie)', status:'masqué', stock:0, cats:[...s.cats], priceHistory:[]}; PRODUCTS.push(p); PBY[p.id]=p; toast(t('Produit dupliqué (masqué)'),'ok'); render(); },
  prodArch:(el)=>{ const p=PBY[+el.dataset.id]; p.status = p.status==='archivé'?'actif':'archivé'; toast(p.name+' : '+t(p.status),'ok'); render(); },
  exportProducts:()=>downloadCSV('produits_packlik.csv', [['SKU','Nom','Catégories','Prix vente', ...(seesCost()?['Prix achat','Marge']:[]),'Conditionnement','Stock dispo','Statut'], ...PRODUCTS.map(p=>[p.sku,p.name,p.cats.join(','),p.price, ...(seesCost()?[p.cost,p.price-p.cost]:[]), p.pack, stockInfo(p.id).available, p.status])]),
  importProducts:()=>openModal(modalTpl(t('Import Excel'), `<div class="dz" style="align-items:center;justify-content:center;min-height:140px">${ic('upload','lg')}<b>${t('Déposez votre fichier .xlsx ou .csv')}</b><span class="small muted">${t('Colonnes : SKU, Nom FR, Nom AR, Catégories, Prix vente, Prix achat, Conditionnement, Stock, Seuil')}</span><input type="file" accept=".csv,.xlsx" aria-label="${t('Fichier')}"></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="importDone">${t('Importer')}</button>`)),
  importDone:()=>{ closeModal(); toast(t('Import simulé : 91 produits vérifiés, 0 erreur'),'ok'); },
  // stock
  stockTab:(el)=>{ S.ui.stock.tab=el.dataset.v; render(); },
  stockOnly:(el)=>{ S.ui.stock.only=el.dataset.v; render(); },
  stockAdj:(el)=>{ const p=PBY[+el.dataset.id]; openModal(modalTpl(t('Ajuster le stock')+' — '+esc(p.name), `<div class="grid2"><div class="field"><label for="ajT">${t('Type')}</label><select class="select" id="ajT"><option value="ajustement">${t('Ajustement')}</option><option value="casse">${t('Casse')}</option><option value="achat">${t('Entrée achat')}</option></select></div><div class="field"><label for="ajQ">${t('Quantité (+/−)')}</label><input class="input" id="ajQ" type="number" value="-1"></div></div><div class="field" style="margin-top:10px"><label for="ajM">${t('Motif (obligatoire)')}</label><input class="input" id="ajM"></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="adjSave" data-id="${p.id}">${t('Enregistrer')}</button>`)); },
  adjSave:(el)=>{ const p=PBY[+el.dataset.id]; const q=+val('ajQ')||0, m=val('ajM').trim(); if(!m){ toast(t('Motif obligatoire'),'bad'); return; } let type=val('ajT'); const qq = type==='casse'? -Math.abs(q) : q; if(p.variants) p.variants[0].stock+=qq; else p.stock+=qq; stockMove(p.id,type,qq,'ADJ',m); log('Stock '+type, p.sku, qq+' · '+m); closeModal(); toast(t('Mouvement enregistré'),'ok'); render(); },
  invReset:()=>{ S.ui.inv={}; render(); },
  invValidate:()=>{ const inv=S.ui.inv||{}; let n=0; Object.entries(inv).forEach(([pid,c])=>{ if(c==='') return; const p=PBY[+pid]; const d=+c-stockInfo(p.id).physical; if(d){ if(p.variants) p.variants[0].stock+=d; else p.stock+=d; stockMove(p.id,'ajustement',d,'INV-'+(12+n),'Écart inventaire'); n++; } }); S.ui.inv={}; log('Inventaire validé','INV', n+' écarts'); toast(t('Inventaire validé')+' · '+n+' '+t('écart(s) corrigé(s)'),'ok'); render(); },
  // fournisseurs
  payNew:()=>{ const list=ORDERS.filter(o=>o.status==='paid').sort((x,y)=>x.times.paid-y.times.paid); if(!list.length){ toast(t('Aucune commande à régler'),'bad'); return; }
    openModal(modalTpl(t('Payer le fournisseur — commandes encaissées de DHD'), `<p class="small muted" style="margin-top:0">${t('Cochez les commandes que vous réglez. Elles seront validées (clôturées) et le fournisseur recevra le détail complet de chaque commande.')}</p>${supOrderRows(list,{check:true,h:340})}
      <div class="grid3" style="margin-top:12px"><div class="field"><label>${t('Montant à payer')}</label><div id="supTot" class="num" style="font-size:20px;font-weight:800">${dzd(list.reduce((s,o)=>s+supShare(o),0))}</div></div><div class="field"><label for="pyM">${t('Mode')}</label><select class="select" id="pyM"><option value="Espèces">${t('Espèces')}</option><option value="Virement">${t('Virement')}</option><option value="CCP">CCP</option></select></div><div class="field"><label for="pyF">${t('Justificatif')}</label><input class="input" id="pyF" type="file"></div></div>
      <p class="xs muted">${t('Le montant sort de la Réserve fournisseur')} (${dzd(CBX.reserve.balance)}).</p>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn green" data-a="paySave">${ic('check','sm')} ${t('Valider le paiement')}</button>`, true)); },
  paySave:()=>{ const ids=[...document.querySelectorAll('.supChk:checked')].map(x=>+x.value); if(!ids.length){ toast(t('Cochez au moins une commande'),'bad'); return; }
    const os=ids.map(id=>ORDERS.find(o=>o.id===id)); const amount=os.reduce((s,o)=>s+supShare(o),0); const mode=val('pyM'); const f=document.getElementById('pyF').files[0];
    const id='PF-'+String(101+SUP_PAYMENTS.length);
    const lines=os.map(o=>({orderId:o.id, ref:o.ref, deliveredAt:o.times.delivered, dhdPaidAt:o.times.paid, items:o.items.map(it=>({pid:it.pid,q:it.q,cost:it.cost})), amount:supShare(o)}));
    SUP_PAYMENTS.push({id, at:Date.now(), orderIds:ids, lines, amount, mode, proof:f?f.name:'justificatif_'+id+'.pdf', by:me().name, confirmedAt:null});
    os.forEach(o=>{ o.supplierPaymentId=id; setStatus(o,'closed','Fournisseur payé ('+id+') — bénéfice figé'); });
    cashMove('reserve', -amount, 'Paiement fournisseur', id, ids.length+' commandes'); log('Paiement fournisseur', id, dzd(amount)+' · '+ids.length+' commandes · '+mode);
    NOTIFS.unshift({at:Date.now(), txt:'Paiement fournisseur '+id+' : '+nf(amount)+' DZD ('+ids.length+' commandes)'});
    closeModal(); toast(t('Paiement validé')+' : '+dzd(amount)+' · '+ids.length+' '+t('commandes'),'ok'); render(); },
  livTab:(el)=>{ S.ui.liv.tab=el.dataset.v; render(); },
  carOn:(el)=>{ const c=CRB[el.dataset.id]; if(!c.internal && !c.apiKey){ toast(t('Saisissez d\'abord la clé API'),'bad'); const i=document.getElementById('c_'+c.id+'_apiKey'); if(i) i.focus(); return; } c.connected=true; c.lastSync=Date.now(); log('Société connectée', c.name); toast(t(c.name)+' : '+t('connectée'),'ok'); render(); },
  carOff:(el)=>{ const c=CRB[el.dataset.id]; c.connected=false; c.isDefault=false; toast(t(c.name)+' : '+t('déconnectée'),'ok'); render(); },
  carDefault:(el)=>{ CARRIERS.forEach(c=>c.isDefault=c.id===el.dataset.id); render(); },
  carTest:(el)=>{ const c=CRB[el.dataset.id]; c.lastSync=Date.now(); toast(t(c.name)+' : '+t('connexion OK (démo)'),'ok'); render(); },
  carSync:(el)=>{ const c=CRB[el.dataset.id]; c.lastSync=Date.now(); toast(t(c.name)+' : '+t('grille tarifaire importée (69 wilayas)'),'ok'); render(); },
  carRuleAdd:()=>{ SETTINGS.carrierRules.push({wilaya:+val('crW'), carrier:val('crC')}); toast(t('Règle ajoutée'),'ok'); render(); },
  carRuleDel:(el)=>{ SETTINGS.carrierRules.splice(+el.dataset.i,1); render(); },
  courierState:(el)=>{ CUB[+el.dataset.id].online = el.dataset.v==='1'; render(); },
  courierEdit:(el)=>{ const id=+el.dataset.id; const c=id? CUB[id] : {name:'',phone:'',vehicle:'Moto',zones:[16],communes:[],perDelivery:250};
    openModal(modalTpl(id? t('Modifier le livreur') : t('Ajouter un livreur'), `<div class="grid2"><div class="field"><label for="cuN">${t('Nom')}</label><input class="input" id="cuN" value="${esc(c.name)}"></div><div class="field"><label for="cuP">${t('Téléphone')}</label><input class="input" id="cuP" dir="ltr" value="${esc(c.phone)}"></div><div class="field"><label for="cuV">${t('Véhicule')}</label><select class="select" id="cuV">${['Moto','Voiture','Utilitaire'].map(v=>`<option value="${v}" ${c.vehicle===v?'selected':''}>${t(v)}</option>`).join('')}</select></div><div class="field"><label for="cuR">${t('Rémunération par livraison (DZD)')}</label><input class="input" id="cuR" type="number" value="${c.perDelivery}"></div></div><fieldset style="border:0;padding:0;margin:12px 0 0"><legend class="small" style="font-weight:700;margin-bottom:6px">${t('Wilayas couvertes')}</legend><div class="row wrap">${[16,9,35,42,15,10,26].map(w=>`<label class="check small"><input type="checkbox" class="cuZ" value="${w}" ${c.zones.includes(w)?'checked':''}> ${esc(wName(w))}</label>`).join('')}</div></fieldset>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="courierSave" data-id="${id}">${t('Enregistrer')}</button>`)); },
  courierSave:(el)=>{ const id=+el.dataset.id; const name=val('cuN').trim(); if(!name){ toast(t('Nom requis'),'bad'); return; } let c=id? CUB[id] : null; if(!c){ c={id:COURIERS.length+1, communes:[], active:true, online:true}; COURIERS.push(c); CUB[c.id]=c; } Object.assign(c,{name, phone:val('cuP'), vehicle:val('cuV'), perDelivery:+val('cuR')||0, zones:[...document.querySelectorAll('.cuZ:checked')].map(x=>+x.value)}); closeModal(); toast(t('Livreur enregistré'),'ok'); render(); },
  courierCash:(el)=>{ const cu=CUB[+el.dataset.id]; const os=ORDERS.filter(o=>o.courierId===cu.id && o.cashWithCourier); const amt=os.reduce((s,o)=>s+orderTotal(o),0); os.forEach(o=>{ o.cashWithCourier=false; setStatus(o,'paid','Argent remis par le livreur '+cu.name); }); log('Caisse livreur encaissée', cu.name, dzd(amt)); toast(dzd(amt)+' '+t('encaissés de')+' '+cu.name,'ok'); render(); },
  jobDone:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); setStatus(o,'delivered','Livrée par '+(o.courierId?CUB[o.courierId].name:t('livreur'))+' — argent chez le livreur'); toast(o.ref+' '+t('livrée'),'ok'); render(); },
  jobFail:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); addFailedAttempt(o); render(); },
  pxAdd:(el)=>{ const pf=el.dataset.v; PIXELS.push({id:pf.slice(0,2)+Date.now(), platform:pf, name:(pf==='facebook'?'Pixel Facebook ':'Pixel TikTok ')+(PIXELS.filter(p=>p.platform===pf).length+1), pixelId:'', token:'', testCode:'', active:false}); render(); },
  pxDel:(el)=>{ const i=PIXELS.findIndex(p=>p.id===el.dataset.id); if(i>=0) PIXELS.splice(i,1); render(); },
  pxTest:(el)=>{ const p=PIXELS.find(x=>x.id===el.dataset.id); if(!p.pixelId){ toast(t('ID du pixel manquant'),'bad'); return; } (S.pixel=S.pixel||[]).unshift({at:Date.now(), platform:p.platform, pixel:p.name, pixelId:p.pixelId, ev:p.platform==='tiktok'?'CompletePayment':'Purchase', data:{value:4500}, server:!!p.token, test:p.testCode||'TEST'}); toast(t('Événement test envoyé à')+' '+p.name,'ok'); render(); },
  supTab:(el)=>{ S.ui.sup.tab=el.dataset.v; render(); },
  spTab:(el)=>{ S.ui.sp.tab=el.dataset.v; render(); },
  supPayView:(el)=>openModal(supPayDetail(el.dataset.id), true),
  supPayCsv:(el)=>{ const p=SUP_PAYMENTS.find(x=>x.id===el.dataset.id); downloadCSV(p.id+'_detail.csv', [['Paiement','Date','Commande','Livrée le','Payée par DHD le','Produit','Quantité','Prix fournisseur','Montant'], ...p.lines.flatMap(l=>l.items.map(it=>[p.id, fDate(p.at), l.ref, fDate(l.deliveredAt), fDate(l.dhdPaidAt), PBY[it.pid].name, it.q, it.cost, it.q*it.cost])), ['','','','','','','','Total',p.amount]]); },
  supConfirm:(el)=>{ const p=SUP_PAYMENTS.find(x=>x.id===el.dataset.id); p.confirmedAt=Date.now(); log('Réception confirmée par le fournisseur', p.id, dzd(p.amount)); NOTIFS.unshift({at:Date.now(), txt:'Le fournisseur a confirmé la réception de '+p.id}); toast(t('Réception confirmée'),'ok'); render(); },
  supExport:()=>downloadCSV('commandes_fournisseur.csv', [['Commande','État','Livrée le','Payée par DHD le','Produits','Montant fournisseur','Paiement'], ...ORDERS.filter(o=>supState(o)).map(o=>[o.ref, SUP_STATE[supState(o)][0], o.times.delivered?fDate(o.times.delivered):'', o.times.paid?fDate(o.times.paid):'', o.items.map(i=>i.q+' x '+PBY[i.pid].name).join(' | '), supShare(o), o.supplierPaymentId||''])]),
  supSalesCsv:()=>{ const m={}; ORDERS.filter(o=>DELIVERED_ST.includes(o.status)&&inPeriod(o.times.delivered)).forEach(o=>expand(o.items).forEach(i=>{ m[i.pid]=(m[i.pid]||0)+i.q; })); downloadCSV('ventes_produits.csv', [['Produit','Unités vendues','Montant (prix fournisseur)'], ...Object.entries(m).map(([p,q])=>[PBY[p].name, q, q*PBY[p].cost])]); },
  adDay:()=>openModal(modalTpl(t('Saisir la dépense pub du jour'), `<div class="grid2"><div class="field"><label for="adU">${t('Montant (USD)')}</label><input class="input" id="adU" type="number" step="0.01" value="6.50"></div><div class="field"><label for="adC">${t('Campagne')}</label><input class="input" id="adC" value="Promo Burger Box"></div></div><p class="small muted">${t('En production, la dépense est importée automatiquement depuis l\'API Meta Ads. Taux')} : ${SETTINGS.usdRate} DZD / USD.</p>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="adDaySave">${t('Enregistrer')}</button>`)),
  adDaySave:()=>{ const usd=+val('adU')||0; if(usd<=0){ toast(t('Montant invalide'),'bad'); return; } AD_SPEND.push({date:Date.now(), campaign:val('adC'), usd}); cashMove('pub',-Math.round(usd*SETTINGS.usdRate),'Dépense Meta du jour','META',usd.toFixed(2)+' USD'); closeModal(); toast(t('Dépense enregistrée'),'ok'); render(); },
  exportDaily:()=>{ const {from,to}=periodRange(); downloadCSV('journal_quotidien.csv', [['Jour','Commandes reçues','Livrées','CA livré','Pub USD','Pub DZD','Frais retours','Bénéfice net'], ...dailyLedger(Math.max(from,to-30*DAY),to).map(r=>[fDate(r.d), r.rec, r.deliv, r.ca, r.usd.toFixed(2), r.ad, r.ret, r.net])]); },
  printStatement:()=>{ window.print(); },
  // clients
  cliSeg:(el)=>{ S.ui.cli.seg=el.dataset.v; render(); },
  exportCustomers:(el)=>{ const rows=CUSTOMERS.map(c=>({c,s:custStats(c.id)})).filter(r=>!r.s.black); if(el.dataset.v==='wa') downloadCSV('clients_whatsapp.csv', [['Nom','Téléphone','Wilaya','Segment','Commandes livrées'], ...rows.map(r=>[r.c.name, '+213'+r.c.phone.replace(/\s/g,'').slice(1), WBY[r.c.wilaya].fr, r.s.seg, r.s.delivered])]); else downloadCSV('audience_meta.csv', [['phone','fn','ln','ct','country','value'], ...rows.map(r=>['213'+r.c.phone.replace(/\s/g,'').slice(1), r.c.name.split(' ')[0], r.c.name.split(' ').slice(1).join(' '), WBY[r.c.wilaya].fr, 'DZ', r.s.spent])]); },
  // équipe
  agentState:(el)=>{ const u=UBY[+el.dataset.id]; const v=el.dataset.v; u.online = v==='online'; u.pause = v==='pause'; if(v!=='online'){ const back = ORDERS.filter(o=>o.agentId===u.id && o.status==='new'); back.forEach(o=>reassign(o,null,'Agent '+(v==='pause'?'en pause':'déconnecté'))); if(back.length) toast(back.length+' '+t('commande(s) renvoyée(s) dans la file commune'),'ok'); } log('Statut agent', u.name, v); render(); },
  memberEdit:(el)=>{ const id=+el.dataset.id; const u=id? UBY[id] : {name:'',role:'agent',phone:'',email:'',active:true}; openModal(modalTpl(id?t('Modifier un membre'):t('Ajouter un membre'), `<div class="grid2"><div class="field"><label for="muN">${t('Nom')}</label><input class="input" id="muN" value="${esc(u.name)}"></div><div class="field"><label for="muR">${t('Rôle')}</label><select class="select" id="muR">${['gerant','manager','agent','fournisseur'].map(r=>`<option value="${r}" ${u.role===r?'selected':''}>${t(ROLE_LABEL[r])}</option>`).join('')}</select></div><div class="field"><label for="muP">${t('Téléphone')}</label><input class="input" id="muP" dir="ltr" value="${esc(u.phone)}"></div><div class="field"><label for="muE">${t('E-mail')}</label><input class="input" id="muE" value="${esc(u.email)}"></div><div class="field"><label for="muW">${t('Mot de passe')}</label><input class="input" id="muW" type="password" placeholder="••••••••"></div><div class="field"><label for="muS">${t('Statut')}</label><select class="select" id="muS"><option value="1">${t('Actif')}</option><option value="0" ${u.active?'':'selected'}>${t('Inactif')}</option></select></div></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="memberSave" data-id="${id}">${t('Enregistrer')}</button>`)); },
  memberSave:(el)=>{ const id=+el.dataset.id; const name=val('muN').trim(); if(!name){ toast(t('Nom requis'),'bad'); return; } let u = id? UBY[id] : null; if(!u){ u={id:USERS.length+1, online:false, teamId:1, weight:10, quota:15, fixed:28000, perDelivery:100, upsellPct:3, hours:'08:30–17:00'}; USERS.push(u); UBY[u.id]=u; } Object.assign(u,{name, role:val('muR'), phone:val('muP'), email:val('muE'), active:val('muS')==='1'}); if(u.role==='agent' && !AGENTS.includes(u)) AGENTS.push(u); log(id?'Membre modifié':'Membre créé', name, u.role); closeModal(); toast(t('Membre enregistré'),'ok'); render(); },
  teamNew:()=>openModal(modalTpl(t('Créer une équipe'), `<div class="field"><label for="tmN">${t('Nom de l\'équipe')}</label><input class="input" id="tmN" value="Équipe Confirmation B"></div><div class="field" style="margin-top:10px"><label for="tmM">${t('Manager')}</label><select class="select" id="tmM">${USERS.filter(u=>u.role==='manager').map(u=>'<option value="'+u.id+'">'+esc(u.name)+'</option>').join('')}</select></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="teamSave">${t('Créer')}</button>`)),
  teamSave:()=>{ TEAMS.push({id:TEAMS.length+1, name:val('tmN'), managerId:+val('tmM')}); closeModal(); toast(t('Équipe créée'),'ok'); render(); },
  roleNew:()=>openModal(modalTpl(t('Rôle personnalisé'), `<div class="field"><label for="rlN">${t('Nom du rôle')}</label><input class="input" id="rlN" placeholder="${t('Ex. : Comptable externe')}"></div><p class="small muted">${t('Cochez ensuite les permissions case par case dans la matrice.')}</p>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="roleSave">${t('Créer')}</button>`)),
  roleSave:()=>{ closeModal(); toast(t('Rôle créé')+' : '+esc(val('rlN')||'Personnalisé'),'ok'); },
  // répartition
  toggleAuto:()=>{ SETTINGS.autoAssign=!SETTINGS.autoAssign; log('Attribution automatique', SETTINGS.autoAssign?'activée':'suspendue'); render(); },
  ruleDel:(el)=>{ SETTINGS.rules.splice(+el.dataset.i,1); render(); },
  ruleAdd:()=>{ const v=val('rVal').trim(); if(!v){ toast(t('Valeur requise'),'bad'); return; } SETTINGS.rules.push({type:val('rType'), value:v, agentId:+val('rAgent')}); toast(t('Règle ajoutée'),'ok'); render(); },
  simAssign:()=>{ const sim={}; const fake={id:-1, customerId:-1, wilaya:16, source:'Site', items:[{pid:5,q:1,price:2500,cost:1700}], initial:[], discount:0, delivery:'home'}; for(let i=0;i<20;i++){ fake.wilaya=pick([16,31,9,19,25]); fake.source=pick(SOURCES); fake.items[0].q=ri(1,6); const a=assignAgent(fake); const k=a.id||0; sim[k]=(sim[k]||0)+1; } S.ui.sim=sim; render(); },
  simReset:()=>{ S.ui.sim=null; render(); },
  // finance
  boxTransfer:()=>openModal(modalTpl(t('Mouvement entre caisses'), `<div class="grid2"><div class="field"><label for="bxF">${t('De')}</label><select class="select" id="bxF">${CASHBOXES.map(b=>`<option value="${b.id}" ${b.id==='reinvest'?'selected':''}>${t(b.fr)} (${dzd(b.balance)})</option>`).join('')}</select></div><div class="field"><label for="bxT">${t('Vers')}</label><select class="select" id="bxT">${CASHBOXES.map(b=>`<option value="${b.id}" ${b.id==='pub'?'selected':''}>${t(b.fr)}</option>`).join('')}</select></div><div class="field"><label for="bxA">${t('Montant (DZD)')}</label><input class="input" id="bxA" type="number" value="10000"></div><div class="field"><label for="bxM">${t('Motif (obligatoire)')}</label><input class="input" id="bxM" placeholder="${t('Ex. : augmenter la pub')}"></div></div><div class="lock-note" style="margin-top:10px">${ic('lock','sm')} ${t('La Réserve fournisseur ne peut sortir que pour payer le fournisseur (ou via une avance pub contrôlée).')}</div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="transferSave">${t('Valider')}</button>`)),
  withdraw:()=>{ A.boxTransfer(); },
  transferSave:()=>{ const f=val('bxF'), to=val('bxT'), amt=+val('bxA')||0, m=val('bxM').trim(); if(f===to||amt<=0||!m){ toast(t('Vérifiez les caisses, le montant et le motif'),'bad'); return; } if(f==='reserve'){ toast(t('Utilisez « Avance pub » pour sortir de la Réserve fournisseur'),'bad'); return; } if(CBX[f].balance<amt){ toast(t('Solde insuffisant'),'bad'); return; } cashMove(f,-amt,'Transfert sortant',t(CBX[to].fr),m); cashMove(to,amt,'Transfert entrant',t(CBX[f].fr),m); log('Mouvement de caisse', CBX[f].fr+' → '+CBX[to].fr, dzd(amt)+' · '+m); closeModal(); toast(t('Mouvement enregistré'),'ok'); render(); },
  advNew:()=>{ const max=advanceable(); openModal(modalTpl(t('Nouvelle avance pub'), `<div class="field"><label for="avA">${t('Montant (max')} ${dzd(max)})</label><input class="input" id="avA" type="number" value="${Math.min(15000,max)}" max="${max}"></div><div class="field" style="margin-top:10px"><label for="avD">${t('Date de remboursement')}</label><input class="input" id="avD" type="date" value="${new Date(Date.now()+5*DAY).toISOString().slice(0,10)}"></div><div class="field" style="margin-top:10px"><label for="avN">${t('Objet')}</label><input class="input" id="avN" value="Boost campagne"></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn kraft" data-a="advSave">${t('Accorder l\'avance')}</button>`)); },
  advSave:()=>{ const amt=+val('avA')||0, max=advanceable(); if(amt<=0||amt>max){ toast(t('Montant au-delà du montant avançable : avance bloquée'),'bad'); return; } const due=new Date(val('avD')).getTime(); const nextDue=supplierDues()[0]; if(nextDue && due>nextDue.due && CBX.reserve.balance-amt<nextDue.rest){ toast(t('Bloquée : l\'échéance fournisseur du')+' '+fDate(nextDue.due)+' '+t('deviendrait impossible à tenir'),'bad'); return; } const id='AV-0'+(8+ADVANCES.length-2); ADVANCES.unshift({id, amount:amt, at:Date.now(), due, repaidAt:null, note:val('avN')}); cashMove('reserve',-amt,'Avance pub',id,'Prêt interne'); cashMove('pub',amt,'Avance pub reçue',id,'À rembourser'); log('Avance pub', id, dzd(amt)); closeModal(); toast(id+' '+t('accordée')+' : '+dzd(amt),'ok'); render(); },
  advRepay:(el)=>{ const a=ADVANCES.find(x=>x.id===el.dataset.id); const from = CBX.pub.balance>=a.amount? 'pub' : 'reinvest'; if(CBX[from].balance<a.amount){ toast(t('Solde insuffisant pour rembourser'),'bad'); return; } cashMove(from,-a.amount,'Remboursement avance',a.id); cashMove('reserve',a.amount,'Remboursement avance',a.id); a.repaidAt=Date.now(); toast(a.id+' '+t('remboursée'),'ok'); render(); },
  // compta
  accTab:(el)=>{ S.ui.acc.tab=el.dataset.v; render(); },
  expNew:()=>openModal(modalTpl(t('Ajouter une dépense'), `<div class="grid2"><div class="field"><label for="exC">${t('Catégorie')}</label><select class="select" id="exC">${['Loyer','Salaires et commissions','Emballage','Transport','Divers'].map(c=>`<option>${c}</option>`).join('')}</select></div><div class="field"><label for="exA">${t('Montant (DZD)')}</label><input class="input" id="exA" type="number"></div><div class="field"><label for="exB">${t('Payé depuis')}</label><select class="select" id="exB"><option value="reinvest">${t('Réinvestissement')}</option><option value="security">${t('Caisse de sécurité')}</option></select></div><div class="field"><label for="exN">${t('Libellé')}</label><input class="input" id="exN"></div></div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="expSave">${t('Enregistrer')}</button>`)),
  expSave:()=>{ const amt=+val('exA')||0; if(amt<=0){ toast(t('Montant invalide'),'bad'); return; } EXPENSES.push({id:EXPENSES.length+1, cat:val('exC'), amount:amt, cur:'DZD', at:Date.now(), box:val('exB'), note:val('exN')||val('exC')}); cashMove(val('exB'),-amt,'Dépense '+val('exC'),'EXP',val('exN')); closeModal(); toast(t('Dépense enregistrée'),'ok'); render(); },
  metaImport:()=>{ AD_SPEND.push({date:Date.now(), campaign:'Import API Meta', usd:+(6+Math.random()*6).toFixed(2)}); toast(t('Dépenses Meta importées (API)'),'ok'); render(); },
  gapJustify:(el)=>{ const p=DHD_PAYMENTS.find(x=>x.id===el.dataset.id); p.justified=true; log('Écart DHD justifié', p.id); toast(t('Écart justifié'),'ok'); render(); },
  closeMonth:()=>{ S.ui.acc.locked=true; log('Clôture mensuelle', 'compta'); toast(t('Mois clôturé et verrouillé'),'ok'); render(); },
  exportPL:()=>{ const d=ORDERS.filter(o=>DELIVERED_ST.includes(o.status)); downloadCSV('compte_de_resultat.csv', [['Ligne','Montant DZD'],['CA livré',d.reduce((s,o)=>s+orderTotal(o),0)],['Coût d\'achat',-d.reduce((s,o)=>s+linesCost(o.items),0)]]); },
  printPL:()=>window.print(),
  exportJournal:()=>downloadCSV('journal_comptable.csv', [['Date','Catégorie','Libellé','Recette','Dépense'], ...journalEntries().map(e=>[new Date(e.at).toLocaleDateString('fr-DZ'), e.cat, e.label, e.in||'', e.out||''])]),
  // stats
  statTab:(el)=>{ S.ui.stats.tab=el.dataset.v; render(); },
  exportStats:()=>downloadCSV('statistiques_agents.csv', [['Agent','Traitées','Confirmation %','Upsell %','Livraison %','Gain upsell'], ...AGENTS.map(a=>{ const p=agentPerf(a); return [a.name,p.treated,p.confRate,p.upRate,p.delivRate,p.gain]; })]),
  // paramètres
  setTab:(el)=>{ S.ui.set.tab=el.dataset.v; render(); },
  saveSettings:()=>{ log('Paramètres enregistrés', S.ui.set.tab); toast(t('Paramètres enregistrés'),'ok'); },
  backup:()=>toast(t('Sauvegarde chiffrée créée'),'ok'),
  testDhd:()=>toast(t('Connexion DHD OK (démo)'),'ok'),
  // manager
  pauseReturn:()=>{ let n=0; AGENTS.filter(a=>a.pause||!a.online).forEach(a=>ORDERS.filter(o=>o.agentId===a.id && o.status==='new').forEach(o=>{ reassign(o,null,'Agent en pause'); n++; })); toast(n+' '+t('commande(s) renvoyée(s) dans la file commune'),'ok'); render(); },
  autoReassign:()=>{ let n=0; ORDERS.filter(o=>o.status==='new' && Date.now()-o.created>SETTINGS.reassignAfter*MIN).forEach(o=>{ const a=assignAgent(o); if(a.id && a.id!==o.agentId){ reassign(o,a.id,'Non ouverte après '+SETTINGS.reassignAfter+' min'); n++; } }); NOTIFS.unshift({at:Date.now(), txt:n+' commande(s) réattribuée(s) automatiquement'}); toast(n+' '+t('commande(s) réattribuée(s)'),'ok'); render(); },
  discOk:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); o.discountPending=false; hist(o,'Remise validée',o.discount+' %','green'); toast(t('Remise validée'),'ok'); render(); },
  discNo:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); const lim = S.role==='manager'? SETTINGS.discountManager : SETTINGS.discountAgent; o.discount=Math.min(o.discount, lim); o.discountPending=false; hist(o,'Remise refusée','ramenée à '+o.discount+' %','red'); toast(t('Remise refusée'),'ok'); render(); },
  qcOk:(el)=>{ ORDERS.find(x=>x.id===+el.dataset.id).qc=true; render(); },
};
function afterResult(){ if(S.drawer && S.drawer.page && S.role==='agent'){ S.drawer=null; const n=nextForAgent(); render(); if(n) setTimeout(()=>{ location.hash='#/erp/appel/'+n.id; }, 600); else location.hash='#/erp/mafile'; return; } S.drawer=null; render(); }
function addFailedAttempt(o){
  const r = FAIL_REASONS[Math.floor(Math.random()*FAIL_REASONS.length)]; const n = o.attempts.length+1;
  o.attempts.push({n, at:Date.now(), reason:r.id, comment:'Synchro DHD', action:'', agentId:o.agentId, due:Date.now()+r.delay, result:'', resolved:false});
  if(n>=3) o.riskReturn = true;
  o.status='transit'; setStatus(o,'failed', r.fr + (n>=3?' — Risque de retour':''));
  o.history[o.history.length-1].action = 'Tentative '+n+' échouée';
  if(r.id==='unreach'){ hist(o,'SMS/WhatsApp automatique envoyé','Tâche « rappeler le client » créée pour '+(o.agentId?UBY[o.agentId].name:'—'),'amber'); }
  CBY[o.customerId] && r.id==='refused' && NOTIFS.unshift({at:Date.now(), txt:'Refus du colis '+o.ref+' — badge client ajouté'});
  NOTIFS.unshift({at:Date.now(), txt:'Tentative '+n+' échouée sur '+o.ref+' ('+r.fr+')'});
  toast(o.ref+' : '+t('tentative')+' '+n+' '+t('échouée')+' ('+t(r.fr)+')','bad');
}
function openSplit(){ const o=ORDERS.find(x=>x.id===S.ui.split.id); const P=proposeParcels(o,S.ui.split.max); const c=carrierOf(o);
  const cost=P.reduce((s,p)=>s+baseShip(o,c)+extraKg(c,p.weight)*(c.extraPerKg||0),0), costOne=baseShip(o,c)+extraKg(c,orderWeight(o))*(c.extraPerKg||0);
  openModal(modalTpl(t('Découper la commande')+' '+o.ref, `<div class="row wrap between"><span>${t('Poids total')} : <b>${kg(orderWeight(o))}</b> · ${esc(t(c.name))} : ${t('max par colis')} ${c.maxParcelKg} kg</span><label class="row small">${t('Poids max par colis (kg)')} <input class="input" id="spMax" type="number" min="1" step="0.5" value="${S.ui.split.max}" style="width:80px;height:32px"></label><button class="btn sm" data-a="splitMax">${t('Recalculer')}</button></div>
    <div class="g2" style="margin-top:12px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${P.map(p=>`<div class="card card-b"><div class="row between"><b>${t('Colis')} ${p.n}/${P.length}</b><span class="badge ${p.weight>c.maxParcelKg?'red':'green'}">${kg(p.weight)}</span></div>${p.items.map(i=>`<div class="small row between" style="padding:3px 0"><span>${esc(PBY[i.pid].name)}</span><b>× ${i.q}</b></div>`).join('')}</div>`).join('')}</div>
    <div class="sumbox" style="margin-top:12px"><div class="ln"><span>${t('Frais de livraison en 1 colis')}</span><span class="num">${dzd(costOne)}</span></div><div class="ln"><span>${t('Frais de livraison en')} ${P.length} ${t('colis')}</span><b class="num">${dzd(cost)}</b></div><div class="ln xs muted"><span>${t('Chaque colis reçoit son propre numéro de suivi ; le poids de chaque colis est transmis à la société de livraison.')}</span></div></div>`,
    `${o.parcels?`<button class="btn" data-a="splitReset">${t('Annuler le découpage')}</button>`:''}<button class="btn" data-a="closeModal">${t('Fermer')}</button><button class="btn primary" data-a="splitSave">${ic('layers','sm')} ${t('Valider')} ${P.length} ${t('colis')}</button>`, true)); }
function poRow(r){ return `<tr class="poRow"><td><select class="select" aria-label="${t('Produit')}">${PRODUCTS.filter(p=>p.price&&!p.packItems).map(p=>`<option value="${p.id}" ${p.id===r.pid?'selected':''}>${esc(p.name)}</option>`).join('')}</select></td><td><input class="input" type="number" value="${r.q}" style="width:90px" aria-label="${t('Quantité')}"></td></tr>`; }
function openPOModal(rows){ if(!rows.length) rows=[{pid:5,q:50}]; openModal(modalTpl(t('Nouveau bon de commande fournisseur'), `<div class="field"><label for="poDate">${t('Livraison souhaitée')}</label><input class="input" id="poDate" type="date" value="${new Date(Date.now()+3*DAY).toISOString().slice(0,10)}" style="max-width:200px"></div><table class="tbl" style="margin-top:10px"><thead><tr><th>${t('Produit')}</th><th>${t('Quantité')}</th></tr></thead><tbody id="poRows">${rows.map(poRow).join('')}</tbody></table><button class="btn sm" data-a="poAddRow" style="margin-top:8px">${ic('plus','sm')} ${t('Ligne')}</button>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="poSave">${ic('send','sm')} ${t('Envoyer au fournisseur')}</button>`, true)); }

/* ---------- changements (select, input number…) ---------- */
const CH = {
  role:(el)=>{ const o=drawerOrder(); unlockOrder(o); S.drawer=null; S.role=el.value; S.ui.conf.sel.clear(); toast(t('Vous êtes maintenant')+' : '+t(ROLE_LABEL[S.role]),'ok'); location.hash='#/erp/'+ROLE_HOME[S.role]; render(); },
  agentAs:(el)=>{ S.agentId=+el.value; S.drawer=null; location.hash='#/erp/mafile'; render(); },
  shopSort:(el)=>{ S.ui.shop.sort=el.value; render(); },
  pdpQset:(el)=>{ S.ui.pdp.q=Math.max(1,+el.value||1); },
  coWilaya:(el)=>{ saveCoFields(); S.ui.co.wilaya=+el.value; S.ui.co.commune=''; render(); },
  mWilaya:(el)=>{ const s=document.getElementById('mC'); if(s) s.innerHTML=communeOptions(+el.value,''); },
  coDelivery:(el)=>{ saveCoFields(); S.ui.co.delivery=el.value; render(); },
  confSrc:(el)=>{ S.ui.conf.src=el.value; render(); },
  confAgent:(el)=>{ S.ui.conf.agent=el.value; render(); },
  sel:(el)=>{ const id=+el.dataset.id; el.checked? S.ui.conf.sel.add(id) : S.ui.conf.sel.delete(id); render(); },
  selAll:(el)=>{ const ids=[...document.querySelectorAll('[data-ch=sel]')].map(x=>+x.dataset.id); ids.forEach(id=> el.checked? S.ui.conf.sel.add(id) : S.ui.conf.sel.delete(id)); render(); },
  selT:(el)=>{ const id=+el.dataset.id; el.checked? S.ui.track2.sel.add(id) : S.ui.track2.sel.delete(id); render(); },
  selAllT:(el)=>{ [...document.querySelectorAll('[data-ch=selT]')].forEach(x=> el.checked? S.ui.track2.sel.add(+x.dataset.id) : S.ui.track2.sel.delete(+x.dataset.id)); render(); },
  oWilaya:(el)=>{ const o=drawerOrder(); o.wilaya=+el.value; o.commune=''; render(); },
  oCommune:(el)=>{ drawerOrder().commune=el.value; },
  oAddress:(el)=>{ drawerOrder().address=el.value; },
  lineQset:(el)=>{ const o=drawerOrder(); o.items[+el.dataset.i].q=Math.max(1,+el.value||1); render(); },
  oDiscount:(el)=>{ const o=drawerOrder(); const v=Math.max(0,Math.min(100,+el.value||0)); const lim = S.role==='agent'? SETTINGS.discountAgent : S.role==='manager'? SETTINGS.discountManager : 100; o.discount=v; if(v>lim) toast(t('Au-delà de')+' '+lim+' % : '+t('validation requise à la confirmation'),'bad'); render(); },
  attAgent:(el)=>{ S.ui.att.agent=el.value; render(); },
  prodCat:(el)=>{ S.ui.prod.cat=el.value; render(); },
  prodSt:(el)=>{ S.ui.prod.st=el.value; render(); },
  invCount:(el)=>{ S.ui.inv=S.ui.inv||{}; S.ui.inv[el.dataset.id]=el.value; render(); },
  cliSort:(el)=>{ S.ui.cli.sort=el.value; render(); },
  perm:(el)=>{ const i=+el.dataset.i; MATRIX[el.dataset.r][i] = el.checked? 'Lecture' : '—'; log('Permission modifiée', el.dataset.r, MODULES[i]+' → '+MATRIX[el.dataset.r][i]); render(); },
  assignMode:(el)=>{ SETTINGS.assignMode=el.value; log('Mode de répartition', el.value); toast(t('Mode de répartition')+' : '+t(MODES.find(m=>m[0]===el.value)[1]),'ok'); render(); },
  agentWeight:(el)=>{ UBY[+el.dataset.id].weight=+el.value||0; render(); },
  agentQuota:(el)=>{ UBY[+el.dataset.id].quota=+el.value||1; render(); },
  setQuota:(el)=>{ SETTINGS.quota=+el.value||20; },
  setReassign:(el)=>{ SETTINGS.reassignAfter=+el.value||30; },
  finOrder:(el)=>{ S.ui.fin.order=+el.value; render(); },
  usdRate:(el)=>{ SETTINGS.usdRate=+el.value||260; render(); },
  statAgent:(el)=>{ S.ui.stats.agent=el.value; render(); },
  statWilaya:(el)=>{ S.ui.stats.wilaya=el.value; render(); },
  wActive:(el)=>{ WBY[+el.dataset.id].active=el.checked; },
  wFee:(el)=>{ WBY[+el.dataset.id][el.dataset.k]=+el.value||0; toast(t('Frais mis à jour — appliqués à la boutique'),'ok'); },
  setNum:(el)=>{ SETTINGS[el.dataset.k]=+el.value; },
  setBox:(el)=>{ const v=Math.max(0,Math.min(100,+el.value||0)); SETTINGS.boxes.security=v; SETTINGS.boxes.reinvest=100-v; render(); },
  pFrom:(el)=>{ S.pFrom=el.value; render(); },
  pTo:(el)=>{ S.pTo=el.value; render(); },
  maint:(el)=>{ SETTINGS.maintenance=el.checked; },
  onDemand:(el)=>{ PRODUCTS.filter(p=>p.status==='rupture').forEach(p=>p.onDemand=el.checked); toast(el.checked? t('Ruptures commandables sur demande') : t('Ruptures non commandables'),'ok'); },
  goal:(el)=>{ S.ui.goals[el.dataset.k]=+el.value||1; render(); },
  supSales:(el)=>{ SETTINGS.supplierSales=el.checked; },
  oCarrier:(el)=>{ const o=drawerOrder(); o.carrier=el.value; o.parcels=null; if(!CRB[el.value].internal) o.courierId=null; hist(o,'Société de livraison', CRB[el.value].name); render(); },
  oCourier:(el)=>{ const o=drawerOrder(); o.courierId=+el.value||null; render(); },
  rowCarrier:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); o.carrier=el.value; o.parcels=null; if(!CRB[el.value].internal) o.courierId=null; hist(o,'Société de livraison', CRB[el.value].name); render(); },
  carField:(el)=>{ const c=CRB[el.dataset.id]; const k=el.dataset.k; c[k] = el.type==='number'? (+el.value||0) : el.value; if(['baseKg','extraPerKg','maxParcelKg','feeFactor'].includes(k)) render(); },
  carBool:(el)=>{ CRB[el.dataset.id][el.dataset.k]=el.checked; render(); },
  carDefaultSel:(el)=>{ CARRIERS.forEach(c=>c.isDefault=c.id===el.value); render(); },
  feeCar:(el)=>{ S.ui.liv.feeCar=el.value; render(); },
  jobCourier:(el)=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); o.courierId=+el.value||null; hist(o,'Livreur', o.courierId? CUB[o.courierId].name : '—'); render(); },
  pxActive:(el)=>{ PIXELS.find(p=>p.id===el.dataset.id).active=el.checked; render(); },
  pxField:(el)=>{ PIXELS.find(p=>p.id===el.dataset.id)[el.dataset.k]=el.value.trim(); },
  pxEvent:(el)=>{ PIXEL_EVENTS[el.dataset.p][el.dataset.k]=el.checked; render(); },
  purchaseOn:(el)=>{ SETTINGS.purchaseOn=el.value; toast(t('Enregistré'),'ok'); },
  pxDedup:(el)=>{ SETTINGS.dedup=el.checked; },
  modToggle:(el)=>{ SETTINGS.modules[el.dataset.k]=el.checked; log('Module '+(el.checked?'activé':'désactivé'), el.dataset.k); render(); },
  supAll:(el)=>{ document.querySelectorAll('.supChk').forEach(x=>x.checked=el.checked); CH.supChk(); },
  supChk:()=>{ const ids=[...document.querySelectorAll('.supChk:checked')].map(x=>+x.value); const tot=ids.reduce((s,id)=>s+supShare(ORDERS.find(o=>o.id===id)),0); const el=document.getElementById('supTot'); if(el) el.textContent=dzd(tot); },
};
function saveCoFields(){ const co=S.ui.co; ['coName:name','coPhone:phone','coC:commune','coA:address','coN:note'].forEach(s=>{ const [id,k]=s.split(':'); const el=document.getElementById(id); if(el) co[k]=el.value; }); }
const IN = {
  confQ:(el)=>{ S.ui.conf.q=el.value; render(); },
  trackQ:(el)=>{ S.ui.track2.q=el.value; render(); },
  prodQ:(el)=>{ S.ui.prod.q=el.value; render(); },
  stockQ:(el)=>{ S.ui.stock.q=el.value; render(); },
  cliQ:(el)=>{ S.ui.cli.q=el.value; render(); },
  addQ:(el)=>{ S.drawer.addQ=el.value; if(S.drawer.page) render(); else { renderOverlay(); const i=document.getElementById('addQ'); if(i){ i.focus(); i.setSelectionRange(i.value.length,i.value.length); } } },
};
const SUB = {
  shopSearch:()=>{ S.ui.shop.q=val('shopQ').trim(); S.ui.shop.page=1; S.ui.shop.cat=null; location.hash='#/recherche'; render(); },
  placeOrder:()=>placeOrder(),
  track:()=>{ const phone=val('trP').replace(/\s/g,''), ref=val('trR').trim().toUpperCase(); const o=ORDERS.find(x=>x.ref===ref && CBY[x.customerId].phone.replace(/\s/g,'')===phone); S.ui.track={phone:val('trP'), ref:val('trR'), found:o?o.id:null, err:o?'':'Aucune commande ne correspond à ce téléphone et ce numéro.'}; render(); },
  contact:()=>{ toast(t('Message envoyé — nous vous répondons rapidement'),'ok'); ['ctN','ctP','ctM'].forEach(id=>document.getElementById(id).value=''); },
};

/* ---------- minuteries ---------- */
setInterval(()=>{ if(!location.hash || location.hash==='#/' ){ S.heroIdx=(S.heroIdx+1)%2; document.querySelectorAll('.hero .slide').forEach((s,i)=>s.classList.toggle('on',i===S.heroIdx)); document.querySelectorAll('.hero .dots button').forEach((s,i)=>s.classList.toggle('on',i===S.heroIdx)); } }, 6000);
const notified = new Set();
setInterval(()=>{
  // rappels à l'heure (agent)
  if(S.role==='agent') ORDERS.filter(o=>o.agentId===S.agentId && o.nextCall && CONF_ST.includes(o.status) && o.nextCall-Date.now()<5*MIN && !notified.has(o.id+'_'+o.nextCall)).forEach(o=>{ notified.add(o.id+'_'+o.nextCall); toast(t('Rappel')+' : '+o.ref+' · '+CBY[o.customerId].name+' '+t('à')+' '+fTime(o.nextCall)); });
  // rafraîchir les comptes à rebours si aucun champ n'est en cours d'édition
  const ae=document.activeElement; if(location.hash.startsWith('#/erp') && !S.modal && !(ae && /INPUT|SELECT|TEXTAREA/.test(ae.tagName))) render();
}, 30000);

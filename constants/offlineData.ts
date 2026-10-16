// Central Offline & Emergency Mock Data Vault
// Contains complete offline mock diagnoses and demo history records
// so the app remains 100% functional and testable without internet.

import { DiagnosisResult, ScanRecord } from "@/lib/types";

/**
 * Returns an offline diagnosis result for the given image/preset URL
 */
export function getOfflineDiagnosis(imageUrl: string, language = "English"): DiagnosisResult {
  const isUrdu = language === "Urdu";

  if (imageUrl.includes("rotten-apple") || imageUrl.includes("1644504113660-54f9d01b27d6")) {
    // Rotten Apple
    return {
      crop_name: isUrdu ? "سیب کا باغ (Apple Orchard)" : "Apple (Malus domestica)",
      scientific_name: "Monilinia fructigena",
      condition_detected: isUrdu ? "پھلوں کی سڑن (خراب فصل / Bitter Rot)" : "Bitter Rot & Fruit Spoilage",
      confidence_score: 0.96,
      severity: "Critical",
      symptoms: [
        isUrdu ? "پھل پر گہری بھوری نرم سڑن اور پھپھوندی کا داغ" : "Sunken brown circular fungal rot lesion across apple skin",
        isUrdu ? "پھل کا اندر سے گل سڑ جانا اور گودا خراب ہونا" : "Decomposed fruit tissue with fungal spore rings",
        isUrdu ? "فصل منڈی کے قابل نہیں رہی اور شدید نقصان" : "Severe post-harvest fruit spoilage and unmarketable crop",
      ],
      treatment: {
        immediate_action: isUrdu ? "تمام سڑے ہوئے سیب درختوں اور زمین سے فوراً اکٹھا کر کے گڑھے میں دبا دیں۔" : "Collect and bury all rotting dropped and branch apples immediately.",
        organic_remedy: isUrdu ? "باغ میں نیم کا سپرے کریں اور پھل توڑنے والے ڈبے صاف رکھیں۔" : "Spray bio-fungicide Bacillus subtilis and sanitize fruit picking crates.",
        chemical_alternative: isUrdu ? "کیپٹان (Captan 50 WP) یا فلوڈیوکسونیل کا سپرے۔" : "Captan 50 WP or Fludioxonil protective orchard fungicide.",
      },
      prevention_tips: [
        isUrdu ? "کٹائی کے وقت سیب کو چوٹ یا ناخن لگنے سے بچائیں" : "Handle harvest gently to prevent skin punctures where fungi enter",
        isUrdu ? "پھلوں کو ٹھنڈی اور ہوادار جگہ پر رکھیں" : "Store picked apples below 4°C in clean, ventilated dry crates",
      ],
      climate_impact_warning: isUrdu ? "بارش کے بعد گرمی اور زیادہ نمی سڑن کو گھنٹوں میں پھیلا دیتی ہے۔" : "Warm humid weather (>22°C) combined with wet ground triggers rapid fruit rot.",
      lesion_boxes: [[280, 220, 680, 620]],
      healthy_comparison: {
        healthy_traits: [
          isUrdu ? "چمکدار اور سخت سرخ چھلکا بغیر کسی داغ کے" : "Smooth, firm skin with no brown soft indentations",
          isUrdu ? "ٹھوس اور رس بھرا گودا اور پختہ ڈنڈی" : "Solid crisp flesh and intact healthy stem",
        ],
        key_difference: isUrdu
          ? "صحت مند سیب پر چھلکا سخت اور محفوظ ہوتا ہے، جبکہ اس سیب پر فنگس کے دھبے اور گودے کی سڑن پھیل چکی ہے۔"
          : "A healthy apple has intact protective skin, whereas this fruit exhibits sunken fungal rot and decaying pulp.",
        recovery_signs: isUrdu
          ? "باقی پھلوں پر اگلے 5 سے 7 دنوں میں کوئی نیا نرم بھورا داغ نہ بنے تو فنگس کا پھیلاؤ رک جائے گا۔"
          : "Zero expanding brown spots on remaining fruit within 5 to 7 days after sanitizing and applying protective spray.",
      },
      disease_origin: {
        why_it_happened: isUrdu
          ? "سیب پر یہ سڑن مونیلینیا (Monilinia) پھپھوندی کے حملے سے ہوتی ہے جو کٹائی یا چوٹ لگنے کے بعد گودے میں داخل ہوتی ہے۔"
          : "Brown rot develops when Monilinia fungal spores penetrate minor skin cracks or insect punctures on the fruit surface.",
        weather_correlation: isUrdu
          ? "باغ میں گرمی (22 ڈگری سے اوپر) اور مسلسل نمی نے پھپھوندی کے بیجوں کو تیزی سے اگنے میں مدد دی۔"
          : "High humidity (>80%) combined with warm orchard temperatures created optimal spore germination conditions.",
      },
    };
  }

  if (imageUrl.includes("drought-corn") || imageUrl.includes("1789406515055-d2373d385f77")) {
    // Drought Corn
    return {
      crop_name: isUrdu ? "مکئی کی فصل (Field Maize)" : "Field Maize (Zea mays)",
      scientific_name: "Zea mays (Heat/Drought Stress)",
      condition_detected: isUrdu ? "شدید گرمی اور پانی کی کمی (Drought Scorch)" : "Severe Drought Stress & Thermal Leaf Scorch",
      confidence_score: 0.95,
      severity: "Moderate",
      symptoms: [
        isUrdu ? "پتے سوکھ کر مڑ گئے ہیں اور پپڑی بن گئے ہیں" : "Curled, desiccated leaf blades with dry straw-colored margins",
        isUrdu ? "پودے کی بڑھوتری رک گئی ہے اور تنا سوکھ رہا ہے" : "Stunted stalk elongation and severe midday foliage wilting",
        isUrdu ? "پتوں کی نوکیں جل گئی ہیں" : "Marginal leaf necrosis caused by prolonged soil moisture deficit",
      ],
      treatment: {
        immediate_action: isUrdu ? "شام کے وقت یا علی الصبح فوری طور پر ہلکا پانی دیں۔" : "Apply slow restorative furrow irrigation during early morning or twilight.",
        organic_remedy: isUrdu ? "زمین پر گندم کی بھوسے یا گھاس کی ملچنگ کریں تاکہ نمی برقرار رہے۔" : "Lay 3-inch straw mulch across row bases to conserve root-zone moisture.",
        chemical_alternative: isUrdu ? "پوٹاشیم نائٹریٹ (1%) یا امینو ایسڈ کا فولیئر سپرے۔" : "Foliar spray with potassium nitrate (1%) or anti-transpirant stress biostimulants.",
      },
      prevention_tips: [
        isUrdu ? "شدید دھوپ میں دن کے وقت پانی دینے سے گریز کریں" : "Avoid midday overhead watering to prevent leaf scorching",
        isUrdu ? "ڈرپ ایریگیشن یا کھالیوں سے پانی دیں" : "Install furrow or drip irrigation to direct water precisely to root zone",
      ],
      climate_impact_warning: isUrdu ? "38 ڈگری سے زیادہ درجہ حرارت اور خشک ہوا پودے کے خلیات جلا رہی ہے۔" : "Extreme heat wave (>38°C) combined with dry wind accelerates evapotranspiration.",
      lesion_boxes: [[150, 100, 750, 850]],
      healthy_comparison: {
        healthy_traits: [
          isUrdu ? "چوڑے، گہرے سبز اور لچکدار کھڑے پتے" : "Broad, pliable deep-green leaves held horizontally",
          isUrdu ? "مضبوط تنا اور چمکدار تروتازہ بافتیں" : "Turgid, robust stalks with high sap pressure",
        ],
        key_difference: isUrdu
          ? "صحت مند مکئی تروتازہ اور سیدھی کھڑی رہتی ہے جبکہ اس پودے کے پتے پانی کی کمی سے مڑ کر سوکھ چکے ہیں۔"
          : "Healthy maize displays fully unrolled green foliage, whereas drought-stressed maize curls tightly inward.",
        recovery_signs: isUrdu
          ? "پانی دینے کے 36 سے 48 گھنٹوں میں نئے پتے دوبارہ کھلنا شروع ہو جائیں گے۔"
          : "Leaves unroll and regain turgidity within 36 to 48 hours following deep soil hydration.",
      },
      disease_origin: {
        why_it_happened: isUrdu
          ? "زمین میں نمی کے ختم ہو جانے اور تیز دھوپ کی وجہ سے پودے سے پانی کا اخراج جذب کرنے سے زیادہ ہو گیا۔"
          : "Severe soil moisture depletion coupled with excessive vapor pressure deficit drained plant cell turgor.",
        weather_correlation: isUrdu
          ? "پچھلے 7 دنوں سے بارش نہ ہونے اور مسلسل خشک گرم ہوا نے پتے جھلسا دیے۔"
          : "7 consecutive days of zero rainfall and sustained midday temperatures above 38°C scorched the foliage.",
      },
    };
  }

  if (imageUrl.includes("vine-tomatoes") || imageUrl.includes("1592924357228-91a4daadcfea")) {
    // Vine Tomatoes
    return {
      crop_name: isUrdu ? "ٹماٹر کی فصل (Vine Tomatoes)" : "Vine Tomatoes (Solanum lycopersicum)",
      scientific_name: "Solanum lycopersicum (Grade A)",
      condition_detected: isUrdu ? "100% تروتازہ اور پکی ہوئی فصل (Healthy Harvest)" : "Healthy Harvest (Grade A Ripe Tomatoes)",
      confidence_score: 0.97,
      severity: "Low",
      symptoms: [
        isUrdu ? "لال سرخ چمکدار ٹماٹر، پھلوں پر کوئی فنگس یا داغ نہیں" : "Plump, deep-red ripe tomatoes free of fungal spots or skin cracks",
        isUrdu ? "سبز ڈنڈیاں تروتازہ ہیں اور پودا بالکل محفوظ ہے" : "Fresh green calyx stems with zero defoliation or blight lesions",
        isUrdu ? "پھل چنائی کے لیے بالکل تیار اور اعلیٰ معیار کا ہے" : "Ready for picking and packing with premium market value",
      ],
      treatment: {
        immediate_action: isUrdu ? "پکے ہوئے لال ٹماٹر صبح کے ٹھنڈے وقت احتیاط سے توڑ لیں۔" : "Harvest ripe fruit during cool morning hours; avoid skin bruising.",
        organic_remedy: isUrdu ? "باقی ہرے پھلوں کے لیے پودوں کو قدرتی کھاد دیتے رہیں۔" : "Feed green developing tomatoes with organic potassium-rich tea.",
        chemical_alternative: isUrdu ? "کسی کیمیائی سپرے کی ضرورت نہیں، پھل کھانے کے لیے صاف ہے۔" : "No chemical spray needed; harvest is safe, clean, and ready to eat.",
      },
      prevention_tips: [
        isUrdu ? "کٹائی کے وقت پھلوں کو صاف اور خشک ڈبوں میں رکھیں" : "Use sanitized, dry harvest crates to prevent storage bruising",
        isUrdu ? "پودے کی جڑوں پر ملچنگ کریں تاکہ زمین کی نمی برابر رہے" : "Mulch around vine base to keep soil moisture even and avoid splitting",
      ],
      climate_impact_warning: isUrdu ? "شدید بارش سے پہلے پکے ہوئے ٹماٹر توڑ لیں تاکہ پھٹنے سے بچیں۔" : "Pick ripe tomatoes before sudden heavy rains to prevent skin cracking.",
      lesion_boxes: [],
      healthy_comparison: {
        healthy_traits: [
          isUrdu ? "ہموار، چمکدار لال جلد بغیر کسی شگاف یا داغ کے" : "Smooth, glossy red skin without splitting or fungal specks",
          isUrdu ? "تروتازہ سبز تارے نما پھول اور مضبوط ڈنڈی" : "Fresh green star-shaped calyx leaves and firm vine pedicel",
          isUrdu ? "ٹھوس اور رس بھرا گودا جو دبانے پر مضبوط رہے" : "Dense, solid pulp with balanced firmness and sugar content",
        ],
        key_difference: isUrdu
          ? "پھل بغیر کسی داغ یا بلائٹ کے بہترین حالت میں پکا ہوا ہے۔"
          : "Fruit exhibits prime physiological maturity with zero early blight or bacterial spot lesions.",
        recovery_signs: isUrdu
          ? "پودا صحت مند ہے، باقی ہرے ٹماٹر اگلے 5 سے 7 دنوں میں لال اور چمکدار بن جائیں گے۔"
          : "Continuous optimal fruit set with green tomatoes ripening uniformly over the next 5 to 7 days.",
      },
      disease_origin: {
        why_it_happened: isUrdu
          ? "ٹماٹر کی فصل صحت مند ہے اور پودے کی قوت مدافعت مضبوط ہے، جس کی وجہ سے لیٹ بلائٹ یا پھلوں کے داغ نہیں لگے۔"
          : "Vines and fruit possess strong cellular vitality; balanced irrigation prevented blossom end rot and fungal blight spores.",
        weather_correlation: isUrdu
          ? "پچھلے ہفتے متوازن دھوپ اور بارش نہ ہونے سے ٹماٹر کی جلد نرم نہیں ہوئی اور پھل محفوظ طریقے سے پک گیا۔"
          : "Stable dry weather and moderate humidity prevented skin splitting and bacterial speck infection across the past week.",
      },
    };
  }

  if (imageUrl.includes("spoiled-pumpkin") || imageUrl.includes("1675678674818-a749f21f22c5")) {
    // Spoiled Pumpkin
    return {
      crop_name: isUrdu ? "کدو اور پیٹھے کی فصل (Field Pumpkin)" : "Field Pumpkin (Cucurbita pepo)",
      scientific_name: "Didymella bryoniae",
      condition_detected: isUrdu ? "پھل کا گل سڑ جانا (خراب پیداوار / Black Rot)" : "Black Rot & Field Spoilage",
      confidence_score: 0.94,
      severity: "Critical",
      symptoms: [
        isUrdu ? "کدو پر پانی بھرے نرم داغ اور کالی سڑن" : "Water-soaked sunken lesions turning into soft black rot",
        isUrdu ? "پھپھوندی کے کیچڑ سے پھل کا مکمل گل جانا" : "Extensive fungal mold and tissue collapse across rind",
        isUrdu ? "گیلی مٹی پر پڑی پیداوار کا مکمل برباد ہونا" : "Total harvest breakdown of fruit rotting on field ground",
      ],
      treatment: {
        immediate_action: isUrdu ? "سڑے ہوئے کدو کھیت سے فوراً ہٹائیں تاکہ باقی فصل بچ سکے۔" : "Remove decaying fruit from the field to stop spore contamination.",
        organic_remedy: isUrdu ? "پھلوں کے نیچے خشک پرالی یا گھاس بچھائیں۔" : "Place straw mulch beneath fruit to keep rind off wet dirt.",
        chemical_alternative: isUrdu ? "کلوروتھالونیل (Chlorothalonil) کا سپرے۔" : "Chlorothalonil or Azoxystrobin protective field spray.",
      },
      prevention_tips: [
        isUrdu ? "پھلوں کو گیلی زمین پر براہ راست نہ رہنے دیں" : "Avoid direct contact between fruit rind and waterlogged soil",
        isUrdu ? "کدو کے کھیت میں مناسب نکاسی آب رکھیں" : "Ensure raised bed drainage and rotate crops away from cucurbits",
      ],
      climate_impact_warning: isUrdu ? "کھیت میں کھڑا پانی اور شدید نمی سڑن میں 60 فیصد اضافہ کرتی ہے۔" : "Standing puddle water and heavy late rains drive 60% higher fruit rot rate.",
      lesion_boxes: [[320, 150, 740, 520], [380, 540, 790, 860]],
      healthy_comparison: {
        healthy_traits: [
          isUrdu ? "سخت اور خشک چھلکا جو ناخن سے نہ دبے" : "Hard, dry rind resistant to fingernail puncture",
          isUrdu ? "یکساں نارنجی یا سنہری رنگ بغیر نرم داغوں کے" : "Uniform deep orange or golden skin without water-soaked spots",
          isUrdu ? "مضبوط لکڑی نما ڈنٹھل اور صاف نچلا حصہ" : "Tough woody intact stem with clean dry bottom",
        ],
        key_difference: isUrdu
          ? "صحت مند کدو کا چھلکا خشک اور سخت ہوتا ہے، جبکہ اس کدو پر گیلی مٹی کی وجہ سے کالی سڑن اور پھپھوندی کا حملہ ہے۔"
          : "Healthy pumpkins possess a thick impenetrable rind, whereas this fruit decayed from direct contact with wet muddy ground.",
        recovery_signs: isUrdu
          ? "کھیت میں پرالی بچھانے کے بعد 5 دنوں میں باقی کدو خشک رہیں گے اور ان پر کوئی نیا کالا دھبہ نہیں آئے گا۔"
          : "Fruit elevated onto dry straw mulch shows zero expanding black lesions within 5 to 7 days.",
      },
      disease_origin: {
        why_it_happened: isUrdu
          ? "کدو کا گلنا ڈائیڈی میلا (Didymella) پھپھوندی کا نتیجہ ہے جو گیلی زمین کے براہ راست رابطے سے پھل پر حملہ کرتی ہے۔"
          : "Black rot is caused by Didymella fungi attacking fruit rind resting on waterlogged, un-aerated soil.",
        weather_correlation: isUrdu
          ? "پچھلے ہفتے کی بارش اور کھیت میں کھڑے پانی نے کدو کی جلد پر پانی بھرے زخم بنا کر سڑن تیز کر دی۔"
          : "Consecutive rain days and standing soil puddle water softened rind cuticles, allowing rapid fungal invasion.",
      },
    };
  }

  if (imageUrl.includes("sweet-corn") || imageUrl.includes("1551754655-cd27e38d2076")) {
    // Sweet Corn
    return {
      crop_name: isUrdu ? "تازہ میٹھی مکئی (Fresh Sweet Corn)" : "Sweet Corn (Zea mays)",
      scientific_name: "Zea mays saccharata (Prime)",
      condition_detected: isUrdu ? "100% صحت مند چھلی (اعلیٰ فصل / Prime Yield)" : "Grade A Healthy Harvest (Prime Cobs)",
      confidence_score: 0.98,
      severity: "Low",
      symptoms: [
        isUrdu ? "مکمل بھرے ہوئے سنہری دانے اور تروتازہ سبز چھلکا" : "Plump, golden yellow kernels tightly packed in green husks",
        isUrdu ? "کیڑے، سنڈی یا فنگس کا کوئی نشان نہیں" : "Zero earworm damage, fungal smut, or blight discoloration",
        isUrdu ? "فصل بالکل تیار اور اعلیٰ معیار کی ہے" : "Premium grade sweetness, high moisture turgor, ready for market",
      ],
      treatment: {
        immediate_action: isUrdu ? "چھلیاں بالکل تیار ہیں، صبح کے وقت کٹائی کر کے منڈی بھیجیں۔" : "Corn is at peak sweetness; pick during cool hours and sell or refrigerate.",
        organic_remedy: isUrdu ? "تروتازگی قائم رکھنے کے لیے چھلیوں کو سائے اور ٹھنڈی جگہ پر رکھیں۔" : "Store harvested sweet corn below 5°C to preserve natural kernel sugar.",
        chemical_alternative: isUrdu ? "کسی دوا کی ضرورت نہیں، پیداوار بالکل محفوظ اور صاف ہے۔" : "Zero chemical intervention required; produce is clean and market-ready.",
      },
      prevention_tips: [
        isUrdu ? "فصل کٹنے کے بعد کھیت میں نمی برقرار رکھیں" : "Keep picked cobs out of direct sunlight to prevent drying",
        isUrdu ? "اگلی فصل کے لیے دالوں کی کاشت کریں" : "Rotate with legumes to rebuild soil nitrogen for next season",
      ],
      climate_impact_warning: isUrdu ? "موسم کٹائی کے لیے بہترین ہے، بارش سے پہلے تڑوائی مکمل کریں۔" : "Current clear weather is ideal for harvest; complete picking before rain.",
      lesion_boxes: [],
      healthy_comparison: {
        healthy_traits: [
          isUrdu ? "مکمل سنہری اور دودھیا دانے جو آخری سرے تک بھرے ہوں" : "Plump golden kernels tightly filled all the way to cob tip",
          isUrdu ? "تروتازہ سبز چھلکا اور صاف نم ریشم" : "Crisp emerald-green husk leaves and clean moist silks",
          isUrdu ? "سنڈی کے سوراخوں یا فنگس کی کالک سے بالکل پاک" : "Zero earworm boring holes, mold fuzz, or black smut",
        ],
        key_difference: isUrdu
          ? "یہ فصل 100% صحت مند معیار پر پوری اترتی ہے اور منڈی کے لیے اعلیٰ ترین گریڈ ہے۔"
          : "This harvest represents peak Grade A reference quality with zero pathological or pest defects.",
        recovery_signs: isUrdu
          ? "فصل پہلے ہی مکمل تندرست ہے، کٹائی کے بعد سائے میں رکھنے سے قدرتی مٹھاس برقرار رہے گی۔"
          : "Produce is in prime health; rapid cool storage preserves kernel moisture and natural sugars.",
      },
      disease_origin: {
        why_it_happened: isUrdu
          ? "یہ فصل مکمل طور پر تندرست ہے، متوازن غذائیت اور سازگار ماحول نے پودے کو فنگس اور کیڑوں کے حملے سے محفوظ رکھا ہے۔"
          : "Crop is in peak physiological health; optimal nutrient uptake and balanced environmental conditions prevented pathogen colonization.",
        weather_correlation: isUrdu
          ? "پچھلے ہفتے کا معتدل درجہ حرارت (24-28 ڈگری) اور متوازن نمی (55%) نے سنہری دانوں کو بغیر کسی فنگس یا روٹ کے پکنے دیا۔"
          : "Ideal weekly thermal range (24-28°C) and moderate humidity (55%) supported uniform kernel filling without fungal blight risk.",
      },
    };
  }

  if (imageUrl.includes("green-basil") || imageUrl.includes("1534944645004-bf75556ce377") || imageUrl.includes("1576092768241-dec231879fc3")) {
    // Green Basil
    return {
      crop_name: isUrdu ? "سبز نیازبو / تلسی (Sweet Basil)" : "Sweet Basil (Ocimum basilicum)",
      scientific_name: "Ocimum basilicum (Healthy)",
      condition_detected: isUrdu ? "100% تروتازہ اور صحت مند پتے (Disease-Free)" : "100% Disease-Free Healthy Foliage",
      confidence_score: 0.99,
      severity: "Low",
      symptoms: [
        isUrdu ? "چمکدار سبز پتے، کوئی داغ یا کیڑے کا نشان نہیں" : "Vibrant emerald green leaves with strong cuticle and cell turgor",
        isUrdu ? "پودا بالکل تندرست اور بیماری سے محفوظ ہے" : "Zero fungal leaf spots, downy mildew, or insect damage",
        isUrdu ? "نئی شاخیں تیزی اور تندرستی سے نکل رہی ہیں" : "Active vegetative growth with healthy shoot branching",
      ],
      treatment: {
        immediate_action: isUrdu ? "کسی دوا کی ضرورت نہیں، پودا بہترین حالت میں بڑھ رہا ہے۔" : "No treatment required. Your herb foliage is in pristine condition!",
        organic_remedy: isUrdu ? "معمول کے مطابق مناسب پانی اور نامیاتی کھاد دیتے رہیں۔" : "Continue regular compost tea root feeding and balanced watering.",
        chemical_alternative: isUrdu ? "کسی کیمیائی دوا کی بالکل ضرورت نہیں۔" : "No chemical spray needed.",
      },
      prevention_tips: [
        isUrdu ? "پودے کی اوپر والی کونپلیں چٹکی سے توڑتے رہیں تاکہ جھاڑی دار بنے" : "Pinch top leaf nodes regularly to promote bushy lateral growth",
        isUrdu ? "صبح کے وقت جڑوں میں پانی دیں، پتوں کو گیلا نہ رکھیں" : "Water soil at base in morning; keep foliage dry overnight",
      ],
      climate_impact_warning: isUrdu ? "معتدل دھوپ اور گرم موسم پودے کے لیے نہایت سازگار ہے۔" : "Moderate sunshine and warm temperatures provide ideal growing conditions.",
      lesion_boxes: [],
      healthy_comparison: {
        healthy_traits: [
          isUrdu ? "چمکدار زمردی سبز پتے جن کی سطح لچکدار اور تروتازہ ہو" : "Vibrant emerald green leaves with crisp cellular turgor",
          isUrdu ? "ہموار پتے بغیر کسی زردی یا بھورے پھپھوندی کے داغ کے" : "Uniform lamina with zero chlorosis or downy mildew spots",
          isUrdu ? "تیز خوشبو اور نئی سرسبز کونپلوں کا تیزی سے پھوٹنا" : "Potent aromatic essential oils and vigorous node branching",
        ],
        key_difference: isUrdu
          ? "پودا بالکل بے داغ ہے، نہ تو کوئی فنگس ہے اور نہ ہی کیڑوں کا نقصان۔"
          : "Specimen displays 100% pristine foliage free of fungal sporulation or insect stippling.",
        recovery_signs: isUrdu
          ? "پودا مسلسل تندرست ہے، ہر 4 سے 6 دن میں نئی صاف سبز پتوں کی جوڑیاں نکلتی رہیں گی۔"
          : "Active continuous growth with clean aromatic leaf pairs emerging every 4 to 6 days.",
      },
      disease_origin: {
        why_it_happened: isUrdu
          ? "نیازبو کے پتے صاف اور جراثیم سے پاک ہیں، مناسب ہواداری اور جڑوں میں پانی دینے کی وجہ سے ڈاؤنی ملڈیو پیدا نہیں ہوئی۔"
          : "Foliage is pristine with no downy mildew; proper plant spacing and root-level watering kept foliage dry and pathogen-free.",
        weather_correlation: isUrdu
          ? "ہفتے بھر اچھی دھوپ اور پتوں پر رات کے وقت پانی نہ ٹھہرنے نے فنگس کے بیجوں کو پھوٹنے کا موقع نہیں دیا۔"
          : "Consistent daylight exposure and low overnight leaf wetness prevented fungal spore incubation over the past 7 days.",
      },
    };
  }

  // Default Healthy / General Fallback
  return {
    crop_name: isUrdu ? "سبز پودا / فصل (Healthy Crop)" : "Vegetable Crop (Prime Foliage)",
    scientific_name: "Solanum lycopersicum",
    condition_detected: isUrdu ? "صحت مند اور تروتازہ فصل (Grade A Healthy)" : "Healthy Crop Foliage (Grade A Prime)",
    confidence_score: 0.98,
    severity: "Low",
    symptoms: [
      isUrdu ? "پتے یکساں سبز اور چمکدار ہیں" : "Uniform vibrant emerald green pigmentation across leaf blades",
      isUrdu ? "پتوں پر کسی قسم کا فنگس یا داغ موجود نہیں" : "Zero fungal leaf spots, blights, or necrotic lesions detected",
      isUrdu ? "رگیں اور خلیات مضبوط اور تروتازہ ہیں" : "Intact venation and robust cellular structural turgor",
    ],
    treatment: {
      immediate_action: isUrdu ? "معمول کے مطابق مناسب پانی دیں اور گوڈی کریں۔" : "Continue standard irrigation schedule and maintain regular field scouting.",
      organic_remedy: isUrdu ? "ماہانہ بنیادوں پر کمپوسٹ چائے یا نامیاتی کھاد کا استعمال کریں۔" : "Apply light compost tea foliar spray to fortify beneficial leaf microflora.",
      chemical_alternative: isUrdu ? "کسی کیمیائی دوا کی ضرورت نہیں ہے (فصل صحت مند ہے)۔" : "No chemical spray required. Crop is in prime physiological health.",
    },
    prevention_tips: [
      isUrdu ? "پودوں کے درمیان ہوا کا مناسب گزر یقینی بنائیں" : "Maintain adequate row spacing for ventilation and light penetration",
      isUrdu ? "پانی دیتے وقت پتے زیادہ دیر گیلے نہ رہنے دیں" : "Water near root level to avoid extended leaf wetness overnight",
    ],
    climate_impact_warning: isUrdu ? "موسم پودے کی افزائش کے لیے سازگار ہے۔ معمول کی نگہداشت جاری رکھیں۔" : "Current microclimate is favorable. Routine monitoring recommended.",
    healthy_comparison: {
      healthy_traits: [
        isUrdu ? "گہرا سبز رنگ اور مکمل صاف پتے" : "Vibrant deep-green coloration with smooth cuticle",
        isUrdu ? "کیڑوں یا بیماری کے بغیر صحت مند بافتیں" : "Zero pest chewing damage or necrotic lesions",
      ],
      key_difference: isUrdu
        ? "یہ پودا صحت مندی کا بہترین نمونہ ہے اور تمام علامات معیاری ہیں۔"
        : "This specimen meets standard grade-A agronomic benchmarks with zero disease vectors.",
      recovery_signs: isUrdu
        ? "پودا پہلے ہی صحت مند ہے، نئی کونپلیں اور پھول معمول کے مطابق نکلیں گے۔"
        : "Vigorous new leaf flushes and robust flowering expected under maintained care.",
    },
    disease_origin: {
      why_it_happened: isUrdu
        ? "متوازن کھاد، مناسب پانی اور صاف ستھرے زرعی ماحول کی بدولت پودا بیماری سے محفوظ رہا۔"
        : "Optimal balanced nutrition, clean soil conditions, and sufficient sunlight supported strong natural plant immunity.",
      weather_correlation: isUrdu
        ? "درجہ حرارت اور نمی پودے کی مطلوبہ حدود میں رہے، جس سے پھپھوندی کا امکان پیدا نہیں ہوا۔"
        : "Moderate temperatures and balanced air movement prevented fungal spore germination.",
    },
  };
}

/**
 * Offline demo history feed records for testing when Firestore is unreachable
 */
export const OFFLINE_DEMO_SCANS: ScanRecord[] = [
  {
    id: "offline-demo-1",
    crop_name: "Field Maize (مکئی)",
    scientific_name: "Zea mays",
    condition_detected: "Drought Scorch (خشک سالی)",
    confidence_score: 0.95,
    severity: "Moderate",
    symptoms: ["Curled leaf edges", "Midday wilting", "Marginal scorching"],
    treatment: {
      immediate_action: "Apply early morning furrow irrigation.",
      organic_remedy: "Apply 3-inch straw mulch around root bases.",
      chemical_alternative: "Potassium nitrate 1% foliar spray.",
    },
    prevention_tips: ["Mulch field rows", "Adopt drip irrigation"],
    climate_impact_warning: "Excessive heat wave above 38°C accelerating leaf dry-out.",
    // Original: https://images.unsplash.com/photo-1789406515055-d2373d385f77?auto=format&fit=crop&w=800&q=80
    imageUrl: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/drought-corn.jpg",
    imageThumbnail: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/drought-corn_thumb.jpg",
    language: "English",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    location: { city: "Punjab Farm Belt", country: "Pakistan" },
  },
  {
    id: "offline-demo-2",
    crop_name: "Tomato Vine (ٹماٹر)",
    scientific_name: "Solanum lycopersicum",
    condition_detected: "Early Blight (ابتدائی جھلسائو)",
    confidence_score: 0.93,
    severity: "Moderate",
    symptoms: ["Concentric target rings", "Yellow halo around spots", "Lower leaf drop"],
    treatment: {
      immediate_action: "Prune infected lower foliage immediately.",
      organic_remedy: "Foliar neem oil spray with baking soda mixture.",
      chemical_alternative: "Mancozeb 75 WP or Copper Oxychloride spray.",
    },
    prevention_tips: ["Avoid splash irrigation", "Stake plants for aeration"],
    climate_impact_warning: "Prolonged leaf moisture (>85% humidity) accelerates blight.",
    // Original: https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80
    imageUrl: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/vine-tomatoes.jpg",
    imageThumbnail: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/vine-tomatoes_thumb.jpg",
    language: "English",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    location: { city: "Sindh River Basin", country: "Pakistan" },
  },
  {
    id: "offline-demo-3",
    crop_name: "Apple Orchard (سیب)",
    scientific_name: "Monilinia fructigena",
    condition_detected: "Bitter Rot & Fruit Spoilage (پھل سڑن)",
    confidence_score: 0.96,
    severity: "Critical",
    symptoms: ["Sunken brown soft rot rings", "Tissue collapse"],
    treatment: {
      immediate_action: "Collect and bury all rotting fruit immediately.",
      organic_remedy: "Apply bio-fungicide Bacillus subtilis.",
      chemical_alternative: "Captan 50 WP protective orchard spray.",
    },
    prevention_tips: ["Gentle harvesting", "Sanitize storage bins"],
    climate_impact_warning: "Warm humid orchard conditions accelerate spore explosion.",
    // Original: https://images.unsplash.com/photo-1644504113660-54f9d01b27d6?auto=format&fit=crop&w=800&q=80
    imageUrl: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/rotten-apple.jpg",
    imageThumbnail: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/rotten-apple_thumb.jpg",
    language: "English",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    location: { city: "Nairobi Highlands", country: "Kenya" },
  },
];


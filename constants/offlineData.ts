// Central Offline & Emergency Mock Data Vault
// Contains complete offline mock diagnoses and demo history records
// so the app remains 100% functional and testable without internet.

import { DiagnosisResult, ScanRecord } from "@/lib/types";

/**
 * Returns an offline diagnosis result for the given image/preset URL
 */
export function getOfflineDiagnosis(imageUrl: string, language = "English"): DiagnosisResult {
  const isUrdu = language === "Urdu";

  if (imageUrl.includes("1644504113660-54f9d01b27d6")) {
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

  if (imageUrl.includes("1789406515055-d2373d385f77")) {
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
    imageUrl: "https://images.unsplash.com/photo-1789406515055-d2373d385f77?auto=format&fit=crop&w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1644504113660-54f9d01b27d6?auto=format&fit=crop&w=800&q=80",
    language: "English",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    location: { city: "Nairobi Highlands", country: "Kenya" },
  },
];


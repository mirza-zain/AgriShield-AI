import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { getAdminDb } from "@/lib/firebase";
import { DiagnosisResult, ScanRecord, AgronomicContext } from "@/lib/types";
import { addSharedScan } from "@/lib/scanStore";

// Maximum duration for Next.js route handler to allow thinking models to reason
export const maxDuration = 60;

// Instant agronomic diagnosis lookup matching all presets and offline scenarios
function getPresetDiagnosis(image: string, language: string): DiagnosisResult {
  if (image.includes("1644504113660-54f9d01b27d6") || image.includes("1541858619423-42850b8687c1")) {
    // Bad Harvest 1: Rotten Apple Spoilage (Fruit Rot)
    return {
      crop_name: language === "Urdu" ? "سیب کا باغ (Apple Orchard)" : language === "Hindi" ? "सेब की फसल (Apple)" : language === "Spanish" ? "Manzana (Apple)" : "Apple (Malus domestica)",
      scientific_name: "Monilinia fructigena",
      condition_detected: language === "Urdu" ? "پھلوں کی سڑن (خراب فصل / Brown Rot)" : language === "Hindi" ? "फलों की सड़न (Brown Rot)" : language === "Spanish" ? "Podredumbre Parda (Brown Rot)" : "Bitter Rot & Fruit Spoilage",
      confidence_score: 0.96,
      severity: "Critical",
      symptoms: [
        language === "Urdu" ? "پھل پر گہری بھوری نرم سڑن اور پھپھوندی کا داغ" : "Sunken brown circular fungal rot lesion across apple skin",
        language === "Urdu" ? "پھل کا اندر سے گل سڑ جانا اور گودا خراب ہونا" : "Decomposed fruit tissue with fungal spore rings",
        language === "Urdu" ? "فصل منڈی کے قابل نہیں رہی اور شدید نقصان" : "Severe post-harvest fruit spoilage and unmarketable crop"
      ],
      treatment: {
        immediate_action: language === "Urdu" ? "تمام سڑے ہوئے سیب درختوں اور زمین سے فوراً اکٹھا کر کے گڑھے میں دبا دیں۔" : "Collect and bury all rotting dropped and branch apples immediately.",
        organic_remedy: language === "Urdu" ? "باغ میں نیم کا سپرے کریں اور پھل توڑنے والے ڈبے صاف رکھیں۔" : "Spray bio-fungicide Bacillus subtilis and sanitize fruit picking crates.",
        chemical_alternative: language === "Urdu" ? "کیپٹان (Captan 50 WP) یا فلوڈیوکسونیل کا سپرے۔" : "Captan 50 WP or Fludioxonil protective orchard fungicide."
      },
      prevention_tips: [
        language === "Urdu" ? "کٹائی کے وقت سیب کو چوٹ یا ناخن لگنے سے بچائیں" : "Handle harvest gently to prevent skin punctures where fungi enter",
        language === "Urdu" ? "پھلوں کو ٹھنڈی اور ہوادار جگہ پر رکھیں" : "Store picked apples below 4°C in clean, ventilated dry crates"
      ],
      climate_impact_warning: language === "Urdu" ? "بارش کے بعد گرمی اور زیادہ نمی سڑن کو گھنٹوں میں پھیلا دیتی ہے۔" : "Warm humid weather (>22°C) combined with wet ground triggers rapid fruit rot."
    };
  }

  if (image.includes("1675678674818-a749f21f22c5")) {
    // Bad Harvest 2: Spoiled Pumpkin & Squash Rot
    return {
      crop_name: language === "Urdu" ? "کدو اور پیٹھے کی فصل (Field Pumpkin)" : language === "Hindi" ? "कद्दू की फसल (Pumpkin)" : language === "Spanish" ? "Calabaza (Pumpkin)" : "Field Pumpkin (Cucurbita pepo)",
      scientific_name: "Didymella bryoniae",
      condition_detected: language === "Urdu" ? "پھل کا گل سڑ جانا (خراب پیداوار / Black Rot)" : language === "Hindi" ? "सड़ा हुआ कद्दू (Black Rot)" : language === "Spanish" ? "Podredumbre Negra (Black Rot)" : "Black Rot & Field Spoilage",
      confidence_score: 0.94,
      severity: "Critical",
      symptoms: [
        language === "Urdu" ? "کدو پر پانی بھرے نرم داغ اور کالی سڑن" : "Water-soaked sunken lesions turning into soft black rot",
        language === "Urdu" ? "پھپھوندی کے کیچڑ سے پھل کا مکمل گل جانا" : "Extensive fungal mold and tissue collapse across rind",
        language === "Urdu" ? "گیلی مٹی پر پڑی پیداوار کا مکمل برباد ہونا" : "Total harvest breakdown of fruit rotting on field ground"
      ],
      treatment: {
        immediate_action: language === "Urdu" ? "سڑے ہوئے کدو کھیت سے فوراً ہٹائیں تاکہ باقی فصل بچ سکے۔" : "Remove decaying fruit from the field to stop spore contamination.",
        organic_remedy: language === "Urdu" ? "پھلوں کے نیچے خشک پرالی یا گھاس بچھائیں۔" : "Place straw mulch beneath fruit to keep rind off wet dirt.",
        chemical_alternative: language === "Urdu" ? "کلوروتھالونیل (Chlorothalonil) کا سپرے۔" : "Chlorothalonil or Azoxystrobin protective field spray."
      },
      prevention_tips: [
        language === "Urdu" ? "پھلوں کو گیلی زمین پر براہ راست نہ رہنے دیں" : "Avoid direct contact between fruit rind and waterlogged soil",
        language === "Urdu" ? "کدو کے کھیت میں مناسب نکاسی آب رکھیں" : "Ensure raised bed drainage and rotate crops away from cucurbits"
      ],
      climate_impact_warning: language === "Urdu" ? "کھیت میں کھڑا پانی اور شدید نمی سڑن میں 60 فیصد اضافہ کرتی ہے۔" : "Standing puddle water and heavy late rains drive 60% higher fruit rot rate."
    };
  }

  if (image.includes("1789406515055-d2373d385f77")) {
    // Crop Damage: Drought-Damaged Corn Field
    return {
      crop_name: language === "Urdu" ? "مکئی کی فصل (Field Maize)" : language === "Hindi" ? "मक्का (Field Maize)" : language === "Spanish" ? "Maíz (Maize)" : "Maize / Corn (Zea mays)",
      scientific_name: "Zea mays (Heat / Drought Stress)",
      condition_detected: language === "Urdu" ? "خشک سالی اور گرمی سے سوکھنا (Drought Scorch)" : language === "Hindi" ? "सूखा और झुलसाव (Drought Scorch)" : language === "Spanish" ? "Estrés por Sequía (Drought Scorch)" : "Severe Drought & Leaf Scorch",
      confidence_score: 0.92,
      severity: "Moderate",
      symptoms: [
        language === "Urdu" ? "پتوں کا سوکھ کر پیلا اور بھورا ہو جانا" : "Bleached, withered tan leaves and parched tassels under sun",
        language === "Urdu" ? "پودوں کے تنے سوکھنا اور چھلی میں دانوں کی کمی" : "Premature stalk desiccation and incomplete cob grain fill",
        language === "Urdu" ? "شدید دھوپ سے پیداوار کا وقت سے پہلے ضائع ہونا" : "Significant harvest yield loss from thermal drought stress"
      ],
      treatment: {
        immediate_action: language === "Urdu" ? "تیار چھلیوں کو فوری طور پر توڑ لیں اور سوکھے ڈنٹھل کی ملچنگ کریں۔" : "Harvest mature ears promptly and chop dry residue for field mulch.",
        organic_remedy: language === "Urdu" ? "ہیومک ایسڈ یا سمندری کائی کا سپرے پودوں کا تناؤ کم کرتا ہے۔" : "Apply humic acid and kelp foliar extract to relieve plant heat stress.",
        chemical_alternative: language === "Urdu" ? "پوٹاشیم کا سپرے پودوں میں پانی روکنے کی طاقت بڑھاتا ہے۔" : "Foliar potassium spray to improve plant cell water-retention."
      },
      prevention_tips: [
        language === "Urdu" ? "گرمی برداشت کرنے والی ہائبرڈ مکئی کے بیج کاشت کریں" : "Plant certified drought-tolerant maize hybrid seed varieties",
        language === "Urdu" ? "زمین کی گہری نمی بچانے کے لیے کم ہل چلائیں" : "Practice conservation tillage to preserve residual subsoil moisture"
      ],
      climate_impact_warning: language === "Urdu" ? "مسلسل گرم لو اور 38 ڈگری سے زیادہ درجہ حرارت پیداوار گرا دیتا ہے۔" : "Consecutive days over 38°C during flowering severely diminish ear yield."
    };
  }

  if (image.includes("1551754655-cd27e38d2076")) {
    // Healthy Harvest: Fresh Golden Sweet Corn Ears
    return {
      crop_name: language === "Urdu" ? "تازہ میٹھی مکئی (Fresh Sweet Corn)" : language === "Hindi" ? "ताजा मीठा भुट्टा (Sweet Corn)" : language === "Spanish" ? "Maíz Dulce (Sweet Corn)" : "Sweet Corn (Zea mays)",
      scientific_name: "Zea mays saccharata (Prime)",
      condition_detected: language === "Urdu" ? "100% صحت مند چھلی (اعلیٰ فصل / Prime Yield)" : language === "Hindi" ? "100% स्वस्थ और ताजा फसल (Prime)" : language === "Spanish" ? "Cosecha Sana Grado A (Prime)" : "Grade A Healthy Harvest (Prime Cobs)",
      confidence_score: 0.98,
      severity: "Low",
      symptoms: [
        language === "Urdu" ? "مکمل بھرے ہوئے سنہری دانے اور تروتازہ سبز چھلکا" : "Plump, golden yellow kernels tightly packed in green husks",
        language === "Urdu" ? "کیڑے، سنڈی یا فنگس کا کوئی نشان نہیں" : "Zero earworm damage, fungal smut, or blight discoloration",
        language === "Urdu" ? "فصل بالکل تیار اور اعلیٰ معیار کی ہے" : "Premium grade sweetness, high moisture turgor, ready for market"
      ],
      treatment: {
        immediate_action: language === "Urdu" ? "چھلیاں بالکل تیار ہیں، صبح کے وقت کٹائی کر کے منڈی بھیجیں۔" : "Corn is at peak sweetness; pick during cool hours and sell or refrigerate.",
        organic_remedy: language === "Urdu" ? "تروتازگی قائم رکھنے کے لیے چھلیوں کو سائے اور ٹھنڈی جگہ پر رکھیں۔" : "Store harvested sweet corn below 5°C to preserve natural kernel sugar.",
        chemical_alternative: language === "Urdu" ? "کسی دوا کی ضرورت نہیں، پیداوار بالکل محفوظ اور صاف ہے۔" : "Zero chemical intervention required; produce is clean and market-ready."
      },
      prevention_tips: [
        language === "Urdu" ? "فصل کٹنے کے بعد کھیت میں نمی برقرار رکھیں" : "Keep picked cobs out of direct sunlight to prevent drying",
        language === "Urdu" ? "اگلی فصل کے لیے دالوں کی کاشت کریں" : "Rotate with legumes to rebuild soil nitrogen for next season"
      ],
      climate_impact_warning: language === "Urdu" ? "موسم کٹائی کے لیے بہترین ہے، بارش سے پہلے تڑوائی مکمل کریں۔" : "Current clear weather is ideal for harvest; complete picking before rain."
    };
  }

  if (image.includes("1534944645004-bf75556ce377") || image.includes("1576092768241-dec231879fc3")) {
    // Healthy Foliage: Fresh Green Basil / Foliage
    return {
      crop_name: language === "Urdu" ? "سبز نیازبو / تلسی (Sweet Basil)" : language === "Hindi" ? "हरा तुलसी / बेसिल (Sweet Basil)" : language === "Spanish" ? "Albahaca (Sweet Basil)" : "Sweet Basil (Ocimum basilicum)",
      scientific_name: "Ocimum basilicum (Healthy)",
      condition_detected: language === "Urdu" ? "100% تروتازہ اور صحت مند پتے (Disease-Free)" : language === "Hindi" ? "100% स्वस्थ और रोगमुक्त पत्तियां" : language === "Spanish" ? "Follaje 100% Sano" : "100% Disease-Free Healthy Foliage",
      confidence_score: 0.99,
      severity: "Low",
      symptoms: [
        language === "Urdu" ? "چمکدار سبز پتے، کوئی داغ یا کیڑے کا نشان نہیں" : "Vibrant emerald green leaves with strong cuticle and cell turgor",
        language === "Urdu" ? "پودا بالکل تندرست اور بیماری سے محفوظ ہے" : "Zero fungal leaf spots, downy mildew, or insect damage",
        language === "Urdu" ? "نئی شاخیں تیزی اور تندرستی سے نکل رہی ہیں" : "Active vegetative growth with healthy shoot branching"
      ],
      treatment: {
        immediate_action: language === "Urdu" ? "کسی دوا کی ضرورت نہیں، پودا بہترین حالت میں بڑھ رہا ہے۔" : "No treatment required. Your herb foliage is in pristine condition!",
        organic_remedy: language === "Urdu" ? "معمول کے مطابق مناسب پانی اور نامیاتی کھاد دیتے رہیں۔" : "Continue regular compost tea root feeding and balanced watering.",
        chemical_alternative: language === "Urdu" ? "کسی کیمیائی دوا کی بالکل ضرورت نہیں۔" : "No chemical spray needed."
      },
      prevention_tips: [
        language === "Urdu" ? "پودے کی اوپر والی کونپلیں چٹکی سے توڑتے رہیں تاکہ جھاڑی دار بنے" : "Pinch top leaf nodes regularly to promote bushy lateral growth",
        language === "Urdu" ? "صبح کے وقت جڑوں میں پانی دیں، پتوں کو گیلا نہ رکھیں" : "Water soil at base in morning; keep foliage dry overnight"
      ],
      climate_impact_warning: language === "Urdu" ? "معتدل دھوپ اور گرم موسم پودے کے لیے نہایت سازگار ہے۔" : "Moderate sunshine and warm temperatures provide ideal growing conditions."
    };
  }

  // Default: Fresh Vine Tomatoes
  return {
    crop_name: language === "Urdu" ? "ٹماٹر کی فصل (Vine Tomatoes)" : language === "Hindi" ? "टमाटर (Vine Tomatoes)" : language === "Spanish" ? "Tomate (Vine Tomatoes)" : "Vine Tomatoes (Solanum lycopersicum)",
    scientific_name: "Solanum lycopersicum (Grade A)",
    condition_detected: language === "Urdu" ? "100% تروتازہ اور پکی ہوئی فصل (Healthy Harvest)" : language === "Hindi" ? "100% ताजा और पकी हुई फसल (Grade A)" : language === "Spanish" ? "Cosecha Sana Grado A" : "Healthy Harvest (Grade A Ripe Tomatoes)",
    confidence_score: 0.97,
    severity: "Low",
    symptoms: [
      language === "Urdu" ? "لال سرخ چمکدار ٹماٹر، پھلوں پر کوئی فنگس یا داغ نہیں" : "Plump, deep-red ripe tomatoes free of fungal spots or skin cracks",
      language === "Urdu" ? "سبز ڈنڈیاں تروتازہ ہیں اور پودا بالکل محفوظ ہے" : "Fresh green calyx stems with zero defoliation or blight lesions",
      language === "Urdu" ? "پھل چنائی کے لیے بالکل تیار اور اعلیٰ معیار کا ہے" : "Ready for picking and packing with premium market value"
    ],
    treatment: {
      immediate_action: language === "Urdu" ? "پکے ہوئے لال ٹماٹر صبح کے ٹھنڈے وقت احتیاط سے توڑ لیں۔" : "Harvest ripe fruit during cool morning hours; avoid skin bruising.",
      organic_remedy: language === "Urdu" ? "باقی ہرے پھلوں کے لیے پودوں کو قدرتی کھاد دیتے رہیں۔" : "Feed green developing tomatoes with organic potassium-rich tea.",
      chemical_alternative: language === "Urdu" ? "کسی کیمیائی سپرے کی ضرورت نہیں، پھل کھانے کے لیے صاف ہے۔" : "No chemical spray needed; harvest is safe, clean, and ready to eat."
    },
    prevention_tips: [
      language === "Urdu" ? "کٹائی کے وقت پھلوں کو صاف اور خشک ڈبوں میں رکھیں" : "Use sanitized, dry harvest crates to prevent storage bruising",
      language === "Urdu" ? "پودے کی جڑوں پر ملچنگ کریں تاکہ زمین کی نمی برابر رہے" : "Mulch around vine base to keep soil moisture even and avoid splitting"
    ],
    climate_impact_warning: language === "Urdu" ? "شدید بارش سے پہلے پکے ہوئے ٹماٹر توڑ لیں تاکہ پھٹنے سے بچیں۔" : "Pick ripe tomatoes before sudden heavy rains to prevent skin cracking."
  };
}

// Derive privacy-safe agronomic context (season, month, agro-climatic zone) from optional user observation inputs
function deriveAgronomicContext(dateStr?: string, locationStr?: string): AgronomicContext | undefined {
  if (!dateStr && !locationStr) {
    return undefined;
  }

  let monthName = "";
  let season = "";
  let capturedAt = "";

  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const monthIdx = d.getMonth();
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      monthName = months[monthIdx];
      capturedAt = `${monthName} ${d.getFullYear()}`;

      if (monthIdx >= 2 && monthIdx <= 4) {
        season = "Spring (Pre-Monsoon)";
      } else if (monthIdx >= 5 && monthIdx <= 7) {
        season = "Summer (Monsoon)";
      } else if (monthIdx >= 8 && monthIdx <= 10) {
        season = "Autumn (Post-Monsoon)";
      } else {
        season = "Winter (Dormant / Cool Season)";
      }
    }
  }

  const climateZone = locationStr ? locationStr.trim() : "";

  if (!monthName && !climateZone) {
    return undefined;
  }

  return {
    season: season || undefined,
    month: monthName || undefined,
    climate_zone: climateZone || undefined,
    captured_at: capturedAt || undefined,
    provided_by_user: true,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      image,
      thumbnail,
      language = "English",
      location,
      userId,
      observationDate,
      observationLocation,
    } = body;

    const agronomicContext = deriveAgronomicContext(observationDate, observationLocation);

    if (!image) {
      return NextResponse.json(
        { error: "Image data (base64 or data URL) is required" },
        { status: 400 }
      );
    }

    const isPresetUrl = image.startsWith("http://") || image.startsWith("https://");
    let diagnosis: DiagnosisResult | null = null;
    let activeModel = isPresetUrl ? "Preset Knowledge Base" : "";

    if (isPresetUrl) {
      // INSTANT SUB-MILLISECOND PATH for Quick Test Samples:
      // Return accurate pre-verified diagnosis immediately without slow network image downloads
      diagnosis = getPresetDiagnosis(image, language);
    } else {
      // User uploaded custom leaf picture from camera or file picker
      let mimeType = "image/jpeg";
      let base64Data = image;

      if (image.startsWith("data:")) {
        const parts = image.split(",");
        const match = parts[0].match(/:(.*?);/);
        if (match) {
          mimeType = match[1];
        }
        base64Data = parts[1];
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== "your_gemini_api_key_here") {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: { timeout: 45000 },
          });

          const languagePrompt = `Analyze this image carefully. The requested language is ${language}.

CRITICAL VERIFICATION:
1. First, check if the photo contains a plant, tree, crop, leaf, flower, vegetable, fruit, farm field, or agricultural harvest.
2. If the photo is NOT agricultural (for example: a human person, selfie, face, animal, pet, electronic device, computer, phone, vehicle, car, indoor room, furniture, or random non-plant object):
   - You MUST set "is_plant_or_crop": false.
   - In "rejection_reason", write a clear, polite explanation in ${language} (using everyday words) explaining what kind of non-plant subject was detected and asking the user to upload a clear photo of their plant leaf, crop, or harvest.
3. If the photo IS a plant, leaf, crop, or harvest:
   - Set "is_plant_or_crop": true.
   - Set "rejection_reason": "".
   - Provide an accurate diagnosis of the plant health or disease using simple, practical words.

LANGUAGE REQUIREMENT:
- If Urdu, use simple everyday conversational Urdu (روزمرہ کی آسان اور عام فہم اردو).
- If English, keep sentences short and clear. If Hindi, use simple Bolchaal Hindi.`;

          let contextPrompt = "";
          if (agronomicContext) {
            const contextItems: string[] = [];
            if (agronomicContext.month) contextItems.push(`Month of Photo: ${agronomicContext.month}`);
            if (agronomicContext.season) contextItems.push(`Season: ${agronomicContext.season}`);
            if (agronomicContext.climate_zone) contextItems.push(`Regional Agricultural Zone: ${agronomicContext.climate_zone}`);
            if (contextItems.length > 0) {
              contextPrompt = `\n\nFIELD OBSERVATION TIMING & REGION (Provided by Farmer):\n${contextItems.join(" | ")}\n*Agronomic Analysis Guideline:* Consider this seasonal and regional climate timing when evaluating pathogen viability, typical disease emergence, and weather vulnerabilities for this time of year.`;
            }
          }

          // Active Gemini 3 models per AGENTS.md catalog: gemini-3.8-flash (Primary), gemini-3.6-flash, gemini-3.5-flash-lite, gemini-flash-latest
          const candidateModels = [
            "gemini-3.8-flash",
            "gemini-3.6-flash",
            "gemini-3.5-flash-lite",
            "gemini-flash-latest",
            "gemini-3.1-flash-lite",
          ];

          for (const modelName of candidateModels) {
            try {
              const generatePromise = ai.models.generateContent({
                model: modelName,
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        inlineData: {
                          mimeType: mimeType,
                          data: base64Data,
                        },
                      },
                      {
                        text: languagePrompt + contextPrompt,
                      },
                    ],
                  },
                ],
                config: {
                  systemInstruction: `You are an expert plant doctor and agricultural advisor helper for AgriShield AI.
FIRST: Carefully verify whether the image contains a plant, crop, leaf, vegetable, fruit, or agricultural harvest.
- If it is NOT a plant or crop (e.g., human, face, selfie, animal, car, electronics, room, furniture), you MUST set is_plant_or_crop to false.
- In rejection_reason, politely tell the farmer/user what was detected and ask for a clear photo of a plant or crop.
Severity must strictly be one of: "Low", "Moderate", or "Critical".`,
                  responseMimeType: "application/json",
                  responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                      is_plant_or_crop: {
                        type: Type.BOOLEAN,
                        description: "True if image contains a plant, crop, leaf, fruit, vegetable, or agricultural harvest. False if person, animal, vehicle, electronics, or non-plant object.",
                      },
                      rejection_reason: {
                        type: Type.STRING,
                        description: "Friendly explanation in the requested language if is_plant_or_crop is false.",
                      },
                      crop_name: { type: Type.STRING },
                      scientific_name: { type: Type.STRING },
                      condition_detected: { type: Type.STRING },
                      confidence_score: { type: Type.NUMBER },
                      severity: {
                        type: Type.STRING,
                        enum: ["Low", "Moderate", "Critical"],
                      },
                      symptoms: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      treatment: {
                        type: Type.OBJECT,
                        properties: {
                          immediate_action: { type: Type.STRING },
                          organic_remedy: { type: Type.STRING },
                          chemical_alternative: { type: Type.STRING },
                        },
                        required: ["immediate_action", "organic_remedy", "chemical_alternative"],
                      },
                      prevention_tips: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      climate_impact_warning: { type: Type.STRING },
                    },
                    required: [
                      "is_plant_or_crop",
                      "crop_name",
                      "scientific_name",
                      "condition_detected",
                      "confidence_score",
                      "severity",
                      "symptoms",
                      "treatment",
                      "prevention_tips",
                      "climate_impact_warning",
                    ],
                  },
                },
              });

              const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("AI generation timeout (45s)")), 45000)
              );

              const response = await Promise.race([generatePromise, timeoutPromise]);
              if (response.text) {
                activeModel = modelName;
                console.log(`Diagnosis generated successfully with model: ${modelName}`);
                diagnosis = JSON.parse(response.text);
                break;
              }
            } catch (modelErr: any) {
              console.warn(`Model ${modelName} error:`, modelErr?.message || modelErr);
            }
          }
        } catch (genAiErr) {
          console.warn("AI generation error:", genAiErr);
        }
      }

      // If the image was verified by AI as NOT being a plant or agricultural crop:
      if (diagnosis && diagnosis.is_plant_or_crop === false) {
        const rejectionMsg =
          diagnosis.rejection_reason ||
          (language === "Urdu"
            ? "یہ تصویر کسی فصل، پودے یا پتے کی معلوم نہیں ہوتی۔ براہِ کرم اپنے پودے، پتے یا زرعی پیداوار کی صاف تصویر اپلوڈ کریں۔"
            : language === "Hindi"
              ? "यह तस्वीर किसी पौधे या फसल की नहीं लगती। कृपया अपने पौधे या पत्ते की साफ तस्वीर अपलोड करें।"
              : language === "Spanish"
                ? "Esta foto no parece ser una planta o cultivo. Por favor suba una foto clara de su planta o cosecha."
                : "This photo does not appear to be a crop, plant leaf, or agricultural harvest. Please upload a clear photo of your plant or crop.");

        // CRITICAL: DO NOT save to shared scans store or Firestore!
        return NextResponse.json(
          {
            success: false,
            isPlantOrCrop: false,
            error: rejectionMsg,
            rejectionReason: rejectionMsg,
          },
          { status: 422 }
        );
      }

      // If all AI models were 503 overloaded, rate-limited, or timed out on an uploaded image:
      // DO NOT return fake tomato preset data! Tell the user honestly that the models are experiencing high demand.
      if (!diagnosis) {
        console.warn("AI service currently experiencing 503 high demand or network timeout across models.");
        const highDemandMsg =
          language === "Urdu"
            ? "اس وقت اے آئی سروس پر زیادہ لوڈ (High Demand) ہے۔ پودے کو چیک نہیں کیا جا سکا۔ براہِ کرم چند لمحے بعد دوبارہ کوشش کریں۔"
            : language === "Hindi"
              ? "एआई सेवा पर इस समय अत्यधिक लोड (High Demand) है। कृपया कुछ क्षण बाद पुनः प्रयास करें।"
              : language === "Spanish"
                ? "Los modelos de IA están experimentando alta demanda en este momento. Por favor intente de nuevo en unos momentos."
                : "Gemini AI models are currently experiencing high demand. Please wait a moment and try again.";

        return NextResponse.json(
          {
            success: false,
            error: highDemandMsg,
            isHighDemand: true,
          },
          { status: 503 }
        );
      }
    }

    // Ensure is_plant_or_crop is true for accepted scans
    diagnosis.is_plant_or_crop = true;

    // Prepare complete scan record with valid full image and thumbnail data URLs
    const scanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const scanThumbnail = thumbnail || image;

    const newScanRecord: ScanRecord = {
      ...diagnosis,
      id: scanId,
      imageUrl: image,
      imageThumbnail: scanThumbnail,
      language,
      createdAt: new Date().toISOString(),
      agronomic_context: agronomicContext || undefined,
      location: {
        city: agronomicContext?.climate_zone || "Agricultural District",
        country: "Regional Station",
      },
      userId: userId || "guest_farmer",
    };

    // Save to shared in-memory store ONLY FOR VALID CROPS
    addSharedScan(newScanRecord);

    // Fire-and-forget non-blocking background write to Firestore if available
    const adminDb = getAdminDb();
    if (adminDb) {
      const firestorePayload = { ...newScanRecord };
      // Ensure payload respects Firestore's 1MB document limit
      if (firestorePayload.imageUrl && firestorePayload.imageUrl.length > 700000) {
        firestorePayload.imageUrl = firestorePayload.imageThumbnail;
      }
      adminDb
        .collection("scans")
        .doc(scanId)
        .set(firestorePayload)
        .catch((firestoreErr) => {
          console.warn("Background Firestore write skipped:", firestoreErr);
        });
    }

    // Return instant diagnosis to user immediately!
    return NextResponse.json({
      success: true,
      isPlantOrCrop: true,
      scanId,
      diagnosis: {
        ...diagnosis,
        agronomic_context: agronomicContext || undefined,
      },
      modelUsed: activeModel || "gemini-3.8-flash",
    });
  } catch (error: any) {
    console.error("Diagnosis error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Internal diagnosis failure",
      },
      { status: 500 }
    );
  }
}

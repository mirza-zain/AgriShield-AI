import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { getAdminDb } from "@/lib/firebase";
import { DiagnosisResult, ScanRecord } from "@/lib/types";

// In-memory fallback cache for scans if Firestore credentials are not set during local testing
const fallbackScans: ScanRecord[] = [
  {
    id: "sample-scan-1",
    crop_name: "Tomato (Solanum lycopersicum)",
    scientific_name: "Phytophthora infestans",
    condition_detected: "Late Blight",
    confidence_score: 0.94,
    severity: "Critical",
    symptoms: [
      "Dark water-soaked lesions on leaves",
      "White fungal mycelium under humid conditions",
      "Rapid browning and collapse of foliage"
    ],
    treatment: {
      immediate_action: "Prune and destroy infected leaves immediately; do not compost.",
      organic_remedy: "Apply copper octanoate or Bacillus subtilis spray every 5-7 days.",
      chemical_alternative: "Mancozeb or Chlorothalonil systemic fungicide."
    },
    prevention_tips: [
      "Avoid overhead sprinkler irrigation",
      "Ensure proper plant spacing for airflow",
      "Rotate crops annually away from Solanaceae family"
    ],
    climate_impact_warning: "Prolonged rainfall and temperatures between 15°C–22°C accelerate sporulation by 300%.",
    imageThumbnail: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=400&q=80",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    location: {
      latitude: 31.5204,
      longitude: 74.3587,
      city: "Lahore",
      country: "Pakistan"
    }
  },
  {
    id: "sample-scan-2",
    crop_name: "Grapevine (Vitis vinifera)",
    scientific_name: "Erysiphe necator",
    condition_detected: "Powdery Mildew",
    confidence_score: 0.89,
    severity: "Moderate",
    symptoms: [
      "White powdery coating on upper leaf surface",
      "Curling of younger leaves",
      "Stunted vine growth"
    ],
    treatment: {
      immediate_action: "Remove heavily shaded dense foliage to maximize sunlight exposure.",
      organic_remedy: "Potassium bicarbonate spray (3g/L) or neem oil emulsion.",
      chemical_alternative: "Myclobutanil or sulfur dust (avoid sulfur when temp > 32°C)."
    },
    prevention_tips: [
      "Canopy management for aeration",
      "Select mildew-resistant grape rootstocks",
      "Apply preventative silica foliar sprays"
    ],
    climate_impact_warning: "High relative humidity combined with warm, dry days facilitates rapid conidial dispersal.",
    imageThumbnail: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=400&q=80",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      city: "Delhi",
      country: "India"
    }
  }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, language = "English", location, userId } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Image data (base64 or data URL) is required" },
        { status: 400 }
      );
    }

    // Clean base64 string and extract mime type
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (image.startsWith("data:")) {
      const parts = image.split(",");
      const match = parts[0].match(/:(.*?);/);
      if (match) {
        mimeType = match[1];
      }
      base64Data = parts[1];
    } else if (image.startsWith("http://") || image.startsWith("https://")) {
      // If client sent an image URL (such as our preloaded sample buttons), fetch it server-side
      try {
        const response = await fetch(image);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        base64Data = buffer.toString("base64");
        const contentType = response.headers.get("content-type");
        if (contentType) mimeType = contentType;
      } catch (err) {
        console.error("Failed to fetch image from URL:", err);
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let diagnosis: DiagnosisResult;

    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      const ai = new GoogleGenAI({ apiKey });

      const languagePrompt = `Analyze this plant leaf photo. The user wants the response in ${language}.
CRITICAL LANGUAGE REQUIREMENT:
- Use very simple, friendly, everyday words that a common farmer or gardener can easily understand.
- DO NOT use difficult academic jargon, overly formal grammar, or heavy textbook words.
- If the language is Urdu, use simple everyday conversational Urdu (روزمرہ کی آسان اور عام فہم اردو) with common spoken words (like 'ٹماٹر کا پودا', 'پتوں پر داغ', 'نیم کا تیل', 'فوری بچاؤ').
- If the language is English, use simple plain English (short sentences, simple words).
- If Hindi, use simple Bolchaal Hindi.
- Keep the scientific name standard, but write the common name and disease in clear, everyday everyday language.`;

      // Auto-fallback model list starting with active fast vision models
      const candidateModels = [
        "gemini-3.5-flash-lite",
        "gemini-3.8-flash",
        "gemini-flash-latest",
        "gemini-3.5-flash",
      ];

      let lastError: any = null;
      let responseText = "";

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
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
                    text: languagePrompt,
                  },
                ],
              },
            ],
            config: {
              systemInstruction: `You are a friendly plant doctor helper for everyday farmers.
Explain what is wrong with the plant using clear, simple, practical everyday language.
Avoid complex biological jargon.
Severity must strictly be one of: "Low", "Moderate", or "Critical".
Provide simple practical steps:
- immediate_action: What the farmer should do right now today in simple words.
- organic_remedy: Natural home remedy or safe spray they can make or buy cheaply.
- chemical_alternative: Common shop spray option if needed.
- climate_impact_warning: Simple explanation of how current heat, rain, or humidity makes it spread.`,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  crop_name: { type: Type.STRING, description: "Common name of the crop/plant" },
                  scientific_name: { type: Type.STRING, description: "Scientific Latin binomial or causal pathogen name" },
                  condition_detected: { type: Type.STRING, description: "Identified disease, pest, nutrient deficiency, or Healthy" },
                  confidence_score: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0" },
                  severity: {
                    type: Type.STRING,
                    enum: ["Low", "Moderate", "Critical"],
                    description: "Severity level of the infection"
                  },
                  symptoms: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Key visible symptoms observed on the leaf"
                  },
                  treatment: {
                    type: Type.OBJECT,
                    properties: {
                      immediate_action: { type: Type.STRING, description: "Urgent physical step the farmer should take today" },
                      organic_remedy: { type: Type.STRING, description: "Eco-friendly, bio-pesticide or botanical remedy" },
                      chemical_alternative: { type: Type.STRING, description: "Standard chemical fungicide/pesticide alternative" },
                    },
                    required: ["immediate_action", "organic_remedy", "chemical_alternative"],
                  },
                  prevention_tips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Proactive agricultural practices to prevent recurrence"
                  },
                  climate_impact_warning: {
                    type: Type.STRING,
                    description: "How local climate, rainfall, or heatwaves affect disease spread"
                  },
                },
                required: [
                  "crop_name",
                  "scientific_name",
                  "condition_detected",
                  "confidence_score",
                  "severity",
                  "symptoms",
                  "treatment",
                  "prevention_tips",
                  "climate_impact_warning"
                ],
              },
            },
          });

          if (response.text) {
            responseText = response.text;
            break;
          }
        } catch (mErr) {
          console.warn(`Model ${modelName} failed or busy, trying next candidate...`, mErr);
          lastError = mErr;
        }
      }

      if (!responseText && lastError) {
        throw lastError;
      }

      diagnosis = JSON.parse(responseText);
    } else {
      // Mock agronomic analysis for hackathon demonstrations when API key is pending
      diagnosis = {
        crop_name: language === "Urdu" ? "ٹماٹر (Tomato)" : language === "Hindi" ? "टमाटर (Tomato)" : language === "Spanish" ? "Tomate (Tomato)" : "Tomato (Solanum lycopersicum)",
        scientific_name: "Alternaria solani",
        condition_detected: language === "Urdu" ? "ارلی بلائیٹ (Early Blight)" : language === "Hindi" ? "अगेती झुलसा (Early Blight)" : language === "Spanish" ? "Tizón Temprano (Early Blight)" : "Early Blight",
        confidence_score: 0.92,
        severity: "Moderate",
        symptoms: [
          language === "Urdu" ? "پتوں پر مرتکز دائروں والے بھورے دھبے" : language === "Hindi" ? "पत्तियों पर संकेंद्रित छल्लों वाले भूरे धब्बे" : language === "Spanish" ? "Manchas marrones con anillos concéntricos" : "Concentric brown rings forming target-like patterns on lower leaves",
          language === "Urdu" ? "نچلے پتوں کا پیلا پڑنا اور جھڑنا" : language === "Hindi" ? "निचली पत्तियों का पीला पड़ना" : language === "Spanish" ? "Amarillamiento y senescencia de hojas inferiores" : "Yellowing of surrounding tissue and premature defoliation",
          language === "Urdu" ? "پھپھوندی کے پھیلاؤ کے اثرات" : language === "Hindi" ? "तने पर घाव के निशान" : language === "Spanish" ? "Lesiones en tallos y peciolos" : "Collar rot lesions along main stems"
        ],
        treatment: {
          immediate_action: language === "Urdu" ? "متاثرہ پتوں کو فوری طور پر کاٹ کر جلا دیں۔" : language === "Hindi" ? "संक्रमित पत्तियों को तुरंत काटकर नष्ट करें।" : language === "Spanish" ? "Podar y quemar las hojas infectadas de inmediato." : "Prune and destroy infected lower leaves. Sanitize pruning shears with 70% alcohol.",
          organic_remedy: language === "Urdu" ? "نیم کے تیل کا سپرے (5 ملی لیٹر فی لیٹر پانی) یا تانبے کا محلول۔" : language === "Hindi" ? "नीम का तेल (5 मिली/लीटर) या ट्राइकोडर्मा का छिड़काव करें।" : language === "Spanish" ? "Aplicar emulsión de aceite de neem o solución de cobre orgánico." : "Foliar spray with cold-pressed Neem Oil (5ml/L water) or Trichoderma harzianum bio-fungicide.",
          chemical_alternative: language === "Urdu" ? "مینکوزیب (Mancozeb) 2.5 گرام فی لیٹر پانی۔" : language === "Hindi" ? "मैनकोजेब (Mancozeb) 2.5 ग्राम प्रति लीटर पानी।" : language === "Spanish" ? "Mancozeb o Clorotalonil al 0.2%." : "Mancozeb 75 WP (2.5g/L) or Chlorothalonil every 7-10 days."
        },
        prevention_tips: [
          language === "Urdu" ? "پودوں کے درمیان مناسب فاصلہ رکھیں تاکہ ہوا کا گزر ہو سکے" : language === "Hindi" ? "उचित जल निकासी और पौधों के बीच दूरी बनाए रखें" : language === "Spanish" ? "Espaciar adecuadamente las plantas para aireación" : "Ensure 60cm row spacing to allow solar penetration and airflow",
          language === "Urdu" ? "ڈرپ اریگیشن استعمال کریں اور پتوں پر پانی نہ ڈالیں" : language === "Hindi" ? "ड्रिप सिंचाई का प्रयोग करें, पत्तों पर पानी न डालें" : language === "Spanish" ? "Usar riego por goteo evitando mojar el follaje" : "Use drip irrigation instead of overhead watering to keep foliage dry",
          language === "Urdu" ? "فصلوں کی باری باری کاشت کریں" : language === "Hindi" ? "गैर-सोलनेसी फसलों के साथ फसल चक्र अपनाएं" : language === "Spanish" ? "Rotar cultivos con leguminosas o cereales" : "Rotate fields away from nightshade crops for at least 2 seasons"
        ],
        climate_impact_warning: language === "Urdu" ? "درجہ حرارت 24-29 ڈگری اور زیادہ نمی بیماری کو تیزی سے پھیلاتی ہے۔" : language === "Hindi" ? "24-29 डिग्री तापमान और उच्च आर्द्रता रोग को तेजी से बढ़ाती है।" : language === "Spanish" ? "Temperaturas de 24°C a 29°C con humedad alta aceleran la esporulación." : "Humid microclimates and heavy morning dew between 24°C–29°C exponentially accelerate fungal spore germination."
      };
    }

    // Prepare complete scan record for persistence
    const scanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newScanRecord: ScanRecord = {
      ...diagnosis,
      id: scanId,
      imageThumbnail: image.startsWith("http") ? image : `data:${mimeType};base64,${base64Data.slice(0, 500)}...`,
      language,
      createdAt: new Date().toISOString(),
      location: location || {
        latitude: 31.5204,
        longitude: 74.3587,
        city: "Agricultural District",
        country: "Regional Station"
      },
      userId: userId || "guest_farmer",
    };

    // Save into Firestore database ('scans' collection)
    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        await adminDb.collection("scans").doc(scanId).set(newScanRecord);
      } catch (firestoreErr) {
        console.warn("Firestore write skipped/failed, adding to in-memory history:", firestoreErr);
        fallbackScans.unshift(newScanRecord);
      }
    } else {
      fallbackScans.unshift(newScanRecord);
    }

    return NextResponse.json({
      success: true,
      scanId,
      diagnosis,
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


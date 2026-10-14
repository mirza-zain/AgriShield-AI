import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ClimateAdvisoryResult } from "@/lib/types";

// Maximum duration for Next.js route handler to allow thinking models to reason
export const maxDuration = 60;

// Deterministic rule-based agronomic advisory for offline / rate-limit fallback
function getRuleBasedClimateAdvisory(
  temperature: number,
  humidity: number,
  rainProb: number,
  windSpeed: number,
  cropName: string,
  language: string,
  pastWeekRainfallMm?: number,
  pastWeekAvgHumidity?: number,
  consecutiveDampDays?: number
): ClimateAdvisoryResult {
  const isUrdu = language === "Urdu";
  const isHindi = language === "Hindi";
  const isSpanish = language === "Spanish";

  const targetCrop = cropName || (isUrdu ? "فصلیں" : isHindi ? "फसलें" : isSpanish ? "Cultivos" : "Crops");

  // Calculate agronomic pathology risk score (0-100)
  let riskScore = 20;
  let riskLevel: "Low" | "Moderate" | "High" | "Severe" = "Low";

  const isFungalSweetSpot = humidity >= 70 && temperature >= 18 && temperature <= 30;
  const isHeatStress = temperature >= 35;
  const isRainRisk = rainProb >= 50;

  if (isFungalSweetSpot) riskScore += 45;
  if (isHeatStress) riskScore += 35;
  if (isRainRisk) riskScore += 30;
  if (humidity > 85) riskScore += 15;
  if (pastWeekRainfallMm !== undefined && pastWeekRainfallMm > 15) riskScore += 15;
  if (consecutiveDampDays !== undefined && consecutiveDampDays >= 3) riskScore += 15;
  if (pastWeekAvgHumidity !== undefined && pastWeekAvgHumidity >= 75) riskScore += 10;

  riskScore = Math.min(100, Math.max(10, riskScore));

  if (riskScore >= 75) riskLevel = "Severe";
  else if (riskScore >= 55) riskLevel = "High";
  else if (riskScore >= 35) riskLevel = "Moderate";
  else riskLevel = "Low";

  const ongoingImpactUrdu = pastWeekRainfallMm !== undefined
    ? `گزشتہ ہفتے ${pastWeekRainfallMm} ملی میٹر بارش اور ${pastWeekAvgHumidity ?? humidity} فیصد اوسط نمی کی وجہ سے کھیت میں نمی اور فنگس کے جراثیم جمع ہو چکے ہیں، اس لیے فصل کو جھلساؤ سے بچانا ضروری ہے۔`
    : `گزشتہ دنوں کی مسلسل نمی کی وجہ سے پودوں میں بیماریوں کے جراثیم پنپنے کا خطرہ موجود ہے۔`;

  const ongoingImpactHindi = pastWeekRainfallMm !== undefined
    ? `पिछले 7 दिनों में ${pastWeekRainfallMm} मिमी बारिश और ${pastWeekAvgHumidity ?? humidity}% औसत नमी के कारण मिट्टी और पत्तों पर फफूंद का दबाव बढ़ गया है।`
    : `पिछले दिनों की लगातार नमी से फसलों में बीमारी के संक्रमण का खतरा बना हुआ है।`;

  const ongoingImpactSpanish = pastWeekRainfallMm !== undefined
    ? `Durante los últimos 7 días, ${pastWeekRainfallMm}mm de lluvia y una humedad promedio del ${pastWeekAvgHumidity ?? humidity}% acumularon esporas e hidratación en el follaje.`
    : `La humedad acumulada en los días previos mantiene la presión de inóculo sobre el cultivo.`;

  const ongoingImpactEnglish = pastWeekRainfallMm !== undefined
    ? `Over the past 7 days, ${pastWeekRainfallMm}mm of cumulative rainfall and ${pastWeekAvgHumidity ?? humidity}% average humidity have saturated topsoil and created a prime incubation window for fungal spores.`
    : `Sustained ambient dampness over recent days has elevated latent pathogen pressure in the canopy.`;

  if (isFungalSweetSpot) {
    if (isUrdu) {
      return {
        risk_level: riskLevel,
        risk_score: riskScore,
        headline: `${targetCrop} کے لیے زیادہ نمی اور پھپھوندی کا الرٹ`,
        primary_disease_risk: "پتوں کے دھبے، جھلساؤ (Blight)، اور سفوفی پھپھوندی (Powdery Mildew)",
        action_today: "پتوں کے نچلے حصے کا معائنہ کریں۔ پودوں کے درمیان ہوا کا گزر بحال رکھیں اور شام کو پانی نہ دیں۔",
        spray_timing_advice: "دھوپ نکلنے پر سپرے کریں۔ بارش کے دوران سپرے ضائع ہو جائے گا۔",
        irrigation_advice: "کھیت میں کھڑا پانی فوری نکالیں، صرف ضرورت کے مطابق صبح کے وقت پانی دیں۔",
        ongoing_climate_impact: ongoingImpactUrdu,
        spoken_script: pastWeekRainfallMm !== undefined && pastWeekRainfallMm > 10
          ? `سلام کسان بھائی۔ گزشتہ ہفتے ${pastWeekRainfallMm} ملی میٹر بارش اور آج ${humidity} فیصد نمی کی وجہ سے فنگس کا شدید خطرہ ہے۔ آج پتوں کا معائنہ کریں اور کھیت میں پانی کھڑا نہ ہونے دیں۔`
          : `سلام کسان بھائی۔ ہوا میں نمی ${humidity} فیصد ہے جو پھپھوندی کی بیماریوں کو بڑھاتی ہے۔ آج پتوں کے نچلے حصے دیکھیں اور کھیت میں پانی کھڑا نہ ہونے دیں۔`,
      };
    }
    if (isHindi) {
      return {
        risk_level: riskLevel,
        risk_score: riskScore,
        headline: `${targetCrop} के लिए उच्च नमी और फफूंद का खतरा`,
        primary_disease_risk: "पत्ती धब्बा, झुलसा (Blight), और फफूंद रोग",
        action_today: "पत्तियों के नीचे जांचें। पौधों के बीच हवा का प्रवाह रखें और शाम को सिंचाई से बचें।",
        spray_timing_advice: "धूप निकलने पर ही स्प्रे करें। बारिश से ठीक पहले स्प्रे न करें।",
        irrigation_advice: "खेत से अतिरिक्त पानी निकालें, केवल सुबह के समय हल्की सिंचाई करें।",
        ongoing_climate_impact: ongoingImpactHindi,
        spoken_script: `नमस्ते किसान भाई। हवा में नमी ${humidity} प्रतिशत है जो फफूंद रोग फैला सकती है। आज पत्तियों के नीचे जांच करें और खेत में पानी न रुकने दें।`,
      };
    }
    if (isSpanish) {
      return {
        risk_level: riskLevel,
        risk_score: riskScore,
        headline: `Alerta de Humedad y Hongos para ${targetCrop}`,
        primary_disease_risk: "Tizón tardío, manchas foliares y mildiú polvoso",
        action_today: "Inspeccione el envés de las hojas y mejore la ventilación entre surcos.",
        spray_timing_advice: "Aplique tratamientos foliares con sol matutino; evite antes de la lluvia.",
        irrigation_advice: "Evite encharcamientos; riegue temprano por goteo.",
        ongoing_climate_impact: ongoingImpactSpanish,
        spoken_script: `Hola agricultor. La humedad del ${humidity} por ciento favorece hongos como tizón. Revise hoy sus hojas y evite acumulación de agua.`,
      };
    }
    return {
      risk_level: riskLevel,
      risk_score: riskScore,
      headline: `High Humidity & Fungal Pathogen Alert for ${targetCrop}`,
      primary_disease_risk: "Leaf spot, Blight (Phytophthora), and Powdery Mildew spores",
      action_today: "Inspect undersides of leaves and ensure good airflow between crop rows. Avoid overhead evening watering.",
      spray_timing_advice: "Apply protective organic sprays during clear morning sun; avoid right before rainfall.",
      irrigation_advice: "Ensure field drainage furrows are clear; reduce watering frequency.",
      ongoing_climate_impact: ongoingImpactEnglish,
      spoken_script: pastWeekRainfallMm !== undefined && pastWeekRainfallMm > 10
        ? `Farmer alert: With ${pastWeekRainfallMm}mm of rain this past week and current ${humidity} percent humidity, fungal spores are active. Inspect leaf undersides and prevent standing furrow water.`
        : `Hello. Relative humidity is ${humidity} percent, which accelerates fungal spores. Check leaf undersides today and prevent standing water in furrows.`,
    };
  }

  if (isHeatStress) {
    if (isUrdu) {
      return {
        risk_level: riskLevel,
        risk_score: riskScore,
        headline: `${targetCrop} کے لیے شدید گرمی اور لو کا انتباہ`,
        primary_disease_risk: "پھولوں کا گرنا، پتوں کا سوکھنا اور مائٹس (Mites) کا حملہ",
        action_today: "پودوں کی جڑوں کے گرد خشک گھاس یا پرالی بچھا کر نمی محفوظ کریں۔",
        spray_timing_advice: "دوپہر کی تیز دھوپ میں ہرگز سپرے نہ کریں۔ صرف سورج غروب ہونے کے بعد سپرے کریں۔",
        irrigation_advice: "صبح سویرے سورج نکلنے سے پہلے ہلکا پانی لگائیں۔",
        ongoing_climate_impact: ongoingImpactUrdu,
        spoken_script: `کسان بھائی، درجہ حرارت ${temperature} ڈگری تک پہنچ چکا ہے۔ صبح جلدی پانی لگائیں اور دوپہر میں کوئی کیمیکل سپرے نہ کریں۔`,
      };
    }
    return {
      risk_level: riskLevel,
      risk_score: riskScore,
      headline: `Thermal Heat Stress & Dehydration Warning for ${targetCrop}`,
      primary_disease_risk: "Blossom drop, leaf scorch, and red spider mites outbreak",
      action_today: "Apply straw mulch around crop root zones to reduce moisture evaporation by 40%.",
      spray_timing_advice: "Never spray chemicals during peak midday heat; spray strictly at sunset.",
      irrigation_advice: "Irrigate early in the morning before 8:00 AM to prevent root scalding.",
      ongoing_climate_impact: ongoingImpactEnglish,
      spoken_script: `Farmer alert: Temperatures around ${temperature} degrees Celsius will cause heat stress. Irrigate early morning and avoid any midday foliar spraying.`,
    };
  }

  // Favorable / Normal weather
  if (isUrdu) {
    return {
      risk_level: "Low",
      risk_score: 25,
      headline: `${targetCrop} کے لیے سازگار اور متوازن موسم`,
      primary_disease_risk: "بیماری کا خطرہ کم ہے، احتیاطی نگرانی جاری رکھیں",
      action_today: "کھیت کا معمول کا معائنہ کریں اور جڑی بوٹیاں تلف کریں۔",
      spray_timing_advice: "معمول کے حفاظتی نیم تیل کا سپرے کرنے کے لیے موسم نہایت موزوں ہے۔",
      irrigation_advice: "معمول کے شیڈول کے مطابق پانی دیں۔",
      ongoing_climate_impact: ongoingImpactUrdu,
      spoken_script: `آج کا موسم ${targetCrop} کے لیے بہترین ہے۔ معمول کے مطابق دیکھ بھال کریں اور پودوں کو صاف رکھیں۔`,
    };
  }

  return {
    risk_level: "Low",
    risk_score: 25,
    headline: `Favorable Growing Conditions for ${targetCrop}`,
    primary_disease_risk: "Low pathogen activity; routine preventive surveillance recommended",
    action_today: "Conduct routine field scouting and remove emerging weeds around bases.",
    spray_timing_advice: "Excellent calm weather window for preventive organic neem or bio-stimulant foliar spray.",
    irrigation_advice: "Maintain standard balanced irrigation schedule.",
    ongoing_climate_impact: ongoingImpactEnglish,
    spoken_script: `Today's microclimate conditions are favorable for ${targetCrop}. Maintain routine irrigation and field scouting.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // STRICT PRIVACY GUARANTEE:
    // Only accept raw environmental telemetry. Never accept or log user IDs, IPs, names, or GPS coordinates.
    const temperature = Number(body.temperature) || 25;
    const humidity = Number(body.humidity) || 60;
    const rainProbability = Number(body.precipitation_probability) || 0;
    const windSpeed = Number(body.wind_speed) || 10;
    const weatherCondition = String(body.weather_condition || "Clear");
    const cropName = body.crop_name ? String(body.crop_name).trim() : "";
    const language = String(body.language || "English").trim();
    const pastWeekRainfallMm = body.past_week_rainfall_mm !== undefined ? Number(body.past_week_rainfall_mm) : undefined;
    const pastWeekAvgHumidity = body.past_week_avg_humidity !== undefined ? Number(body.past_week_avg_humidity) : undefined;
    const consecutiveDampDays = body.consecutive_damp_days !== undefined ? Number(body.consecutive_damp_days) : undefined;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Deterministic Agronomic Fallback when API key is missing
      const fallbackResult = getRuleBasedClimateAdvisory(
        temperature,
        humidity,
        rainProbability,
        windSpeed,
        cropName,
        language,
        pastWeekRainfallMm,
        pastWeekAvgHumidity,
        consecutiveDampDays
      );
      console.log(`[Climate Advisory] API key not configured. Using rule-based offline engine.`);
      return NextResponse.json({ advisory: fallbackResult, source: "offline_engine", modelUsed: "rule-based-engine" });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { timeout: 45000 },
      });

      const advisorySchema: Schema = {
        type: Type.OBJECT,
        properties: {
          risk_level: {
            type: Type.STRING,
            enum: ["Low", "Moderate", "High", "Severe"],
          },
          risk_score: {
            type: Type.INTEGER,
            description: "Pathology outbreak risk score from 0 to 100",
          },
          headline: {
            type: Type.STRING,
            description: "Short punchy title in requested language",
          },
          primary_disease_risk: {
            type: Type.STRING,
            description: "Specific fungal, bacterial, or pest diseases that thrive in these exact temp/humidity conditions",
          },
          action_today: {
            type: Type.STRING,
            description: "Top priority field action the farmer must do today",
          },
          spray_timing_advice: {
            type: Type.STRING,
            description: "Safe spray timing advice considering wind, rain, and sun",
          },
          irrigation_advice: {
            type: Type.STRING,
            description: "Watering adjustment based on current moisture and rain probability",
          },
          ongoing_climate_impact: {
            type: Type.STRING,
            description: "Practical explanation of how the past 7 days of rainfall, sustained humidity, or damp conditions have built up pathogen pressure or soil saturation in the crop field.",
          },
          spoken_script: {
            type: Type.STRING,
            description: "Concise conversational audio script (2-3 sentences max) to be read aloud via TTS in the requested language, acknowledging both current weather and the past week's dampness/humidity accumulation.",
          },
        },
        required: [
          "risk_level",
          "risk_score",
          "headline",
          "primary_disease_risk",
          "action_today",
          "spray_timing_advice",
          "irrigation_advice",
          "ongoing_climate_impact",
          "spoken_script",
        ],
      };

      const systemInstruction = `You are AgriShield AI's senior agricultural pathologist and microclimate agronomy doctor.
Your goal is to protect smallholder farmers against weather-triggered crop diseases.
CRITICAL LANGUAGE RULES:
- Use simple, practical language that any farmer can understand immediately (no complex academic jargon).
- If language is "Urdu", use simple everyday conversational Urdu (روزمرہ کی عام فہم اور آسان اردو).
- If language is "Hindi", use conversational Bolchaal Hindi.
- If language is "Spanish", use friendly rural Spanish.
- If language is "English", use short, clear, direct sentences.
- Focus on practical field advice: pruning, drainage, spray timing, and irrigation.`;

      let microclimateContext = "";
      if (pastWeekRainfallMm !== undefined || pastWeekAvgHumidity !== undefined || consecutiveDampDays !== undefined) {
        microclimateContext = `
- Ongoing 7-Day Microclimate Trend:
  * Cumulative Past 7-Day Rainfall: ${pastWeekRainfallMm ?? "N/A"}mm
  * Preceding 7-Day Average Humidity: ${pastWeekAvgHumidity ?? "N/A"}%
  * Damp/Wet Incubation Days in Past Week: ${consecutiveDampDays ?? "N/A"} of 7 days
`;
      }

      const prompt = `Analyze these real-time and ongoing field microclimate parameters:
- Ambient Temperature: ${temperature}°C
- Relative Humidity: ${humidity}%
- Rain Probability: ${rainProbability}%
- Wind Speed: ${windSpeed} km/h
- Current Sky Condition: ${weatherCondition}
${microclimateContext}- Target Crop: ${cropName || "General regional crops (Vegetables, Wheat, Rice, Corn, Cotton)"}
- Target Language: ${language}

Provide a complete structured agronomic advisory:
1. "risk_level" and "risk_score": Assess current outbreak risk factoring in both today's weather AND preceding 7-day rainfall/humidity accumulation.
2. "ongoing_climate_impact": Explain clearly to the farmer how the past 7 days of rainfall (${pastWeekRainfallMm ?? 0}mm), average humidity (${pastWeekAvgHumidity ?? humidity}%), and damp days have created latent fungal/bacterial incubation or waterlogged soil conditions.
3. "spoken_script": Concise spoken advice (2-3 sentences max) mentioning both current weather and the past week's dampness/humidity build-up.`;

      const candidateModels = [
        "gemini-3.8-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash-lite",
        "gemini-flash-latest",
      ];

      for (const modelName of candidateModels) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("AI generation timeout (45s)")), 45000)
          );

          const generatePromise = ai.models.generateContent({
            model: modelName,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: advisorySchema,
              temperature: 0.3,
            },
          });

          const response = await Promise.race([generatePromise, timeoutPromise]);
          const responseText = response.text ? response.text.trim() : "";

          if (responseText) {
            console.log(`[Climate Advisory] Advisory generated successfully with model: ${modelName}`);
            const parsed = JSON.parse(responseText) as ClimateAdvisoryResult;
            return NextResponse.json({
              advisory: parsed,
              source: `model:${modelName}`,
              modelUsed: modelName,
            });
          }
        } catch (modelError: any) {
          console.warn(`Model ${modelName} advisory error:`, modelError?.message || modelError);
          // Try next model in candidateModels list
        }
      }

      // If all models failed, use deterministic fallback
      console.log("[Climate Advisory] All candidate models busy or unavailable. Using rule-based fallback advisory.");
      const fallback = getRuleBasedClimateAdvisory(
        temperature,
        humidity,
        rainProbability,
        windSpeed,
        cropName,
        language,
        pastWeekRainfallMm,
        pastWeekAvgHumidity,
        consecutiveDampDays
      );
      return NextResponse.json({ advisory: fallback, source: "rule_fallback", modelUsed: "rule-based-engine" });
    } catch (aiInitError) {
      console.error("AI client error:", aiInitError);
      console.log("[Climate Advisory] AI client init error. Using rule-based fallback advisory.");
      const fallback = getRuleBasedClimateAdvisory(
        temperature,
        humidity,
        rainProbability,
        windSpeed,
        cropName,
        language,
        pastWeekRainfallMm,
        pastWeekAvgHumidity,
        consecutiveDampDays
      );
      return NextResponse.json({ advisory: fallback, source: "rule_fallback", modelUsed: "rule-based-engine" });
    }
  } catch (error: any) {
    console.error("Error in climate-advisory route:", error);
    return NextResponse.json(
      { error: "Failed to generate climate advisory" },
      { status: 500 }
    );
  }
}

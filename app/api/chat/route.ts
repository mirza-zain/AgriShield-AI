import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    const { messages, diagnosisContext, language = "English" } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      const mockReply =
        language === "Urdu"
          ? "آپ کے پودے کے علاج کے لیے تجویز کردہ اقدامات پر عمل کریں اور پانی کا مناسب خیال رکھیں۔"
          : "Please follow the recommended treatment steps and ensure balanced irrigation for your crop.";
      return NextResponse.json({ reply: mockReply });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { timeout: 25000 },
    });

    const contextSummary = diagnosisContext
      ? `CURRENT CROP DIAGNOSIS CONTEXT:
Crop: ${diagnosisContext.crop_name} (${diagnosisContext.scientific_name || ""})
Condition Detected: ${diagnosisContext.condition_detected} (Severity: ${diagnosisContext.severity})
Immediate Action: ${diagnosisContext.treatment?.immediate_action || "N/A"}
Organic Remedy: ${diagnosisContext.treatment?.organic_remedy || "N/A"}
Chemical Alternative: ${diagnosisContext.treatment?.chemical_alternative || "N/A"}
Weather Alert: ${diagnosisContext.climate_impact_warning || "N/A"}
Why It Happened: ${diagnosisContext.disease_origin?.why_it_happened || "N/A"}`
      : "No specific diagnosis loaded yet.";

    const systemPrompt = `You are "Dr. Crop", a friendly, expert agricultural advisor helping smallholder farmers and growers in AgriShield AI.
Target Language: ${language}
${contextSummary}

GUIDELINES:
1. Smallholder Farmers are the audience: Use simple, everyday, direct language.
   - If Urdu, use simple everyday conversational Urdu (روزمرہ کی عام فہم اور آسان اردو) such as "پودے کو پانی کم دیں", "دیسی سپرے کریں", "بارش سے پہلے دوائی نہ ڈالیں". Avoid classical, bookish, Sanskritized, or Persianized vocabulary.
   - If English, keep answers concise, practical, and under 3-4 sentences.
2. Directly answer the farmer's question based on the plant diagnosis and agricultural best practices.
3. Keep responses brief, encouraging, and actionable. Do NOT repeat long disclaimers.`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
      },
    });

    const reply =
      response.text ||
      (language === "Urdu"
        ? "معاف کیجیے گا، میں اس سوال کا جواب تیار نہیں کر سکا۔ براہِ کرم دوبارہ کوشش کریں۔"
        : "I could not generate an answer right now. Please try asking again.");

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate chat response" },
      { status: 500 }
    );
  }
}


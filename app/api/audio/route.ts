import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { text, language = "English" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Active Gemini Neural TTS models per official Google AI Studio catalog
    // Modern Gemini 3 Neural TTS models only (strictly no legacy 2.5)
    const ttsModels = [
      "gemini-3.8-flash-lite-tts",
      "gemini-3.8-flash-tts",
    ];

    let audioData: string | null = null;
    let mimeType = "audio/wav";
    let lastError: any = null;

    for (const model of ttsModels) {
      try {
        // Send only the exact text to read aloud - no instructions or prompts that could be spoken
        const generatePromise = ai.models.generateContent({
          model,
          contents: text.trim(),
          config: {
            responseModalities: ["AUDIO"],
          },
        });

        // 15-second timeout per attempt to allow studio synthesis
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("TTS model timeout (15s)")), 15000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData?.data) {
          audioData = part.inlineData.data;
          if (part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          break;
        }
      } catch (err: any) {
        console.warn(`TTS Model ${model} failed, trying next:`, err?.message);
        lastError = err;
      }
    }

    if (!audioData) {
      throw lastError || new Error("Failed to synthesize speech");
    }

    return NextResponse.json({
      success: true,
      audioBase64: `data:${mimeType};base64,${audioData}`,
    });
  } catch (error: any) {
    console.error("Audio generation route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate audio" },
      { status: 500 }
    );
  }
}

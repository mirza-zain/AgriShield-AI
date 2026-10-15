import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Maximum duration for Next.js route handler to allow audio synthesis
export const maxDuration = 60;

// In-memory server-side audio cache to eliminate 100% of tokens on repeated requests
const serverAudioCache = new Map<string, { audioBase64: string; modelUsed: string }>();

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

    // Active Gemini Neural TTS models in priority order:
    // 1. gemini-3.8-flash-lite-tts (Fastest & low token usage)
    // 2. gemini-2.5-flash-preview-tts (Studio-grade natural human voice, high free-tier rate limits)
    // 3. gemini-3.8-flash-tts (High fidelity)
    // 4. gemini-3.1-flash-tts-preview (Legacy fallback)
    const ttsModels = [
      "gemini-3.8-flash-lite-tts",
      "gemini-2.5-flash-preview-tts",
      "gemini-3.8-flash-tts",
      "gemini-3.1-flash-tts-preview",
    ];

    // Clean text for speech: when speaking Urdu or Hindi, strip English/Latin parentheticals
    let spokenText = text.trim();
    if (language === "Urdu") {
      spokenText = spokenText
        .replace(/\([a-zA-Z0-9\s.,\-\/]+\)/g, "")
        .replace(/\[[a-zA-Z0-9\s.,\-\/]+\]/g, "")
        .replace(/[a-zA-Z]+/g, "")
        .replace(/\s+/g, " ")
        .trim();
    } else if (language === "Hindi") {
      spokenText = spokenText
        .replace(/\([a-zA-Z0-9\s.,\-\/]+\)/g, "")
        .replace(/\[[a-zA-Z0-9\s.,\-\/]+\]/g, "")
        .replace(/[a-zA-Z]+/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    if (!spokenText) {
      spokenText = text.trim();
    }

    // Cache hit check: returns instantaneous audio with 0 Gemini tokens!
    const cacheKey = `${language}:${spokenText.slice(0, 250)}`;
    if (serverAudioCache.has(cacheKey)) {
      const cached = serverAudioCache.get(cacheKey)!;
      console.log(`[Audio Engine] Cache HIT! Returning instant neural audio (0 tokens used)`);
      return NextResponse.json({
        success: true,
        audioBase64: cached.audioBase64,
        modelUsed: `${cached.modelUsed} (cached)`,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { timeout: 35000 },
    });

    let audioData: string | null = null;
    let mimeType = "audio/wav";
    let lastError: any = null;
    let usedModel: string = "";

    for (const model of ttsModels) {
      try {
        // Send only the clean text to read aloud - no instructions or prompts that could be spoken
        const generatePromise = ai.models.generateContent({
          model,
          contents: spokenText,
          config: {
            responseModalities: ["AUDIO"],
          },
        });

        // 35-second timeout per attempt to allow studio synthesis
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("TTS model timeout (35s)")), 35000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData?.data) {
          audioData = part.inlineData.data;
          if (part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          usedModel = model;
          console.log(`[Audio Engine] Neural TTS generated successfully with model: ${model}`);
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

    const fullAudioBase64 = `data:${mimeType};base64,${audioData}`;
    // Store in server cache so repeated requests never burn quota again
    serverAudioCache.set(cacheKey, {
      audioBase64: fullAudioBase64,
      modelUsed: usedModel,
    });

    return NextResponse.json({
      success: true,
      audioBase64: fullAudioBase64,
      modelUsed: usedModel,
    });
  } catch (error: any) {
    console.error("Audio generation route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate audio" },
      { status: 500 }
    );
  }
}

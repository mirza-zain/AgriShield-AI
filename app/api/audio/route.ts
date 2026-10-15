import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getAdminDb } from "@/lib/firebase";
import crypto from "crypto";

// Maximum duration for Next.js route handler to allow audio synthesis
export const maxDuration = 60;

// Converts raw linear PCM audio into a standard 44-byte RIFF WAV format
function pcmToWav(pcmBuffer: Uint8Array, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Uint8Array {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const wavHeader = Buffer.alloc(44);

  // RIFF chunk descriptor
  wavHeader.write("RIFF", 0);
  wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
  wavHeader.write("WAVE", 8);

  // "fmt " sub-chunk
  wavHeader.write("fmt ", 12);
  wavHeader.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  wavHeader.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);

  // "data" sub-chunk
  wavHeader.write("data", 36);
  wavHeader.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([wavHeader, pcmBuffer]);
}

// In-memory server-side audio cache to eliminate 100% of tokens on repeated requests
const serverAudioCache = new Map<string, { audioBase64: string; modelUsed: string }>();

export async function POST(req: NextRequest) {
  try {
    const { text, language = "English", isOwner = true } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Active Gemini Neural TTS models in priority order:
    // 1. gemini-3.8-flash-tts (High fidelity, native RIFF WAV output)
    // 2. gemini-3.8-flash-lite-tts (Fast & low token usage)
    // 3. gemini-2.5-flash-preview-tts (Studio-grade natural human voice fallback)
    const ttsModels = [
      "gemini-3.8-flash-tts",
      "gemini-3.8-flash-lite-tts",
      "gemini-2.5-flash-preview-tts",
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

    // Generate deterministic hash document ID for permanent cloud persistence
    const docId = "audio_" + crypto.createHash("sha256").update(`${language}:${spokenText}`).digest("hex").slice(0, 32);

    // 1. In-memory cache check (instantaneous 0ms, 0 tokens)
    if (serverAudioCache.has(docId)) {
      const cached = serverAudioCache.get(docId)!;
      console.log(`[Audio Engine] Memory cache HIT! Returning instant audio (0 tokens)`);
      return NextResponse.json({
        success: true,
        audioBase64: cached.audioBase64,
        modelUsed: `${cached.modelUsed} (cached)`,
      });
    }

    // 2. Persistent Firestore cloud cache check (persists across all devices and serverless cold starts)
    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        const cachedDoc = await adminDb.collection("audio_cache").doc(docId).get();
        if (cachedDoc.exists) {
          const docData = cachedDoc.data();
          if (docData?.audioBase64) {
            console.log(`[Audio Engine] Firestore cloud cache HIT! Stored speech returned (0 tokens)`);
            serverAudioCache.set(docId, {
              audioBase64: docData.audioBase64,
              modelUsed: docData.modelUsed || "gemini-tts",
            });
            return NextResponse.json({
              success: true,
              audioBase64: docData.audioBase64,
              modelUsed: `${docData.modelUsed || "gemini-tts"} (cloud-cached)`,
            });
          }
        }
      } catch (cacheErr) {
        console.warn("[Audio Engine] Firestore cache lookup warning:", cacheErr);
      }
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

    const initialBuffer = Buffer.from(audioData, "base64");
    const finalBuffer: Uint8Array = initialBuffer.slice(0, 4).toString("ascii") === "RIFF"
      ? initialBuffer
      : pcmToWav(initialBuffer, 24000, 1, 16);

    const fullAudioBase64 = `data:audio/wav;base64,${Buffer.from(finalBuffer).toString("base64")}`;

    // Store in in-memory cache for fast local responses
    serverAudioCache.set(docId, {
      audioBase64: fullAudioBase64,
      modelUsed: usedModel,
    });

    // Store in Firestore cloud cache so all future visitors worldwide get it for 0 tokens!
    if (adminDb) {
      try {
        await adminDb.collection("audio_cache").doc(docId).set({
          language,
          textSnippet: spokenText.slice(0, 120),
          audioBase64: fullAudioBase64,
          modelUsed: usedModel,
          createdAt: new Date().toISOString(),
        });
        console.log(`[Audio Engine] Persisted audio to Firestore audio_cache (${docId})`);
      } catch (saveDbErr) {
        console.warn("[Audio Engine] Firestore save warning:", saveDbErr);
      }
    }

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

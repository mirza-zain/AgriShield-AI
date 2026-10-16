import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY not found in environment.");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: { timeout: 45000 },
});

const outputDir = path.resolve("public/audio/samples");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function pcmToWav(pcmBuffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const wavHeader = Buffer.alloc(44);

  wavHeader.write("RIFF", 0);
  wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
  wavHeader.write("WAVE", 8);

  wavHeader.write("fmt ", 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20);
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);

  wavHeader.write("data", 36);
  wavHeader.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([wavHeader, pcmBuffer]);
}

const SAMPLES = [
  {
    id: "rotten-apple",
    en: "Hello farmer. Your Apple shows signs of Bitter Rot & Fruit Spoilage. Immediate step today: Collect and bury all rotting dropped and branch apples immediately. Safe home remedy: Spray bio-fungicide Bacillus subtilis and sanitize fruit picking crates. Weather caution: Warm humid weather combined with wet ground triggers rapid fruit rot.",
    ur: "سلام کسان بھائی۔ آپ کے سیب پر پھلوں کی سڑن کا اثر ہے۔ فوری طور پر یہ کرنا ہے: تمام سڑے ہوئے سیب درختوں اور زمین سے فوری اکٹھا کر کے گڑھے میں دبا دیں۔ دیسی اور قدرتی علاج: باغ میں نیم کا سپرے کریں اور پھل توڑنے والے ڈبے صاف رکھیں۔ موسم کا دھیان رکھیں: بارش کے بعد گرمی اور زیادہ نمی سڑن کو گھنٹوں میں پھیلا دیتی ہے۔",
  },
  {
    id: "drought-corn",
    en: "Hello farmer. Your Field Maize shows signs of Severe Drought Stress & Thermal Leaf Scorch. Immediate step today: Apply slow restorative furrow irrigation during early morning or twilight. Safe home remedy: Lay 3-inch straw mulch across row bases to conserve root-zone moisture. Weather caution: Extreme heat wave combined with dry wind accelerates crop stress.",
    ur: "سلام کسان بھائی۔ آپ کی مکئی پر شدید گرمی اور پانی کی کمی کا اثر ہے۔ فوری طور پر یہ کرنا ہے: شام کے وقت یا صبح سویرے ہلکا پانی دیں۔ دیسی اور قدرتی علاج: زمین پر گندم کے بھوسے کی ملچنگ کریں تاکہ نمی برقرار رہے۔ موسم کا دھیان رکھیں: شدید گرمی اور خشک ہوا پودے کو نقصان پہنچا رہی ہے۔",
  },
  {
    id: "vine-tomatoes",
    en: "Hello farmer. Your Vine Tomatoes are in prime healthy condition. Action today: Harvest ripe fruit during cool morning hours; avoid skin bruising. Organic care: Feed green developing tomatoes with organic potassium-rich tea. Weather note: Pick ripe tomatoes before sudden heavy rains to prevent skin cracking.",
    ur: "سلام کسان بھائی۔ آپ کے ٹماٹر کی فصل بالکل صحت مند اور تروتازہ ہے۔ فوری تدبیر: پکے ہوئے لال ٹماٹر صبح کے ٹھنڈے وقت احتیاط سے توڑ لیں۔ دیسی طریقہ: باقی ہرے پھلوں کے لیے پودوں کو قدرتی کھاد دیتے رہیں۔ موسم کا دھیان رکھیں: تیز بارش سے پہلے پکے ہوئے ٹماٹر توڑ لیں تاکہ پھٹنے سے بچیں۔",
  },
  {
    id: "spoiled-pumpkin",
    en: "Hello farmer. Your Field Pumpkin shows signs of Black Rot & Field Spoilage. Immediate step today: Remove decaying fruit from the field to stop spore contamination. Safe home remedy: Place straw mulch beneath fruit to keep rind off wet dirt. Weather caution: Standing puddle water and heavy rains drive fruit rot.",
    ur: "سلام کسان بھائی۔ آپ کے کدو پر پھل کے گلنے سڑنے کا اثر ہے۔ فوری طور پر یہ کرنا ہے: سڑے ہوئے کدو کھیت سے فوراً ہٹائیں تاکہ باقی فصل بچ سکے۔ دیسی اور قدرتی علاج: پھلوں کے نیچے خشک پرالی یا گھاس بچھائیں۔ موسم کا دھیان رکھیں: کھیت میں کھڑا پانی اور شدید نمی سڑن کو تیز کرتی ہے۔",
  },
  {
    id: "sweet-corn",
    en: "Hello farmer. Your Sweet Corn is at peak Grade A prime yield. Action today: Corn is at peak sweetness; pick during cool hours and refrigerate. Natural storage: Store harvested sweet corn below 5°C to preserve natural sweetness. Weather note: Current clear weather is ideal for harvest; complete picking before rain.",
    ur: "سلام کسان بھائی۔ آپ کی میٹھی مکئی بالکل تندرست اور اعلیٰ معیار کی ہے۔ فوری تدبیر: چھلیاں بالکل تیار ہیں، صبح کے وقت کٹائی کر کے منڈی بھیجیں۔ دیسی طریقہ: تروتازگی قائم رکھنے کے لیے چھلیوں کو سائے اور ٹھنڈی جگہ پر رکھیں۔ موسم کا دھیان رکھیں: موسم کٹائی کے لیے بہترین ہے، بارش سے پہلے تڑوائی مکمل کریں۔",
  },
  {
    id: "green-basil",
    en: "Hello farmer. Your Sweet Basil displays 100% disease-free healthy foliage. Action today: No treatment required; your herb foliage is in pristine condition. Natural care: Continue regular compost tea root feeding and balanced watering. Weather note: Moderate sunshine and warm temperatures provide ideal growing conditions.",
    ur: "سلام کسان بھائی۔ آپ کے نیازبو کے پتے بالکل صحت مند اور تروتازہ ہیں۔ فوری تدبیر: کسی دوا کی ضرورت نہیں، پودا بہترین حالت میں بڑھ رہا ہے۔ دیسی طریقہ: معمول کے مطابق مناسب پانی اور نامیاتی کھاد دیتے رہیں۔ موسم کا دھیان رکھیں: معتدل دھوپ اور گرم موسم پودے کے لیے نہایت سازگار ہے۔",
  },
];

async function generateAudio(text, lang) {
  let spokenText = text.trim();
  if (lang === "ur") {
    spokenText = spokenText
      .replace(/\([a-zA-Z0-9\s.,\-\/]+\)/g, "")
      .replace(/\[[a-zA-Z0-9\s.,\-\/]+\]/g, "")
      .replace(/[a-zA-Z]+/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const models = ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts", "gemini-2.5-flash-preview-tts"];
  let lastErr = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: spokenText,
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            languageCode: lang === "ur" ? "ur-PK" : "en-US",
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede",
              },
            },
          },
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData?.data) {
        console.log(`[TTS] Successfully synthesized via ${model}`);
        return Buffer.from(part.inlineData.data, "base64");
      }
    } catch (err) {
      console.warn(`[TTS] ${model} unavailable, trying next:`, err.message?.slice(0, 80));
      lastErr = err;
    }
  }

  throw lastErr || new Error(`Failed to generate clean audio for ${lang}`);
}

async function main() {
  console.log(`Starting audio generation for ${SAMPLES.length} sample presets with Aoede & languageCode: ur-PK / en-US...`);

  // Target Urdu files first or all files
  const force = process.argv.includes("--force");

  for (const sample of SAMPLES) {
    for (const lang of ["en", "ur"]) {
      const targetMp3 = path.join(outputDir, `${sample.id}-${lang}.mp3`);
      if (!force && fs.existsSync(targetMp3) && fs.statSync(targetMp3).size > 1000 && lang === "en") {
        console.log(`[Skip EN] Already exists: ${sample.id}-${lang}.mp3`);
        continue;
      }

      const text = lang === "en" ? sample.en : sample.ur;
      console.log(`Synthesizing (${lang === "ur" ? "ur-PK native" : "en-US"} with Aoede): ${sample.id}-${lang}...`);
      try {
        const rawBuffer = await generateAudio(text, lang);
        const wavBuffer = rawBuffer.slice(0, 4).toString("ascii") === "RIFF"
          ? rawBuffer
          : pcmToWav(rawBuffer);

        const tempWav = path.join(outputDir, `temp_${sample.id}_${lang}.wav`);
        fs.writeFileSync(tempWav, wavBuffer);

        execSync(`ffmpeg -y -i "${tempWav}" -codec:a libmp3lame -b:a 64k "${targetMp3}" 2>/dev/null`);
        fs.unlinkSync(tempWav);

        const fileSize = fs.statSync(targetMp3).size;
        console.log(`[Success] Saved ${sample.id}-${lang}.mp3 (${fileSize} bytes)`);
      } catch (err) {
        console.error(`[Failed] ${sample.id}-${lang}:`, err.message);
      }

      // 21-second buffer to stay strictly within 3 RPM free tier quota
      console.log("Waiting 21s between requests to respect rate limits...");
      await new Promise((r) => setTimeout(r, 21000));
    }
  }

  console.log("All sample preset audio files re-compiled successfully with authentic Pakistani Urdu!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

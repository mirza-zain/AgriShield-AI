// Shared Agronomic, Meteorological & Image Utility Functions

import { ClimateTelemetry } from "@/lib/types";

/**
 * Returns weather condition label and icon from WMO weather code
 */
export function getWeatherCodeDescription(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Clear Sky & Sunshine", icon: "☀️" };
  if (code === 1 || code === 2) return { condition: "Partly Cloudy", icon: "⛅" };
  if (code === 3) return { condition: "Overcast", icon: "☁️" };
  if (code === 45 || code === 48) return { condition: "Fog & High Dew", icon: "🌫️" };
  if (code >= 51 && code <= 55) return { condition: "Drizzle & Damp Foliage", icon: "🌦️" };
  if (code >= 61 && code <= 65) return { condition: "Rainfall", icon: "🌧️" };
  if (code >= 80 && code <= 82) return { condition: "Rain Showers", icon: "🌦️" };
  if (code >= 95) return { condition: "Thunderstorm Alert", icon: "⛈️" };
  return { condition: "Moderate Weather", icon: "⛅" };
}

/**
 * Calculates microclimate pathology risk index score based on humidity, temperature, and rain
 */
export function getPathologyRiskIndex(telemetry: ClimateTelemetry | null): {
  score: number;
  level: "Low" | "Moderate" | "High" | "Severe";
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  barColor: string;
  primaryConcern: string;
} {
  if (!telemetry) {
    return {
      score: 25,
      level: "Low",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-900",
      badgeBorder: "border-emerald-300",
      barColor: "bg-emerald-500",
      primaryConcern: "Microclimate parameters are calm. Routine crop scouting recommended.",
    };
  }

  const { temperature, humidity, precipitation_probability } = telemetry;
  let score = 15;

  const isFungalZone = humidity >= 70 && temperature >= 18 && temperature <= 30;
  const isHeatZone = temperature >= 35;
  const isRainZone = precipitation_probability >= 50;

  if (isFungalZone) score += 45;
  if (isHeatZone) score += 35;
  if (isRainZone) score += 30;
  if (humidity > 85) score += 15;

  score = Math.min(100, Math.max(10, score));

  if (score >= 75) {
    return {
      score,
      level: "Severe",
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-900",
      badgeBorder: "border-rose-300",
      barColor: "bg-rose-600",
      primaryConcern: isFungalZone
        ? "Critical Fungal & Spore Outbreak Window! Damp leaves and high humidity accelerate blight."
        : "Severe Heat Stress & Blossom Drop Alert. Excessive thermal load.",
    };
  }

  if (score >= 55) {
    return {
      score,
      level: "High",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-900",
      badgeBorder: "border-amber-300",
      barColor: "bg-amber-500",
      primaryConcern: isRainZone
        ? "Standing Water & Root Saturation Risk. Rain probability over 50%."
        : "Elevated Powdery Mildew and Leaf Spot Vulnerability due to humidity spikes.",
    };
  }

  if (score >= 35) {
    return {
      score,
      level: "Moderate",
      badgeBg: "bg-yellow-100",
      badgeText: "text-yellow-900",
      badgeBorder: "border-yellow-300",
      barColor: "bg-yellow-500",
      primaryConcern: "Moderate weather shift. Inspect crop canopies and maintain field aeration.",
    };
  }

  return {
    score,
    level: "Low",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-900",
    badgeBorder: "border-emerald-300",
    barColor: "bg-emerald-500",
    primaryConcern: "Optimal microclimate window. Favorable conditions for organic foliar sprays.",
  };
}

/**
 * Returns dynamic UI styling badges based on severity level and disease condition
 */
export function getSeverityBadge(severity: string, condition?: string) {
  const isHealthy =
    severity?.toLowerCase() === "low" &&
    (condition?.toLowerCase().includes("healthy") ||
      condition?.toLowerCase().includes("clean") ||
      condition?.toLowerCase().includes("prime") ||
      condition?.toLowerCase().includes("foliage") ||
      condition?.toLowerCase().includes("safe") ||
      condition?.toLowerCase().includes("صحت مند"));

  if (isHealthy) {
    return {
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dot: "bg-emerald-500",
      badge: "Healthy Crop",
      meterColor: "bg-emerald-500",
      textColor: "text-emerald-600",
    };
  }

  switch (severity?.toLowerCase()) {
    case "critical": {
      const isBadHarvest =
        condition?.toLowerCase().includes("rot") ||
        condition?.toLowerCase().includes("spoil") ||
        condition?.toLowerCase().includes("harvest") ||
        condition?.toLowerCase().includes("سڑن");
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-500",
        badge: isBadHarvest ? "Bad Harvest (Critical)" : "Critical Problem",
        meterColor: "bg-rose-500",
        textColor: "text-rose-600",
      };
    }
    case "moderate":
      return {
        bg: "bg-amber-50 text-amber-800 border-amber-200",
        dot: "bg-amber-500",
        badge: "Moderate Attention",
        meterColor: "bg-amber-500",
        textColor: "text-amber-600",
      };
    case "low":
    default:
      return {
        bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dot: "bg-emerald-500",
        badge: "Minor / Monitor",
        meterColor: "bg-emerald-500",
        textColor: "text-emerald-600",
      };
  }
}

/**
 * Client-side image compression using HTML5 canvas
 */
export function compressImageFile(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        resolve("");
        return;
      }
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

/**
 * Reads first 128KB of image where EXIF header resides to extract capture date/time
 */
export async function extractExifDateFromImageFile(file: File): Promise<{ date: string; time?: string } | null> {
  try {
    if (!file.type.startsWith("image/")) return null;
    const slice = file.slice(0, 131072);
    const arrayBuffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // 1. If JPEG (SOI: 0xFF, 0xD8), scan APP1 markers for Exif header
    if (bytes[0] === 0xff && bytes[1] === 0xd8) {
      let offset = 2;
      while (offset < bytes.length - 4) {
        if (bytes[offset] === 0xff && bytes[offset + 1] === 0xe1) {
          const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
          const app1Bytes = bytes.subarray(offset + 4, Math.min(bytes.length, offset + 2 + length));
          if (
            app1Bytes[0] === 0x45 &&
            app1Bytes[1] === 0x78 &&
            app1Bytes[2] === 0x69 &&
            app1Bytes[3] === 0x66
          ) {
            const text = new TextDecoder("latin1").decode(app1Bytes);
            const match = text.match(/\b([12]\d{3}):(0[1-9]|1[0-2]):(0[1-9]|[12]\d|3[01])(?:\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d))?\b/);
            if (match) {
              const date = `${match[1]}-${match[2]}-${match[3]}`;
              const time = match[4] && match[5] ? `${match[4]}:${match[5]}` : undefined;
              return { date, time };
            }
          }
          break;
        } else if (bytes[offset] === 0xff && (bytes[offset + 1] & 0xf0) === 0xe0) {
          const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
          offset += 2 + length;
        } else {
          offset++;
        }
      }
    }

    // 2. Scan first 64KB for standard EXIF timestamp format "YYYY:MM:DD HH:MM:SS" (covers HEIC/TIFF/WebP metadata)
    const text = new TextDecoder("latin1").decode(bytes.subarray(0, 65536));
    const fullMatch = text.match(/\b([12]\d{3}):(0[1-9]|1[0-2]):(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)\b/);
    if (fullMatch) {
      return {
        date: `${fullMatch[1]}-${fullMatch[2]}-${fullMatch[3]}`,
        time: `${fullMatch[4]}:${fullMatch[5]}`,
      };
    }
  } catch {
    // Ignore EXIF parsing failures
  }
  return null;
}


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

export interface ExifMetadataResult {
  date?: string;
  time?: string;
  latitude?: number;
  longitude?: number;
  locationLabel?: string;
}

/**
 * Robust binary parser reading JPEG APP1 / TIFF markers & Exif/GPS IFDs to extract:
 * 1. Date & Time (DateTimeOriginal, DateTimeDigitized, DateTime)
 * 2. Field GPS coordinates (GPSLatitude, GPSLongitude, GPSLatitudeRef, GPSLongitudeRef)
 */
export async function extractExifMetadata(file: File): Promise<ExifMetadataResult | null> {
  try {
    if (!file.type.startsWith("image/")) return null;
    const slice = file.slice(0, 262144); // 256KB is plenty for EXIF APP1
    const arrayBuffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    let foundDate: string | undefined;
    let foundTime: string | undefined;
    let foundLat: number | undefined;
    let foundLon: number | undefined;

    // 1. If JPEG (SOI: 0xFF, 0xD8), scan APP1 markers for Exif header
    if (bytes[0] === 0xff && bytes[1] === 0xd8) {
      let offset = 2;
      while (offset < bytes.length - 4) {
        if (bytes[offset] === 0xff && bytes[offset + 1] === 0xe1) {
          const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
          const app1Start = offset + 4;
          if (
            bytes[app1Start] === 0x45 &&
            bytes[app1Start + 1] === 0x78 &&
            bytes[app1Start + 2] === 0x69 &&
            bytes[app1Start + 3] === 0x66 &&
            bytes[app1Start + 4] === 0x00 &&
            bytes[app1Start + 5] === 0x00
          ) {
            const tiffStart = app1Start + 6;
            const isLittleEndian = bytes[tiffStart] === 0x49 && bytes[tiffStart + 1] === 0x49; // 'II'

            const read16 = (pos: number) => {
              if (pos + 1 >= bytes.length) return 0;
              return isLittleEndian
                ? bytes[pos] | (bytes[pos + 1] << 8)
                : (bytes[pos] << 8) | bytes[pos + 1];
            };

            const read32 = (pos: number) => {
              if (pos + 3 >= bytes.length) return 0;
              return isLittleEndian
                ? (bytes[pos] | (bytes[pos + 1] << 8) | (bytes[pos + 2] << 16) | (bytes[pos + 3] << 24)) >>> 0
                : ((bytes[pos] << 24) | (bytes[pos + 1] << 16) | (bytes[pos + 2] << 8) | bytes[pos + 3]) >>> 0;
            };

            const readString = (pos: number, maxLen: number) => {
              let end = pos;
              while (end < bytes.length && end < pos + maxLen && bytes[end] !== 0) {
                end++;
              }
              return new TextDecoder("ascii").decode(bytes.subarray(pos, end)).trim();
            };

            const readRational = (pos: number): number => {
              const num = read32(pos);
              const den = read32(pos + 4);
              if (den === 0) return 0;
              return num / den;
            };

            if (read16(tiffStart + 2) === 42) {
              const firstIFDOffset = read32(tiffStart + 4);
              let exifIFDOffset = 0;
              let gpsIFDOffset = 0;

              const parseIFD = (ifdOffset: number, isGps = false) => {
                if (ifdOffset <= 0 || tiffStart + ifdOffset + 2 >= bytes.length) return;
                const numEntries = read16(tiffStart + ifdOffset);
                let latRef = "N";
                let lonRef = "E";
                let latValues: number[] = [];
                let lonValues: number[] = [];

                for (let i = 0; i < numEntries; i++) {
                  const entryPos = tiffStart + ifdOffset + 2 + i * 12;
                  if (entryPos + 12 > bytes.length) break;

                  const tag = read16(entryPos);
                  const count = read32(entryPos + 4);
                  const valOrOffset = entryPos + 8;

                  if (isGps) {
                    if (tag === 0x0001) {
                      const ref = String.fromCharCode(bytes[valOrOffset]);
                      if (ref === "N" || ref === "S") latRef = ref;
                    } else if (tag === 0x0002) {
                      const offsetR = read32(valOrOffset);
                      const base = tiffStart + offsetR;
                      if (base + 24 <= bytes.length) {
                        latValues = [readRational(base), readRational(base + 8), readRational(base + 16)];
                      }
                    } else if (tag === 0x0003) {
                      const ref = String.fromCharCode(bytes[valOrOffset]);
                      if (ref === "E" || ref === "W") lonRef = ref;
                    } else if (tag === 0x0004) {
                      const offsetR = read32(valOrOffset);
                      const base = tiffStart + offsetR;
                      if (base + 24 <= bytes.length) {
                        lonValues = [readRational(base), readRational(base + 8), readRational(base + 16)];
                      }
                    }
                  } else {
                    if (tag === 0x0132 || tag === 0x9003 || tag === 0x9004) {
                      const strOffset = count > 4 ? read32(valOrOffset) : valOrOffset - tiffStart;
                      const dateStr = readString(tiffStart + strOffset, Math.min(count, 30));
                      const m = dateStr.match(/\b([12]\d{3})[:\/\-.](0[1-9]|1[0-2])[:\/\-.](0[1-9]|[12]\d|3[01])(?:\s([01]\d|2[0-3])[:.]([0-5]\d)(?:[:.]([0-5]\d))?)?\b/);
                      if (m && !foundDate) {
                        foundDate = `${m[1]}-${m[2]}-${m[3]}`;
                        if (m[4] && m[5] && !foundTime) {
                          foundTime = `${m[4]}:${m[5]}`;
                        }
                      }
                    } else if (tag === 0x8769) {
                      exifIFDOffset = read32(valOrOffset);
                    } else if (tag === 0x8825) {
                      gpsIFDOffset = read32(valOrOffset);
                    }
                  }
                }

                if (isGps && latValues.length === 3 && lonValues.length === 3) {
                  let lat = latValues[0] + latValues[1] / 60 + latValues[2] / 3600;
                  let lon = lonValues[0] + lonValues[1] / 60 + lonValues[2] / 3600;
                  if (latRef === "S") lat = -lat;
                  if (lonRef === "W") lon = -lon;
                  if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                    foundLat = Math.round(lat * 10000) / 10000;
                    foundLon = Math.round(lon * 10000) / 10000;
                  }
                }
              };

              parseIFD(firstIFDOffset);
              if (exifIFDOffset > 0) parseIFD(exifIFDOffset);
              if (gpsIFDOffset > 0) parseIFD(gpsIFDOffset, true);
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

    // 2. Fallback text scan for standard EXIF timestamp format "YYYY:MM:DD HH:MM:SS"
    if (!foundDate) {
      const text = new TextDecoder("latin1").decode(bytes.subarray(0, Math.min(bytes.length, 65536)));
      const match = text.match(/\b([12]\d{3}):(0[1-9]|1[0-2]):(0[1-9]|[12]\d|3[01])(?:\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d))?\b/);
      if (match) {
        foundDate = `${match[1]}-${match[2]}-${match[3]}`;
        if (match[4] && match[5] && !foundTime) {
          foundTime = `${match[4]}:${match[5]}`;
        }
      }
    }

    if (!foundDate && !foundTime && foundLat === undefined) {
      return null;
    }

    let locationLabel: string | undefined;
    if (foundLat !== undefined && foundLon !== undefined) {
      locationLabel = `Field GPS (${foundLat >= 0 ? `${foundLat}°N` : `${Math.abs(foundLat)}°S`}, ${foundLon >= 0 ? `${foundLon}°E` : `${Math.abs(foundLon)}°W`})`;
    }

    return {
      date: foundDate,
      time: foundTime,
      latitude: foundLat,
      longitude: foundLon,
      locationLabel,
    };
  } catch (err) {
    console.warn("EXIF extraction error:", err);
    return null;
  }
}

/**
 * Backward compatibility wrapper for extracting date/time
 */
export async function extractExifDateFromImageFile(file: File): Promise<{ date: string; time?: string } | null> {
  const result = await extractExifMetadata(file);
  if (!result || !result.date) return null;
  return { date: result.date, time: result.time };
}



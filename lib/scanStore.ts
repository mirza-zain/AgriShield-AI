import { ScanRecord } from "./types";
import { getOfflineDiagnosis } from "@/constants/offlineData";

// Shared in-memory scan store for fast, sub-millisecond local development and offline demos
// Each item's photo, crop name, condition, and status badge accurately match the visual content
export const sharedSeedScans: ScanRecord[] = [
  {
    id: "seed-1",
    crop_name: "Apple Orchard (Malus domestica)",
    scientific_name: "Monilinia fructigena",
    condition_detected: "Bitter Rot & Fruit Spoilage",
    confidence_score: 0.96,
    severity: "Critical",
    symptoms: [
      "Large circular brown rot lesion on fruit surface",
      "Sunken fungal decay spot with spore rings",
      "Soft flesh breakdown causing severe harvest loss"
    ],
    treatment: {
      immediate_action: "Collect and bury all rotting dropped and branch fruit immediately.",
      organic_remedy: "Foliar spray of Bacillus subtilis and sanitize fruit picking crates.",
      chemical_alternative: "Captan 50 WP or Pyraclostrobin protective orchard fungicide."
    },
    prevention_tips: [
      "Handle fruit gently during harvest to avoid skin punctures",
      "Prune diseased twigs in winter where fungus overwinters",
      "Store picked fruit in cool, clean, ventilated crates below 4°C"
    ],
    climate_impact_warning: "Warm rain showers followed by humid days (>85% RH) accelerate fungal rotting.",
    // Original: https://images.unsplash.com/photo-1644504113660-54f9d01b27d6?auto=format&fit=crop&w=400&q=80
    imageThumbnail: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/rotten-apple_thumb.jpg",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    location: {
      latitude: 34.0837,
      longitude: 74.7973,
      city: "Kashmir Valley",
      country: "Pakistan"
    },
    translations: {
      Urdu: { ...getOfflineDiagnosis("rotten-apple", "Urdu"), language: "Urdu" },
    },
  },
  {
    id: "seed-2",
    crop_name: "Field Pumpkin (Cucurbita pepo)",
    scientific_name: "Didymella bryoniae",
    condition_detected: "Black Rot & Field Spoilage",
    confidence_score: 0.94,
    severity: "Critical",
    symptoms: [
      "Water-soaked sunken lesions turning into soft black rot",
      "Tissue breakdown and fungal mold across rind",
      "Decomposing fruit on wet soil resulting in total loss"
    ],
    treatment: {
      immediate_action: "Remove decaying squashes from the field to stop spore contamination.",
      organic_remedy: "Dust with bio-sulfur or apply Trichoderma harzianum soil treatment.",
      chemical_alternative: "Chlorothalonil or Azoxystrobin protective field spray."
    },
    prevention_tips: [
      "Place straw mulch beneath fruit to keep off wet soil",
      "Rotate field with non-cucurbit crops for 2 years",
      "Harvest pumpkins only in dry weather and cure stems"
    ],
    climate_impact_warning: "Heavy late rains and poorly drained clay soils drive 60% higher fruit rot rate.",
    // Original: https://images.unsplash.com/photo-1675678674818-a749f21f22c5?auto=format&fit=crop&w=400&q=80
    imageThumbnail: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/spoiled-pumpkin_thumb.jpg",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      city: "Maharashtra",
      country: "India"
    },
    translations: {
      Urdu: { ...getOfflineDiagnosis("spoiled-pumpkin", "Urdu"), language: "Urdu" },
    },
  },
  {
    id: "seed-3",
    crop_name: "Maize / Corn (Zea mays)",
    scientific_name: "Zea mays (Heat / Drought)",
    condition_detected: "Severe Drought & Leaf Scorch",
    confidence_score: 0.91,
    severity: "Moderate",
    symptoms: [
      "Bleached, withered tan leaves and parched tassels",
      "Premature stalk desiccation under intense sun",
      "Shriveled grain fill and harvest yield reduction"
    ],
    treatment: {
      immediate_action: "Harvest mature ears promptly and chop dry residue for field mulch.",
      organic_remedy: "Apply humic acid and seaweed extract to reduce heat stress.",
      chemical_alternative: "Foliar potassium spray to help retain plant cell moisture."
    },
    prevention_tips: [
      "Plant certified drought-tolerant maize hybrid seed",
      "Practice minimum tillage to preserve deep soil moisture",
      "Establish windbreaks to reduce hot wind evaporation"
    ],
    climate_impact_warning: "Consecutive days over 38°C during tasseling severely diminish cob grain yield.",
    // Original: https://images.unsplash.com/photo-1789406515055-d2373d385f77?auto=format&fit=crop&w=400&q=80
    imageThumbnail: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/drought-corn_thumb.jpg",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    location: {
      latitude: -1.2921,
      longitude: 36.8219,
      city: "Rift Valley",
      country: "Kenya"
    },
    translations: {
      Urdu: { ...getOfflineDiagnosis("drought-corn", "Urdu"), language: "Urdu" },
    },
  },
  {
    id: "seed-4",
    crop_name: "Vine Tomatoes (Solanum lycopersicum)",
    scientific_name: "Solanum lycopersicum (Grade A)",
    condition_detected: "Healthy Harvest (Ripe Tomatoes)",
    confidence_score: 0.97,
    severity: "Low",
    symptoms: [
      "Plump, deep-red ripe tomatoes free of fungal spots or skin cracks",
      "Fresh green calyx stems with zero defoliation or blight lesions",
      "Ready for picking and packing with premium market value"
    ],
    treatment: {
      immediate_action: "Harvest ripe fruit during cool morning hours; avoid skin bruising.",
      organic_remedy: "Feed green developing tomatoes with organic potassium-rich tea.",
      chemical_alternative: "No chemical spray needed; harvest is safe, clean, and ready to eat."
    },
    prevention_tips: [
      "Use sanitized, dry harvest crates to prevent storage bruising",
      "Mulch around vine base to keep soil moisture even and avoid splitting",
      "Water near root zone to keep foliage dry"
    ],
    climate_impact_warning: "Pick ripe tomatoes before sudden heavy rains to prevent skin cracking.",
    // Original: https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80
    imageThumbnail: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/vine-tomatoes_thumb.jpg",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    location: {
      latitude: 25.3960,
      longitude: 68.3578,
      city: "Sindh River Basin",
      country: "Pakistan"
    },
    translations: {
      Urdu: { ...getOfflineDiagnosis("vine-tomatoes", "Urdu"), language: "Urdu" },
    },
  },
  {
    id: "seed-5",
    crop_name: "Sweet Corn (Zea mays)",
    scientific_name: "Zea mays saccharata (Prime)",
    condition_detected: "Grade A Healthy Harvest (Prime Cobs)",
    confidence_score: 0.98,
    severity: "Low",
    symptoms: [
      "Plump, golden yellow kernels tightly packed in green husks",
      "Zero earworm damage, fungal smut, or blight discoloration",
      "Premium grade sweetness, high moisture turgor, ready for market"
    ],
    treatment: {
      immediate_action: "Corn is at peak sweetness; pick during cool hours and sell or refrigerate.",
      organic_remedy: "Store harvested sweet corn below 5°C to preserve natural kernel sugar.",
      chemical_alternative: "Zero chemical intervention required; produce is clean and market-ready."
    },
    prevention_tips: [
      "Keep picked cobs out of direct sunlight to prevent drying",
      "Rotate with legumes to rebuild soil nitrogen for next season",
      "Maintain regular soil moisture during ear-filling stage"
    ],
    climate_impact_warning: "Current clear weather is ideal for harvest; complete picking before rain.",
    // Original: https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80
    imageThumbnail: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/sweet-corn_thumb.jpg",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    location: {
      latitude: 31.5204,
      longitude: 74.3587,
      city: "Punjab Farm Belt",
      country: "Pakistan"
    },
    translations: {
      Urdu: { ...getOfflineDiagnosis("sweet-corn", "Urdu"), language: "Urdu" },
    },
  }
];

// In-memory array shared across routes in the same Node.js process
const inMemoryScans: ScanRecord[] = [...sharedSeedScans];

export function getSharedScans(): ScanRecord[] {
  return inMemoryScans;
}

export function addSharedScan(scan: ScanRecord): void {
  // Prepend to top and keep max 20
  inMemoryScans.unshift(scan);
  if (inMemoryScans.length > 20) {
    inMemoryScans.pop();
  }
}

export function deleteSharedScan(scanId: string, userId?: string): boolean {
  if (scanId.startsWith("seed-")) {
    return false; // Protect demo seed scans from deletion
  }
  const index = inMemoryScans.findIndex((s) => s.id === scanId);
  if (index !== -1) {
    const target = inMemoryScans[index];
    // If target has a userId, verify ownership (allow guest_farmer test scans)
    if (target.userId && target.userId !== "guest_farmer" && userId && target.userId !== userId) {
      return false;
    }
    inMemoryScans.splice(index, 1);
    return true;
  }
  return false;
}

export function updateSharedScanTranslations(scanId: string, language: string, translation: any): void {
  if (scanId.startsWith("seed-")) {
    return; // Protect demo seed scans from being overwritten
  }
  const target = inMemoryScans.find((s) => s.id === scanId);
  if (target) {
    if (!target.translations) target.translations = {};
    target.translations[language] = translation;
  }
}

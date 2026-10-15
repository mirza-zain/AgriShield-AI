import { ScanRecord } from "./types";

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
    imageThumbnail: "https://images.unsplash.com/photo-1644504113660-54f9d01b27d6?auto=format&fit=crop&w=400&q=80",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    location: {
      latitude: 34.0837,
      longitude: 74.7973,
      city: "Kashmir Valley",
      country: "Pakistan"
    }
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
    imageThumbnail: "https://images.unsplash.com/photo-1675678674818-a749f21f22c5?auto=format&fit=crop&w=400&q=80",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      city: "Maharashtra",
      country: "India"
    }
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
    imageThumbnail: "https://images.unsplash.com/photo-1789406515055-d2373d385f77?auto=format&fit=crop&w=400&q=80",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    location: {
      latitude: -1.2921,
      longitude: 36.8219,
      city: "Rift Valley",
      country: "Kenya"
    }
  },
  {
    id: "seed-4",
    crop_name: "Potato (Solanum tuberosum)",
    scientific_name: "Solanum tuberosum (Grade A)",
    condition_detected: "Healthy Harvest (Clean Tubers)",
    confidence_score: 0.98,
    severity: "Low",
    symptoms: [
      "Smooth, firm unblemished tuber skins with zero scurf",
      "Uniform size and fully set periderm skin",
      "Zero signs of soft rot, blight spots, or hollow heart"
    ],
    treatment: {
      immediate_action: "Cure harvested potatoes in a cool, dark, well-aerated shed for 10-14 days.",
      organic_remedy: "Store in clean wooden crates with neem leaves to prevent storage pests.",
      chemical_alternative: "Standard sprout inhibitor treatment if storing long-term (>5 months)."
    },
    prevention_tips: [
      "Maintain storage temperature between 7°C and 10°C with 90% humidity",
      "Keep away from direct sunlight to prevent greening and solanine",
      "Discard any bruised tubers before bagging"
    ],
    climate_impact_warning: "High storage humidity without air movement causes condensation rot risk.",
    imageThumbnail: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    language: "Spanish",
    createdAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    location: {
      latitude: -12.0464,
      longitude: -77.0428,
      city: "Cusco",
      country: "Peru"
    }
  },
  {
    id: "seed-5",
    crop_name: "Citrus Grove (Citrus reticulata)",
    scientific_name: "Citrus reticulata (Prime)",
    condition_detected: "Healthy Harvest (Ripe Citrus)",
    confidence_score: 0.97,
    severity: "Low",
    symptoms: [
      "Vibrant golden-orange ripe fruit hanging abundantly on healthy trees",
      "Deep green glossy foliage with vigorous canopy growth",
      "Zero signs of citrus canker, greasy spots, or fruit fly puncture"
    ],
    treatment: {
      immediate_action: "Clip ripe citrus using shears during cool morning hours; avoid pulling.",
      organic_remedy: "Maintain organic compost mulching around tree dripline.",
      chemical_alternative: "Preventative micronutrient zinc-manganese foliar nutrition spray."
    },
    prevention_tips: [
      "Maintain clean orchard floor and prune skirt branches 50cm above ground",
      "Schedule regular drip irrigation during fruit swelling stage",
      "Monitor sticky traps weekly for early detection of pests"
    ],
    climate_impact_warning: "Warm sunny days and cool nights promote ideal natural sugar content and color.",
    imageThumbnail: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=400&q=80",
    language: "Hindi",
    createdAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    location: {
      latitude: 32.0836,
      longitude: 72.6711,
      city: "Sargodha",
      country: "Pakistan"
    }
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

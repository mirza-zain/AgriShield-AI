import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase";
import { ScanRecord } from "@/lib/types";

// Seed data for immediate demonstration if Firestore is not yet connected
const seedScans: ScanRecord[] = [
  {
    id: "seed-1",
    crop_name: "Tomato (Solanum lycopersicum)",
    scientific_name: "Phytophthora infestans",
    condition_detected: "Late Blight",
    confidence_score: 0.96,
    severity: "Critical",
    symptoms: [
      "Water-soaked lesions on lower leaflets",
      "White downy spore growth on leaf undersides",
      "Stem blackening and petiole collapse"
    ],
    treatment: {
      immediate_action: "Remove and burn affected leaves immediately to halt spore dissemination.",
      organic_remedy: "Spray copper soap fungicide or bio-fungicide Bacillus subtilis.",
      chemical_alternative: "Apply Chlorothalonil or Metalaxyl according to standard spray intervals."
    },
    prevention_tips: [
      "Avoid overhead irrigation to keep leaf surfaces dry",
      "Maximize airflow by spacing plants 60cm apart",
      "Sterilize tools between handling rows"
    ],
    climate_impact_warning: "Cool wet periods with relative humidity above 90% stimulate rapid sporulation.",
    imageThumbnail: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=300&q=80",
    language: "English",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    location: {
      latitude: 31.5204,
      longitude: 74.3587,
      city: "Punjab",
      country: "Pakistan"
    }
  },
  {
    id: "seed-2",
    crop_name: "Grapevine (Vitis vinifera)",
    scientific_name: "Erysiphe necator",
    condition_detected: "Powdery Mildew",
    confidence_score: 0.88,
    severity: "Moderate",
    symptoms: [
      "Dusty talcum-like patches on foliage",
      "Young leaf curling and crinkling",
      "Brittle, desiccated leaf tissue"
    ],
    treatment: {
      immediate_action: "Thin out interior leaves to let direct sunlight penetrate the canopy.",
      organic_remedy: "Dilute milk whey (1:9 ratio) or potassium bicarbonate foliar wash.",
      chemical_alternative: "Micronized sulfur spray (do not apply above 32°C)."
    },
    prevention_tips: [
      "Choose certified disease-tolerant vine cultivars",
      "Prune dense canopy vines each spring",
      "Install drip emitters instead of micro-sprinklers"
    ],
    climate_impact_warning: "Moderate temperatures (20-27°C) under high shade promote fungal mycelial expansion.",
    imageThumbnail: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=300&q=80",
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
    scientific_name: "Bipolaris maydis",
    condition_detected: "Southern Leaf Blight",
    confidence_score: 0.91,
    severity: "Moderate",
    symptoms: [
      "Elongated tan lesions with reddish borders",
      "Blighting of lower leaves moving upward",
      "Reduced ear fill"
    ],
    treatment: {
      immediate_action: "Clear diseased crop debris immediately after harvest.",
      organic_remedy: "Trichoderma viride seed and soil treatment.",
      chemical_alternative: "Azoxystrobin or Pyraclostrobin systemic spray."
    },
    prevention_tips: [
      "Select resistant hybrid seeds",
      "Practice 2-year non-host crop rotation",
      "Till soil deeply to bury residual stalks"
    ],
    climate_impact_warning: "Frequent summer rain showers and warm nights increase spore germination by 45%.",
    imageThumbnail: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80",
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
    scientific_name: "Rhizoctonia solani",
    condition_detected: "Black Scurf & Stem Canker",
    confidence_score: 0.85,
    severity: "Low",
    symptoms: [
      "Dark brown sclerotia adhering to skin",
      "Stunted aerial shoot emergence",
      "Wilting of foliage on warm afternoons"
    ],
    treatment: {
      immediate_action: "Allow hill tops to drain and dry before harvesting.",
      organic_remedy: "Bio-priming seed tubers with Pseudomonas fluorescens.",
      chemical_alternative: "Fludioxonil or Pencycuron seed treatment."
    },
    prevention_tips: [
      "Plant in warm, well-aerated soil (>10°C)",
      "Use certified disease-free seed tubers",
      "Rotate with green manure brassica cover crops"
    ],
    climate_impact_warning: "Cold, waterlogged soil after planting slows emergence and invites fungal colonization.",
    imageThumbnail: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80",
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
    crop_name: "Rice (Oryza sativa)",
    scientific_name: "Magnaporthe oryzae",
    condition_detected: "Rice Blast",
    confidence_score: 0.95,
    severity: "Critical",
    symptoms: [
      "Diamond or spindle-shaped lesions with gray centers",
      "Collar rot at leaf junctions",
      "Panicle neck breakdown"
    ],
    treatment: {
      immediate_action: "Temporarily drain excessive standing water; reduce nitrogen applications.",
      organic_remedy: "Pseudomonas foliar spray; bio-char soil amendment.",
      chemical_alternative: "Tricyclazole 75 WP or Isoprothiolane."
    },
    prevention_tips: [
      "Avoid excessive synthetic nitrogen fertilizer",
      "Maintain intermittent field flooding",
      "Seed treatment with hot water (52°C for 10 min)"
    ],
    climate_impact_warning: "Persistent overcast skies and drizzle with nighttime dew (>10h) triggers severe blast epidemics.",
    imageThumbnail: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=300&q=80",
    language: "Hindi",
    createdAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    location: {
      latitude: 22.5726,
      longitude: 88.3639,
      city: "West Bengal",
      country: "India"
    }
  }
];

export async function GET() {
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        const snapshot = await adminDb
          .collection("scans")
          .orderBy("createdAt", "desc")
          .limit(5)
          .get();

        if (!snapshot.empty) {
          const scans: ScanRecord[] = [];
          snapshot.forEach((doc) => {
            scans.push({ id: doc.id, ...doc.data() } as ScanRecord);
          });
          return NextResponse.json({ success: true, scans });
        }
      } catch (err) {
        console.warn("Firestore query error (falling back to seed feed):", err);
      }
    }

    return NextResponse.json({
      success: true,
      scans: seedScans,
    });
  } catch (error: any) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch scan history" },
      { status: 500 }
    );
  }
}


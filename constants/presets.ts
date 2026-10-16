// Agricultural regional presets, language configs, and sample presets

export interface LanguageOption {
  code: string;
  label: string;
  sublabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "English", label: "English", sublabel: "Easy English", flag: "🇬🇧" },
  { code: "Urdu", label: "اردو", sublabel: "آسان اردو", flag: "🇵🇰" },
];

export const ANALYSIS_STEPS = [
  "Reading leaf resolution & light...",
  "Scanning leaf surface & symptoms...",
  "Consulting AI plant doctor...",
  "Formulating remedies & weather alert...",
];

export interface AgriculturalPreset {
  name: string;
  lat: number;
  lon: number;
  region: string;
  icon: string;
}

export const AGRICULTURAL_PRESETS: AgriculturalPreset[] = [
  { name: "Punjab Farm Belt", lat: 31.5204, lon: 74.3587, region: "Punjab, Pakistan", icon: "🌾" },
  { name: "Sindh River Basin", lat: 25.396, lon: 68.3578, region: "Sindh, Pakistan", icon: "🍅" },
  { name: "Midwest Corn Belt", lat: 41.5868, lon: -93.625, region: "Iowa, USA", icon: "🌽" },
  { name: "Nairobi Highlands", lat: -1.2921, lon: 36.8219, region: "Central, Kenya", icon: "🌱" },
  { name: "Sonora Valley", lat: 29.0729, lon: -110.9559, region: "Sonora, Mexico", icon: "🌵" },
];

export interface SamplePreset {
  name: string;
  crop: string;
  condition: string;
  url: string;
  badge: string;
  badgeColor: string;
  dotColor: string;
  desc: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    name: "Rotten Apple",
    crop: "Orchard Fruit",
    condition: "Bitter Rot Decay",
    // Original: https://images.unsplash.com/photo-1644504113660-54f9d01b27d6?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/rotten-apple.jpg",
    badge: "Bad Harvest",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    desc: "Apple with fungal rot decay lesion and scab damage",
  },
  {
    name: "Drought Corn",
    crop: "Field Maize",
    condition: "Drought Scorch",
    // Original: https://images.unsplash.com/photo-1789406515055-d2373d385f77?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/drought-corn.jpg",
    badge: "Severe Drought",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-amber-500",
    desc: "Parched stalks and scorched leaves from thermal heat",
  },
  {
    name: "Vine Tomatoes",
    crop: "Tomato Vine",
    condition: "Healthy Harvest",
    // Original: https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/vine-tomatoes.jpg",
    badge: "Grade A Prime",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Plump ripe red tomatoes on vine with zero rot",
  },
  {
    name: "Spoiled Pumpkin",
    crop: "Field Pumpkin",
    condition: "Black Rot Spoilage",
    // Original: https://images.unsplash.com/photo-1675678674818-a749f21f22c5?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/spoiled-pumpkin.jpg",
    badge: "Fruit Rot",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    desc: "Rotting pumpkins with mold decay and crop damage",
  },
  {
    name: "Sweet Corn",
    crop: "Sweet Corn",
    condition: "Grade A Healthy Cobs",
    // Original: https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/sweet-corn.jpg",
    badge: "Healthy Yield",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Fresh sweet corn cobs in husks with plump golden kernels",
  },
  {
    name: "Green Basil",
    crop: "Herb Crop",
    condition: "Disease-Free Leaf",
    // Original: https://images.unsplash.com/photo-1534944645004-bf75556ce377?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/green-basil.jpg",
    badge: "Clean Foliage",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Vibrant emerald herb leaves with zero fungal leaf spots",
  },
];


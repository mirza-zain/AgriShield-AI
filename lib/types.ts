export interface DiagnosisResult {
  crop_name: string;
  scientific_name: string;
  condition_detected: string;
  confidence_score: number;
  severity: "Low" | "Moderate" | "Critical";
  symptoms: string[];
  treatment: {
    immediate_action: string;
    organic_remedy: string;
    chemical_alternative: string;
  };
  prevention_tips: string[];
  climate_impact_warning: string;
}

export interface ScanRecord extends DiagnosisResult {
  id?: string;
  imageUrl?: string;
  imageThumbnail?: string;
  language: string;
  createdAt: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  userId?: string;
}


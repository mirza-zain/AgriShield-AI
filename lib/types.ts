export interface DiagnosisResult {
  is_plant_or_crop?: boolean;
  rejection_reason?: string;
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
  model_used?: string;
  agronomic_context?: AgronomicContext;
  disease_origin?: DiseaseOriginAnalysis;
}

export interface DiseaseOriginAnalysis {
  why_it_happened: string;
  weather_correlation: string;
}

export interface WeatherSnapshot {
  temp?: number;
  temp_max?: number;
  temp_min?: number;
  humidity?: number;
  precipitation_mm?: number;
  condition?: string;
  observation_time?: string;
  past_week_rainfall_mm?: number;
  past_week_avg_humidity?: number;
  consecutive_damp_days?: number;
}

export interface AgronomicContext {
  season?: string;
  month?: string;
  climate_zone?: string;
  captured_at?: string;
  observation_time?: string;
  weather_snapshot?: WeatherSnapshot;
  provided_by_user: boolean;
}

export interface ScanRecord extends DiagnosisResult {
  id?: string;
  imageUrl?: string;
  imageThumbnail?: string;
  language: string;
  createdAt: string;
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
  };
  userId?: string;
}

export interface ClimateTelemetry {
  temperature: number;
  humidity: number;
  precipitation_probability: number;
  precipitation_mm?: number;
  wind_speed: number;
  weather_condition: string;
  weather_code: number;
  temp_max?: number;
  temp_min?: number;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  past_week_rainfall_mm?: number;
  past_week_avg_humidity?: number;
  consecutive_damp_days?: number;
}

export interface ClimateAdvisoryPayload {
  temperature: number;
  humidity: number;
  precipitation_probability: number;
  wind_speed: number;
  weather_condition: string;
  crop_name?: string;
  language: string;
  past_week_rainfall_mm?: number;
  past_week_avg_humidity?: number;
  consecutive_damp_days?: number;
  location_name?: string;
}

export interface ClimateAdvisoryResult {
  risk_level: "Low" | "Moderate" | "High" | "Severe";
  risk_score: number;
  headline: string;
  primary_disease_risk: string;
  action_today: string;
  spray_timing_advice: string;
  irrigation_advice: string;
  spoken_script: string;
  ongoing_climate_impact?: string;
  model_used?: string;
}


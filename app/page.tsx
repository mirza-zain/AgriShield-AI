"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Camera,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Volume2,
  VolumeX,
  Printer,
  ChevronDown,
  Calendar,
  RefreshCw,
  Globe,
  Activity,
  CheckCircle2,
  Clock,
  Sprout,
  Zap,
  Layers,
  CloudSun,
  CloudRain,
  X,
  Smartphone,
  Copy,
  Check,
  Share2,
  MapPin,
  ChevronRight,
  ImageOff,
  Search,
  Filter,
  CheckCheck,
  SlidersHorizontal,
  Bookmark,
  ArrowRight,
  BookOpen,
  Info,
  FlaskConical,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Map as MapIcon,
  Mic,
  MicOff,
  Send,
  MessageSquare,
  Bot,
  User,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  TrendingUp,
  Target,
  WifiOff,
  Leaf,
  Microscope,
  Heart,
  Trash2,
  Loader2,
  Lock,
} from "lucide-react";
import { DiagnosisResult, ScanRecord, ClimateTelemetry, ClimateAdvisoryResult, ClimateAdvisoryPayload } from "@/lib/types";
import { extractExifMetadata } from "@/lib/utils";
import { getScansFromVault, saveScansToVault, saveSingleScanToVault, deleteScanFromVault, clearOfflineVault } from "@/lib/offlineVault";
import { getOfflineDiagnosis } from "@/constants/offlineData";

// Authentic Ionicons Leaf SVG Component
function IoniconsLeaf({
  className = "w-5 h-5",
  mirrored = true,
}: {
  className?: string;
  mirrored?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      fill="currentColor"
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M161.35 242a16 16 0 0 1 22.62-.68c73.63 69.36 147.51 111.56 234.45 133.07c11.73-32 12.77-67.22 2.64-101.58c-13.44-45.59-44.74-85.31-90.49-114.86c-40.84-26.38-81.66-33.25-121.15-39.89c-49.82-8.38-96.88-16.3-141.79-63.85c-5-5.26-11.81-7.37-18.32-5.66c-7.44 2-12.43 7.88-14.82 17.6c-5.6 22.75-2 86.51 13.75 153.82c25.29 108.14 65.65 162.86 95.06 189.73c38 34.69 87.62 53.9 136.93 53.9a186 186 0 0 0 27.77-2.04c41.71-6.32 76.43-27.27 96-57.75c-89.49-23.28-165.94-67.55-242-139.16a16 16 0 0 1-.65-22.65m306.08 142.19c-16.83-2.59-33.13-5.84-49-9.77a157.7 157.7 0 0 1-12.13 25.68c-.73 1.25-1.5 2.49-2.29 3.71a584 584 0 0 0 58.56 12a16 16 0 1 0 4.87-31.62Z" />
    </svg>
  );
}

// Practical specimen samples for quick 1-tap testing (Served from Cloudflare R2 CDN with dual inspection & pill thumbnails)
const SAMPLE_PRESETS = [
  {
    id: "rotten-apple",
    name: "Rotten Apple",
    crop: "Orchard Fruit",
    condition: "Bitter Rot Decay",
    // Original: https://images.unsplash.com/photo-1644504113660-54f9d01b27d6?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/rotten-apple.jpg",
    thumbnailUrl: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/rotten-apple_thumb.jpg",
    badge: "Bad Harvest",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    desc: "Apple with fungal rot decay lesion and scab damage"
  },
  {
    id: "drought-corn",
    name: "Drought Corn",
    crop: "Field Maize",
    condition: "Drought Scorch",
    // Original: https://images.unsplash.com/photo-1789406515055-d2373d385f77?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/drought-corn.jpg",
    thumbnailUrl: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/drought-corn_thumb.jpg",
    badge: "Severe Drought",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-amber-500",
    desc: "Parched stalks and scorched leaves from thermal heat"
  },
  {
    id: "vine-tomatoes",
    name: "Vine Tomatoes",
    crop: "Tomato Vine",
    condition: "Healthy Harvest",
    // Original: https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/vine-tomatoes.jpg",
    thumbnailUrl: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/vine-tomatoes_thumb.jpg",
    badge: "Grade A Prime",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Plump ripe red tomatoes on vine with zero rot"
  },
  {
    id: "spoiled-pumpkin",
    name: "Spoiled Pumpkin",
    crop: "Field Pumpkin",
    condition: "Black Rot Spoilage",
    // Original: https://images.unsplash.com/photo-1675678674818-a749f21f22c5?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/spoiled-pumpkin.jpg",
    thumbnailUrl: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/spoiled-pumpkin_thumb.jpg",
    badge: "Fruit Rot",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    desc: "Rotting pumpkins with mold decay and crop damage"
  },
  {
    id: "sweet-corn",
    name: "Sweet Corn",
    crop: "Sweet Corn",
    condition: "Grade A Healthy Cobs",
    // Original: https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/sweet-corn.jpg",
    thumbnailUrl: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/sweet-corn_thumb.jpg",
    badge: "Healthy Yield",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Fresh sweet corn cobs in husks with plump golden kernels"
  },
  {
    id: "green-basil",
    name: "Green Basil",
    crop: "Herb Crop",
    condition: "Disease-Free Leaf",
    // Original: https://images.unsplash.com/photo-1534944645004-bf75556ce377?auto=format&fit=crop&w=800&q=80
    url: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/green-basil.jpg",
    thumbnailUrl: "https://pub-506d232cae6c4aef82ff1b69aea2415e.r2.dev/samples/green-basil_thumb.jpg",
    badge: "Clean Foliage",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Vibrant emerald herb leaves with zero fungal leaf spots"
  }
];

const LANGUAGES = [
  { code: "English", label: "English", sublabel: "Easy English", flag: "🇬🇧" },
  { code: "Urdu", label: "اردو", sublabel: "آسان اردو", flag: "🇵🇰" },
];

const ANALYSIS_STEPS = [
  "Reading leaf resolution & light...",
  "Scanning leaf surface & symptoms...",
  "Consulting AI plant doctor...",
  "Formulating remedies & weather alert..."
];

const AGRICULTURAL_PRESETS = [
  { name: "Punjab Farm Belt", lat: 31.5204, lon: 74.3587, region: "Punjab, Pakistan" },
  { name: "Sindh River Basin", lat: 25.396, lon: 68.3578, region: "Sindh, Pakistan" },
  { name: "Midwest Corn Belt", lat: 41.5868, lon: -93.625, region: "Iowa, USA" },
  { name: "Nairobi Highlands", lat: -1.2921, lon: 36.8219, region: "Central, Kenya" },
  { name: "Sonora Valley", lat: 29.0729, lon: -110.9559, region: "Sonora, Mexico" },
];

function getWeatherCodeDescription(code: number): { condition: string } {
  if (code === 0) return { condition: "Clear Sky & Sunshine" };
  if (code === 1 || code === 2) return { condition: "Partly Cloudy" };
  if (code === 3) return { condition: "Overcast" };
  if (code === 45 || code === 48) return { condition: "Fog & High Dew" };
  if (code >= 51 && code <= 55) return { condition: "Drizzle & Damp Foliage" };
  if (code >= 61 && code <= 65) return { condition: "Rainfall" };
  if (code >= 80 && code <= 82) return { condition: "Rain Showers" };
  if (code >= 95) return { condition: "Thunderstorm Alert" };
  return { condition: "Moderate Weather" };
}

function getPathologyRiskIndex(telemetry: ClimateTelemetry | null): {
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

function formatConfidencePercent(score?: number): number {
  if (score === undefined || score === null || isNaN(score)) return 95;
  const num = score > 1 ? score : score * 100;
  return Math.min(99, Math.max(10, Math.round(num)));
}

export default function AgriShieldDashboard() {
  // Navigation Mode (Plant Doctor / Farm Vault / Climate Advisory)
  const [activeViewTab, setActiveViewTab] = useState<"doctor" | "vault" | "advisory">("doctor");

  // Core Diagnostic State
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [activePresetUrl, setActivePresetUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState<number>(0);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [activeTreatmentTab, setActiveTreatmentTab] = useState<"immediate" | "organic" | "chemical">("immediate");
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const selectedScanIdRef = useRef<string | null>(null);
  useEffect(() => {
    selectedScanIdRef.current = selectedScanId;
  }, [selectedScanId]);

  // Pathology Target Coordinate Rect & Visibility Toggle
  const [imageRenderRect, setImageRenderRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [showPathologyBoxes, setShowPathologyBoxes] = useState<boolean>(true);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Interactive Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [lightboxPan, setLightboxPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Optional Observation Context (Photo Date & Region & Weather)
  const [observationDate, setObservationDate] = useState<string>("");
  const [observationTime, setObservationTime] = useState<string>("");
  const [observationLocation, setObservationLocation] = useState<string>("");
  const [observationCoords, setObservationCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [showObservationContext, setShowObservationContext] = useState<boolean>(false);
  const [isDateUserEdited, setIsDateUserEdited] = useState<boolean>(false);
  const [isDateFromExif, setIsDateFromExif] = useState<boolean>(false);
  const [isTimeUserEdited, setIsTimeUserEdited] = useState<boolean>(false);
  const [isTimeFromExif, setIsTimeFromExif] = useState<boolean>(false);
  const [isLocationFromExif, setIsLocationFromExif] = useState<boolean>(false);
  const [isDetectingRegion, setIsDetectingRegion] = useState<boolean>(false);

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [speechStatusText, setSpeechStatusText] = useState<string>("");

  // History & Community Feed
  const [historyFeed, setHistoryFeed] = useState<ScanRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [vaultSearch, setVaultSearch] = useState<string>("");
  const [vaultSeverityFilter, setVaultSeverityFilter] = useState<"all" | "Low" | "Moderate" | "Critical">("all");
  const [farmerId, setFarmerId] = useState<string>("");
  const [deletingScanId, setDeletingScanId] = useState<string | null>(null);
  const [myScanIds, setMyScanIds] = useState<string[]>([]);

  // Ownership of the currently active diagnosis report (allows chat and voice generation only for crop owners)
  const isCurrentReportOwner = Boolean(
    !selectedScanId ||
    (!selectedScanId.startsWith("seed-") && (
      (farmerId && (diagnosis as any)?.userId && (diagnosis as any)?.userId === farmerId) ||
      (selectedScanId && myScanIds.includes(selectedScanId))
    ))
  );

  // Notifications & Notices
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOfflineDiagnosisError, setIsOfflineDiagnosisError] = useState<boolean>(false);
  const [notCropNotice, setNotCropNotice] = useState<{ isInvalid: boolean; message: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; icon?: React.ReactNode } | null>(null);

  // PWA Install Prompt & Connectivity State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Live Climate & Microclimate State
  const [weatherTelemetry, setWeatherTelemetry] = useState<ClimateTelemetry | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [locationMode, setLocationMode] = useState<"gps" | "ip" | "preset" | "map">("preset");
  const [activeLocationLabel, setActiveLocationLabel] = useState<string>("Punjab Farm Belt");
  const [citySearchInput, setCitySearchInput] = useState<string>("");
  const [isSearchingCity, setIsSearchingCity] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [modalLatInput, setModalLatInput] = useState<string>("31.5204");
  const [modalLonInput, setModalLonInput] = useState<string>("74.3587");
  const [modalSearchInput, setModalSearchInput] = useState<string>("");
  const [modalSearching, setModalSearching] = useState<boolean>(false);
  const [climateAdvisory, setClimateAdvisory] = useState<ClimateAdvisoryResult | null>(null);
  const [advisoryLoading, setAdvisoryLoading] = useState<boolean>(false);
  const [isAdvisorySpeaking, setIsAdvisorySpeaking] = useState<boolean>(false);
  const [advisoryAudioLoading, setAdvisoryAudioLoading] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const languageDiagnosisCacheRef = useRef<Record<string, DiagnosisResult>>({});
  const clientAudioCacheRef = useRef<Record<string, string>>({});

  // Dr. Crop Chat & Voice Assistant State
  const [reportSubTab, setReportSubTab] = useState<"treatment" | "origin" | "chat">("treatment");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Debug & Telemetry State
  const [diagnoseModelUsed, setDiagnoseModelUsed] = useState<string>("");
  const [advisoryModelUsed, setAdvisoryModelUsed] = useState<string>("");
  const [audioModelUsed, setAudioModelUsed] = useState<string>("");

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const advisoryAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioAbortControllerRef = useRef<AbortController | null>(null);
  const advisoryAudioAbortControllerRef = useRef<AbortController | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const isTabMountRef = useRef<boolean>(true);

  // Trigger floating toast notification
  const showToast = (message: string, icon?: React.ReactNode) => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 2800);
  };

  // Calculate exact rendered dimensions of image inside object-contain container
  const updateImageRenderRect = (imgElement?: HTMLImageElement | null) => {
    const container = imageContainerRef.current;
    if (!container) return;
    const img = imgElement || container.querySelector("img");
    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    if (!containerWidth || !containerHeight) return;

    const naturalAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerWidth / containerHeight;

    let renderWidth = containerWidth;
    let renderHeight = containerHeight;
    let left = 0;
    let top = 0;

    if (naturalAspect > containerAspect) {
      renderHeight = containerWidth / naturalAspect;
      top = (containerHeight - renderHeight) / 2;
    } else {
      renderWidth = containerHeight * naturalAspect;
      left = (containerWidth - renderWidth) / 2;
    }

    setImageRenderRect({ top, left, width: renderWidth, height: renderHeight });
  };

  // Auto-recalculate rendered bounds whenever photo, diagnosis, or active tab settles
  useEffect(() => {
    if (!imagePreview) {
      setImageRenderRect(null);
      return;
    }
    const timer = setTimeout(() => {
      updateImageRenderRect();
    }, 60);
    return () => clearTimeout(timer);
  }, [imagePreview, diagnosis, activeViewTab]);

  useEffect(() => {
    // Immediate offline-first initialization from IndexedDB vault
    getScansFromVault().then((cached) => {
      if (cached && cached.length > 0) {
        setHistoryFeed(cached);
      }
    }).catch(() => { });

    fetchHistory(true);

    // Register Service Worker for offline capability & Chromium/Android PWA installability
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("AgriShield PWA Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("AgriShield Service Worker registration failed:", err);
        });
    }

    // Check if an early beforeinstallprompt was captured by head script before React mounted
    if (typeof window !== "undefined" && (window as any).__agriShieldPrompt) {
      setDeferredPrompt((window as any).__agriShieldPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      if (typeof window !== "undefined") {
        (window as any).__agriShieldPrompt = e;
      }
      setDeferredPrompt(e);
      // Browser verified app is NOT installed; reset flag so button shows up if user uninstalled
      setIsInstalled(false);
      try {
        localStorage.removeItem("agrishield_pwa_installed");
      } catch (err) { }
    };

    const handleResize = () => {
      updateImageRenderRect();
    };

    // 1. Comprehensive standalone detection across iOS, Android WebAPK, and Desktop
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      (window.navigator as any)?.standalone === true ||
      document.referrer?.includes("android-app://");

    if (isStandalone) {
      setIsInstalled(true);
    }

    // 2. Load stored farmer identity and user-owned scan history
    try {
      let storedFarmerId = localStorage.getItem("agrishield_farmer_id");
      if (!storedFarmerId) {
        storedFarmerId = "farmer_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        localStorage.setItem("agrishield_farmer_id", storedFarmerId);
      }
      setFarmerId(storedFarmerId);
      let storedScans = localStorage.getItem("agrishield_my_scans");
      if (storedScans) {
        try {
          setMyScanIds(JSON.parse(storedScans));
        } catch (e) { }
      }
    } catch (e) { }

    // 3. Query device OS if companion PWA is currently installed on phone/PC
    if ("getInstalledRelatedApps" in navigator) {
      (navigator as any)
        .getInstalledRelatedApps()
        .then((relatedApps: any[]) => {
          if (Array.isArray(relatedApps) && relatedApps.length > 0) {
            setIsInstalled(true);
          } else if (!isStandalone) {
            // App was uninstalled from device; allow reinstallation
            setIsInstalled(false);
            try {
              localStorage.removeItem("agrishield_pwa_installed");
            } catch (err) { }
          }
        })
        .catch(() => { });
    }

    // 4. Native appinstalled event (fires when user completes install via browser menu or prompt)
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      if (typeof window !== "undefined") {
        (window as any).__agriShieldPrompt = null;
      }
      try {
        localStorage.setItem("agrishield_pwa_installed", "true");
      } catch (e) { }
      showToast("AgriShield installed successfully!", <Smartphone className="w-4 h-4 text-emerald-400" />);
    };

    const standaloneMedia = window.matchMedia("(display-mode: standalone)");
    const handleDisplayChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("resize", handleResize);
    standaloneMedia.addEventListener?.("change", handleDisplayChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("resize", handleResize);
      standaloneMedia.removeEventListener?.("change", handleDisplayChange);
      stopSpeech();
    };
  }, []);

  // Scroll to top smoothly when switching between primary tabs (Doctor, Vault, Advisory)
  useEffect(() => {
    if (isTabMountRef.current) {
      isTabMountRef.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeViewTab]);

  // Automatically refresh feed when farmer opens the Farm Vault tab
  useEffect(() => {
    if (activeViewTab === "vault") {
      fetchHistory(false);
    }
  }, [activeViewTab]);

  // Live Network Connectivity Monitor (Online Cloud vs Offline Local Vault)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      showToast(
        selectedLanguage === "Urdu"
          ? "انٹرنیٹ بحال ہو گیا، کلاؤڈ AI فعال ہے"
          : "Internet restored, Cloud AI active",
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      );
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast(
        selectedLanguage === "Urdu"
          ? "انٹرنیٹ منقطع، آف لائن محفوظ ذخیرہ فعال ہے"
          : "Offline mode, Local Farm Vault active",
        <WifiOff className="w-4 h-4 text-amber-400" />
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [selectedLanguage]);

  // Analysis progress step simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setAnalysisStepIndex(0);
      interval = setInterval(() => {
        setAnalysisStepIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
      }, 450);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleInstallClick = async () => {
    const promptEvent =
      deferredPrompt || (typeof window !== "undefined" ? (window as any).__agriShieldPrompt : null);

    if (promptEvent) {
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice?.outcome === "accepted") {
        setIsInstalled(true);
        try {
          localStorage.setItem("agrishield_pwa_installed", "true");
        } catch (e) { }
        showToast("AgriShield installed successfully!", <Smartphone className="w-4 h-4 text-emerald-400" />);
      }
      setDeferredPrompt(null);
      if (typeof window !== "undefined") {
        (window as any).__agriShieldPrompt = null;
      }
    } else {
      const isIos = typeof window !== "undefined" && /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
      if (isIos) {
        showToast(
          selectedLanguage === "Urdu"
            ? "آئی فون پر انسٹال کرنے کے لیے: براؤزر شیئر (Share) پر ٹیپ کریں اور 'Add to Home Screen' منتخب کریں"
            : "To install on iPhone/iPad: Tap Share ⎋ -> 'Add to Home Screen'",
          <Smartphone className="w-4 h-4 text-emerald-400" />
        );
      } else {
        showToast(
          selectedLanguage === "Urdu"
            ? "انسٹال کرنے کے لیے: براؤزر مینو (⋮) پر ٹیپ کریں اور 'Install App' منتخب کریں"
            : "To install: Tap browser menu (⋮) -> 'Install App'",
          <Smartphone className="w-4 h-4 text-emerald-400" />
        );
      }
    }
  };

  const fetchHistory = async (showSkeleton = false) => {
    try {
      if (showSkeleton) {
        setHistoryLoading(true);
      }
      const res = await fetch(`/api/history?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.scans && Array.isArray(data.scans)) {
          setHistoryFeed(data.scans);
          saveScansToVault(data.scans, farmerId, myScanIds).catch(() => { });
        }
      } else {
        const cached = await getScansFromVault();
        if (cached && cached.length > 0) {
          setHistoryFeed(cached);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch community history (using offline vault):", err);
      const cached = await getScansFromVault();
      if (cached && cached.length > 0) {
        setHistoryFeed(cached);
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const resetSpecimenAndDiagnosis = () => {
    setImagePreview(null);
    setThumbnailPreview(null);
    setActivePresetUrl(null);
    setSelectedScanId(null);
    setDiagnosis(null);
    setNotCropNotice(null);
    setErrorMessage(null);
    setObservationDate("");
    setObservationTime("");
    setObservationLocation("");
    setObservationCoords(null);
    setIsDateFromExif(false);
    setIsTimeFromExif(false);
    setIsLocationFromExif(false);
    setIsDateUserEdited(false);
    setIsTimeUserEdited(false);
    setShowObservationContext(false);
    setChatMessages([]);
    setReportSubTab("treatment");
    setDiagnoseModelUsed("");
    languageDiagnosisCacheRef.current = {};
    stopSpeech();
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cameraLongPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isCameraLongPressRef = useRef<boolean>(false);

  const handleTriggerCamera = () => {
    resetSpecimenAndDiagnosis();
    setActiveViewTab("doctor");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      cameraInputRef.current?.click();
    }, 50);
  };

  const handleTriggerGallery = () => {
    resetSpecimenAndDiagnosis();
    setActiveViewTab("doctor");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(
      selectedLanguage === "Urdu" ? "گیلری سے تصویر منتخب کریں..." : "Choose photo from gallery...",
      <Upload className="w-4 h-4 text-emerald-400" />
    );
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const startCameraLongPress = () => {
    isCameraLongPressRef.current = false;
    if (cameraLongPressTimerRef.current) clearTimeout(cameraLongPressTimerRef.current);
    cameraLongPressTimerRef.current = setTimeout(() => {
      isCameraLongPressRef.current = true;
      try {
        if (typeof window !== "undefined" && window.navigator && "vibrate" in window.navigator) {
          window.navigator.vibrate(40);
        }
      } catch (e) { }
      handleTriggerGallery();
    }, 450);
  };

  const cancelCameraLongPress = () => {
    if (cameraLongPressTimerRef.current) {
      clearTimeout(cameraLongPressTimerRef.current);
      cameraLongPressTimerRef.current = null;
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    e.target.value = "";
  };

  const compressImageFile = (file: File, maxDim = 1600, quality = 0.88): Promise<string> => {
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
            // Enable high-fidelity bicubic resampling to preserve micro-lesions, vein clarity, and spore filaments
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
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
  };

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setNotCropNotice(null);
    setSelectedScanId(null);
    setDiagnosis(null);
    setActivePresetUrl(null);
    setDiagnoseModelUsed("");
    languageDiagnosisCacheRef.current = {};
    setChatMessages([]);
    setReportSubTab("treatment");
    stopSpeech();
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a photo of a plant leaf or crop.");
      return;
    }

    // Inspect EXIF metadata from uploaded image
    const exifData = await extractExifMetadata(file);
    if (exifData && (exifData.date || exifData.time || exifData.latitude !== undefined)) {
      if (exifData.date && !isDateUserEdited) {
        setObservationDate(exifData.date);
        setIsDateFromExif(true);
      }
      if (exifData.time && !isTimeUserEdited) {
        setObservationTime(exifData.time);
        setIsTimeFromExif(true);
      }
      if (exifData.latitude !== undefined && exifData.longitude !== undefined) {
        setObservationCoords({ lat: exifData.latitude, lon: exifData.longitude });
        if (exifData.locationLabel) {
          setObservationLocation(exifData.locationLabel);
          setIsLocationFromExif(true);
        }
      }
      setShowObservationContext(true);
      showToast("Found photo date & GPS in image", <Camera className="w-4 h-4 text-emerald-400" />);
    } else {
      // Leave completely empty and optional for the user
      setObservationDate("");
      setObservationTime("");
      setObservationLocation("");
      setObservationCoords(null);
      setIsDateFromExif(false);
      setIsTimeFromExif(false);
      setIsLocationFromExif(false);
      setIsDateUserEdited(false);
      setIsTimeUserEdited(false);
      setShowObservationContext(false);
    }

    try {
      // Parallel generation: pathology-grade full image (1600px @ 0.88 with high bicubic smoothing) and clean card thumbnail (400px @ 0.70)
      const [compressedUrl, thumbUrl] = await Promise.all([
        compressImageFile(file, 1600, 0.88),
        compressImageFile(file, 400, 0.70),
      ]);
      if (compressedUrl) {
        setImagePreview(compressedUrl);
        setThumbnailPreview(thumbUrl || compressedUrl);
        showToast("Photo ready for inspection", <CheckCircle2 className="w-4 h-4 text-emerald-400" />);
        return;
      }
    } catch {
      // Fallback to standard reader
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setImagePreview(url);
      setThumbnailPreview(url);
      showToast("Photo loaded", <CheckCircle2 className="w-4 h-4 text-emerald-400" />);
    };
    reader.readAsDataURL(file);
  };

  // Helper to identify if a diagnosis or preview corresponds to an offline sample preset
  const getSampleImageKey = (diag?: DiagnosisResult | null, activeUrl?: string | null, imgPreview?: string | null): string | null => {
    const candidates = [
      activeUrl,
      imgPreview,
      (diag as any)?.imageUrl,
      (diag as any)?.imageThumbnail,
    ].filter(Boolean) as string[];

    const sampleKeys = [
      "rotten-apple",
      "drought-corn",
      "vine-tomatoes",
      "spoiled-pumpkin",
      "sweet-corn",
      "green-basil",
      "1644504113660-54f9d01b27d6",
      "1789406515055-d2373d385f77",
      "1592924357228-91a4daadcfea",
      "1675678674818-a749f21f22c5",
      "1551754655-cd27e38d2076",
      "1534944645004-bf75556ce377",
      "1576092768241-dec231879fc3"
    ];

    for (const cand of candidates) {
      for (const key of sampleKeys) {
        if (cand.includes(key)) {
          return cand;
        }
      }
    }

    const id = (diag as any)?.id;
    if (id === "offline-demo-1" || id === "seed-3") return "drought-corn";
    if (id === "offline-demo-2" || id === "seed-4") return "vine-tomatoes";
    if (id === "offline-demo-3" || id === "seed-1") return "rotten-apple";
    if (id === "seed-2") return "spoiled-pumpkin";
    if (id === "seed-5") return "sweet-corn";

    return null;
  };

  const getPresetSampleId = (diag?: DiagnosisResult | null, activeUrl?: string | null, imgPreview?: string | null): string | null => {
    const rawKey = getSampleImageKey(diag, activeUrl, imgPreview);
    if (!rawKey) return null;
    if (rawKey.includes("rotten-apple") || rawKey.includes("1644504113660-54f9d01b27d6")) return "rotten-apple";
    if (rawKey.includes("drought-corn") || rawKey.includes("1789406515055-d2373d385f77")) return "drought-corn";
    if (rawKey.includes("vine-tomatoes") || rawKey.includes("1592924357228-91a4daadcfea")) return "vine-tomatoes";
    if (rawKey.includes("spoiled-pumpkin") || rawKey.includes("1675678674818-a749f21f22c5")) return "spoiled-pumpkin";
    if (rawKey.includes("sweet-corn") || rawKey.includes("1551754655-cd27e38d2076")) return "sweet-corn";
    if (rawKey.includes("green-basil") || rawKey.includes("1534944645004-bf75556ce377") || rawKey.includes("1576092768241-dec231879fc3")) return "green-basil";
    return null;
  };

  const handleSelectPreset = (url: string, presetName?: string, thumbUrl?: string) => {
    setErrorMessage(null);
    setNotCropNotice(null);
    setSelectedScanId(null);
    setDiagnosis(null);
    setActivePresetUrl(url);
    // Pre-populate in-memory cache with both English and Urdu offline diagnoses
    languageDiagnosisCacheRef.current = {
      English: { ...getOfflineDiagnosis(url, "English"), language: "English" },
      Urdu: { ...getOfflineDiagnosis(url, "Urdu"), language: "Urdu" },
    };
    setChatMessages([]);
    setReportSubTab("treatment");
    setImagePreview(url);
    setThumbnailPreview(thumbUrl || url);
    // Presets have no camera EXIF: keep observation context optional and empty
    setObservationDate("");
    setObservationTime("");
    setObservationLocation("");
    setObservationCoords(null);
    setIsDateFromExif(false);
    setIsTimeFromExif(false);
    setIsLocationFromExif(false);
    setIsDateUserEdited(false);
    setIsTimeUserEdited(false);
    setShowObservationContext(false);
    if (presetName) {
      showToast(`Loaded sample: ${presetName}`, <Sparkles className="w-4 h-4 text-emerald-400" />);
    }
  };

  const handleRunDiagnosis = async (
    overrideLangOrEvent?: string | React.MouseEvent,
    skipHistoryFlag = false
  ) => {
    if (!imagePreview) {
      setErrorMessage("Please take a photo or select a test sample first.");
      return;
    }

    const targetLang = typeof overrideLangOrEvent === "string" ? overrideLangOrEvent : selectedLanguage;

    // Check if we already have this language cached in memory
    if (languageDiagnosisCacheRef.current[targetLang]) {
      setDiagnosis(languageDiagnosisCacheRef.current[targetLang]);
      showToast(`Showing cached ${targetLang} diagnosis`, <Zap className="w-4 h-4 text-amber-400" />);
      return;
    }

    const isSampleSpecimen = Boolean(activePresetUrl);

    // If offline but analyzing a sample preset, load client-side offline diagnosis immediately
    if (!isOnline && isSampleSpecimen) {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setIsOfflineDiagnosisError(false);
      setNotCropNotice(null);
      stopSpeech();

      setTimeout(() => {
        const offlineDiag = getOfflineDiagnosis(imagePreview, targetLang);
        const diagWithLang: DiagnosisResult = {
          ...offlineDiag,
          language: targetLang,
        };
        setDiagnosis(diagWithLang);
        languageDiagnosisCacheRef.current[targetLang] = diagWithLang;
        setDiagnoseModelUsed("Gemini 3.8 Flash (Offline Sample Mode)");
        setSelectedScanId(null);
        setIsAnalyzing(false);
        showToast(
          selectedLanguage === "Urdu"
            ? "آف لائن نمونے کا معائنہ مکمل ہو گیا!"
            : "Offline sample diagnosis completed!",
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        );

        if (window.innerWidth < 1024 && reportRef.current) {
          setTimeout(() => {
            reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }, 600);
      return;
    }

    // If offline and NOT a sample preset (custom camera photo), guide them to the Vault
    if (!isOnline) {
      showToast(
        selectedLanguage === "Urdu"
          ? "آپ آف لائن ہیں۔ لائیو AI معائنے کے لیے انٹرنیٹ درکار ہے۔ اس دوران محفوظ شدہ رپورٹس دیکھنے کے لیے والٹ (Vault) چیک کریں۔"
          : "You're offline. Live AI diagnosis requires an internet connection. Meanwhile, check the Vault for saved reports.",
        <WifiOff className="w-4 h-4 text-amber-400" />
      );
      return;
    }

    try {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setIsOfflineDiagnosisError(false);
      setNotCropNotice(null);
      stopSpeech();

      const payload = {
        image: imagePreview,
        thumbnail: thumbnailPreview || imagePreview,
        language: targetLang,
        observationDate: observationDate.trim() || undefined,
        observationTime: observationTime.trim() || undefined,
        observationLocation: observationLocation.trim() || undefined,
        coordinates: observationCoords || undefined,
        skipHistory: skipHistoryFlag || isSampleSpecimen,
        isSample: isSampleSpecimen,
        userId: farmerId || undefined,
      };

      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Check if non-crop rejection or API error
      if (data.isPlantOrCrop === false || !res.ok || data.error) {
        if (data.isPlantOrCrop === false) {
          setDiagnosis(null);
          setErrorMessage(null);
          setIsOfflineDiagnosisError(false);
          const rejectionMsg =
            data.rejectionReason ||
            data.error ||
            (selectedLanguage === "Urdu"
              ? "یہ تصویر کسی فصل یا پودے کی نہیں ہے۔ براہِ کرم اپنے پودے، پتے یا زرعی پیداوار کی صاف تصویر اپلوڈ کریں۔"
              : "This photo does not appear to be a crop or plant. Please upload a clear photo of your plant or crop.");
          setNotCropNotice({ isInvalid: true, message: rejectionMsg });

          // Smooth scroll to report card on mobile
          if (window.innerWidth < 1024 && reportRef.current) {
            setTimeout(() => {
              reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          }
          return;
        }

        setDiagnosis(null);
        setNotCropNotice(null);
        if (data.isOffline) {
          setIsOfflineDiagnosisError(true);
        }
        const errMsg = data.error || (selectedLanguage === "Urdu" ? "اس وقت اے آئی سروس پر زیادہ لوڈ ہے۔ براہِ کرم دوبارہ کوشش کریں۔" : "AI model is currently experiencing high demand. Please try again.");
        setErrorMessage(errMsg);
        if (window.innerWidth < 1024 && reportRef.current) {
          setTimeout(() => {
            reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
        return;
      }

      setNotCropNotice(null);
      setErrorMessage(null);
      const diagWithLang: DiagnosisResult = {
        ...data.diagnosis,
        language: data.diagnosis?.language || targetLang,
      };
      setDiagnosis(diagWithLang);
      languageDiagnosisCacheRef.current[targetLang] = diagWithLang;

      if (data.modelUsed) {
        setDiagnoseModelUsed(data.modelUsed);
        console.log(`[AgriShield Debug] Plant Doctor model used: ${data.modelUsed}`);
      }

      // SAMPLES MUST NEVER BE STORED IN VAULT, INDEXEDDB, LOCALSTORAGE, OR FEED
      if (!skipHistoryFlag && !isSampleSpecimen && !data.isSample) {
        // Instant optimistic prepend into Vault only for original new farmer scans
        const newScanItem: ScanRecord = {
          id: data.scanId || `scan-${Date.now()}`,
          crop_name: data.diagnosis.crop_name,
          scientific_name: data.diagnosis.scientific_name,
          condition_detected: data.diagnosis.condition_detected,
          confidence_score: data.diagnosis.confidence_score,
          severity: data.diagnosis.severity,
          symptoms: data.diagnosis.symptoms,
          treatment: data.diagnosis.treatment,
          prevention_tips: data.diagnosis.prevention_tips,
          climate_impact_warning: data.diagnosis.climate_impact_warning,
          disease_origin: data.diagnosis.disease_origin,
          imageUrl: imagePreview || undefined,
          imageThumbnail: thumbnailPreview || imagePreview || undefined,
          language: targetLang,
          createdAt: new Date().toISOString(),
          agronomic_context: data.diagnosis.agronomic_context,
          location: {
            city: data.diagnosis.agronomic_context?.climate_zone || "Agricultural District",
            country: "Regional Station",
          },
          userId: farmerId,
          translations: {
            [targetLang]: diagWithLang,
          },
        };

        setHistoryFeed((prev) => [newScanItem, ...prev.filter((s) => s.id !== newScanItem.id).slice(0, 19)]);
        setSelectedScanId(newScanItem.id || null);
        saveSingleScanToVault(newScanItem, farmerId, myScanIds).catch(() => { });
        if (newScanItem.id) {
          setMyScanIds((prev) => {
            const updated = [newScanItem.id!, ...prev.filter((id) => id !== newScanItem.id)];
            try {
              localStorage.setItem("agrishield_my_scans", JSON.stringify(updated));
            } catch (e) { }
            return updated;
          });
        }
        fetchHistory(false);
      } else {
        setSelectedScanId(null);
      }

      showToast("Diagnosis completed successfully!", <CheckCircle2 className="w-4 h-4 text-emerald-400" />);

      // On mobile, automatically scroll to the Doctor's prescription
      if (window.innerWidth < 1024 && reportRef.current) {
        setTimeout(() => {
          reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      const errStr = String(err?.message || err || "").toLowerCase();
      const isNetErr = !navigator.onLine || errStr.includes("fetch") || errStr.includes("network") || errStr.includes("offline");

      // Seamless offline recovery for sample specimens
      if (isSampleSpecimen && (isNetErr || !isOnline)) {
        const offlineDiag = getOfflineDiagnosis(imagePreview, targetLang);
        const diagWithLang: DiagnosisResult = {
          ...offlineDiag,
          language: targetLang,
        };
        setDiagnosis(diagWithLang);
        languageDiagnosisCacheRef.current[targetLang] = diagWithLang;
        setDiagnoseModelUsed("Gemini 3.8 Flash (Offline Sample Mode)");
        setSelectedScanId(null);
        showToast(
          selectedLanguage === "Urdu"
            ? "آف لائن نمونے کا معائنہ مکمل ہو گیا!"
            : "Offline sample diagnosis completed!",
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        );
        if (window.innerWidth < 1024 && reportRef.current) {
          setTimeout(() => {
            reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
        return;
      }

      if (isNetErr) {
        setIsOfflineDiagnosisError(true);
      }
      setErrorMessage(
        isNetErr
          ? (selectedLanguage === "Urdu"
            ? "انٹرنیٹ کا کنکشن موجود نہیں ہے۔ کلاؤڈ AI سے رابطہ نہیں ہو سکا۔ محفوظ رپورٹس اور نسخے دیکھنے کے لیے والٹ (Vault) کھولیں۔"
            : "No internet connection detected. Cloud AI could not be reached. You can view previously saved records in the Offline Vault.")
          : (err.message || "Could not analyze the photo. Please check your network connection.")
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const translateCurrentDiagnosis = async (
    targetLang: string,
    baseDiag?: DiagnosisResult,
    explicitScanId?: string | null
  ) => {
    const diagToTranslate = baseDiag || diagnosis;
    if (!diagToTranslate) return;

    if (diagToTranslate.language === targetLang) {
      languageDiagnosisCacheRef.current[targetLang] = diagToTranslate;
      return;
    }

    // 1. Instant switch if target language diagnosis is already cached in memory
    if (languageDiagnosisCacheRef.current[targetLang]) {
      const cached = languageDiagnosisCacheRef.current[targetLang];
      setDiagnosis(cached);
      showToast(
        targetLang === "Urdu" ? "مکمل رپورٹ اردو میں تیار ہے" : `Report translated to ${targetLang}`,
        <Check className="w-4 h-4 text-emerald-400" />
      );
      return;
    }

    // 2. Check if this diagnosis corresponds to any offline sample/preset
    const sampleKey = getSampleImageKey(diagToTranslate, activePresetUrl, imagePreview);
    if (sampleKey) {
      const offlineDiag = getOfflineDiagnosis(sampleKey, targetLang);
      const transDiag: DiagnosisResult = {
        ...diagToTranslate,
        ...offlineDiag,
        language: targetLang,
      };
      setDiagnosis(transDiag);
      languageDiagnosisCacheRef.current[targetLang] = transDiag;
      showToast(
        targetLang === "Urdu" ? "مکمل رپورٹ اردو میں تیار ہے" : `Report translated to ${targetLang}`,
        <Check className="w-4 h-4 text-emerald-400" />
      );
      return;
    }

    // 3. If offline and neither cached nor a sample, guard against broken network call
    if (!isOnline) {
      showToast(
        targetLang === "Urdu"
          ? "آپ آف لائن ہیں۔ غیر محفوظ رپورٹس کے ترجمے کے لیے انٹرنیٹ درکار ہے۔"
          : "Offline: Translating new custom reports requires an internet connection.",
        <WifiOff className="w-4 h-4 text-amber-400" />
      );
      return;
    }

    // 4. Online: call cloud AI translation endpoint
    // IMPORTANT: Stricly resolve the scan ID this translation belongs to:
    // Prioritize explicitScanId -> diagToTranslate.id -> selectedScanIdRef.current
    const targetScanId =
      explicitScanId !== undefined
        ? explicitScanId
        : (diagToTranslate as any)?.id || (diagToTranslate === diagnosis ? selectedScanIdRef.current : null);

    const activeScanIdAtStart = selectedScanIdRef.current;
    const activeCropNameAtStart = diagToTranslate.crop_name;

    try {
      setIsTranslating(true);
      showToast(
        targetLang === "Urdu" ? "رپورٹ اردو میں تبدیل ہو رہی ہے..." : `Translating report to ${targetLang}...`,
        <Globe className="w-4 h-4 text-blue-400" />
      );

      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "translate",
          diagnosis: diagToTranslate,
          targetLanguage: targetLang,
          scanId: targetScanId && !targetScanId.startsWith("seed-") ? targetScanId : undefined,
        }),
      });

      const data = await res.json();
      if (data?.diagnosis) {
        const transDiag: DiagnosisResult = {
          ...diagToTranslate,
          ...data.diagnosis,
          language: data.diagnosis?.language || targetLang,
        };

        // Persist translated version to scan record in historyFeed & offline Vault
        if (targetScanId && !targetScanId.startsWith("seed-")) {
          setHistoryFeed((prev) =>
            prev.map((item) => {
              if (item.id === targetScanId) {
                const updatedTranslations = {
                  ...(item.translations || {}),
                  [item.language || "English"]: { ...item },
                  [targetLang]: transDiag,
                };
                const updatedItem = { ...item, translations: updatedTranslations };
                saveSingleScanToVault(updatedItem, farmerId, myScanIds).catch(() => {});
                return updatedItem;
              }
              return item;
            })
          );
        }

        // CRITICAL RACE-CONDITION GUARD:
        // Only update on-screen diagnosis if user is STILL viewing this exact report!
        const isStillViewingThisScan =
          (targetScanId && selectedScanIdRef.current === targetScanId) ||
          (!targetScanId && selectedScanIdRef.current === activeScanIdAtStart && diagnosis?.crop_name === activeCropNameAtStart);

        if (isStillViewingThisScan) {
          setDiagnosis(transDiag);
          languageDiagnosisCacheRef.current[targetLang] = transDiag;
          showToast(
            targetLang === "Urdu" ? "مکمل رپورٹ اردو میں تیار ہے" : `Report translated to ${targetLang}`,
            <Check className="w-4 h-4 text-emerald-400" />
          );
        } else {
          console.log(`[AgriShield] Background translation finished for ${targetScanId || activeCropNameAtStart}; active screen preserved.`);
        }
      }
    } catch (err) {
      console.warn("Translation failed:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSendChatMessage = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text || isChatLoading) return;

    setChatInput("");
    const newMessages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...chatMessages,
      { role: "user", content: text },
    ];
    setChatMessages(newMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          diagnosisContext: diagnosis,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      if (data?.reply) {
        setChatMessages([...newMessages, { role: "assistant", content: data.reply }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            selectedLanguage === "Urdu"
              ? "معاف کیجیے گا، جواب حاصل نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔"
              : "Sorry, I could not fetch a response. Please check your network and try again.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
      setTimeout(() => {
        chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const toggleVoiceRecording = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(selectedLanguage === "Urdu" ? "اس براؤزر میں آواز کی سہولت موجود نہیں۔ لکھ کر سوال پوچھیں۔" : "Voice input is not supported in this browser. Please type your question.");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage === "Urdu" ? "ur-PK" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
        showToast(selectedLanguage === "Urdu" ? "بولیں، سن رہا ہوں..." : "Listening... Speak your question", <Mic className="w-4 h-4 text-emerald-400" />);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setChatInput(transcript);
          handleSendChatMessage(transcript);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition init failed:", err);
      setIsRecording(false);
    }
  };

  const speakChatMessage = async (text: string) => {
    if (isSpeaking) {
      stopSpeech();
      return;
    }
    stopSpeech();
    try {
      setSpeechStatusText(selectedLanguage === "Urdu" ? "ڈاکٹر کراپ کی آواز تیار ہو رہی ہے..." : "Loading Dr. Crop voice...");
      const res = await fetch("/api/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          language: selectedLanguage,
        }),
      });
      const data = await res.json();
      if (res.ok && data.audioBase64) {
        const audio = new Audio(data.audioBase64);
        audioPlayerRef.current = audio;
        audio.onplay = () => {
          setIsSpeaking(true);
          setSpeechStatusText(selectedLanguage === "Urdu" ? "ڈاکٹر کراپ بول رہے ہیں..." : "Dr. Crop speaking...");
        };
        audio.onended = () => {
          setIsSpeaking(false);
          setSpeechStatusText("");
        };
        audio.onerror = () => fallbackBrowserSpeech(text);
        await audio.play();
      } else {
        fallbackBrowserSpeech(text);
      }
    } catch {
      fallbackBrowserSpeech(text);
    }
  };

  const stopSpeech = () => {
    if (audioAbortControllerRef.current) {
      audioAbortControllerRef.current.abort();
      audioAbortControllerRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setAudioLoading(false);
    setSpeechStatusText("");
  };

  // Conversational Spoken Audio
  const toggleSpeech = async () => {
    if (!diagnosis) return;

    if (isSpeaking || audioLoading) {
      stopSpeech();
      return;
    }

    stopSpeech();

    const cleanCropName = diagnosis.crop_name
      .replace(/\([a-zA-Z0-9\s.,\-\/]+\)/g, "")
      .replace(/\(.*?\)/g, "")
      .trim();
    const cleanCondition = diagnosis.condition_detected
      .replace(/\([a-zA-Z0-9\s.,\-\/]+\)/g, "")
      .replace(/\(.*?\)/g, "")
      .trim();
    const fullAction = (diagnosis.treatment.immediate_action || "")
      .replace(/\([a-zA-Z0-9\s.,\-\/]+\)/g, "")
      .trim();
    const fullRemedy = (diagnosis.treatment.organic_remedy || "")
      .replace(/\([a-zA-Z0-9\s.,\-\/]+\)/g, "")
      .trim();
    const fullWarning = (diagnosis.climate_impact_warning || "")
      .replace(/\([a-zA-Z0-9\s.,\-\/]+\)/g, "")
      .trim();

    const isHealthy =
      diagnosis.severity === "Low" ||
      cleanCondition.toLowerCase().includes("healthy") ||
      cleanCondition.toLowerCase().includes("disease-free") ||
      cleanCondition.includes("صحت مند") ||
      cleanCondition.includes("تروتازہ");

    let scriptText = "";
    if (selectedLanguage === "Urdu") {
      if (isHealthy) {
        scriptText = `سلام کسان بھائی۔ آپ کے ${cleanCropName} کی حالت: ${cleanCondition}۔ ہدایات: ${fullAction}۔ دیسی طریقہ: ${fullRemedy}۔ موسم کا دھیان رکھیں: ${fullWarning}`;
      } else {
        scriptText = `سلام کسان بھائی۔ آپ کے ${cleanCropName} پر ${cleanCondition} کا مسئلہ ہے۔ فوری طور پر یہ کرنا ہے: ${fullAction}۔ دیسی اور قدرتی علاج: ${fullRemedy}۔ موسم کا دھیان رکھیں: ${fullWarning}`;
      }
    } else if (selectedLanguage === "Hindi") {
      scriptText = `नमस्ते किसान भाई। आपके ${cleanCropName} में ${cleanCondition} کی समस्या देखी गई है। तुरंत यह काम करें: ${fullAction}۔ प्राकृतिक देसी उपाय: ${fullRemedy}۔ मौसम की सावधानी: ${fullWarning}`;
    } else if (selectedLanguage === "Spanish") {
      scriptText = `Hola agricultor. Su cultivo de ${cleanCropName} presenta signos de ${cleanCondition}. Acción hoy: ${fullAction}. Remedio casero: ${fullRemedy}. Alerta de clima: ${fullWarning}`;
    } else {
      if (isHealthy) {
        scriptText = `Hello farmer. Your ${cleanCropName} is in prime healthy condition: ${cleanCondition}. Action today: ${fullAction}. Natural care: ${fullRemedy}. Weather note: ${fullWarning}`;
      } else {
        scriptText = `Hello farmer. Your ${cleanCropName} shows signs of ${cleanCondition}. Immediate step today: ${fullAction}. Safe home remedy: ${fullRemedy}. Weather caution: ${fullWarning}`;
      }
    }

    const samplePresetId = getPresetSampleId(diagnosis, activePresetUrl, imagePreview);
    const langCode = selectedLanguage === "Urdu" ? "ur" : selectedLanguage === "English" ? "en" : null;

    // 1. Instant pre-compiled Gemini Neural TTS for sample presets (100% offline on all devices)
    if (samplePresetId && langCode) {
      const presetAudioUrl = `/audio/samples/${samplePresetId}-${langCode}.mp3`;
      try {
        const audio = new Audio(presetAudioUrl);
        audioPlayerRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setAudioLoading(false);
          setSpeechStatusText(`Speaking in ${selectedLanguage}...`);
          showToast(`Playing advice in ${selectedLanguage}`, <Volume2 className="w-4 h-4 text-emerald-400" />);
        };

        audio.onended = () => {
          setIsSpeaking(false);
          setSpeechStatusText("");
        };

        audio.onerror = () => {
          fallbackBrowserSpeech(scriptText);
        };

        await audio.play();
        return;
      } catch (err) {
        console.warn("Preset audio playback failed, falling back:", err);
      }
    }

    // 2. Client-side In-Memory Cache Hit (0 tokens, 0 delay, instant playback!)
    const cacheKey = `${selectedLanguage}:${cleanCropName}:${cleanCondition}`;
    const cachedAudio = clientAudioCacheRef.current[cacheKey];

    if (cachedAudio) {
      try {
        const audio = new Audio(cachedAudio);
        audioPlayerRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setAudioLoading(false);
          setSpeechStatusText(`Speaking in ${selectedLanguage}...`);
          showToast(`Playing advice in ${selectedLanguage}`, <Volume2 className="w-4 h-4 text-emerald-400" />);
        };

        audio.onended = () => {
          setIsSpeaking(false);
          setSpeechStatusText("");
        };

        await audio.play();
        return;
      } catch (cacheErr) {
        console.warn("Cached audio playback failed, re-fetching:", cacheErr);
      }
    }

    try {
      setAudioLoading(true);
      setSpeechStatusText("Preparing clear voice advice...");

      const controller = new AbortController();
      audioAbortControllerRef.current = controller;

      const res = await fetch("/api/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          text: scriptText,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.audioBase64) {
        if (data.modelUsed) {
          setAudioModelUsed(data.modelUsed);
          console.log(`[AgriShield Debug] Neural TTS model used: ${data.modelUsed}`);
        }

        // Store in client-side memory cache
        clientAudioCacheRef.current[cacheKey] = data.audioBase64;

        const audio = new Audio(data.audioBase64);
        audioPlayerRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setAudioLoading(false);
          setSpeechStatusText(`Speaking in ${selectedLanguage}...`);
          showToast(`Speaking advice in ${selectedLanguage}`, <Volume2 className="w-4 h-4 text-emerald-400" />);
        };

        audio.onended = () => {
          setIsSpeaking(false);
          setSpeechStatusText("");
        };

        audio.onerror = () => {
          fallbackBrowserSpeech(scriptText);
        };

        await audio.play();
        return;
      } else {
        fallbackBrowserSpeech(scriptText);
      }
    } catch (err) {
      console.warn("TTS fetch error, using device voice:", err);
      fallbackBrowserSpeech(scriptText);
    } finally {
      setAudioLoading(false);
    }
  };

  const fallbackBrowserSpeech = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeechStatusText("");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    const langMap: Record<string, string[]> = {
      English: ["en-US", "en-GB", "en"],
      Urdu: ["ur-PK", "ur", "ur-IN"],
    };

    const doSpeak = (availableVoices: SpeechSynthesisVoice[]) => {
      const prefixes = langMap[selectedLanguage] || ["en-US"];

      // Prioritize female voice to match Aoede persona
      let voice = availableVoices.find((v) => {
        const matchesLang = prefixes.some((p) => v.lang.toLowerCase().startsWith(p.toLowerCase()));
        if (!matchesLang) return false;
        const name = v.name.toLowerCase();
        return name.includes("female") || name.includes("samantha") || name.includes("zira") || name.includes("kore") || name.includes("victoria");
      });

      if (!voice) {
        voice = availableVoices.find((v) => prefixes.some((p) => v.lang.toLowerCase().startsWith(p.toLowerCase())));
      }

      if (!voice && selectedLanguage === "Urdu") {
        // Prevent system English voice from pronouncing Urdu letters with garbled phonetics
        setIsSpeaking(false);
        setSpeechStatusText("");
        showToast("آف لائن اردو آواز اس ڈیوائس پر دستیاب نہیں ہے۔ نسخہ اسکرین پر ملاحظہ فرمائیں۔");
        return;
      }

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = prefixes[0];
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeechStatusText(`Speaking in ${selectedLanguage}...`);
        showToast(`Speaking advice in ${selectedLanguage}`, <Volume2 className="w-4 h-4 text-emerald-400" />);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeechStatusText("");
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeechStatusText("");
      };

      window.speechSynthesis.speak(utterance);
    };

    const currentVoices = window.speechSynthesis.getVoices();
    if (currentVoices && currentVoices.length > 0) {
      doSpeak(currentVoices);
    } else {
      // iOS Safari and Chrome asynchronous voice loading fallback
      let resolved = false;
      const voicesChangedHandler = () => {
        if (resolved) return;
        resolved = true;
        window.speechSynthesis.removeEventListener("voiceschanged", voicesChangedHandler);
        const loadedVoices = window.speechSynthesis.getVoices();
        doSpeak(loadedVoices);
      };
      window.speechSynthesis.addEventListener("voiceschanged", voicesChangedHandler);
      setTimeout(() => {
        if (resolved) return;
        resolved = true;
        window.speechSynthesis.removeEventListener("voiceschanged", voicesChangedHandler);
        doSpeak(window.speechSynthesis.getVoices());
      }, 500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleCopyAdvice = () => {
    if (!diagnosis) return;
    const textToCopy = `AgriShield AI Report:\nCrop: ${diagnosis.crop_name}\nCondition: ${diagnosis.condition_detected}\nImmediate Action: ${diagnosis.treatment.immediate_action}\nHome Remedy: ${diagnosis.treatment.organic_remedy}\nWeather Note: ${diagnosis.climate_impact_warning}`;
    navigator.clipboard.writeText(textToCopy);
    showToast("Prescription copied to clipboard!", <Check className="w-4 h-4 text-emerald-400" />);
  };

  const handleShareWhatsApp = () => {
    if (!diagnosis) return;
    const text = `🌿 *AgriShield AI Crop Doctor Report*\n\n🌱 *Crop:* ${diagnosis.crop_name}\n🔬 *Disease:* ${diagnosis.condition_detected}\n⚡ *Action Today:* ${diagnosis.treatment.immediate_action}\n🍃 *Home Remedy:* ${diagnosis.treatment.organic_remedy}\n⛅ *Weather Alert:* ${diagnosis.climate_impact_warning}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    showToast("Opening WhatsApp share...", <Share2 className="w-4 h-4 text-emerald-400" />);
  };

  const handleLoadPastScan = (scan: ScanRecord) => {
    setErrorMessage(null);
    setNotCropNotice(null);
    selectedScanIdRef.current = scan.id || null;
    setSelectedScanId(scan.id || null);
    setChatMessages([]);
    setReportSubTab("treatment");
    setActiveTreatmentTab("immediate");

    const scanLang = scan.language || "English";
    const sampleKey = getSampleImageKey(scan, null, scan.imageUrl || scan.imageThumbnail);

    let activeDiagnosis: DiagnosisResult = scan;

    if (sampleKey) {
      setActivePresetUrl(sampleKey);
      const englishDiag: DiagnosisResult = {
        ...scan,
        ...getOfflineDiagnosis(sampleKey, "English"),
        language: "English",
      };
      const urduDiag: DiagnosisResult = {
        ...scan,
        ...getOfflineDiagnosis(sampleKey, "Urdu"),
        language: "Urdu",
      };
      languageDiagnosisCacheRef.current = {
        ...(scan.translations || {}),
        English: englishDiag,
        Urdu: urduDiag,
      };

      if (selectedLanguage === "Urdu") {
        activeDiagnosis = urduDiag;
      } else if (selectedLanguage === "English") {
        activeDiagnosis = englishDiag;
      } else if (scan.translations?.[selectedLanguage]) {
        activeDiagnosis = scan.translations[selectedLanguage];
      } else {
        activeDiagnosis = englishDiag;
      }
      setDiagnosis(activeDiagnosis);

      // If viewing in another language (e.g. Spanish, Hindi) and translation is not yet cached:
      if (selectedLanguage !== "English" && selectedLanguage !== "Urdu" && !scan.translations?.[selectedLanguage]) {
        translateCurrentDiagnosis(selectedLanguage, activeDiagnosis, scan.id || null);
      }
    } else {
      setActivePresetUrl(null);
      const existingTranslation = scan.translations?.[selectedLanguage];
      if (existingTranslation) {
        activeDiagnosis = existingTranslation;
        setDiagnosis(existingTranslation);
        languageDiagnosisCacheRef.current = {
          ...(scan.translations || {}),
          [scanLang]: scan,
          [selectedLanguage]: existingTranslation,
        };
      } else if (scanLang === selectedLanguage) {
        activeDiagnosis = scan;
        setDiagnosis(scan);
        languageDiagnosisCacheRef.current = {
          ...(scan.translations || {}),
          [scanLang]: scan,
        };
      } else {
        // Active UI language does not match this record's stored language.
        // Render immediate baseline, then auto-translate seamlessly!
        activeDiagnosis = scan;
        setDiagnosis(scan);
        languageDiagnosisCacheRef.current = {
          ...(scan.translations || {}),
          [scanLang]: scan,
        };
        translateCurrentDiagnosis(selectedLanguage, scan, scan.id || null);
      }
    }

    if (scan.agronomic_context) {
      setObservationDate(scan.agronomic_context.captured_at || "");
      setObservationTime(scan.agronomic_context.observation_time || "");
      setObservationLocation(scan.agronomic_context.climate_zone || "");
    } else {
      setObservationDate("");
      setObservationTime("");
      setObservationLocation("");
    }
    setIsDateUserEdited(false);
    setIsDateFromExif(false);
    setIsTimeUserEdited(false);
    setIsTimeFromExif(false);
    const activeImage = scan.imageUrl || scan.imageThumbnail || null;
    if (activeImage) {
      setImagePreview(activeImage);
      setThumbnailPreview(scan.imageThumbnail || scan.imageUrl || null);
    }
    stopSpeech();
    setActiveViewTab("doctor");
    showToast(
      selectedLanguage === "Urdu"
        ? `رپورٹ لوڈ ہو گئی: ${activeDiagnosis.crop_name}`
        : `Loaded report: ${activeDiagnosis.crop_name}`,
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteScan = async (e: React.MouseEvent, scan: ScanRecord) => {
    e.stopPropagation();
    if (!scan.id) return;

    const confirmMsg =
      selectedLanguage === "Urdu"
        ? `کیا آپ واقعی اس رپورٹ (${scan.crop_name}) کو اپنے والٹ سے مستقل حذف کرنا چاہتے ہیں؟`
        : `Delete "${scan.crop_name}" from your Farm Vault?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setDeletingScanId(scan.id);
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId: scan.id, userId: farmerId }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to delete scan");
      }

      setHistoryFeed((prev) => prev.filter((s) => s.id !== scan.id));
      if (scan.id) {
        deleteScanFromVault(scan.id).catch(() => { });
      }

      setMyScanIds((prev) => {
        const updated = prev.filter((id) => id !== scan.id);
        try {
          localStorage.setItem("agrishield_my_scans", JSON.stringify(updated));
        } catch (e) { }
        return updated;
      });

      if (selectedScanId === scan.id) {
        setSelectedScanId(null);
        setDiagnosis(null);
        setImagePreview(null);
      }

      // Re-fetch live history to ensure complete sync
      fetchHistory(false);

      showToast(
        selectedLanguage === "Urdu" ? "ریکارڈ والٹ سے حذف کر دیا گیا" : "Scan deleted from your vault",
        <Trash2 className="w-4 h-4 text-emerald-400" />
      );
    } catch (err: any) {
      showToast(err.message || "Failed to delete scan", <AlertTriangle className="w-4 h-4 text-rose-400" />);
    } finally {
      setDeletingScanId(null);
    }
  };

  const handleClearVaultCache = async () => {
    try {
      await clearOfflineVault();
      setHistoryFeed([]);
      languageDiagnosisCacheRef.current = {};
      showToast(
        selectedLanguage === "Urdu"
          ? "سٹوریج اور کیش کامیابی سے خالی کر دیا گیا"
          : "Offline cache cleared & storage freed",
        <Trash2 className="w-4 h-4 text-emerald-400" />
      );
      // Re-fetch clean fresh feed from server
      fetchHistory(true);
    } catch (err) {
      console.warn("Failed to clear vault cache:", err);
    }
  };

  const stopAdvisorySpeech = () => {
    if (advisoryAudioPlayerRef.current) {
      advisoryAudioPlayerRef.current.pause();
      advisoryAudioPlayerRef.current.currentTime = 0;
      advisoryAudioPlayerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsAdvisorySpeaking(false);
  };

  const fetchWeatherForCoords = async (
    lat: number,
    lon: number,
    label: string,
    mode: "gps" | "ip" | "preset" | "map"
  ) => {
    try {
      setWeatherLoading(true);
      setActiveLocationLabel(label);
      setLocationMode(mode);
      setModalLatInput(lat.toFixed(4));
      setModalLonInput(lon.toFixed(4));

      // Clear previous AI Doctor advice and stop audio whenever location changes
      setClimateAdvisory(null);
      setAdvisoryModelUsed("");
      stopAdvisorySpeech();

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&past_days=7&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,relative_humidity_2m_mean&timezone=auto`
      );

      if (!res.ok) throw new Error("Weather service unreachable");

      const data = await res.json();
      const current = data.current;
      const daily = data.daily;
      const weatherInfo = getWeatherCodeDescription(current?.weather_code || 0);

      // In Open-Meteo with past_days=7, indices 0..6 represent the preceding 7 days,
      // and index 7 (or the last available index if shorter) corresponds to today.
      const todayIdx = daily?.time ? Math.min(7, daily.time.length - 1) : 0;
      const pastRainArray: number[] = (daily?.precipitation_sum || []).slice(0, todayIdx);
      const pastHumidityArray: number[] = (daily?.relative_humidity_2m_mean || []).slice(0, todayIdx);
      const pastWeekRainfall = pastRainArray.reduce((acc: number, val: number) => acc + (val || 0), 0);
      const pastWeekAvgHumidity = pastHumidityArray.length > 0
        ? Math.round(pastHumidityArray.reduce((acc: number, val: number) => acc + (val || 0), 0) / pastHumidityArray.length)
        : Math.round(current?.relative_humidity_2m ?? 65);

      let dampDays = 0;
      for (let i = 0; i < pastRainArray.length; i++) {
        if ((pastRainArray[i] && pastRainArray[i] > 1.0) || (pastHumidityArray[i] && pastHumidityArray[i] > 75)) {
          dampDays++;
        }
      }

      const telemetry: ClimateTelemetry = {
        temperature: Math.round(current?.temperature_2m ?? 26),
        humidity: Math.round(current?.relative_humidity_2m ?? 65),
        precipitation_probability:
          daily?.precipitation_probability_max?.[todayIdx] !== undefined
            ? daily.precipitation_probability_max[todayIdx]
            : Math.round((current?.precipitation ?? 0) * 20),
        precipitation_mm: current?.precipitation ?? 0,
        wind_speed: Math.round(current?.wind_speed_10m ?? 10),
        weather_condition: weatherInfo.condition,
        weather_code: current?.weather_code || 0,
        temp_max: daily?.temperature_2m_max?.[todayIdx] !== undefined ? Math.round(daily.temperature_2m_max[todayIdx]) : undefined,
        temp_min: daily?.temperature_2m_min?.[todayIdx] !== undefined ? Math.round(daily.temperature_2m_min[todayIdx]) : undefined,
        location_name: label,
        latitude: lat,
        longitude: lon,
        past_week_rainfall_mm: Math.round(pastWeekRainfall * 10) / 10,
        past_week_avg_humidity: pastWeekAvgHumidity,
        consecutive_damp_days: dampDays,
      };

      setWeatherTelemetry(telemetry);
    } catch (err: any) {
      console.warn("Open-Meteo fetch error, using fallback telemetry:", err);
      setWeatherTelemetry({
        temperature: 28,
        humidity: 74,
        precipitation_probability: 30,
        precipitation_mm: 0,
        wind_speed: 12,
        weather_condition: "Warm & Humid",
        weather_code: 2,
        location_name: label,
        latitude: lat,
        longitude: lon,
        past_week_rainfall_mm: 14.2,
        past_week_avg_humidity: 76,
        consecutive_damp_days: 3,
        isOfflineFallback: true,
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  const fallbackToIpLocation = async (customToastMsg?: string) => {
    try {
      // Primary: our own server route /api/locate (safe from CORS & mobile HTTP mixed content)
      const res = await fetch("/api/locate", { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          const label = data.label || data.city || "Regional Farm Zone (IP)";
          await fetchWeatherForCoords(data.latitude, data.longitude, label, "ip");
          showToast(customToastMsg || `Weather locked to ${label} (IP)`, <Globe className="w-4 h-4 text-blue-400" />);
          return;
        }
      }
    } catch (e) {
      console.warn("Internal /api/locate failed, trying secondary fallback:", e);
    }

    try {
      const res2 = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(4500) });
      if (res2.ok) {
        const d = await res2.json();
        if (d.latitude && d.longitude) {
          const label = d.city ? `${d.city}, ${d.country || ""}` : "Regional Farm Zone (IP)";
          await fetchWeatherForCoords(d.latitude, d.longitude, label, "ip");
          showToast(`Weather locked to ${label} (IP)`, <Globe className="w-4 h-4 text-blue-400" />);
          return;
        }
      }
    } catch {
      // ignore
    }

    await fetchWeatherForCoords(
      AGRICULTURAL_PRESETS[0].lat,
      AGRICULTURAL_PRESETS[0].lon,
      AGRICULTURAL_PRESETS[0].name,
      "preset"
    );
    showToast("Switched to Agricultural Preset", <MapPin className="w-4 h-4 text-emerald-400" />);
  };

  const handleDetectLocation = () => {
    if (!isOnline) {
      showToast(
        selectedLanguage === "Urdu"
          ? "انٹرنیٹ منقطع ہے۔ لائیو موسم کے لیے انٹرنیٹ سے جڑیں"
          : "Offline: Connect to internet for live climate radar",
        <WifiOff className="w-4 h-4 text-amber-400" />
      );
      return;
    }

    setWeatherLoading(true);

    const isSecure = typeof window !== "undefined" && window.isSecureContext;

    if (isSecure && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          let label = "Local Farm (GPS)";
          try {
            const res = await fetch(`/api/locate?lat=${latitude}&lon=${longitude}`);
            if (res.ok) {
              const data = await res.json();
              if (data.label) label = data.label;
            }
          } catch { }
          await fetchWeatherForCoords(latitude, longitude, label, "gps");
          showToast(`Local Farm GPS weather locked: ${label}`, <CheckCircle2 className="w-4 h-4 text-emerald-400" />);
        },
        async (err) => {
          console.warn("GPS access denied or unavailable, attempting auto-IP fallback...", err.message);
          await fallbackToIpLocation("GPS denied. Auto-locked via Regional IP");
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    } else {
      // Insecure context (e.g. mobile visiting http://192.168.100.128:3000 over WiFi)
      // Mobile Chrome/Safari strictly block navigator.geolocation on non-HTTPS origins.
      fallbackToIpLocation(isSecure ? undefined : "Mobile HTTP requires HTTPS for GPS. Auto-locked via IP");
    }
  };

  const handleDetectCurrentObservationRegion = async () => {
    setIsDetectingRegion(true);

    const isSecure = typeof window !== "undefined" && window.isSecureContext;

    if (isSecure && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            let regionLabel = "Local Farm (GPS)";
            try {
              const res = await fetch(`/api/locate?lat=${latitude}&lon=${longitude}`);
              if (res.ok) {
                const data = await res.json();
                if (data.label) regionLabel = data.label;
              }
            } catch { }

            setObservationLocation(regionLabel);
            setObservationCoords({ lat: latitude, lon: longitude });
            await fetchWeatherForCoords(latitude, longitude, regionLabel, "gps");
            showToast(`Local Farm GPS locked: ${regionLabel}`, <CheckCircle2 className="w-4 h-4 text-emerald-400" />);
          } catch (err) {
            console.warn("GPS reverse geocoding error:", err);
            setObservationLocation("Local Farm (GPS)");
            showToast("Local Farm GPS locked", <CheckCircle2 className="w-4 h-4 text-emerald-400" />);
          } finally {
            setIsDetectingRegion(false);
          }
        },
        async (err) => {
          console.warn("GPS access denied or blocked, falling back to IP:", err.message);
          await fallbackObservationToIp("GPS denied. Auto-locked via Regional IP");
          setIsDetectingRegion(false);
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    } else {
      // Insecure context (e.g. mobile over HTTP) where GPS is blocked by browser policy
      await fallbackObservationToIp(
        isSecure ? "GPS unavailable. Auto-locked via Regional IP" : "Mobile HTTP requires HTTPS for GPS. Auto-locked via IP"
      );
      setIsDetectingRegion(false);
    }
  };

  const fallbackObservationToIp = async (toastMsg?: string) => {
    try {
      const res = await fetch("/api/locate");
      if (res.ok) {
        const data = await res.json();
        const label = data.label || data.city || "Regional Farm Zone (IP)";
        setObservationLocation(label);
        if (data.latitude && data.longitude) {
          setObservationCoords({ lat: data.latitude, lon: data.longitude });
          await fetchWeatherForCoords(data.latitude, data.longitude, label, "ip");
        }
        showToast(toastMsg || `Location locked via IP: ${label}`, <Globe className="w-4 h-4 text-blue-400" />);
        return;
      }
    } catch (e) {
      console.warn("IP locate error:", e);
    }

    setObservationLocation(activeLocationLabel || "Punjab Farm Belt");
    showToast("GPS blocked. Using Regional Farm Preset", <MapPin className="w-4 h-4 text-emerald-400" />);
  };

  const handleSearchCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      showToast(
        selectedLanguage === "Urdu"
          ? "انٹرنیٹ منقطع ہے۔ شہر تلاش کرنے کے لیے انٹرنیٹ درکار ہے"
          : "Offline: Connect to internet to search regions",
        <WifiOff className="w-4 h-4 text-amber-400" />
      );
      return;
    }
    if (!citySearchInput.trim()) return;

    try {
      setIsSearchingCity(true);
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(citySearchInput.trim())}&count=1&language=en&format=json`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const first = data.results[0];
        const label = `${first.name}${first.admin1 ? `, ${first.admin1}` : ""}${first.country ? `, ${first.country}` : ""}`;
        await fetchWeatherForCoords(first.latitude, first.longitude, label, "preset");
        showToast(`Weather updated for ${first.name}`, <CloudSun className="w-4 h-4 text-emerald-400" />);
        setCitySearchInput("");
      } else {
        showToast("City not found. Try another region or preset.");
      }
    } catch (err) {
      console.warn("City search error:", err);
      showToast("City search temporarily unavailable.");
    } finally {
      setIsSearchingCity(false);
    }
  };

  const handleModalSearchCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSearchInput.trim()) return;

    try {
      setModalSearching(true);
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(modalSearchInput.trim())}&count=1&language=en&format=json`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const first = data.results[0];
        setModalLatInput(Number(first.latitude).toFixed(4));
        setModalLonInput(Number(first.longitude).toFixed(4));
        const label = `${first.name}${first.admin1 ? `, ${first.admin1}` : ""}${first.country ? `, ${first.country}` : ""}`;
        await fetchWeatherForCoords(first.latitude, first.longitude, label, "map");
        setObservationLocation(label);
        setObservationCoords({ lat: first.latitude, lon: first.longitude });
        showToast(`Map centered on ${first.name}`, <MapPin className="w-4 h-4 text-emerald-400" />);
      } else {
        showToast("City not found. Enter coordinates manually below.");
      }
    } catch (err) {
      console.warn("Modal search error:", err);
    } finally {
      setModalSearching(false);
    }
  };

  const handleApplyCustomCoords = async () => {
    const lat = parseFloat(modalLatInput);
    const lon = parseFloat(modalLonInput);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      showToast("Please enter valid Latitude (-90 to 90) and Longitude (-180 to 180)");
      return;
    }
    let customLabel = `Field (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`;
    try {
      const res = await fetch(`/api/locate?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const d = await res.json();
        if (d.label) customLabel = d.label;
      }
    } catch { }

    setObservationCoords({ lat, lon });
    await fetchWeatherForCoords(lat, lon, customLabel, "map");
    setObservationLocation(customLabel);
    setIsLocationModalOpen(false);
    showToast(`Location locked to ${customLabel}`, <CheckCircle2 className="w-4 h-4 text-emerald-400" />);
  };

  const handleAskClimateDoctor = async () => {
    if (!weatherTelemetry) return;

    try {
      setAdvisoryLoading(true);

      const payload: ClimateAdvisoryPayload = {
        temperature: weatherTelemetry.temperature,
        humidity: weatherTelemetry.humidity,
        precipitation_probability: weatherTelemetry.precipitation_probability,
        wind_speed: weatherTelemetry.wind_speed,
        weather_condition: weatherTelemetry.weather_condition,
        crop_name: diagnosis?.crop_name || "",
        language: selectedLanguage,
        past_week_rainfall_mm: weatherTelemetry.past_week_rainfall_mm,
        past_week_avg_humidity: weatherTelemetry.past_week_avg_humidity,
        consecutive_damp_days: weatherTelemetry.consecutive_damp_days,
        location_name: weatherTelemetry.location_name,
      };

      const res = await fetch("/api/climate-advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.advisory) {
        setClimateAdvisory(data.advisory);
        if (data.modelUsed || data.source) {
          const m = data.modelUsed || data.source;
          setAdvisoryModelUsed(m);
          console.log(`[AgriShield Debug] Climate Doctor model used: ${m}`);
        }
        showToast("AI Weather Advisory Formulated", <CloudSun className="w-4 h-4 text-emerald-400" />);
      } else {
        showToast("Could not generate advisory. Please try again.");
      }
    } catch (err) {
      console.error("Advisory error:", err);
      showToast("Advisory service temporarily unavailable.");
    } finally {
      setAdvisoryLoading(false);
    }
  };

  const toggleAdvisorySpeech = async () => {
    if (isAdvisorySpeaking) {
      stopAdvisorySpeech();
      return;
    }

    if (!climateAdvisory || !climateAdvisory.spoken_script) return;

    stopSpeech();
    stopAdvisorySpeech();

    const scriptText = climateAdvisory.spoken_script;

    try {
      setAdvisoryAudioLoading(true);

      const res = await fetch("/api/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: scriptText,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.audioBase64) {
        if (data.modelUsed) {
          setAudioModelUsed(data.modelUsed);
          console.log(`[AgriShield Debug] Climate Audio model used: ${data.modelUsed}`);
        }
        const audio = new Audio(data.audioBase64);
        advisoryAudioPlayerRef.current = audio;

        audio.onplay = () => {
          setIsAdvisorySpeaking(true);
          setAdvisoryAudioLoading(false);
          showToast(`Speaking weather advisory in ${selectedLanguage}`, <Volume2 className="w-4 h-4 text-emerald-400" />);
        };

        audio.onended = () => {
          setIsAdvisorySpeaking(false);
        };

        audio.onerror = () => {
          fallbackBrowserSpeech(scriptText);
        };

        await audio.play();
        return;
      } else {
        fallbackBrowserSpeech(scriptText);
      }
    } catch (err) {
      console.warn("Fallback to browser voice for advisory:", err);
      fallbackBrowserSpeech(scriptText);
    } finally {
      setAdvisoryAudioLoading(false);
    }
  };

  // Auto-fetch weather when switching to Advisory tab if not loaded
  useEffect(() => {
    if (activeViewTab === "advisory" && !weatherTelemetry && !weatherLoading) {
      if (isOnline) {
        handleDetectLocation();
      } else {
        showToast(
          selectedLanguage === "Urdu"
            ? "انٹرنیٹ منقطع ہے۔ لائیو موسم کے لیے انٹرنیٹ سے جڑیں"
            : "Offline: Connect to internet for live climate radar",
          <WifiOff className="w-4 h-4 text-amber-400" />
        );
      }
    }
  }, [activeViewTab, weatherTelemetry, weatherLoading, isOnline, selectedLanguage]);

  const getSeverityBadge = (severity: string, condition?: string) => {
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
      case "moderate": {
        const isDrought =
          condition?.toLowerCase().includes("drought") ||
          condition?.toLowerCase().includes("scorch") ||
          condition?.toLowerCase().includes("سوکھا");
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          dot: "bg-amber-500",
          badge: isDrought ? "Drought Stress" : "Moderate Risk",
          meterColor: "bg-amber-500",
          textColor: "text-amber-600",
        };
      }
      case "low":
      default:
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          dot: "bg-emerald-500",
          badge: "Low Risk",
          meterColor: "bg-emerald-500",
          textColor: "text-emerald-600",
        };
    }
  };

  // Filtered Vault Scans
  const filteredVaultScans = historyFeed.filter((scan) => {
    const matchesSearch =
      !vaultSearch.trim() ||
      scan.crop_name?.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      scan.condition_detected?.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      scan.scientific_name?.toLowerCase().includes(vaultSearch.toLowerCase());

    const matchesSeverity =
      vaultSeverityFilter === "all" ||
      scan.severity?.toLowerCase() === vaultSeverityFilter.toLowerCase();

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen text-slate-800 pb-0 sm:pb-0 font-sans selection:bg-emerald-500 selection:text-white bg-[#f8fafc] overflow-x-hidden">
      {/* Floating Interactive Toast Feedback */}
      {toast && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto bg-slate-900/95 text-white px-4 sm:px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 flex items-center space-x-2 text-xs font-bold transition-all max-w-[92vw] sm:max-w-md w-auto animate-in fade-in slide-in-from-top-2">
            {toast.icon || <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            <span className="truncate">{toast.message}</span>
          </div>
        </div>
      )}

      {/* High-Resolution Interactive Specimen Lightbox Modal */}
      {isLightboxOpen && imagePreview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200 select-none overflow-hidden"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsLightboxOpen(false);
          }}
        >
          {/* Lightbox Top Header Bar */}
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md flex-shrink-0 z-10">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                  {diagnosis?.crop_name || "Specimen Pathology Inspection"}
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {diagnosis?.condition_detected
                    ? `${diagnosis.condition_detected} • ${formatConfidencePercent(diagnosis.confidence_score)}% Certain`
                    : "Pinch or drag to inspect high-resolution leaf texture"}
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {diagnosis && (diagnosis.lesion_boxes?.length || diagnosis.lesion_box) && (
                <button
                  type="button"
                  onClick={() => setShowPathologyBoxes((prev) => !prev)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${showPathologyBoxes
                      ? "bg-amber-400 text-slate-950 border-amber-300"
                      : "bg-slate-800 text-slate-300 border-white/20 hover:bg-slate-700"
                    }`}
                >
                  <Target className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">{showPathologyBoxes ? "Targets ON" : "Targets OFF"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Viewport */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-4"
            onWheel={(e) => {
              e.preventDefault();
              setLightboxZoom((prev) => {
                const delta = e.deltaY < 0 ? 0.25 : -0.25;
                const nextZoom = Math.min(4, Math.max(1, prev + delta));
                if (nextZoom === 1) setLightboxPan({ x: 0, y: 0 });
                return Math.round(nextZoom * 100) / 100;
              });
            }}
            onMouseDown={(e) => {
              if (lightboxZoom > 1) {
                setIsPanning(true);
                setPanStart({ x: e.clientX - lightboxPan.x, y: e.clientY - lightboxPan.y });
              }
            }}
            onMouseMove={(e) => {
              if (isPanning && lightboxZoom > 1) {
                setLightboxPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
              }
            }}
            onMouseUp={() => setIsPanning(false)}
            onMouseLeave={() => setIsPanning(false)}
            onDoubleClick={(e) => {
              e.preventDefault();
              if (lightboxZoom > 1) {
                setLightboxZoom(1);
                setLightboxPan({ x: 0, y: 0 });
              } else {
                setLightboxZoom(2);
              }
            }}
          >
            <div
              className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-100 ease-out"
              style={{
                transform: `scale(${lightboxZoom}) translate(${lightboxPan.x / lightboxZoom}px, ${lightboxPan.y / lightboxZoom}px)`,
              }}
            >
              <img
                src={imagePreview}
                alt="High-Res Specimen Inspection"
                className="max-h-[82vh] max-w-[94vw] object-contain rounded-xl shadow-2xl pointer-events-none select-none border border-white/10"
                onError={(e) => {
                  if (thumbnailPreview && e.currentTarget.src !== thumbnailPreview) {
                    e.currentTarget.src = thumbnailPreview;
                  }
                }}
              />

              {/* Pathology Target Highlights inside Lightbox */}
              {showPathologyBoxes &&
                diagnosis &&
                (diagnosis?.lesion_boxes || (diagnosis?.lesion_box ? [diagnosis.lesion_box] : []))
                  ?.filter((box) => box && box.length === 4 && box[2] > box[0] && box[3] > box[1])
                  ?.map((box, idx, arr) => (
                    <div
                      key={idx}
                      className="absolute pointer-events-none border-2 border-amber-400 bg-amber-400/25 rounded-lg shadow-[0_0_16px_rgba(251,191,36,0.7)] animate-pulse"
                      style={{
                        top: `${box[0] / 10}%`,
                        left: `${box[1] / 10}%`,
                        height: `${Math.max(4, (box[2] - box[0]) / 10)}%`,
                        width: `${Math.max(4, (box[3] - box[1]) / 10)}%`,
                      }}
                    >
                      <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider shadow-sm flex items-center space-x-1 whitespace-nowrap">
                        <span>{arr.length > 1 ? `Spot #${idx + 1}` : "Target"}</span>
                      </span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Lightbox Bottom Zoom Control Floating Bar */}
          <div className="h-16 px-4 flex items-center justify-center flex-shrink-0 z-10">
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-white/15 px-3 py-1.5 rounded-2xl shadow-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  setLightboxZoom((prev) => {
                    const next = Math.max(1, prev - 0.5);
                    if (next === 1) setLightboxPan({ x: 0, y: 0 });
                    return next;
                  });
                }}
                disabled={lightboxZoom <= 1}
                className="p-2 rounded-xl text-white hover:bg-white/15 disabled:opacity-40 transition-colors cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-emerald-400 px-2 min-w-[52px] text-center">
                {Math.round(lightboxZoom * 100)}%
              </span>

              <button
                type="button"
                onClick={() => setLightboxZoom((prev) => Math.min(4, prev + 0.5))}
                disabled={lightboxZoom >= 4}
                className="p-2 rounded-xl text-white hover:bg-white/15 disabled:opacity-40 transition-colors cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-white/20 mx-1" />

              <button
                type="button"
                onClick={() => {
                  setLightboxZoom(1);
                  setLightboxPan({ x: 0, y: 0 });
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/15 transition-colors flex items-center space-x-1 cursor-pointer"
                title="Reset zoom to 1:1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Farm Location & Interactive OpenStreetMap Picker Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Select Farm Location</h3>
                  <p className="text-[11px] text-slate-500">OpenStreetMap preview, village search, or direct GPS</p>
                </div>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* City / District Search */}
              <form onSubmit={handleModalSearchCity} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search city, district, or tehsil..."
                    value={modalSearchInput}
                    onChange={(e) => setModalSearchInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={modalSearching || !modalSearchInput.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors"
                >
                  {modalSearching ? "..." : "Search"}
                </button>
              </form>

              {/* OpenStreetMap Interactive Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold px-0.5">
                  <span>OpenStreetMap Field Location</span>
                  <span className="text-[10px] text-slate-400">Centered on active pin</span>
                </div>
                <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  {(() => {
                    const lat = parseFloat(modalLatInput) || 31.5204;
                    const lon = parseFloat(modalLonInput) || 74.3587;
                    const bbox = `${(lon - 0.08).toFixed(4)},${(lat - 0.08).toFixed(4)},${(lon + 0.08).toFixed(4)},${(lat + 0.08).toFixed(4)}`;
                    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(4)},${lon.toFixed(4)}`;
                    return (
                      <iframe
                        title="Farm Location Map"
                        src={src}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    );
                  })()}
                </div>
              </div>

              {/* Direct GPS Coordinates Entry */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block text-[11px]">Exact Field Coordinates:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">Latitude (°N/S)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={modalLatInput}
                      onChange={(e) => setModalLatInput(e.target.value)}
                      placeholder="e.g. 31.5204"
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">Longitude (°E/W)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={modalLonInput}
                      onChange={(e) => setModalLonInput(e.target.value)}
                      placeholder="e.g. 74.3587"
                      className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Regional Presets */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 block text-[11px]">Quick Farm Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {AGRICULTURAL_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setModalLatInput(p.lat.toFixed(4));
                        setModalLonInput(p.lon.toFixed(4));
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all font-medium text-slate-700"
                    >
                      <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-4 sm:px-5 py-3.5 border-t border-slate-100 bg-slate-50/80 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  handleDetectLocation();
                  setIsLocationModalOpen(false);
                }}
                className="w-full sm:w-auto text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors active:scale-95 transform-gpu cursor-pointer flex-shrink-0"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="whitespace-nowrap">Auto-Detect IP</span>
              </button>

              <button
                type="button"
                onClick={handleApplyCustomCoords}
                disabled={weatherLoading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 transform-gpu disabled:opacity-50 cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                Apply & Lock Weather
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Glassmorphic Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo & Simple Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-glow flex-shrink-0 transition-transform hover:scale-105">
              <IoniconsLeaf className="w-5 h-5" mirrored={true} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 truncate">
                  AgriShield
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 uppercase tracking-wider flex-shrink-0">
                  AI Doctor
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block font-medium truncate">
                Crop Pathology, Neural Audio & Climate Advisory for Farmers
              </p>
            </div>
          </div>

          {/* Right Action Bar: Network Status + Install App + Language Dropdown */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Network Offline Status Indicator: Display only when offline (Icon-only on mobile, full label on desktop) */}
            {!isOnline && (
              <div
                className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold border transition-colors shadow-2xs select-none whitespace-nowrap flex-shrink-0 bg-amber-50 text-amber-800 border-amber-200"
                title={selectedLanguage === "Urdu" ? "آف لائن والٹ فعال ہے" : "Offline Vault Active"}
                aria-label="Offline Mode"
              >
                <WifiOff className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span className="hidden sm:inline sm:ml-1.5">
                  {selectedLanguage === "Urdu" ? "آف لائن والٹ" : "Offline Vault"}
                </span>
              </div>
            )}

            {!isInstalled && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-2xs transition-all active:scale-95 flex-shrink-0"
                title="Install app on your phone"
                aria-label="Install App"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="hidden sm:inline sm:ml-1.5">Install PWA</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="relative flex items-center flex-shrink-0">
              <div className="absolute left-2 sm:left-2.5 pointer-events-none text-slate-500">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <select
                aria-label="Choose Language"
                value={selectedLanguage}
                onChange={(e) => {
                  const newLang = e.target.value;
                  if (newLang === selectedLanguage) return;

                  stopSpeech();
                  setSelectedLanguage(newLang);
                  // 1. If this specimen was already diagnosed in this language, switch instantly with 0 tokens and 0 API calls!
                  if (languageDiagnosisCacheRef.current[newLang]) {
                    setDiagnosis(languageDiagnosisCacheRef.current[newLang]);
                    showToast(
                      newLang === "Urdu" ? "مکمل رپورٹ اردو میں تیار ہے" : `Language set to ${newLang}`,
                      <Globe className="w-4 h-4 text-emerald-400" />
                    );
                    return;
                  }
                  // 2. If a diagnosis is currently displayed, delegate translation to translateCurrentDiagnosis
                  if (diagnosis) {
                    translateCurrentDiagnosis(newLang, diagnosis, selectedScanIdRef.current);
                  } else {
                    showToast(`Language set to ${newLang}`, <Globe className="w-4 h-4 text-emerald-400" />);
                  }
                }}
                className="pl-7 sm:pl-8 pr-7 sm:pr-8 py-1.5 sm:py-2 bg-slate-100/90 hover:bg-slate-200/80 text-slate-900 font-bold text-xs sm:text-sm rounded-xl border border-slate-300/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none shadow-sm transition-all"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 sm:right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6 pb-28 sm:pb-12">
        {/* App-Style Segmented Navigation (Inspired by YAFTY / TastyTabs) */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="w-full sm:w-auto flex items-center p-1 sm:p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/70 shadow-inner gap-1">
            <button
              onClick={() => setActiveViewTab("doctor")}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all min-w-0 ${activeViewTab === "doctor"
                ? "bg-white text-emerald-950 shadow-sm scale-[1.02]"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <Sprout className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Plant Doctor</span>
              <span className="sm:hidden truncate">Doctor</span>
              {diagnosis && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
              )}
            </button>

            <button
              onClick={() => setActiveViewTab("vault")}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all min-w-0 ${activeViewTab === "vault"
                ? "bg-white text-emerald-950 shadow-sm scale-[1.02]"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <Layers className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Farm Vault</span>
              <span className="sm:hidden truncate">Vault</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold border border-slate-200 flex-shrink-0">
                {historyFeed.length}
              </span>
            </button>

            <button
              onClick={() => setActiveViewTab("advisory")}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all min-w-0 ${activeViewTab === "advisory"
                ? "bg-white text-emerald-950 shadow-sm scale-[1.02]"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <CloudSun className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Climate Shield</span>
              <span className="sm:hidden truncate">Climate</span>
            </button>
          </div>

          {/* Quick Stats Pill (Desktop Only) */}
          <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-500 font-medium bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>AI Pathology Engine: Gemini 3</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Neural Audio Active</span>
            </span>
          </div>
        </div>

        {/* VIEW 1: PLANT DOCTOR (Balanced 50/50 Workspace) */}
        {activeViewTab === "doctor" && (
          <div className="space-y-6">
            {/* Specimen & Report Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

              {/* LEFT COLUMN (6 Cols): Specimen Inspection Bay */}
              <div className="lg:col-span-6 space-y-5">
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-4 sm:p-6 space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="min-w-0 flex-1 pr-1">
                      <h2 className="text-sm sm:text-lg font-black text-slate-900 flex items-center space-x-1.5 sm:space-x-2 truncate">
                        <Camera className="w-4 h-4 sm:w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">Specimen Inspection Bay</span>
                      </h2>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate sm:whitespace-normal">
                        Capture or select a damaged plant leaf to analyze
                      </p>
                    </div>

                    {imagePreview && (
                      <button
                        onClick={() => {
                          resetSpecimenAndDiagnosis();
                          showToast("Inspection bay cleared");
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 shadow-2xs transition-all active:scale-95 flex-shrink-0 whitespace-nowrap"
                        title="Clear specimen and change photo"
                      >
                        <X className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">Change Photo</span>
                        <span className="sm:hidden">Change</span>
                      </button>
                    )}
                  </div>

                  {/* Visual Diagnostic Viewfinder Frame */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center min-h-[280px] sm:min-h-[340px] p-4 text-center ${dragActive
                      ? "border-emerald-500 bg-emerald-50/70 scale-[1.01]"
                      : imagePreview
                        ? "border-emerald-500/40 bg-slate-950"
                        : "border-slate-300 hover:border-emerald-500/80 bg-slate-50/70 hover:bg-slate-50"
                      }`}
                  >
                    {imagePreview ? (
                      <div
                        ref={imageContainerRef}
                        className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden flex items-center justify-center bg-black"
                      >
                        {/* High-Tech Diagnostic Corner Reticles */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl pointer-events-none z-20" />
                        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr pointer-events-none z-20" />
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl pointer-events-none z-20" />
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br pointer-events-none z-20" />

                        {/* Pathology Target Toggle */}
                        {diagnosis && (diagnosis.lesion_boxes?.length || diagnosis.lesion_box) && (
                          <button
                            type="button"
                            onClick={() => setShowPathologyBoxes((prev) => !prev)}
                            className={`absolute top-3 right-3 z-30 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-[10px] font-black border backdrop-blur-md shadow-md transition-all flex items-center space-x-1 cursor-pointer min-h-[34px] ${showPathologyBoxes
                                ? "bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/20"
                                : "bg-slate-900/80 text-slate-300 border-white/20 hover:bg-slate-800"
                              }`}
                            title="Toggle visual pathology target boxes"
                            aria-label="Toggle visual pathology target boxes"
                          >
                            <Target className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="hidden sm:inline">{showPathologyBoxes ? "Targets: ON" : "Targets: OFF"}</span>
                          </button>
                        )}

                        <img
                          src={imagePreview}
                          alt="Plant Specimen"
                          className="w-full h-full object-contain select-none"
                          onLoad={(e) => updateImageRenderRect(e.currentTarget)}
                          onError={(e) => {
                            if (thumbnailPreview && e.currentTarget.src !== thumbnailPreview) {
                              e.currentTarget.src = thumbnailPreview;
                            }
                          }}
                        />

                        {/* Animated Laser Scanning Beam */}
                        {isAnalyzing && (
                          <div className="absolute inset-0 pointer-events-none z-10">
                            <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] absolute laser-scanner" />
                            <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[0.5px]" />
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:24px_24px]" />
                          </div>
                        )}

                        {/* Visual Pathology Target Boxes (Pixel-mapped with fallback) */}
                        {!isAnalyzing &&
                          showPathologyBoxes &&
                          diagnosis &&
                          (diagnosis?.lesion_boxes || (diagnosis?.lesion_box ? [diagnosis.lesion_box] : []))
                            ?.filter((box) => box && box.length === 4 && box[2] > box[0] && box[3] > box[1])
                            ?.map((box, idx, arr) => {
                              const top = imageRenderRect
                                ? `${imageRenderRect.top + (box[0] / 1000) * imageRenderRect.height}px`
                                : `${box[0] / 10}%`;
                              const left = imageRenderRect
                                ? `${imageRenderRect.left + (box[1] / 1000) * imageRenderRect.width}px`
                                : `${box[1] / 10}%`;
                              const height = imageRenderRect
                                ? `${Math.max(18, ((box[2] - box[0]) / 1000) * imageRenderRect.height)}px`
                                : `${(box[2] - box[0]) / 10}%`;
                              const width = imageRenderRect
                                ? `${Math.max(18, ((box[3] - box[1]) / 1000) * imageRenderRect.width)}px`
                                : `${(box[3] - box[1]) / 10}%`;

                              return (
                                <div
                                  key={idx}
                                  className="absolute pointer-events-none z-20 border-2 border-amber-400 bg-amber-400/20 rounded-lg shadow-[0_0_14px_rgba(251,191,36,0.6)] transition-all animate-pulse"
                                  style={{
                                    top,
                                    left,
                                    height,
                                    width,
                                  }}
                                >
                                  <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider shadow-sm flex items-center space-x-1 whitespace-nowrap">
                                    <span>{arr.length > 1 ? `Spot #${idx + 1}` : "Pathology Target"}</span>
                                  </span>
                                </div>
                              );
                            })}

                        {!selectedScanId && (
                          <div className="absolute bottom-3 left-3 z-20 bg-slate-900/85 backdrop-blur-md text-white text-xs p-2 sm:px-3 sm:py-1.5 rounded-xl flex items-center space-x-1.5 sm:space-x-2 border border-white/10 shadow-lg">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span className="font-semibold hidden sm:inline">Specimen Loaded</span>
                          </div>
                        )}

                        {/* High-Res Lightbox Inspection Trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            setLightboxZoom(1);
                            setLightboxPan({ x: 0, y: 0 });
                            setIsLightboxOpen(true);
                          }}
                          className="absolute bottom-3 right-3 z-20 bg-slate-900/85 hover:bg-slate-800 active:scale-95 text-white text-xs p-2 sm:px-3 sm:py-1.5 rounded-xl flex items-center space-x-1.5 border border-white/15 shadow-lg backdrop-blur-md transition-all cursor-pointer"
                          title="Inspect leaf in fullscreen zoom"
                          aria-label="Inspect leaf in fullscreen zoom"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="font-bold text-[11px] hidden sm:inline">Inspect & Zoom</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4 py-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shadow-sm transition-transform hover:scale-105">
                          <Camera className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm sm:text-base font-black text-slate-800">
                            Take a photo or choose from gallery
                          </p>
                          <p className="text-xs text-slate-500 max-w-sm font-medium">
                            Auto-compressed on device for instant AI diagnosis
                          </p>
                        </div>

                        {/* Hidden native file inputs */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileInput}
                        />
                        <input
                          ref={cameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={handleFileInput}
                        />

                        {/* Tactile Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-sm pt-2">
                          <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all whitespace-nowrap"
                          >
                            <Camera className="w-4 h-4 flex-shrink-0" />
                            <span>Snap Camera</span>
                          </button>

                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-sm whitespace-nowrap"
                          >
                            <Upload className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>Choose Photo</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compact Horizontal Specimen Shelf (Presets) */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="font-bold text-slate-700 flex items-center space-x-1.5 truncate">
                        <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="truncate">Quick Test Samples (No Photo Needed):</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex-shrink-0">
                        Tap to test
                      </span>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 pt-0.5 -mx-1 px-1 snap-x snap-mandatory scroll-smooth">
                      {SAMPLE_PRESETS.map((preset) => {
                        const isSelected = activePresetUrl === preset.url;
                        return (
                          <button
                            key={preset.name}
                            onClick={() => handleSelectPreset(preset.url, preset.name, preset.thumbnailUrl)}
                            className={`flex-shrink-0 flex items-center space-x-2.5 px-3 py-2 rounded-2xl border transition-all text-left snap-start active:scale-95 transform-gpu select-none cursor-pointer ${isSelected
                              ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30 shadow-sm"
                              : "border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300"
                              }`}
                          >
                            <img
                              src={preset.thumbnailUrl || preset.url}
                              alt={preset.name}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                            />
                            <div className="pr-1 min-w-0">
                              <div className="font-bold text-slate-900 text-xs whitespace-nowrap">
                                {preset.name}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium flex items-center space-x-1 whitespace-nowrap">
                                <span className={`w-1.5 h-1.5 rounded-full ${preset.dotColor} flex-shrink-0`} />
                                <span className="truncate">{preset.badge}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Field Observation Timing & Region Accordion (Staging only, hidden on Vault records) */}
                  {!selectedScanId && (
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-3 transition-all">
                      <button
                        type="button"
                        onClick={() => setShowObservationContext((prev) => !prev)}
                        className="w-full flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center space-x-2 min-w-0 pr-2">
                          <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                            {selectedLanguage === "Urdu"
                              ? "اختیاری: تصویر کی تاریخ، وقت اور زرعی علاقہ"
                              : "Optional: Photo Date, Time & Agro-Region"}
                          </span>
                          {(observationDate || observationTime || observationLocation) && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 flex-shrink-0">
                              {selectedLanguage === "Urdu" ? "فعال" : "Active"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-flex items-center gap-1">
                            <CloudRain className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <span>{selectedLanguage === "Urdu" ? "7 روزہ موسم دستیاب" : "Unlocks 7-Day Microclimate"}</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showObservationContext ? "rotate-180 text-emerald-600" : ""
                              }`}
                          />
                        </div>
                      </button>

                      {showObservationContext && (
                        <div className="pt-2 border-t border-slate-200/70 space-y-3 animate-in fade-in duration-200">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                            {/* 1. Agro-Region */}
                            <div className="sm:col-span-6 space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                  <span>{selectedLanguage === "Urdu" ? "فارم / علاقہ" : "Agro-Region"}</span>
                                  {isLocationFromExif && observationLocation && (
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 flex-shrink-0 inline-flex items-center gap-0.5">
                                      <Camera className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />
                                      <span>EXIF</span>
                                    </span>
                                  )}
                                </label>
                                <button
                                  type="button"
                                  onClick={handleDetectCurrentObservationRegion}
                                  disabled={isDetectingRegion}
                                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center space-x-1 disabled:opacity-50 cursor-pointer"
                                  title="Auto-detect via GPS or IP"
                                >
                                  {isDetectingRegion ? (
                                    <>
                                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                                      <span>Detecting...</span>
                                    </>
                                  ) : (
                                    <span>{selectedLanguage === "Urdu" ? "GPS تلاش" : "Auto GPS"}</span>
                                  )}
                                </button>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    value={observationLocation}
                                    onChange={(e) => {
                                      setObservationLocation(e.target.value);
                                      setIsLocationFromExif(false);
                                    }}
                                    placeholder={activeLocationLabel ? `e.g. ${activeLocationLabel}` : "e.g. Multan, Punjab"}
                                    className="w-full text-xs pl-2.5 pr-2 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-800 shadow-2xs placeholder:text-slate-400 placeholder:font-normal"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsLocationModalOpen(true)}
                                  className="flex-shrink-0 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer font-bold"
                                  title="Pick location or village on OpenStreetMap"
                                >
                                  <MapIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="text-[11px] whitespace-nowrap">{selectedLanguage === "Urdu" ? "نقشہ" : "Map"}</span>
                                </button>
                              </div>
                            </div>

                            {/* 2. Observation Date */}
                            <div className="sm:col-span-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                  <span>{selectedLanguage === "Urdu" ? "تاریخ" : "Date"}</span>
                                  {isDateFromExif && observationDate && (
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 flex-shrink-0 inline-flex items-center gap-0.5">
                                      <Camera className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />
                                      <span>EXIF</span>
                                    </span>
                                  )}
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const today = new Date().toISOString().split("T")[0];
                                    setObservationDate(today);
                                    setIsDateUserEdited(true);
                                    setIsDateFromExif(false);
                                  }}
                                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                                >
                                  {selectedLanguage === "Urdu" ? "آج" : "Today"}
                                </button>
                              </div>
                              <input
                                type="date"
                                value={observationDate}
                                onChange={(e) => {
                                  setObservationDate(e.target.value);
                                  setIsDateUserEdited(true);
                                  setIsDateFromExif(false);
                                }}
                                className="w-full text-xs px-2.5 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-800 shadow-2xs"
                              />
                            </div>

                            {/* 3. Observation Time */}
                            <div className="sm:col-span-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                                  <span>{selectedLanguage === "Urdu" ? "وقت" : "Time"}</span>
                                  {isTimeFromExif && observationTime && (
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 flex-shrink-0 inline-flex items-center gap-0.5">
                                      <Camera className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />
                                      <span>EXIF</span>
                                    </span>
                                  )}
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const now = new Date();
                                    const hh = String(now.getHours()).padStart(2, "0");
                                    const mm = String(now.getMinutes()).padStart(2, "0");
                                    setObservationTime(`${hh}:${mm}`);
                                    setIsTimeUserEdited(true);
                                    setIsTimeFromExif(false);
                                  }}
                                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                                >
                                  {selectedLanguage === "Urdu" ? "ابھی" : "Now"}
                                </button>
                              </div>
                              <input
                                type="time"
                                value={observationTime}
                                onChange={(e) => {
                                  setObservationTime(e.target.value);
                                  setIsTimeUserEdited(true);
                                  setIsTimeFromExif(false);
                                }}
                                className="w-full text-xs px-2.5 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-800 shadow-2xs"
                              />
                            </div>
                          </div>

                          {/* Footer: Privacy notice & Clear Button */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                            <span className="flex items-center space-x-1 min-w-0 pr-2">
                              <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                              <span className="truncate">
                                {selectedLanguage === "Urdu"
                                  ? "مقام کا موسم AI ڈاکٹر کی تشخیص میں شامل ہوگا"
                                  : "Microclimate weather will be factored into diagnosis"}
                              </span>
                            </span>
                            {(observationDate || observationTime || observationLocation || observationCoords) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setObservationDate("");
                                  setObservationTime("");
                                  setObservationLocation("");
                                  setObservationCoords(null);
                                  setIsDateUserEdited(false);
                                  setIsDateFromExif(false);
                                  setIsTimeUserEdited(false);
                                  setIsTimeFromExif(false);
                                  setIsLocationFromExif(false);
                                }}
                                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer flex items-center space-x-1 flex-shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>{selectedLanguage === "Urdu" ? "صاف کریں" : "Clear"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Primary Diagnosis Execution CTA */}
                  <div className="space-y-2 pt-1">
                    <button
                      disabled={!imagePreview || isAnalyzing || !!selectedScanId}
                      onClick={handleRunDiagnosis}
                      className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center space-x-3 shadow-lg transition-all ${!imagePreview || isAnalyzing || !!selectedScanId
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/25 active:scale-[0.98]"
                        }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Consulting AI Plant Doctor...</span>
                        </>
                      ) : selectedScanId ? (
                        <>
                          <Bookmark className="w-5 h-5 text-slate-400" />
                          <span>Viewing Cached Vault Record</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Check Plant Health Now</span>
                        </>
                      )}
                    </button>

                    {selectedScanId && (
                      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-medium px-1 gap-1 pt-1">
                        <span>To run fresh scan, upload a new photo or select a sample.</span>
                        {Boolean(farmerId && (diagnosis as any)?.userId === farmerId) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              if (diagnosis) {
                                handleDeleteScan(e, diagnosis as ScanRecord);
                              }
                            }}
                            className="text-rose-600 hover:text-rose-700 font-bold flex items-center space-x-1 cursor-pointer flex-shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{selectedLanguage === "Urdu" ? "یہ رپورٹ حذف کریں" : "Delete from Vault"}</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Stepped Progress Indicator */}
                    {isAnalyzing && (
                      <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center space-y-1.5 animate-in fade-in">
                        <p className="text-xs font-bold text-emerald-800 flex items-center justify-center space-x-1.5">
                          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                          <span>{ANALYSIS_STEPS[analysisStepIndex]}</span>
                        </p>
                        <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden max-w-xs mx-auto">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                            style={{
                              width: `${((analysisStepIndex + 1) / ANALYSIS_STEPS.length) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (6 Cols): Plant Doctor Clinical Report */}
              <div ref={reportRef} className="lg:col-span-6 space-y-5 lg:sticky lg:top-24 self-start">
                {isAnalyzing ? (
                  // Polished Shimmer Skeleton
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 animate-pulse shadow-card">
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-36 bg-slate-200 rounded-lg" />
                      <div className="h-6 w-28 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-20 w-full bg-slate-100 rounded-2xl" />
                    <div className="h-32 w-full bg-slate-100 rounded-2xl" />
                    <div className="h-20 w-full bg-slate-100 rounded-2xl" />
                    <div className="h-12 w-full bg-slate-200 rounded-xl" />
                  </div>
                ) : diagnosis ? (
                  // Rich Clinical Doctor Report Card
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-5">

                    {/* Report Header: Crop Title, Scientific Name, Severity Chip */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center space-x-1">
                            <Sprout className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Plant Doctor Prescription</span>
                          </span>
                          {diagnoseModelUsed && (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold border border-slate-200 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Model: {diagnoseModelUsed}</span>
                            </span>
                          )}
                          {isTranslating && (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300 animate-pulse">
                              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                              <span>{selectedLanguage === "Urdu" ? "اردو میں ترجمہ ہو رہا ہے..." : "Translating..."}</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 leading-tight break-words">
                          {diagnosis.crop_name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium italic truncate">
                          Scientific: {diagnosis.scientific_name}
                        </p>
                        {diagnosis.agronomic_context && (
                          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 pt-1">
                            {diagnosis.agronomic_context.season && (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/80 text-[10px] font-bold">
                                <Leaf className="w-3 h-3 text-amber-700 flex-shrink-0" />
                                <span>{diagnosis.agronomic_context.season}</span>
                              </span>
                            )}
                            {diagnosis.agronomic_context.captured_at && (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200/80 text-[10px] font-bold">
                                <Calendar className="w-3 h-3 text-blue-700 flex-shrink-0" />
                                <span>{diagnosis.agronomic_context.captured_at}</span>
                              </span>
                            )}
                            {diagnosis.agronomic_context.observation_time && (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200/80 text-[10px] font-bold">
                                <Clock className="w-3 h-3 text-purple-700 flex-shrink-0" />
                                <span>{diagnosis.agronomic_context.observation_time}</span>
                              </span>
                            )}
                            {diagnosis.agronomic_context.climate_zone && (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200/80 text-[10px] font-bold truncate max-w-[200px]">
                                <MapPin className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                                <span className="truncate">{diagnosis.agronomic_context.climate_zone}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {(() => {
                        const badgeInfo = getSeverityBadge(diagnosis.severity, diagnosis.condition_detected);
                        return (
                          <div
                            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${badgeInfo.bg} shadow-sm self-start sm:self-auto flex-shrink-0`}
                          >
                            <span className={`w-2 h-2 rounded-full ${badgeInfo.dot} animate-ping`} />
                            <span>{badgeInfo.badge}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Condition Detected & Doctor Confidence Meter */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
                        <span className="font-bold text-slate-500 uppercase tracking-wide text-[11px] sm:text-xs flex-shrink-0">
                          Condition Detected:
                        </span>
                        <span className="font-black text-slate-900 text-sm sm:text-base break-words text-left sm:text-right">
                          {diagnosis.condition_detected}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                          <span>Doctor Confidence Score</span>
                          <span className="font-black text-slate-800">
                            {formatConfidencePercent(diagnosis.confidence_score)}% Certain
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ${getSeverityBadge(diagnosis.severity, diagnosis.condition_detected).meterColor
                              }`}
                            style={{ width: `${formatConfidencePercent(diagnosis.confidence_score)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Segmented Sub-Tabs Navigation (TastyTabs Style) */}
                    <div className="flex rounded-2xl bg-slate-200/80 p-1 text-xs font-bold text-slate-600 gap-1 border border-slate-300/70 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setReportSubTab("treatment")}
                        className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 min-w-0 active:scale-[0.98] transform-gpu cursor-pointer ${reportSubTab === "treatment"
                            ? "bg-white text-emerald-950 shadow-sm font-black scale-[1.02] border border-slate-200/50"
                            : "hover:text-slate-900 text-slate-600"
                          }`}
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="hidden sm:inline truncate">{selectedLanguage === "Urdu" ? "علاج و تدابیر" : "Treatment & Action"}</span>
                        <span className="sm:hidden truncate">{selectedLanguage === "Urdu" ? "علاج" : "Treatment"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReportSubTab("origin")}
                        className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 min-w-0 active:scale-[0.98] transform-gpu cursor-pointer ${reportSubTab === "origin"
                            ? "bg-white text-emerald-950 shadow-sm font-black scale-[1.02] border border-slate-200/50"
                            : "hover:text-slate-900 text-slate-600"
                          }`}
                      >
                        <Activity className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="hidden sm:inline truncate">{selectedLanguage === "Urdu" ? "وجوہات و علامات" : "Cause & Symptoms"}</span>
                        <span className="sm:hidden truncate">{selectedLanguage === "Urdu" ? "وجوہات" : "Causes"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReportSubTab("chat")}
                        className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 min-w-0 relative active:scale-[0.98] transform-gpu cursor-pointer ${reportSubTab === "chat"
                            ? isCurrentReportOwner
                              ? "bg-emerald-600 text-white shadow-sm font-black scale-[1.02]"
                              : "bg-slate-800 text-white shadow-sm font-black scale-[1.02]"
                            : isCurrentReportOwner
                              ? "hover:text-slate-900 text-emerald-800 bg-emerald-50/70"
                              : "hover:text-slate-900 text-slate-600 bg-slate-100/70"
                          }`}
                      >
                        {isCurrentReportOwner ? (
                          <Bot className={`w-3.5 h-3.5 flex-shrink-0 ${reportSubTab === "chat" ? "text-white" : "text-emerald-600"}`} />
                        ) : (
                          <Lock className={`w-3.5 h-3.5 flex-shrink-0 ${reportSubTab === "chat" ? "text-white" : "text-slate-500"}`} />
                        )}
                        <span className="hidden sm:inline truncate">{selectedLanguage === "Urdu" ? "ڈاکٹر چیٹ و آواز" : "Ask Dr. Crop"}</span>
                        <span className="sm:hidden truncate">{selectedLanguage === "Urdu" ? "چیٹ" : "Dr. Chat"}</span>
                        {isCurrentReportOwner ? (
                          <span className="flex h-1.5 w-1.5 relative flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold">
                            {selectedLanguage === "Urdu" ? "مقفل" : "Locked"}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Sub-Tab 1: Treatment & Action */}
                    {reportSubTab === "treatment" && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {/* Treatment Segmented Pill Tabs (TastyTabs Style) */}
                        <div className="space-y-3">
                          <div className="flex rounded-2xl bg-slate-200/80 p-1 text-[11px] sm:text-xs font-bold text-slate-600 gap-1 border border-slate-300/70 shadow-inner">
                            <button
                              onClick={() => setActiveTreatmentTab("immediate")}
                              className={`flex-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl transition-all flex items-center justify-center space-x-1 min-w-0 whitespace-nowrap active:scale-[0.98] transform-gpu cursor-pointer ${activeTreatmentTab === "immediate"
                                  ? "bg-white text-slate-950 shadow-sm font-black scale-[1.02] border border-slate-200/50"
                                  : "hover:text-slate-900 text-slate-600"
                                }`}
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              <span className="truncate">{selectedLanguage === "Urdu" ? "فوری اقدام" : "Do Today"}</span>
                            </button>
                            <button
                              onClick={() => setActiveTreatmentTab("organic")}
                              className={`flex-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl transition-all flex items-center justify-center space-x-1 min-w-0 whitespace-nowrap active:scale-[0.98] transform-gpu cursor-pointer ${activeTreatmentTab === "organic"
                                  ? "bg-white text-emerald-950 shadow-sm font-black scale-[1.02] border border-slate-200/50"
                                  : "hover:text-slate-900 text-slate-600"
                                }`}
                            >
                              <Sprout className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span className="truncate">{selectedLanguage === "Urdu" ? "دیسی علاج" : "Home Remedy"}</span>
                            </button>
                            <button
                              onClick={() => setActiveTreatmentTab("chemical")}
                              className={`flex-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl transition-all flex items-center justify-center space-x-1 min-w-0 whitespace-nowrap active:scale-[0.98] transform-gpu cursor-pointer ${activeTreatmentTab === "chemical"
                                  ? "bg-white text-blue-950 shadow-sm font-black scale-[1.02] border border-slate-200/50"
                                  : "hover:text-slate-900 text-slate-600"
                                }`}
                            >
                              <FlaskConical className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                              <span className="truncate">{selectedLanguage === "Urdu" ? "زرعی سپرے" : "Shop Spray"}</span>
                            </button>
                          </div>

                          <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50/90 text-xs text-slate-800 leading-relaxed min-h-[96px] flex flex-col justify-between space-y-2">
                            <div>
                              {activeTreatmentTab === "immediate" && (
                                <div className="space-y-1.5">
                                  <span className="font-black text-slate-900 flex items-center space-x-1.5">
                                    <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                    <span>{selectedLanguage === "Urdu" ? "فوری تدابیر:" : "Immediate First-Aid:"}</span>
                                  </span>
                                  <p className="font-medium text-slate-700 leading-relaxed">
                                    {diagnosis.treatment.immediate_action}
                                  </p>
                                </div>
                              )}
                              {activeTreatmentTab === "organic" && (
                                <div className="space-y-1.5">
                                  <span className="font-black text-emerald-900 flex items-center space-x-1.5">
                                    <Sprout className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                    <span>{selectedLanguage === "Urdu" ? "دیسی و قدرتی علاج:" : "Natural Safe Remedy:"}</span>
                                  </span>
                                  <p className="font-medium text-slate-700 leading-relaxed">
                                    {diagnosis.treatment.organic_remedy}
                                  </p>
                                </div>
                              )}
                              {activeTreatmentTab === "chemical" && (
                                <div className="space-y-1.5">
                                  <span className="font-black text-blue-900 flex items-center space-x-1.5">
                                    <FlaskConical className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                    <span>{selectedLanguage === "Urdu" ? "کیمیکل و زرعی دوا سپرے:" : "Chemical / Ag-Shop Spray:"}</span>
                                  </span>
                                  <p className="font-medium text-slate-700 leading-relaxed">
                                    {diagnosis.treatment.chemical_alternative}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Prescribed Action Footer Badge */}
                            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 gap-2">
                              <span className="truncate">{selectedLanguage === "Urdu" ? "زبان: اردو" : `Language: ${selectedLanguage}`}</span>
                              <span className="text-emerald-700 font-bold flex-shrink-0 inline-flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span>{selectedLanguage === "Urdu" ? "فصل کے لیے محفوظ" : "Safe for Farms"}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Treatment Cost Economics & Harvest Impact Card */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5 text-xs font-black text-slate-800">
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>{selectedLanguage === "Urdu" ? "فصل کی معیشت و تخمینہ لاگت" : "Action Economics & Yield Protection"}</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {selectedLanguage === "Urdu" ? "35%–50% متوقع بچاؤ" : "35%–50% Yield Saved"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {/* Option 1: Organic / Home Remedy */}
                            <div className="p-2.5 rounded-xl bg-white border border-emerald-200/70 shadow-2xs space-y-1">
                              <div className="flex items-center justify-between font-bold text-emerald-900">
                                <span>{selectedLanguage === "Urdu" ? "دیسی نسخہ" : "Home Remedy"}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                  {selectedLanguage === "Urdu" ? "مفت / کم خرچ" : "Free / Low"}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-600 leading-tight">
                                {selectedLanguage === "Urdu" ? "3 سے 5 دن میں اثر، کوئی کیمیائی باقیات نہیں" : "3-5 day onset, zero chemical residue"}
                              </p>
                            </div>

                            {/* Option 2: Commercial Ag-Spray */}
                            <div className="p-2.5 rounded-xl bg-white border border-blue-200/70 shadow-2xs space-y-1">
                              <div className="flex items-center justify-between font-bold text-blue-900">
                                <span>{selectedLanguage === "Urdu" ? "مارکیٹ سپرے" : "Shop Spray"}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                                  {selectedLanguage === "Urdu" ? "درمیانہ خرچ" : "Moderate"}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-600 leading-tight">
                                {selectedLanguage === "Urdu" ? "24-48 گھنٹے میں بیماری کا فوری ٹھہراؤ" : "24-48 hr rapid arrest of active spread"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Weather Warning Card */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-1 text-xs text-amber-900">
                          <div className="font-black flex items-center space-x-1.5 text-amber-800">
                            <CloudSun className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span>{selectedLanguage === "Urdu" ? "موسمی اثرات و الرٹ:" : "Climate Shield Weather Alert:"}</span>
                          </div>
                          <p className="leading-relaxed text-amber-950 font-medium">
                            {diagnosis.climate_impact_warning}
                          </p>
                        </div>

                        {/* Prevention Tips */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{selectedLanguage === "Urdu" ? "دیگر پودوں کو کیسے محفوظ رکھیں؟" : "How to Protect Other Crops:"}</span>
                          </h4>
                          <ul className="text-xs text-slate-700 space-y-1.5">
                            {diagnosis.prevention_tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start space-x-2 bg-slate-50/60 p-2 rounded-xl border border-slate-100">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Sub-Tab 2: Cause & Symptoms */}
                    {reportSubTab === "origin" && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {/* Leaf Symptoms */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                            <Activity className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{selectedLanguage === "Urdu" ? "پتوں پر ظاہر علامات:" : "Visible Leaf Symptoms:"}</span>
                          </h4>
                          <ul className="space-y-1.5">
                            {diagnosis.symptoms.map((symptom, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-slate-700 flex items-start space-x-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100"
                              >
                                <span className="text-emerald-600 font-black">•</span>
                                <span className="leading-relaxed font-medium">{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Microclimate Observation & Past-Week Incubation Snapshot */}
                        {diagnosis.agronomic_context?.weather_snapshot && (
                          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-emerald-50/70 to-teal-50/80 border border-blue-200/70 space-y-2 text-xs">
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <span className="font-black text-slate-800 flex items-center space-x-1.5">
                                <CloudRain className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                <span>{selectedLanguage === "Urdu" ? "معائنے کے وقت مقامی موسم:" : "Microclimate at Specimen Observation:"}</span>
                              </span>
                              <span className="text-[11px] font-extrabold text-blue-900 bg-white/90 px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs inline-flex items-center gap-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1">
                                  <CloudSun className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                  <span>{diagnosis.agronomic_context.weather_snapshot.temp}°C</span>
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Droplets className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                  <span>{diagnosis.agronomic_context.weather_snapshot.humidity}% {selectedLanguage === "Urdu" ? "نمی" : "Humidity"}</span>
                                </span>
                                {diagnosis.agronomic_context.weather_snapshot.precipitation_mm !== undefined && diagnosis.agronomic_context.weather_snapshot.precipitation_mm > 0 ? (
                                  <>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1">
                                      <CloudRain className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                      <span>{diagnosis.agronomic_context.weather_snapshot.precipitation_mm}mm</span>
                                    </span>
                                  </>
                                ) : null}
                              </span>
                            </div>
                            {diagnosis.agronomic_context.weather_snapshot.past_week_rainfall_mm !== undefined && (
                              <div className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-xl border border-blue-100 flex items-center justify-between flex-wrap gap-1.5">
                                <span className="font-bold text-slate-700 inline-flex items-center gap-1">
                                  <CloudRain className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                  <span>{selectedLanguage === "Urdu" ? "گزشتہ 7 دن کی بارش:" : "7-Day Pre-Observation Rainfall:"}</span>{" "}
                                  <span className="text-blue-700">{diagnosis.agronomic_context.weather_snapshot.past_week_rainfall_mm}mm</span>
                                </span>
                                <span className="font-bold text-slate-700 inline-flex items-center gap-1">
                                  <Droplets className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                  <span>{selectedLanguage === "Urdu" ? "اوسط نمی:" : "7-Day Avg Humidity:"}</span>{" "}
                                  <span className="text-emerald-700">{diagnosis.agronomic_context.weather_snapshot.past_week_avg_humidity}%</span>
                                </span>
                                {diagnosis.agronomic_context.weather_snapshot.consecutive_damp_days !== undefined && (
                                  <span className="font-bold text-slate-700 inline-flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-amber-600 flex-shrink-0" />
                                    <span>{selectedLanguage === "Urdu" ? "نم دن:" : "Damp Days:"}</span>{" "}
                                    <span className="text-amber-700">{diagnosis.agronomic_context.weather_snapshot.consecutive_damp_days}/7 {selectedLanguage === "Urdu" ? "دن" : "days"}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Disease Origin & Environmental Pathology (Why This Happened) */}
                        {diagnosis.disease_origin && (
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-emerald-50/40 border border-emerald-200/80 shadow-sm space-y-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shadow-2xs flex-shrink-0">
                                <Microscope className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                              </div>
                              <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                                  <span>
                                    {selectedLanguage === "Urdu"
                                      ? "یہ بیماری کیوں لگی؟ (ماحولیاتی و موسمی اسباب)"
                                      : "Why This Happened: Microclimate & Disease Origin"}
                                  </span>
                                </h4>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  {selectedLanguage === "Urdu"
                                    ? "پودے کی بافتوں پر مرض کا حملہ اور پچھلے ہفتے کے موسمی عناصر کا اثر"
                                    : "Clinical pathology explanation correlating pathogen incubation with weekly weather"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 text-xs">
                              {/* Biological Reason */}
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                                <div className="font-black text-slate-800 flex items-center space-x-1.5">
                                  <Sprout className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 inline mr-1" />
                                  <span>
                                    {selectedLanguage === "Urdu" ? "بیماری کی حیاتیاتی وجہ:" : "Biological Cause & Spread:"}
                                  </span>
                                </div>
                                <p className="text-slate-700 leading-relaxed font-medium">
                                  {diagnosis.disease_origin.why_it_happened}
                                </p>
                              </div>

                              {/* Weather Correlation */}
                              <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200/70 space-y-1">
                                <div className="font-black text-blue-900 flex items-center space-x-1.5">
                                  <CloudSun className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 inline mr-1" />
                                  <span>
                                    {selectedLanguage === "Urdu" ? "اس کیس میں موسمی عناصر کا عمل دخل:" : "Why In This Case (Weather Elements):"}
                                  </span>
                                </div>
                                <p className="text-blue-950 leading-relaxed font-medium">
                                  {diagnosis.disease_origin.weather_correlation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Healthy Benchmark & Recovery Comparison Card */}
                        {diagnosis.healthy_comparison && (
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/50 to-slate-50 border border-emerald-200/90 shadow-2xs space-y-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shadow-2xs flex-shrink-0">
                                <Sprout className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                              </div>
                              <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                                  <span>
                                    {selectedLanguage === "Urdu"
                                      ? "صحت مند پودے کا موازنہ اور صحت یابی کے آثار"
                                      : "Healthy Benchmark & Recovery Guide"}
                                  </span>
                                </h4>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  {selectedLanguage === "Urdu"
                                    ? "معیاری صحت مند پتے کی پہچان اور علاج کے بعد بحالی کا جائزہ"
                                    : "Visual baseline traits and post-treatment recovery monitoring"}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {/* Healthy Baseline Traits */}
                              <div className="p-3 rounded-xl bg-white/90 border border-emerald-200/70 space-y-1.5 shadow-2xs">
                                <div className="font-black text-emerald-900 flex items-center space-x-1.5 text-[11px] uppercase tracking-wide">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                  <span>{selectedLanguage === "Urdu" ? "صحت مند پودے کی نشانیاں:" : "Healthy Baseline Traits:"}</span>
                                </div>
                                <ul className="space-y-1 text-slate-700">
                                  {diagnosis.healthy_comparison.healthy_traits.map((trait, idx) => (
                                    <li key={idx} className="flex items-start space-x-1.5 leading-relaxed">
                                      <span className="text-emerald-500 font-black text-xs leading-none mt-0.5">•</span>
                                      <span className="font-medium text-[11px] sm:text-xs">{trait}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Key Pathology Contrast */}
                              <div className="p-3 rounded-xl bg-white/90 border border-amber-200/70 space-y-1.5 shadow-2xs">
                                <div className="font-black text-amber-900 flex items-center space-x-1.5 text-[11px] uppercase tracking-wide">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                  <span>{selectedLanguage === "Urdu" ? "بیماری کا نمایاں فرق:" : "Key Visual Contrast:"}</span>
                                </div>
                                <p className="text-slate-700 font-medium text-[11px] sm:text-xs leading-relaxed">
                                  {diagnosis.healthy_comparison.key_difference}
                                </p>
                              </div>
                            </div>

                            {/* Recovery Signs & Monitoring Timeline */}
                            <div className="p-3 rounded-xl bg-emerald-100/60 border border-emerald-300/80 flex items-start space-x-2.5 text-xs text-emerald-950">
                              <Sprout className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                              <div className="space-y-0.5 min-w-0">
                                <div className="font-black text-emerald-900 text-[11px] uppercase tracking-wide">
                                  {selectedLanguage === "Urdu" ? "علاج کے 5 سے 7 دن بعد بہتری کے آثار:" : "Recovery Signs in 5–7 Days:"}
                                </div>
                                <p className="font-medium text-slate-800 text-[11px] sm:text-xs leading-relaxed">
                                  {diagnosis.healthy_comparison.recovery_signs}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sub-Tab 3: Ask Dr. Crop (Voice & Chat Assistant) */}
                    {reportSubTab === "chat" && (
                      !isCurrentReportOwner ? (
                        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 via-white to-amber-50/30 border border-slate-200/90 text-center space-y-4 shadow-sm animate-in fade-in duration-200">
                          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 mx-auto flex items-center justify-center shadow-xs">
                            <Lock className="w-6 h-6" />
                          </div>
                          <div className="space-y-1.5 max-w-md mx-auto">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider">
                              <span>{selectedLanguage === "Urdu" ? "کمیونٹی زرعی آرکائیو" : "Community Crop Archive"}</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-black text-slate-900">
                              {selectedLanguage === "Urdu"
                                ? "ڈاکٹر کراپ سے لائیو مشاورت صرف اس فصل کے مالک کے لیے ہے"
                                : "Dr. Crop Chat is Reserved for the Crop Owner"}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              {selectedLanguage === "Urdu"
                                ? "یہ رپورٹ فارم والٹ سے بطور معلوماتی کیس اسٹڈی کھولی گئی ہے۔ آپ اوپر دیا گیا دیسی علاج، کیمیکل اور موسمی الرٹ مکمل دیکھ سکتے ہیں۔ اپنے پودے کا معائنہ کروانے اور ڈاکٹر کراپ سے سوال پوچھنے کے لیے نیا پتا اسکین کریں۔"
                                : "This diagnosis is an archived community record. You can study all recommended treatments, remedies, and pathogen causes above. To ask Dr. Crop customized questions about your own field, scan a new leaf."}
                            </p>
                          </div>

                          <div className="pt-2 flex justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveViewTab("doctor");
                                setImagePreview(null);
                                setActivePresetUrl(null);
                                setSelectedScanId(null);
                                setDiagnosis(null);
                                setChatMessages([]);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                              <Camera className="w-4 h-4" />
                              <span>{selectedLanguage === "Urdu" ? "اپنا پودا اسکین کریں" : "Scan Your Own Crop"}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3.5 animate-in fade-in duration-200">
                          {/* Dr. Crop Header Status */}
                          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/80 flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <div className="relative">
                                <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm">
                                  <Bot className="w-5 h-5" />
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                              </div>
                              <div>
                                <div className="font-black text-slate-900 text-xs sm:text-sm flex items-center space-x-1.5">
                                  <span>{selectedLanguage === "Urdu" ? "ڈاکٹر کراپ (زرعی معاون)" : "Dr. Crop (Plant Doctor)"}</span>
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md font-bold">AI Active</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  {selectedLanguage === "Urdu"
                                    ? `موضوع: ${diagnosis.crop_name} کا علاج اور احتیاط`
                                    : `Consulting on ${diagnosis.crop_name}`}
                                </p>
                              </div>
                            </div>

                            {chatMessages.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setChatMessages([])}
                                className="text-[10px] text-slate-400 hover:text-slate-600 font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white"
                              >
                                {selectedLanguage === "Urdu" ? "نئی گفتگو" : "Clear"}
                              </button>
                            )}
                          </div>

                          {/* Chat Messages Box */}
                          <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 min-h-[220px] max-h-[380px] overflow-y-auto space-y-3 text-xs">
                            {/* Welcome Greeting */}
                            <div className="flex items-start space-x-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                                <Bot className="w-3.5 h-3.5" />
                              </div>
                              <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-200/80 shadow-2xs text-slate-800 leading-relaxed max-w-[85%] font-medium">
                                {selectedLanguage === "Urdu" ? (
                                  <span>
                                    السلام علیکم! میں آپ کا زرعی معاون ڈاکٹر ہوں۔ آپ اپنے اس پودے (<strong className="text-emerald-800">{diagnosis.crop_name}</strong>) یا اس کے علاج کے بارے میں کوئی بھی سوال پوچھ سکتے ہیں۔ بولنے کے لیے مائیک دبائیں یا نیچے لکھیں۔
                                  </span>
                                ) : (
                                  <span>
                                    Hello! I am Dr. Crop. You can ask any question about this <strong className="text-emerald-800">{diagnosis.crop_name}</strong> or its treatment. Tap the microphone to speak or type below.
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Message List */}
                            {chatMessages.map((msg, idx) => (
                              <div
                                key={idx}
                                className={`flex items-start space-x-2 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                                  }`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${msg.role === "user"
                                      ? "bg-slate-800 text-white"
                                      : "bg-emerald-600 text-white"
                                    }`}
                                >
                                  {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                </div>

                                <div
                                  className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] font-medium ${msg.role === "user"
                                      ? "bg-slate-900 text-white rounded-tr-sm shadow-sm"
                                      : "bg-white text-slate-800 rounded-tl-sm border border-slate-200/80 shadow-2xs"
                                    }`}
                                >
                                  <p className="whitespace-pre-wrap">{msg.content}</p>
                                  {msg.role === "assistant" && (
                                    <div className="pt-2 mt-1.5 border-t border-slate-100 flex items-center justify-between">
                                      <button
                                        type="button"
                                        onClick={() => speakChatMessage(msg.content)}
                                        className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 hover:text-emerald-800 font-bold"
                                      >
                                        <Volume2 className="w-3 h-3" />
                                        <span>{selectedLanguage === "Urdu" ? "آواز سنیں" : "Listen"}</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Typing indicator */}
                            {isChatLoading && (
                              <div className="flex items-start space-x-2">
                                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                                  <Bot className="w-3.5 h-3.5" />
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-200/80 shadow-2xs text-slate-500 text-xs flex items-center space-x-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                                  <span className="text-[11px] font-bold text-slate-600 pl-1">
                                    {selectedLanguage === "Urdu" ? "ڈاکٹر جواب لکھ رہے ہیں..." : "Dr. Crop is replying..."}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div ref={chatMessagesEndRef} />
                          </div>

                          {/* Quick Question Chips */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                              {selectedLanguage === "Urdu" ? "اکثر پوچھے جانے والے سوالات:" : "Quick Questions (1-Tap):"}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {(selectedLanguage === "Urdu"
                                ? [
                                  "کیا یہ بیماری دوسرے پودوں میں پھیلے گی؟",
                                  "سپرے کس وقت کرنا زیادہ فائدہ مند ہے؟",
                                  "کتنے دنوں میں پودا ٹھیک ہوگا؟",
                                  "کیا پانی دینا کم کر دینا چاہیے؟",
                                ]
                                : [
                                  "Will this spread to nearby plants?",
                                  "What is the best time of day to spray?",
                                  "How many days until recovery?",
                                  "Should I reduce irrigation?",
                                ]
                              ).map((q, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSendChatMessage(q)}
                                  disabled={isChatLoading}
                                  className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 transition-colors shadow-2xs disabled:opacity-50 text-left"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <MessageSquare className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                    <span>{q}</span>
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Interactive Input Bar (Mic + Text + Send) */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSendChatMessage();
                            }}
                            className="flex items-center space-x-2 pt-1"
                          >
                            {/* Microphone Button */}
                            <button
                              type="button"
                              onClick={toggleVoiceRecording}
                              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center flex-shrink-0 ${isRecording
                                  ? "bg-rose-500 text-white border-rose-600 shadow-md animate-pulse"
                                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs"
                                }`}
                              title={
                                isRecording
                                  ? "Recording... tap to stop"
                                  : selectedLanguage === "Urdu"
                                    ? "بول کر سوال پوچھیں"
                                    : "Speak your question"
                              }
                            >
                              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-600" />}
                            </button>

                            {/* Text Input */}
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder={
                                isRecording
                                  ? selectedLanguage === "Urdu"
                                    ? "سن رہا ہوں، بولیں..."
                                    : "Listening..."
                                  : selectedLanguage === "Urdu"
                                    ? "پودے یا علاج کے بارے میں کوئی سوال پوچھیں..."
                                    : "Ask Dr. Crop any question..."
                              }
                              disabled={isChatLoading}
                              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs disabled:opacity-60"
                            />

                            {/* Send Button */}
                            <button
                              type="submit"
                              disabled={!chatInput.trim() || isChatLoading}
                              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                              title="Send"
                            >
                              {isChatLoading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </button>
                          </form>
                        </div>
                      )
                    )}



                    {/* Conversational Voice Action Bar with Equalizer */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      {speechStatusText && (
                        <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
                          <div className="flex items-center space-x-2 min-w-0">
                            {isSpeaking && (
                              <div className="flex items-end space-x-0.5 h-4 flex-shrink-0">
                                <span className="w-1 bg-emerald-600 rounded-full sound-bar-1" />
                                <span className="w-1 bg-emerald-600 rounded-full sound-bar-2" />
                                <span className="w-1 bg-emerald-600 rounded-full sound-bar-3" />
                                <span className="w-1 bg-emerald-600 rounded-full sound-bar-4" />
                              </div>
                            )}
                            <span className="truncate">{speechStatusText}</span>
                          </div>
                          <button
                            onClick={stopSpeech}
                            className="underline text-emerald-700 font-bold ml-2 text-xs flex-shrink-0"
                          >
                            Stop
                          </button>
                        </div>
                      )}

                      {/* Primary Actions: Clean 2-Tier Architecture */}
                      <div className="space-y-2">
                        {/* Tier 1: Listen Aloud Voice Action */}
                        <button
                          onClick={toggleSpeech}
                          disabled={audioLoading}
                          className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 border transition-all ${isSpeaking
                            ? "bg-rose-50 text-rose-700 border-rose-300 shadow-sm"
                            : audioLoading
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 cursor-wait"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300 shadow-sm active:scale-95"
                            }`}
                        >
                          {audioLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600 flex-shrink-0" />
                              <span>Generating Neural Voice...</span>
                            </>
                          ) : isSpeaking ? (
                            <>
                              <VolumeX className="w-4 h-4 text-rose-600 flex-shrink-0" />
                              <span>Stop Spoken Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span>Listen Aloud ({selectedLanguage})</span>
                            </>
                          )}
                        </button>

                        {audioModelUsed && (
                          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 font-mono py-0.5">
                            <span className="inline-flex items-center gap-1">
                              <Volume2 className="w-3 h-3 text-slate-500 flex-shrink-0" />
                              <span>Neural Voice Engine:</span>
                            </span>
                            <span className="font-bold text-slate-600 px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200">{audioModelUsed}</span>
                          </div>
                        )}

                        {/* Tier 2: 3-Column Utility Grid (Copy, WhatsApp, PDF) */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={handleCopyAdvice}
                            className="py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all shadow-sm active:scale-95 transform-gpu cursor-pointer min-w-0"
                            title="Copy Prescription"
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="truncate">Copy</span>
                          </button>

                          <button
                            onClick={handleShareWhatsApp}
                            className="py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm active:scale-95 transform-gpu cursor-pointer min-w-0"
                            title="Share on WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">WhatsApp</span>
                          </button>

                          <button
                            onClick={handlePrint}
                            className="py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all shadow-sm active:scale-95 transform-gpu cursor-pointer min-w-0"
                            title="Print / Save PDF"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="truncate">PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : notCropNotice ? (
                  // Non-Crop Rejection Notice Card
                  <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-card p-6 sm:p-8 space-y-6 text-center animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
                      <ImageOff className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          {selectedLanguage === "Urdu"
                            ? "غیر زرعی تصویر"
                            : selectedLanguage === "Hindi"
                              ? "गैर-कृषि तस्वीर"
                              : selectedLanguage === "Spanish"
                                ? "No es una Planta"
                                : "Not a Plant or Crop"}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        {selectedLanguage === "Urdu"
                          ? "یہ تصویر کسی فصل یا پودے کی نہیں ہے"
                          : selectedLanguage === "Hindi"
                            ? "यह तस्वीर किसी पौधे या फसल की नहीं है"
                            : selectedLanguage === "Spanish"
                              ? "Esta imagen no es de una planta o cultivo"
                              : "Hey, this is not a plant or crop!"}
                      </h3>

                      <p className="text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                        {notCropNotice.message}
                      </p>
                    </div>

                    <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 text-left space-y-2 text-xs text-amber-950">
                      <p className="font-bold flex items-center space-x-1.5 text-amber-900">
                        <Sprout className="w-4 h-4 text-emerald-600" />
                        <span>What kind of photo is needed:</span>
                      </p>
                      <ul className="space-y-1.5 text-slate-700 pl-1">
                        <li className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Clear close-up photo of a plant leaf, crop, vegetable, fruit, or farm harvest.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          <span>Avoid photos of humans, faces, animals, pets, cars, electronics, or furniture.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take New Photo</span>
                      </button>
                      <button
                        onClick={() => handleSelectPreset(SAMPLE_PRESETS[3].url, SAMPLE_PRESETS[3].name, SAMPLE_PRESETS[3].thumbnailUrl)}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Test Sample Crop</span>
                      </button>
                    </div>
                  </div>
                ) : errorMessage ? (
                  isOfflineDiagnosisError ? (
                    // Dedicated Offline Network Error Card
                    <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-card p-6 sm:p-8 space-y-6 text-center animate-in fade-in slide-in-from-bottom-2">
                      <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
                        <WifiOff className="w-8 h-8" />
                      </div>

                      <div className="space-y-2">
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                          <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                          <span>Offline Mode</span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                          {selectedLanguage === "Urdu"
                            ? "انٹرنیٹ کنکشن موجود نہیں ہے"
                            : "No Internet Connection"}
                        </h3>

                        <p className="text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                          {errorMessage}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => setActiveViewTab("vault")}
                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>{selectedLanguage === "Urdu" ? "محفوظ شدہ والٹ کھولیں" : "Open Offline Vault"}</span>
                        </button>
                        <button
                          onClick={handleRunDiagnosis}
                          className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>{selectedLanguage === "Urdu" ? "دوبارہ کوشش کریں" : "Retry Connection"}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Dedicated AI High Demand Notice Card
                    <div className="bg-white rounded-3xl border-2 border-rose-300 shadow-card p-6 sm:p-8 space-y-6 text-center animate-in fade-in slide-in-from-bottom-2">
                      <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-sm">
                        <AlertTriangle className="w-8 h-8" />
                      </div>

                      <div className="space-y-2">
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300">
                          <Activity className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                          <span>High Demand Spike</span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                          {selectedLanguage === "Urdu"
                            ? "اے آئی سروس اس وقت مصروف ہے"
                            : "AI Service Currently Busy"}
                        </h3>

                        <p className="text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                          {errorMessage}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <button
                          onClick={handleRunDiagnosis}
                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Try Again Now</span>
                        </button>
                        <button
                          onClick={() => handleSelectPreset(SAMPLE_PRESETS[3].url, SAMPLE_PRESETS[3].name, SAMPLE_PRESETS[3].thumbnailUrl)}
                          className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>Test Sample Crop</span>
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  // Empty State: Waiting for Specimen
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 text-center space-y-4 shadow-card">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100/80 shadow-sm">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-black text-slate-900 text-base sm:text-lg">
                        Ready for Specimen Inspection
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-medium">
                        Take a picture on the left or tap a quick test sample to generate instant pathology and safe treatments.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-600 font-medium">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 inline-flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span>Instant Action Plans</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 inline-flex items-center gap-1.5">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Home Remedies</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 inline-flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Spoken Voice</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FARM VAULT (Inspired by TastyTabs Recipe Vault) */}
        {activeViewTab === "vault" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6">

              {/* Vault Header & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 mb-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    <span>The Farm Vault</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Community Diagnoses & Archived Records
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Explore past crop pathology scans from fields across the cooperative network
                  </p>
                </div>

                {/* Instant Filter Search Bar & Refresh Button */}
                <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
                  <div className="relative flex-1 sm:w-72 lg:w-80 sm:flex-initial min-w-0">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={vaultSearch}
                      onChange={(e) => setVaultSearch(e.target.value)}
                      placeholder="Search crop or condition..."
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
                    />
                    {vaultSearch && (
                      <button
                        onClick={() => setVaultSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      fetchHistory(true);
                      showToast(
                        selectedLanguage === "Urdu" ? "والٹ کی فہرست تازہ کر دی گئی" : "Vault refreshed",
                        <RefreshCw className="w-4 h-4 text-emerald-400" />
                      );
                    }}
                    disabled={historyLoading}
                    title={selectedLanguage === "Urdu" ? "تازہ کریں" : "Refresh Vault"}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${historyLoading ? "animate-spin text-emerald-600" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleClearVaultCache}
                    title={selectedLanguage === "Urdu" ? "کیش اور سٹوریج خالی کریں" : "Clear Offline Cache & Storage"}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 shadow-2xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Severity Filter Chips */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
                  <span className="font-bold text-slate-500 uppercase tracking-wide text-[11px] whitespace-nowrap flex-shrink-0">
                    Severity:
                  </span>
                  <div className="flex items-center p-1 rounded-2xl bg-slate-200/80 border border-slate-300/70 shadow-inner gap-1 flex-shrink-0">
                    {(["all", "Critical", "Moderate", "Low"] as const).map((sev) => {
                      const isSelected = vaultSeverityFilter === sev;
                      return (
                        <button
                          key={sev}
                          onClick={() => setVaultSeverityFilter(sev)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex-shrink-0 text-xs active:scale-95 transform-gpu cursor-pointer ${isSelected
                            ? "bg-white text-slate-900 shadow-sm scale-[1.02] border border-slate-200/50"
                            : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                          {sev === "all" ? "All Scans" : sev}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap flex-shrink-0">
                  Showing {filteredVaultScans.length} of {historyFeed.length} records
                </div>
              </div>

              {/* Vault Cards Grid (TastyTabs Style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {historyLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-pulse">
                      <div className="h-32 bg-slate-200 rounded-xl" />
                      <div className="h-4 w-3/4 bg-slate-200 rounded" />
                      <div className="h-3 w-1/2 bg-slate-200 rounded" />
                    </div>
                  ))
                ) : filteredVaultScans.length > 0 ? (
                  filteredVaultScans.map((scan) => {
                    const badge = getSeverityBadge(scan.severity, scan.condition_detected);
                    const formattedDate = new Date(scan.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    const isSelected = selectedScanId === scan.id;
                    const isSeedScan = Boolean(scan.id && scan.id.startsWith("seed-"));
                    const isMyScan = !isSeedScan && Boolean(
                      (farmerId && scan.userId && scan.userId === farmerId) ||
                      (scan.id && myScanIds.includes(scan.id)) ||
                      (!scan.userId || scan.userId === "guest_farmer")
                    );

                    return (
                      <div
                        key={scan.id}
                        onClick={() => handleLoadPastScan(scan)}
                        className={`group bg-white rounded-2xl border p-4 shadow-sm hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-0.5 relative ${isSelected
                          ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30"
                          : "border-slate-200/90 hover:border-emerald-300"
                          }`}
                      >
                        <div className="space-y-2.5">
                          {/* Image preview with severity chip and quick delete button */}
                          {scan.imageThumbnail || scan.imageUrl ? (
                            <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 relative">
                              <img
                                src={scan.imageThumbnail || scan.imageUrl}
                                alt={scan.crop_name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badge.bg} shadow-sm backdrop-blur-md`}>
                                  {badge.badge}
                                </span>
                              </div>
                              {isMyScan && (
                                <div className="absolute top-2.5 left-2.5">
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/95 text-emerald-800 border border-emerald-300 shadow-sm backdrop-blur-md flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {selectedLanguage === "Urdu" ? "میری رپورٹ" : "My Scan"}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-xs">
                              {isMyScan ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  {selectedLanguage === "Urdu" ? "میری رپورٹ" : "My Scan"}
                                </span>
                              ) : (
                                <span />
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${badge.bg}`}>
                                {badge.badge}
                              </span>
                            </div>
                          )}

                          <div>
                            <h4 className="font-black text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                              {scan.crop_name}
                            </h4>
                            <p className="text-xs text-emerald-800 font-bold truncate">
                              {scan.condition_detected}
                            </p>
                            {scan.agronomic_context && (scan.agronomic_context.season || scan.agronomic_context.climate_zone || scan.agronomic_context.weather_snapshot) ? (
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                {scan.agronomic_context.season && (
                                  <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/80 text-[10px] font-bold">
                                    <Leaf className="w-3 h-3 text-amber-700 flex-shrink-0" />
                                    <span>{scan.agronomic_context.season}</span>
                                  </span>
                                )}
                                {scan.agronomic_context.climate_zone && (
                                  <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200/80 text-[10px] font-bold truncate max-w-[140px]">
                                    <MapPin className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                                    <span className="truncate">{scan.agronomic_context.climate_zone}</span>
                                  </span>
                                )}
                                {scan.agronomic_context.weather_snapshot && (
                                  <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200/80 text-[10px] font-bold">
                                    <CloudSun className="w-3 h-3 text-blue-700 flex-shrink-0" />
                                    <span>{scan.agronomic_context.weather_snapshot.temp}°C</span>
                                  </span>
                                )}
                              </div>
                            ) : null}
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-medium">
                            {scan.treatment.immediate_action}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span className="truncate max-w-[110px] flex items-center space-x-1 text-[10px]">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{formattedDate}</span>
                          </span>

                          <div className="flex items-center space-x-2">
                            {isMyScan && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteScan(e, scan)}
                                disabled={deletingScanId === scan.id}
                                title={selectedLanguage === "Urdu" ? "یہ رپورٹ والٹ سے حذف کریں" : "Delete this scan from vault"}
                                className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs"
                              >
                                {deletingScanId === scan.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-rose-600" />
                                ) : (
                                  <Trash2 className="w-3 h-3 text-rose-600" />
                                )}
                                <span>{selectedLanguage === "Urdu" ? "حذف" : "Delete"}</span>
                              </button>
                            )}

                            <span className="font-bold text-emerald-700 flex items-center space-x-0.5 group-hover:translate-x-1 transition-transform text-xs">
                              <span>Open Report</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-400 text-xs font-medium space-y-2">
                    <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                    <p>No matching scan records found in the Vault.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: LIVE CLIMATE INTELLIGENCE & ANONYMOUS AI DOCTOR ADVISORY */}
        {activeViewTab === "advisory" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-8 space-y-6">

              {/* Offline Warning Banner */}
              {!isOnline && (
                <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="flex-1">
                    {selectedLanguage === "Urdu"
                      ? "انٹرنیٹ منقطع ہے۔ لائیو سیٹلائٹ ریڈار اور موسمی پیشن گوئی کے لیے انٹرنیٹ کنکشن درکار ہے۔"
                      : "You are currently offline. Live microclimate telemetry and satellite weather updates require an active internet connection."}
                  </span>
                </div>
              )}

              {/* Header: Title & Location Mode Chip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                    <CloudSun className="w-3.5 h-3.5 text-amber-700" />
                    <span>Real-Time Weather Shield</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Live Microclimate & Pathology Radar
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Continuous Open-Meteo telemetry cross-referenced with crop pathology outbreak thresholds
                  </p>
                </div>

                {/* Location Detection & Map Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDetectLocation}
                    disabled={weatherLoading}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-60"
                  >
                    {weatherLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{weatherLoading ? "Locking..." : "Detect Farm GPS"}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (weatherTelemetry?.latitude && weatherTelemetry?.longitude) {
                        setModalLatInput(weatherTelemetry.latitude.toFixed(4));
                        setModalLonInput(weatherTelemetry.longitude.toFixed(4));
                      }
                      setIsLocationModalOpen(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs shadow-xs transition-all active:scale-95"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Select on Map</span>
                  </button>
                </div>
              </div>

              {/* Location Bar & Quick Presets Strip */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2 text-xs flex-wrap min-w-0">
                    <span className="font-bold text-slate-700 flex items-center space-x-1 flex-shrink-0">
                      <span>Currently Monitoring:</span>
                    </span>
                    <span className="font-extrabold text-emerald-950 px-2.5 py-0.5 rounded-lg bg-emerald-100/90 border border-emerald-300/80 truncate max-w-[180px] sm:max-w-xs">
                      {activeLocationLabel}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold whitespace-nowrap flex-shrink-0">
                      ({weatherTelemetry?.isOfflineFallback ? "Offline Demo Simulation" : locationMode === "gps" ? "GPS Locked" : locationMode === "ip" ? "Auto IP" : locationMode === "map" ? "Map Pinned" : "Preset Zone"})
                    </span>
                  </div>

                  {/* City Search Form */}
                  <form onSubmit={handleSearchCity} className="flex items-center space-x-1.5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search city/district..."
                        value={citySearchInput}
                        onChange={(e) => setCitySearchInput(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44 sm:w-52"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearchingCity || !citySearchInput.trim()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-50"
                    >
                      {isSearchingCity ? "..." : "Go"}
                    </button>
                  </form>
                </div>

                {/* Quick Presets for Multi-Region Farmers & Judges */}
                <div className="flex items-center space-x-2 pt-1 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap flex-shrink-0">
                    Quick Zones:
                  </span>
                  {AGRICULTURAL_PRESETS.map((preset) => {
                    const isActive = activeLocationLabel === preset.name;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => fetchWeatherForCoords(preset.lat, preset.lon, preset.name, "preset")}
                        className={`flex-shrink-0 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${isActive
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                      >
                        <MapPin className={`w-3 h-3 flex-shrink-0 ${isActive ? "text-white" : "text-emerald-600"}`} />
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LIVE WEATHER HUD: 4 Core Metric Cards */}
              {weatherTelemetry ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Temperature Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/50 border border-amber-200/80 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900">Temperature</span>
                        <Thermometer className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="mt-2 flex items-baseline space-x-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          {weatherTelemetry.temperature}°C
                        </span>
                        {weatherTelemetry.temp_max !== undefined && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            H: {weatherTelemetry.temp_max}° / L: {weatherTelemetry.temp_min}°
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-amber-800/90 font-medium mt-1 truncate">
                        {weatherTelemetry.weather_condition}
                      </p>
                    </div>

                    {/* Relative Humidity Card */}
                    <div className={`p-4 rounded-2xl border shadow-xs ${weatherTelemetry.humidity >= 75
                      ? "bg-rose-50/70 border-rose-200 text-rose-950"
                      : "bg-blue-50/70 border-blue-200 text-blue-950"
                      }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Relative Humidity</span>
                        <Droplets className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="mt-2 flex items-baseline space-x-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          {weatherTelemetry.humidity}%
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold mt-1 flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5 flex-shrink-0 ${weatherTelemetry.humidity >= 75 ? "bg-rose-500" : "bg-emerald-500"}`} />
                        <span>{weatherTelemetry.humidity >= 75 ? "Fungal spore trigger (>75%)" : "Moderate leaf moisture"}</span>
                      </p>
                    </div>

                    {/* Rain Probability Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/70 to-cyan-50/50 border border-sky-200/80 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-900">Rain Probability</span>
                        <CloudSun className="w-4 h-4 text-sky-600" />
                      </div>
                      <div className="mt-2 flex items-baseline space-x-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          {weatherTelemetry.precipitation_probability}%
                        </span>
                        {weatherTelemetry.precipitation_mm ? (
                          <span className="text-[11px] text-slate-500 font-medium">
                            {weatherTelemetry.precipitation_mm}mm
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-sky-800 font-medium mt-1">
                        {weatherTelemetry.precipitation_probability >= 50 ? "Waterlogging risk high" : "Low precipitation expected"}
                      </p>
                    </div>

                    {/* Wind Speed Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200/80 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900">Wind Velocity</span>
                        <Wind className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="mt-2 flex items-baseline space-x-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          {weatherTelemetry.wind_speed} <span className="text-sm font-bold">km/h</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 font-medium mt-1">
                        {weatherTelemetry.wind_speed > 25 ? "Spray drift warning (>25km/h)" : "Calm foliar spray window"}
                      </p>
                    </div>
                  </div>

                  {/* ONGOING 7-DAY MICROCLIMATE TREND */}
                  {(weatherTelemetry.past_week_rainfall_mm !== undefined || weatherTelemetry.past_week_avg_humidity !== undefined) && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-teal-50/90 border border-blue-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2.5 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                          <Droplets className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="font-extrabold text-blue-950">Ongoing 7-Day Microclimate Trend:</span>
                          <span className="text-blue-800 ml-1.5 font-medium hidden sm:inline">Preceding weather driving current fungal & bacterial spore loads</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {weatherTelemetry.past_week_rainfall_mm !== undefined && (
                          <span className="px-2.5 py-1 rounded-full bg-white/90 border border-blue-200 font-bold text-blue-900 shadow-2xs whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1">
                            <CloudRain className="w-3 h-3 text-blue-700 flex-shrink-0" />
                            <span>7-Day Rain: {weatherTelemetry.past_week_rainfall_mm}mm</span>
                          </span>
                        )}
                        {weatherTelemetry.past_week_avg_humidity !== undefined && (
                          <span className="px-2.5 py-1 rounded-full bg-white/90 border border-indigo-200 font-bold text-indigo-900 shadow-2xs whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-indigo-700 flex-shrink-0" />
                            <span>7-Day Avg Humidity: {weatherTelemetry.past_week_avg_humidity}%</span>
                          </span>
                        )}
                        {weatherTelemetry.consecutive_damp_days !== undefined && (
                          <span className={`px-2.5 py-1 rounded-full border font-bold shadow-2xs whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1 ${weatherTelemetry.consecutive_damp_days >= 3
                              ? "bg-rose-50 border-rose-200 text-rose-800"
                              : "bg-white/90 border-teal-200 text-teal-900"
                            }`}>
                            <Calendar className="w-3 h-3 text-teal-700 flex-shrink-0" />
                            <span>Damp Days: {weatherTelemetry.consecutive_damp_days}/7</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs font-medium space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
                  <p>Connecting to meteorological satellite grid...</p>
                </div>
              )}

              {/* DYNAMIC PATHOLOGY RISK INDEX CARD */}
              {weatherTelemetry && (() => {
                const risk = getPathologyRiskIndex(weatherTelemetry);
                return (
                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3.5 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-white">
                          Pathology Outbreak Risk Index
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${risk.badgeBg} ${risk.badgeText} ${risk.badgeBorder}`}>
                          {risk.level} Risk ({risk.score}/100)
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        Calibrated for Smallholder Horticultural & Cereal Crops
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ${risk.barColor}`}
                          style={{ width: `${risk.score}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {risk.primaryConcern}
                    </p>
                  </div>
                );
              })()}

              {/* ASK AI DOCTOR FOR CLIMATE ADVISORY (Hero Interaction) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>Ask AI Doctor for Live Weather Advisory</span>
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Sends anonymous microclimate readings to formulate tailored field actions (100% private, zero user identifiers)
                    </p>
                  </div>

                  <button
                    onClick={handleAskClimateDoctor}
                    disabled={advisoryLoading || !weatherTelemetry}
                    className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 flex-shrink-0 active:scale-95 ${advisoryLoading || !weatherTelemetry
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                  >
                    {advisoryLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Consulting AI Agronomist...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Formulate Today&apos;s Advisory</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Doctor Advisory Output Card */}
                {climateAdvisory && (
                  <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                            AI Plant Doctor Prescription
                          </span>
                          {advisoryModelUsed && (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold border border-slate-200 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Model: {advisoryModelUsed}</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          {climateAdvisory.headline}
                        </h4>
                      </div>

                      {/* Listen Aloud Button */}
                      <button
                        onClick={toggleAdvisorySpeech}
                        disabled={advisoryAudioLoading}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${isAdvisorySpeaking
                          ? "bg-rose-50 text-rose-700 border-rose-300 shadow-sm"
                          : "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 shadow-xs"
                          }`}
                      >
                        {advisoryAudioLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Voice Loading...</span>
                          </>
                        ) : isAdvisorySpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                            <span>Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Listen Aloud ({selectedLanguage})</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {/* Immediate Action */}
                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                        <span className="font-bold text-amber-950 flex items-center space-x-1">
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          <span>Action Required Today:</span>
                        </span>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {climateAdvisory.action_today}
                        </p>
                      </div>

                      {/* Primary Disease Risk */}
                      <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1">
                        <span className="font-bold text-rose-950 flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Pathogen Vulnerabilities:</span>
                        </span>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {climateAdvisory.primary_disease_risk}
                        </p>
                      </div>

                      {/* Spray & Irrigation Guidance */}
                      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                        <span className="font-bold text-blue-950 flex items-center space-x-1">
                          <CloudSun className="w-3.5 h-3.5 text-blue-600" />
                          <span>Spray & Irrigation Schedule:</span>
                        </span>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {climateAdvisory.spray_timing_advice}
                        </p>
                      </div>
                    </div>

                    {/* Preceding Microclimate & Spore Build-up Impact */}
                    {climateAdvisory.ongoing_climate_impact && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-1 text-xs">
                        <span className="font-bold text-indigo-950 flex items-center space-x-1.5">
                          <Droplets className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                          <span>Preceding Microclimate & Spore Build-up Impact:</span>
                        </span>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {climateAdvisory.ongoing_climate_impact}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cooperative FAQ Section */}
              <div className="pt-2 space-y-3">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider text-slate-500">
                  Frequently Asked Questions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900">How is my location protected?</span>
                    <p className="text-slate-600 font-medium">
                      GPS coordinates and IP addresses are resolved strictly on your device to fetch atmospheric conditions. AgriShield never sends your location, name, or identity to the AI model.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900">How often is the microclimate updated?</span>
                    <p className="text-slate-600 font-medium">
                      Weather observations are fetched in real-time from open meteorological satellite grids and updated whenever you tap &quot;Detect My Farm GPS&quot; or select a new region.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Floating Spoken Audio Pill when Dr. Crop is speaking */}
      {isSpeaking && (
        <div className="fixed bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+62px)] inset-x-4 z-40 sm:hidden flex justify-center animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={stopSpeech}
            className="bg-slate-900/95 text-white px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 flex items-center space-x-2.5 text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex items-end space-x-0.5 h-3.5 flex-shrink-0">
              <span className="w-1 bg-emerald-400 rounded-full sound-bar-1" />
              <span className="w-1 bg-emerald-400 rounded-full sound-bar-2" />
              <span className="w-1 bg-emerald-400 rounded-full sound-bar-3" />
              <span className="w-1 bg-emerald-400 rounded-full sound-bar-4" />
            </div>
            <span className="text-emerald-400">
              {selectedLanguage === "Urdu" ? "ڈاکٹر کراپ بول رہے ہیں..." : "Dr. Crop Speaking..."}
            </span>
            <span className="text-[10px] text-slate-400 underline ml-1">
              {selectedLanguage === "Urdu" ? "روکیں" : "Stop"}
            </span>
          </button>
        </div>
      )}

      {/* Mobile Floating Action Dock (Inspired by Expo Router & TastyTabs) */}
      <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-40 bg-white/95 backdrop-blur-xl border border-slate-200/90 p-1.5 sm:hidden flex items-center justify-around shadow-2xl rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => {
            setActiveViewTab("doctor");
            if (diagnosis && reportRef.current) {
              reportRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className={`flex-1 min-h-[44px] py-1.5 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition-all ${activeViewTab === "doctor"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm"
            : "text-slate-600"
            }`}
        >
          <Sprout className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="truncate">Doctor</span>
        </button>

        <button
          onPointerDown={startCameraLongPress}
          onPointerUp={cancelCameraLongPress}
          onPointerLeave={cancelCameraLongPress}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => {
            if (isCameraLongPressRef.current) {
              isCameraLongPressRef.current = false;
              return;
            }
            handleTriggerCamera();
          }}
          className="mx-1 min-h-[44px] min-w-[44px] p-2.5 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30 active:scale-90 transition-all flex items-center justify-center flex-shrink-0 select-none touch-manipulation cursor-pointer"
          title={selectedLanguage === "Urdu" ? "تصویر کھینچیں • دبا کر رکھیں گیلری کے لیے" : "Tap for Camera • Hold for Gallery"}
          aria-label="Snap Photo or Hold to Choose from Gallery"
        >
          <Camera className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveViewTab("vault")}
          className={`flex-1 min-h-[44px] py-1.5 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition-all ${activeViewTab === "vault"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm"
            : "text-slate-600"
            }`}
        >
          <Layers className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="truncate">Vault ({historyFeed.length})</span>
        </button>

        <button
          onClick={() => setActiveViewTab("advisory")}
          className={`flex-1 min-h-[44px] py-1.5 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition-all ${activeViewTab === "advisory"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm"
            : "text-slate-600"
            }`}
        >
          <CloudSun className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span className="truncate">Advisory</span>
        </button>
      </div>

      {/* Cooperative & AI Footer (Crafted by Team MemoryLeak101) */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 pt-8 border-t border-slate-200/90 text-slate-600 space-y-6 pb-16 sm:pb-8">
        {/* Main Footer Brand & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Col 1: Brand & Team MemoryLeak101 */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <IoniconsLeaf className="w-4 h-4" mirrored={true} />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                  AgriShield AI
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/80 uppercase">
                  Field Edition
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-md font-medium">
              Empowering smallholder farmers, agricultural cooperatives, and field extension teams with instant multimodal crop pathology, spoken native-language remedies, and microclimate risk alerts.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-medium text-slate-600 inline-flex items-center gap-1">
                <span>Crafted with</span>
                <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 inline flex-shrink-0" />
                <span>by</span>
                <strong className="font-bold text-slate-900">Team MemoryLeak101</strong>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span>Field Diagnostics Active</span>
              </span>
            </div>
          </div>

          {/* Col 2: Cooperative Standards & Capabilities */}
          <div className="md:col-span-6 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Conversational Spoken Audio</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium">
                Everyday spoken remedies in conversational Urdu, Bolchaal Hindi, and Spanish.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Farmer Privacy First</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium">
                Client-compressed images. Zero monetization or tracking of farm specimen photos.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Instant Offline Cache</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium">
                Progressive Web App with cached sample presets for low-connectivity field zones.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <CloudSun className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Microclimate Shield</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium">
                Thermal drought and monsoon humidity early-warning pathology triggers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Utility Bar: Clean Single-Line Copyright */}
        <div className="pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-medium text-center sm:text-left">
          <span>© {new Date().getFullYear()} AgriShield AI • Built for Sustainable Agriculture</span>
          <span>Field Station v1.0</span>
        </div>
      </footer>
    </div>
  );
}

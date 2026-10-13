"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Camera,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Volume2,
  VolumeX,
  Printer,
  ChevronDown,
  RefreshCw,
  Globe,
  Activity,
  CheckCircle2,
  Clock,
  FlaskConical,
  Sprout,
  Zap,
  Layers,
  CloudSun,
  X,
  Smartphone,
  Copy,
  Check,
  Share2,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ImageOff
} from "lucide-react";
import { DiagnosisResult, ScanRecord } from "@/lib/types";

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

// Practical sample tests for judges & farmers
const SAMPLE_PRESETS = [
  {
    name: "Rotten Apple Harvest",
    crop: "Orchard Fruit",
    condition: "Bitter Rot Decay",
    url: "https://images.unsplash.com/photo-1644504113660-54f9d01b27d6?auto=format&fit=crop&w=800&q=80",
    badge: "Bad Harvest (Critical)",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    desc: "Apple with fungal rot decay lesion and scab damage on fruit surface"
  },
  {
    name: "Spoiled Pumpkin Harvest",
    crop: "Field Pumpkin",
    condition: "Black Rot Spoilage",
    url: "https://images.unsplash.com/photo-1675678674818-a749f21f22c5?auto=format&fit=crop&w=800&q=80",
    badge: "Bad Harvest (Rot)",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    desc: "Rotting pumpkins and squashes with mold decay and total crop loss"
  },
  {
    name: "Drought-Damaged Corn",
    crop: "Field Maize",
    condition: "Drought Scorch",
    url: "https://images.unsplash.com/photo-1789406515055-d2373d385f77?auto=format&fit=crop&w=800&q=80",
    badge: "Crop Failure (High)",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-amber-500",
    desc: "Parched corn stalks and scorched dry leaves from severe heat and drought"
  },
  {
    name: "Fresh Sweet Corn",
    crop: "Sweet Corn",
    condition: "Grade A Healthy Cobs",
    url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    badge: "Healthy Harvest (Prime)",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Fresh sweet corn cobs in green husks with plump golden kernels"
  },
  {
    name: "Fresh Vine Tomatoes",
    crop: "Tomato Vine",
    condition: "Healthy Harvest (Ripe)",
    url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    badge: "Healthy Harvest (Ripe)",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Plump ripe red tomatoes on vine with crisp green stems, zero rot"
  },
  {
    name: "Healthy Green Basil",
    crop: "Herb Crop",
    condition: "100% Disease-Free Leaf",
    url: "https://images.unsplash.com/photo-1534944645004-bf75556ce377?auto=format&fit=crop&w=800&q=80",
    badge: "Healthy Foliage",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Vibrant green herb leaves with high moisture and zero leaf spots"
  }
];

const LANGUAGES = [
  { code: "English", label: "English", sublabel: "Easy English", flag: "🇬🇧" },
  { code: "Urdu", label: "اردو", sublabel: "آسان اردو", flag: "🇵🇰" },
  { code: "Hindi", label: "हिन्दी", sublabel: "सरल हिन्दी", flag: "🇮🇳" },
  { code: "Spanish", label: "Español", sublabel: "Fácil", flag: "🇪🇸" },
];

const ANALYSIS_STEPS = [
  "Reading leaf resolution & light...",
  "Scanning leaf surface & symptoms...",
  "Consulting Gemini AI plant doctor...",
  "Formulating remedies & weather alert..."
];

export default function AgriShieldDashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activePresetUrl, setActivePresetUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState<number>(0);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [activeTreatmentTab, setActiveTreatmentTab] = useState<"immediate" | "organic" | "chemical">("immediate");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [speechStatusText, setSpeechStatusText] = useState<string>("");
  const [historyFeed, setHistoryFeed] = useState<ScanRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notCropNotice, setNotCropNotice] = useState<{ isInvalid: boolean; message: string } | null>(null);
  const [copiedAdvice, setCopiedAdvice] = useState<boolean>(false);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory(true);

    // Listen for PWA BeforeInstallPromptEvent
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      stopSpeech();
    };
  }, []);

  // Analysis progress step simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setAnalysisStepIndex(0);
      interval = setInterval(() => {
        setAnalysisStepIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install AgriShield on your phone:\n1. Tap your browser's share or menu icon\n2. Select 'Add to Home Screen'");
    }
  };

  const fetchHistory = async (showSkeleton = false) => {
    try {
      if (showSkeleton) {
        setHistoryLoading(true);
      }
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data?.scans) {
        setHistoryFeed(data.scans);
      }
    } catch (err) {
      console.error("Failed to fetch community history:", err);
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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setErrorMessage(null);
    setNotCropNotice(null);
    setSelectedScanId(null);
    setActivePresetUrl(null);
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please pick an image of a plant leaf.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string) => {
    setErrorMessage(null);
    setNotCropNotice(null);
    setSelectedScanId(null);
    setActivePresetUrl(url);
    setImagePreview(url);
  };

  const handleRunDiagnosis = async () => {
    if (!imagePreview) {
      setErrorMessage("Please take a photo or pick a sample photo first.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setNotCropNotice(null);
      stopSpeech();

      const payload = {
        image: imagePreview,
        language: selectedLanguage,
      };

      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Check if the image was rejected as not being a plant or crop
      if (data.isPlantOrCrop === false || !res.ok || data.error) {
        if (data.isPlantOrCrop === false) {
          setDiagnosis(null);
          const rejectionMsg =
            data.rejectionReason ||
            data.error ||
            (selectedLanguage === "Urdu"
              ? "یہ تصویر کسی فصل یا پودے کی نہیں ہے۔ براہِ کرم اپنے پودے، پتے یا زرعی پیداوار کی صاف تصویر اپلوڈ کریں۔"
              : "Hey, this is not a plant or crop! Please upload a clear photo of your plant, leaf, or farm harvest.");
          setNotCropNotice({ isInvalid: true, message: rejectionMsg });
          setErrorMessage(rejectionMsg);

          // Smooth scroll to results on mobile devices so user sees the explanation immediately
          if (window.innerWidth < 1024 && resultsRef.current) {
            setTimeout(() => {
              resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 150);
          }
          return; // IMPORTANT: Do NOT add to historyFeed or recent scans!
        }

        throw new Error(data.error || "Could not check plant. Please check connection.");
      }

      setNotCropNotice(null);
      setDiagnosis(data.diagnosis);

      // Instantly prepend new diagnosis to history feed (0ms delay, no skeleton flicker)
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
        imageThumbnail: imagePreview || undefined,
        language: selectedLanguage,
        createdAt: new Date().toISOString(),
        location: { latitude: 31.5204, longitude: 74.3587, city: "Your Farm", country: "Field Station" },
      };

      setHistoryFeed((prev) => [newScanItem, ...prev.filter((s) => s.id !== newScanItem.id).slice(0, 9)]);
      setSelectedScanId(newScanItem.id || null);

      // Silent background sync without resetting skeleton
      fetchHistory(false);

      // Smooth scroll to results on mobile devices
      if (window.innerWidth < 1024 && resultsRef.current) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      setErrorMessage(err.message || "Something went wrong while checking the plant.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stopSpeech = () => {
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

    const cleanCropName = diagnosis.crop_name.replace(/\(.*?\)/g, "").trim();
    const cleanCondition = diagnosis.condition_detected.replace(/\(.*?\)/g, "").trim();

    // Natural everyday conversational script without heavy terminology
    let scriptText = "";
    if (selectedLanguage === "Urdu") {
      scriptText = `سلام کسان بھائی۔ آپ کا پودا ${cleanCropName} ہے، اور اس پر ${cleanCondition} کی بیماری لگ گئی ہے۔ اب آپ نے فوری طور پر یہ کرنا ہے: ${diagnosis.treatment.immediate_action}۔ اس کے علاج کے لیے دیسی طریقہ یہ ہے: ${diagnosis.treatment.organic_remedy}۔ اور موسم کا دھیان رکھیں: ${diagnosis.climate_impact_warning}`;
    } else if (selectedLanguage === "Hindi") {
      scriptText = `नमस्ते किसान भाई। आपका पौधा ${cleanCropName} है, और इसमें ${cleanCondition} की बीमारी है। तुरंत यह काम करें: ${diagnosis.treatment.immediate_action}। घर का आसान देसी इलाज: ${diagnosis.treatment.organic_remedy}। मौसम की सलाह: ${diagnosis.climate_impact_warning}`;
    } else if (selectedLanguage === "Spanish") {
      scriptText = `Hola amigo agricultor. Su planta es ${cleanCropName}, y tiene ${cleanCondition}. Lo primero que debe hacer hoy es: ${diagnosis.treatment.immediate_action}. Remedio casero natural: ${diagnosis.treatment.organic_remedy}. Cuidado con el clima: ${diagnosis.climate_impact_warning}`;
    } else {
      scriptText = `Hello. Your plant is ${cleanCropName}, and it shows signs of ${cleanCondition}. Right now today, here is what you should do: ${diagnosis.treatment.immediate_action}. For a safe home remedy: ${diagnosis.treatment.organic_remedy}. Weather warning: ${diagnosis.climate_impact_warning}`;
    }

    try {
      setAudioLoading(true);
      setSpeechStatusText("Preparing clear voice advice...");

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
        const audio = new Audio(data.audioBase64);
        audioPlayerRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setAudioLoading(false);
          setSpeechStatusText(`Speaking in ${selectedLanguage}...`);
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
      console.warn("Fallback to browser voice:", err);
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

    const voices = window.speechSynthesis.getVoices();
    const langMap: Record<string, string[]> = {
      English: ["en-US", "en-GB", "en"],
      Urdu: ["ur-PK", "ur", "hi-IN"],
      Hindi: ["hi-IN", "hi"],
      Spanish: ["es-ES", "es"],
    };

    const prefixes = langMap[selectedLanguage] || ["en-US"];
    const voice = voices.find((v) => prefixes.some((p) => v.lang.toLowerCase().startsWith(p.toLowerCase())));
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || prefixes[0];

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeechStatusText(`Speaking in ${selectedLanguage}...`);
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

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleCopyAdvice = () => {
    if (!diagnosis) return;
    const textToCopy = `AgriShield AI Report:\nCrop: ${diagnosis.crop_name}\nCondition: ${diagnosis.condition_detected}\nImmediate Action: ${diagnosis.treatment.immediate_action}\nHome Remedy: ${diagnosis.treatment.organic_remedy}\nWeather Note: ${diagnosis.climate_impact_warning}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAdvice(true);
    setTimeout(() => setCopiedAdvice(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!diagnosis) return;
    const text = `🌿 *AgriShield AI Crop Doctor Report*\n\n🌱 *Crop:* ${diagnosis.crop_name}\n🔬 *Disease:* ${diagnosis.condition_detected}\n⚡ *Action Today:* ${diagnosis.treatment.immediate_action}\n🍃 *Home Remedy:* ${diagnosis.treatment.organic_remedy}\n⛅ *Weather Alert:* ${diagnosis.climate_impact_warning}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleLoadPastScan = (scan: ScanRecord) => {
    setErrorMessage(null);
    setActivePresetUrl(null);
    setSelectedScanId(scan.id || null);
    setDiagnosis(scan);
    if (scan.imageThumbnail || scan.imageUrl) {
      setImagePreview(scan.imageThumbnail || scan.imageUrl || null);
    }
    stopSpeech();
    if (window.innerWidth < 1024 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
        badge: "Healthy Crop (Safe)",
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
          badge: isBadHarvest ? "Bad Harvest (Critical)" : "Needs Quick Action!",
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
          badge: isDrought ? "Crop Failure (Drought)" : "Medium Problem",
          meterColor: "bg-amber-500",
          textColor: "text-amber-600",
        };
      }
      case "low":
      default:
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          dot: "bg-emerald-500",
          badge: "Low Risk / Mild",
          meterColor: "bg-emerald-500",
          textColor: "text-emerald-600",
        };
    }
  };

  return (
    <div className="min-h-screen text-slate-800 pb-32 sm:pb-20 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
          {/* Logo & Simple Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-glow flex-shrink-0 transition-transform hover:scale-105">
              <IoniconsLeaf className="w-5 h-5" mirrored={true} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900">
                  AgriShield
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 uppercase tracking-wider">
                  AI Doctor
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block font-medium">
                Instant Leaf Pathology & Climate Advisory for Farmers
              </p>
            </div>
          </div>

          {/* Right Action Bar: Install App + Language Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Install App Button */}
            {!isInstalled && (
              <button
                onClick={handleInstallClick}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-sm transition-all active:scale-95"
                title="Install app on your phone"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Install App</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="relative flex items-center">
              <div className="absolute left-2.5 pointer-events-none text-slate-500">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <select
                aria-label="Choose Language"
                value={selectedLanguage}
                onChange={(e) => {
                  stopSpeech();
                  setSelectedLanguage(e.target.value);
                }}
                className="pl-8 pr-8 py-2 bg-slate-100/90 hover:bg-slate-200/80 text-slate-900 font-bold text-xs sm:text-sm rounded-xl border border-slate-300/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none shadow-sm transition-all"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 space-y-7">
        {/* Rich Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden border border-emerald-700/30">
          {/* Subtle background ambient mesh */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-20 w-60 h-60 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 backdrop-blur-sm">
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              <span>Free Crop Pathology & Weather Helper</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
              Is Your Plant Sick? <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Snap a Leaf Photo to Check
              </span>
            </h1>

            <p className="text-emerald-100/90 text-xs sm:text-sm sm:leading-relaxed max-w-xl font-normal">
              Take a leaf picture. We identify crop diseases in simple words, give safe home remedies, and warn you of bad weather before damage spreads.
            </p>

            {/* Quick badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] text-emerald-200 border border-white/10">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>4 Languages (Urdu, Hindi, English, Spanish)</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] text-emerald-200 border border-white/10">
                <Volume2 className="w-3 h-3 text-emerald-400" />
                <span>Conversational Spoken Voice</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left Scanner & Samples (7 cols), Right Sticky Diagnosis (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Leaf Photo & Samples */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-emerald-600" />
                    <span>Leaf Photo Scanner</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Take a clear close-up picture of the discolored or damaged leaf
                  </p>
                </div>

                {imagePreview && (
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setActivePresetUrl(null);
                      setSelectedScanId(null);
                      setDiagnosis(null);
                      stopSpeech();
                    }}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                )}
              </div>

              {/* Upload & Camera Box */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center min-h-[280px] sm:min-h-[340px] p-4 text-center ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50/70 scale-[1.01]"
                    : imagePreview
                    ? "border-emerald-500/40 bg-slate-950"
                    : "border-slate-300 hover:border-emerald-500/80 bg-slate-50/60 hover:bg-slate-50"
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden flex items-center justify-center bg-black">
                    <img
                      src={imagePreview}
                      alt="Plant Leaf"
                      className="w-full h-full object-contain select-none"
                    />

                    {/* Animated Laser Scanning Beam when Analyzing */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] absolute laser-scanner" />
                        <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[0.5px]" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:24px_24px]" />
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl flex items-center space-x-2 border border-white/10 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold">Leaf Photo Ready</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4 py-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shadow-sm transition-transform hover:scale-105">
                      <Camera className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-bold text-slate-800">
                        Take a photo or choose from gallery
                      </p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Optimized for camera phones, tablets, and desktop uploads
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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

                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Snap with Camera</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm flex items-center space-x-2 active:scale-95 transition-all shadow-sm"
                      >
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Choose Photo</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Instant Test Photos for Judges & Farmers (Responsive Carousel on mobile, Grid on desktop) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quick Test Samples (No Photo Needed):</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Click any sample to test
                  </span>
                </div>

                <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
                  {SAMPLE_PRESETS.map((preset) => {
                    const isSelected = activePresetUrl === preset.url;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`min-w-[210px] sm:min-w-0 snap-start text-left p-3.5 rounded-2xl border transition-all text-xs flex flex-col justify-between space-y-2.5 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30 shadow-md scale-[1.02]"
                            : "border-slate-200/90 bg-white hover:bg-slate-50 shadow-sm hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">
                              {preset.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {preset.crop}
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {preset.desc}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${preset.badgeColor} flex items-center space-x-1`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${preset.dotColor}`} />
                            <span>{preset.badge}</span>
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            {isSelected ? "Selected ✓" : "Test"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Not Crop Alert or Error Message */}
              {notCropNotice ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start space-x-2.5 animate-in fade-in">
                  <ImageOff className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-950">
                      {selectedLanguage === "Urdu" ? "یہ تصویر کسی پودے یا فصل کی نہیں ہے" : "Not a Plant or Crop Detected"}
                    </p>
                    <p className="font-medium text-amber-900/90 leading-relaxed">{notCropNotice.message}</p>
                    <p className="text-[11px] text-amber-700 font-semibold pt-0.5">
                      {selectedLanguage === "Urdu"
                        ? "✓ یہ تصویر حالیہ ہسٹری یا فیڈ میں محفوظ نہیں کی گئی۔"
                        : "✓ Not saved to recent scans or community feed."}
                    </p>
                  </div>
                </div>
              ) : errorMessage ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="font-medium">{errorMessage}</p>
                </div>
              ) : null}

              {/* Big Check Plant Button with Multi-Step Progress */}
              <div className="space-y-2">
                <button
                  disabled={!imagePreview || isAnalyzing}
                  onClick={handleRunDiagnosis}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center space-x-3 shadow-lg transition-all ${
                    !imagePreview || isAnalyzing
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/25 active:scale-[0.98]"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Checking Your Plant with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Check Plant Health Now</span>
                    </>
                  )}
                </button>

                {/* Perceived Smoothness: Step Progression Display */}
                {isAnalyzing && (
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center space-y-1.5 animate-in fade-in">
                    <p className="text-xs font-bold text-emerald-800 flex items-center justify-center space-x-1.5">
                      <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                      <span>{ANALYSIS_STEPS[analysisStepIndex]}</span>
                    </p>
                    <div className="w-full bg-emerald-200/80 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-700"
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

          {/* Right Column: Sticky Diagnosis Results Card (5 cols) */}
          <div ref={resultsRef} className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 self-start">
            {isAnalyzing ? (
              // Polished Shimmer Skeleton
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 animate-pulse shadow-card">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-32 bg-slate-200 rounded-lg" />
                  <div className="h-6 w-24 bg-slate-200 rounded-full" />
                </div>
                <div className="h-20 w-full bg-slate-100 rounded-2xl" />
                <div className="h-28 w-full bg-slate-100 rounded-2xl" />
                <div className="h-20 w-full bg-slate-100 rounded-2xl" />
                <div className="h-12 w-full bg-slate-200 rounded-xl" />
              </div>
            ) : diagnosis ? (
              // Rich Farmer-Friendly Diagnosis Card
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-5 print:shadow-none print:border-none">
                {/* Result Title & Severity */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      Plant Doctor Report
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {diagnosis.crop_name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Scientific: {diagnosis.scientific_name}
                    </p>
                  </div>

                  {(() => {
                    const badgeInfo = getSeverityBadge(diagnosis.severity, diagnosis.condition_detected);
                    return (
                      <div
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${badgeInfo.bg} shadow-sm`}
                      >
                        <span className={`w-2 h-2 rounded-full ${badgeInfo.dot} animate-ping`} />
                        <span>{badgeInfo.badge}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Disease Found & Confidence Gauge */}
                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600 uppercase tracking-wide">Disease Detected:</span>
                    <span className="font-black text-slate-900 text-sm sm:text-base">
                      {diagnosis.condition_detected}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Doctor Confidence</span>
                      <span className="font-bold text-slate-800">
                        {Math.round(diagnosis.confidence_score * 100)}% Sure
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200/90 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          getSeverityBadge(diagnosis.severity, diagnosis.condition_detected).meterColor
                        }`}
                        style={{ width: `${Math.round(diagnosis.confidence_score * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Visible Symptoms */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Leaf Symptoms:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {diagnosis.symptoms.map((symptom, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                      >
                        <span className="text-emerald-600 font-black">•</span>
                        <span className="leading-relaxed">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment Tabs with Quick Wording */}
                <div className="space-y-3">
                  <div className="flex rounded-2xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setActiveTreatmentTab("immediate")}
                      className={`flex-1 py-2.5 rounded-xl transition-all ${
                        activeTreatmentTab === "immediate"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "hover:text-slate-900"
                      }`}
                    >
                      Do Today
                    </button>
                    <button
                      onClick={() => setActiveTreatmentTab("organic")}
                      className={`flex-1 py-2.5 rounded-xl transition-all ${
                        activeTreatmentTab === "organic"
                          ? "bg-white text-emerald-800 shadow-sm"
                          : "hover:text-slate-900"
                      }`}
                    >
                      Home Remedy
                    </button>
                    <button
                      onClick={() => setActiveTreatmentTab("chemical")}
                      className={`flex-1 py-2.5 rounded-xl transition-all ${
                        activeTreatmentTab === "chemical"
                          ? "bg-white text-blue-800 shadow-sm"
                          : "hover:text-slate-900"
                      }`}
                    >
                      Shop Spray
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 text-xs text-slate-800 leading-relaxed min-h-[96px] flex flex-col justify-between space-y-2">
                    <div>
                      {activeTreatmentTab === "immediate" && (
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>Action needed today:</span>
                          </span>
                          <p className="text-slate-700 leading-relaxed">{diagnosis.treatment.immediate_action}</p>
                        </div>
                      )}
                      {activeTreatmentTab === "organic" && (
                        <div className="space-y-1">
                          <span className="font-bold text-emerald-800 flex items-center space-x-1.5">
                            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Safe home remedy / bio-spray:</span>
                          </span>
                          <p className="text-slate-700 leading-relaxed">{diagnosis.treatment.organic_remedy}</p>
                        </div>
                      )}
                      {activeTreatmentTab === "chemical" && (
                        <div className="space-y-1">
                          <span className="font-bold text-blue-800 flex items-center space-x-1.5">
                            <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                            <span>Market spray option:</span>
                          </span>
                          <p className="text-slate-700 leading-relaxed">{diagnosis.treatment.chemical_alternative}</p>
                        </div>
                      )}
                    </div>

                    {/* Copy and WhatsApp Share Buttons */}
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-end space-x-2">
                      <button
                        onClick={handleCopyAdvice}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors flex items-center space-x-1"
                        title="Copy advice to clipboard"
                      >
                        {copiedAdvice ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Advice</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleShareWhatsApp}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-700 hover:bg-emerald-100/70 transition-colors flex items-center space-x-1"
                        title="Share advice on WhatsApp"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Weather Warning Card */}
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-1 text-xs text-amber-900">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-800">
                    <CloudSun className="w-4 h-4 text-amber-600" />
                    <span>Weather Alert (Rain & Heat):</span>
                  </div>
                  <p className="leading-relaxed text-amber-900/90 font-medium">
                    {diagnosis.climate_impact_warning}
                  </p>
                </div>

                {/* Prevention Tips */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tips to Keep Other Plants Safe:</span>
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    {diagnosis.prevention_tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2 bg-slate-50/60 p-2 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Spoken Voice Action Bar with Equalizer Bars */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {speechStatusText && (
                    <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isSpeaking && (
                          <div className="flex items-end space-x-0.5 h-4">
                            <span className="w-1 bg-emerald-600 rounded-full sound-bar-1" />
                            <span className="w-1 bg-emerald-600 rounded-full sound-bar-2" />
                            <span className="w-1 bg-emerald-600 rounded-full sound-bar-3" />
                            <span className="w-1 bg-emerald-600 rounded-full sound-bar-4" />
                          </div>
                        )}
                        <span>{speechStatusText}</span>
                      </div>
                      <button
                        onClick={stopSpeech}
                        className="underline text-emerald-700 font-bold ml-2 text-xs"
                      >
                        Stop
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={toggleSpeech}
                      disabled={audioLoading}
                      className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 border transition-all ${
                        isSpeaking
                          ? "bg-rose-50 text-rose-700 border-rose-300 shadow-sm"
                          : audioLoading
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300 cursor-wait"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300 shadow-sm active:scale-95"
                      }`}
                    >
                      {audioLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                          <span>Generating Voice...</span>
                        </>
                      ) : isSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4 text-rose-600" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-600" />
                          <span>Listen Aloud ({selectedLanguage})</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handlePrint}
                      className="py-3.5 px-4 rounded-2xl font-semibold text-xs flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-sm active:scale-95"
                    >
                      <Printer className="w-4 h-4 text-slate-500" />
                      <span className="hidden sm:inline">PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : notCropNotice ? (
              // Dedicated "Not a Plant / Crop" Rejection Card in Results Column
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

                {/* Farmer-Friendly Guidance Box */}
                <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 text-left space-y-2 text-xs text-amber-950">
                  <p className="font-bold flex items-center space-x-1.5 text-amber-900">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <span>
                      {selectedLanguage === "Urdu"
                        ? "صحیح نتیجہ حاصل کرنے کے لیے رہنما اصول:"
                        : "What kind of photo is needed:"}
                    </span>
                  </p>
                  <ul className="space-y-1.5 text-slate-700 pl-1">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-black">✓</span>
                      <span>
                        {selectedLanguage === "Urdu"
                          ? "کسی پودے، پتے، پھل، سبزی یا فصل کی واضح اور صاف تصویر لگائیں۔"
                          : "Clear, close-up photo of a plant leaf, crop, vegetable, fruit, or farm harvest."}
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-600 font-black">✗</span>
                      <span>
                        {selectedLanguage === "Urdu"
                          ? "انسانوں، جانوروں، گاڑیوں، کمپیوٹر، موبائل یا گھریلو سامان کی تصویر نہ لگائیں۔"
                          : "Avoid photos of people, animals, vehicles, electronics, or unrelated indoor objects."}
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-black">✓</span>
                      <span>
                        {selectedLanguage === "Urdu"
                          ? "یہ تصویر تاریخ یا کمیونٹی فیڈ میں محفوظ نہیں کی گئی ہے۔"
                          : "This photo was not saved to recent scans or community feed."}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (cameraInputRef.current) cameraInputRef.current.click();
                      else if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>
                      {selectedLanguage === "Urdu" ? "نئی تصویر لیں" : "Take New Photo"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      handleSelectPreset(SAMPLE_PRESETS[3].url);
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>
                      {selectedLanguage === "Urdu" ? "نمونہ فصل آزمائیں" : "Test Sample Crop"}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 text-center space-y-4 shadow-card">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100/80 shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Waiting for Leaf Photo</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Take a picture on the left or tap a quick test sample to see diagnosis and easy home remedies.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Community Feed (Recent Scans) */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Recent Plants Checked by Nearby Farmers</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Live field reports from agricultural community
              </p>
            </div>

            <button
              onClick={() => fetchHistory(false)}
              disabled={historyLoading}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1.5 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors border border-emerald-200/80"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh Feed</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {historyLoading ? (
              // Shimmer cards while fetching
              Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse shadow-sm"
                >
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                  <div className="h-24 w-full bg-slate-200 rounded-xl" />
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-full bg-slate-100 rounded" />
                </div>
              ))
            ) : historyFeed.length > 0 ? (
              historyFeed.map((scan) => {
                const badge = getSeverityBadge(scan.severity, scan.condition_detected);
                const formattedTime = new Date(scan.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const isCurrentScanSelected = selectedScanId === scan.id;

                return (
                  <div
                    key={scan.id}
                    onClick={() => handleLoadPastScan(scan)}
                    className={`group bg-white rounded-2xl border p-4 shadow-sm hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-0.5 ${
                      isCurrentScanSelected
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/30 shadow-md scale-[1.01]"
                        : "border-slate-200/90 hover:border-emerald-300"
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center space-x-1 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{formattedTime}</span>
                        </span>
                        <div className="flex items-center space-x-1.5">
                          {isCurrentScanSelected && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Viewing ✓
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                            {badge.badge}
                          </span>
                        </div>
                      </div>

                      {scan.imageThumbnail && (
                        <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 relative group-hover:opacity-95 transition-opacity">
                          <img
                            src={scan.imageThumbnail}
                            alt={scan.crop_name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                          />
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {scan.crop_name}
                        </h4>
                        <p className="text-xs font-semibold text-emerald-700 line-clamp-1">
                          {scan.condition_detected}
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {scan.treatment.immediate_action}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span className="truncate max-w-[90px] flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{scan.location?.city || "Field"}</span>
                      </span>
                      <span className="font-bold text-slate-700 flex items-center space-x-1">
                        <span>{Math.round(scan.confidence_score * 100)}%</span>
                        <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                No past scans recorded yet. Be the first to check a plant!
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Mobile Floating Action Bar (Dock) */}
      <div className="fixed bottom-3 left-4 right-4 z-40 bg-white/95 backdrop-blur-xl border border-slate-200/90 p-2 sm:hidden flex items-center justify-between gap-2 shadow-2xl rounded-2xl">
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 py-3 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <Camera className="w-4 h-4" />
          <span>Snap Leaf</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 py-3 px-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-300 active:scale-95 transition-all"
        >
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>Gallery</span>
        </button>

        {diagnosis ? (
          <button
            onClick={toggleSpeech}
            className="py-3 px-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center space-x-1 active:scale-95 transition-all"
            title="Listen to advice"
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4 text-rose-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>
        ) : !isInstalled ? (
          <button
            onClick={handleInstallClick}
            className="py-3 px-3.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-center space-x-1 active:scale-95 transition-all"
            title="Install app"
          >
            <Smartphone className="w-4 h-4 text-amber-600" />
          </button>
        ) : null}
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <IoniconsLeaf className="w-3.5 h-3.5" mirrored={true} />
          </div>
          <span className="font-bold text-slate-700">AgriShield AI</span>
          <span>•</span>
          <span>Intelligent Plant Doctor for Farmers</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Powered by Google Gemini</span>
          </span>
          <span>•</span>
          <span>Works on Phone & Desktop</span>
        </div>
      </footer>
    </div>
  );
}

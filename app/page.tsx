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
  Download,
  Share2,
  HelpCircle,
  Smartphone
} from "lucide-react";
import { DiagnosisResult, ScanRecord } from "@/lib/types";

// Practical sample tests for judges & farmers
const SAMPLE_PRESETS = [
  {
    name: "Tomato Leaf Blight",
    crop: "Tomato",
    condition: "Early Blight",
    url: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80",
    badge: "Fungus (High)",
    badgeColor: "bg-red-100 text-red-700 border-red-200"
  },
  {
    name: "Grape White Powdery Spot",
    crop: "Grape",
    condition: "Powdery Mildew",
    url: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80",
    badge: "Fungus (Medium)",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200"
  },
  {
    name: "Healthy Clean Leaf",
    crop: "Tea Leaf",
    condition: "Healthy",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    badge: "Healthy Leaf",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200"
  }
];

const LANGUAGES = [
  { code: "English", label: "English", sublabel: "Easy English", flag: "🇬🇧" },
  { code: "Urdu", label: "اردو", sublabel: "آسان اردو", flag: "🇵🇰" },
  { code: "Hindi", label: "हिन्दी", sublabel: "सरल हिन्दी", flag: "🇮🇳" },
  { code: "Spanish", label: "Español", sublabel: "Fácil", flag: "🇪🇸" },
];

export default function AgriShieldDashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activePresetUrl, setActivePresetUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [activeTreatmentTab, setActiveTreatmentTab] = useState<"immediate" | "organic" | "chemical">("immediate");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [speechStatusText, setSpeechStatusText] = useState<string>("");
  const [historyFeed, setHistoryFeed] = useState<ScanRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchHistory();

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
      alert("To install this app on your phone:\n1. Tap your browser's menu (⋮ or Share)\n2. Tap 'Add to Home Screen' or 'Install App'");
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
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
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please pick an image of a plant leaf.");
      return;
    }
    setActivePresetUrl(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string) => {
    setErrorMessage(null);
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

      if (!res.ok || data.error) {
        throw new Error(data.error || "Could not check plant. Please check connection.");
      }

      setDiagnosis(data.diagnosis);
      fetchHistory();
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

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return {
          bg: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
          badge: "Needs Quick Action!",
          meterColor: "bg-red-500",
        };
      case "moderate":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
          badge: "Medium Problem",
          meterColor: "bg-amber-500",
        };
      case "low":
      default:
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          badge: "Mild / Easy to Fix",
          meterColor: "bg-emerald-500",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-28 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Mobile-Friendly Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Logo & Simple Title */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Leaf className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  AgriShield
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  Doctor
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Easy Crop Doctor & Weather Help
              </p>
            </div>
          </div>

          {/* Right Action Bar: Install App + Language Picker */}
          <div className="flex items-center space-x-2">
            {/* Install App Button */}
            {!isInstalled && (
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-sm transition-all active:scale-95"
                title="Install app on your phone"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden xs:inline sm:inline">Install App</span>
                <span className="xs:hidden sm:hidden">Install</span>
              </button>
            )}

            {/* Language Dropdown */}
            <div className="relative flex items-center">
              <select
                aria-label="Choose Language"
                value={selectedLanguage}
                onChange={(e) => {
                  stopSpeech();
                  setSelectedLanguage(e.target.value);
                }}
                className="pl-2.5 pr-7 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-900 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none shadow-sm transition-colors"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 pt-5 sm:pt-8 space-y-6">
        {/* Friendly Hero Banner */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 sm:p-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[11px] font-semibold border border-emerald-400/20">
              <Sprout className="w-3 h-3 text-emerald-300" />
              <span>Free Helper for Every Farmer</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
              Is Your Plant Sick? Take a Photo to Find Out
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xl">
              Snap a leaf photo. We tell you the disease in simple words, give safe home remedies, and warn you about bad weather.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Leaf Photo & Samples (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-emerald-600" />
                    <span>Leaf Photo</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Take a clear close-up picture of the sick leaf
                  </p>
                </div>
                {imagePreview && (
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setActivePresetUrl(null);
                      setDiagnosis(null);
                      stopSpeech();
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-red-50"
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
                className={`relative rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] p-4 text-center ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50/60"
                    : imagePreview
                    ? "border-slate-300 bg-slate-950"
                    : "border-slate-300 hover:border-emerald-500 bg-slate-50/80"
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden flex items-center justify-center bg-black">
                    <img
                      src={imagePreview}
                      alt="Plant Leaf"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border border-white/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Photo Ready</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4 py-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800">
                        Take a photo or choose from gallery
                      </p>
                      <p className="text-xs text-slate-500">
                        Works on mobile phone camera and computer
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
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
                        className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center space-x-2 shadow-sm active:scale-95 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take Photo with Camera</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-sm flex items-center space-x-2 active:scale-95 transition-all"
                      >
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Choose from Gallery</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Instant Test Photos for Judges & Farmers */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Or Test Instantly with Sample Photos:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-1.5 ${
                        activePresetUrl === preset.url
                          ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-sm"
                          : "border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
                      }`}
                    >
                      <div className="font-bold text-slate-900 leading-snug">
                        {preset.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">{preset.crop}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${preset.badgeColor}`}>
                          {preset.badge}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {/* Big Check Plant Button */}
              <button
                disabled={!imagePreview || isAnalyzing}
                onClick={handleRunDiagnosis}
                className={`w-full py-4 px-6 rounded-xl font-black text-sm sm:text-base flex items-center justify-center space-x-2.5 shadow-md transition-all ${
                  !imagePreview || isAnalyzing
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-[0.98]"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Checking Your Plant with AI Doctor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Check This Plant Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Diagnosis Results Card (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {isAnalyzing ? (
              // Easy-to-read Loading Skeleton
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse">
                <div className="h-6 w-36 bg-slate-200 rounded" />
                <div className="h-16 w-full bg-slate-200 rounded-xl" />
                <div className="h-28 w-full bg-slate-200 rounded-xl" />
                <div className="h-24 w-full bg-slate-200 rounded-xl" />
              </div>
            ) : diagnosis ? (
              // Simple, Farmer-Friendly Results Card
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5 print:shadow-none print:border-none">
                {/* Result Title & Severity */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      Plant Doctor Report
                    </span>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {diagnosis.crop_name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Scientific Name: {diagnosis.scientific_name}
                    </p>
                  </div>

                  {(() => {
                    const badgeInfo = getSeverityBadge(diagnosis.severity);
                    return (
                      <div
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeInfo.bg}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${badgeInfo.dot}`} />
                        <span>{badgeInfo.badge}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Disease Name & Confidence */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Disease Found:</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {diagnosis.condition_detected}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Doctor Confidence</span>
                      <span className="font-bold text-slate-800">
                        {Math.round(diagnosis.confidence_score * 100)}% Sure
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          getSeverityBadge(diagnosis.severity).meterColor
                        }`}
                        style={{ width: `${Math.round(diagnosis.confidence_score * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Easy Symptoms List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Signs on the Leaf:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {diagnosis.symptoms.map((symptom, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 flex items-start space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                      >
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment Tabs with Simple Wording */}
                <div className="space-y-2.5">
                  <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setActiveTreatmentTab("immediate")}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        activeTreatmentTab === "immediate"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "hover:text-slate-900"
                      }`}
                    >
                      Do Today
                    </button>
                    <button
                      onClick={() => setActiveTreatmentTab("organic")}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        activeTreatmentTab === "organic"
                          ? "bg-white text-emerald-700 shadow-sm"
                          : "hover:text-slate-900"
                      }`}
                    >
                      Home Remedy
                    </button>
                    <button
                      onClick={() => setActiveTreatmentTab("chemical")}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        activeTreatmentTab === "chemical"
                          ? "bg-white text-blue-700 shadow-sm"
                          : "hover:text-slate-900"
                      }`}
                    >
                      Shop Spray
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 leading-relaxed min-h-[90px] flex items-center">
                    {activeTreatmentTab === "immediate" && (
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>What to do right now:</span>
                        </span>
                        <p className="text-slate-700">{diagnosis.treatment.immediate_action}</p>
                      </div>
                    )}
                    {activeTreatmentTab === "organic" && (
                      <div className="space-y-1">
                        <span className="font-bold text-emerald-800 flex items-center space-x-1.5">
                          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Safe home remedy / bio-spray:</span>
                        </span>
                        <p className="text-slate-700">{diagnosis.treatment.organic_remedy}</p>
                      </div>
                    )}
                    {activeTreatmentTab === "chemical" && (
                      <div className="space-y-1">
                        <span className="font-bold text-blue-800 flex items-center space-x-1.5">
                          <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                          <span>Chemical spray from market:</span>
                        </span>
                        <p className="text-slate-700">{diagnosis.treatment.chemical_alternative}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Weather Alert in Plain Wording */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-xs text-amber-900">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-800">
                    <CloudSun className="w-4 h-4 text-amber-600" />
                    <span>Weather Alert (Rain & Heat):</span>
                  </div>
                  <p className="leading-relaxed text-amber-900/90">{diagnosis.climate_impact_warning}</p>
                </div>

                {/* Tips to Stop Disease from Coming Back */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tips to Keep Other Plants Safe:</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2">
                    {diagnosis.prevention_tips.map((tip, idx) => (
                      <li key={idx} className="list-disc list-inside">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Audio Status */}
                {speechStatusText && (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center justify-between">
                    <span>{speechStatusText}</span>
                    <button onClick={stopSpeech} className="underline text-emerald-700 font-bold ml-2">
                      Stop
                    </button>
                  </div>
                )}

                {/* Action Buttons: Listen in Audio & Print */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2.5">
                  <button
                    onClick={toggleSpeech}
                    disabled={audioLoading}
                    className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 border transition-all ${
                      isSpeaking
                        ? "bg-red-50 text-red-700 border-red-300"
                        : audioLoading
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 cursor-wait"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 shadow-sm"
                    }`}
                  >
                    {audioLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Making Voice...</span>
                      </>
                    ) : isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4 text-red-600" />
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
                    className="py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-sm"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span className="hidden sm:inline">Save PDF</span>
                  </button>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-base">Waiting for Leaf Photo</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Take a picture on the left or tap a sample photo to see disease check and easy home remedies.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Community Feed */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Recent Plants Checked by Other Farmers</span>
              </h2>
              <p className="text-xs text-slate-500">
                Live updates from nearby fields
              </p>
            </div>
            <button
              onClick={fetchHistory}
              disabled={historyLoading}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 p-2 rounded-lg hover:bg-emerald-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {historyFeed.map((scan) => {
              const badge = getSeverityBadge(scan.severity);
              const formattedTime = new Date(scan.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={scan.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between space-y-2.5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formattedTime}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                        {badge.badge}
                      </span>
                    </div>

                    {scan.imageThumbnail && (
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 relative">
                        <img
                          src={scan.imageThumbnail}
                          alt={scan.crop_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                        {scan.crop_name}
                      </h4>
                      <p className="text-xs font-semibold text-emerald-700 line-clamp-1">
                        {scan.condition_detected}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {scan.treatment.immediate_action}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span className="truncate max-w-[90px]">
                      {scan.location?.city || "Farm"}
                    </span>
                    <span className="font-bold text-slate-700">
                      {Math.round(scan.confidence_score * 100)}% Sure
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Mobile Sticky Quick-Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 sm:hidden flex items-center justify-around gap-2 shadow-lg">
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>Snap Leaf</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-300 active:scale-95"
        >
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>Gallery</span>
        </button>

        {!isInstalled && (
          <button
            onClick={handleInstallClick}
            className="py-2.5 px-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-center space-x-1 active:scale-95"
          >
            <Smartphone className="w-4 h-4 text-amber-600" />
            <span>Install</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-3 sm:px-6 mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>AgriShield - Easy Plant Doctor for Farmers</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>Powered by Gemini AI</span>
          <span>•</span>
          <span>Works on Phone & Desktop</span>
        </div>
      </footer>
    </div>
  );
}

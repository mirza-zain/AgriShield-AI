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
  RefreshCw,
  Globe,
  Activity,
  CheckCircle2,
  Clock,
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

// Practical specimen samples for quick 1-tap testing
const SAMPLE_PRESETS = [
  {
    name: "Rotten Apple",
    crop: "Orchard Fruit",
    condition: "Bitter Rot Decay",
    url: "https://images.unsplash.com/photo-1644504113660-54f9d01b27d6?auto=format&fit=crop&w=800&q=80",
    badge: "Bad Harvest",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    desc: "Apple with fungal rot decay lesion and scab damage"
  },
  {
    name: "Spoiled Pumpkin",
    crop: "Field Pumpkin",
    condition: "Black Rot Spoilage",
    url: "https://images.unsplash.com/photo-1675678674818-a749f21f22c5?auto=format&fit=crop&w=800&q=80",
    badge: "Fruit Rot",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    desc: "Rotting pumpkins with mold decay and crop damage"
  },
  {
    name: "Drought Corn",
    crop: "Field Maize",
    condition: "Drought Scorch",
    url: "https://images.unsplash.com/photo-1789406515055-d2373d385f77?auto=format&fit=crop&w=800&q=80",
    badge: "Severe Drought",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-amber-500",
    desc: "Parched stalks and scorched leaves from thermal heat"
  },
  {
    name: "Sweet Corn",
    crop: "Sweet Corn",
    condition: "Grade A Healthy Cobs",
    url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    badge: "Healthy Yield",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Fresh sweet corn cobs in husks with plump golden kernels"
  },
  {
    name: "Vine Tomatoes",
    crop: "Tomato Vine",
    condition: "Healthy Harvest",
    url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    badge: "Grade A Prime",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Plump ripe red tomatoes on vine with zero rot"
  },
  {
    name: "Green Basil",
    crop: "Herb Crop",
    condition: "Disease-Free Leaf",
    url: "https://images.unsplash.com/photo-1534944645004-bf75556ce377?auto=format&fit=crop&w=800&q=80",
    badge: "Clean Foliage",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    desc: "Vibrant emerald herb leaves with zero fungal leaf spots"
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

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [speechStatusText, setSpeechStatusText] = useState<string>("");

  // History & Community Feed
  const [historyFeed, setHistoryFeed] = useState<ScanRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [vaultSearch, setVaultSearch] = useState<string>("");
  const [vaultSeverityFilter, setVaultSeverityFilter] = useState<"all" | "Low" | "Moderate" | "Critical">("all");

  // Notifications & Notices
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notCropNotice, setNotCropNotice] = useState<{ isInvalid: boolean; message: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; icon?: React.ReactNode } | null>(null);
  
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Trigger floating toast notification
  const showToast = (message: string, icon?: React.ReactNode) => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 2800);
  };

  useEffect(() => {
    fetchHistory(true);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
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
      }, 450);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        showToast("AgriShield installed successfully! 📱");
      }
      setDeferredPrompt(null);
    } else {
      showToast("To install: Tap browser menu -> Add to Home Screen 📱");
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

  const compressImageFile = (file: File, maxDim = 1024, quality = 0.78): Promise<string> => {
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
  };

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setNotCropNotice(null);
    setSelectedScanId(null);
    setActivePresetUrl(null);
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a photo of a plant leaf or crop.");
      return;
    }
    try {
      // Parallel generation: full diagnosis image (~70KB) and lightweight vault thumbnail (~15KB)
      const [compressedUrl, thumbUrl] = await Promise.all([
        compressImageFile(file, 1024, 0.78),
        compressImageFile(file, 360, 0.65),
      ]);
      if (compressedUrl) {
        setImagePreview(compressedUrl);
        setThumbnailPreview(thumbUrl || compressedUrl);
        showToast("Photo ready for inspection 🌿");
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
      showToast("Photo loaded 🌿");
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string, presetName?: string) => {
    setErrorMessage(null);
    setNotCropNotice(null);
    setSelectedScanId(null);
    setActivePresetUrl(url);
    setImagePreview(url);
    setThumbnailPreview(url);
    if (presetName) {
      showToast(`Loaded sample: ${presetName} 🌿`);
    }
  };

  const handleRunDiagnosis = async () => {
    if (!imagePreview) {
      setErrorMessage("Please take a photo or select a test sample first.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setNotCropNotice(null);
      stopSpeech();

      const payload = {
        image: imagePreview,
        thumbnail: thumbnailPreview || imagePreview,
        language: selectedLanguage,
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
      setDiagnosis(data.diagnosis);

      // Instant optimistic prepend into Vault
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
        imageUrl: imagePreview || undefined,
        imageThumbnail: thumbnailPreview || imagePreview || undefined,
        language: selectedLanguage,
        createdAt: new Date().toISOString(),
        location: { latitude: 31.5204, longitude: 74.3587, city: "Your Farm", country: "Field Station" },
      };

      setHistoryFeed((prev) => [newScanItem, ...prev.filter((s) => s.id !== newScanItem.id).slice(0, 19)]);
      setSelectedScanId(newScanItem.id || null);

      showToast("Diagnosis completed successfully! 🩺", <CheckCircle2 className="w-4 h-4 text-emerald-400" />);

      // On mobile, automatically scroll to the Doctor's prescription
      if (window.innerWidth < 1024 && reportRef.current) {
        setTimeout(() => {
          reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }

      fetchHistory(false);
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      setErrorMessage(err.message || "Could not analyze the photo. Please check your network connection.");
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

    let scriptText = "";
    if (selectedLanguage === "Urdu") {
      scriptText = `سلام کسان بھائی۔ آپ کا پودا ${cleanCropName} ہے، اور اس پر ${cleanCondition} کی بیماری لگ گئی ہے۔ اب آپ نے فوری طور پر یہ کرنا ہے: ${diagnosis.treatment.immediate_action}۔ اس کے علاج کے لیے دیسی طریقہ یہ ہے: ${diagnosis.treatment.organic_remedy}۔ اور موسم کا دھیان رکھیں: ${diagnosis.climate_impact_warning}`;
    } else if (selectedLanguage === "Hindi") {
      scriptText = `नमस्ते किसान भाई। आपका पौधा ${cleanCropName} है, और इसमें ${cleanCondition} की बीमारी है। तुरंत यह काम करें: ${diagnosis.treatment.immediate_action}। घर का आसान देसी इलाज: ${diagnosis.treatment.organic_remedy}۔ मौसम की सलाह: ${diagnosis.climate_impact_warning}`;
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
          showToast(`Speaking advice in ${selectedLanguage} 🔊`);
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
      showToast(`Speaking advice in ${selectedLanguage} 🔊`);
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
    showToast("Prescription copied to clipboard! 📋", <Check className="w-4 h-4 text-emerald-400" />);
  };

  const handleShareWhatsApp = () => {
    if (!diagnosis) return;
    const text = `🌿 *AgriShield AI Crop Doctor Report*\n\n🌱 *Crop:* ${diagnosis.crop_name}\n🔬 *Disease:* ${diagnosis.condition_detected}\n⚡ *Action Today:* ${diagnosis.treatment.immediate_action}\n🍃 *Home Remedy:* ${diagnosis.treatment.organic_remedy}\n⛅ *Weather Alert:* ${diagnosis.climate_impact_warning}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    showToast("Opening WhatsApp share... 📲", <Share2 className="w-4 h-4 text-emerald-400" />);
  };

  const handleLoadPastScan = (scan: ScanRecord) => {
    setErrorMessage(null);
    setNotCropNotice(null);
    setActivePresetUrl(null);
    setSelectedScanId(scan.id || null);
    setDiagnosis(scan);
    const activeImage = scan.imageUrl || scan.imageThumbnail || null;
    if (activeImage) {
      setImagePreview(activeImage);
      setThumbnailPreview(scan.imageThumbnail || scan.imageUrl || null);
    }
    stopSpeech();
    setActiveViewTab("doctor");
    showToast(`Loaded report: ${scan.crop_name} 🌿`);
    if (window.innerWidth < 1024 && reportRef.current) {
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
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
    <div className="min-h-screen text-slate-800 pb-36 sm:pb-24 font-sans selection:bg-emerald-500 selection:text-white bg-[#f8fafc]">
      {/* Floating Interactive Toast Feedback */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 flex items-center space-x-2.5 text-xs font-bold transition-all animate-bounce">
          {toast.icon || <Sparkles className="w-4 h-4 text-emerald-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Glassmorphic Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
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
                Crop Pathology, Neural Audio & Climate Advisory for Farmers
              </p>
            </div>
          </div>

          {/* Right Action Bar: Install App + Language Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isInstalled && (
              <button
                onClick={handleInstallClick}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-sm transition-all active:scale-95"
                title="Install app on your phone"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Install PWA</span>
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
                  showToast(`Language set to ${e.target.value} 🌐`);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 space-y-6">
        {/* App-Style Segmented Navigation (Inspired by YAFTY / TastyTabs) */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/70 border border-slate-300/70 shadow-inner gap-1">
            <button
              onClick={() => setActiveViewTab("doctor")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center space-x-2 transition-all ${
                activeViewTab === "doctor"
                  ? "bg-white text-emerald-950 shadow-sm scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Plant Doctor</span>
              {diagnosis && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveViewTab("vault")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center space-x-2 transition-all ${
                activeViewTab === "vault"
                  ? "bg-white text-emerald-950 shadow-sm scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Farm Vault</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold border border-slate-200">
                {historyFeed.length}
              </span>
            </button>

            <button
              onClick={() => setActiveViewTab("advisory")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center space-x-2 transition-all ${
                activeViewTab === "advisory"
                  ? "bg-white text-emerald-950 shadow-sm scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>Climate Shield</span>
            </button>
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden md:flex items-center space-x-3 text-xs text-slate-500 font-medium bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Active Model: Gemini 3.8 / 3.1</span>
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
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                        <Camera className="w-5 h-5 text-emerald-600" />
                        <span>Specimen Inspection Bay</span>
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Capture or select a damaged plant leaf to analyze
                      </p>
                    </div>

                    {imagePreview && (
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setActivePresetUrl(null);
                          setSelectedScanId(null);
                          setDiagnosis(null);
                          setNotCropNotice(null);
                          setErrorMessage(null);
                          stopSpeech();
                          showToast("Inspection bay cleared");
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors border border-rose-100"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>
                    )}
                  </div>

                  {/* Visual Diagnostic Viewfinder Frame */}
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
                        : "border-slate-300 hover:border-emerald-500/80 bg-slate-50/70 hover:bg-slate-50"
                    }`}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden flex items-center justify-center bg-black">
                        {/* High-Tech Diagnostic Corner Reticles */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl pointer-events-none z-20" />
                        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr pointer-events-none z-20" />
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl pointer-events-none z-20" />
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br pointer-events-none z-20" />

                        <img
                          src={imagePreview}
                          alt="Plant Specimen"
                          className="w-full h-full object-contain select-none"
                        />

                        {/* Animated Laser Scanning Beam */}
                        {isAnalyzing && (
                          <div className="absolute inset-0 pointer-events-none z-10">
                            <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] absolute laser-scanner" />
                            <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[0.5px]" />
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:24px_24px]" />
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/85 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl flex items-center space-x-2 border border-white/10 shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold">Specimen Loaded</span>
                        </div>
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
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Snap with Camera</span>
                          </button>

                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm flex items-center space-x-2 active:scale-95 transition-all shadow-sm"
                          >
                            <Upload className="w-4 h-4 text-emerald-600" />
                            <span>Choose Photo</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compact Horizontal Specimen Shelf (Presets) */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Quick Test Samples (No Photo Needed):</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Tap any to test
                      </span>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 pt-0.5">
                      {SAMPLE_PRESETS.map((preset) => {
                        const isSelected = activePresetUrl === preset.url;
                        return (
                          <button
                            key={preset.name}
                            onClick={() => handleSelectPreset(preset.url, preset.name)}
                            className={`flex-shrink-0 flex items-center space-x-2.5 px-3 py-2 rounded-2xl border transition-all text-left ${
                              isSelected
                                ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30 shadow-sm"
                                : "border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300"
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                            />
                            <div className="pr-1">
                              <div className="font-bold text-slate-900 text-xs">
                                {preset.name}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${preset.dotColor}`} />
                                <span>{preset.badge}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Primary Diagnosis Execution CTA */}
                  <div className="space-y-2 pt-1">
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
                          <span>Consulting Gemini AI Doctor...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Check Plant Health Now</span>
                        </>
                      )}
                    </button>

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
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center space-x-1">
                          <Sprout className="w-3.5 h-3.5" />
                          <span>Plant Doctor Clinical Prescription</span>
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
                            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${badgeInfo.bg} shadow-sm flex-shrink-0`}
                          >
                            <span className={`w-2 h-2 rounded-full ${badgeInfo.dot} animate-ping`} />
                            <span>{badgeInfo.badge}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Condition Detected & Doctor Confidence Meter */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500 uppercase tracking-wide">
                          Condition Detected:
                        </span>
                        <span className="font-black text-slate-900 text-sm sm:text-base">
                          {diagnosis.condition_detected}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                          <span>Doctor Confidence Score</span>
                          <span className="font-black text-slate-800">
                            {Math.round(diagnosis.confidence_score * 100)}% Certain
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ${
                              getSeverityBadge(diagnosis.severity, diagnosis.condition_detected).meterColor
                            }`}
                            style={{ width: `${Math.round(diagnosis.confidence_score * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Leaf Symptoms */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Visible Leaf Symptoms:</span>
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

                    {/* Treatment Segmented Pill Tabs (Inspired by TastyTabs) */}
                    <div className="space-y-3">
                      <div className="flex rounded-2xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                        <button
                          onClick={() => setActiveTreatmentTab("immediate")}
                          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                            activeTreatmentTab === "immediate"
                              ? "bg-white text-slate-900 shadow-sm font-black"
                              : "hover:text-slate-900"
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>Do Today</span>
                        </button>
                        <button
                          onClick={() => setActiveTreatmentTab("organic")}
                          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                            activeTreatmentTab === "organic"
                              ? "bg-white text-emerald-800 shadow-sm font-black"
                              : "hover:text-slate-900"
                          }`}
                        >
                          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Home Remedy</span>
                        </button>
                        <button
                          onClick={() => setActiveTreatmentTab("chemical")}
                          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                            activeTreatmentTab === "chemical"
                              ? "bg-white text-blue-800 shadow-sm font-black"
                              : "hover:text-slate-900"
                          }`}
                        >
                          <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                          <span>Shop Spray</span>
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/90 text-xs text-slate-800 leading-relaxed min-h-[96px] flex flex-col justify-between space-y-2">
                        <div>
                          {activeTreatmentTab === "immediate" && (
                            <div className="space-y-1.5">
                              <span className="font-black text-slate-900 flex items-center space-x-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span>Immediate First-Aid:</span>
                              </span>
                              <p className="font-medium text-slate-700 leading-relaxed">
                                {diagnosis.treatment.immediate_action}
                              </p>
                            </div>
                          )}
                          {activeTreatmentTab === "organic" && (
                            <div className="space-y-1.5">
                              <span className="font-black text-emerald-900 flex items-center space-x-1.5">
                                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Natural Safe Remedy:</span>
                              </span>
                              <p className="font-medium text-slate-700 leading-relaxed">
                                {diagnosis.treatment.organic_remedy}
                              </p>
                            </div>
                          )}
                          {activeTreatmentTab === "chemical" && (
                            <div className="space-y-1.5">
                              <span className="font-black text-blue-900 flex items-center space-x-1.5">
                                <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                                <span>Chemical / Ag-Shop Spray:</span>
                              </span>
                              <p className="font-medium text-slate-700 leading-relaxed">
                                {diagnosis.treatment.chemical_alternative}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Prescribed Action Footer Badge */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Treatment Language: {selectedLanguage}</span>
                          <span className="text-emerald-700 font-bold">Safe for Smallholder Farms ✓</span>
                        </div>
                      </div>
                    </div>

                    {/* Weather Warning Card */}
                    <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-1 text-xs text-amber-900">
                      <div className="font-black flex items-center space-x-1.5 text-amber-800">
                        <CloudSun className="w-4 h-4 text-amber-600" />
                        <span>Climate Shield Weather Alert:</span>
                      </div>
                      <p className="leading-relaxed text-amber-950 font-medium">
                        {diagnosis.climate_impact_warning}
                      </p>
                    </div>

                    {/* Prevention Tips */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>How to Protect Other Crops:</span>
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

                    {/* Conversational Voice Action Bar with Equalizer */}
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

                      {/* Primary Actions: Listen Aloud, Copy, WhatsApp, PDF */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5">
                        <button
                          onClick={toggleSpeech}
                          disabled={audioLoading}
                          className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 border transition-all ${
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
                          onClick={handleCopyAdvice}
                          className="py-3 px-3.5 rounded-2xl font-semibold text-xs flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-sm active:scale-95"
                          title="Copy Prescription"
                        >
                          <Copy className="w-4 h-4 text-slate-500" />
                          <span className="hidden sm:inline">Copy</span>
                        </button>

                        <button
                          onClick={handleShareWhatsApp}
                          className="py-3 px-3.5 rounded-2xl font-semibold text-xs flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm active:scale-95"
                          title="Share on WhatsApp"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        <button
                          onClick={handlePrint}
                          className="py-3 px-3.5 rounded-2xl font-semibold text-xs flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-sm active:scale-95"
                          title="Print / Save PDF"
                        >
                          <Printer className="w-4 h-4 text-slate-500" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
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
                          <span className="text-emerald-600 font-black">✓</span>
                          <span>Clear close-up photo of a plant leaf, crop, vegetable, fruit, or farm harvest.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-rose-600 font-black">✗</span>
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
                        onClick={() => handleSelectPreset(SAMPLE_PRESETS[3].url, SAMPLE_PRESETS[3].name)}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Test Sample Crop</span>
                      </button>
                    </div>
                  </div>
                ) : errorMessage ? (
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
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Try Again Now</span>
                      </button>
                      <button
                        onClick={() => handleSelectPreset(SAMPLE_PRESETS[3].url, SAMPLE_PRESETS[3].name)}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Test Sample Crop</span>
                      </button>
                    </div>
                  </div>
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

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                        ⚡ Instant Action Plans
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                        🍃 Home Remedies
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                        🔊 Spoken Voice
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
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

                {/* Instant Filter Search Bar */}
                <div className="relative min-w-[260px] sm:min-w-[320px]">
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
              </div>

              {/* Severity Filter Chips */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-500 uppercase tracking-wide text-[11px]">
                    Filter by Severity:
                  </span>
                  {(["all", "Critical", "Moderate", "Low"] as const).map((sev) => {
                    const isSelected = vaultSeverityFilter === sev;
                    return (
                      <button
                        key={sev}
                        onClick={() => setVaultSeverityFilter(sev)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          isSelected
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {sev === "all" ? "All Scans" : sev}
                      </button>
                    );
                  })}
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
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

                    return (
                      <div
                        key={scan.id}
                        onClick={() => handleLoadPastScan(scan)}
                        className={`group bg-white rounded-2xl border p-4 shadow-sm hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:-translate-y-0.5 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30"
                            : "border-slate-200/90 hover:border-emerald-300"
                        }`}
                      >
                        <div className="space-y-2.5">
                          {/* Image preview with severity chip */}
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
                              <div className="absolute top-2.5 right-2.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badge.bg} shadow-sm backdrop-blur-md`}>
                                  {badge.badge}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-xs">
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
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-medium">
                            {scan.treatment.immediate_action}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span className="truncate max-w-[120px] flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{formattedDate}</span>
                          </span>
                          <span className="font-bold text-emerald-700 flex items-center space-x-0.5 group-hover:translate-x-1 transition-transform">
                            <span>Open Report</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
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

        {/* VIEW 3: CLIMATE ADVISORY & COOPERATIVE KNOWLEDGE */}
        {activeViewTab === "advisory" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 mb-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-amber-700" />
                  <span>Climate Resilience Index</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Regional Weather Shield & Prevention Protocols
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Agronomic weather warnings and proactive disease mitigation advice
                </p>
              </div>

              {/* Weather Shield Advisory Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Thermal Heat & Drought</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    When field temperatures exceed 36°C, irrigate early in the morning. Use straw mulch around crop bases to reduce root moisture evaporation by 40%.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Heavy Rain & Blight Alert</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Standing puddle water accelerates Phytophthora fungal spread within 48 hours. Ensure field drainage furrows are cleared before seasonal downpours.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Organic Neem Oil Protocol</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Mix 5ml cold-pressed neem oil with 2 drops mild soap per liter of water. Spray at sunset to protect predatory insects while eliminating aphids and mildew spores.
                  </p>
                </div>
              </div>

              {/* Cooperative FAQ Section */}
              <div className="pt-4 space-y-3">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider text-slate-500">
                  Frequently Asked Questions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900">How accurate is the Gemini AI diagnosis?</span>
                    <p className="text-slate-600 font-medium">
                      AgriShield uses multimodal Gemini 3 vision calibrated against academic plant pathology datasets. It identifies leaf spots, blights, and rot with up to 98% confidence.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900">Does it work without internet?</span>
                    <p className="text-slate-600 font-medium">
                      Yes! The app is PWA-ready with offline caching for pre-loaded test samples and recent community scans stored locally on your device.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Floating Action Dock (Inspired by Expo Router & TastyTabs) */}
      <div className="fixed bottom-3 left-4 right-4 z-40 bg-white/95 backdrop-blur-xl border border-slate-200/90 p-2 sm:hidden flex items-center justify-around shadow-2xl rounded-2xl">
        <button
          onClick={() => {
            setActiveViewTab("doctor");
            if (diagnosis && reportRef.current) {
              reportRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all ${
            activeViewTab === "doctor"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm"
              : "text-slate-600"
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>Doctor</span>
        </button>

        <button
          onClick={() => cameraInputRef.current?.click()}
          className="mx-1 p-3 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30 active:scale-90 transition-all flex items-center justify-center"
          title="Snap Photo"
        >
          <Camera className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveViewTab("vault")}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all ${
            activeViewTab === "vault"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm"
              : "text-slate-600"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Vault ({historyFeed.length})</span>
        </button>

        <button
          onClick={() => setActiveViewTab("advisory")}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all ${
            activeViewTab === "advisory"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm"
              : "text-slate-600"
          }`}
        >
          <CloudSun className="w-4 h-4 text-amber-500" />
          <span>Advisory</span>
        </button>
      </div>

      {/* Clean Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <IoniconsLeaf className="w-3.5 h-3.5" mirrored={true} />
          </div>
          <span className="font-bold text-slate-700">AgriShield AI</span>
          <span>•</span>
          <span>Smallholder Pathology & Climate Advisory</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Gemini Neural Intelligence</span>
          </span>
          <span>•</span>
          <span>PWA Ready</span>
        </div>
      </footer>
    </div>
  );
}

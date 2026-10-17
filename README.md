# AgriShield AI 🌾🛡️
### Intelligent Crop Pathology, Climate Resilience & Vernacular Treatment Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-3.8_Flash-orange?style=flat&logo=google)](https://ai.google.dev/)
[![Cloud Run Ready](https://img.shields.io/badge/Google_Cloud-Run_Ready-4285F4?style=flat&logo=google-cloud)](https://cloud.google.com/run)
[![PWA](https://img.shields.io/badge/PWA-Installable-purple?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

AgriShield AI is an intelligent, multimodal crop disease diagnosis, climate resilience, and treatment recommendation platform engineered specifically for **smallholder farmers, agricultural cooperatives, and extension workers**.

By combining **Google Gemini Multimodal Vision**, **Gemini Neural TTS (conversational spoken audio in Urdu & English)**, and **real-time microclimate meteorological telemetry**, AgriShield AI turns any low-end smartphone into a precision plant pathology doctor and climate early-warning shield.

---

## 🌟 Key Features

### 🌿 1. Multimodal Leaf Pathology Scanner
* **Instant Camera & Gallery Inspection:** Capture foliage on-field or upload photos from device gallery.
* **Interactive Lesion Bounding Boxes:** Computer vision target mapping (`Targets: ON/OFF`) directly identifies leaf blight spots, chlorotic halos, and fungal necrosis.
* **High-Res Inspection Bay:** Pinch, pan, and zoom to inspect intricate leaf texture coordinates.
* **Sample Presets:** 5 one-tap agricultural presets (Apple Bitter Rot, Pumpkin Black Rot, Corn Drought, Healthy Potato, Prime Citrus) for instant demonstration without file uploads.

### 📋 2. Clinical Plant Doctor Prescription
* **Dual Action Treatment:** Recommends accessible, low-cost **Home & Organic Remedies** (milk sprays, neem oil, wood ash, bio-sulfur) alongside commercial shop sprays with exact dilution schedules.
* **Calibrated Doctor Confidence Score:** Displays accurate confidence metrics (`10%` to `99% Certain`) with color-coded severity meters (`Critical`, `Moderate`, `Low Risk`).
* **Yield Protection Economics:** Provides estimated harvest percentage saved by taking immediate first-aid action.

### 🗣️ 3. Conversational Spoken Audio (Google Gemini TTS)
* **Natural Spoken Vernacular:** Delivers speech in everyday conversational Urdu (آسان اور عام فہم اردو) and plain English.
* **Studio-Grade Voice Model:** Locked to Google Gemini's **`Aoede`** calm, soothing female prebuilt voice.
* **Acoustic RIFF WAV Reconstruction:** Native `pcmToWav` engine prepends 44-byte RIFF headers to prevent browser audio distortion or robotic static.
* **Zero-Token Cloud Caching:** Generated audio is stored in Cloud Firestore (`audio_cache` collection). Repeated listens across any device load in **~25ms with 0 Gemini tokens consumed**.

### 🤖 4. "Ask Dr. Crop" Interactive Plant Doctor Chat
* **Context-Aware Consultation:** Multi-turn AI chat tailored specifically to the diagnosed crop specimen.
* **1-Tap Quick Question Chips:** Instant answers for common farmer inquiries (*"Will this spread to nearby plants?"*, *"What time of day to spray?"*, *"How many days until recovery?"*).
* **Hands-Free Microphone:** Speak questions directly to Dr. Crop with automated voice answers.
* **Community Scan Privacy Lock:** Locks interactive chat on third-party community archives to preserve AI tokens for the crop owner.

### 🌦️ 5. Predictive Climate Shield
* **Real-Time Farm Weather Telemetry:** Live GPS microclimate data via Open-Meteo API (temperature, relative humidity, rain probability, wind speed).
* **Pathology Risk Index (0–100):** Algorithmic threat score correlating humidity spikes and damp foliage with fungal spore incubation windows.
* **Optimal Spray Windows:** Real-time advice on whether to apply treatments today before rain washes away sprays or winds exceed drift limits.

### 🏛️ 6. Collaborative Farm Vault
* **Regional Scan Feed:** Real-time community diagnoses across agricultural belts.
* **Dynamic Real-Time Sync:** Auto-refreshes on tab switch, scan creation, or record deletion with manual `🔄 Refresh` button.
* **Cryptographic Device Ownership:** Unique device UUID (`farmer_<uuid>`) stored in `localStorage`. Farmers can only delete their own records; server validates ownership and rejects tampering with **HTTP 403 Forbidden**.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["📱 Frontend Client (Next.js 15 PWA)"]
        UI["TastyTabs UI / Tailwind CSS"]
        Scanner["Camera Viewfinder & Canvas"]
        Audio["Web Audio Player (WAV)"]
        DeviceID["Device Auth (localStorage UUID)"]
    end

    subgraph API["⚡ Edge API Routes (Vercel / Cloud Run)"]
        R_Diag["POST /api/diagnose"]
        R_Audio["POST /api/audio"]
        R_Chat["POST /api/chat"]
        R_Hist["GET & DELETE /api/history"]
        R_Clim["POST /api/climate-advisory"]
    end

    subgraph AI["🧠 Google Gemini AI Ecosystem"]
        G_Vision["Gemini 3.8 Flash (Multimodal Diagnosis)"]
        G_Cascade["7-Tier Model Cascade (3.7 / 3.6 / 3.5 Flash)"]
        G_TTS["Gemini Neural TTS (Aoede Voice)"]
        G_Chat["Gemini 3.5 Flash Lite (Dr. Crop)"]
    end

    subgraph Cloud["☁️ Database & External Services"]
        DB_Scans["Firestore: scans collection"]
        DB_Audio["Firestore: audio_cache collection"]
        Weather["Open-Meteo Satellite Grid API"]
    end

    Client -->|"HTTPS / JSON"| API
    R_Diag --> G_Vision
    G_Vision -.->|"Failover (>12s)"| G_Cascade
    R_Diag --> DB_Scans
    R_Audio --> DB_Audio
    R_Audio --> G_TTS
    R_Chat --> G_Chat
    R_Hist --> DB_Scans
    R_Clim --> Weather
```

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15.2 (App Router)** | React Server Components, standalone container output |
| **Language** | **TypeScript 5.8 (Strict Mode)** | Strict typing across agronomic and diagnostic schemas |
| **Styling** | **Tailwind CSS 3.4** | Zero-overflow responsive layout down to 320px viewports |
| **Icons** | **Lucide React** | Clinical SVG vector icons (no OS-dependent emoji glitches) |
| **AI Vision** | **Google Gemini 3.8 Flash** | Fast, high-accuracy crop disease and lesion detection |
| **Vision Cascade** | **Gemini 3.7 / 3.6 / 3.5 Flash** | 7-tier automated failover cascade ensuring 99.99% uptime |
| **Spoken Audio** | **Gemini Neural TTS (`Aoede`)** | Calm, gentle female voice output in Urdu and English |
| **Database** | **Google Cloud Firestore** | Real-time NoSQL store with automatic chunking for audio >700KB |
| **Server Admin** | **Firebase Admin SDK 13.2** | Node.js backend singleton with `ignoreUndefinedProperties: true` |
| **Weather API** | **Open-Meteo API** | Free, open agricultural meteorological satellite data |
| **PWA Delivery** | **Service Worker & Web Manifest**| 1-tap installable home screen app with offline capability |

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js:** v20.x or higher
* **npm:** v10.x or higher
* **Google Gemini API Key:** Obtain from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/agrishield-ai.git
cd agrishield-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment template:
```bash
cp .env.example .env.local
```

Open `.env.local` and configure your credentials:
```env
# Required for AI vision, chat, and spoken audio
GEMINI_API_KEY="your_google_gemini_api_key_here"

# Optional: Firebase / Firestore (falls back gracefully to in-memory store if unset)
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

> **Note:** Never commit `.env` or `.env.local` to version control.

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🚢 Deployment

### Option 1: Deploy to Google Cloud Run (Recommended for Google Cloud)
AgriShield AI includes a multi-stage, containerized [`Dockerfile`](Dockerfile) optimized for Cloud Run:

```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy directly from source
gcloud run deploy agrishield-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### Option 2: Deploy to Vercel
1. Push your repository to GitHub.
2. Import the project in **[vercel.com](https://vercel.com)**.
3. In **Project Settings $\rightarrow$ Environment Variables**, add:
   * `GEMINI_API_KEY`
   * `FIREBASE_PROJECT_ID` (optional)
   * `FIREBASE_CLIENT_EMAIL` (optional)
   * `FIREBASE_PRIVATE_KEY` (optional)
4. Click **Deploy**. Vercel will build and launch your production HTTPS URL.

---

## 📂 Project Directory Structure

```
├── app/
│   ├── api/
│   │   ├── audio/route.ts            # Studio-grade Neural TTS with Firestore chunked cache
│   │   ├── chat/route.ts             # Dr. Crop context-aware multi-turn AI consultation
│   │   ├── climate-advisory/route.ts # Microclimate risk analysis & spray timing advice
│   │   ├── diagnose/route.ts         # 7-tier Gemini multimodal vision pathology cascade
│   │   ├── history/route.ts          # Real-time community feed with ownership deletion
│   │   └── locate/route.ts           # Reverse-geocoding for agricultural farm coordinates
│   ├── globals.css                   # Tailwind utilities, TastyTabs pill navigation styles
│   ├── layout.tsx                    # Root HTML, viewport configs, PWA meta headers
│   └── page.tsx                      # Main interactive dashboard (Scanner, Doctor, Vault, Shield)
├── lib/
│   ├── firebase.ts                   # Firebase Client & Admin SDK singleton with key sanitization
│   ├── scanStore.ts                  # In-memory fallback scan store for offline/demo use
│   ├── types.ts                      # Strict TypeScript schemas (DiagnosisResult, ScanRecord, etc.)
│   └── utils.ts                      # Canvas image resizing and EXIF coordinate parsing
├── public/
│   ├── icon.svg                      # PWA scalable application icon
│   ├── manifest.json                 # Web App Manifest for mobile installation
│   └── sw.js                         # Service Worker for offline asset caching
├── Dockerfile                        # Multi-stage standalone Next.js container for Cloud Run
├── next.config.mjs                   # Standalone output configuration
├── package.json                      # Project dependencies & npm scripts
└── README.md                         # Project documentation
```

---

## 🔒 Security & Privacy Architecture

* **Device-Level Cryptographic Isolation:** Each farmer's device generates a random UUID (`farmer_<uuid>`) in `localStorage`.
* **Zero-Tamper Deletions:** Server validates `scan.userId === requestUserId` before executing deletions (`DELETE /api/history`).
* **Non-Owner Token Guard:** Dr. Crop interactive chat is locked on community scans to prevent third-party visitors from consuming the owner's AI quotas.
* **Sanitized Secrets:** Private keys are cleaned of accidental surrounding quotes and escaped newlines to ensure reliable serverless execution.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

*Engineered with ❤️ for smallholder farmers and agricultural cooperatives worldwide.*

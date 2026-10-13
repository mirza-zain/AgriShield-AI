# AGENTS.md - AgriShield AI Developer & AI Assistant Guide

Welcome to **AgriShield AI**! This project is an intelligent crop pathology, climate resilience, and treatment recommendation platform designed for smallholder farmers and agricultural cooperatives.

If you are an AI assistant (Cursor, Antigravity, Copilot, Claude) or a developer collaborating on this repository, read this guide to understand the system architecture, guidelines, and how to safely extend features.

---

## 1. Project Overview & Tech Stack

* **Framework:** Next.js 15 (App Router, Standalone mode for Cloud Run)
* **Language:** TypeScript (strict mode)
* **Styling & UI:** Tailwind CSS, Lucide React icons, Mobile-first responsive design, PWA ready
* **AI Vision & Diagnosis:** Google Gemini (`gemini-3.5-flash-lite`, `gemini-3.8-flash` via `@google/genai` SDK) with structured JSON output schema
* **AI Spoken Audio (TTS):** Google Gemini Neural TTS (`gemini-3.8-flash-lite-tts`, `gemini-3.8-flash-tts`) delivering conversational spoken audio
* **Database & Feed:** Google Cloud Firestore (`scans` collection) with automatic in-memory fallback for local development
* **Deployment:** Containerized via multi-stage `Dockerfile` targeting Google Cloud Run

---

## 2. Directory Structure

```
├── app/
│   ├── api/
│   │   ├── audio/route.ts       # Studio-grade spoken audio using Gemini TTS
│   │   ├── diagnose/route.ts    # Multimodal leaf diagnosis with Gemini + Firestore write
│   │   └── history/route.ts     # Live community feed of recent crop diagnoses
│   ├── globals.css              # Global styles, tailwind utilities
│   ├── layout.tsx               # PWA meta tags, viewport settings, root HTML
│   └── page.tsx                 # Interactive dashboard: scanner, presets, audio, PWA install
├── lib/
│   ├── firebase.ts              # Firebase client SDK & Firebase Admin SDK singleton
│   └── types.ts                 # TypeScript interfaces (DiagnosisResult, ScanRecord)
├── public/
│   ├── icon.svg                 # PWA App Icon
│   └── manifest.json            # Web App Manifest for mobile installation
├── Dockerfile                   # Standalone Next.js Docker configuration for Cloud Run
├── next.config.mjs              # Standalone output & remote image patterns
└── package.json                 # Project dependencies & scripts
```

---

## 3. Environment Variables Setup

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Refer to [.env.example](.env.example) for the list of required and optional configuration keys.

> **IMPORTANT:** Never commit `.env` or `.env.local` to git. Keep real keys strictly inside `.env.local`.

---

## 4. How to Run Locally

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
# Open http://localhost:3000

# Build and verify production bundle
npm run build
```

---

## 5. Critical Instructions for AI Assistants (Cursor / Antigravity / Copilot)

When modifying or expanding this codebase, strictly follow these rules:

### A. Simplicity of Language (Do NOT use heavy academic jargon)
* **Smallholder Farmers are the end users**: All user-facing text, diagnosis explanations, and spoken audio must use **simple, everyday conversational language**.
* **Urdu:** Use everyday conversational Urdu (روزمرہ کی عام فہم اور آسان اردو) such as *"ٹماٹر کا پودا"*, *"پتوں پر داغ"*, *"دیسی علاج"*, *"فوری بچاؤ"*. Avoid classical, bookish, or Sanskritized/Persianized vocabulary.
* **English:** Keep phrases short and actionable (*"Do Today"*, *"Home Remedy"*, *"Shop Spray"*, *"Weather Alert"* instead of *"Phytopathological defoliation"* or *"Systemic fungicides"*).

### B. Gemini API & Audio Conventions
* **Active Models:** Google has retired older versions like `gemini-1.5-flash` or `gemini-2.0-flash`. Use active models:
  * Vision & Diagnosis: `gemini-3.5-flash-lite`, `gemini-3.8-flash`, `gemini-flash-latest`.
  * Spoken Audio (TTS): `gemini-3.8-flash-lite-tts`, `gemini-3.8-flash-tts`.
* **Audio Cleanliness:** Never send system instructions or meta-prompts (e.g. *"You are a doctor, say..."*) directly into the TTS model's `contents` argument. The TTS model reads **all** text input aloud. Send **only** the clean text that should be spoken to the user.

### C. Graceful Fallbacks (Offline & Demo Friendly)
* If `GEMINI_API_KEY` or Firebase credentials are missing or rate-limited, ensure all endpoints gracefully return readable mock data so judges and developers never see a broken white screen.

### D. Mobile-First & PWA
* Always preserve the mobile camera button, quick-sample preset buttons (for judges to test without uploading), and PWA installation capability (`manifest.json` and `beforeinstallprompt`).

### E. Security & Privacy: DO NOT READ OR EXPOSE `.env` FILES
* **STRICT PROHIBITION**: AI models/agents must **NEVER** inspect, read, print, log, or commit `.env`, `.env.local`, or any local environment file containing credentials.
* If testing commands or scripts, never print or echo environment variables or private keys into terminal logs, git commits, or responses.
* Refer developers strictly to `.env.example` placeholders without looking at actual secret values on disk.

---

## 6. Deployment to Google Cloud Run

To deploy to Cloud Run with a single command:

```bash
gcloud run deploy agrishield-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_api_key"
```


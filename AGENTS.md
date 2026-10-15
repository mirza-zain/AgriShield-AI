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
* **Active Models:** Google has shut down older versions like `gemini-2.0-flash` and restricted `gemini-2.5-flash`. Use active models per [Google AI Studio Models Catalog](https://aistudio.google.com/docs/models):
  * Vision & Diagnosis: `gemini-3.8-flash` (Primary), `gemini-3.6-flash`, `gemini-3.5-flash-lite`, `gemini-flash-latest`.
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

### F. Strict Commit & Review Protocol: NEVER Commit Autonomously
* **DO NOT COMMIT UNLESS THE USER EXPLICITLY ASKS**: AI assistants/agents must **NEVER** run `git commit`, `git push`, or create commits autonomously. Only commit when the user explicitly commands it in their prompt (e.g., *"commit this"*, *"let's commit"*). No auto-committing under any circumstance.
* **HUMAN REVIEW FIRST**: Everything must be reviewed and approved by the human developer before any commit action.
* **ACTIVE IMPLEMENTATION PLAN & TASK LIST**: Maintain an active implementation plan and task list for all non-trivial tasks so the user has full transparency over what is being changed and executed.

### G. Strict Transparency & User Approval Before Making Changes (NO SILENT EDITS)
* **NO SILENT CHANGES**: The AI must **NEVER** modify, create, or delete any files silently or behind the scenes.
* **EXPLICIT PROPOSAL & RATIONALE**: Before touching any file, the AI must explicitly show the user:
  1. Exactly which file is going to be modified.
  2. Exactly what code lines will change.
  3. The exact rationale/reason for the change.
* **WAIT FOR USER APPROVAL**: The AI must ask for and receive explicit approval from the user before executing edits to critical project files.

### H. UI / UX Preservation (DO NOT Change Visual Design Autonomously)
* **PRESERVE EXISTING UI / UX**: The AI must **NEVER** redesign, reorganize, or restyle the visual interface, colors, layouts, buttons, or typography unless the user explicitly commands a visual change.
* **FUNCTIONALITY OVER RESTYLING**: Any performance, accuracy, or backend improvements must fit seamlessly into the existing UI without breaking or arbitrarily changing established user flows.

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

---

## 7. YAFTY / TastyTabs Design System & UI Guidelines

All visual, structural, and workflow implementations must strictly adhere to the official design system detailed in [DESIGN_GUIDELINES.md](DESIGN_GUIDELINES.md).

### Non-Negotiable Standards:
* **Zero-Overflow Rule:** Every text-bearing flex container child must include `min-w-0`. Badges, icons, and status chips must include `flex-shrink-0 whitespace-nowrap`. The UI must never horizontally scroll or cause element clipping on viewports down to 320px.
* **Segmented Navigation:** Use tactile capsule containers (`rounded-2xl bg-slate-200/80 border border-slate-300/70 p-1 shadow-inner gap-1`) with elevated active pills (`scale-[1.02] bg-white text-emerald-950`).
* **Mobile-First Adaptive Typography:** Use compact punchy labels on small screens (e.g. `"Doctor"`, `"Vault"`, `"Climate"`, `"Treatment"`, `"Causes"`, `"Dr. Chat"`) and full descriptive titles on desktop.
* **Extreme Performance & Resource Economy:** Preserve in-memory translation and spoken audio caches (`languageDiagnosisCacheRef`, `clientAudioCacheRef`), utilize HTML5 canvas dual-scale thumbnailing, and use GPU transforms (`transform-gpu`, `active:scale-[0.98]`) to ensure instantaneous interaction without layout reflows.
* **Crisp Lucide React SVG Icons Over Emojis:** Never use OS-dependent unicode emojis for badges, chips, buttons, headers, or empty states. Always use Lucide React icons with explicit bounding (`flex-shrink-0 w-3.5 h-3.5`) to preserve cross-platform clinical elegance and prevent baseline reflow.
* **Unobtrusive Connectivity (Silent Online, Offline-Only Indicator):** Never render persistent "Online / Live" badges in the navbar during normal internet connectivity. Only surface an amber `<WifiOff />` indicator when the user is offline (`!isOnline`) to guide them to the local Offline Vault.



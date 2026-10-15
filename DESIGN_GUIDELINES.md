# AgriShield AI - YAFTY / TastyTabs Design Guidelines & Zero-Overflow Architecture

Welcome to the **AgriShield AI Design System**. This guide codifies the **YAFTY / TastyTabs** design philosophy, component architecture, responsiveness standards, and performance rules for all developers and AI assistants collaborating on this codebase.

---

## 1. The YAFTY / TastyTabs Philosophy

AgriShield AI is built for **smallholder farmers, cooperative scouts, and agricultural specialists** using a variety of devices—from low-end Android phones in rural fields to desktop workstations.

The **YAFTY / TastyTabs** design philosophy delivers:
1. **In-Page Tactile Workflows (No Reloads):** Segmented navigation capsules that switch views instantly without page reloads, preserving input, preview images, and inspection states.
2. **Zero-Overflow Guarantee:** No text, badge, button, or container may ever clip, force horizontal viewport scrolling, or break onto unintended lines on screens from **320px** upwards.
3. **Ergonomic Outdoor Usability:** High-contrast text, clear visual hierarchy, minimum 40px touch targets, and sunlight-legible badges.
4. **Extreme Performance & Resource Economy:** Instantaneous interactions powered by GPU transforms, client-side in-memory caches, and dual-scale canvas image compression.

---

## 2. Segmented Navigation & Capsule Architecture

Segmented controls are the backbone of the TastyTabs interface:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Outer Capsule: rounded-2xl bg-slate-200/80 border-slate-300/70 p-1    │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌─────────────────┐ │
│  │ Active Pill:         │ │ Inactive Pill:       │ │ Inactive Pill:  │ │
│  │ bg-white text-950    │ │ text-slate-600       │ │ text-slate-600  │ │
│  │ shadow-sm scale-1.02 │ │ hover:text-slate-900 │ │                 │ │
│  └──────────────────────┘ └──────────────────────┘ └─────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Capsule Design Pattern:
* **Container:** `flex items-center p-1 sm:p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/70 shadow-inner gap-1`
* **Active Item:** `bg-white text-emerald-950 font-black shadow-sm scale-[1.02] border border-slate-200/50`
* **Inactive Item:** `text-slate-600 hover:text-slate-900 font-bold transition-all`
* **Micro-interaction:** `active:scale-[0.98] transform-gpu cursor-pointer select-none`

---

## 3. Strict Zero-Overflow Rules (The Iron Law of Responsiveness)

Every layout in AgriShield AI must strictly adhere to the following rules:

### A. Flex Children with Text Must Have `min-w-0`
By default in CSS, flex items have `min-width: auto`, allowing long text to blow past the viewport boundary.
* **Rule:** Every flex container item containing headings, labels, or dynamic text **must** include `min-w-0`.

### B. Long Headings & Titles Must Use `truncate` or `break-words`
* Single-line items: Use `truncate` (e.g. crop scientific names, preset badges, location strings).
* Multi-line items: Use `break-words` with controlled margins (e.g. vernacular diagnosis condition names).

### C. Badges, Icons & Status Chips Must Never Squish
* **Rule:** All icon wrappers, severity badges, and status pills must have `flex-shrink-0 whitespace-nowrap`.
* Icons must maintain fixed bounds (`w-3.5 h-3.5 flex-shrink-0` or `w-4 h-4 flex-shrink-0`).

### D. Mobile-First Adaptive Typography
Long strings break on small displays (320px–375px). Use responsive display spans:
```tsx
{/* Sub-tab example */}
<span className="hidden sm:inline">Treatment & Action</span>
<span className="sm:hidden">Treatment</span>

{/* Urdu sub-tab example */}
<span className="hidden sm:inline">علاج و تدابیر</span>
<span className="sm:hidden">علاج</span>
```

### E. Touch-Friendly Horizontal Strips
For carousels and filter chip lists:
* Use `flex overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory scroll-smooth`.
* Ensure each child button has `snap-start active:scale-95 transform-gpu`.

---

## 4. Semantic Color Palette

Use intentional, high-contrast colors aligned with agricultural pathology:

| Role | Color Token | Purpose |
| :--- | :--- | :--- |
| **Primary / Health** | Emerald (`bg-emerald-600`, `text-emerald-950`, `border-emerald-200`) | Healthy crops, primary actions, positive states |
| **Secondary / Accents** | Teal (`to-teal-700`, `bg-teal-50`) | Brand gradient blends, calm clinical accents |
| **Warning / Mildew** | Amber (`bg-amber-50`, `text-amber-900`, `border-amber-300`) | Moderate severity, heat stress, fungal alerts |
| **Critical / Rot** | Rose (`bg-rose-50`, `text-rose-700`, `border-rose-300`) | High severity, fruit rot, blossom drop, cancel buttons |
| **Weather / Cloud** | Blue / Purple (`bg-blue-50`, `text-blue-900`, `bg-purple-50`) | Climate metrics, rain forecasts, observation timestamps |
| **Base / Structure** | Slate (`bg-slate-50`, `border-slate-200/90`, `text-slate-900`) | Cards, borders, inner capsule tracks |

---

## 5. Performance, Speed & Resource Economy

Farmers in rural areas face limited battery life and high latency. UI code must operate with extreme efficiency:

1. **Dual-Scale Client-Side Image Compression:**
   - Diagnostic full image: Max 2048px, JPEG quality 0.92 (~70KB payload).
   - Vault thumbnail: Max 360px, JPEG quality 0.65 (~15KB payload).
   - Generated client-side via HTML5 canvas, minimizing server load and bandwidth.
2. **In-Memory Client Caching (Zero Token Waste):**
   - `languageDiagnosisCacheRef`: Caches multilingual translations in memory. Switching languages for an active specimen uses **0 API tokens** and renders in **<1ms**.
   - `clientAudioCacheRef`: Caches spoken neural voice audio in memory. Replaying audio uses **0 network requests**.
3. **GPU-Accelerated Micro-Animations:**
   - Always use `transform-gpu` and CSS transforms (`scale-[1.02]`, `active:scale-[0.98]`).
   - Avoid animating layout properties like `height`, `width`, or `margin` that cause browser reflow.
4. **Conditional Tab Rendering:**
   - Only render heavy DOM trees for the active view tab (`activeViewTab === "doctor"`, `"vault"`, `"advisory"`), saving mobile CPU and memory.

---

## 7. Lucide SVG Icons Over Unicode Emojis (Visual Elegance & Uniformity)

AgriShield AI is a clinical, scientific agronomy diagnostic tool. Unicode emojis (e.g. 🎯, 🌿, 🌾, 🌧️, ⛅, 💬) vary wildly across devices (Google Android vs. Apple iOS vs. Windows vs. Linux) and introduce inconsistent baseline alignments, fuzzy bitmaps, and visual discordance.

### Icon Design Standards:
1. **Always Prioritize Lucide React SVG Icons:**
   - Use crisp, modern vector SVGs from `lucide-react` across all UI badges, buttons, chips, empty states, and cards.
   - Example icons: `<Target />`, `<Leaf />`, `<Sprout />`, `<MapPin />`, `<Clock />`, `<Calendar />`, `<CloudSun />`, `<CloudRain />`, `<Droplets />`, `<Microscope />`, `<Check />`, `<X />`, `<Volume2 />`, `<Zap />`, `<Heart />`.
2. **Fixed Bounding & Non-Squish Rule:**
   - Every icon inside a flex container must specify `flex-shrink-0` and explicit dimensions (`w-3 h-3`, `w-3.5 h-3.5`, or `w-4 h-4`).
3. **Toast Notifications:**
   - Toast alerts must use the optional second argument icon parameter (e.g., `showToast("Diagnosis completed successfully!", <CheckCircle2 className="w-4 h-4 text-emerald-400" />)`) instead of embedding emojis into string messages.

---

## 8. Unobtrusive Connectivity & Status Indicators

Rural agricultural workers and farmers frequently transition between field data collection and cooperative centers. Network status indicators must be actionable and calm:

1. **Silent When Connected:**
   - During normal online internet connectivity, do **not** render a persistent "Online Cloud / Live" pill in the navbar. Normal operation is the baseline and does not require constant visual attention.
2. **Active Warning Only When Disconnected:**
   - When the user loses internet connection (`!isOnline`), an amber pill with `<WifiOff className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />` surfaces in the header action bar to inform the user that scans will save locally to the **Offline Vault**.
3. **Smooth State Transitions:**
   - When internet reconnects, trigger a transient, non-intrusive toast (`"Internet restored, Cloud AI active"`) with `<CheckCircle2 />` and silently dismiss the offline pill.

---

## 9. Verification Checklist for New UI Components

Before committing any UI changes, verify:
- [ ] No horizontal viewport scrolling on screens at 320px width (`overflow-x-hidden`).
- [ ] Every flex text container has `min-w-0`.
- [ ] All status pills and badges have `flex-shrink-0 whitespace-nowrap`.
- [ ] All icons are Lucide React SVGs (`lucide-react`) with `flex-shrink-0`; no unicode emojis in UI elements or toast messages.
- [ ] Navbar network indicator is hidden when online and only displays `<WifiOff />` when offline.
- [ ] Interactive elements have tactile feedback (`active:scale-[0.98]`).
- [ ] Both English and conversational Urdu render without overlapping elements.
- [ ] `npx tsc --noEmit` passes with 0 errors.


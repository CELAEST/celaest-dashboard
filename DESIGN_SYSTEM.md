# CELAEST Design System & Documentation

## 1. Software Overview - "CELAEST Dashboard"

**CELAEST** is a high-performance, modern administrative dashboard built for managing digital ecosystems. It serves as a central hub for controlling software assets, licensing, billing, and distribution.

### Core Core Capabilities
- **Auth & Security:** Role-based access (Client vs. Admin), social login (Google/GitHub), and audit logs.
- **Digital Asset Management:** CRUD operations for proprietary software types (Excel Macros, Python Scripts, Google Sheets templates).
- **Licensing Hub:** An advanced system for generating, validating, and monitoring software licenses with anti-piracy features (IP tracking, device fingerprinting).
- **Marketplace:** A storefront for users to browse and purchase digital tools.
- **Billing & Finance:** Subscription management, invoice history, and financial health dashboards (MRR/ARR).
- **Release Management:** Version control integration, deployment pipelines, and update centers.
- **Analytics:** Real-time error monitoring, ROI calculation, and user activity tracking.

---

## 2. Visual Identity & Style Guide

The design philosophy follows a **"Premium Tech"** aesthetic. It prioritizes clarity in Light Mode and a sleek, immersive experience in Dark Mode (Cyberpunk/Neon influence).

### 🎨 Color Palette

#### Primary Brand Gradients
*Used for buttons, active states, and logos.*
- **Light Mode:** **Royal Blue Gradient**
  - Start: `Blue-600` (#2563eb)
  - End: `Indigo-600` (#4f46e5)
- **Dark Mode:** **Neon Cipher Gradient**
  - Start: `Cyan-400` (#22d3ee) 
  - End: `Blue-400` (#60a5fa)

#### Backgrounds & Surfaces
- **Light Mode:**
  - Global Background: `#f8fafc` (Slate-50) or pure White.
  - Cards: White with subtle shadow (`shadow-sm`, `border-gray-200`).
- **Dark Mode:**
  - Global Background: Deep Black `#0a0a0a`.
  - Glass Surfaces: `bg-black/40` with `backdrop-blur-xl` and `border-white/10`.

#### Functional Semantics
- **Success/Verified:** Emerald Green (`text-emerald-500`, `bg-emerald-500/10`)
- **Warning/Pending:** Orange (`text-orange-500`, `bg-orange-500/10`)
- **Error/Critical:** Red (`text-red-500`, `bg-red-500/10`)
- **Tech/Code:** Sky Blue or Purple (`text-purple-400`)

### 🔤 Typography
- **Primary Font:** `Geist Sans` (Modern, geometric, neutral).
- **Monospace:** `Geist Mono` (For API keys, Logs, License codes).
- **Headings:** Bold, often using `tracking-tight` for a modern feel.

### ✨ UI Primitives
- **Glassmorphism:** Extensive use of `backdrop-blur` in modals, headers, and sidebars.
- **Rounded Corners:** Generous radii.
  - Cards: `rounded-2xl` or `rounded-3xl`.
  - Buttons: `rounded-xl`.
  - Inputs: `rounded-lg`.
- **Micro-Interactions:** 
  - Hover effects: Scale up (`scale-105`), glow effects (shadow color changes).
  - Transitions: Smooth `cubic-bezier(0.43, 0.13, 0.23, 0.96)`.

---

## 3. PROMPT FOR FIGMA AI (Copy & Paste)

Use this prompt to generate UI designs consistent with the current codebase:

> **Project Context:** Design a UI for "CELAEST", a premium SaaS dashboard for software licensing and asset management. 
>
> **Visual Style:** Modern, clean, and tech-forward.
> **Light Mode:** Use a palette of crisp Whites (#ffffff) and Light Grays (#f8fafc) with primary accents in Royal Blue (#2563eb) to Indigo (#4f46e5). Use subtle shadows and clean borders (#e2e8f0).
> **Dark Mode (Priority):** Create a "Glassmorphism" look. Background is Deep Black (#0a0a0a). Cards should be semi-transparent Black (10-40% opacity) with a background blur (20px) and a thin, white stroke (10% opacity). Primary accents are Neon Cyan (#22d3ee) and Blue (#60a5fa).
>
> **Typography:** Use "Geist Sans" (similar to Inter/SF Pro). Headings are bold and tight. Use "Geist Mono" for data tables and code snippets.
> **Components:** Rounded corners (16px-24px for cards, 12px for buttons). Buttons should use linear gradients. Input fields should have a subtle background (`bg-gray-50` light / `bg-white/5` dark).
> **Layout:** Sidebar navigation on the left, top header with global search and user profile. Dashboard widgets should be grid-based cards.

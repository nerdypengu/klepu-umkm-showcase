# Lapak UMKM & Showcase Investasi Desa Klepu

A modern, interactive web application showcasing local micro, small, and medium enterprises (UMKM) in **Desa Klepu, Sooko, Ponorogo**. This platform is designed to highlight investment opportunities, product catalogs, financial requirements, operational readiness, and risk mitigations for local businesses.

---

## 🌟 Key Features

- **Interactive UMKM Catalog**: Browse active local enterprises categorized by *Kopi (Liberika Coffee)*, *Herbal (Kelor & Secang)*, *Makanan (Tempe Chips)*, *Kerajinan (Woven Handicrafts)*, and *Kuliner (Local Culinary)*.
- **Detailed Investment Profiles**: Each UMKM profile features:
  - Product specifications, pricing, and business summaries.
  - Indicative capital requirements and breakdown of fund usage.
  - Feasibility scoring across distribution, technology, market, finance, and raw materials.
  - Operational facts, target market analysis, risk mitigations, and prerequisites.
  - ROI & payback period simulations.
- **Media Gallery**: High-resolution photos and video documentation demonstrating the manual crafting and roasting processes.
- **Direct Contact & Location**: Direct WhatsApp ordering links and Google Maps location integration.
- **Modern UI & Responsive Design**: Built with smooth micro-animations, accessible navigation, and custom claymorphism visual aesthetics (`shadow-clay`).

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- **Build Tool**: [Vite](https://vitejs.dev/) & [Nitro Engine](https://nitro.unjs.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS design system
- **Icons & UI Primitives**: [Lucide React](https://lucide.dev/) & Radix UI primitives
- **Language**: TypeScript

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed on your system.

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/nerdypengu/klepu-umkm-showcase.git
   cd klepu-umkm-showcase
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   # Remote host for proxying media assets locally
   LOVABLE_PREVIEW_HOST=id-preview--2cacb1aa-9c99-4936-8b88-694d232967d2.lovable.app
   ```

4. **Run the local development server:**
   ```sh
   npm run dev
   ```
   Open `http://localhost:5173` or `http://localhost:8080` in your browser.

5. **Build for Production:**
   ```sh
   npm run build
   ```

---

## 📁 Project Structure

```
klepu-umkm-showcase/
├── src/
│   ├── assets/              # Product photos, posters, and asset descriptors
│   ├── components/          # Reusable UI components (UmkmCard, SiteHeader, SiteFooter)
│   ├── lib/                 # Core data (umkm-data.ts) and helper utilities
│   ├── routes/              # TanStack file-based routes (index.tsx, umkm.$slug.tsx)
│   └── styles.css           # Global styles and Tailwind configuration
├── public/                  # Favicon and static files
├── vite.config.ts           # Vite configuration
└── package.json             # Project dependencies and scripts
```

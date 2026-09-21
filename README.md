# Burj Accounts | Real Estate Builder & Sales PWA

A mobile-only Progressive Web App (PWA) engineered for real estate developers and builders constructing towers in the UAE and selling units to buyers. It bridges **Construction Cost Management (CAPEX/WIP)** directly with **Corresponding Unit Sales & Revenue Accounting**.

---

## 🌟 Core Features

- **P&L Financial Pulse**:
  - Live calculation of **Gross Development Value (GDV)**, **Construction Cost Budget**, and **Projected Builder Profit Margin**.
  - **Cashflow Matcher**: Tracks whether buyer cash collections cover upcoming contractor invoices.
- **Interactive 3D & 2D Tower Visualization**:
  - **3D Orbit Model**: Built with Three.js; 360° rotation, floor inspection, and unit picking.
  - **2D Architectural Facade**: Floor-by-floor cross-section from Penthouse down to Podium.
  - **Color-coded Units**:
    - 🟢 **Sold / 100% Paid** (Emerald)
    - 🟡 **Partial Paid / Installment Active** (Amber)
    - ⚪ **Vacant / Available** (Soft Blue/Slate)
- **Construction Cost Management**:
  - Breakdown by trade category (Structure & Civil, MEP, Façade & Glazing, Finishes, Permits, Contingency).
  - Material & subcontractor invoice ledger with quick-log modal.
  - Contractor Interim Payment Certificates (IPCs) with automatic **10% retention withholding** and **5% UAE VAT**.
- **Unit Sales & Receivables Ledger**:
  - Unit-level P&L (Selling Price vs Allocated Construction Cost = Developer Net Profit).
  - Milestone installment schedule (Booking, Ground Slab, Superstructure, Façade, Handover).
  - 1-Tap payment collection feeding directly into the Escrow ledger.
- **Post-Dated Cheques (PDC) & RERA Escrow**:
  - PDC pipeline (`In Hand`, `Deposited`, `Cleared`).
  - 1-Click RERA Escrow Statement Audit Export (JSON).
- **Mobile-First PWA**:
  - Service Worker offline caching, Web App Manifest, tactile micro-interactions.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
The production bundle will be generated in `/dist`.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Custom luxury light theme)
- **3D Visualization**: Three.js WebGL
- **Icons & Polish**: Lucide React + Canvas Confetti
- **PWA**: Web App Manifest + Service Worker

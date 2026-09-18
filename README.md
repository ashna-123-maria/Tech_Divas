# 🧭 CampusFind — Centralized University Lost & Found Platform

> **A secure, intelligent campus web platform that replaces scattered WhatsApp groups with automated smart matching, anti-theft ownership challenges, and seamless recovery tracking.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 🎯 Problem Statement
In universities and colleges today, lost and found reports are scattered across dozen of noisy WhatsApp groups, Discord servers, and informal noticeboards. This causes:
- **Lost items get buried** under hundreds of chat messages.
- **Fraudulent claims**: Anyone in the chat group can see the item photo and claim it as theirs.
- **Zero searchability**: No filtering by campus zones, categories, or dates.
- **Campus security disconnect**: Security staff and lost & found desks have no visibility into student groups.

---

## 💡 Solution: CampusFind
**CampusFind** unifies the campus recovery lifecycle into a modern, transparent, and secure platform:

1. **⚡ Smart Matching Engine**: Multi-factor heuristic similarity algorithm that automatically analyzes title keywords, descriptions, categories (35%), campus building proximity (15%), and timestamp windows (15%) to surface high-confidence matches (0–100%) in real-time.
2. **🛡️ Anti-Theft Proof Challenge**: Found items can hide identifying secrets (e.g. lockscreen wallpaper, stickers on the lid, keychain charm). Claimants must answer a verification quiz before contact details or property handover are authorized.
3. **💬 WhatsApp Card Bridge**: 1-click generator that creates formatted broadcast cards and direct `wa.me` links to cleanly migrate chaotic WhatsApp chats to centralized tracking.
4. **👮‍♂️ Campus Security Administration Desk**: Dedicated view for university staff to review proof submissions, authorize returns with celebration animations, inspect physical storage lockers, and print physical QR property tags.
5. **👩‍🎓 1-Click Judge Demo Mode**: Built-in persona switcher (Sarah - Student Owner, Priya - Good Samaritan, Officer Dave - Security Desk) and a floating test guide so hackathon judges can experience all workflows in under 2 minutes.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router, React 19)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v3 with responsive mobile & desktop design
- **Icons:** Lucide React
- **Micro-Interactions:** Canvas Confetti (for celebratory reunions)
- **Storage:** Client-side persistence with pre-seeded realistic campus items (MacBook Air, AirPods, Hydro Flask, Student ID, Car Keys, Jackets) across campus buildings (Library, Cafeteria, Science Block, Sports Gym, Parking Lot).

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/ashna-123-maria/Tech_Divas.git
cd Tech_Divas
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🧪 Demo Scenarios for Judges

Click the **Judge Demo Guide** banner at the bottom right to run:
- **Scenario 1 (Smart Match):** Sarah lost her MacBook Air at Central Library. The system automatically detects a 92% match with an Apple laptop turned into the library front desk.
- **Scenario 2 (Report & Quiz):** Post a found item with photo upload/presets and set an anti-theft challenge question.
- **Scenario 3 (Security Desk & Confetti):** Switch to Officer Dave, review pending proof answers, approve handover, and trigger celebratory confetti!
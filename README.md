# 🧭 CampusFind — Centralized University Lost & Found Platform

> **A secure, intelligent campus web platform that replaces scattered WhatsApp groups with automated smart matching, anti-theft ownership challenges, and seamless recovery tracking.**  
> *Engineered for Genesis 2.0 Buildathon — Second Year Track*

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 🎯 Problem Statement
In universities and colleges today, lost and found reports are scattered across dozens of noisy WhatsApp groups, Discord servers, and informal noticeboards. This causes:
- **Lost items get buried** under hundreds of unrelated chat messages.
- **Fraudulent claims**: Anyone in the chat group can see the item photo and claim it as theirs.
- **Zero searchability**: No filtering by campus zones, categories, or dates.
- **Campus security disconnect**: University security desks have no visibility into student chat groups.

---

## 💡 Solution: CampusFind
**CampusFind** unifies the campus recovery lifecycle into a modern, transparent, and secure platform:

1. **⚡ Smart Matching Engine**: Multi-factor heuristic similarity algorithm analyzing title keywords, descriptions, categories ($35\%$), campus building proximity ($15\%$), and timestamp windows ($15\%$) to surface high-confidence matches ($0–100\%$) automatically.
2. **🛡️ Anti-Theft Proof Challenge**: Found items conceal identifying secrets (e.g. lockscreen wallpaper, stickers on the lid, keychain charm). Claimants must answer a verification challenge before contact details or property handover are authorized.
3. **💬 WhatsApp Card Bridge**: 1-click generator that creates formatted broadcast cards and direct `wa.me` links to cleanly migrate chaotic WhatsApp chats to centralized tracking.
4. **👮‍♂️ Campus Security Administration Desk**: Dedicated view for university staff to review proof submissions, authorize returns with celebration animations, inspect physical storage lockers, and print physical QR property tags.
5. **👩‍🎓 1-Click Judge Demo Mode**: Built-in persona switcher (Sarah - Student Owner, Priya - Good Samaritan, Officer Dave - Security Desk) and a floating test guide so hackathon judges can experience all workflows in under 2 minutes.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router, React 19)
- **Backend API:** Dedicated REST API routes (`/api/auth/*`, `/api/items/*`, `/api/claims/*`, `/api/reset`)
- **Language:** TypeScript 5
- **Authentication:** Salted password hashing with `bcryptjs` (10 rounds) + stateless session tokens
- **Styling:** Tailwind CSS v3 with responsive mobile & desktop design
- **Database Layer:** Disk-backed relational data layer (`data/campus.json`) with ACID compliance
- **Icons & Animation:** Lucide React & Canvas Confetti
- **Documentation:** Full engineering justifications in [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 🚀 Step-by-Step Guide: Running the Project Locally

Follow these steps to clone, configure, and run the application on your computer:

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js**: v18.17.0 or higher (v20.x or v24.x recommended). Verify by running:
  ```bash
  node -v
  ```
- **Git**: Installed and configured. Verify by running:
  ```bash
  git --version
  ```

---

### 2. Clone the Repository
Open your terminal (Terminal, Command Prompt, or PowerShell) and clone the repository:
```bash
git clone https://github.com/ashna-123-maria/Tech_Divas.git
cd Tech_Divas
```

---

### 3. Set Up Environment Variables
Create your local environment file by copying the example template:

**macOS / Linux:**
```bash
cp .env.example .env.local
```

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env.local
```

The default values in `.env.example` work out of the box for local development:
```env
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=campus-find-super-secret-key-genesis-2026
BCRYPT_SALT_ROUNDS=10
DATABASE_FILE=./data/campus.json
```

---

### 4. Install Dependencies
Install all required packages:

```bash
npm install
```
*(Note for Windows PowerShell: If script execution is restricted on your system, use `npm.cmd install`)*.

---

### 5. Start the Development Server
Launch the local Next.js development server:

```bash
npm run dev
```
*(On Windows PowerShell, you can also run `npm.cmd run dev`)*.

Once started, open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

### 6. (Optional) Run Production Build
To verify that the production build compiles with zero errors (all pages and REST API routes statically/dynamically generated):

```bash
npm run build
npm start
```

---

## 🔑 Pre-Configured Test Accounts (bcrypt Password Hashing)

For quick testing during judging, these accounts are pre-seeded in the database with verified `bcrypt` hashes:

| Role | Name | Email | Password |
|---|---|---|---|
| **Student (Owner)** | Sarah Jenkins | `sarah.j@campus.edu` | `Password123!` |
| **Student (Good Samaritan)** | Priya Patel | `priya.p@campus.edu` | `Password123!` |
| **Campus Security Desk** | Officer Dave Miller | `lostfound-desk@campus.edu` | `Password123!` |

> 💡 *Tip for Judges: You can also use the **"Judge Quick Fill"** buttons inside the **"Auth / Sign In"** modal or use the **1-click Persona Switcher** in the top navigation bar without typing anything!*

---

## 🌐 Testing Backend REST API Endpoints

The project includes a complete REST API layer. You can test these endpoints using your browser, cURL, or Postman:

### 1. Fetch Items with Filters & Pagination
```bash
curl http://localhost:3000/api/items?category=electronics&limit=5
```

### 2. Authenticate User (bcrypt verification)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah.j@campus.edu","password":"Password123!"}'
```

### 3. Reset Database to Clean Seed State
```bash
curl -X POST http://localhost:3000/api/reset
```

---

## 🧪 2-Minute Live Demo Walkthrough for Judges

Click the floating **Judge Demo Guide** button at the bottom-right corner of the website to test the 3 core evaluation flows:

1. **Flow 1: Smart Match Detection (Sarah)**
   - Click **Flow 1** to switch to Sarah Jenkins.
   - Look at the top banner: The **Smart Match Engine** automatically flags a **92% match** between Sarah's lost MacBook Air and a laptop found at the Central Library desk.
   - Click **"Review Match"** to see the side-by-side location, timestamp, and keyword token breakdown.

2. **Flow 2: Reporting & Anti-Theft Quiz (Priya)**
   - Click **Flow 2** to test Priya reporting a found item.
   - Shows image upload with instant client preview and demo photo presets.
   - Sets a finder's **Anti-Theft Challenge Question** (*"What stickers are on the lid?"*).

3. **Flow 3: Campus Security Desk & Confetti (Officer Dave)**
   - Click **Flow 3** to switch to Officer Dave Miller.
   - Opens the **Security Desk Administration** dashboard with campus recovery metrics.
   - Review Sarah's verification answer against the challenge question.
   - Click **"Approve Handover & Mark Reunited"** — celebratory confetti fires, the item is officially marked as reunited, and physical QR tags can be printed!

---

## 📚 Architectural Justifications
For in-depth explanations of database selection, cloud/REST architecture, password security, and scalability analysis, refer to:  
👉 [**`ARCHITECTURE.md`**](./ARCHITECTURE.md)

---

## 👥 Authors — Tech Divas
- Built for **Genesis 2.0 Buildathon — Second Year Track**
- *"Don't just build software. Engineer it."*
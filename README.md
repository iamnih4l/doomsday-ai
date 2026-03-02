# 🕰️ Doomsday AI: The Autonomous Risk Clock

[![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=doomsday-ai-lzee)](https://doomsday-ai-lzee.vercel.app/)
[![Autonomous Scheduler](https://github.com/iamnih4l/doomsday-ai/actions/workflows/scheduler.yml/badge.svg)](https://github.com/iamnih4l/doomsday-ai/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **"What time is it?"**
> Currently: **90 Seconds to Midnight.** ⚠️

[**🔴 VIEW LIVE CLOCK**](https://doomsday-ai-lzee.vercel.app/)

---

## 🌍 What is this?
**Doomsday AI** is a fully autonomous, self-operating backend that monitors the state of the world 24/7.
It uses a **mathematically-grounded deterministic risk engine** to ingest global news via OSINT feeds, analyze categorical risks (Nuclear, Climate, AI, Bio, Geopolitical), and mathematically calculate if humanity is closer to or further from catastrophe.

### 🧠 How It Works (The "Math Engine")
1. **Deterministic Ingestion:** Safely ingests raw XML/RSS (BBC, Al Jazeera, Guardian, NPR, DW) every 30 minutes, keeping only the last 24 hours of data.
2. **Deduplication:** Analyzes headlines through a SHA-256 hash filter to guarantee the same news event is never double-counted.
3. **Keyword Scoring & Time Decay:** Extrapolates raw domain scores based on strict positive and negative keyword coefficients. Older headlines decay smoothly via `Decay(t) = e^(-0.05 * Δt)`.
4. **Logistic Normalization:** Squashes infinite headline scores into a strict 0-100 range via bounded logistic curves (`100 / (1 + e^(-0.20 * Risk))`).
5. **Clock Movement Function:** Computes movement delta mathematically using a hyperbolic tangent `ΔC = 30 * tanh(ΔGlobal / 10)` ensuring smooth, continuous tracking without violent jumps. 
6. **Defense Caps:** Enforces a rigid 60-second limit on aggregate daily movement.

---

## ✨ Key Features
| Feature | Status | Description |
| :--- | :---: | :--- |
| ** autonomous_clock** | ✅ | Adjusts time mathematically based on OSINT volume and sentiment. |
| ** robust_scraper** | ✅ | Ingests from 5 global sources every 30 mins with hash-based deduping. |
| ** deterministic_explanation** | ✅ | Generates hallucination-free summaries of "Why the clock moved". |
| ** bounded_movement** | ✅ | Employs logistic, decay, and smoothing functions to prevent jitter. |
| ** no_hallucinations** | ✅ | 100% independent of generative AI and 3rd-party API keys. |

---

## 🚀 Easy Deployment (1-Click)

Want your own Doomsday Clock?

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fiamnih4l%2Fdoomsday-ai&env=MONGODB_URI,ADMIN_API_KEY)

**Required Environment Variables:**
1.  `MONGODB_URI`: Connection string for MongoDB Atlas.
2.  `ADMIN_API_KEY`: A secure password you create to protect admin routes.

---

## 🛠️ Manual Setup (For Developers)

<details>
<summary>Click to expand Local Installation Guide</summary>

### 1. Clone & Install
```bash
git clone https://github.com/iamnih4l/doomsday-ai.git
cd doomsday-ai
npm install
```

### 2. Configure Environment
Create a `.env.local` file:
```properties
MONGODB_URI=mongodb+srv://...
ADMIN_API_KEY=secret123
```

### 3. Run Locally
```bash
npm run dev
```

### 4. Manually Trigger Engine
```bash
npm run cron:news    # Fetches and ingests news
npm run cron:ai      # Evaluates mathematically and moves clock
```

</details>

---

## 📚 API Documentation

Doomsday AI provides a public REST API for developers to build their own frontends.

**Base URL**: `https://doomsday-ai-lzee.vercel.app/api`

### `GET /clock/current`
Returns the current time and risk level.
```json
{
  "secondsToMidnight": 90,
  "status": "Critical",
  "confidence": "High",
  "reasonChange": "The clock moved 12 seconds closer to midnight due to shifting indicators in..."
}
```

### `GET /risk/breakdown`
Returns the deterministic smoothed score (0-100) for each risk category.
```json
{
  "domains": [
    { "id": "nuclear", "score": 85 },
    { "id": "climate", "score": 70 }
  ]
}
```

---

## 🤝 Contributing
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

*This project is for educational purposes and is not affiliated with the Bulletin of the Atomic Scientists.*

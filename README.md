# Global Risk Clock 🕐

An AI-driven real-time assessment of humanity's global risk level, visualized as a clock showing minutes and seconds to "midnight" - representing catastrophic global harm.

## 🌟 Overview

The Global Risk Clock is a production-ready frontend web application that provides a scientific, calm, and transparent visualization of global existential risks. Inspired by the Doomsday Clock (but not affiliated with the Bulletin of the Atomic Scientists), this project uses mocked AI assessments to track risk across five critical domains.

**Live Demo:** https://risk-clock.preview.emergentagent.com

## ✨ Features

### 🎯 Core Components

1. **Interactive Clock Visualization**
   - Large, central circular clock with smooth ticking animation
   - Real-time display of minutes and seconds to midnight
   - Visual indicators including hour markers and danger zones
   - Confidence level and last updated timestamp

2. **Risk Domain Breakdown**
   - Five critical risk domains with individual scoring:
     - Nuclear & Military Risk
     - Climate Risk
     - Pandemic & Health Risk
     - AI & Emerging Tech Risk
     - Geopolitical Instability
   - Visual progress bars and trend indicators
   - Detailed descriptions for each domain

3. **AI Explanation Section**
   - Plain-language explanations of clock movements
   - Contributing factors with bullet points
   - Historical explanation timeline
   - Confidence level indicators

4. **Global Risk Map**
   - Real-time hotspots based on news analysis
   - Gemini AI extracts location data from risk reports
   - Color-coded risk intensity based on real-time events
   - Region-specific risk scores and descriptions

5. **Historical Timeline**
   - Chronological view of past clock movements
   - Expandable event details
   - Visual indicators for risk direction (closer/away from midnight)
   - Formatted timestamps and change indicators

6. **Professional UI/UX**
   - Clean header with About dialog
   - Comprehensive footer with disclaimers
   - Smooth scroll navigation
   - Responsive design (desktop-first, mobile-friendly)
   - Dark theme with careful color system

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript (ready for TypeScript)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Backend:** Mocked API endpoints (ready for real integration)

## 📁 Project Structure

```
/app
├── app/
│   ├── api/
│   │   └── [[...path]]/
│   │       └── route.js          # Mocked API endpoints
│   ├── page.js                   # Main application page
│   ├── layout.js                 # Root layout with metadata
│   └── globals.css               # Global styles and theme
├── components/
│   ├── Clock.js                  # Main clock visualization
│   ├── RiskBreakdown.js          # Risk domain cards
│   ├── AIExplanation.js          # AI explanations section
│   ├── MapView.js                # Interactive world map
│   ├── Timeline.js               # Historical timeline
│   ├── Header.js                 # Navigation header
│   ├── Footer.js                 # Footer with disclaimers
│   └── ui/                       # shadcn/ui components
├── lib/
│   └── utils/                    # Utility functions
└── package.json                  # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd app
```

2. Install dependencies:
```bash
yarn install
```

3. Configure Environment:
   - Copy `.env.example` to `.env`
   - Set requests keys:
     - `MONGODB_URI`: Connection string for MongoDB
     - `ADMIN_API_KEY`: Secret key for Admin API access
     - `GEMINI_API_KEY`: Google Gemini API Key (Get from aistudio.google.com)

3. Run the development server:
```bash
yarn dev
```

4. Open your browser to:
```
http://localhost:3000
```

## 🔌 API Endpoints

All API endpoints return mocked data and are ready for backend integration:

### `/api/clock`
Returns current clock status:
```json
{
  "minutesToMidnight": 2,
  "secondsToMidnight": 30,
  "status": "Elevated Global Risk",
  "confidence": "High",
  "lastUpdated": "2026-02-15T16:00:00.000Z",
  "trend": "stable"
}
```

### `/api/risk-breakdown`
Returns risk scores across five domains:
```json
{
  "domains": [
    {
      "id": "nuclear",
      "name": "Nuclear & Military Risk",
      "score": 78,
      "change": 5,
      "description": "...",
      "icon": "Radiation"
    },
    // ... 4 more domains
  ],
  "lastUpdated": "2026-02-15T16:00:00.000Z"
}
```

### `/api/explanations`
Returns AI-generated explanations:
```json
{
  "explanations": [
    {
      "id": "1",
      "timestamp": "2026-02-15T14:00:00.000Z",
      "title": "Clock Moved 15 Seconds Closer to Midnight",
      "summary": "...",
      "factors": ["...", "...", "..."],
      "confidence": "High",
      "direction": "forward"
    },
    // ... more explanations
  ]
}
```

### `/api/timeline`
Returns historical clock movements:
```json
{
  "events": [
    {
      "id": "1",
      "date": "2026-02-15T14:00:00.000Z",
      "time": "2:30",
      "direction": "closer",
      "change": 15,
      "reason": "AI safety concerns and geopolitical tensions",
      "details": "..."
    },
    // ... more events
  ]
}
```

### `/api/map-data`
Returns regional risk data:
```json
{
  "regions": [
    {
      "id": "eastern-europe",
      "name": "Eastern Europe",
      "riskLevel": 85,
      "description": "...",
      "coordinates": { "x": 55, "y": 35 }
    },
    // ... more regions
  ]
}
```

## 🎨 Design System

### Color Palette

- **Background:** Deep slate/navy (`slate-950`)
- **Text:** Light gray/white (`slate-100`, `slate-300`)
- **Accents:**
  - Risk increase: Amber/Red (`amber-500`, `red-500`)
  - Risk decrease: Green (`green-500`)
  - Neutral: Slate (`slate-700`)

### Typography

- Clean sans-serif font (system default)
- Font weights: 300 (light), 400 (normal), 500 (medium)
- Clear hierarchy with responsive sizes

### Components

All UI components use shadcn/ui for consistency:
- Cards, Buttons, Badges
- Dialog, Progress bars
- Hover states and smooth transitions

## 🔄 Real-Time Updates (Prepared)

The application is structured to support real-time updates via:
- WebSockets (socket.io ready)
- Server-Sent Events (SSE)
- Polling (currently simulated)

To integrate real-time updates, replace the mocked API calls with your WebSocket/SSE implementation.

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- High contrast color combinations
- Keyboard navigation support
- Screen reader friendly

## 📱 Responsive Design

- **Desktop-first approach**
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile-friendly navigation and layouts
- Touch-friendly interactive elements

## 🔐 Important Disclaimers

This project is:
- ✅ An educational tool for raising awareness about global risks
- ✅ Using mocked AI assessments (ready for real integration)
- ✅ Open source and transparent

This project is NOT:
- ❌ Affiliated with the Bulletin of the Atomic Scientists
- ❌ A replacement for the official Doomsday Clock
- ❌ Professional risk assessment or prediction service

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:

1. **Backend Integration**
   - Replace mocked APIs with real data sources
   - Implement WebSocket/SSE for real-time updates
   - Add data persistence layer

2. **Enhanced Visualizations**
   - More detailed map with actual geographic data
   - Additional chart types for risk trends
   - Data export functionality

3. **Features**
   - User settings and preferences
   - Historical data comparison tools
   - Risk scenario modeling
   - Multi-language support

## 📄 License

This project is built for educational and informational purposes.

## 🙏 Acknowledgments

- Inspired by the Doomsday Clock by the Bulletin of the Atomic Scientists
- Built with Next.js, Tailwind CSS, and shadcn/ui
- Icons from Lucide React

## 📞 Contact

For questions, feedback, or collaboration:
- GitHub Issues: [Link to repository]
- Email: [Contact email]

---

**Built with transparency and concern for humanity's future.** 🌍

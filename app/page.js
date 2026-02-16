'use client'
// Deployment Sync: 1.0.5

import { useState, useEffect } from 'react'
import Clock from '@/components/Clock'
import RiskBreakdown from '@/components/RiskBreakdown'
import AIExplanation from '@/components/AIExplanation'
import MapView from '@/components/MapView'
import Timeline from '@/components/Timeline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { GradientButton } from '@/components/ui/gradient-button'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { EtherealShadow } from '@/components/ui/ethereal-shadow'
import { ChevronDown } from 'lucide-react'

function App() {
  const [clockData, setClockData] = useState(null)
  const [riskData, setRiskData] = useState(null)
  const [explanations, setExplanations] = useState(null)
  const [timeline, setTimeline] = useState(null)
  const [mapData, setMapData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRiskBreakdown, setShowRiskBreakdown] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = () => {
    setLoading(true);

    // 1. Clock Data
    fetch('/api/clock/current', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setClockData({
          ...data,
          minutesToMidnight: Math.floor((data.secondsToMidnight || 90) / 60),
          secondsToMidnight: (data.secondsToMidnight || 90) % 60
        });
      })
      .catch(e => console.error("Clock fetch failed", e));

    // 2. Risk Data
    fetch('/api/risk/breakdown', { cache: 'no-store' })
      .then(res => res.json())
      .then(setRiskData)
      .catch(e => console.error("Risk fetch failed", e));

    // 3. Explanations
    fetch('/api/clock/explanation/latest', { cache: 'no-store' })
      .then(res => res.json())
      .then(setExplanations)
      .catch(e => console.error("Explanation fetch failed", e));

    // 4. Timeline
    fetch('/api/clock/history', { cache: 'no-store' })
      .then(res => res.json())
      .then(setTimeline)
      .catch(e => console.error("Timeline fetch failed", e));

    // 5. Map Data
    fetch('/api/map-data')
      .then(res => res.json())
      .then(setMapData)
      .catch(e => console.error("Map fetch failed", e));

    setLoading(false);
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Removed blocking loading state to allow progressive rendering

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Ethereal Shadow hero banner */}
      <section className="w-full h-[28vh] min-h-[200px] max-h-[320px]">
        <EtherealShadow
          color="rgba(20, 20, 20, 1)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
          title="Global Risk Clock"
          className="text-white"
        />
      </section>

      {/* Hero Section - Main Clock */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <section className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
          {clockData && <Clock data={clockData} />}

          {/* CTA Buttons - with glowing border */}
          <div className="relative rounded-[1.25rem] border-[0.75px] border-neutral-800 p-2 md:rounded-[1.5rem] md:p-3">
            <GlowingEffect
              spread={40}
              glow
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative flex flex-wrap gap-4 justify-center rounded-xl border-[0.75px] border-neutral-800 bg-neutral-900/50 p-6 md:p-8">
              <GradientButton onClick={() => scrollToSection('explanation')}>
                Why did the clock move?
              </GradientButton>
              <GradientButton
                variant="variant"
                onClick={() => setShowRiskBreakdown(!showRiskBreakdown)}
              >
                View risk breakdown
              </GradientButton>
              <GradientButton
                variant="variant"
                onClick={() => setShowTimeline(!showTimeline)}
              >
                Historical timeline
              </GradientButton>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce mt-12">
            <ChevronDown className="w-6 h-6 text-neutral-500" />
          </div>
        </section>

        {/* Risk Breakdown Section */}
        {showRiskBreakdown && riskData && (
          <section id="risk-breakdown" className="py-16">
            <RiskBreakdown data={riskData} />
          </section>
        )}

        {/* AI Explanation Section */}
        <section id="explanation" className="py-16">
          {explanations && <AIExplanation data={explanations} />}
        </section>

        {/* Map View Section */}
        <section id="map" className="py-16">
          {mapData && <MapView data={mapData} />}
        </section>

        {/* Timeline Section */}
        {showTimeline && timeline && (
          <section id="timeline" className="py-16">
            <Timeline data={timeline} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App

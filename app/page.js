'use client'

import { useState, useEffect } from 'react'
import Clock from '@/components/Clock'
import RiskBreakdown from '@/components/RiskBreakdown'
import AIExplanation from '@/components/AIExplanation'
import MapView from '@/components/MapView'
import Timeline from '@/components/Timeline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
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

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      const [clockRes, riskRes, explanationsRes, timelineRes, mapRes] = await Promise.all([
        fetch('/api/clock'),
        fetch('/api/risk-breakdown'),
        fetch('/api/explanations'),
        fetch('/api/timeline'),
        fetch('/api/map-data')
      ])

      const clockData = await clockRes.json()
      const riskData = await riskRes.json()
      const explanationsData = await explanationsRes.json()
      const timelineData = await timelineRes.json()
      const mapData = await mapRes.json()

      setClockData(clockData)
      setRiskData(riskData)
      setExplanations(explanationsData)
      setTimeline(timelineData)
      setMapData(mapData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Global Risk Assessment...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section - Main Clock */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <section className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
          {clockData && <Clock data={clockData} />}
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button
              onClick={() => scrollToSection('explanation')}
              variant="outline"
              className="bg-neutral-900 border-neutral-700 text-white hover:bg-red-600 hover:border-red-600 transition-colors"
            >
              Why did the clock move?
            </Button>
            <Button
              onClick={() => setShowRiskBreakdown(!showRiskBreakdown)}
              variant="outline"
              className="bg-neutral-900 border-neutral-700 text-white hover:bg-red-600 hover:border-red-600 transition-colors"
            >
              View risk breakdown
            </Button>
            <Button
              onClick={() => setShowTimeline(!showTimeline)}
              variant="outline"
              className="bg-neutral-900 border-neutral-700 text-white hover:bg-red-600 hover:border-red-600 transition-colors"
            >
              Historical timeline
            </Button>
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

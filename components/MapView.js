'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { Globe, GLOBE_CONFIG } from '@/components/ui/globe'

const MapView = ({ data }) => {
  const { regions } = data
  const [hoveredRegion, setHoveredRegion] = useState(null)

  const getRiskColor = (riskLevel) => {
    if (riskLevel >= 80) return '#dc2626' // red-600
    if (riskLevel >= 70) return '#ef4444' // red-500
    if (riskLevel >= 60) return '#f87171' // red-400
    return '#fca5a5' // red-300
  }

  const getRiskLabel = (riskLevel) => {
    if (riskLevel >= 80) return 'Critical'
    if (riskLevel >= 70) return 'High'
    if (riskLevel >= 60) return 'Elevated'
    return 'Moderate'
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-light text-white">Global Risk Map</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Regional contributions to current global risk assessment, based on AI analysis of geopolitical,
          environmental, and security factors.
        </p>
      </div>

      {/* 3D Globe - primary map visualization */}
      <div className="relative rounded-[1.25rem] border-[0.75px] border-neutral-800 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <Card className="relative bg-neutral-900 border-neutral-800 rounded-xl border-[0.75px] overflow-hidden">
          <CardContent className="relative flex min-h-[400px] max-h-[560px] w-full items-center justify-center overflow-hidden px-4 pb-16 pt-8 md:pb-24 md:px-8">
            <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-white to-neutral-500/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent md:text-7xl">
              Global Risk
            </span>
            <Globe
              className="top-14 md:top-20"
              config={{
                ...GLOBE_CONFIG,
                dark: 1,
                baseColor: [0.15, 0.15, 0.2],
                markerColor: [220 / 255, 38 / 255, 38 / 255],
                glowColor: [0.4, 0.1, 0.1],
                markers: regions?.map(r => ({
                  location: [r.coordinates.y, r.coordinates.x], // cobe uses [lat, lng]
                  size: 0.05 + (r.riskLevel / 200) // Scale size by risk level (0.05 to ~0.55)
                })) || []
              }}
            />
            <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.4),rgba(255,255,255,0))]" />
          </CardContent>
        </Card>
      </div>

      {/* Risk level legend */}
      <div className="flex flex-wrap justify-center gap-6 rounded-lg border border-neutral-800 bg-neutral-900/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-600" />
          <span className="text-sm text-neutral-400">Critical (80+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-sm text-neutral-400">High (70-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <span className="text-sm text-neutral-400">Elevated (60-69)</span>
        </div>
      </div>

      {/* Region Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions?.map((region) => (
          <div key={region.id} className="relative rounded-[1.25rem] border-[0.75px] border-neutral-800 p-2 md:rounded-[1.5rem] md:p-3">
            <GlowingEffect
              spread={32}
              glow
              disabled={false}
              proximity={48}
              inactiveZone={0.05}
              borderWidth={1}
            />
            <Card
              className={`relative bg-neutral-900 border-neutral-800 transition-all cursor-pointer rounded-xl border-[0.75px] ${hoveredRegion === region.id ? 'border-red-600 shadow-lg shadow-red-900/20' : 'hover:border-neutral-700'
                }`}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-white">{region.name}</CardTitle>
                  <Badge
                    variant="outline"
                    style={{ backgroundColor: `${getRiskColor(region.riskLevel)}20`, borderColor: getRiskColor(region.riskLevel) }}
                    className="text-white"
                  >
                    {getRiskLabel(region.riskLevel)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-400 leading-relaxed">{region.description}</p>
                <div className="mt-3 text-sm">
                  <span className="text-neutral-500">Risk Score: </span>
                  <span className="text-white font-medium">{region.riskLevel}/100</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MapView

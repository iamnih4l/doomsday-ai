'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const MapView = ({ data }) => {
  const { regions } = data
  const [hoveredRegion, setHoveredRegion] = useState(null)

  const getRiskColor = (riskLevel) => {
    if (riskLevel >= 80) return '#ef4444' // red-500
    if (riskLevel >= 70) return '#f97316' // orange-500
    if (riskLevel >= 60) return '#eab308' // yellow-500
    return '#84cc16' // lime-500
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
        <h2 className="text-3xl md:text-4xl font-light text-slate-100">Global Risk Map</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Regional contributions to current global risk assessment, based on AI analysis of geopolitical,
          environmental, and security factors.
        </p>
      </div>

      {/* Simplified World Map Visualization */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-8">
          <div className="relative w-full aspect-[2/1] bg-slate-950 rounded-lg overflow-hidden">
            {/* Simple SVG world map representation */}
            <svg viewBox="0 0 1000 500" className="w-full h-full">
              {/* Background */}
              <rect width="1000" height="500" fill="rgb(2, 6, 23)" />
              
              {/* Simplified continents */}
              {/* North America */}
              <path d="M 150 120 L 180 100 L 220 110 L 250 130 L 280 150 L 270 200 L 240 230 L 200 220 L 170 180 Z" 
                    fill="rgb(30, 41, 59)" stroke="rgb(51, 65, 85)" strokeWidth="1" />
              
              {/* South America */}
              <path d="M 230 250 L 250 280 L 260 330 L 250 370 L 230 360 L 220 320 L 215 270 Z" 
                    fill="rgb(30, 41, 59)" stroke="rgb(51, 65, 85)" strokeWidth="1" />
              
              {/* Europe */}
              <path d="M 480 120 L 520 110 L 550 130 L 540 160 L 500 170 L 470 150 Z" 
                    fill="rgb(30, 41, 59)" stroke="rgb(51, 65, 85)" strokeWidth="1" />
              
              {/* Africa */}
              <path d="M 490 190 L 520 200 L 540 240 L 550 290 L 530 340 L 490 350 L 470 310 L 475 250 Z" 
                    fill="rgb(30, 41, 59)" stroke="rgb(51, 65, 85)" strokeWidth="1" />
              
              {/* Asia */}
              <path d="M 570 110 L 650 100 L 720 120 L 750 150 L 760 200 L 740 230 L 700 240 L 650 220 L 600 180 L 580 140 Z" 
                    fill="rgb(30, 41, 59)" stroke="rgb(51, 65, 85)" strokeWidth="1" />
              
              {/* Australia */}
              <path d="M 700 320 L 750 310 L 780 330 L 770 360 L 730 370 L 700 350 Z" 
                    fill="rgb(30, 41, 59)" stroke="rgb(51, 65, 85)" strokeWidth="1" />
              
              {/* Risk regions */}
              {regions?.map((region, index) => {
                const x = region.coordinates.x * 10
                const y = region.coordinates.y * 10
                const isHovered = hoveredRegion === region.id
                
                return (
                  <g key={region.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 25 : 20}
                      fill={getRiskColor(region.riskLevel)}
                      opacity={isHovered ? 0.9 : 0.6}
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredRegion(region.id)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={30}
                      fill="none"
                      stroke={getRiskColor(region.riskLevel)}
                      strokeWidth={isHovered ? 2 : 1}
                      opacity={0.3}
                      className="transition-all duration-200"
                    />
                    {isHovered && (
                      <text
                        x={x}
                        y={y - 35}
                        textAnchor="middle"
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        {region.name}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-4 border border-slate-800">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Risk Level</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-400">Critical (80+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-slate-400">High (70-79)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-slate-400">Elevated (60-69)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Region Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions?.map((region) => (
          <Card 
            key={region.id} 
            className={`bg-slate-900 border-slate-800 transition-all cursor-pointer ${
              hoveredRegion === region.id ? 'border-slate-600 shadow-lg' : 'hover:border-slate-700'
            }`}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-slate-100">{region.name}</CardTitle>
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
              <p className="text-sm text-slate-400 leading-relaxed">{region.description}</p>
              <div className="mt-3 text-sm">
                <span className="text-slate-500">Risk Score: </span>
                <span className="text-slate-300 font-medium">{region.riskLevel}/100</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MapView

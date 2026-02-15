'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'

const Clock = ({ data }) => {
  const { minutesToMidnight, secondsToMidnight, status, confidence, lastUpdated } = data
  const [currentSeconds, setCurrentSeconds] = useState(secondsToMidnight)

  // Simulate ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSeconds(prev => {
        // Simple oscillation for demo
        const random = Math.random()
        if (random > 0.5) return Math.min(59, prev + 1)
        if (random < 0.3) return Math.max(0, prev - 1)
        return prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const totalSeconds = minutesToMidnight * 60 + currentSeconds
  const angle = ((12 * 60 * 60 - totalSeconds) / (12 * 60 * 60)) * 360

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const getConfidenceColor = (conf) => {
    switch (conf.toLowerCase()) {
      case 'high': return 'bg-emerald-900 text-emerald-200 border-emerald-700'
      case 'medium': return 'bg-amber-900 text-amber-200 border-amber-700'
      case 'low': return 'bg-slate-700 text-slate-300 border-slate-600'
      default: return 'bg-slate-800 text-slate-300 border-slate-700'
    }
  }

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-2xl mx-auto">
      {/* Clock Visualization */}
      <div className="relative w-full aspect-square max-w-md">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-2xl"
        >
          {/* Outer circle */}
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="none"
            stroke="rgb(51, 65, 85)"
            strokeWidth="2"
            className="opacity-50"
          />
          
          {/* Inner circle */}
          <circle
            cx="200"
            cy="200"
            r="170"
            fill="rgb(15, 23, 42)"
            className="opacity-90"
          />
          
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x1 = 200 + 160 * Math.cos(angle)
            const y1 = 200 + 160 * Math.sin(angle)
            const x2 = 200 + 150 * Math.cos(angle)
            const y2 = 200 + 150 * Math.sin(angle)
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i === 0 ? 'rgb(239, 68, 68)' : 'rgb(100, 116, 139)'}
                strokeWidth={i === 0 ? '3' : '2'}
                strokeLinecap="round"
              />
            )
          })}
          
          {/* Midnight label */}
          <text
            x="200"
            y="45"
            textAnchor="middle"
            fill="rgb(239, 68, 68)"
            fontSize="16"
            fontWeight="bold"
            letterSpacing="2"
          >
            MIDNIGHT
          </text>
          
          {/* Clock hand */}
          <line
            x1="200"
            y1="200"
            x2="200"
            y2="60"
            stroke="rgb(248, 250, 252)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '200px 200px',
              transition: 'transform 0.5s ease-in-out'
            }}
          />
          
          {/* Center dot */}
          <circle
            cx="200"
            cy="200"
            r="8"
            fill="rgb(248, 250, 252)"
          />
          
          {/* Danger zone arc (11:45 to 12:00) */}
          <path
            d="M 200 30 A 170 170 0 0 1 290 44"
            fill="none"
            stroke="rgb(239, 68, 68)"
            strokeWidth="20"
            opacity="0.2"
          />
        </svg>
        
        {/* Center time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-light text-slate-100 tracking-tight">
              {minutesToMidnight}:{currentSeconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm md:text-base text-slate-400 mt-2">
              to midnight
            </div>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="text-center space-y-4 w-full">
        <h1 className="text-3xl md:text-4xl font-light text-slate-100 tracking-wide">
          {status}
        </h1>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="outline" className={getConfidenceColor(confidence)}>
            Confidence: {confidence}
          </Badge>
          
          <div className="text-sm text-slate-400">
            Last updated: {formatDate(lastUpdated)}
          </div>
        </div>
        
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          The Global Risk Clock represents a scientific assessment of existential threats to humanity,
          measured in minutes and seconds to midnight.
        </p>
      </div>
    </div>
  )
}

export default Clock

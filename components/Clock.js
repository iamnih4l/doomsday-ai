'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'

const Clock = ({ data }) => {
  const { secondsToMidnight: initialTotalSeconds, status, confidence, lastUpdated } = data
  const [currentTotalSeconds, setCurrentTotalSeconds] = useState(initialTotalSeconds ?? 90)

  useEffect(() => {
    const interval = setInterval(() => {
      // Ticking logic: just oscillate slightly for effect or count down?
      // Original logic was random walk. Let's keep it simple or static for now, 
      // or just re-fetch. Let's keep the random oscillation for "aliveness" but constrained.
      setCurrentTotalSeconds(prev => {
        const random = Math.random()
        if (random > 0.8) return Math.min(initialTotalSeconds + 2, prev + 1)
        if (random < 0.2) return Math.max(initialTotalSeconds - 2, prev - 1)
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [initialTotalSeconds])

  const displayMinutes = Math.floor(currentTotalSeconds / 60);
  const displaySeconds = currentTotalSeconds % 60;

  // Analogue: 0 min = 12 o'clock, 15 min = 9 o'clock (quarter circle)
  const totalMinutes = currentTotalSeconds / 60
  const clampedMinutes = Math.min(15, Math.max(0, totalMinutes))
  const handAngle = 270 - (clampedMinutes / 15) * 90

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
    switch ((conf || '').toLowerCase()) {
      case 'high': return 'bg-red-900 text-white border-red-700'
      case 'medium': return 'bg-neutral-700 text-white border-neutral-600'
      case 'low': return 'bg-neutral-800 text-neutral-400 border-neutral-700'
      default: return 'bg-neutral-900 text-white border-neutral-700'
    }
  }

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-4xl mx-auto">
      {/* Digital + analogue hybrid */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 w-full">
        {/* Digital readout */}
        <div className="flex flex-col items-center">
          <div
            className="font-mono text-7xl sm:text-8xl md:text-9xl font-bold tabular-nums tracking-tight text-white drop-shadow-lg"
            style={{ textShadow: '0 0 40px rgba(220,38,38,0.4)' }}
          >
            {displayMinutes}:{displaySeconds.toString().padStart(2, '0')}
          </div>
          <div className="text-lg sm:text-xl text-neutral-400 mt-2 tracking-widest uppercase">
            minutes to midnight
          </div>
        </div>

        {/* Simple analogue circle */}
        <div className="flex-shrink-0 w-40 h-40 sm:w-52 sm:h-52 rounded-full border-4 border-neutral-600 bg-neutral-900/50 flex items-center justify-center relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* 12, 3, 6, 9 marks */}
            {[0, 90, 180, 270].map((rot) => (
              <line
                key={rot}
                x1="50"
                y1="50"
                x2="50"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
                className="text-neutral-500"
                transform={`rotate(${rot} 50 50)`}
              />
            ))}
          </svg>
          {/* Single hand: minutes to midnight (0 = 12, 15 = 9) */}
          <div
            className="absolute w-1 bg-red-500 rounded-full origin-bottom transition-transform duration-1000 ease-out"
            style={{
              height: '38%',
              bottom: '50%',
              left: '50%',
              marginLeft: '-2px',
              transform: `rotate(${handAngle}deg)`,
              boxShadow: '0 0 8px rgba(220,38,38,0.6)'
            }}
          />
          <div className="absolute w-3 h-3 rounded-full bg-red-500" style={{ left: '50%', top: '50%', marginLeft: '-6px', marginTop: '-6px' }} />
        </div>
      </div>

      {/* Status Information */}
      <div className="text-center space-y-4 w-full">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-wide">
          {status}
        </h1>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="outline" className={getConfidenceColor(confidence)}>
            Confidence: {confidence}
          </Badge>

          <div className="text-sm text-neutral-400">
            Last updated: {formatDate(lastUpdated)}
          </div>
        </div>

        <p className="text-neutral-400 text-sm max-w-xl mx-auto leading-relaxed">
          The Global Risk Clock represents a scientific assessment of existential threats to humanity,
          measured in minutes and seconds to midnight.
        </p>
      </div>
    </div>
  )
}

export default Clock

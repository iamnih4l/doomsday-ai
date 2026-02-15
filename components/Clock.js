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

  // Calculate angles for clock hands (only showing last 15 minutes before midnight)
  const totalSeconds = minutesToMidnight * 60 + currentSeconds
  // Map to quarter circle (0-90 degrees) representing 11:45 to 12:00
  const maxSeconds = 15 * 60 // 15 minutes
  const angleRange = 90 // degrees
  const angle = ((maxSeconds - totalSeconds) / maxSeconds) * angleRange

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
      case 'high': return 'bg-red-900 text-white border-red-700'
      case 'medium': return 'bg-neutral-700 text-white border-neutral-600'
      case 'low': return 'bg-neutral-800 text-neutral-400 border-neutral-700'
      default: return 'bg-neutral-900 text-white border-neutral-700'
    }
  }

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-4xl mx-auto">
      {/* Doomsday Clock Visualization */}
      <div className="relative w-full aspect-square max-w-2xl">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-2xl"
        >
          {/* Background */}
          <rect width="500" height="500" fill="white" />
          
          {/* Main Arc - thick quarter circle from 9 to 12 */}
          <path
            d="M 50 450 A 400 400 0 0 1 450 50"
            fill="none"
            stroke="black"
            strokeWidth="80"
            strokeLinecap="butt"
          />
          
          {/* Hour markers as dots - only showing 11:45 to 12:00 region */}
          {/* 11:45 marker (3 o'clock position on quarter circle) */}
          <circle cx="120" cy="650" r="20" fill="black" />
          
          {/* 11:50 marker */}
          <circle cx="180" cy="550" r="20" fill="black" />
          
          {/* 11:55 marker */}
          <circle cx="250" cy="460" r="20" fill="black" />
          
          {/* 12:00 marker (top right) */}
          <circle cx="330" cy="390" r="20" fill="black" />
          
          {/* Minute hand - pointing close to midnight */}
          <line
            x1="250"
            y1="450"
            x2="420"
            y2="120"
            stroke="black"
            strokeWidth="35"
            strokeLinecap="butt"
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '250px 450px',
              transition: 'transform 1s ease-in-out'
            }}
          />
          
          {/* Hour hand - shorter, wider */}
          <line
            x1="250"
            y1="450"
            x2="370"
            y2="190"
            stroke="black"
            strokeWidth="50"
            strokeLinecap="butt"
            style={{
              transform: `rotate(${angle * 0.8}deg)`,
              transformOrigin: '250px 450px',
              transition: 'transform 1s ease-in-out'
            }}
          />
          
          {/* Center circle */}
          <circle cx="250" cy="450" r="25" fill="black" />
          
          {/* Registered trademark symbol */}
          <text
            x="460"
            y="480"
            fontSize="24"
            fontFamily="serif"
            fill="black"
          >
            ®
          </text>
        </svg>
        
        {/* Time display overlay */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded-lg border-2 border-red-600">
            <div className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              {minutesToMidnight}:{currentSeconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm md:text-base text-neutral-300 mt-1">
              to midnight
            </div>
          </div>
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

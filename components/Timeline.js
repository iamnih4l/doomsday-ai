'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'
import { useState } from 'react'

const Timeline = ({ data }) => {
  const { events } = data
  const [expandedEvent, setExpandedEvent] = useState(null)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDirectionColor = (direction) => {
    return direction === 'closer' 
      ? 'bg-red-950 text-red-300 border-red-900' 
      : 'bg-green-950 text-green-300 border-green-900'
  }

  const getDirectionIcon = (direction) => {
    return direction === 'closer' 
      ? <TrendingUp className="w-4 h-4" /> 
      : <TrendingDown className="w-4 h-4" />
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-light text-slate-100">Historical Timeline</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          A chronological view of significant clock movements and the events that shaped global risk assessment.
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800"></div>

        <div className="space-y-8">
          {events?.map((event, index) => {
            const isExpanded = expandedEvent === event.id
            const isLeft = index % 2 === 0

            return (
              <div 
                key={event.id} 
                className={`relative flex items-center ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-row`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-slate-700 rounded-full border-4 border-slate-950 transform -translate-x-2 md:-translate-x-2 z-10"></div>

                {/* Spacer for desktop */}
                <div className="hidden md:block w-1/2"></div>

                {/* Content card */}
                <div className={`ml-16 md:ml-0 w-full md:w-1/2 ${
                  isLeft ? 'md:pr-12' : 'md:pl-12'
                }`}>
                  <Card 
                    className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                    onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={getDirectionColor(event.direction)}>
                              {getDirectionIcon(event.direction)}
                              {event.change}s {event.direction === 'closer' ? 'closer' : 'away'}
                            </Badge>
                            <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
                              {event.time}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg text-slate-100 mb-1">{event.reason}</CardTitle>
                          <CardDescription className="text-sm text-slate-500">
                            {formatDate(event.date)}
                          </CardDescription>
                        </div>
                        <ChevronDown 
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            isExpanded ? 'transform rotate-180' : ''
                          }`}
                        />
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {event.details}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Timeline

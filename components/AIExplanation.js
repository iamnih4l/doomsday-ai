'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const AIExplanation = ({ data }) => {
  // logic to handle if data is the single object from API
  // API returns { explanation, confidence, factors, decision, timestamp }
  // Component expects { explanations: [...] } usually

  let latestExplanation = null;
  let explanations = [];

  if (data?.explanations) {
    latestExplanation = data.explanations[0];
    explanations = data.explanations;
  } else if (data?.explanation) {
    // Adapt single object to component format
    latestExplanation = {
      title: "Latest Risk Assessment", // API doesn't return title, provide default
      summary: data.explanation,
      timestamp: data.timestamp,
      factors: data.factors,
      confidence: data.confidence,
      direction: data.decision
    };
  }

  const getDirectionIcon = (direction) => {
    switch (direction) {
      case 'forward': return <TrendingUp className="w-5 h-5 text-red-500" />
      case 'backward': return <TrendingDown className="w-5 h-5 text-white" />
      default: return <Minus className="w-5 h-5 text-neutral-400" />
    }
  }

  const getDirectionColor = (direction) => {
    switch (direction) {
      case 'forward': return 'bg-red-950 text-red-300 border-red-900'
      case 'backward': return 'bg-neutral-800 text-white border-neutral-700'
      default: return 'bg-neutral-800 text-neutral-400 border-neutral-700'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-light text-white">AI Explanation</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Evidence-based analysis of recent global risk developments and their impact on the clock.
        </p>
      </div>

      {/* Latest Explanation - Featured */}
      {latestExplanation && (
        <div className="relative rounded-[1.25rem] border-[0.75px] border-neutral-800 p-2 md:rounded-[1.5rem] md:p-3">
          <GlowingEffect
            spread={40}
            glow
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <Card className="relative bg-gradient-to-br from-neutral-900 to-black border-neutral-700 rounded-xl border-[0.75px]">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <Badge variant="outline" className="bg-red-950 text-red-300 border-red-900">
                      Latest Update
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">{latestExplanation.title}</CardTitle>
                  <CardDescription className="text-neutral-400">
                    {formatDate(latestExplanation.timestamp)}
                  </CardDescription>
                </div>
                <Badge variant="outline" className={`flex items-center gap-2 ${getDirectionColor(latestExplanation.direction)}`}>
                  {getDirectionIcon(latestExplanation.direction)}
                  {latestExplanation.direction === 'stable' ? 'Stable' : latestExplanation.direction === 'forward' ? 'Increased Risk' : 'Decreased Risk'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-300 leading-relaxed">
                {latestExplanation.summary}
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">Contributing Factors:</h4>
                <ul className="space-y-2">
                  {latestExplanation.factors?.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-neutral-300">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-neutral-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Confidence Level:</span>
                  <Badge variant="outline" className="bg-neutral-800 text-white border-neutral-700">
                    {latestExplanation.confidence}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historical Explanations */}
      {explanations?.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-light text-white">Recent History</h3>
          <div className="space-y-4">
            {explanations.slice(1).map((explanation) => (
              <div key={explanation.id} className="relative rounded-[1.25rem] border-[0.75px] border-neutral-800 p-2 md:rounded-[1.5rem] md:p-3">
                <GlowingEffect
                  spread={32}
                  glow
                  disabled={false}
                  proximity={40}
                  inactiveZone={0.05}
                  borderWidth={1}
                />
                <Card className="relative bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors rounded-xl border-[0.75px]">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white mb-1">{explanation.title}</CardTitle>
                        <CardDescription className="text-sm text-neutral-500">
                          {formatDate(explanation.timestamp)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={getDirectionColor(explanation.direction)}>
                        {getDirectionIcon(explanation.direction)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {explanation.summary}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AIExplanation

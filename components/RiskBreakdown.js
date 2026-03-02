'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { TrendingUp, TrendingDown, Minus, Radiation, CloudRain, Activity, Cpu, Globe } from 'lucide-react'

const iconMap = {
  Radiation: Radiation,
  CloudRain: CloudRain,
  Activity: Activity,
  Cpu: Cpu,
  Globe: Globe
}

const RiskBreakdown = ({ data }) => {
  const { domains } = data

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-red-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-white" />
    return <Minus className="w-4 h-4 text-neutral-400" />
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-red-600'
    if (score >= 60) return 'bg-red-500'
    return 'bg-red-400'
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-light text-white">Risk Domain Breakdown</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          AI-assessed risk levels across five critical domains that impact global security and stability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains?.map((domain) => {
          const Icon = iconMap[domain.icon] || Globe
          
          return (
            <div key={domain.id} className="relative rounded-[1.25rem] border-[0.75px] border-neutral-800 p-2 md:rounded-[1.5rem] md:p-3">
              <GlowingEffect
                spread={40}
                glow
                disabled={false}
                proximity={48}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <Card className="relative bg-neutral-900 border-neutral-800 hover:border-red-600 transition-colors rounded-xl border-[0.75px]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black rounded-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">{domain.name}</CardTitle>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${
                      domain.change > 0 
                        ? 'bg-red-950 text-red-300 border-red-900' 
                        : domain.change < 0 
                        ? 'bg-neutral-800 text-white border-neutral-700'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {getTrendIcon(domain.change)}
                    {domain.change !== 0 && Math.abs(domain.change)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Risk Score</span>
                    <span className="text-white font-medium">{domain.score}/100</span>
                  </div>
                  <Progress value={domain.score} className="h-2" indicatorClassName={getScoreColor(domain.score)} />
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {domain.description}
                </p>
              </CardContent>
            </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RiskBreakdown

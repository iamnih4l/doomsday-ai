'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
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
    if (change > 0) return <TrendingUp className="w-4 h-4 text-red-400" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-green-400" />
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-red-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-yellow-500'
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-light text-slate-100">Risk Domain Breakdown</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          AI-assessed risk levels across five critical domains that impact global security and stability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains?.map((domain) => {
          const Icon = iconMap[domain.icon] || Globe
          
          return (
            <Card key={domain.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <Icon className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-100">{domain.name}</CardTitle>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${
                      domain.change > 0 
                        ? 'bg-red-950 text-red-300 border-red-900' 
                        : domain.change < 0 
                        ? 'bg-green-950 text-green-300 border-green-900'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
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
                    <span className="text-slate-400">Risk Score</span>
                    <span className="text-slate-200 font-medium">{domain.score}/100</span>
                  </div>
                  <Progress value={domain.score} className="h-2" indicatorClassName={getScoreColor(domain.score)} />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {domain.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default RiskBreakdown

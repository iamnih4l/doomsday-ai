import { NextResponse } from 'next/server';

// Mocked data for the Global Risk Clock
const mockClockData = {
  minutesToMidnight: 2,
  secondsToMidnight: 30,
  status: 'Elevated Global Risk',
  confidence: 'High',
  lastUpdated: new Date().toISOString(),
  trend: 'stable'
};

const mockRiskBreakdown = {
  domains: [
    {
      id: 'nuclear',
      name: 'Nuclear & Military Risk',
      score: 78,
      change: 5,
      description: 'Increased tensions in Eastern Europe and strategic arms reduction treaty uncertainties.',
      icon: 'Radiation'
    },
    {
      id: 'climate',
      name: 'Climate Risk',
      score: 85,
      change: 3,
      description: 'Rising global temperatures, extreme weather events, and slow policy progress.',
      icon: 'CloudRain'
    },
    {
      id: 'pandemic',
      name: 'Pandemic & Health Risk',
      score: 62,
      change: -8,
      description: 'Improved global health infrastructure but emerging antimicrobial resistance concerns.',
      icon: 'Activity'
    },
    {
      id: 'ai',
      name: 'AI & Emerging Tech Risk',
      score: 71,
      change: 12,
      description: 'Rapid AI advancement outpacing regulatory frameworks and safety measures.',
      icon: 'Cpu'
    },
    {
      id: 'geopolitical',
      name: 'Geopolitical Instability',
      score: 74,
      change: 2,
      description: 'Regional conflicts, trade tensions, and weakening international cooperation.',
      icon: 'Globe'
    }
  ],
  lastUpdated: new Date().toISOString()
};

const mockExplanations = {
  explanations: [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      title: 'Clock Moved 15 Seconds Closer to Midnight',
      summary: 'Recent developments in AI safety concerns and escalating geopolitical tensions have contributed to increased global risk assessment.',
      factors: [
        'Major AI lab reported safety protocol failures',
        'Increased military posturing in disputed territories',
        'Breakdown in climate summit negotiations'
      ],
      confidence: 'High',
      direction: 'forward'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      title: 'Risk Assessment Remained Stable',
      summary: 'Despite ongoing challenges, no significant changes in global risk factors warranted clock movement.',
      factors: [
        'Diplomatic progress in regional conflicts',
        'Positive pandemic response coordination'
      ],
      confidence: 'Medium',
      direction: 'stable'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Clock Moved 30 Seconds Away from Midnight',
      summary: 'Breakthrough in international cooperation on climate policy and nuclear de-escalation efforts.',
      factors: [
        'Historic climate agreement signed by major powers',
        'Successful arms reduction dialogue',
        'Enhanced pandemic preparedness measures'
      ],
      confidence: 'High',
      direction: 'backward'
    }
  ]
};

const mockTimeline = {
  events: [
    {
      id: '1',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      time: '2:30',
      direction: 'closer',
      change: 15,
      reason: 'AI safety concerns and geopolitical tensions',
      details: 'Comprehensive analysis revealed increased risks across multiple domains, particularly in emerging technology governance and international relations.'
    },
    {
      id: '2',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: '2:45',
      direction: 'away',
      change: 30,
      reason: 'Climate breakthrough and nuclear de-escalation',
      details: 'Significant diplomatic progress in climate policy and arms control negotiations.'
    },
    {
      id: '3',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      time: '2:15',
      direction: 'closer',
      change: 20,
      reason: 'Escalating regional conflicts',
      details: 'Multiple geopolitical flashpoints showed signs of deterioration.'
    },
    {
      id: '4',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      time: '2:35',
      direction: 'away',
      change: 10,
      reason: 'Pandemic response improvements',
      details: 'Global health systems demonstrated enhanced coordination and preparedness.'
    },
    {
      id: '5',
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      time: '2:25',
      direction: 'closer',
      change: 25,
      reason: 'Climate tipping points approaching',
      details: 'Scientific evidence of accelerating climate change impacts.'
    }
  ]
};

const mockMapData = {
  regions: [
    {
      id: 'eastern-europe',
      name: 'Eastern Europe',
      riskLevel: 85,
      description: 'Ongoing military tensions and regional instability',
      coordinates: { x: 55, y: 35 }
    },
    {
      id: 'middle-east',
      name: 'Middle East',
      riskLevel: 78,
      description: 'Complex geopolitical situation with multiple conflict zones',
      coordinates: { x: 58, y: 45 }
    },
    {
      id: 'east-asia',
      name: 'East Asia',
      riskLevel: 72,
      description: 'Regional tensions and rapid military modernization',
      coordinates: { x: 75, y: 42 }
    },
    {
      id: 'arctic',
      name: 'Arctic Region',
      riskLevel: 68,
      description: 'Climate change impacts and emerging territorial disputes',
      coordinates: { x: 50, y: 15 }
    },
    {
      id: 'south-asia',
      name: 'South Asia',
      riskLevel: 65,
      description: 'Nuclear tensions and climate vulnerability',
      coordinates: { x: 65, y: 48 }
    }
  ]
};

export async function GET(request) {
  const { pathname } = new URL(request.url);
  
  // Remove /api prefix for routing
  const path = pathname.replace('/api', '') || '/';
  
  console.log('API Request:', path);
  
  try {
    // Route handling
    if (path === '/' || path === '') {
      return NextResponse.json({ message: 'Global Risk Clock API' });
    }
    
    if (path === '/clock') {
      return NextResponse.json(mockClockData);
    }
    
    if (path === '/risk-breakdown') {
      return NextResponse.json(mockRiskBreakdown);
    }
    
    if (path === '/explanations') {
      return NextResponse.json(mockExplanations);
    }
    
    if (path === '/timeline') {
      return NextResponse.json(mockTimeline);
    }
    
    if (path === '/map-data') {
      return NextResponse.json(mockMapData);
    }
    
    // 404 for unknown routes
    return NextResponse.json(
      { error: 'Endpoint not found' },
      { status: 404 }
    );
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return NextResponse.json(
    { message: 'POST not implemented for this endpoint' },
    { status: 405 }
  );
}

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Info, Clock } from 'lucide-react'

const Header = () => {
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <header className="border-b border-neutral-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-900 rounded-lg">
              <Clock className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-light text-white tracking-wide">Global Risk Clock</h1>
              <p className="text-xs text-neutral-500">AI-Driven Risk Assessment</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-neutral-300 hover:text-white hover:bg-neutral-900"
                >
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">About the Global Risk Clock</DialogTitle>
                  <DialogDescription className="text-neutral-400">
                    Understanding our AI-driven assessment of global existential risk
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-neutral-300 leading-relaxed">
                  <p>
                    The Global Risk Clock is an AI-driven real-time assessment of humanity's proximity to
                    catastrophic global risks, inspired by the Doomsday Clock maintained by the Bulletin of
                    the Atomic Scientists.
                  </p>
                  
                  <h3 className="text-lg font-medium text-white mt-6">Our Methodology</h3>
                  <p>
                    Using advanced machine learning algorithms, we continuously analyze multiple data streams
                    including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400 ml-4">
                    <li>Geopolitical developments and conflict indicators</li>
                    <li>Climate data and environmental metrics</li>
                    <li>Nuclear arsenals and military activities</li>
                    <li>Pandemic and public health surveillance</li>
                    <li>Emerging technology developments and AI safety</li>
                  </ul>

                  <h3 className="text-lg font-medium text-white mt-6">What is "Midnight"?</h3>
                  <p>
                    Midnight represents a theoretical point of catastrophic and irreversible global harm.
                    The closer we are to midnight, the higher the assessed risk to human civilization.
                  </p>

                  <h3 className="text-lg font-medium text-white mt-6">Transparency & Limitations</h3>
                  <p>
                    This assessment is based on publicly available data and AI analysis. While we strive
                    for accuracy, this should be viewed as one perspective among many on global risk.
                    We encourage critical thinking and consultation with domain experts.
                  </p>

                  <div className="bg-black border border-neutral-800 rounded-lg p-4 mt-6">
                    <p className="text-sm text-neutral-400">
                      <strong className="text-white">Disclaimer:</strong> This project is not affiliated
                      with the Bulletin of the Atomic Scientists or their Doomsday Clock. This is an independent
                      AI-driven assessment tool for educational and informational purposes.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

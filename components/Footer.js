'use client'

import { Github, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-black mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Disclaimer */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-medium text-white">Important Disclaimer</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              This project is an AI-driven global risk assessment inspired by the Doomsday Clock.
              It is <strong className="text-white">not affiliated with the Bulletin of the Atomic Scientists</strong> or
              their official Doomsday Clock. This tool is designed for educational and informational
              purposes to promote awareness of global existential risks.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              The assessments provided are based on publicly available data and AI analysis. They should
              not be considered as definitive predictions or professional risk assessments.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Data & Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="text-neutral-400">
                <strong className="text-white">Data Sources:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Public news and reports</li>
                  <li>• Scientific publications</li>
                  <li>• Government announcements</li>
                  <li>• International organizations</li>
                </ul>
              </div>
              
              <div className="flex gap-4 mt-6">
                <a 
                  href="#" 
                  className="flex items-center gap-2 text-neutral-400 hover:text-red-500 transition-colors"
                  aria-label="GitHub Repository"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-sm">GitHub</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center gap-2 text-neutral-400 hover:text-red-500 transition-colors"
                  aria-label="Contact Us"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">Contact</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 text-center text-sm text-neutral-500">
          <p>© 2025 Global Risk Clock Project. Built for transparency and global awareness.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import React from 'react';
import { Button } from './components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import { WhyJoin } from './components/WhyJoin';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        
        {/* Header */}
        <header className="mb-20 md:mb-32">
          {/* Logo */}
          <div className="flex items-center gap-2 text-red-500 font-bold mb-12">
            <Zap className="w-5 h-5 fill-current" />
            <span className="text-white tracking-tight">Amp</span>
          </div>
          
          {/* Hero Content */}
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-[5rem] leading-[0.9] font-serif italic mb-8 tracking-tight">
              Build <span className="not-italic font-normal">Crew</span>
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-lg leading-relaxed font-light">
              A community of devs shipping with agents.<br />
              Get <span className="text-white font-medium">$100 in Amp credit</span>, join a Discord community, take on build challenges, earn XP, and unlock badges.
            </p>
            
            <div className="flex flex-col items-start gap-5">
              <Button className="bg-white text-black hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all rounded px-6 h-12 text-base font-medium group">
                Join Build Crew <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-xs md:text-sm text-neutral-500 italic font-serif">
                Build challenges, XP system, private community
              </p>
            </div>
          </div>
        </header>

        {/* Why Join Section */}
        <WhyJoin />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

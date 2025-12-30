import React from 'react';
import { Zap, Github } from 'lucide-react';

// Inline styles for glass morphism effect - lighter tone with same transparency
const glassStyle: React.CSSProperties = {
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  backgroundColor: 'rgba(255, 255, 255, 0.08)', // Lighter tone - white instead of dark
  borderColor: 'rgba(255, 255, 255, 0.2)', // Lighter border
};

const innerGlassStyle: React.CSSProperties = {
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(255, 255, 255, 0.05)', // Lighter tone - white instead of dark
  borderColor: 'rgba(255, 255, 255, 0.15)', // Lighter border
};

const buttonGlassStyle: React.CSSProperties = {
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Lighter tone - white instead of dark
  borderColor: 'rgba(255, 255, 255, 0.2)', // Lighter border
};

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 border-t border-neutral-800">
      <h2 className="text-3xl md:text-4xl font-serif italic mb-16 text-white">How it works</h2>

      <div className="space-y-20">

        {/* Step 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-neutral-400 font-mono text-sm mb-1">1.</span>
            <h3 className="text-white font-bold text-lg">Create a free Amp account</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Sign up for Amp to get started with agent-driven coding
            </p>
          </div>
          <div className="md:col-span-8">
            <div
              className="border border-neutral-800 p-12 rounded-lg w-full max-w-xl flex flex-col items-center justify-center min-h-[200px]"
              style={glassStyle}
            >
              <button className="bg-white hover:bg-neutral-200 transition-colors text-black px-5 py-2.5 rounded text-sm font-medium flex items-center gap-2 shadow-sm">
                <Zap className="w-4 h-4 fill-black" /> Create Free Account
              </button>
              <p className="text-[10px] text-neutral-500 mt-3 font-medium">Free • No credit card required</p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pt-12" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-neutral-400 font-mono text-sm mb-1">2.</span>
            <h3 className="text-white font-bold text-lg">Apply to join Build Crew</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Fill out our application form to join the community
            </p>
          </div>
          <div className="md:col-span-8">
            <div
              className="border border-neutral-800 p-6 rounded-lg w-full max-w-xl"
              style={glassStyle}
            >
              <div
                className="border border-neutral-800 p-6 rounded text-sm text-neutral-400 space-y-6"
                style={innerGlassStyle}
              >
                <p className="leading-relaxed text-xs">We review applications to keep the signal high. Most decisions within 24-48 hours.</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                    <span className="text-sm font-medium">Connect your GitHub account</span>
                  </div>
                  <p className="pl-8 text-xs text-neutral-500 leading-relaxed">First, connect your GitHub account to continue with your application.</p>
                  <div className="pl-8 pt-1">
                    <button
                      className="flex items-center gap-2 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-white px-4 py-2 rounded text-xs font-medium transition-all"
                      style={buttonGlassStyle}
                    >
                      <Github className="w-3.5 h-3.5" /> Connect with GitHub
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-500 pt-2">We'll only use your info to review your application and send related updates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pt-12" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-neutral-400 font-mono text-sm mb-1">3.</span>
            <h3 className="text-white font-bold text-lg">Claim your Amp credit</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Once in, get your $100 credit to jumpstart your builds
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pt-12" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-neutral-400 font-mono text-sm mb-1">4.</span>
            <h3 className="text-white font-bold text-lg">Join the community</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              You'll be invited to join our Discord community
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pt-12" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-neutral-400 font-mono text-sm mb-1">5.</span>
            <h3 className="text-white font-bold text-lg">Earn XP and badges</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Showcase your XP and badges to other Build Crew members.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

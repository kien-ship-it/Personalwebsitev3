import React from 'react';
import { Zap, Github } from 'lucide-react';

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 border-t border-neutral-900">
      <h2 className="text-3xl md:text-4xl font-serif italic mb-16 text-white">How it works</h2>
      
      <div className="space-y-20">
        
        {/* Step 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-neutral-500 font-mono text-sm mb-1">1.</span>
            <h3 className="text-white font-bold text-lg">Create a free Amp account</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Sign up for Amp to get started with agent-driven coding
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="border border-neutral-800 bg-[#111] p-12 rounded-lg w-full max-w-xl flex flex-col items-center justify-center min-h-[200px]">
               <button className="bg-white hover:bg-neutral-200 transition-colors text-black px-5 py-2.5 rounded text-sm font-medium flex items-center gap-2 shadow-sm">
                  <Zap className="w-4 h-4 fill-black" /> Create Free Account
               </button>
               <p className="text-[10px] text-neutral-600 mt-3 font-medium">Free • No credit card required</p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-t border-neutral-900 pt-12">
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-neutral-500 font-mono text-sm mb-1">2.</span>
            <h3 className="text-white font-bold text-lg">Apply to join Build Crew</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Fill out our application form to join the community
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="border border-neutral-800 bg-[#111] p-6 rounded-lg w-full max-w-xl">
               <div className="border border-neutral-800 bg-[#0A0A0A] p-6 rounded text-sm text-neutral-400 space-y-6">
                 <p className="leading-relaxed text-xs">We review applications to keep the signal high. Most decisions within 24-48 hours.</p>
                 
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white">
                       <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                       <span className="text-sm font-medium">Connect your GitHub account</span>
                    </div>
                    <p className="pl-8 text-xs text-neutral-500 leading-relaxed">First, connect your GitHub account to continue with your application.</p>
                    <div className="pl-8 pt-1">
                       <button className="flex items-center gap-2 bg-[#1c1c1c] border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-white px-4 py-2 rounded text-xs font-medium transition-all">
                          <Github className="w-3.5 h-3.5" /> Connect with GitHub
                       </button>
                    </div>
                 </div>
                 
                 <p className="text-[10px] text-neutral-700 pt-2">We'll only use your info to review your application and send related updates.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-t border-neutral-900 pt-12">
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-neutral-500 font-mono text-sm mb-1">3.</span>
            <h3 className="text-white font-bold text-lg">Claim your Amp credit</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Once in, get your $100 credit to jumpstart your builds
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-t border-neutral-900 pt-12">
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-neutral-500 font-mono text-sm mb-1">4.</span>
            <h3 className="text-white font-bold text-lg">Join the community</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              You'll be invited to join our Discord community
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-t border-neutral-900 pt-12">
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="text-neutral-500 font-mono text-sm mb-1">5.</span>
            <h3 className="text-white font-bold text-lg">Earn XP and badges</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Showcase your XP and badges to other Build Crew members.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

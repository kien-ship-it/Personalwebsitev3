import React from 'react';
import { Mail, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Tilt } from '../ui/tilt';

export function ResumeHeader() {
  return (
    <header className="py-20 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-red-500 font-bold mb-8">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm tracking-widest uppercase text-neutral-500">Available for hire</span>
                </div>

                <h1 className="text-6xl md:text-[5rem] leading-[0.9] font-serif italic mb-8 tracking-tight text-white">
                Alex <span className="not-italic font-normal">Morgan</span>
                </h1>
                
                <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-lg leading-relaxed font-light">
                Design Engineer crafting pixel-perfect interfaces. 
                Focusing on <span className="text-white font-medium">interaction design</span>, <span className="text-white font-medium">accessibility</span>, and <span className="text-white font-medium">performance</span>.
                </p>

                <div className="flex flex-wrap gap-4">
                    <Button className="bg-white text-black hover:bg-neutral-200 transition-all rounded px-6 h-12 text-sm font-medium group">
                        Download CV <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <div className="flex items-center gap-2 px-2">
                        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white hover:bg-transparent">
                            <Github className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white hover:bg-transparent">
                            <Linkedin className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white hover:bg-transparent">
                            <Twitter className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white hover:bg-transparent">
                            <Mail className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="hidden md:block">
                <Tilt className="w-32 h-32 md:w-56 md:h-64">
                    <div className="w-full h-full relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                        <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=faces" 
                        alt="Profile" 
                        className="object-cover w-full h-full opacity-80 mix-blend-overlay hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] to-transparent opacity-40"></div>
                        
                        {/* Decorative elements to make it look like a card */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                             <div className="text-[10px] font-mono text-white/50 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">AM</div>
                        </div>
                    </div>
                </Tilt>
            </div>
        </div>
    </header>
  );
}

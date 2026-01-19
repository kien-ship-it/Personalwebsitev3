import React, { useState } from 'react';
import { Mail, Github, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Tilt } from '../ui/tilt';
import { resumeData } from '../../data/resumeData';
import { SpeechBubble } from '../SpeechBubble';

export function ResumeHeader() {
    const { contact } = resumeData;

    return (
        <header className="py-20 md:py-32">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 text-red-500 font-bold mb-8">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm tracking-widest uppercase text-neutral-500">Open for opportunities</span>
                    </div>

                    <h1 className="text-6xl md:text-[5rem] leading-[0.9] font-serif italic mb-8 tracking-tight text-white">
                        Kien <span className="not-italic font-normal">Le</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 mb-1 max-w-lg leading-relaxed font-light">
                        {contact.tagline}
                    </p>

                    <div className="flex items-center gap-2 mb-10">
                        <img
                            src="/images/JHU Logo White.png"
                            alt="Johns Hopkins University"
                            className="h-6 w-auto opacity-80"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Button className="bg-white text-black hover:bg-neutral-200 transition-all rounded px-6 h-12 text-sm font-medium group">
                            Download CV <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <div className="flex items-center gap-2 px-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-neutral-500 hover:text-white hover:bg-transparent"
                                asChild
                            >
                                <a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer">
                                    <Github className="w-5 h-5" />
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-neutral-500 hover:text-white hover:bg-transparent"
                                asChild
                            >
                                <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-neutral-500 hover:text-white hover:bg-transparent"
                                asChild
                            >
                                <a href={`mailto:${contact.email}`}>
                                    <Mail className="w-5 h-5" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block relative">
                    <Tilt
                        className="relative"
                        style={{ width: '400px', height: '500px' }}
                    >
                        <div className="w-full h-full relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                            <img
                                src={contact.profileImage}
                                alt="Profile"
                                className="object-cover w-full h-full opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] to-transparent opacity-10"></div>

                            {/* Decorative elements to make it look like a card */}
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                                <div className="text-[10px] font-mono text-white/50 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">KL</div>
                            </div>
                        </div>
                    </Tilt>
                    
                    {/* Speech bubble positioned relative to mouth - right side of image */}
                    <SpeechBubble 
                        className="bottom-6 left-0 right-0 mx-auto"
                        style={{ width: '90%' }}
                    />
                </div>
            </div>
        </header>
    );
}

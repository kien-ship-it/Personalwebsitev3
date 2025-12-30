import React from 'react';
import { ResumeHeader } from './components/resume/ResumeHeader';
import { TopBar } from './components/resume/TopBar';
import { Stats } from './components/resume/Stats';
import { Experience } from './components/resume/Experience';
import { BentoGrid } from './components/resume/BentoGrid';
import { TechStack } from './components/resume/TechStack';
import { ProjectGallery } from './components/resume/ProjectGallery';
import { Writing } from './components/resume/Writing';
import { Certificates } from './components/resume/Certificates';
import { Services } from './components/resume/Services';
import { FeatureAccordion } from './components/resume/FeatureAccordion';
import { Contact } from './components/resume/Contact';
import { FloatingChat } from './components/FloatingChat';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/ui/CustomCursor';
import { ShaderBackground } from './components/ui/ShaderBackground';

export default function App() {
  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-red-500/30">
      <ShaderBackground />
      <div className="relative z-10">
        <CustomCursor />
        <TopBar />
        <div className="max-w-4xl mx-auto px-6">

          <ResumeHeader />

          <Stats />

          <TechStack />

          <Experience />

          <FeatureAccordion />

          <Services />

          <BentoGrid />

          <ProjectGallery />

          <Writing />

          <Certificates />

          <Contact />

          <div className="py-12">
            <Footer />
          </div>

        </div>

        <FloatingChat />
      </div>
    </div>
  )
}

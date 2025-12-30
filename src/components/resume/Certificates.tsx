import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ExternalLink, Calendar, BadgeCheck, ChevronUp, ChevronDown, List, LayoutTemplate } from 'lucide-react';
import { cn } from '../ui/utils';

const certificates = [
    {
        id: 1,
        title: "Advanced React Patterns",
        issuer: "Frontend Masters",
        date: "DEC 2024",
        credentialId: "R-29384-X",
        url: "#",
        image: "https://images.unsplash.com/photo-1753998943413-8cba1b923c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBjb2RlJTIwc2NyZWVuJTIwbW9uaXRvciUyMGRhcmt8ZW58MXx8fHwxNzY3MDc5MjYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        aspect: "aspect-video"
    },
    {
        id: 2,
        title: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        date: "OCT 2024",
        credentialId: "AWS-PSA-9921",
        url: "#",
        image: "https://images.unsplash.com/photo-1765410852491-7b40fc99d9b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMHNoYXBlcyUyMHRlY2hub2xvZ3klMjBkYXJrfGVufDF8fHx8MTc2NzA3OTI1OXww&ixlib=rb-4.1.0&q=80&w=1080",
        aspect: "aspect-square"
    },
    {
        id: 3,
        title: "UI/UX Design Specialization",
        issuer: "CalArts",
        date: "AUG 2024",
        credentialId: "CA-UIUX-882",
        url: "#",
        image: "https://images.unsplash.com/flagged/photo-1582567257363-8605111df91f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGlwbG9tYSUyMGRlc2lnbiUyMGRhcmt8ZW58MXx8fHwxNzY3MDc5MjU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        aspect: "aspect-[4/3]"
    },
    {
        id: 4,
        title: "Full Stack Development",
        issuer: "Meta",
        date: "JUN 2024",
        credentialId: "META-FS-102",
        url: "#",
        image: "https://images.unsplash.com/photo-1715173679369-18006e84d6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJ0aWZpY2F0ZSUyMGRvY3VtZW50JTIwcGFwZXIlMjB0ZWNoJTIwYXdhcmR8ZW58MXx8fHwxNzY3MDc5MjUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        aspect: "aspect-video"
    }
];

export function Certificates() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % certificates.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
    };

    return (
        <section className="py-24 border-t border-neutral-900 bg-transparent overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start lg:items-center">

                    {/* Left Column: Info & Navigation */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[400px]">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-6">
                                Certifications
                            </h2>
                            <p className="text-neutral-500 text-lg font-light leading-relaxed mb-8">
                                Verified technical expertise in modern software architecture, cloud infrastructure, and design systems.
                            </p>

                            {/* View Toggle */}
                            <div className="flex items-center gap-2 mb-8">
                                <button
                                    onClick={() => setViewMode('gallery')}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 border rounded-sm text-sm font-mono tracking-wider transition-all duration-300",
                                        viewMode === 'gallery'
                                            ? "border-red-500 bg-red-500/10 text-red-500"
                                            : "border-neutral-800 bg-[#0A0A0A] text-neutral-500 hover:text-white hover:border-neutral-600"
                                    )}
                                >
                                    <LayoutTemplate className="w-4 h-4" />
                                    <span>GALLERY</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 border rounded-sm text-sm font-mono tracking-wider transition-all duration-300",
                                        viewMode === 'list'
                                            ? "border-red-500 bg-red-500/10 text-red-500"
                                            : "border-neutral-800 bg-[#0A0A0A] text-neutral-500 hover:text-white hover:border-neutral-600"
                                    )}
                                >
                                    <List className="w-4 h-4" />
                                    <span>LIST</span>
                                </button>
                            </div>
                        </div>

                        <div className={cn("flex items-center gap-6 mt-auto transition-opacity duration-300", viewMode === 'list' ? 'opacity-0 pointer-events-none' : 'opacity-100')}>
                            {/* Navigation Controls - Only visible in Gallery Mode */}
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handlePrev}
                                    className="w-12 h-12 border border-neutral-800 bg-[#0A0A0A] text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-300 flex items-center justify-center rounded-sm"
                                    aria-label="Previous certificate"
                                >
                                    <ChevronUp className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="w-12 h-12 border border-neutral-800 bg-[#0A0A0A] text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-300 flex items-center justify-center rounded-sm"
                                    aria-label="Next certificate"
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Progress/Counter */}
                            <div className="h-24 w-[1px] bg-neutral-900 relative">
                                <motion.div
                                    className="absolute top-0 left-0 w-full bg-red-500"
                                    animate={{
                                        height: `${((currentIndex + 1) / certificates.length) * 100}%`
                                    }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            </div>
                            <div className="font-mono text-sm text-neutral-500">
                                <span className="text-white">0{currentIndex + 1}</span> / 0{certificates.length}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Vertical Gallery or List View */}
                    <div className="lg:col-span-7 relative h-[600px] bg-[#080808] border border-neutral-900 rounded-lg overflow-hidden p-6 md:p-12 flex items-center justify-center">

                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}>
                        </div>

                        <div className="relative w-full h-full perspective-1000 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <AnimatePresence mode="wait">
                                {viewMode === 'gallery' ? (
                                    <motion.div
                                        key="gallery"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-full flex flex-col justify-center"
                                    >
                                        <AnimatePresence initial={false} mode="wait">
                                            <motion.div
                                                key={currentIndex}
                                                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                exit={{ opacity: 0, y: -50, rotateX: 10 }}
                                                transition={{ duration: 0.5, ease: "backOut" }}
                                                className="w-full h-full max-h-[500px] flex flex-col"
                                            >
                                                {/* Card Content */}
                                                <div className="w-full bg-[#050505] border border-neutral-800 shadow-2xl overflow-hidden flex flex-col group h-full">

                                                    {/* Image Section */}
                                                    <div className={cn("relative w-full overflow-hidden bg-neutral-900 border-b border-neutral-900 flex-1 min-h-0", certificates[currentIndex].aspect)}>
                                                        <img
                                                            src={certificates[currentIndex].image}
                                                            alt={certificates[currentIndex].title}
                                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60"></div>

                                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                                                            <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">{certificates[currentIndex].credentialId}</span>
                                                        </div>
                                                    </div>

                                                    {/* Details Section */}
                                                    <div className="p-6 md:p-8 shrink-0 flex flex-col justify-center relative bg-[#050505]">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="w-12 h-12 rounded-sm bg-neutral-900/50 border border-neutral-800 flex items-center justify-center shrink-0">
                                                                <BadgeCheck className="w-6 h-6 text-red-500" />
                                                            </div>
                                                            <a href={certificates[currentIndex].url} className="text-neutral-500 hover:text-white transition-colors">
                                                                <ExternalLink className="w-5 h-5" />
                                                            </a>
                                                        </div>

                                                        <h3 className="text-2xl md:text-3xl text-white font-serif italic mb-2 line-clamp-2">
                                                            {certificates[currentIndex].title}
                                                        </h3>
                                                        <p className="text-neutral-400 font-light mb-4">
                                                            Issued by <span className="text-white font-medium">{certificates[currentIndex].issuer}</span>
                                                        </p>

                                                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-neutral-900/50">
                                                            <Calendar className="w-4 h-4 text-neutral-600" />
                                                            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                                                                Issued: {certificates[currentIndex].date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="list"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-full flex flex-col justify-center gap-4"
                                    >
                                        <div className="space-y-3">
                                            {certificates.map((cert) => (
                                                <div
                                                    key={cert.id}
                                                    className="group flex items-center justify-between p-4 border border-neutral-800 bg-[#0A0A0A] hover:border-red-500/50 hover:bg-[#0F0F0F] transition-all duration-300 rounded-sm cursor-pointer"
                                                >
                                                    <div>
                                                        <h3 className="text-xl text-white font-serif italic group-hover:text-red-500 transition-colors">
                                                            {cert.title}
                                                        </h3>
                                                        <p className="text-sm text-neutral-500 font-mono mt-1 group-hover:text-neutral-400">
                                                            {cert.issuer}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="hidden md:inline-block text-xs font-mono text-neutral-600 uppercase tracking-widest">
                                                            {cert.date}
                                                        </span>
                                                        <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Decorative Corner Accents for the container */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neutral-700"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-neutral-700"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-neutral-700"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neutral-700"></div>
                    </div>

                </div>
            </div>
        </section>
    );
}

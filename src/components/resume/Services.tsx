// Custom 3D isometric SVG icons with shading and lighting
const ProductDesignIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <defs>
      <linearGradient id="pd-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#525252" />
        <stop offset="100%" stopColor="#404040" />
      </linearGradient>
      <linearGradient id="pd-left" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#262626" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
      <linearGradient id="pd-right" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#171717" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
      <linearGradient id="pd-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* 3D Blueprint/Document */}
    {/* Top face */}
    <path d="M24 8L40 16L24 24L8 16L24 8Z" fill="url(#pd-top)" />
    <path d="M24 8L40 16L24 24L8 16L24 8Z" fill="url(#pd-highlight)" />
    {/* Left face */}
    <path d="M8 16L24 24V40L8 32V16Z" fill="url(#pd-left)" />
    {/* Right face */}
    <path d="M40 16L24 24V40L40 32V16Z" fill="url(#pd-right)" />
    {/* Diamond accent on top */}
    <path d="M24 12L30 16L24 20L18 16L24 12Z" fill="#ef4444" fillOpacity="0.8" />
    {/* Grid lines */}
    <path d="M16 20L24 24M32 20L24 24" stroke="#525252" strokeWidth="0.5" opacity="0.5" />
  </svg>
);

const CloudArchitectureIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <defs>
      <linearGradient id="cloud-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#525252" />
        <stop offset="100%" stopColor="#404040" />
      </linearGradient>
      <linearGradient id="cloud-left" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#262626" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
      <linearGradient id="cloud-right" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#171717" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
    </defs>
    {/* Main hexagonal server node */}
    <path d="M24 4L36 10V22L24 28L12 22V10L24 4Z" fill="url(#cloud-top)" />
    <path d="M12 10L24 16V28L12 22V10Z" fill="url(#cloud-left)" />
    <path d="M36 10L24 16V28L36 22V10Z" fill="url(#cloud-right)" />
    {/* Center glow */}
    <circle cx="24" cy="14" r="3" fill="#ef4444" fillOpacity="0.8" />
    {/* Left node */}
    <path d="M10 30L16 33V39L10 42L4 39V33L10 30Z" fill="url(#cloud-top)" />
    <path d="M4 33L10 36V42L4 39V33Z" fill="url(#cloud-left)" />
    <path d="M16 33L10 36V42L16 39V33Z" fill="url(#cloud-right)" />
    {/* Right node */}
    <path d="M38 30L44 33V39L38 42L32 39V33L38 30Z" fill="url(#cloud-top)" />
    <path d="M32 33L38 36V42L32 39V33Z" fill="url(#cloud-left)" />
    <path d="M44 33L38 36V42L44 39V33Z" fill="url(#cloud-right)" />
    {/* Connection lines */}
    <path d="M18 26L12 30M30 26L36 30" stroke="#525252" strokeWidth="1" />
  </svg>
);

const FullStackIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <defs>
      <linearGradient id="stack-top1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#525252" />
        <stop offset="100%" stopColor="#404040" />
      </linearGradient>
      <linearGradient id="stack-top2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#404040" />
        <stop offset="100%" stopColor="#333333" />
      </linearGradient>
      <linearGradient id="stack-top3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#333333" />
        <stop offset="100%" stopColor="#262626" />
      </linearGradient>
      <linearGradient id="stack-left" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#262626" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
      <linearGradient id="stack-right" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#171717" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
    </defs>
    {/* Bottom layer */}
    <path d="M24 28L42 37L24 46L6 37L24 28Z" fill="url(#stack-top3)" />
    <path d="M6 37L24 46V42L6 33V37Z" fill="url(#stack-left)" opacity="0.5" />
    <path d="M42 37L24 46V42L42 33V37Z" fill="url(#stack-right)" opacity="0.5" />
    {/* Middle layer */}
    <path d="M24 18L42 27L24 36L6 27L24 18Z" fill="url(#stack-top2)" />
    <path d="M6 27L24 36V32L6 23V27Z" fill="url(#stack-left)" opacity="0.7" />
    <path d="M42 27L24 36V32L42 23V27Z" fill="url(#stack-right)" opacity="0.7" />
    {/* Top layer */}
    <path d="M24 8L42 17L24 26L6 17L24 8Z" fill="url(#stack-top1)" />
    <path d="M6 17L24 26V22L6 13V17Z" fill="url(#stack-left)" />
    <path d="M42 17L24 26V22L42 13V17Z" fill="url(#stack-right)" />
    {/* Lightning bolt */}
    <path d="M26 12L22 18H26L22 24" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UIUXIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <defs>
      <linearGradient id="ui-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#525252" />
        <stop offset="100%" stopColor="#404040" />
      </linearGradient>
      <linearGradient id="ui-left" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#262626" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
      <linearGradient id="ui-right" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#171717" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
      <linearGradient id="ui-screen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
    </defs>
    {/* 3D Monitor/Screen */}
    {/* Top face */}
    <path d="M24 6L42 14L24 22L6 14L24 6Z" fill="url(#ui-top)" />
    {/* Left face */}
    <path d="M6 14L24 22V38L6 30V14Z" fill="url(#ui-left)" />
    {/* Right face */}
    <path d="M42 14L24 22V38L42 30V14Z" fill="url(#ui-right)" />
    {/* Screen inset */}
    <path d="M24 10L36 16L24 22L12 16L24 10Z" fill="url(#ui-screen)" />
    {/* Cursor on screen */}
    <path d="M20 14L20 19L22 17.5L23.5 20L25 19.5L23.5 17L26 17L20 14Z" fill="#ef4444" />
    {/* Stand */}
    <path d="M22 38L26 38L28 44L20 44L22 38Z" fill="url(#ui-left)" />
    {/* Base */}
    <path d="M18 44L30 44L32 46L16 46L18 44Z" fill="url(#ui-top)" />
  </svg>
);

const services = [
  {
    icon: <ProductDesignIcon />,
    title: "Product Design",
    description: "Spec-driven development from concept to launch. I translate complex requirements into intuitive, user-centric experiences—like gamified training apps for ICU clinicians or AI tutoring platforms."
  },
  {
    icon: <CloudArchitectureIcon />,
    title: "Cloud Architecture",
    description: "Designing and deploying scalable systems on AWS and GCP. From containerized ECS/Lambda architectures to serverless FastAPI backends, I build infrastructure that's cost-efficient and production-ready."
  },
  {
    icon: <FullStackIcon />,
    title: "Full-Stack Engineering",
    description: "Building end-to-end applications with React, Next.js, and Python. I ship features fast—from real-time AI pipelines with Gemini to event-driven platforms on Firebase."
  },
  {
    icon: <UIUXIcon />,
    title: "UI/UX & Frontend",
    description: "Crafting polished interfaces with Tailwind CSS and modern React patterns. I focus on accessibility, performance, and delightful interactions that make complex tools feel simple."
  }
];

export function Services() {
  return (
    <section className="py-24 border-t border-neutral-900">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-6">Expertise</h2>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
            I build products from zero to one—designing systems, architecting cloud infrastructure, and shipping polished UIs that users love.
          </p>
        </div>

        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="space-y-4 group">
              {/* Standalone 3D icon */}
              <div className="w-12 h-12 group-hover:scale-110 group-hover:brightness-125 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-lg font-medium text-white group-hover:text-red-500 transition-colors">
                {service.title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed border-l border-neutral-900 pl-4 group-hover:border-red-500/50 transition-colors">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

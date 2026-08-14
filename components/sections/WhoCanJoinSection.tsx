"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Terminal, Lightbulb, Zap } from "lucide-react";

const profiles = [
  {
    number: "01",
    icon: Terminal,
    title: "The Builders & Hackers",
    description: "Open-source contributors, competitive programmers, and indie hackers who prioritize shipping real, scalable products over collecting certificates."
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Visionary Founders",
    description: "Student entrepreneurs and early-stage startup builders looking for elite technical co-founders and rapid prototyping feedback."
  },
  {
    number: "03",
    icon: Zap,
    title: "Relentless Learners",
    description: "Self-taught prodigies and engineering students who outgrow their college curriculum and crave high-signal, zero-noise environments."
  }
];

export function WhoCanJoinSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // State for Cursor Parallax Effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // IMPLEMENTED: Observer logic to toggle state on scroll in/out without disconnecting
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle Mouse Move for Interactive Parallax (Smoothed out)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 50;
    const y = (e.clientY - rect.top - rect.height / 2) / 50;
    setMousePos({ x, y });
  };

  return (
    <section 
      ref={sectionRef} 
      onMouseMove={handleMouseMove}
      className="relative z-10 w-full py-24 sm:py-32 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">
          
          {/* ---------------- LEFT SIDE (Shifted Upwards to stay above right cards) ---------------- */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center lg:self-start lg:-mt-4">
            
            <div className="relative w-full flex flex-col items-center text-center">
              
              {/* Magic Hover Orb */}
              <div 
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent/20 blur-[100px] rounded-full transition-transform duration-700 ease-out pointer-events-none"
                style={{ transform: `translate3d(${-mousePos.x * 2}px, ${-mousePos.y * 2}px, 0)` }}
              />

              {/* Parallax Image wrapper with smooth transition toggling */}
              <div className={`relative w-full max-w-[420px] aspect-square mb-6 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`}>
                <div 
                  className="relative w-full h-full transition-transform duration-700 ease-out"
                  style={{ 
                    transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) rotate(${mousePos.x * 0.03}deg)`,
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)'
                  }}
                >
                  <Image 
                    src="/assets/whobeongs.png" 
                    alt="Who Belongs Here" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-contain object-bottom drop-shadow-[0_15px_30px_rgba(134,56,205,0.4)]"
                    priority
                  />
                </div>
              </div>

              {/* Text Content with smooth scroll-in/out */}
              <div className={`transition-all duration-1000 ease-out delay-150 w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div 
                  className="transition-transform duration-700 ease-out"
                  style={{ transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)` }}
                >
                  <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-silver-gradient bg-clip-text text-transparent pb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    Who Belongs Here?
                  </h2>
                  <p className="text-lg text-[#E2D1FE]/80 leading-relaxed max-w-md mx-auto drop-shadow-sm">
                    GenXCode isn't for everyone. It's a merit-based ecosystem designed specifically for the top 1% of emerging tech talent. If you fit these profiles, you'll find your tribe.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ---------------- RIGHT SIDE (Cards with Staggered Scroll Transitions) ---------------- */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:mt-20">
            {profiles.map((profile, index) => {
              const Icon = profile.icon;
              const transitionDelay = `${200 + index * 150}ms`;

              return (
                <div 
                  key={index}
                  className="group relative flex flex-col sm:flex-row items-start gap-6 p-8 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-md hover:bg-black/40 hover:border-white/10 shadow-xl transition-all duration-700 ease-out hover:shadow-[0_15px_40px_rgba(134,56,205,0.25)] overflow-hidden"
                  style={{ 
                    transitionDelay,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0) translateY(0)' : 'translateX(30px) translateY(10px)'
                  }}
                >
                  {/* Giant Translucent Background Number */}
                  <div className="absolute -right-4 -bottom-8 font-heading text-[120px] font-bold leading-none text-white/[0.02] group-hover:text-white/[0.04] transition-colors duration-500 pointer-events-none select-none">
                    {profile.number}
                  </div>

                  {/* Icon Panel */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-2xl surface-glass-02 border border-white/10 group-hover:border-accent/40 group-hover:shadow-[0_0_20px_rgba(134,56,205,0.3)] transition-all duration-500">
                    <Icon className="w-7 h-7 text-[#E2D1FE] group-hover:text-white transition-colors" />
                  </div>

                  {/* Text Content */}
                  <div className="relative z-10 pt-2">
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-3 flex items-center gap-3">
                      {profile.title}
                    </h3>
                    <p className="text-[#E2D1FE]/70 leading-relaxed">
                      {profile.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
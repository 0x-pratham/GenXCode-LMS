"use client";

import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 w-full py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* Left Sticky Header Area (Slides in from Left) */}
          <div className={`lg:col-span-5 lg:sticky lg:top-32 ${isVisible ? 'animate-fade-in-left opacity-0 fill-mode-forwards' : 'opacity-0'}`}>
        
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-silver-gradient bg-clip-text text-transparent pb-2">
              Who Belongs Here?
            </h2>
            <p className="text-lg text-[#E2D1FE]/80 leading-relaxed max-w-md">
              GenXCode isn't for everyone. It's a merit-based ecosystem designed specifically for the top 1% of emerging tech talent. If you fit these profiles, you'll find your tribe.
            </p>
          </div>

          {/* Right Rows Area (Slides in from Right) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {profiles.map((profile, index) => {
              const Icon = profile.icon;
              // Staggered delay for each row
              const delayStyle = { animationDelay: `${400 + index * 200}ms` };

              return (
                <div 
                  key={index}
                  style={isVisible ? delayStyle : undefined}
                  // Added bg-black/20 and backdrop-blur-md for the dark blurry glass effect
                  className={`group relative flex flex-col sm:flex-row items-start gap-6 p-8 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-md hover:bg-black/40 hover:border-white/10 shadow-xl transition-all duration-500 overflow-hidden ${isVisible ? 'animate-fade-in-right opacity-0 fill-mode-forwards' : 'opacity-0'}`}
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
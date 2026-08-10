"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy, Code2, Rocket } from "lucide-react";
import { brandConfig } from "@/config/brand";

const features = [
  {
    icon: Code2,
    title: "Elite Cohorts",
    description: "Learn and build alongside a strictly curated community of top-tier developers. No noise, just high-signal collaboration."
  },
  {
    icon: Trophy,
    title: "Exclusive Hackathons",
    description: "Compete in high-stakes challenges. Prove your skills on the leaderboard and win exclusive tech bounties."
  },
  {
    icon: Rocket,
    title: "Career Acceleration",
    description: "Direct exposure to top tech recruiters and fast-tracked interviews based on your platform proof-of-work."
  }
];

export function WhyJoinSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jab 20% section screen par dikhega tab trigger hoga
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Ek baar trigger hone ke baad observer band kar do
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 w-full py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className={`${isVisible ? 'animate-reveal-blur [animation-delay:100ms]' : 'opacity-0'} fill-mode-forwards font-heading text-3xl md:text-5xl font-bold tracking-tight mb-2 pb-2 bg-silver-gradient bg-clip-text text-transparent`}>
            Why Join {brandConfig.name}?
          </h2>
          <p className={`${isVisible ? 'animate-reveal-blur [animation-delay:300ms]' : 'opacity-0'} fill-mode-forwards max-w-2xl text-[#E2D1FE]/80 text-lg`}>
            We don't just teach code. We build a verifiable legacy of your engineering capabilities through real-world execution.
          </p>
        </div>

        {/* Feature Cards Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const delayStyle = { animationDelay: `${500 + index * 200}ms` };

            return (
              <div 
                key={index}
                style={isVisible ? delayStyle : undefined}
                // Upgrade: Added bg-black/20, backdrop-blur-md, and updated hover states
                className={`${isVisible ? 'animate-reveal-blur' : 'opacity-0'} fill-mode-forwards group relative flex flex-col p-8 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5 shadow-xl transition-all duration-500 hover:bg-black/40 hover:border-white/10 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(134,56,205,0.2)]`}
              >
                {/* Subtle Inner Top Shadow for 3D Machine look */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon Wrapper */}
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 group-hover:bg-brand-gradient transition-all duration-300">
                  <Icon className="h-6 w-6 text-[#E2D1FE] group-hover:text-white transition-colors" />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#E2D1FE]/70 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
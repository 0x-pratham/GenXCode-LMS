"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { brandConfig } from "@/config/brand";

export function WhoWeAreSection() {
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
      { threshold: 0.2 } // Trigger when 20% visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 w-full py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetrical High-End Stage Panel */}
        <div 
          className={`relative overflow-hidden rounded-[3rem] bg-black/30 backdrop-blur-xl border border-white/10 p-10 md:p-16 lg:p-24 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out hover:border-white/20 ${
            isVisible ? 'animate-zoom-fade-in opacity-0 fill-mode-forwards' : 'opacity-0'
          }`}
        >
          {/* Subtle Inner Highlight for Top Edge (3D feel) */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

          {/* Ambient Inner Glow Aura */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-[600px] max-h-[600px] rounded-full bg-brand-gradient opacity-20 blur-[100px] pointer-events-none mix-blend-screen"></div>

          {/* Decorative Tech Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8638CD10_1px,transparent_1px),linear-gradient(to_bottom,#8638CD10_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

          {/* Grid Layout for Directional Animations */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: Badge & Heading (Left & Bottom Animations) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Minimalist Editorial Badge (Animated from Left) */}
              <div className={`inline-flex items-center gap-3 mb-6 ${isVisible ? 'animate-fade-in-left [animation-delay:200ms] opacity-0 fill-mode-forwards' : 'opacity-0'}`}>
                <span className="w-8 h-[2px] bg-brand-gradient rounded-full"></span>
                <span className="text-sm font-semibold tracking-widest text-[#E2D1FE] uppercase">
                  The Architects
                </span>
              </div>

              {/* Heading (Animated from Bottom, Left-Aligned) */}
              <h2 className={`font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] ${isVisible ? 'animate-fade-in-up [animation-delay:400ms] opacity-0 fill-mode-forwards' : 'opacity-0'}`}>
                Built by Engineers,<br />
                <span className="bg-silver-gradient bg-clip-text text-transparent pb-2">For Engineers.</span>
              </h2>

            </div>

            {/* RIGHT COLUMN: Paragraph & CTA Button (Right & Top Animations) */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end text-left lg:text-right justify-center space-y-8">
              
              {/* Manifesto Description (Animated from Right, Right-Aligned) */}
              <p className={`max-w-md text-base md:text-lg text-[#E2D1FE]/80 leading-relaxed ${isVisible ? 'animate-fade-in-right [animation-delay:600ms] opacity-0 fill-mode-forwards' : 'opacity-0'}`}>
                {brandConfig.name} was born out of frustration with traditional, slow-moving tech education. We are a collective of senior developers, open-source maintainers, and founders who decided to build the exact platform we wished we had.
              </p>

              {/* Interactive CTA Button (Animated from Top to Right alignment) */}
              <div className={`${isVisible ? 'animate-fade-in-down [animation-delay:800ms] opacity-0 fill-mode-forwards' : 'opacity-0'}`}>
                <Link href="/about">
                  <Button variant="premium" size="lg" className="rounded-full group px-8 h-14 text-base shadow-xl accent-glow-hover transition-all duration-300">
                    Discover Our Story
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
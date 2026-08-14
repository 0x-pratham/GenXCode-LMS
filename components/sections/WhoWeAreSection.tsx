"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { brandConfig } from "@/config/brand";

export function WhoWeAreSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // State for Cursor Parallax Effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Smooth Intersection Observer to toggle animation on scroll in/out
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

  // Handle Mouse Move for Interactive Parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 40;
    const y = (e.clientY - rect.top - rect.height / 2) / 40;
    setMousePos({ x, y });
  };

  return (
    <section 
      ref={sectionRef} 
      onMouseMove={handleMouseMove}
      // Added overflow-visible here so the character sitting on top never gets clipped
      className="relative z-10 w-full py-16 sm:py-24 mt-20 lg:mt-32 overflow-visible" 
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative overflow-visible">
        
        {/* ================= RELATIVE WRAPPER FOR PERFECT ALIGNMENT ================= */}
        <div className="relative w-full overflow-visible">
          
          {/* CHARACTER SITTING EXACTLY ON THE BORDER (Ensured full visibility without cutting) */}
          <div 
            className={`absolute bottom-full left-6 sm:left-12 lg:left-20 w-48 h-48 md:w-56 md:h-56 lg:w-[280px] lg:h-[280px] z-40 translate-y-[28%] lg:translate-y-[25%] pointer-events-none transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-12'
            }`}
          >
            <div 
              className="w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px, 0) rotate(${mousePos.x * 0.05}deg)` }}
            >
              {/* Extremely minimal and tight glow to ground the character */}
              <div className="absolute inset-x-8 lg:inset-x-16 bottom-4 lg:bottom-6 h-4 lg:h-6 bg-accent/40 blur-[20px] rounded-full opacity-40 mix-blend-screen" />
              
              {/* The Character Image */}
              <div className="w-full h-full relative z-10">
                <Image 
                  src="/assets/whoweare.png" 
                  alt="The Architect" 
                  fill 
                  sizes="(max-width: 768px) 192px, 280px"
                  className="object-contain object-bottom drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]" 
                />
              </div>
            </div>
          </div>

          {/* ASYMMETRICAL HIGH-END STAGE PANEL */}
          <div 
            className={`relative overflow-hidden rounded-[3rem] bg-black/30 backdrop-blur-xl border border-white/10 px-8 py-10 md:px-16 md:py-12 lg:px-24 lg:py-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-1000 ease-out hover:border-white/20 ${
              isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-98 translate-y-10'
            }`}
          >
            {/* Subtle Inner Highlight for Top Edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60" />

            {/* Ambient Inner Glow Aura */}
            <div 
              className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-[600px] max-h-[600px] rounded-full bg-brand-gradient opacity-10 blur-[120px] pointer-events-none mix-blend-screen transition-transform duration-700 ease-out"
              style={{ transform: `translate3d(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px, 0)` }}
            />

            {/* Decorative Tech Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8638CD10_1px,transparent_1px),linear-gradient(to_bottom,#8638CD10_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

            {/* Grid Layout for Directional Animations */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* LEFT COLUMN: Badge & Heading */}
              <div className="lg:col-span-7 flex flex-col items-start text-left relative">
                
                {/* Minimalist Editorial Badge */}
                <div 
                  className={`relative z-30 inline-flex items-center gap-3 mb-6 pt-6 lg:pt-8 transition-all duration-1000 ease-out delay-200 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)` }}
                >
                  <span className="w-8 h-[2px] bg-brand-gradient rounded-full shadow-[0_0_10px_rgba(134,56,205,0.8)]"></span>
                  <span className="text-sm font-semibold tracking-widest text-[#E2D1FE] uppercase drop-shadow-md">
                    The Architects
                  </span>
                </div>

                {/* Heading */}
                <h2 
                  className={`relative z-30 font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] transition-all duration-1000 ease-out delay-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, 0)` }}
                >
                  Built by Engineers,<br />
                  <span className="bg-silver-gradient bg-clip-text text-transparent pb-2 drop-shadow-lg">For Engineers.</span>
                </h2>

              </div>

              {/* RIGHT COLUMN: Paragraph & CTA Button */}
              <div className="lg:col-span-5 flex flex-col items-start lg:items-end text-left lg:text-right justify-center space-y-8 z-30 pt-4 lg:pt-0">
                
                {/* Manifesto Description */}
                <p className={`max-w-md text-base md:text-lg text-[#E2D1FE]/80 leading-relaxed transition-all duration-1000 ease-out delay-400 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}>
                  {brandConfig.name} was born out of frustration with traditional, slow-moving tech education. We are a collective of senior developers, open-source maintainers, and founders who decided to build the exact platform we wished we had.
                </p>

                {/* Interactive CTA Button - Removed glow shadow/class */}
                <div className={`transition-all duration-1000 ease-out delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                  <Link href="/about">
                    <Button variant="premium" size="lg" className="rounded-full group px-8 h-14 text-base transition-all duration-300">
                      Discover Our Story
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>

              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
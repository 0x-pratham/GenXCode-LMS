"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Code2, Trophy, Rocket, ShieldCheck } from "lucide-react";
import { brandConfig } from "@/config/brand";

const features = [
  {
    icon: Code2,
    title: "Elite Cohorts",
    description: "Learn and build alongside a strictly curated community of top-tier developers. No noise, just high-signal collaboration.",
    positionClass: "top-[2%] -left-[2%] xl:left-[2%]",
    floatDelay: "0s"
  },
  {
    icon: Trophy,
    title: "Exclusive Hackathons",
    description: "Compete in high-stakes challenges. Prove your skills on the leaderboard and win exclusive tech bounties.",
    positionClass: "top-[2%] -right-[2%] xl:right-[2%]",
    floatDelay: "2s"
  },
  {
    icon: ShieldCheck,
    title: "Verified Proof of Work",
    description: "Build a persistent, verifiable portfolio that speaks louder than standard resumes. Show them exactly what you can code.",
    positionClass: "bottom-[5%] -left-[2%] xl:left-[2%]",
    floatDelay: "1s"
  },
  {
    icon: Rocket,
    title: "Career Acceleration",
    description: "Direct exposure to top tech recruiters and fast-tracked interviews based on your platform proof-of-work.",
    positionClass: "bottom-[5%] -right-[2%] xl:right-[2%]",
    floatDelay: "3s"
  }
];

export function WhyJoinSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // State for Cursor Parallax Effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Smooth Intersection Observer to toggle state on scroll in/out
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

  // Handle Mouse Move for Interactive Parallax in Center
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
      className="relative z-10 w-full py-12 sm:py-20 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ================= DESKTOP VIEW (Orbital / Circular Layout) ================= */}
        <div className="hidden lg:block relative w-full min-h-[650px] xl:min-h-[700px]">
          
          {/* ----- CENTER CORE (Made Smaller & Tighter) ----- */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full max-w-[420px] z-20 pointer-events-none">
            
            {/* Magic Hover Orb behind Image */}
            <div 
              className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-accent/20 blur-[100px] rounded-full transition-transform duration-700 ease-out"
              style={{ transform: `translate3d(${-mousePos.x * 2}px, ${-mousePos.y * 2}px, 0)` }}
            />

            {/* Dual Linear Masking: Keeps box shape but fades all 4 edges with smooth re-triggerable transitions */}
            <div className={`relative w-full aspect-square mb-4 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-12'}`}>
              
              {/* Vertical Fade Wrapper (Top & Bottom) */}
              <div 
                className="relative w-full h-full transition-transform duration-700 ease-out"
                style={{ 
                  transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) rotate(${mousePos.x * 0.03}deg)`,
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 70%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 70%, transparent 100%)'
                }}
              >
                {/* Horizontal Fade Wrapper (Left & Right) */}
                <div 
                  className="relative w-full h-full"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
                  }}
                >
                  <Image 
                    src="/assets/why.png" 
                    alt="Why Join Us" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-contain drop-shadow-[0_15px_30px_rgba(134,56,205,0.4)] scale-110"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Center Text with Silver Gradient */}
            <div 
              className={`transition-all duration-1000 ease-out text-center delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)` }}
            >
              <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-silver-gradient bg-clip-text text-transparent pb-2 drop-shadow-xl">
                Why Join {brandConfig.name}?
              </h2>
              <p className="text-base lg:text-lg text-[#E2D1FE]/80 leading-relaxed drop-shadow-md">
                We don't just teach code. We build a verifiable legacy of your engineering capabilities through real-world execution.
              </p>
            </div>
          </div>

          {/* ----- THE 4 ORBITING CARDS (Flashy, Blurry, Transparent Glass) ----- */}
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const transitionDelay = `${200 + index * 120}ms`;

            return (
              <div 
                key={index}
                className={`absolute ${feature.positionClass} z-30 w-[300px] xl:w-[340px] transition-all duration-1000 ease-out`}
                style={{ 
                  transitionDelay,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)'
                }}
              >
                <div 
                  className="animate-float-slow group relative flex flex-col p-8 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(134,56,205,0.15)] transition-all duration-500 hover:bg-white/[0.08] hover:border-white/25 hover:scale-105 hover:shadow-[0_15px_40px_rgba(134,56,205,0.35)]"
                  style={{ animationDelay: feature.floatDelay }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/15 group-hover:border-accent/50 group-hover:shadow-[0_0_20px_rgba(134,56,205,0.4)] transition-all duration-300">
                    <Icon className="h-6 w-6 text-[#E2D1FE] group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="font-heading text-lg xl:text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#E2D1FE]/70 leading-relaxed text-xs xl:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= MOBILE / TABLET VIEW (Vertical Stack) ================= */}
        <div className="lg:hidden flex flex-col items-center">
          
          <div className="flex flex-col items-center text-center mb-16 relative w-full">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
            
            {/* Mobile Dual Linear Masking */}
            <div 
              className={`relative w-full max-w-[280px] aspect-square mb-6 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`}
              style={{ 
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 70%, transparent 100%)', 
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 70%, transparent 100%)' 
              }}
            >
              <div 
                className="relative w-full h-full"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
                }}
              >
                <Image 
                  src="/assets/why.png" 
                  alt="Why Join Us" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-contain drop-shadow-xl scale-110"
                />
              </div>
            </div>
            
            <div className={`transition-all duration-1000 ease-out delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-silver-gradient bg-clip-text text-transparent pb-2">
                Why Join {brandConfig.name}?
              </h2>
              <p className="max-w-xl mx-auto text-[#E2D1FE]/80 text-base md:text-lg">
                We don't just teach code. We build a verifiable legacy of your engineering capabilities through real-world execution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const transitionDelay = `${300 + index * 120}ms`;

              return (
                <div 
                  key={index}
                  className="group relative flex flex-col p-6 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(134,56,205,0.15)] transition-all duration-700 ease-out hover:bg-white/[0.08] hover:border-white/25"
                  style={{ 
                    transitionDelay,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(25px)'
                  }}
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/15 group-hover:border-accent/50 group-hover:bg-brand-gradient transition-all duration-300">
                    <Icon className="h-5 w-5 text-[#E2D1FE] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#E2D1FE]/70 leading-relaxed text-xs sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { authLinks } from "@/config/navigation";

export function AboutCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Smooth Intersection Observer with 0.2 threshold to toggle state on scroll in/out without disconnecting
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 w-full py-28 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetrical High-End Stage Panel with Smooth Scroll-In/Out */}
        <div 
          className={`relative overflow-hidden rounded-[3rem] bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-16 lg:p-20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] group transition-all duration-1000 ease-out hover:border-white/20 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-98'
          }`}
        >
          {/* Subtle Inner Highlight for Top Edge */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

          {/* Ambient Inner Glow Aura */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[500px] max-h-[500px] rounded-full bg-brand-gradient opacity-25 blur-[100px] pointer-events-none mix-blend-screen"></div>

          {/* Decorative Tech Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8638CD10_1px,transparent_1px),linear-gradient(to_bottom,#8638CD10_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

          {/* Split Layout Container */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT COLUMN: Badge & Main Heading */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Minimalist Editorial Badge */}
              <div 
                className={`inline-flex items-center gap-3 mb-6 transition-all duration-1000 ease-out delay-150 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              >
                <span className="w-8 h-[2px] bg-brand-gradient rounded-full"></span>
                <span className="text-sm font-semibold tracking-widest text-[#E2D1FE] uppercase">
                  Willing to Join?
                </span>
              </div>

              {/* Heading */}
              <h2 
                className={`font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] transition-all duration-1000 ease-out delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                Ready to Build the Future <br />
                <span className="bg-silver-gradient bg-clip-text text-transparent pb-2">With the Top 1%?</span>
              </h2>

            </div>

            {/* RIGHT COLUMN: Description & Action Button */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end text-left lg:text-right justify-center space-y-8">
              
              {/* Description */}
              <p 
                className={`max-w-md text-base md:text-lg text-[#E2D1FE]/80 leading-relaxed transition-all duration-1000 ease-out delay-400 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
              >
                GenXCode operates on a strict invite-only protocol. Step inside the ecosystem where execution speaks louder than words.
              </p>

              {/* Action Button */}
              <div 
                className={`transition-all duration-1000 ease-out delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <Link href={authLinks.requestInvite}>
                  <Button variant="premium" size="lg" className="rounded-full group px-8 h-14 text-base accent-glow-hover shadow-xl">
                    Request Invite
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
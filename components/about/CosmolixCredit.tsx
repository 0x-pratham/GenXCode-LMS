"use client";

import { useEffect, useRef, useState } from "react";

export function CosmolixCredit() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 w-full py-12 overflow-hidden flex justify-center">
      <div className="container mx-auto max-w-7xl px-4 flex justify-center">
        
        {/* Minimalist Watermark Wrapper */}
        <div 
          className={`relative inline-flex flex-col items-center group transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up opacity-0 fill-mode-forwards' : 'opacity-0'
          }`}
        >
          {/* Subtle top micro-label - Size increased further */}
          <span className="text-sm md:text-base font-mono tracking-[0.3em] text-[#E2D1FE]/40 uppercase mb-2 group-hover:text-[#E2D1FE]/70 transition-colors duration-500">
            A Product of
          </span>

          {/* The Watermark Link */}
          <a 
            href="https://cosmolix.co.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 py-1 px-4 group/link"
          >
            {/* Company Name - Size increased significantly */}
            <span className="font-heading text-2xl md:text-3xl font-semibold tracking-wider text-[#E2D1FE]/60 group-hover/link:text-foreground transition-colors duration-300">
              Cosmolix Pvt Ltd
            </span>

            {/* Glowing Underline animation on hover */}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-brand-gradient group-hover/link:w-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(134,56,205,0.8)]"></span>
          </a>

        </div>

      </div>
    </section>
  );
}
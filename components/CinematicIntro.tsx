"use client";

import React, { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import { brandConfig } from "@/config/brand";

export default function CinematicIntro({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeState, setFadeState] = useState(0); // 0 = init, 1 = logo reveal, 2 = text reveal, 3 = fade out

  useEffect(() => {
    // Check if intro has already been shown in this session
    const hasSeenIntro = sessionStorage.getItem("genxcode_intro_seen");
    
    if (hasSeenIntro) {
      setShowIntro(false);
      return;
    }

    // Cinematic Timing Sequence
    const t1 = setTimeout(() => setFadeState(1), 300);   // Show Logo
    const t2 = setTimeout(() => setFadeState(2), 1500);  // Show Subtitle
    const t3 = setTimeout(() => setFadeState(3), 3200);  // Start Fade Out
    const t4 = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("genxcode_intro_seen", "true");
    }, 4000); // Unmount and show website

    // Lock scrolling while intro is playing
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.style.overflow = "";
    };
  }, []);

  // Unlock scrolling when intro finishes
  useEffect(() => {
    if (!showIntro) {
      document.body.style.overflow = "";
    }
  }, [showIntro]);

  return (
    <>
      {showIntro && (
        <div 
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C0224] transition-opacity duration-1000 ease-in-out ${
            fadeState === 3 ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Ambient Core Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(134,56,205,0.15)_0%,_transparent_70%)] blur-3xl mix-blend-screen pointer-events-none" />

          {/* Intro Content */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Logo Icon */}
            <div className={`transition-all duration-1000 ease-out transform ${
              fadeState >= 1 ? "scale-100 opacity-100 translate-y-0" : "scale-75 opacity-0 translate-y-10"
            }`}>
              <Code2 className="w-16 h-16 md:w-20 md:h-20 text-accent drop-shadow-[0_0_20px_rgba(134,56,205,0.6)] mb-6" />
            </div>

            {/* Brand Name */}
            <h1 className={`font-heading text-4xl md:text-6xl font-bold tracking-widest bg-silver-gradient bg-clip-text text-transparent drop-shadow-2xl transition-all duration-1000 delay-300 ease-out transform ${
              fadeState >= 1 ? "opacity-100 translate-y-0 scale-100 filter-none" : "opacity-0 translate-y-10 scale-105 blur-md"
            }`}>
              {brandConfig.name.toUpperCase()}
            </h1>

            {/* Subtitle / Loader */}
            <div className={`mt-6 flex flex-col items-center transition-all duration-700 delay-500 ease-out transform ${
              fadeState >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}>
              <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-[#E2D1FE]/60 uppercase mb-4">
                Initializing Elite Workspace
              </span>
              
              {/* Premium Progress Bar line */}
              <div className="w-48 h-px bg-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full bg-brand-gradient -translate-x-full animate-[wipe-reveal_1.5s_ease-in-out_forwards]" />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Main Website Content (Hidden until intro finishes, or fades in beautifully) */}
      <div className={`transition-opacity duration-1000 ${showIntro ? "opacity-0" : "opacity-100"}`}>
        {children}
      </div>
    </>
  );
}
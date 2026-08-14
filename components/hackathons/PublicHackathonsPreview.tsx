"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Lock, ArrowRight, Code } from "lucide-react";
import { authLinks } from "@/config/navigation";

// Define the shape of hackathon data based on your schema
interface Hackathon {
  id: string;
  title: string;
  slug: string;
  description: string;
  starts_at: string;
  status: string;
  team_min_size: number;
  team_max_size: number;
}

export default function PublicHackathonsPreview({ hackathons }: { hackathons: Hackathon[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // State for Cursor Parallax Effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 1. Re-triggerable Intersection Observer (Doesn't disconnect, toggles state)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 } // Trigger when 15% visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 40;
    const y = (e.clientY - rect.top - rect.height / 2) / 40;
    setMousePos({ x, y });
  };

  return (
    <div 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="flex flex-col items-center w-full bg-transparent pt-32 pb-24 min-h-screen overflow-visible relative"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative overflow-visible flex flex-col items-center">
        
        {/* --- MINIMAL HEADER WITH DISSOLVING SIDE EFFECTS & CURSOR PARALLAX --- */}
        <div className="text-center mb-16 relative z-20 w-full flex flex-col items-center justify-center">
          
          <div className={`relative z-20 inline-flex items-center gap-3 mb-6 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <span className="w-8 h-[2px] bg-brand-gradient rounded-full shadow-[0_0_10px_rgba(134,56,205,0.8)]"></span>
            <span className="text-sm font-semibold tracking-widest text-[#E2D1FE] uppercase drop-shadow-md">
              Exclusive Events
            </span>
            <span className="w-8 h-[2px] bg-brand-gradient rounded-full shadow-[0_0_10px_rgba(134,56,205,0.8)]"></span>
          </div>
          
          <h1 className={`relative z-20 font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-silver-gradient bg-clip-text text-transparent pb-4 mb-4 drop-shadow-2xl transition-all duration-700 ease-out delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Global Hackathons
          </h1>
          
          <p className={`relative z-20 max-w-2xl mx-auto text-base md:text-lg text-[#E2D1FE]/80 leading-relaxed transition-all duration-700 ease-out delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Form teams, build ambitious projects, and win massive XP rewards to dominate the league. Access is strictly invite-only.
          </p>
        </div>

        {/* --- RELATIVE WRAPPER FOR ALIGNMENT --- */}
        <div className="relative w-full overflow-visible flex flex-col gap-10 z-20">
          
          {/* Hackathons Grid Preview */}
          <div className="w-full mx-auto z-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hackathons && hackathons.length > 0 ? hackathons.map((hackathon, index) => {
              const startDate = new Date(hackathon.starts_at).toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric' 
              });

              // Dynamic Status Styling
              let badgeClass = "uppercase text-xs font-bold px-3 py-1 rounded-full border ";
              let cardBorderClass = "border-white/10 hover:border-white/20";
              let cardGlow = "hover:shadow-[0_8px_30px_rgba(134,56,205,0.15)]";

              if (hackathon.status === "open") {
                badgeClass += "border-emerald-500/30 text-emerald-400 bg-emerald-500/10";
                cardBorderClass = "border-emerald-500/30 hover:border-emerald-500/50";
                cardGlow = "hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]";
              } else if (hackathon.status === "announced") {
                badgeClass += "border-amber-500/30 text-amber-400 bg-amber-500/10";
              } else if (hackathon.status === "completed") {
                badgeClass += "border-white/20 text-[#E2D1FE]/70 bg-white/5";
              } else if (hackathon.status === "judging") {
                badgeClass += "border-accent/30 text-accent bg-accent/10";
              }

              const teamText = hackathon.team_min_size === hackathon.team_max_size
                ? (hackathon.team_min_size === 1 ? "Individual" : `${hackathon.team_min_size} members`)
                : `${hackathon.team_min_size}-${hackathon.team_max_size} members`;

              const transitionDelay = `${300 + index * 100}ms`;

              return (
                <Card 
                  key={hackathon.id} 
                  className={`backdrop-blur-xl flex flex-col overflow-hidden bg-black/30 transition-all duration-700 ease-out rounded-[2rem] group relative ${cardBorderClass} ${cardGlow} ${
                    isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-98'
                  }`}
                  style={{ transitionDelay }}
                >
                  {/* Public Overlay Lock (Premium Glassmorphism) */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[2rem] overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(134,56,205,0.4)]">
                      <Lock className="w-6 h-6 text-accent" />
                    </div>
                    <span className="font-heading text-xl font-bold text-white tracking-wide">Invite Required</span>
                  </div>

                  <CardHeader className="pb-4 relative z-0">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className={badgeClass}>
                        {hackathon.status}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                        <Trophy className="w-3.5 h-3.5" /> XP
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground drop-shadow-sm leading-snug">
                      {hackathon.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-6 relative z-0">
                    <p className="text-sm text-[#E2D1FE]/70 line-clamp-3 leading-relaxed">
                      {hackathon.description || "Compete with the best. Build something extraordinary."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                      <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#E2D1FE]/60 uppercase tracking-wider">
                          <Users className="w-3.5 h-3.5" /> Team Size
                        </div>
                        <span className="text-sm font-bold text-white">{teamText}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#E2D1FE]/60 uppercase tracking-wider">
                          <Calendar className="w-3.5 h-3.5" /> Starts On
                        </div>
                        <span className="text-sm font-bold text-white">{startDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }) : (
              <div className="col-span-full py-20 text-center text-[#E2D1FE]/60 animate-pulse border border-dashed border-white/10 rounded-[3rem]">
                <Code className="w-12 h-12 text-[#E2D1FE]/30 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-foreground">No Events Available</h3>
                <p className="text-sm mt-2 max-w-sm mx-auto">Admins haven't published any hackathons yet.</p>
              </div>
            )}
          </div>

          {/* --- WIDE HORIZONTAL LUXURY CTA PANEL (Consistent with Leaderboard Preview) --- */}
          <div 
            className={`relative overflow-hidden rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/10 w-full max-w-6xl mx-auto px-6 py-8 md:px-12 md:py-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-1000 ease-out hover:border-white/20 z-30 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 ${
              isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-98 translate-y-10'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            {/* Top Subtle Highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

            {/* Core Ambient Glow linked to cursor parallax */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[200%] max-w-[800px] max-h-[400px] rounded-full bg-brand-gradient opacity-[0.10] blur-[100px] pointer-events-none mix-blend-screen transition-transform duration-700 ease-out"
              style={{ transform: `translate3d(${-mousePos.x * 1.2}px, ${-mousePos.y * 1.2}px, 0)` }}
            />

            {/* Minimal Tech Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8638CD08_1px,transparent_1px),linear-gradient(to_bottom,#8638CD08_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none" />

            {/* LEFT SIDE: Text Only */}
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
              <h2 
                className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] transition-transform duration-700 ease-out drop-shadow-xl"
                style={{ transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, 0)` }}
              >
                Ready to build <br className="hidden lg:block" /> the 
                <span className="text-transparent bg-clip-text bg-silver-gradient"> Future?</span>
              </h2>
              <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] md:tracking-[0.25em] text-[#E2D1FE]/50 uppercase mt-3 md:mt-4">
                Kick Start Your Journey with Exclusive Hackathons
              </p>
            </div>

            {/* RIGHT SIDE: Button (Glow removed) */}
            <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-end shrink-0 mt-4 md:mt-0">
              <Link href={authLinks.requestInvite} className="w-full md:w-auto">
                <Button 
                  variant="premium" 
                  size="lg" 
                  className="w-full md:w-auto rounded-full group px-8 md:px-10 h-12 md:h-14 text-sm md:text-base font-bold transition-all duration-300 hover:scale-[1.02]"
                >
                  Request Invite Today
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
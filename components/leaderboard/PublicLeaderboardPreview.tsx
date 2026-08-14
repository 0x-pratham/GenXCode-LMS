"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Medal, Star, Flame, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authLinks } from "@/config/navigation";

interface PublicLeaderboardPreviewProps {
  topEngineers: {
    rank: number;
    name: string;
    points: string;
    level: string;
    avatar_url?: string;
  }[];
}

export default function PublicLeaderboardPreview({ topEngineers }: PublicLeaderboardPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // State for Cursor Parallax Effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 1. Observer Logic Update: Dynamic toggling on scroll in/out without disconnecting
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // Jab 20% part dikhe ya bahar ho
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
      className="flex flex-col items-center w-full bg-transparent pt-32 pb-24 min-h-screen overflow-visible"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative overflow-visible flex flex-col items-center">
        
        {/* --- MINIMAL HEADER --- */}
        <div className="text-center mb-16 relative z-20 w-full">
          <div className={`inline-flex items-center gap-3 mb-6 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <span className="w-8 h-[2px] bg-brand-gradient rounded-full shadow-[0_0_10px_rgba(134,56,205,0.8)]"></span>
            <span className="text-sm font-semibold tracking-widest text-[#E2D1FE] uppercase drop-shadow-md">
              Global Rankings
            </span>
            <span className="w-8 h-[2px] bg-brand-gradient rounded-full shadow-[0_0_10px_rgba(134,56,205,0.8)]"></span>
          </div>
          
          <h1 className={`font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-silver-gradient bg-clip-text text-transparent pb-4 mb-4 drop-shadow-2xl transition-all duration-1000 ease-out delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            The Elite Leaderboard
          </h1>
          
          <p className={`max-w-2xl mx-auto text-base md:text-lg text-[#E2D1FE]/80 leading-relaxed transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Where the top 1% prove their worth. Real-time rankings based on production-grade shipments, hackathon victories, and algorithmic efficiency.
          </p>
        </div>

        {/* --- RELATIVE WRAPPER FOR ALIGNMENT --- */}
        <div className="relative w-full overflow-visible flex flex-col gap-10">
          
          {/* FULL LEADERBOARD LIST (Portal UI Imported) */}
          <div className="w-full max-w-4xl mx-auto z-20">
            
            {/* Table Header (Hidden on Mobile, Visible on md+) */}
            <div className={`transition-all duration-700 ease-out delay-300 hidden md:flex items-center px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#E2D1FE]/50 mb-3 border-b border-white/5 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              <div className="w-20 text-center">Rank</div>
              <div className="flex-1 pl-4">Developer</div>
              <div className="w-40 text-center">League</div>
              <div className="w-32 text-right pr-2">Total XP</div>
            </div>

            {/* List Wrapper */}
            <div className="space-y-3">
              {topEngineers.length > 0 ? topEngineers.map((user, index) => {
                const isFirst = user.rank === 1;
                const isSecond = user.rank === 2;
                const isThird = user.rank === 3;
                const transitionDelay = `${400 + index * 80}ms`;

                // Refined Elite Glow Styling for rows
                let rowBaseClass = "bg-black/30 backdrop-blur-xl border-white/10 text-foreground hover:bg-white/[0.06] hover:border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.4)]";
                let rankElement = <span className="font-heading text-xl font-bold text-[#E2D1FE]/60">#{user.rank}</span>;

                if (isFirst) {
                  rowBaseClass = "bg-gradient-to-r from-yellow-500/15 via-black/40 to-black/30 border-yellow-500/40 shadow-[0_0_35px_rgba(234,179,8,0.15)] hover:border-yellow-500/60";
                  rankElement = <Crown className="w-7 h-7 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)] mx-auto animate-pulse-slow" />;
                } else if (isSecond) {
                  rowBaseClass = "bg-gradient-to-r from-slate-300/15 via-black/40 to-black/30 border-slate-300/40 shadow-[0_0_25px_rgba(203,213,225,0.1)] hover:border-slate-300/60";
                  rankElement = <Medal className="w-7 h-7 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)] mx-auto" />;
                } else if (isThird) {
                  rowBaseClass = "bg-gradient-to-r from-amber-600/15 via-black/40 to-black/30 border-amber-600/40 shadow-[0_0_25px_rgba(217,119,6,0.1)] hover:border-amber-600/60";
                  rankElement = <Medal className="w-7 h-7 text-amber-500 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)] mx-auto" />;
                }

                return (
                  <div 
                    key={user.rank} 
                    className={`flex flex-col md:flex-row items-center p-4 md:px-6 md:py-4 rounded-2xl border transition-all duration-700 ease-out group ${rowBaseClass} ${
                      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-98'
                    }`}
                    style={{ transitionDelay }}
                  >
                    {/* Column 1: Rank */}
                    <div className="w-full md:w-20 flex justify-center mb-3 md:mb-0 shrink-0">
                      {rankElement}
                    </div>

                    {/* Column 2: Avatar & Developer Info */}
                    <div className="flex-1 flex items-center gap-4 w-full justify-center md:justify-start mb-4 md:mb-0 pl-0 md:pl-4">
                      <Avatar className={`w-12 h-12 border-2 ${isFirst ? 'border-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : isSecond ? 'border-slate-300/60 shadow-[0_0_12px_rgba(203,213,225,0.3)]' : isThird ? 'border-amber-500/60 shadow-[0_0_12px_rgba(217,119,6,0.3)]' : 'border-white/10 shadow-inner'}`}>
                        <AvatarImage src={user.avatar_url || ""} />
                        <AvatarFallback className="bg-white/5 text-foreground font-bold uppercase">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center md:text-left">
                        <div className="font-bold text-foreground text-lg truncate max-w-[200px] sm:max-w-xs flex items-center justify-center md:justify-start gap-2">
                          {user.name}
                        </div>
                        {/* Hidden on desktop since we have a dedicated League column, visible on mobile */}
                        <div className="text-[10px] uppercase tracking-widest text-[#E2D1FE]/50 md:hidden mt-1">
                          {user.level}
                        </div>
                      </div>
                    </div>

                    {/* Column 3: League Badge (Desktop only or prominent on mobile) */}
                    <div className="w-full md:w-40 flex justify-center mb-4 md:mb-0 shrink-0 hidden md:flex">
                      <Badge variant="outline" className={`capitalize px-3 py-1 font-bold ${
                        isFirst ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 
                        isSecond ? 'border-slate-400/40 text-slate-300 bg-slate-400/10' : 
                        isThird ? 'border-amber-600/40 text-amber-500 bg-amber-600/10' : 
                        'border-white/20 text-[#E2D1FE] bg-white/5'
                      }`}>
                        {user.level}
                      </Badge>
                    </div>

                    {/* Column 4: Points (XP) */}
                    <div className="w-full md:w-32 flex justify-center md:justify-end shrink-0 pr-0 md:pr-2">
                      <span className={`inline-flex items-center gap-1.5 font-heading text-xl font-bold ${
                        isFirst ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]' : 
                        isSecond ? 'text-slate-300' : 
                        isThird ? 'text-amber-500' : 
                        'text-accent'
                      }`}>
                        <Flame className={`w-5 h-5 ${
                          isFirst ? 'text-yellow-500 fill-yellow-500/30' : 
                          isSecond ? 'text-slate-400 fill-slate-400/20' : 
                          isThird ? 'text-amber-600 fill-amber-600/20' : 
                          'fill-accent/20'
                        }`} /> 
                        {user.points}
                      </span>
                    </div>

                  </div>
                );
              }) : (
                <div className="p-10 text-center text-[#E2D1FE]/60 animate-pulse border border-dashed border-white/10 rounded-3xl">Synchronizing Leaderboard...</div>
              )}
            </div>
          </div>

          {/* --- WIDE HORIZONTAL LUXURY CTA PANEL --- */}
          <div 
            className={`relative overflow-hidden rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/10 w-full max-w-6xl mx-auto px-6 py-8 md:px-12 md:py-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-1000 ease-out hover:border-white/20 z-30 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 ${
              isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-98 translate-y-10'
            }`}
            style={{ transitionDelay: '700ms' }}
          >
            {/* Top Subtle Highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

            {/* Core Ambient Glow linked to cursor parallax */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[200%] max-w-[800px] max-h-[400px] rounded-full bg-brand-gradient opacity-[0.10] blur-[100px] pointer-events-none mix-blend-screen transition-transform duration-700 ease-out"
              style={{ transform: `translate3d(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px, 0)` }}
            />

            {/* Minimal Tech Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8638CD08_1px,transparent_1px),linear-gradient(to_bottom,#8638CD08_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none" />

            {/* LEFT SIDE: Text Only */}
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
              <h2 
                className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] transition-transform duration-700 ease-out drop-shadow-xl"
                style={{ transform: `translate3d(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px, 0)` }}
              >
                Want to be the Rival <br className="hidden lg:block" /> at 
                <span className="text-transparent bg-clip-text bg-silver-gradient"> Leaderboard?</span>
              </h2>
              <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] md:tracking-[0.25em] text-[#E2D1FE]/50 uppercase mt-3 md:mt-4">
                Join the Elite Ranks and showcase your skills to the world.
              </p>
            </div>

            {/* RIGHT SIDE: Button */}
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
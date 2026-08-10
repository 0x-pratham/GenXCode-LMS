import { CreativeMinds } from "@/components/about/CreativeMinds";
import { CosmolixCredit } from "@/components/about/CosmolixCredit";
import { AboutCTA } from "@/components/about/AboutCTA";
import { Code2, Terminal as TerminalIcon } from "lucide-react";

export default function AboutPage() {
  return (
    // bg-transparent zaroori hai taaki global layout ka purple aurora background peeche se dikhe
    <div className="flex flex-col items-center w-full bg-transparent pt-32 pb-16 overflow-hidden">
      
      {/* ---------------- ABOUT HERO SECTION ---------------- */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-32 relative">
        
        {/* Ambient Background Glow specific to About Page Hero */}
        <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT COLUMN: Manifesto Text */}
          <div className="lg:col-span-7 relative z-10">
            <h1 className="animate-wipe-reveal opacity-0 fill-mode-forwards font-heading text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight bg-silver-gradient bg-clip-text text-transparent pb-4 mb-6 leading-[1.1]">
              Our Genesis
            </h1>
            
            <div className="max-w-2xl space-y-6">
              <p className="animate-reveal-blur [animation-delay:400ms] opacity-0 fill-mode-forwards text-lg md:text-xl text-[#E2D1FE]/90 leading-relaxed font-medium">
                GenXCode wasn't conceived in a boardroom. It was forged from a collective frustration with a tech industry that often prioritizes credentialism over actual capability. We recognized that true engineering excellence is demonstrated through rigorous execution, not merely passive participation.
              </p>
              
              <p className="animate-reveal-blur [animation-delay:600ms] opacity-0 fill-mode-forwards text-lg md:text-xl text-[#E2D1FE]/70 leading-relaxed">
                What began as an initiative to identify top-tier talent has rapidly evolved into an exclusive, merit-driven ecosystem. Today, we provide the infrastructure for the next generation of builders, visionaries, and hackers to ship production-grade software, compete in high-stakes environments, and build a verifiable legacy of proof-of-work.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Upgraded Premium Data Module Card */}
          <div className="hidden lg:block lg:col-span-5 relative z-10">
            <div className="animate-zoom-fade-in [animation-delay:800ms] opacity-0 fill-mode-forwards relative w-full aspect-square rounded-[3rem] bg-black/40 backdrop-blur-xl border border-white/10 p-8 lg:p-10 flex flex-col justify-between shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden group hover:border-white/20 transition-all duration-700">
              
              {/* NEW: Animated Laser Scan Line */}
              <div className="absolute left-0 w-full h-[2px] bg-accent/60 shadow-[0_0_20px_#8638CD] animate-scan-line z-20 pointer-events-none" />

              {/* Subtle Inner Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gradient/40 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
              
              {/* Decorative Tech Grid inside the card */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8638CD15_1px,transparent_1px),linear-gradient(to_bottom,#8638CD15_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none" />

              {/* System Header (Top) */}
              <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                  </span>
                  <span className="text-xs font-mono font-medium text-[#E2D1FE]/60 tracking-widest uppercase">Sys.Core.V2</span>
                </div>
                <TerminalIcon className="w-5 h-5 text-[#E2D1FE]/40 group-hover:text-accent transition-colors duration-500" />
              </div>
              
              {/* Main Content (Middle) */}
              <div className="relative z-10 flex-1 flex flex-col justify-center mt-6">
                <Code2 className="w-10 h-10 text-[#E2D1FE]/30 mb-4 group-hover:text-white transition-colors duration-500" />
                <h3 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-[1.1] drop-shadow-lg">
                  Execution <br/> 
                  <span className="text-transparent bg-silver-gradient bg-clip-text">Over Excuses.</span>
                </h3>

                {/* FIXED: Live Terminal Logs - escaped the greater-than signs using {'>'} */}
                <div className="mt-4 space-y-2 font-mono text-[11px] lg:text-xs text-[#E2D1FE]/50 relative [mask-image:linear-gradient(to_bottom,white_40%,transparent)]">
                  <p className="animate-fade-in-up [animation-delay:1200ms] opacity-0 fill-mode-forwards">{'>'} Initialize protocol: GEN-X</p>
                  <p className="animate-fade-in-up [animation-delay:1400ms] opacity-0 fill-mode-forwards">{'>'} Loading elite cohorts... <span className="text-green-400">SUCCESS</span></p>
                  <p className="animate-fade-in-up [animation-delay:1600ms] opacity-0 fill-mode-forwards">{'>'} Compiling proof-of-work module...</p>
                  <p className="animate-fade-in-up [animation-delay:1800ms] opacity-0 fill-mode-forwards animate-pulse text-accent">{'>'} Awaiting rigorous execution_</p>
                </div>
              </div>

              {/* Footer (Bottom) */}
              <div className="relative z-10 border-t border-white/10 pt-5 mt-4 flex justify-between items-center">
                <p className="text-[10px] font-semibold tracking-widest text-accent uppercase">
                  Strictly Curated
                </p>
                <p className="text-[10px] font-mono text-[#E2D1FE]/40">
                  EST. 2025
                </p>
              </div>
            
            </div>
          </div>

        </div>
      </div>

      {/* ---------------- ABOUT SECTIONS ---------------- */}
      <CreativeMinds />
      <AboutCTA />     {/* Naya High-End CTA Section */}
      <CosmolixCredit />
      
    </div>
  );
}
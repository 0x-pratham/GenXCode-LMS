import { CreativeMinds } from "@/components/about/CreativeMinds";
import { CosmolixCredit } from "@/components/about/CosmolixCredit";
import { AboutCTA } from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center w-full bg-transparent pt-32 pb-16 overflow-hidden">
      
      {/* ---------------- ABOUT HERO SECTION ---------------- */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-32 relative">
        
        {/* Ambient Background Glow specific to About Page Hero */}
        <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT COLUMN: Systematic Manifesto Text */}
          <div className="lg:col-span-7 relative z-10">
            <h1 className="animate-wipe-reveal opacity-0 fill-mode-forwards font-heading text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight bg-silver-gradient bg-clip-text text-transparent pb-4 mb-8 leading-[1.1]">
              Our Genesis
            </h1>
            
            {/* Organized Paragraph Container */}
            <div className="max-w-2xl relative">
              {/* Subtle decorative structure line on the left for a minimal, organized look */}
              <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-accent/50 via-white/10 to-transparent hidden sm:block" />
              
              <div className="sm:pl-8 space-y-6">
                <p className="animate-reveal-blur [animation-delay:400ms] opacity-0 fill-mode-forwards text-lg md:text-xl text-[#E2D1FE]/90 leading-relaxed font-medium">
                  GenXCode wasn't conceived in a boardroom. It was forged from a collective frustration with a tech industry that often prioritizes credentialism over actual capability. We recognized that true engineering excellence is demonstrated through rigorous execution, not merely passive participation.
                </p>
                
                <p className="animate-reveal-blur [animation-delay:600ms] opacity-0 fill-mode-forwards text-lg md:text-xl text-[#E2D1FE]/70 leading-relaxed">
                  What began as an initiative to identify top-tier talent has rapidly evolved into an exclusive, merit-driven ecosystem. Today, we provide the infrastructure for the next generation of builders, visionaries, and hackers to ship production-grade software, compete in high-stakes environments, and build a verifiable legacy of proof-of-work.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Seamlessly Dissolved Visual Image with Breathing Float Animation */}
          <div className="hidden lg:block lg:col-span-5 relative z-10">
            
            {/* Outer div handles only the entry fade-in */}
            <div className="animate-fade-in-up [animation-delay:800ms] opacity-0 fill-mode-forwards relative w-full">
              
              {/* Inner div handles the continuous floating animation */}
              <div className="animate-float-slow relative w-full h-[450px] xl:h-[550px] group flex items-center justify-center">
                
                {/* Core minimal glow behind the image to anchor it */}
                <div className="absolute inset-10 bg-accent/20 blur-[80px] rounded-full pointer-events-none mix-blend-screen" />

                {/* 
                  TRUE ALPHA MASKING:
                  This physically erases the pixels of the image from the edges inwards.
                  black 40% = center is 100% visible.
                  transparent 75% = edges are 0% visible (completely dissolved).
                  No solid color overlays are used, so the background texture shows through perfectly!
                */}
                <div 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{
                    WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 75%)',
                    maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 75%)'
                  }}
                >
                  <img
                    src="/assets/aboutvisual.png"
                    alt="GenXCode Visual"
                    className="w-full h-full object-cover object-center opacity-90 transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ---------------- ABOUT SECTIONS ---------------- */}
      <CreativeMinds />
      <AboutCTA />
      <CosmolixCredit />
      
    </div>
  );
}
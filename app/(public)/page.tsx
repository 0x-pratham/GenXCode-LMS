import { brandConfig } from '@/config/brand';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { authLinks } from '@/config/navigation';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      
      {/* Immersive Background Image & Effects */}
      <div className="absolute inset-0 z-0">
        {/* Hero Background Image */}
        <Image 
          src="/assets/hero.jpg" 
          alt="GenXCode Hero Background"
          fill
          priority
          className="object-cover object-center"
        />
        
        {/* Dark Scrim / Overlay for Text Legibility (As per Spec) */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/70 to-background/95 backdrop-blur-[2px]" />
        
        {/* Core Radial Glow to keep the brand identity alive over the image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(134,56,205,0.25)_0%,_transparent_70%)] blur-3xl mix-blend-screen" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-12 md:mt-0">
        
        {/* Main Headline with Entry Animation */}
        <h1 className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards font-heading text-5xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl mb-6 max-w-5xl drop-shadow-2xl leading-[1.1]">
          Build Your Tech Legacy with{' '}
          <span className="relative inline-block text-foreground">
            {brandConfig.name}
            {/* UX Enhancement: A sleek gradient underline beneath the white text */}
            <span className="absolute -bottom-2 left-0 w-full h-[4px] rounded-full bg-brand-gradient opacity-80" />
          </span>
        </h1>
        
        {/* Description with Staggered Entry Animation */}
        <p className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards max-w-2xl text-lg md:text-xl text-[#E2D1FE]/90 mb-10 leading-relaxed font-sans shadow-black/50 drop-shadow-md">
          {brandConfig.description}. Join elite cohorts, participate in hackathons, and climb the leaderboard. 
          <strong className="block mt-3 text-foreground font-semibold">Invitation strictly required.</strong>
        </p>
        
        {/* CTAs with Final Staggered Entry Animation */}
        <div className="animate-fade-in-up [animation-delay:500ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-center justify-center">
          <Link href={authLinks.requestInvite} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-1 group shadow-xl">
              Request an Invite
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <Link href="/about" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full surface-glass-01 border-white/20 text-foreground hover:surface-glass-02 hover:border-white/40 transition-all duration-300 shadow-lg backdrop-blur-md">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
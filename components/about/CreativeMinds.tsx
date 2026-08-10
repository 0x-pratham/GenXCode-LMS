"use client";

import { useEffect, useRef, useState } from "react";

// Pyramid Structure: Row 1 (2 cards - slightly larger), Row 2 (4 cards), Row 3 (4 cards)
const row1Team = [
  {
    name: "Prathamesh Bhil",
    role: "Founder & Mentor",
    bio: "Ex-Staff Engineer. Obsessed with high-performance systems and zero-latency UI.",
    initials: "PB",
    animationClass: "animate-fade-in-left",
    isLead: true // Flag to render larger size
  },
  {
    name: "Rohit Yadav",
    role: "Club Director",
    bio: "Visionary designer turning complex developer workflows into frictionless experiences.",
    initials: "RY",
    animationClass: "animate-fade-in-right",
    isLead: true // Flag to render larger size
  }
];

const row2Team = [
  {
    name: "Shirin Ekatpure",
    role: "Event Manager",
    bio: "Master of backend infrastructure and scalable cloud deployments.",
    initials: "SE",
    animationClass: "animate-fade-in-left",
    isLead: false
  },
  {
    name: "Samruddhi Kadam",
    role: "Commmunity Manager",
    bio: "Bridging the gap between pixel-perfect design and complex code.",
    initials: "SK",
    animationClass: "animate-fade-in-left",
    isLead: false
  },
  {
    name: "Prachi Shewale",
    role: "lead Designer",
    bio: "Analyzing metrics to optimize the platform's learning algorithms.",
    initials: "PS",
    animationClass: "animate-fade-in-right",
    isLead: false
  },
  {
    name: "Purva Patil",
    role: "Social Media MManager",
    bio: "Building the ecosystem that connects the top 1% of tech talent.",
    initials: "AP",
    animationClass: "animate-fade-in-right",
    isLead: false
  }
];

const row3Team = [
  {
    name: "Sushant Kadam",
    role: "Club Executive",
    bio: "Ensuring zero-trust architecture and airtight protocol compliance.",
    initials: "SK",
    animationClass: "animate-fade-in-left",
    isLead: false
  },
  {
    name: "Ved Sonar",
    role: "Club Executive",
    bio: "Integrating autonomous logic models into core developer workflows.",
    initials: "VS",
    animationClass: "animate-fade-in-left",
    isLead: false
  },
  {
    name: "Samruddhi Shelke",
    role: "Club Executive",
    bio: "Automating cloud pipelines for absolute zero downtime infrastructure.",
    initials: "SS",
    animationClass: "animate-fade-in-up",
    isLead: false
  },
  {
    name: "Aditya Punde",
    role: "Club Executive",
    bio: "Crafting the distinct narrative and visual identity of the elite ecosystem.",
    initials: "AP",
    animationClass: "animate-fade-in-right",
    isLead: false
  }
];

export function CreativeMinds() {
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

  const renderCard = (member: any, index: number, rowBaseDelay: number) => {
    const delayStyle = { animationDelay: `${rowBaseDelay + index * 150}ms` };

    // Dynamic width & padding configuration for top lead cards vs standard cards
    const cardWidthClass = member.isLead 
      ? "w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(44%-1.5rem)] p-10 lg:p-12" 
      : "w-full md:w-[calc(50%-1rem)] lg:w-[calc(23%-1rem)] p-8 lg:p-8";

    const photoMaxWidth = member.isLead ? "max-w-[180px]" : "max-w-[140px]";

    return (
      <div 
        key={index}
        style={isVisible ? delayStyle : undefined}
        className={`group relative flex flex-col items-center text-center rounded-[2rem] bg-black/20 backdrop-blur-md border border-white/5 shadow-xl transition-all duration-500 hover:bg-black/40 hover:border-white/10 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(134,56,205,0.2)] overflow-hidden ${cardWidthClass} ${
          isVisible ? `${member.animationClass} opacity-0 fill-mode-forwards` : 'opacity-0'
        }`}
      >
        {/* Ambient Hover Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[150px] bg-brand-gradient opacity-0 group-hover:opacity-30 blur-[50px] rounded-full transition-opacity duration-700 pointer-events-none"></div>
        
        {/* Top Inner Shadow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* 3:4 Aspect Ratio Photo Space (Slightly larger for top 2 cards) */}
        <div className={`relative w-full aspect-[3/4] ${photoMaxWidth} mb-6 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/10 group-hover:border-accent/50 transition-all duration-500 overflow-hidden`}>
          <span className={`font-heading font-bold text-transparent bg-silver-gradient bg-clip-text ${member.isLead ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>{member.initials}</span>
        </div>

        <h3 className={`font-heading font-bold text-foreground mb-1 ${member.isLead ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'}`}>{member.name}</h3>
        <p className={`font-medium tracking-wide text-accent mb-4 uppercase ${member.isLead ? 'text-sm lg:text-base' : 'text-xs lg:text-sm'}`}>{member.role}</p>
        <p className={`text-[#E2D1FE]/70 leading-relaxed mb-6 ${member.isLead ? 'text-base lg:text-lg' : 'text-sm lg:text-base'}`}>{member.bio}</p>

        {/* Socials - Strictly GitHub and LinkedIn Icons Only */}
        <div className="flex gap-4 mt-auto">
          {/* GitHub Icon */}
          <a href="#" className="text-[#E2D1FE]/50 hover:text-white transition-colors" aria-label="GitHub">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          {/* LinkedIn Icon */}
          <a href="#" className="text-[#E2D1FE]/50 hover:text-white transition-colors" aria-label="LinkedIn">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="relative z-10 w-full py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Left Aligned Section Header */}
        <div className="flex flex-col items-start text-left mb-16">
          <div className={`inline-flex items-center gap-3 mb-6 ${isVisible ? 'animate-fade-in-left opacity-0 fill-mode-forwards' : 'opacity-0'}`}>
            <span className="w-8 h-[2px] bg-brand-gradient rounded-full"></span>
            <span className="text-sm font-semibold tracking-widest text-[#E2D1FE] uppercase">The Visionaries</span>
          </div>
          <h2 className={`font-heading text-4xl md:text-5xl font-bold tracking-tight bg-silver-gradient bg-clip-text text-transparent pb-2 ${isVisible ? 'animate-wipe-reveal [animation-delay:200ms] opacity-0 fill-mode-forwards' : 'opacity-0'}`}>
            Creative Minds Behind GenXCode
          </h2>
        </div>

        {/* Pyramid Container */}
        <div className="flex flex-col gap-6">
          
          {/* ROW 1: 2 Cards (Larger Peak) */}
          <div className="flex flex-wrap justify-center gap-6">
            {row1Team.map((member, idx) => renderCard(member, idx, 300))}
          </div>

          {/* ROW 2: 4 Cards */}
          <div className="flex flex-wrap justify-center gap-6">
            {row2Team.map((member, idx) => renderCard(member, idx, 600))}
          </div>

          {/* ROW 3: 4 Cards */}
          <div className="flex flex-wrap justify-center gap-6">
            {row3Team.map((member, idx) => renderCard(member, idx, 900))}
          </div>

        </div>

      </div>
    </section>
  );
}
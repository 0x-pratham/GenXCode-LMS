"use client";

import { useEffect, useRef, useState } from "react";

// ---------------- TEAM DATA (Hierarchy: 2, 3, 3, 4) ---------------- //

const row1Team = [
  {
    name: "Prathamesh Bhil",
    role: "Founder & Mentor",
    bio: "Ex-Staff Engineer. Obsessed with high-performance systems and zero-latency UI.",
    initials: "PB",
    imageUrl: "/assets/Prathamesh1.png", 
    isLead: true,
    github: "https://github.com/0x-pratham", // Apna asali link daalo
    linkedin: "https://www.linkedin.com/in/prathamesh-bhil-52408638b/" // Apna asali link daalo
  },
  {
    name: "Rohit Yadav",
    role: "Club Director",
    bio: "Visionary designer turning complex developer workflows into frictionless experiences.",
    initials: "RY",
    imageUrl: "/assets/Rohit.png", 
    isLead: true,
    github: "https://github.com/Rohit30526",
    linkedin: "https://www.linkedin.com/in/rohit-yadav-90294332a/"
  }
];

const row2Team = [
  {
    name: "Shirin Ekatpure",
    role: "Event Manager",
    bio: "Master of backend infrastructure and scalable cloud deployments.",
    initials: "SE",
    imageUrl: "/assets/Shirin.png",
    isLead: false,
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/shirin-ekatpure-a53601285/"
  },
  {
    name: "Samruddhi Kadam",
    role: "Commmunity Manager",
    bio: "Bridging the gap between pixel-perfect design and complex code.",
    initials: "SK",
    imageUrl: "/assets/Samruddhik.png",
    isLead: false,
    github: "https://github.com/samukadam2409-oss",
    linkedin: "https://www.linkedin.com/in/samruddhi-kadam-6b8280323?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    name: "Prachi Shewale",
    role: "Lead Designer",
    bio: "Analyzing metrics to optimize the platform's learning algorithms.",
    initials: "PS",
    imageUrl: "/assets/Prachi.png",
    isLead: false,
    github: "https://github.com/prachishewale20",
    linkedin: "https://www.linkedin.com/in/prachi-shewale-41646240b/"
  }
];

const row3Team = [
  {
    name: "Srushti More",
    role: "Social Media Manager",
    bio: "Building the ecosystem that connects the top 1% of tech talent.",
    initials: "PP", 
    imageUrl: "/assets/Srushti.png",
    isLead: false,
    github: "https://github.com/SrushtiMore16",
    linkedin: "https://www.linkedin.com/in/srushti-more-4119782a4/"
  },
  {
    name: "Sushant Kadam",
    role: "Club Executive",
    bio: "Ensuring zero-trust architecture and airtight protocol compliance.",
    initials: "SK",
    imageUrl: "/assets/Sushant.png",
    isLead: false,
    github: "https://github.com/sush3006-dev",
    linkedin: "https://www.linkedin.com/in/sushant-kadam-26b831313"
  },
  {
    name: "Ved Sonar",
    role: "Club Executive",
    bio: "Integrating autonomous logic models into core developer workflows.",
    initials: "VS",
    imageUrl: "/assets/Ved.png",
    isLead: false,
    github: "https://github.com/veds-2246",
    linkedin: "https://www.linkedin.com/in/ved-sonar-144564329?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  }
];

const row4Team = [
  {
    name: "Samruddhi Shelke",
    role: "Club Executive",
    bio: "Automating cloud pipelines for absolute zero downtime infrastructure.",
    initials: "SS",
    imageUrl: "/assets/Samruddhis.png",
    isLead: false,
    github: "https://github.com/samruddhishelke62-glitch",
    linkedin: "https://www.linkedin.com/in/samruddhi-shelke-965915391?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    name: "Aditya Punde",
    role: "Club Executive",
    bio: "Crafting the distinct narrative and visual identity of the elite ecosystem.",
    initials: "AP",
    imageUrl: "/assets/Aditya.png",
    isLead: false,
    github: "https://github.com/adityasxh",
    linkedin: "https://www.linkedin.com/in/adityapunde/"
  },
  {
    name: "Purva Patil",
    role: "Club Executive",
    bio: "Driving strategic partnerships and expanding the developer community.",
    initials: "SM",
    imageUrl: "/assets/Purva.png",
    isLead: false,
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/"
  },
  {
    name: "Akshay Pillai",
    role: "Club Executive",
    bio: "Focused on open-source contributions and algorithmic efficiency.",
    initials: "AP",
    imageUrl: "/assets/Akshay.png",
    isLead: false,
    github: "uk-akshay/dev.co",
    linkedin: "https://www.linkedin.com/in/akshay-unnikrishnan-30a20738a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  }
];

export function CreativeMinds() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [row1Visible, setRow1Visible] = useState(false);
  const [row2Visible, setRow2Visible] = useState(false);
  const [row3Visible, setRow3Visible] = useState(false);
  const [row4Visible, setRow4Visible] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const row4Ref = useRef<HTMLDivElement>(null);

  // Separate smooth observers for header and each row to achieve smooth staggered cascading
  useEffect(() => {
    const createObserver = (setter: (val: boolean) => void) => {
      return new IntersectionObserver(
        ([entry]) => {
          setter(entry.isIntersecting);
        },
        { threshold: 0.15 }
      );
    };

    const headerObs = createObserver(setHeaderVisible);
    const row1Obs = createObserver(setRow1Visible);
    const row2Obs = createObserver(setRow2Visible);
    const row3Obs = createObserver(setRow3Visible);
    const row4Obs = createObserver(setRow4Visible);

    if (headerRef.current) headerObs.observe(headerRef.current);
    if (row1Ref.current) row1Obs.observe(row1Ref.current);
    if (row2Ref.current) row2Obs.observe(row2Ref.current);
    if (row3Ref.current) row3Obs.observe(row3Ref.current);
    if (row4Ref.current) row4Obs.observe(row4Ref.current);

    return () => {
      headerObs.disconnect();
      row1Obs.disconnect();
      row2Obs.disconnect();
      row3Obs.disconnect();
      row4Obs.disconnect();
    };
  }, []);

  const renderCard = (member: any, index: number, itemsPerRow: number, isRowVisible: boolean) => {
    let cardWidthClass = "";
    if (member.isLead) {
      cardWidthClass = "w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(44%-1.5rem)] p-10 lg:p-12";
    } else if (itemsPerRow === 3) {
      cardWidthClass = "w-full md:w-[calc(50%-1rem)] lg:w-[calc(31%-1rem)] p-8 lg:p-8";
    } else {
      cardWidthClass = "w-full md:w-[calc(50%-1rem)] lg:w-[calc(23%-1rem)] p-8 lg:p-8";
    }

    const photoMaxWidth = member.isLead ? "max-w-[260px] w-full" : "max-w-[190px] w-full";

    return (
      <div 
        key={index}
        className={`group relative flex flex-col items-center text-center rounded-[2rem] bg-black/20 backdrop-blur-md border border-white/5 shadow-xl transition-all duration-700 ease-out hover:bg-black/40 hover:border-white/10 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(134,56,205,0.2)] overflow-hidden ${cardWidthClass} ${
          isRowVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}
        style={{
          transitionDelay: `${index * 100}ms`
        }}
      >
        {/* Ambient Hover Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[150px] bg-brand-gradient opacity-0 group-hover:opacity-30 blur-[50px] rounded-full transition-opacity duration-700 pointer-events-none"></div>
        
        {/* Top Inner Shadow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* 3:4 Aspect Ratio Photo Space */}
        <div className={`relative aspect-[3/4] ${photoMaxWidth} mb-6 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/10 group-hover:border-accent/50 transition-all duration-500 overflow-hidden`}>
          {member.imageUrl ? (
            <img 
              src={member.imageUrl} 
              alt={member.name} 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 opacity-100"
              style={{
                imageRendering: "auto",
                backfaceVisibility: "hidden"
              }}
              loading="eager"
              decoding="async"
            />
          ) : (
            <span className={`font-heading font-bold text-transparent bg-silver-gradient bg-clip-text ${member.isLead ? 'text-4xl lg:text-5xl' : 'text-3xl'}`}>
              {member.initials}
            </span>
          )}
        </div>

        <h3 className={`font-heading font-bold text-transparent bg-silver-gradient bg-clip-text mb-1 ${member.isLead ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'}`}>{member.name}</h3>
        
        <p className={`font-medium tracking-wide text-accent mb-4 uppercase ${member.isLead ? 'text-sm lg:text-base' : 'text-xs lg:text-sm'}`}>{member.role}</p>
        <p className={`text-[#E2D1FE]/70 leading-relaxed mb-6 ${member.isLead ? 'text-base lg:text-lg' : 'text-sm lg:text-base'}`}>{member.bio}</p>

        {/* Socials - Updated with proper links and target="_blank" */}
        <div className="flex gap-4 mt-auto">
          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[#E2D1FE]/50 hover:text-white transition-colors relative z-10" aria-label={`${member.name} GitHub`}>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
          
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#E2D1FE]/50 hover:text-white transition-colors relative z-10" aria-label={`${member.name} LinkedIn`}>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="relative z-10 w-full py-20 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`flex flex-col items-start text-left mb-16 transition-all duration-1000 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-brand-gradient rounded-full"></span>
            <span className="text-sm font-semibold tracking-widest text-[#E2D1FE] uppercase">The Visionaries</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight bg-silver-gradient bg-clip-text text-transparent pb-2">
            Creative Minds Behind GenXCode
          </h2>
        </div>

        {/* Pyramid Container with Row-by-Row Staggered Scroll Animation */}
        <div className="flex flex-col gap-6">
          
          {/* ROW 1 */}
          <div ref={row1Ref} className="flex flex-wrap justify-center gap-6">
            {row1Team.map((member, idx) => renderCard(member, idx, 2, row1Visible))}
          </div>

          {/* ROW 2 */}
          <div ref={row2Ref} className="flex flex-wrap justify-center gap-6">
            {row2Team.map((member, idx) => renderCard(member, idx, 3, row2Visible))}
          </div>

          {/* ROW 3 */}
          <div ref={row3Ref} className="flex flex-wrap justify-center gap-6">
            {row3Team.map((member, idx) => renderCard(member, idx, 3, row3Visible))}
          </div>

          {/* ROW 4 */}
          <div ref={row4Ref} className="flex flex-wrap justify-center gap-6">
            {row4Team.map((member, idx) => renderCard(member, idx, 4, row4Visible))}
          </div>

        </div>

      </div>
    </section>
  );
}
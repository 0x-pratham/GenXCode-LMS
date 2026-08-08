import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, FileText, CheckCircle2, Lock, ArrowLeft, MonitorPlay } from "lucide-react";
import Link from "next/link";

// Mock Data representing the LMS Schema (Course -> Modules -> Lessons)
// Backend Logic / Data Remains Unchanged
const COURSE_DATA = {
  title: "Enterprise Next.js 16 Architecture",
  description: "Master the App Router, Server Actions, and Supabase integrations for scalable web apps.",
  progress: 15,
  modules: [
    {
      id: "m1",
      title: "Module 1: Foundation & Setup",
      lessons: [
        { id: "l1", title: "Introduction to Next.js 16", kind: "video", duration: "12 min", completed: true },
        { id: "l2", title: "Project Architecture & Folder Structure", kind: "article", duration: "8 min", completed: true },
        { id: "l3", title: "Setting up Tailwind v4", kind: "video", duration: "15 min", completed: false },
      ]
    },
    {
      id: "m2",
      title: "Module 2: Server Components & Actions",
      lessons: [
        { id: "l4", title: "Understanding RSCs", kind: "video", duration: "20 min", completed: false },
        { id: "l5", title: "Mutations with Server Actions", kind: "video", duration: "25 min", completed: false },
        { id: "l6", title: "Build a Custom Form Hook", kind: "assignment", duration: "45 min", completed: false },
      ]
    }
  ]
};

// Next.js 15+ dynamic params handling requires Promise awaiting if params are used
export default async function CourseDetailPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto relative z-10 pb-12">
      
      {/* Left Column: Player & Info (Animated) */}
      <div className="flex-1 space-y-8 animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards">
        
        {/* Back Navigation */}
        <Link href="/courses" className="inline-flex items-center text-sm font-medium text-[#E2D1FE]/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
        </Link>
        
        {/* Premium Cinematic Video Player Placeholder */}
        <div className="aspect-video w-full rounded-3xl border border-white/10 bg-black/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden relative group backdrop-blur-xl">
          {/* Subtle background glow for the player */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(134,56,205,0.15)_0%,_transparent_60%)]" />
          
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors cursor-pointer flex flex-col items-center justify-center z-10">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:bg-accent/20 group-hover:border-accent/40 transition-all duration-300 shadow-xl">
              <PlayCircle className="w-10 h-10 text-white opacity-90 group-hover:text-accent transition-colors" />
            </div>
          </div>
        </div>

        {/* Course Info Block */}
        <div className="space-y-4 bg-black/20 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent font-semibold px-3 py-1">
              Module 1
            </Badge>
            <span className="text-sm font-bold text-[#E2D1FE]">Setting up Tailwind v4</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">
            {COURSE_DATA.title}
          </h1>
          <p className="text-[#E2D1FE]/80 leading-relaxed text-lg">
            {COURSE_DATA.description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
            <Button variant="ghost" className="h-12 px-6 rounded-xl border border-white/10 text-foreground hover:bg-white/5 backdrop-blur-md transition-all">
              Previous Lesson
            </Button>
            <Button className="h-12 px-8 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg">
              Complete & Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Syllabus/Modules (Animated with delay) */}
      <div className="lg:w-[400px] xl:w-[450px] shrink-0 animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards">
        
        {/* Glass Sidebar Container */}
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl sticky top-24">
          <div className="flex items-center gap-2 mb-6">
            <MonitorPlay className="w-5 h-5 text-accent" />
            <h3 className="font-heading text-xl font-bold text-foreground drop-shadow-sm">Course Content</h3>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="mb-8 p-4 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
            <div className="flex justify-between text-xs font-bold mb-3">
              <span className="text-[#E2D1FE]/70">Overall Progress</span>
              <span className="text-accent">{COURSE_DATA.progress}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
              <div 
                className="h-full bg-brand-gradient transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(134,56,205,0.5)]" 
                style={{ width: `${COURSE_DATA.progress}%` }}
              />
            </div>
          </div>

          {/* Accordion Modules */}
          <Accordion type="multiple" defaultValue={["m1"]} className="w-full space-y-4">
            {COURSE_DATA.modules.map((module) => (
              <AccordionItem key={module.id} value={module.id} className="border-none bg-black/20 rounded-2xl overflow-hidden border border-white/5">
                <AccordionTrigger className="hover:no-underline hover:bg-white/[0.04] px-5 py-4 transition-colors text-foreground font-bold text-sm">
                  {module.title}
                </AccordionTrigger>
                
                <AccordionContent className="pt-2 pb-4 px-3">
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <div 
                        key={lesson.id} 
                        className={`flex items-center justify-between p-3.5 rounded-xl text-sm transition-all duration-300 cursor-pointer border ${
                          lesson.completed 
                            ? "bg-white/5 border-transparent text-[#E2D1FE]/50" 
                            : "bg-black/40 border-white/5 text-foreground hover:border-white/20 hover:bg-white/5 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {lesson.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400/70" />
                          ) : lesson.kind === 'video' ? (
                            <PlayCircle className="w-4 h-4 text-accent drop-shadow-sm" />
                          ) : (
                            <FileText className="w-4 h-4 text-accent drop-shadow-sm" />
                          )}
                          <span className={lesson.completed ? "line-through decoration-[#E2D1FE]/30" : "font-semibold"}>
                            {lesson.title}
                          </span>
                        </div>
                        <span className="text-xs font-medium opacity-60">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
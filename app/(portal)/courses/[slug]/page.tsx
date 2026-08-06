import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, FileText, CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock Data representing the LMS Schema (Course -> Modules -> Lessons)
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Player & Info */}
      <div className="flex-1 space-y-6">
        <Link href="/courses" className="inline-flex items-center text-sm font-medium text-foreground/70 hover:text-primary transition-colors mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </Link>
        
        {/* Video Player Placeholder */}
        <div className="aspect-video w-full rounded-xl border border-border bg-black flex items-center justify-center overflow-hidden relative group">
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors cursor-pointer flex items-center justify-center">
            <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="accent">Module 1</Badge>
            <span className="text-sm font-medium text-foreground/70">Setting up Tailwind v4</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary">{COURSE_DATA.title}</h1>
          <p className="text-foreground/80 mt-2 leading-relaxed">{COURSE_DATA.description}</p>
        </div>

        <div className="flex gap-4 pt-4 border-t border-border/50">
          <Button variant="outline">Previous Lesson</Button>
          <Button>Complete & Continue</Button>
        </div>
      </div>

      {/* Right Column: Syllabus/Modules */}
      <div className="lg:w-[400px] xl:w-[450px] shrink-0">
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm sticky top-24">
          <h3 className="font-heading text-lg font-bold text-primary mb-4">Course Content</h3>
          
          <div className="mb-6">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-foreground/70">Overall Progress</span>
              <span className="text-primary">{COURSE_DATA.progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500" 
                style={{ width: `${COURSE_DATA.progress}%` }}
              />
            </div>
          </div>

          <Accordion type="multiple" defaultValue={["m1"]} className="w-full">
            {COURSE_DATA.modules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="hover:no-underline hover:bg-surface/50 px-2 rounded-md transition-colors">
                  {module.title}
                </AccordionTrigger>
                <AccordionContent className="pt-2 px-2">
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => (
                      <div 
                        key={lesson.id} 
                        className={`flex items-center justify-between p-3 rounded-lg text-sm transition-colors cursor-pointer ${
                          lesson.completed ? "bg-surface text-foreground/70" : "hover:bg-surface text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {lesson.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : lesson.kind === 'video' ? (
                            <PlayCircle className="w-4 h-4 text-primary" />
                          ) : (
                            <FileText className="w-4 h-4 text-primary" />
                          )}
                          <span className={lesson.completed ? "line-through opacity-70" : "font-medium"}>
                            {lesson.title}
                          </span>
                        </div>
                        <span className="text-xs text-foreground/50">{lesson.duration}</span>
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
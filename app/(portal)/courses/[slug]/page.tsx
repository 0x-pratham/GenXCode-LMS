import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, FileText, CheckCircle2, Lock, ArrowLeft, MonitorPlay, ExternalLink } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Define strict types for our Supabase response
type Lesson = {
  id: string;
  title: string;
  position: number;
  kind: string;
  estimated_minutes: number;
  is_preview: boolean;
  completed?: boolean;
};

type Module = {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const { slug } = await params;
  
  // Safe Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch Course details along with Modules and Lessons
  // The RLS policy "members view accessible courses" ensures the user can only see this if they are allowed.
  const { data: course, error } = await supabase
    .from("courses")
    .select(`
      *,
      course_modules (
        id,
        title,
        position,
        lessons (
          id,
          title,
          position,
          kind,
          estimated_minutes,
          is_preview
        )
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Course Not Found or Access Denied</h2>
        <p className="text-[#E2D1FE]/60">The course you are looking for does not exist or is not available for your cohort.</p>
        <Button asChild className="bg-brand-gradient border-none font-bold accent-glow hover:brightness-110">
          <Link href="/courses">Return to Library</Link>
        </Button>
      </div>
    );
  }

  // Fetch user's completed lessons for this course to calculate progress
  // Since lesson_progress relies on lesson_id, we fetch all progress for this user
  const { data: progressData } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .not("completed_at", "is", null);

  const completedLessonIds = new Set(progressData?.map((p) => p.lesson_id) || []);

  // Process data to build the structure expected by the UI
  let totalLessons = 0;
  let completedCount = 0;

  // Sort modules by position
  const modules: Module[] = (course.course_modules || [])
    .sort((a: any, b: any) => a.position - b.position)
    .map((mod: any) => {
      // Sort lessons by position and check completion status
      const lessons = (mod.lessons || [])
        .sort((a: any, b: any) => a.position - b.position)
        .map((lesson: any) => {
          totalLessons++;
          const isCompleted = completedLessonIds.has(lesson.id);
          if (isCompleted) completedCount++;
          
          return {
            ...lesson,
            completed: isCompleted,
            duration: lesson.estimated_minutes ? `${lesson.estimated_minutes} min` : "Self-paced"
          };
        });

      return {
        id: mod.id,
        title: mod.title,
        position: mod.position,
        lessons
      };
    });

  // Calculate overall progress percentage safely
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  // Set default open modules for accordion (first module if it exists)
  const defaultOpenModules = modules.length > 0 ? [modules[0].id] : [];

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
          {course.cover_url ? (
            <img src={course.cover_url} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(134,56,205,0.15)_0%,_transparent_60%)]" />
          )}
          
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors cursor-pointer flex flex-col items-center justify-center z-10">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:bg-accent/20 group-hover:border-accent/40 transition-all duration-300 shadow-xl">
              <PlayCircle className="w-10 h-10 text-white opacity-90 group-hover:text-accent transition-colors" />
            </div>
            {totalLessons === 0 && (
              <span className="mt-4 text-xs font-bold uppercase tracking-wider text-[#E2D1FE]/60 bg-black/60 px-3 py-1 rounded-md">Course Content Pending</span>
            )}
          </div>
        </div>

        {/* Course Info Block */}
        <div className="space-y-4 bg-black/20 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`font-semibold px-3 py-1 capitalize ${
              course.status === 'published' ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-white/5 border-white/10 text-[#E2D1FE]/60'
            }`}>
              {course.status === 'published' ? 'Active Course' : course.status}
            </Badge>
            {modules.length > 0 && <span className="text-sm font-bold text-[#E2D1FE]">{modules.length} Modules</span>}
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">
            {course.title}
          </h1>
          <p className="text-[#E2D1FE]/80 leading-relaxed text-lg">
            {course.description || "No description provided for this course."}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
            <Button variant="ghost" className="h-12 px-6 rounded-xl border border-white/10 text-foreground hover:bg-white/5 backdrop-blur-md transition-all">
              Previous Lesson
            </Button>
            <Button className="h-12 px-8 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg disabled:opacity-50">
              {progressPercentage === 100 ? "Review Course" : progressPercentage > 0 ? "Resume Course" : "Start Course"}
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
              <span className="text-accent">{progressPercentage}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
              <div 
                className="h-full bg-brand-gradient transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(134,56,205,0.5)]" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Accordion Modules */}
          {modules.length > 0 ? (
            <Accordion type="multiple" defaultValue={defaultOpenModules} className="w-full space-y-4">
              {modules.map((module) => (
                <AccordionItem key={module.id} value={module.id} className="border-none bg-black/20 rounded-2xl overflow-hidden border border-white/5">
                  <AccordionTrigger className="hover:no-underline hover:bg-white/[0.04] px-5 py-4 transition-colors text-foreground font-bold text-sm">
                    {module.title}
                  </AccordionTrigger>
                  
                  <AccordionContent className="pt-2 pb-4 px-3">
                    <div className="space-y-2">
                      {module.lessons.length > 0 ? (
                        module.lessons.map((lesson) => (
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
                                <CheckCircle2 className="w-4 h-4 text-emerald-400/70 shrink-0" />
                              ) : lesson.kind === 'video' ? (
                                <PlayCircle className="w-4 h-4 text-accent drop-shadow-sm shrink-0" />
                              ) : lesson.kind === 'assignment' ? (
                                <ExternalLink className="w-4 h-4 text-accent drop-shadow-sm shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-accent drop-shadow-sm shrink-0" />
                              )}
                              <span className={`line-clamp-2 ${lesson.completed ? "line-through decoration-[#E2D1FE]/30" : "font-semibold"}`}>
                                {lesson.title}
                              </span>
                            </div>
                            <span className="text-xs font-medium opacity-60 whitespace-nowrap ml-3">{lesson.duration}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-xs font-medium text-[#E2D1FE]/40">
                          No lessons added to this module yet.
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <p className="text-sm font-medium text-[#E2D1FE]/50">Course content is currently being built.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
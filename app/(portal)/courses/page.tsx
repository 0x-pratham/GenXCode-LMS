import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Suspense } from "react";

// Optimized Data Fetcher for Backend Speed
async function getCourseLibrary() {
  const supabase = await createClient();
  
  // FIX: Removed .eq("status", "published") because your RLS policy 
  // "private.can_access_course" automatically handles this!
  // Now, Students will only see 'published' courses for their cohort, 
  // while Admins/Mentors can see 'draft' courses too.
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error.message);
  }
  
  return courses || [];
}

export default async function CoursesPage() {
  const supabase = await createClient();
  
  // 1. Safe Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<CourseLibrarySkeleton />}>
      <CourseLibraryContent />
    </Suspense>
  );
}

// Separated Component to handle Async Data & Suspense boundary smoothly
async function CourseLibraryContent() {
  const courses = await getCourseLibrary();

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10 focus:outline-none" tabIndex={0}>
      
      {/* Page Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg">
            Course <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Library</span>
          </h1>
          <p className="text-[#E2D1FE]/80 text-sm sm:text-base font-medium drop-shadow-md max-w-xl">
            Master new skills and earn XP to climb the leaderboard.
          </p>
        </div>
        
        {/* Dynamic Counter Glass Pill */}
        <div className="flex items-center gap-2 text-sm font-bold text-foreground bg-black/40 px-5 py-2.5 rounded-xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <BookOpen className="w-4 h-4 text-accent" />
          <span>{courses.length} Available</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.length > 0 ? (
          courses.map((course, index) => {
            // Calculate staggered animation delay for each card
            const animationDelay = `${(index + 2) * 150}ms`;
            const isPublished = course.status === 'published';

            return (
              <Card 
                key={course.id} 
                className="animate-fade-in-up opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)] rounded-2xl group"
                style={{ animationDelay }} // Dynamic inline style for Tailwind JIT compatibility
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge 
                      variant="outline" 
                      className={`capitalize text-xs font-semibold px-3 py-1 border ${
                        isPublished 
                          ? 'border-accent/30 text-accent bg-accent/10' 
                          : 'border-white/10 text-[#E2D1FE]/60 bg-white/5'
                      }`}
                    >
                      {isPublished ? 'Active' : course.status}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2 text-xl font-bold text-foreground drop-shadow-sm transition-colors group-hover:text-accent">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2 text-[#E2D1FE]/70 leading-relaxed text-sm">
                    {course.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 pb-4">
                  {/* Fallback image block styled as glass */}
                  <div className="w-full h-40 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden relative shadow-inner">
                    {course.cover_url ? (
                      <>
                        <img src={course.cover_url} alt={course.title} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center opacity-50 transition-opacity duration-300 group-hover:opacity-80">
                        <BookOpen className="w-10 h-10 text-[#E2D1FE]/50 mb-2" />
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Link href={`/courses/${course.slug || course.id}`} className="w-full outline-none">
                    <Button 
                      tabIndex={0}
                      className={`w-full h-11 rounded-xl font-bold transition-all shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        isPublished 
                          ? "bg-brand-gradient text-foreground border-none accent-glow accent-glow-hover hover:brightness-110 hover:-translate-y-[1px]"
                          : "bg-white/5 text-[#E2D1FE]/50 border-white/10 cursor-pointer hover:bg-white/10"
                      }`}
                    >
                      {!isPublished ? (
                        <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> View Draft</span>
                      ) : (
                        <span className="flex items-center gap-2">View Course <ArrowRight className="w-4 h-4" /></span>
                      )}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards col-span-full py-16 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
            <BookOpen className="w-12 h-12 text-[#E2D1FE]/30 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-foreground">No Courses Yet</h3>
            <p className="text-[#E2D1FE]/60 text-sm mt-2 max-w-sm mx-auto">Admin hasn't published any courses for your cohort. Check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Shimmering Lazy Loading Skeleton for Instant User Feedback
function CourseLibrarySkeleton() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-white/10 rounded-lg"></div>
          <div className="h-4 w-96 bg-white/5 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-white/10 rounded-xl"></div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-black/20 border border-white/10 rounded-2xl h-[380px] flex flex-col p-6">
            <div className="h-6 w-16 bg-white/10 rounded mb-4"></div>
            <div className="h-6 w-3/4 bg-white/10 rounded mb-2"></div>
            <div className="h-4 w-full bg-white/5 rounded mb-6"></div>
            <div className="flex-1 bg-white/5 rounded-xl mb-4"></div>
            <div className="h-11 w-full bg-white/10 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy } from "lucide-react";

export default async function CoursesPage() {
  const supabase = await createClient();
  
  // Fetch real courses from Supabase (Only published ones, or all if you want to see drafts too)
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Course Library</h1>
          <p className="text-foreground/70 mt-1">Master new skills and earn XP to climb the leaderboard.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium bg-surface px-4 py-2 rounded-lg border border-border">
          <BookOpen className="w-4 h-4 text-primary" />
          <span>{courses?.length || 0} Available</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={course.status === 'published' ? 'accent' : 'secondary'} className="capitalize">
                    {course.status === 'published' ? 'Active' : course.status}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {course.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                {/* Fallback image block if cover_url is missing */}
                <div className="w-full h-32 bg-surface rounded-md border border-border/50 flex items-center justify-center mb-4 overflow-hidden relative">
                  {course.cover_url ? (
                    <img src={course.cover_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-8 h-8 text-primary/20" />
                  )}
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/courses/${course.slug}`} className="w-full">
                  <Button 
                    className="w-full" 
                    variant={course.status === 'published' ? "default" : "outline"}
                    disabled={course.status !== 'published'}
                  >
                    {course.status !== 'published' ? 'Not Available' : 'View Course'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl bg-surface/30">
            <BookOpen className="w-12 h-12 text-primary/30 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-primary">No Courses Yet</h3>
            <p className="text-foreground/60 text-sm mt-1">Admin hasn't published any courses for your cohort.</p>
          </div>
        )}
      </div>
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Image as ImageIcon } from "lucide-react";
import { createCourse } from "@/app/actions/adminActions";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  
  // Backend Logic Remains Unchanged
  // Fetch existing courses
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <BookOpen className="w-7 h-7 text-accent" />
            </div>
            <div>
              Manage <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Courses</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Add new learning modules, draft curriculum, and publish them for students.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Create Course Form - Deep Glass Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards lg:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Create New Course</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Setup a new module for the cohort.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={createCourse} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-foreground font-bold ml-1">Course Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g., Advanced React Patterns" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="description" className="text-foreground font-bold ml-1">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="What will students learn?" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[100px] backdrop-blur-sm resize-none"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="coverUrl" className="text-foreground font-bold ml-1">Cover Image URL (Optional)</Label>
                <Input 
                  id="coverUrl" 
                  name="coverUrl" 
                  placeholder="https://..." 
                  type="url" 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status" className="text-foreground font-bold ml-1">Visibility Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  className="flex h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none"
                >
                  <option value="published" className="bg-[#1a0b2e] text-white">Published (Live)</option>
                  <option value="draft" className="bg-[#1a0b2e] text-white">Draft (Hidden)</option>
                </select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" /> Create Course
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Courses Table - 99% Transparent */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards lg:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Course Library</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Table>
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Course</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Slug</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses && courses.length > 0 ? (
                  courses.map((course, index) => {
                    const animationDelay = `${(index + 4) * 100}ms`;
                    const isPublished = course.status === 'published';

                    return (
                      <TableRow 
                        key={course.id} 
                        style={{ animationDelay }}
                        className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="pl-8 py-4 font-bold text-foreground drop-shadow-sm flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            {course.cover_url ? (
                              <ImageIcon className="w-4 h-4 text-accent" />
                            ) : (
                              <BookOpen className="w-4 h-4 text-[#E2D1FE]/50" />
                            )}
                          </div>
                          {course.title}
                        </TableCell>
                        <TableCell className="py-4 text-xs font-medium text-[#E2D1FE]/60">
                          {course.slug}
                        </TableCell>
                        <TableCell className="py-4 text-right pr-8">
                          <Badge 
                            variant="outline" 
                            className={`capitalize px-3 py-1 font-bold backdrop-blur-md border ${
                              isPublished 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                : 'bg-white/5 text-[#E2D1FE]/60 border-white/10'
                            }`}
                          >
                            {course.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-none hover:bg-transparent">
                    <TableCell colSpan={3} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                      No courses found. Create your first module!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
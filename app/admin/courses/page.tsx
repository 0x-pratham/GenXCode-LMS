import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Image as ImageIcon, ExternalLink } from "lucide-react";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  
  // 1. Safe Auth & Strict Admin Role Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || (adminProfile.role !== "admin" && adminProfile.role !== "super_admin")) {
    redirect("/dashboard");
  }
  
  // 2. Fetch existing courses
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  // 3. Server Action for Creating a Course
  async function createCourse(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) return;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const coverUrl = formData.get("coverUrl") as string;
    const status = formData.get("status") as "draft" | "published";
    
    // Auto-generate a clean URL-friendly slug and append random digits to prevent unique constraint crashes
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

    const { error: insertError } = await supabaseServer
      .from("courses")
      .insert([
        {
          title: title,
          slug: slug,
          description: description,
          cover_url: coverUrl || null,
          status: status,
          created_by: currentUser.id
        }
      ]);

    if (insertError) {
      console.error("Failed to create course:", insertError.message);
      return;
    }

    revalidatePath(`/admin/courses`);
  }

  // 4. Server Action for Toggling Course Status (Publish <-> Draft)
  async function toggleCourseStatus(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const courseId = formData.get("courseId") as string;
    const currentStatus = formData.get("currentStatus") as string;
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const { error } = await supabaseServer
      .from("courses")
      .update({ status: newStatus })
      .eq("id", courseId);

    if (error) {
      console.error("Failed to update status:", error.message);
      return;
    }

    revalidatePath(`/admin/courses`);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10 px-4 sm:px-6">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
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
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards lg:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
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
                <div className="relative">
                  <select 
                    id="status" 
                    name="status" 
                    defaultValue="draft"
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="published" className="bg-gray-900 text-emerald-400">Published (Live)</option>
                    <option value="draft" className="bg-gray-900 text-[#E2D1FE]">Draft (Hidden)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" /> Publish Course
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Courses Table - 99% Transparent */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards lg:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Course Library</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Course</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Course URL</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Status (Click to toggle)</TableHead>
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
                        <TableCell className="pl-8 py-4 font-bold text-foreground drop-shadow-sm flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                            {course.cover_url ? (
                              <img src={course.cover_url} alt={course.title} className="w-full h-full object-cover opacity-80" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-[#E2D1FE]/50" />
                            )}
                          </div>
                          <span className="truncate max-w-[200px]">{course.title}</span>
                        </TableCell>
                        <TableCell className="py-4 text-sm font-medium">
                          {isPublished ? (
                            <Link 
                              href={`/courses/${course.slug}`}
                              target="_blank"
                              className="text-accent hover:text-white transition-colors flex items-center gap-1.5 w-fit"
                            >
                              /courses/{course.slug} <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          ) : (
                            <span className="text-[#E2D1FE]/40 flex items-center gap-1.5">
                              /courses/{course.slug} <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-right pr-8">
                          {/* Toggle Form mapped directly to the Badge */}
                          <form action={toggleCourseStatus} className="inline-block">
                            <input type="hidden" name="courseId" value={course.id} />
                            <input type="hidden" name="currentStatus" value={course.status} />
                            <button type="submit" className="transition-transform hover:scale-105 active:scale-95" title="Click to toggle status">
                              <Badge 
                                variant="outline" 
                                className={`capitalize px-3 py-1 font-bold backdrop-blur-md border cursor-pointer ${
                                  isPublished 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                    : 'bg-white/5 text-[#E2D1FE]/60 border-white/10'
                                }`}
                              >
                                {course.status}
                              </Badge>
                            </button>
                          </form>
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
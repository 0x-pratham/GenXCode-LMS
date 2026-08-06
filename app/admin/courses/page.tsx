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
  
  // Fetch existing courses
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent" />
            Manage Courses
          </h1>
          <p className="text-foreground/70 mt-1">Add new learning modules and publish them for students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Course Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Setup a new module for the cohort.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCourse} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input id="title" name="title" placeholder="e.g., Advanced React Patterns" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="What will students learn?" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverUrl">Cover Image URL (Optional)</Label>
                <Input id="coverUrl" name="coverUrl" placeholder="https://..." type="url" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Visibility Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <Button type="submit" className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" /> Create Course
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Courses Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Library</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses && courses.length > 0 ? (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium text-primary flex items-center gap-2">
                        {course.cover_url ? <ImageIcon className="w-4 h-4 text-accent" /> : <BookOpen className="w-4 h-4 text-foreground/50" />}
                        {course.title}
                      </TableCell>
                      <TableCell className="text-foreground/60 text-xs">{course.slug}</TableCell>
                      <TableCell>
                        <Badge className={course.status === 'published' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'}>
                          {course.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-foreground/50">
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
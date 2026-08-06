import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Calendar } from "lucide-react";
import { createAnnouncement } from "@/app/actions/announcementActions";

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();

  // Fetch all announcements from Supabase
  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error.message);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-accent" />
          Announcements & Broadcasts
        </h1>
        <p className="text-foreground/70 mt-1">Post updates, community news, and alerts for all students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Announcement Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Post Announcement</CardTitle>
            <CardDescription>Broadcast a message to the entire platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createAnnouncement} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="e.g., Weekend Hackathon Live!" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message Body</Label>
                <Textarea id="body" name="body" placeholder="Write your announcement details here..." rows={4} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <Button type="submit" className="w-full mt-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" /> Broadcast Now
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Announcements Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Broadcast History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title & Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements && announcements.length > 0 ? (
                  announcements.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="space-y-1">
                        <div className="font-medium text-primary text-base">{item.title}</div>
                        <div className="text-xs text-foreground/60 line-clamp-2">{item.body}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={item.status === 'published' ? 'bg-green-500' : 'bg-gray-500'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-foreground/50">
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-foreground/50">
                      No announcements broadcasted yet.
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
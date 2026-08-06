import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Video, Plus, Calendar, Link as LinkIcon } from "lucide-react";
import { createLiveSession } from "@/app/actions/adminActions";

export default async function AdminLiveSessionsPage() {
  const supabase = await createClient();
  
  // Fetch existing sessions
  const { data: sessions, error } = await supabase
    .from("live_sessions")
    .select("*")
    .order("starts_at", { ascending: false });

  if (error) {
    console.error("Error fetching live sessions:", error.message);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <Video className="w-8 h-8 text-accent" />
            Schedule Masterclasses
          </h1>
          <p className="text-foreground/70 mt-1">Host live sessions via Zoom or Google Meet.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Session Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Schedule New Session</CardTitle>
            <CardDescription>Notify students about an upcoming live class.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createLiveSession} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Topic / Title</Label>
                <Input id="title" name="title" placeholder="e.g., Intro to Supabase Auth" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Agenda (Description)</Label>
                <Textarea id="description" name="description" placeholder="What will be covered?" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Platform</Label>
                  <select 
                    id="provider" 
                    name="provider" 
                    className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="zoom">Zoom</option>
                    <option value="google_meet">Google Meet</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Input id="duration" name="duration" type="number" defaultValue="60" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startsAt">Start Date & Time</Label>
                <Input id="startsAt" name="startsAt" type="datetime-local" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingUrl">Meeting Link (URL)</Label>
                <Input id="meetingUrl" name="meetingUrl" type="url" placeholder="https://zoom.us/j/..." required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Visibility</Label>
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
                <Plus className="w-4 h-4 mr-2" /> Schedule Session
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Sessions Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions && sessions.length > 0 ? (
                  sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium text-primary">
                        {session.title}
                        <a href={session.meeting_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent mt-1 hover:underline">
                          <LinkIcon className="w-3 h-3" /> Join Link
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase text-xs">
                          {session.provider.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-foreground/70">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(session.starts_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={session.status === 'published' ? 'bg-green-500' : 'bg-gray-500'}>
                          {session.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-foreground/50">
                      No live sessions found. Schedule your first class!
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
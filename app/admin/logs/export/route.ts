// app/admin/logs/export/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // Validate Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || (adminProfile.role !== "admin" && adminProfile.role !== "super_admin")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Fetch all logs for export
  const { data: auditLogs, error } = await supabase
    .from("audit_logs")
    .select(`
      created_at,
      action,
      target_id,
      status,
      actor:profiles ( full_name, email )
    `)
    .order("created_at", { ascending: false });

  if (error || !auditLogs) {
    return new NextResponse("Failed to fetch logs", { status: 500 });
  }

  // Format as CSV
  const headers = ["Timestamp", "Actor", "Action", "Target ID", "Status"];
  const rows = auditLogs.map(log => {
    const actorData = Array.isArray(log.actor) ? log.actor[0] : log.actor;
    const actorDisplay = actorData?.email || actorData?.full_name || "System";
    return [
      new Date(log.created_at).toISOString(),
      `"${actorDisplay}"`,
      log.action,
      `"${log.target_id || ''}"`,
      log.status
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="genxcode_logs_${new Date().getTime()}.csv"`,
    },
  });
}
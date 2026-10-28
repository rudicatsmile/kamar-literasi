import { createAdminClient } from "@/lib/supabase/admin";
import { AdminBroadcastClient } from "./broadcast-client";
import { dummyBroadcasts, Broadcast } from "@/lib/dummy-data";

export default async function AdminBroadcastPage() {
  let broadcasts: Broadcast[] = dummyBroadcasts;
  let activeSubscribersCount = 0;

  try {
    const supabase = createAdminClient();

    // 1. Fetch count of active subscribers
    const { count, error: countError } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (!countError && count !== null) {
      activeSubscribersCount = count;
    }

    // 2. Fetch broadcast history
    const { data: bcData, error: bcError } = await supabase
      .from("broadcasts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!bcError && bcData && bcData.length > 0) {
      broadcasts = bcData.map((b: any) => ({
        id: b.id,
        title: b.title,
        message: b.message,
        created_by_name: "Admin Redaksi",
        sent_at: b.sent_at || undefined,
        total_recipients: b.total_recipients || 0,
        status: b.status || "sent",
        created_at: b.created_at,
      }));
    }
  } catch {
    broadcasts = dummyBroadcasts;
  }

  return (
    <AdminBroadcastClient
      initialBroadcasts={broadcasts}
      activeSubscribersCount={activeSubscribersCount}
    />
  );
}

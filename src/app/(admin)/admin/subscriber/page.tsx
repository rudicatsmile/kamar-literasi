import { createAdminClient } from "@/lib/supabase/admin";
import { AdminSubscriberClient } from "./subscriber-client";
import { Subscriber } from "@/lib/dummy-data";

export default async function AdminSubscriberPage() {
  let subscribers: Subscriber[] = [];

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      subscribers = data.map((s: any) => ({
        id: s.id,
        whatsapp: s.whatsapp,
        name: s.name || undefined,
        email: s.email || undefined,
        status: s.status,
        confirmed_at: s.confirmed_at || undefined,
        confirm_token: s.confirm_token || undefined,
        created_at: s.created_at,
      }));
    }
  } catch (e) {
    console.error("Gagal mengambil data subscriber:", e);
    subscribers = [];
  }

  return <AdminSubscriberClient initialSubscribers={subscribers} />;
}

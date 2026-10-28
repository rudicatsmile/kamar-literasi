import { createAdminClient } from "@/lib/supabase/admin";
import { AdminSubscriberClient } from "./subscriber-client";
import { dummySubscribers, Subscriber } from "@/lib/dummy-data";

export default async function AdminSubscriberPage() {
  let subscribers: Subscriber[] = dummySubscribers;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
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
  } catch {
    subscribers = dummySubscribers;
  }

  return <AdminSubscriberClient initialSubscribers={subscribers} />;
}

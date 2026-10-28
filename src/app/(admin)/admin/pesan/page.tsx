import { createAdminClient } from "@/lib/supabase/admin";
import { AdminPesanClient } from "./pesan-client";
import { dummyContactMessages, ContactMessage } from "@/lib/dummy-data";

export default async function AdminPesanPage() {
  let messages: ContactMessage[] = dummyContactMessages;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      messages = data.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject || "Pertanyaan",
        message: m.message,
        is_read: m.is_read ?? false,
        created_at: m.created_at,
      }));
    }
  } catch {
    messages = dummyContactMessages;
  }

  return <AdminPesanClient initialMessages={messages} />;
}

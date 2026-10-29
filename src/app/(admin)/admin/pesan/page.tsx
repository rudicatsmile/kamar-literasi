import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminPesanClient } from "./pesan-client";
import { ContactMessage } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Pesan Kontak | Panel Admin",
  description: "Manajemen pesan dan aspirasi kontak masuk dari pengunjung Rumah Literasi.",
};

export default async function AdminPesanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verifikasi role admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  let messages: ContactMessage[] = [];

  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      messages = data.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject || "Pertanyaan Umum",
        message: m.message,
        is_read: m.is_read ?? false,
        created_at: m.created_at,
      }));
    }
  } catch (err) {
    console.error("Gagal mengambil data pesan kontak:", err);
    messages = [];
  }

  return <AdminPesanClient initialMessages={messages} />;
}

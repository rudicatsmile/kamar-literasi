"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const ContactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  email: z.string().email("Format email tidak valid."),
  subject: z.string().optional(),
  message: z.string().min(5, "Pesan minimal 5 karakter."),
  hpCheck: z.string().optional(), // Honeypot field
});

export async function submitContactMessageAction(data: z.infer<typeof ContactSchema>) {
  // Honeypot check: If hpCheck is filled, silently discard or return fake success
  if (data.hpCheck) {
    return { success: true };
  }

  // Rate limiting: Maksimal 3 pesan per jam (Bab 6.G PRD)
  const rateLimitCheck = checkRateLimit(`contact-${data.email.toLowerCase()}`, {
    limit: 3,
    windowMs: 3600000, // 1 hour
  });

  if (!rateLimitCheck.allowed) {
    return {
      success: false,
      error: `Terlalu banyak pengiriman pesan. Silakan coba kembali dalam ${rateLimitCheck.retryAfterSeconds} detik.`,
    };
  }

  const validation = ContactSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data pesan tidak valid.",
    };
  }

  const { name, email, subject, message } = validation.data;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject: subject || "Pertanyaan Umum",
      message,
      is_read: false,
    });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/pesan");
  return { success: true };
}

export async function markContactMessageReadAction(id: string, isRead: boolean) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  }

  revalidatePath("/admin/pesan");
  return { success: true };
}

export async function deleteContactMessageAction(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/pesan");
  return { success: true };
}

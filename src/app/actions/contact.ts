"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { isValidUUID } from "@/lib/utils";

// Helper: Ensure caller is authenticated with admin role
async function verifyAdminCaller() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAuthorized: false, error: "Silakan login terlebih dahulu." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return {
      isAuthorized: false,
      error: "Akses ditolak. Fitur ini hanya dapat diakses oleh Administrator.",
    };
  }

  return { isAuthorized: true, error: null };
}

const ContactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  email: z.string().email("Format email tidak valid."),
  subject: z.string().optional(),
  message: z.string().min(5, "Pesan minimal 5 karakter."),
  hpCheck: z.string().optional(), // Honeypot field
});

export async function submitContactMessageAction(
  data: z.infer<typeof ContactSchema>
) {
  // Honeypot check: If hpCheck is filled, silently discard or return fake success
  if (data.hpCheck) {
    return { success: true };
  }

  // Rate limiting: Maksimal 3 pesan per jam per email
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
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("contact_messages").insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject?.trim() || "Pertanyaan Umum",
    message: message.trim(),
    is_read: false,
  });

  if (error) {
    console.error("Gagal menyimpan pesan kontak ke Supabase:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/pesan");
  revalidatePath("/admin");
  return { success: true };
}

export async function markContactMessageReadAction(
  id: string,
  isRead: boolean
) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!isValidUUID(id)) {
    revalidatePath("/admin/pesan");
    return { success: true };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("contact_messages")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/pesan");
  revalidatePath("/admin");
  return { success: true };
}

export async function toggleContactMessageReadAction(
  id: string,
  currentStatus: boolean
) {
  return markContactMessageReadAction(id, !currentStatus);
}

export async function deleteContactMessageAction(id: string) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!id) return { success: false, error: "ID pesan tidak valid." };

  if (!isValidUUID(id)) {
    revalidatePath("/admin/pesan");
    return { success: true };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/pesan");
  revalidatePath("/admin");
  return { success: true };
}

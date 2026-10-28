"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { dummySubscribers } from "@/lib/dummy-data";

const BroadcastSchema = z.object({
  title: z.string().min(3, "Judul kampanye broadcast minimal 3 karakter."),
  message: z.string().min(10, "Isi pesan broadcast minimal 10 karakter."),
});

export async function sendBroadcastAction(title: string, message: string) {
  const validation = BroadcastSchema.safeParse({ title, message });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data broadcast tidak valid.",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  let totalSent = 0;
  const footerNote = "\n\n_Balas STOP untuk berhenti berlangganan_";
  const finalMessage = message.includes("STOP") ? message : message + footerNote;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const adminClient = createAdminClient();

      // Get current user id
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 1. Fetch all active subscribers
      const { data: activeSubs, error: subsError } = await adminClient
        .from("subscribers")
        .select("id, whatsapp, name")
        .eq("status", "active");

      if (subsError) return { success: false, error: subsError.message };

      const recipients = activeSubs || [];
      totalSent = recipients.length;

      // 2. Insert broadcast record
      const { data: newBc, error: bcError } = await adminClient
        .from("broadcasts")
        .insert({
          title: title.trim(),
          message: finalMessage,
          created_by: user?.id || null,
          total_recipients: totalSent,
          sent_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (bcError) return { success: false, error: bcError.message };

      // 3. Dispatch to all active recipients
      for (const sub of recipients) {
        await sendWhatsAppMessage({
          to: sub.whatsapp,
          message: finalMessage,
          kind: "broadcast",
          broadcastId: newBc.id,
        });
      }
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  } else {
    // Fallback in preview / dev mode: simulate sending to active dummy subscribers
    const activeDummy = dummySubscribers.filter((s) => s.status === "active");
    totalSent = activeDummy.length;

    for (const sub of activeDummy) {
      await sendWhatsAppMessage({
        to: sub.whatsapp,
        message: finalMessage,
        kind: "broadcast",
      });
    }
  }

  revalidatePath("/admin/broadcast");
  return {
    success: true,
    totalRecipients: totalSent,
    message: `Siaran WhatsApp berhasil dikirim ke ${totalSent} nomor subscriber aktif.`,
  };
}

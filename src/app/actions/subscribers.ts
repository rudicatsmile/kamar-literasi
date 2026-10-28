"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  normalizeWhatsAppNumber,
  sendDoubleOptInConfirmation,
} from "@/lib/whatsapp";
import { checkRateLimit } from "@/lib/rate-limit";

export async function subscribeNewsletterAction(
  rawPhone: string,
  name?: string,
  email?: string
) {
  const phone = normalizeWhatsAppNumber(rawPhone);

  const rateLimit = checkRateLimit(`subs-${phone}`, {
    limit: 5,
    windowMs: 60000, // 1 minute
  });

  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Terlalu banyak permintaan pendaftaran. Mohon tunggu ${rateLimit.retryAfterSeconds} detik.`,
    };
  }

  if (phone.length < 10 || phone.length > 15 || !phone.startsWith("62")) {
    return {
      success: false,
      error: "Nomor WhatsApp tidak valid. Gunakan format Indonesia diawali 08 atau +62.",
    };
  }

  const confirmToken = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    try {
      const adminClient = createAdminClient();
      const { error } = await adminClient.from("subscribers").upsert(
        {
          whatsapp: phone,
          name: name || null,
          email: email || null,
          status: "pending",
          confirm_token: confirmToken,
        },
        { onConflict: "whatsapp" }
      );

      if (error) return { success: false, error: error.message };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // Trigger double opt-in confirmation message via WhatsApp Gateway
  await sendDoubleOptInConfirmation(phone, confirmToken, name);

  revalidatePath("/admin/subscriber");
  return {
    success: true,
    normalizedPhone: phone,
    confirmToken,
    message: "Tautan konfirmasi telah dikirimkan ke WhatsApp Anda.",
  };
}

export async function confirmSubscriptionAction(token: string) {
  if (!token || token.trim().length < 4) {
    return { success: false, error: "Token verifikasi tidak valid atau kedaluwarsa." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from("subscribers")
        .update({
          status: "active",
          confirmed_at: new Date().toISOString(),
        })
        .eq("confirm_token", token)
        .select("whatsapp, name")
        .single();

      if (error || !data) {
        return {
          success: false,
          error: "Tautan konfirmasi tidak ditemukan atau telah digunakan sebelumnya.",
        };
      }

      revalidatePath("/admin/subscriber");
      return { success: true, subscriber: data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // Simulated fallback success for development / preview
  return {
    success: true,
    subscriber: { whatsapp: "6281234567890", name: "Sahabat Literasi" },
  };
}

export async function unsubscribeAction(identifier: string) {
  if (!identifier) {
    return { success: false, error: "Parameter berhenti langganan tidak valid." };
  }

  const cleanedPhone = normalizeWhatsAppNumber(identifier);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    try {
      const adminClient = createAdminClient();
      // Match by whatsapp or confirm_token
      await adminClient
        .from("subscribers")
        .update({ status: "unsubscribed" })
        .or(`whatsapp.eq.${cleanedPhone},confirm_token.eq.${identifier}`);

      revalidatePath("/admin/subscriber");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  return { success: true };
}

export async function deleteSubscriberAction(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const adminClient = createAdminClient();
    const { error } = await adminClient.from("subscribers").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/subscriber");
  return { success: true };
}

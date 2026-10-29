import { createAdminClient } from "@/lib/supabase/admin";

export type NotificationKind = "confirmation" | "broadcast" | "challenge_reminder";

export interface SendWhatsAppParams {
  to: string; // Indonesian phone format, e.g. 6281234567890
  message: string;
  kind: NotificationKind;
  broadcastId?: string;
}

export interface SendWhatsAppResult {
  success: boolean;
  status: "sent" | "failed" | "queued";
  providerResponse?: any;
  error?: string;
}

/**
 * Normalizes Indonesian phone numbers into standard international format without '+' (e.g., 6281234567890)
 */
export function normalizeWhatsAppNumber(rawPhone: string): string {
  let cleaned = rawPhone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

/**
 * Core WhatsApp Dispatcher.
 * Communicates with WhatsApp Gateway provider (e.g., Fonnte, WABlas, or local mock).
 */
export async function sendWhatsAppMessage({
  to,
  message,
  kind,
  broadcastId,
}: SendWhatsAppParams): Promise<SendWhatsAppResult> {
  const normalizedTo = normalizeWhatsAppNumber(to);
  const apiUrl = process.env.WHATSAPP_API_URL || "https://api.fonnte.com/send";
  const apiToken = process.env.WHATSAPP_API_TOKEN || "";
  const isLiveProvider = apiToken && !apiToken.includes("your-whatsapp-token");

  let status: "sent" | "failed" | "queued" = "sent";
  let providerResponse: any = null;
  let errorMessage: string | undefined;

  if (isLiveProvider) {
    try {
      // Standard Fonnte/WhatsApp API POST payload
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: apiToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: normalizedTo,
          message: message,
          countryCode: "62",
        }),
      });

      providerResponse = await response.json();
      if (!response.ok || (providerResponse && providerResponse.status === false)) {
        status = "failed";
        errorMessage = providerResponse?.reason || `HTTP ${response.status}`;
      } else {
        status = "sent";
      }
    } catch (err: any) {
      status = "failed";
      errorMessage = err.message || "Failed to connect to WhatsApp Gateway.";
    }
  } else {
    // In dev / mock environment, simulate successful delivery
    status = "sent";
    providerResponse = {
      mock: true,
      timestamp: new Date().toISOString(),
      delivered_to: normalizedTo,
      message_length: message.length,
    };
  }

  // Record log into Supabase notification_logs if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    try {
      const adminClient = createAdminClient();
      await adminClient.from("notification_logs").insert({
        recipient_whatsapp: normalizedTo,
        kind,
        broadcast_id: broadcastId || null,
        status,
        provider_response: providerResponse || { error: errorMessage },
      });
    } catch (dbErr) {
      console.warn("Failed to record notification_log to Supabase:", dbErr);
    }
  }

  return {
    success: status === "sent",
    status,
    providerResponse,
    error: errorMessage,
  };
}

/**
 * Sends Double Opt-in confirmation WhatsApp with verification link
 */
export async function sendDoubleOptInConfirmation(
  whatsapp: string,
  confirmToken: string,
  name?: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const confirmUrl = `${appUrl}/newsletter/konfirmasi?token=${confirmToken}`;

  const greeting = name ? `Halo ${name}` : "Halo Sahabat";
  const message = `${greeting}! 📚✨

Terima kasih telah mendaftar di Buletin WhatsApp *Rumah Literasi*.

Untuk mengaktifkan langganan buletin mingguan dan kurasi wawasan bacaan kritis Anda, mohon konfirmasi nomor ini dengan menekan tautan berikut:
👉 ${confirmUrl}

_Jika Anda tidak merasa mendaftarkan nomor ini, abaikan pesan ini atau balas "STOP"._
Rumah Literasi Indonesia`;

  return sendWhatsAppMessage({
    to: whatsapp,
    message,
    kind: "confirmation",
  });
}

/**
 * Sends Daily Challenge Reminder to member
 */
export async function sendChallengeReminder(
  whatsapp: string,
  fullName: string,
  challengeTitle: string,
  dayNumber: number,
  taskTitle: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const dashboardUrl = `${appUrl}/dashboard/tantangan`;

  const message = `Halo ${fullName}! 📖🔥

Waktunya jeda membaca sejenak hari ini. Jangan biarkan streak tantanganmu terputus!

🎯 *${challengeTitle}*
📅 *Hari ke-${dayNumber}:* ${taskTitle}

Selesaikan bacaan dan catat 1-2 kalimat refleksimu malam ini di:
👉 ${dashboardUrl}

_"Membaca adalah napas bagi pikiran yang merdeka."_
Rumah Literasi`;

  return sendWhatsAppMessage({
    to: whatsapp,
    message,
    kind: "challenge_reminder",
  });
}

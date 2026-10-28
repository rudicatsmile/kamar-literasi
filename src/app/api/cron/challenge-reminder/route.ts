import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendChallengeReminder } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 1. Verify Cron Secret
  const authHeader = req.headers.get("authorization");
  const url = new URL(req.url);
  const querySecret = url.searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET || "random-long-secret";

  const isAuthorized =
    authHeader === `Bearer ${expectedSecret}` ||
    querySecret === expectedSecret ||
    process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    return NextResponse.json(
      { success: false, error: "Unauthorized cron request." },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  const todayStr = new Date().toISOString().split("T")[0];
  let remindersSent = 0;

  if (isSupabaseConfigured) {
    try {
      const adminClient = createAdminClient();

      // Fetch active participations with user profile and challenge details
      const { data: participations, error } = await adminClient
        .from("challenge_participations")
        .select(`
          id,
          user_id,
          current_streak,
          challenges (
            title,
            duration_days,
            challenge_days (
              day_number,
              task_title
            )
          ),
          profiles (
            full_name,
            whatsapp,
            reminder_enabled
          )
        `)
        .eq("status", "active");

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      if (participations && participations.length > 0) {
        for (const p of participations as any[]) {
          const profile = p.profiles;
          if (!profile || !profile.reminder_enabled || !profile.whatsapp) {
            continue;
          }

          // Check if already checked in today
          const { count } = await adminClient
            .from("challenge_checkins")
            .select("*", { count: "exact", head: true })
            .eq("participation_id", p.id)
            .eq("checkin_date", todayStr);

          if (count && count > 0) {
            // Already checked in today, skip reminder
            continue;
          }

          const challenge = p.challenges;
          const nextDayNumber = Math.min((p.current_streak || 0) + 1, challenge?.duration_days || 7);
          const dayTask = challenge?.challenge_days?.find(
            (d: any) => d.day_number === nextDayNumber
          );
          const taskTitle = dayTask?.task_title || "Target Membaca Hari Ini";

          await sendChallengeReminder(
            profile.whatsapp,
            profile.full_name || "Sahabat Literasi",
            challenge?.title || "Tantangan Literasi",
            nextDayNumber,
            taskTitle
          );

          remindersSent++;
        }
      }

      return NextResponse.json({
        success: true,
        date: todayStr,
        participationsEvaluated: participations?.length || 0,
        remindersSent,
      });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  // Fallback dev response
  return NextResponse.json({
    success: true,
    mode: "mock",
    date: todayStr,
    message: "Pengingat tantangan simulasi berhasil dijalankan (Supabase mock mode).",
    remindersSent: 1,
  });
}

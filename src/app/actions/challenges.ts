"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

const ChallengeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Judul tantangan minimal 3 karakter."),
  slug: z.string().min(3, "Slug tantangan minimal 3 karakter."),
  description: z.string().min(10, "Deskripsi minimal 10 karakter."),
  duration_days: z.union([z.literal(7), z.literal(21), z.literal(30)]),
  cover_url: z.string().optional(),
});

export async function saveChallengeAction(data: z.infer<typeof ChallengeSchema>) {
  const validation = ChallengeSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data tantangan tidak valid.",
    };
  }

  const { id, title, slug, description, duration_days, cover_url } = validation.data;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    if (id) {
      const { error } = await supabase
        .from("challenges")
        .update({ title, slug, description, duration_days, cover_url })
        .eq("id", id);
      if (error) return { success: false, error: error.message };
    } else {
      const { data: newCh, error } = await supabase
        .from("challenges")
        .insert({
          title,
          slug,
          description,
          duration_days,
          cover_url,
          status: "published",
        })
        .select("id")
        .single();

      if (error) return { success: false, error: error.message };

      // Generate default challenge_days
      if (newCh) {
        const days = Array.from({ length: duration_days }, (_, i) => ({
          challenge_id: newCh.id,
          day_number: i + 1,
          task_title: `Tugas Membaca Hari ke-${i + 1}`,
          task_description: `Bacaan target hari ke-${i + 1} dan refleksi singkat.`,
        }));
        await supabase.from("challenge_days").insert(days);
      }
    }
  }

  revalidatePath("/mulai-sekarang");
  revalidatePath("/admin/tantangan");
  return { success: true };
}

export async function deleteChallengeAction(id: string) {
  if (!id) return { success: false, error: "ID tantangan tidak valid." };

  if (!isValidUUID(id)) {
    revalidatePath("/mulai-sekarang");
    revalidatePath("/admin/tantangan");
    return { success: true };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.from("challenges").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/mulai-sekarang");
  revalidatePath("/admin/tantangan");
  return { success: true };
}

export async function joinChallengeAction(challengeId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan masuk akun terlebih dahulu." };
    }

    // Insert participation
    const { error } = await supabase
      .from("challenge_participations")
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        status: "active",
        current_streak: 0,
      });

    if (error) {
      if (error.code === "23505") {
        return { success: true, message: "Anda sudah terdaftar di tantangan ini." };
      }
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/dashboard/tantangan");
  return { success: true };
}

export async function checkinChallengeAction(
  participationId: string,
  dayNumber: number,
  reflection: string
) {
  if (!reflection.trim()) {
    return { success: false, error: "Catatan refleksi wajib diisi." };
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    // Insert check-in record
    const { error: checkinError } = await supabase
      .from("challenge_checkins")
      .insert({
        participation_id: participationId,
        day_number: dayNumber,
        checkin_date: todayStr,
        reflection: reflection.trim(),
      });

    if (checkinError) {
      return {
        success: false,
        error:
          checkinError.code === "23505"
            ? "Anda sudah melakukan check-in untuk hari atau tanggal ini."
            : checkinError.message,
      };
    }

    // Increment current streak
    const { data: part } = await supabase
      .from("challenge_participations")
      .select("current_streak")
      .eq("id", participationId)
      .single();

    const newStreak = (part?.current_streak || 0) + 1;
    await supabase
      .from("challenge_participations")
      .update({ current_streak: newStreak })
      .eq("id", participationId);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tantangan");
  return { success: true };
}

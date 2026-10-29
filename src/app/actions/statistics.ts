"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

const StatisticSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(2, "Label statistik minimal 2 karakter."),
  type: z.enum(["metric", "fact", "chart"]),
  value: z.string().optional(),
  description: z.string().optional(),
  source_name: z.string().min(2, "Nama sumber wajib diisi."),
  source_url: z.string().optional(),
  year: z.number().default(2025),
  sort_order: z.number().default(1),
  is_active: z.boolean().default(true),
});

export async function saveStatisticAction(data: z.infer<typeof StatisticSchema>) {
  const validation = StatisticSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data statistik tidak valid.",
    };
  }

  const { id, label, type, value, description, source_name, source_url, year, sort_order, is_active } =
    validation.data;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    if (id) {
      const { error } = await supabase
        .from("statistics")
        .update({
          label,
          type,
          value,
          description,
          source_name,
          source_url,
          year,
          sort_order,
          is_active,
        })
        .eq("id", id);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabase.from("statistics").insert({
        label,
        type,
        value,
        description,
        source_name,
        source_url,
        year,
        sort_order,
        is_active,
      });
      if (error) return { success: false, error: error.message };
    }
  }

  revalidatePath("/statistik");
  revalidatePath("/admin/statistik");
  return { success: true };
}

export async function deleteStatisticAction(id: string) {
  if (!id) return { success: false, error: "ID statistik tidak valid." };

  if (!isValidUUID(id)) {
    revalidatePath("/statistik");
    revalidatePath("/admin/statistik");
    return { success: true };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.from("statistics").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/statistik");
  revalidatePath("/admin/statistik");
  return { success: true };
}

export async function toggleStatisticActiveAction(id: string, currentState: boolean) {
  if (!isValidUUID(id)) {
    revalidatePath("/statistik");
    revalidatePath("/admin/statistik");
    return { success: true };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase
      .from("statistics")
      .update({ is_active: !currentState })
      .eq("id", id);
  }

  revalidatePath("/statistik");
  revalidatePath("/admin/statistik");
  return { success: true };
}

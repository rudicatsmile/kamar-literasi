"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const TipSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Judul tips minimal 2 karakter."),
  content: z.string().min(5, "Isi tips minimal 5 karakter."),
  icon: z.string().default("BookOpen"),
  sort_order: z.number().default(1),
  is_active: z.boolean().default(true),
});

export async function saveTipAction(data: z.infer<typeof TipSchema>) {
  const validation = TipSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data tips tidak valid.",
    };
  }

  const { id, title, content, icon, sort_order, is_active } = validation.data;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    if (id) {
      const { error } = await supabase
        .from("tips")
        .update({ title, content, icon, sort_order, is_active })
        .eq("id", id);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabase
        .from("tips")
        .insert({ title, content, icon, sort_order, is_active });
      if (error) return { success: false, error: error.message };
    }
  }

  revalidatePath("/mulai-sekarang");
  revalidatePath("/admin/tips");
  return { success: true };
}

export async function deleteTipAction(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.from("tips").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/mulai-sekarang");
  revalidatePath("/admin/tips");
  return { success: true };
}

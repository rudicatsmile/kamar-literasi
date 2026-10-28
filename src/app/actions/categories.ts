"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nama kategori minimal 2 karakter."),
  slug: z.string().min(2, "Slug kategori minimal 2 karakter."),
  description: z.string().optional(),
});

export async function saveCategoryAction(data: z.infer<typeof CategorySchema>) {
  const validation = CategorySchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data kategori tidak valid.",
    };
  }

  const { id, name, slug, description } = validation.data;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    if (id) {
      const { error } = await supabase
        .from("categories")
        .update({ name, slug, description })
        .eq("id", id);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabase
        .from("categories")
        .insert({ name, slug, description });
      if (error) return { success: false, error: error.message };
    }
  }

  revalidatePath("/artikel");
  revalidatePath("/admin/kategori");
  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    // Check if category is used by articles
    const { count } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if (count && count > 0) {
      return {
        success: false,
        error: `Kategori tidak dapat dihapus karena masih digunakan oleh ${count} artikel.`,
      };
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/artikel");
  revalidatePath("/admin/kategori");
  return { success: true };
}

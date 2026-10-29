"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

const ResourceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Judul materi minimal 3 karakter."),
  slug: z.string().min(3, "Slug materi minimal 3 karakter."),
  description: z.string().min(5, "Deskripsi minimal 5 karakter."),
  type: z.enum(["book", "tool", "pdf"]),
  age_category: z.enum(["anak", "remaja", "dewasa", "semua"]).default("semua"),
  publisher: z.string().default("Masyarakat Literasi"),
  cover_url: z.string().optional(),
  external_url: z.string().optional(),
  file_path: z.string().optional(),
});

export async function saveResourceAction(data: z.infer<typeof ResourceSchema>) {
  const validation = ResourceSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data resource tidak valid.",
    };
  }

  const {
    id,
    title,
    slug,
    description,
    type,
    age_category,
    publisher,
    cover_url,
    external_url,
    file_path,
  } = validation.data;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    if (id) {
      const { error } = await supabase
        .from("resources")
        .update({
          title,
          slug,
          description,
          type,
          age_category,
          publisher,
          cover_url,
          external_url,
          file_path,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabase.from("resources").insert({
        title,
        slug,
        description,
        type,
        age_category,
        publisher,
        cover_url,
        external_url,
        file_path,
        status: "published",
      });
      if (error) return { success: false, error: error.message };
    }
  }

  revalidatePath("/resource");
  revalidatePath("/admin/resource");
  return { success: true };
}

export async function deleteResourceAction(id: string) {
  if (!id) return { success: false, error: "ID resource tidak valid." };

  if (!isValidUUID(id)) {
    revalidatePath("/resource");
    revalidatePath("/admin/resource");
    return { success: true };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/resource");
  revalidatePath("/admin/resource");
  return { success: true };
}

export async function toggleFavoriteResourceAction(resourceId: string) {
  if (!isValidUUID(resourceId)) {
    return { success: true, isFavorited: false };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Silakan login untuk menyimpan favorit." };
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from("resource_favorites")
      .select("resource_id")
      .eq("user_id", user.id)
      .eq("resource_id", resourceId)
      .single();

    if (existing) {
      // Remove
      await supabase
        .from("resource_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", resourceId);
      revalidatePath("/dashboard/favorit");
      return { success: true, isFavorited: false };
    } else {
      // Add
      await supabase
        .from("resource_favorites")
        .insert({ user_id: user.id, resource_id: resourceId });
      revalidatePath("/dashboard/favorit");
      return { success: true, isFavorited: true };
    }
  }

  return { success: true, isFavorited: true };
}

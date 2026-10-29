"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  FooterSettings,
  DEFAULT_FOOTER_SETTINGS,
} from "@/lib/site-settings-types";

// Helper: Ensure the caller is authenticated as an admin
async function verifyAdminCaller() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAuthorized: false, currentUserId: null, error: "Silakan login terlebih dahulu." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return {
      isAuthorized: false,
      currentUserId: user.id,
      error: "Akses ditolak. Fitur ini hanya dapat diakses oleh Administrator.",
    };
  }

  return { isAuthorized: true, currentUserId: user.id, error: null };
}

const FooterSettingsSchema = z.object({
  title: z.string().min(2, "Judul brand minimal 2 karakter."),
  description: z.string().min(10, "Deskripsi minimal 10 karakter."),
  tagline: z.string().min(3, "Tagline minimal 3 karakter."),
});

export async function getFooterSettingsAction(): Promise<FooterSettings> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("site_settings")
      .select("key, value")
      .in("key", ["footer_title", "footer_description", "footer_tagline"]);

    if (error || !data || data.length === 0) {
      return DEFAULT_FOOTER_SETTINGS;
    }

    const map = new Map<string, string>();
    for (const item of data) {
      map.set(item.key, item.value);
    }

    return {
      title: map.get("footer_title") || DEFAULT_FOOTER_SETTINGS.title,
      description: map.get("footer_description") || DEFAULT_FOOTER_SETTINGS.description,
      tagline: map.get("footer_tagline") || DEFAULT_FOOTER_SETTINGS.tagline,
    };
  } catch (err) {
    console.warn("Gagal mengambil footer settings dari database:", err);
    return DEFAULT_FOOTER_SETTINGS;
  }
}

export async function updateFooterSettingsAction(
  data: z.infer<typeof FooterSettingsSchema>
): Promise<{ success: boolean; error?: string }> {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error || "Akses ditolak." };
  }

  const validation = FooterSettingsSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data pengaturan footer tidak valid.",
    };
  }

  const { title, description, tagline } = validation.data;

  try {
    const adminClient = createAdminClient();
    const now = new Date().toISOString();

    const itemsToUpsert = [
      {
        key: "footer_title",
        value: title.trim(),
        description: "Nama dan judul brand di bagian kiri footer situs",
        updated_at: now,
      },
      {
        key: "footer_description",
        value: description.trim(),
        description: "Deskripsi misi dan peran organisasi di footer situs",
        updated_at: now,
      },
      {
        key: "footer_tagline",
        value: tagline.trim(),
        description: "Catatan / tagline independen nirlaba di bawah deskripsi footer",
        updated_at: now,
      },
    ];

    const { error } = await adminClient
      .from("site_settings")
      .upsert(itemsToUpsert, { onConflict: "key" });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/halaman");
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Gagal memperbarui pengaturan footer di database.",
    };
  }
}

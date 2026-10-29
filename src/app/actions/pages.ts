"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Helper: Ensure caller is an authenticated admin
async function verifyAdminCaller() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAuthorized: false, error: "Silakan login terlebih dahulu." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return {
      isAuthorized: false,
      error: "Akses ditolak. Fitur ini hanya dapat diakses oleh Administrator.",
    };
  }

  return { isAuthorized: true, error: null };
}

export interface UpdateAboutPagePayload {
  title: string;
  subtitle: string;
  story: string;
  visi: string;
  misi: string[];
  values?: Array<{ title: string; desc: string }>;
  team?: Array<{ name: string; role: string; avatar: string }>;
}

export async function updateAboutPageAction(payload: UpdateAboutPagePayload) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!payload.title.trim()) {
    return { success: false, error: "Judul halaman wajib diisi." };
  }
  if (!payload.visi.trim()) {
    return { success: false, error: "Pernyataan Visi wajib diisi." };
  }

  const adminClient = createAdminClient();

  const contentObj = {
    subtitle: payload.subtitle || "",
    story: payload.story || "",
    visi: payload.visi || "",
    misi: Array.isArray(payload.misi)
      ? payload.misi.filter((m) => m && m.trim().length > 0)
      : [],
    values: payload.values || [],
    team: payload.team || [],
  };

  const { error } = await adminClient.from("static_pages").upsert(
    {
      slug: "tentang",
      title: payload.title.trim(),
      content: JSON.stringify(contentObj),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" }
  );

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tentang");
  revalidatePath("/admin/halaman");
  revalidatePath("/");
  return { success: true };
}

export async function updateStaticPageAction(
  slug: string,
  title: string,
  content: string
) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!slug || !title || !content) {
    return { success: false, error: "Semua data halaman wajib diisi." };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient.from("static_pages").upsert(
    {
      slug,
      title,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" }
  );

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tentang");
  revalidatePath("/admin/halaman");
  revalidatePath("/");
  return { success: true };
}

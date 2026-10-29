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
  team_title?: string;
  team_subtitle?: string;
  values_title?: string;
  values_subtitle?: string;
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

  // Read existing content first to preserve extra metadata
  const { data: existingRow } = await adminClient
    .from("static_pages")
    .select("content")
    .eq("slug", "tentang")
    .single();

  let existingParsed: any = {};
  if (existingRow?.content) {
    try {
      existingParsed = JSON.parse(existingRow.content);
    } catch {
      existingParsed = {};
    }
  }

  const contentObj = {
    ...existingParsed,
    subtitle: payload.subtitle || "",
    story: payload.story || "",
    visi: payload.visi || "",
    misi: Array.isArray(payload.misi)
      ? payload.misi.filter((m) => m && m.trim().length > 0)
      : [],
    team_title:
      payload.team_title ||
      existingParsed.team_title ||
      "Pengurus Tim Penggerak & Redaksi",
    team_subtitle:
      payload.team_subtitle ||
      existingParsed.team_subtitle ||
      "Kolaborasi lintas disiplin antara kurator buku, pendidik, dan pegiat literasi.",
    values_title:
      payload.values_title ||
      existingParsed.values_title ||
      "Nilai-Nilai yang Kami Pegang Teguh",
    values_subtitle:
      payload.values_subtitle ||
      existingParsed.values_subtitle ||
      "Prinsip dan pedoman etis yang kami pegang dalam memajukan literasi bangsa.",
    values: payload.values || existingParsed.values || [],
    team: payload.team || existingParsed.team || [],
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

export async function updateSectionHeadersAction(data: {
  team_title?: string;
  team_subtitle?: string;
  values_title?: string;
  values_subtitle?: string;
}) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  const adminClient = createAdminClient();
  const { data: pageRow } = await adminClient
    .from("static_pages")
    .select("*")
    .eq("slug", "tentang")
    .single();

  let contentObj: any = {};
  if (pageRow && pageRow.content) {
    try {
      contentObj = JSON.parse(pageRow.content);
    } catch {
      contentObj = {};
    }
  }

  if (data.team_title !== undefined) contentObj.team_title = data.team_title.trim();
  if (data.team_subtitle !== undefined)
    contentObj.team_subtitle = data.team_subtitle.trim();
  if (data.values_title !== undefined)
    contentObj.values_title = data.values_title.trim();
  if (data.values_subtitle !== undefined)
    contentObj.values_subtitle = data.values_subtitle.trim();

  const { error } = await adminClient.from("static_pages").upsert(
    {
      slug: "tentang",
      title: pageRow?.title || "Tentang Kami - Rumah Literasi",
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

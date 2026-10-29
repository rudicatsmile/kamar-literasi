"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidUUID } from "@/lib/utils";

export interface OrganizationValue {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo_url?: string | null;
  bio?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

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

// ==============================================================================
// 1. NILAI-NILAI ORGANISASI ACTIONS
// ==============================================================================

export async function getOrganizationValuesAction(): Promise<OrganizationValue[]> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("nilai")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      sort_order: item.sort_order ?? 0,
      is_active: item.is_active ?? true,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  } catch (err) {
    console.error("Gagal mengambil daftar nilai:", err);
    return [];
  }
}

export async function createOrganizationValueAction(data: {
  title: string;
  description: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!data.title.trim()) {
    return { success: false, error: "Judul nilai organisasi wajib diisi." };
  }
  if (!data.description.trim()) {
    return { success: false, error: "Deskripsi nilai wajib diisi." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("nilai").insert({
    title: data.title.trim(),
    description: data.description.trim(),
    sort_order: Number(data.sort_order ?? 0),
    is_active: data.is_active ?? true,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tentang");
  revalidatePath("/admin/halaman");
  return { success: true };
}

export async function updateOrganizationValueAction(data: {
  id: string;
  title: string;
  description: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!isValidUUID(data.id)) {
    return { success: false, error: "ID nilai tidak valid." };
  }
  if (!data.title.trim()) {
    return { success: false, error: "Judul nilai organisasi wajib diisi." };
  }
  if (!data.description.trim()) {
    return { success: false, error: "Deskripsi nilai wajib diisi." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("nilai")
    .update({
      title: data.title.trim(),
      description: data.description.trim(),
      sort_order: Number(data.sort_order ?? 0),
      is_active: data.is_active ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tentang");
  revalidatePath("/admin/halaman");
  return { success: true };
}

export async function deleteOrganizationValueAction(id: string) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!isValidUUID(id)) {
    return { success: false, error: "ID nilai tidak valid." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("nilai").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tentang");
  revalidatePath("/admin/halaman");
  return { success: true };
}

// ==============================================================================
// 2. TIM PENGGERAK & REDAKSI ACTIONS
// ==============================================================================

export async function getTeamMembersAction(): Promise<TeamMember[]> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      position: item.position,
      photo_url: item.photo_url || null,
      bio: item.bio || null,
      sort_order: item.sort_order ?? 0,
      is_active: item.is_active ?? true,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  } catch (err) {
    console.error("Gagal mengambil daftar anggota tim:", err);
    return [];
  }
}

export async function createTeamMemberAction(data: {
  name: string;
  position: string;
  photo_url?: string | null;
  bio?: string | null;
  sort_order?: number;
  is_active?: boolean;
}) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!data.name.trim()) {
    return { success: false, error: "Nama anggota tim wajib diisi." };
  }
  if (!data.position.trim()) {
    return { success: false, error: "Jabatan/posisi tim wajib diisi." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("team_members").insert({
    name: data.name.trim(),
    position: data.position.trim(),
    photo_url: data.photo_url?.trim() || null,
    bio: data.bio?.trim() || null,
    sort_order: Number(data.sort_order ?? 0),
    is_active: data.is_active ?? true,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tentang");
  revalidatePath("/admin/halaman");
  return { success: true };
}

export async function updateTeamMemberAction(data: {
  id: string;
  name: string;
  position: string;
  photo_url?: string | null;
  bio?: string | null;
  sort_order?: number;
  is_active?: boolean;
  old_photo_url?: string | null;
}) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!isValidUUID(data.id)) {
    return { success: false, error: "ID anggota tim tidak valid." };
  }
  if (!data.name.trim()) {
    return { success: false, error: "Nama anggota tim wajib diisi." };
  }
  if (!data.position.trim()) {
    return { success: false, error: "Jabatan/posisi tim wajib diisi." };
  }

  const adminClient = createAdminClient();

  // If photo changed and old photo was hosted in team-photos bucket, remove old photo
  if (
    data.old_photo_url &&
    data.old_photo_url !== data.photo_url &&
    data.old_photo_url.includes("team-photos")
  ) {
    try {
      const parts = data.old_photo_url.split("/team-photos/");
      if (parts[1]) {
        const filePath = decodeURIComponent(parts[1].split("?")[0]);
        await adminClient.storage.from("team-photos").remove([filePath]);
      }
    } catch (err) {
      console.warn("Gagal menghapus foto lama dari storage:", err);
    }
  }

  const { error } = await adminClient
    .from("team_members")
    .update({
      name: data.name.trim(),
      position: data.position.trim(),
      photo_url: data.photo_url?.trim() || null,
      bio: data.bio?.trim() || null,
      sort_order: Number(data.sort_order ?? 0),
      is_active: data.is_active ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tentang");
  revalidatePath("/admin/halaman");
  return { success: true };
}

export async function deleteTeamMemberAction(id: string, photoUrl?: string | null) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!isValidUUID(id)) {
    return { success: false, error: "ID anggota tim tidak valid." };
  }

  const adminClient = createAdminClient();

  // If photo was in team-photos bucket, delete it
  if (photoUrl && photoUrl.includes("team-photos")) {
    try {
      const parts = photoUrl.split("/team-photos/");
      if (parts[1]) {
        const filePath = decodeURIComponent(parts[1].split("?")[0]);
        await adminClient.storage.from("team-photos").remove([filePath]);
      }
    } catch (err) {
      console.warn("Gagal menghapus foto tim saat hapus data:", err);
    }
  }

  const { error } = await adminClient.from("team_members").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/tentang");
  revalidatePath("/admin/halaman");
  return { success: true };
}

// ==============================================================================
// 3. STORAGE UPLOAD ACTION FOR TEAM PHOTOS
// ==============================================================================

export async function uploadTeamPhotoAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error || "Akses ditolak." };
  }

  const file = formData.get("file") as File | null;
  if (!file || !(file instanceof File)) {
    return { success: false, error: "File foto tidak ditemukan." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "Ukuran foto maksimal 5 MB." };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: "Format foto harus JPG, PNG, WEBP, atau GIF.",
    };
  }

  try {
    const adminClient = createAdminClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `team_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from("team-photos")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: publicData } = adminClient.storage
      .from("team-photos")
      .getPublicUrl(fileName);

    return { success: true, url: publicData.publicUrl };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Gagal mengunggah foto ke storage.",
    };
  }
}

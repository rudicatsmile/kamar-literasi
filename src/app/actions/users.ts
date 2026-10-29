"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidUUID } from "@/lib/utils";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "member";
  whatsapp?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  lastSignInAt?: string | null;
}

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

const CreateUserSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter."),
  whatsapp: z.string().optional(),
  role: z.enum(["admin", "member"]).default("member"),
});

export async function createUserAction(data: z.infer<typeof CreateUserSchema>) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  const validation = CreateUserSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data pengguna tidak valid.",
    };
  }

  const { fullName, email, password, whatsapp, role } = validation.data;
  const adminClient = createAdminClient();

  // 1. Create user in Supabase Auth
  const { data: newAuthUser, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      whatsapp: whatsapp || null,
      role,
    },
  });

  if (authError || !newAuthUser?.user) {
    return {
      success: false,
      error: authError?.message || "Gagal membuat akun pengguna di Supabase Auth.",
    };
  }

  // 2. Ensure profile is saved with correct role
  const { error: profileError } = await adminClient.from("profiles").upsert({
    id: newAuthUser.user.id,
    full_name: fullName,
    whatsapp: whatsapp || null,
    role,
    avatar_url: `https://images.unsplash.com/photo-${
      role === "admin" ? "1534528741775-53994a69daeb" : "1494790108377-be9c29b29330"
    }?q=80&w=400&auto=format&fit=crop`,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  revalidatePath("/admin/pengguna");
  return { success: true };
}

const UpdateUserSchema = z.object({
  id: z.string().min(1, "ID pengguna wajib diisi."),
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter."),
  whatsapp: z.string().optional(),
  role: z.enum(["admin", "member"]),
});

export async function updateUserAction(data: z.infer<typeof UpdateUserSchema>) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  const validation = UpdateUserSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data perbaruan tidak valid.",
    };
  }

  const { id, fullName, whatsapp, role } = validation.data;

  if (!isValidUUID(id)) {
    return { success: false, error: "Format ID pengguna tidak valid." };
  }

  const adminClient = createAdminClient();

  // Prevent self-demotion if caller is demoting their own admin role
  if (authCheck.currentUserId === id && role !== "admin") {
    return {
      success: false,
      error: "Anda tidak dapat menurunkan peran (demote) akun Anda sendiri dari Administrator.",
    };
  }

  // If changing role to member, ensure there is at least one other admin in the system
  if (role === "member") {
    const { count } = await adminClient
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    if (count !== null && count <= 1) {
      return {
        success: false,
        error: "Tidak dapat mengubah peran. Sistem harus memiliki setidaknya satu Administrator aktif.",
      };
    }
  }

  // 1. Update profiles table
  const { error: profileError } = await adminClient
    .from("profiles")
    .update({
      full_name: fullName,
      whatsapp: whatsapp || null,
      role,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  // 2. Update auth user metadata
  await adminClient.auth.admin.updateUserById(id, {
    user_metadata: {
      full_name: fullName,
      whatsapp: whatsapp || null,
      role,
    },
  });

  revalidatePath("/admin/pengguna");
  return { success: true };
}

export async function resetUserPasswordAction(id: string, newPassword: string) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!isValidUUID(id)) {
    return { success: false, error: "ID pengguna tidak valid." };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Kata sandi baru minimal 8 karakter." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(id, {
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteUserAction(id: string) {
  const authCheck = await verifyAdminCaller();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  if (!isValidUUID(id)) {
    revalidatePath("/admin/pengguna");
    return { success: true };
  }

  // Prevent self-deletion
  if (authCheck.currentUserId === id) {
    return {
      success: false,
      error: "Anda tidak dapat menghapus akun Anda sendiri saat sedang masuk.",
    };
  }

  const adminClient = createAdminClient();

  // Check if target is admin, and prevent deleting if they are the last admin
  const { data: targetProfile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", id)
    .single();

  if (targetProfile?.role === "admin") {
    const { count } = await adminClient
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    if (count !== null && count <= 1) {
      return {
        success: false,
        error: "Tidak dapat menghapus Administrator terakhir di sistem.",
      };
    }
  }

  // Delete from auth.users (cascades to profiles, participations, etc.)
  const { error } = await adminClient.auth.admin.deleteUser(id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/pengguna");
  return { success: true };
}

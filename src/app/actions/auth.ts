"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter."),
});

const RegisterSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter."),
  email: z.string().email("Format email tidak valid."),
  whatsapp: z.string().optional(),
  password: z.string().min(8, "Kata sandi minimal 8 karakter."),
  confirmPassword: z.string().min(8, "Konfirmasi kata sandi minimal 8 karakter."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok.",
  path: ["confirmPassword"],
});

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const rateLimit = checkRateLimit(`login-${email?.toLowerCase()}`, {
    limit: 5,
    windowMs: 60000, // 1 minute
  });

  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Terlalu banyak percobaan login. Silakan tunggu ${rateLimit.retryAfterSeconds} detik.`,
    };
  }

  const validation = LoginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data login tidak valid.",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Gagal masuk. Periksa email dan kata sandi Anda.",
      };
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function registerAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validation = RegisterSchema.safeParse({
    fullName,
    email,
    whatsapp,
    password,
    confirmPassword,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Data pendaftaran tidak valid.",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          whatsapp: whatsapp || null,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Gagal mendaftarkan akun. Silakan coba kembali.",
      };
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logoutAction() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export { logoutAction as signOutAction };

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email || !email.includes("@")) {
    return { success: false, error: "Mohon masukkan email yang valid." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

export async function resetPasswordAction(formData: FormData) {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Kata sandi minimal 8 karakter." };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: "Konfirmasi kata sandi tidak cocok." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

export async function updateProfileAction(data: {
  fullName: string;
  whatsapp?: string;
  reminderEnabled?: boolean;
}) {
  if (!data.fullName || data.fullName.trim().length < 2) {
    return { success: false, error: "Nama minimal 2 karakter." };
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
      return { success: false, error: "Sesi tidak ditemukan. Silakan login kembali." };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.fullName.trim(),
        whatsapp: data.whatsapp?.trim() || null,
        reminder_enabled: !!data.reminderEnabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/dashboard/profil");
  return { success: true };
}

export async function updatePasswordAction(formData: FormData) {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Kata sandi minimal 8 karakter." };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: "Konfirmasi kata sandi baru tidak sesuai." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isSupabaseConfigured =
    supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("dummy-project");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

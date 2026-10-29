"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import {
  ContactInfoItem,
  FAQItem,
  DEFAULT_CONTACT_INFO,
  DEFAULT_FAQS,
} from "@/lib/contact-types";
export type { ContactInfoItem, FAQItem };


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
      error: "Akses ditolak. Fitur ini hanya untuk Administrator.",
    };
  }

  return { isAuthorized: true, error: null };
}

// ==============================================================================
// CONTACT INFO ACTIONS
// ==============================================================================

export async function getContactInfoAction(): Promise<ContactInfoItem[]> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("contact_info")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CONTACT_INFO;
    }

    return data;
  } catch {
    return DEFAULT_CONTACT_INFO;
  }
}

export async function createContactInfoAction(data: {
  key: string;
  label: string;
  value: string;
  icon?: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  const auth = await verifyAdminCaller();
  if (!auth.isAuthorized) return { success: false, error: auth.error };

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("contact_info").insert({
    key: data.key.trim().toLowerCase(),
    label: data.label.trim(),
    value: data.value.trim(),
    icon: data.icon || "Mail",
    sort_order: data.sort_order ?? 0,
    is_active: data.is_active ?? true,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/kontak");
  revalidatePath("/admin/halaman");
  return { success: true };
}

export async function updateContactInfoAction(
  id: string,
  data: {
    label: string;
    value: string;
    icon?: string;
    sort_order?: number;
    is_active?: boolean;
  }
) {
  const auth = await verifyAdminCaller();
  if (!auth.isAuthorized) return { success: false, error: auth.error };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("contact_info")
    .update({
      label: data.label.trim(),
      value: data.value.trim(),
      icon: data.icon,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/kontak");
  revalidatePath("/admin/halaman");
  return { success: true };
}

export async function deleteContactInfoAction(id: string) {
  const auth = await verifyAdminCaller();
  if (!auth.isAuthorized) return { success: false, error: auth.error };

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("contact_info").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/kontak");
  revalidatePath("/admin/halaman");
  return { success: true };
}

export async function toggleContactInfoActiveAction(
  id: string,
  currentStatus: boolean
) {
  const auth = await verifyAdminCaller();
  if (!auth.isAuthorized) return { success: false, error: auth.error };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("contact_info")
    .update({
      is_active: !currentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/kontak");
  revalidatePath("/admin/halaman");
  return { success: true };
}

// ==============================================================================
// FAQS ACTIONS
// ==============================================================================

export async function getFaqsAction(): Promise<FAQItem[]> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_FAQS;
    }

    return data;
  } catch {
    return DEFAULT_FAQS;
  }
}

export async function createFaqAction(data: {
  question: string;
  answer: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  const auth = await verifyAdminCaller();
  if (!auth.isAuthorized) return { success: false, error: auth.error };

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("faqs").insert({
    question: data.question.trim(),
    answer: data.answer.trim(),
    sort_order: data.sort_order ?? 0,
    is_active: data.is_active ?? true,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/kontak");
  revalidatePath("/admin/halaman");
  return { success: true };
}

export async function updateFaqAction(
  id: string,
  data: {
    question: string;
    answer: string;
    sort_order?: number;
    is_active?: boolean;
  }
) {
  const auth = await verifyAdminCaller();
  if (!auth.isAuthorized) return { success: false, error: auth.error };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("faqs")
    .update({
      question: data.question.trim(),
      answer: data.answer.trim(),
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/kontak");
  revalidatePath("/admin/halaman");
  return { success: true };
}

export async function deleteFaqAction(id: string) {
  const auth = await verifyAdminCaller();
  if (!auth.isAuthorized) return { success: false, error: auth.error };

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("faqs").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/kontak");
  revalidatePath("/admin/halaman");
  return { success: true };
}

export async function toggleFaqActiveAction(
  id: string,
  currentStatus: boolean
) {
  const auth = await verifyAdminCaller();
  if (!auth.isAuthorized) return { success: false, error: auth.error };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("faqs")
    .update({
      is_active: !currentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/kontak");
  revalidatePath("/admin/halaman");
  return { success: true };
}

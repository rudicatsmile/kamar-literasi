import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminUser } from "@/app/actions/users";
import { AdminPenggunaClient } from "./pengguna-client";

export const metadata: Metadata = {
  title: "Kelola Pengguna | Panel Admin",
  description: "Manajemen data akun administrator dan member Masyarakat Literasi.",
};

export default async function AdminPenggunaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify role admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all users using admin client
  let users: AdminUser[] = [];

  try {
    const adminClient = createAdminClient();

    // 1. Fetch auth users
    const { data: authData, error: authError } =
      await adminClient.auth.admin.listUsers({
        perPage: 1000,
      });

    // 2. Fetch profiles
    const { data: profilesData } = await adminClient
      .from("profiles")
      .select("id, full_name, role, whatsapp, avatar_url, updated_at");

    const profileMap = new Map<string, any>();
    if (profilesData) {
      for (const p of profilesData) {
        profileMap.set(p.id, p);
      }
    }

    if (!authError && authData?.users) {
      users = authData.users.map((u) => {
        const p = profileMap.get(u.id);
        const metadata = u.user_metadata || {};

        const fullName =
          p?.full_name ||
          metadata.full_name ||
          metadata.name ||
          u.email?.split("@")[0] ||
          "Pengguna Literasi";

        const role = (p?.role || metadata.role || "member") as "admin" | "member";
        const whatsapp = p?.whatsapp || metadata.whatsapp || null;
        const avatarUrl = p?.avatar_url || metadata.avatar_url || null;

        return {
          id: u.id,
          email: u.email || "-",
          fullName,
          role,
          whatsapp,
          avatarUrl,
          createdAt: u.created_at,
          lastSignInAt: u.last_sign_in_at || null,
        };
      });

      // Sort by admin first, then newest creation
      users.sort((a, b) => {
        if (a.role === "admin" && b.role !== "admin") return -1;
        if (a.role !== "admin" && b.role === "admin") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
  } catch (err) {
    console.error("Gagal mengambil daftar pengguna:", err);
    users = [];
  }

  return (
    <AdminPenggunaClient
      initialUsers={users}
      currentUserId={user.id}
    />
  );
}

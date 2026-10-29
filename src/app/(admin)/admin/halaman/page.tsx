import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStaticPage } from "@/lib/data";
import { dummyStaticPages } from "@/lib/dummy-data";
import {
  getOrganizationValuesAction,
  getTeamMembersAction,
  OrganizationValue,
  TeamMember,
} from "@/app/actions/team-and-values";
import { AdminHalamanClient } from "./halaman-client";

export const metadata: Metadata = {
  title: "Kelola Halaman Statis & Tim | Panel Admin",
  description:
    "Sunting profil organisasi, visi, misi, nilai-nilai, dan tim redaksi Masyarakat Literasi.",
};

export default async function AdminHalamanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  let pageData = dummyStaticPages.tentang;
  let valuesData: OrganizationValue[] = [];
  let teamData: TeamMember[] = [];

  try {
    const [fetchedPage, fetchedValues, fetchedTeam] = await Promise.all([
      getStaticPage("tentang"),
      getOrganizationValuesAction(),
      getTeamMembersAction(),
    ]);

    if (fetchedPage) {
      pageData = fetchedPage;
    }

    valuesData =
      fetchedValues && fetchedValues.length > 0
        ? fetchedValues
        : dummyStaticPages.tentang.values.map((v, i) => ({
            id: `temp-val-${i}`,
            title: v.title,
            description: v.desc,
            sort_order: i + 1,
            is_active: true,
          }));

    teamData =
      fetchedTeam && fetchedTeam.length > 0
        ? fetchedTeam
        : dummyStaticPages.tentang.team.map((t, i) => ({
            id: `temp-team-${i}`,
            name: t.name,
            position: t.role,
            photo_url: t.avatar,
            bio: "",
            sort_order: i + 1,
            is_active: true,
          }));
  } catch (err) {
    console.error("Gagal mengambil data halaman admin:", err);
    pageData = dummyStaticPages.tentang;
  }

  return (
    <AdminHalamanClient
      initialData={pageData}
      initialValues={valuesData}
      initialTeam={teamData}
    />
  );
}

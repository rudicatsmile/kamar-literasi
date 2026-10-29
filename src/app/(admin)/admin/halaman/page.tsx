import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStaticPage } from "@/lib/data";
import { dummyStaticPages } from "@/lib/dummy-data";
import { AdminHalamanClient } from "./halaman-client";

export const metadata: Metadata = {
  title: "Kelola Halaman Statis | Panel Admin",
  description: "Sunting profil organisasi, visi, misi, dan latar belakang gerakan Masyarakat Literasi.",
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

  try {
    const fetched = await getStaticPage("tentang");
    if (fetched) {
      pageData = fetched;
    }
  } catch {
    pageData = dummyStaticPages.tentang;
  }

  return <AdminHalamanClient initialData={pageData} />;
}

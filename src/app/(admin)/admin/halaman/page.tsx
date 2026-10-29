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
import {
  getContactInfoAction,
  getFaqsAction,
} from "@/app/actions/contact-settings";
import { ContactInfoItem, FAQItem } from "@/lib/contact-types";
import { getFooterSettingsAction } from "@/app/actions/site-settings";
import { FooterSettings, DEFAULT_FOOTER_SETTINGS } from "@/lib/site-settings-types";

import { AdminHalamanClient } from "./halaman-client";

export const metadata: Metadata = {
  title: "Kelola Halaman Statis & Tim | Panel Admin",
  description:
    "Sunting profil organisasi, visi, misi, nilai-nilai, tim redaksi, info kontak, FAQ, dan footer Rumah Literasi.",
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
  let contactData: ContactInfoItem[] = [];
  let faqData: FAQItem[] = [];
  let footerData: FooterSettings = DEFAULT_FOOTER_SETTINGS;

  try {
    const [
      fetchedPage,
      fetchedValues,
      fetchedTeam,
      fetchedContact,
      fetchedFaqs,
      fetchedFooter,
    ] = await Promise.all([
      getStaticPage("tentang"),
      getOrganizationValuesAction(),
      getTeamMembersAction(),
      getContactInfoAction(),
      getFaqsAction(),
      getFooterSettingsAction(),
    ]);

    if (fetchedPage) {
      pageData = fetchedPage;
    }

    valuesData = fetchedValues || [];
    teamData = fetchedTeam || [];
    contactData = fetchedContact || [];
    faqData = fetchedFaqs || [];
    footerData = fetchedFooter || DEFAULT_FOOTER_SETTINGS;
  } catch (err) {
    console.error("Gagal mengambil data halaman admin:", err);
    pageData = dummyStaticPages.tentang;
  }

  return (
    <AdminHalamanClient
      initialData={pageData}
      initialValues={valuesData}
      initialTeam={teamData}
      initialContact={contactData}
      initialFaqs={faqData}
      initialFooter={footerData}
    />
  );
}

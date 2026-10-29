import { Metadata } from "next";
import { getReadingAnalyticsSummary } from "@/app/actions/reading-analytics";
import { AnalitikBacaanClient } from "./analitik-bacaan-client";

export const metadata: Metadata = {
  title: "Analitik Perilaku Membaca - Panel Redaksi Rumah Literasi",
  description:
    "Pantau metrik penyelesaian membaca (completion rate), titik lepas baca (drop-off), dan perbandingan waktu baca aktual.",
};

export default async function AdminAnalitikBacaanPage() {
  const initialData = await getReadingAnalyticsSummary("30d");

  return <AnalitikBacaanClient initialData={initialData} />;
}


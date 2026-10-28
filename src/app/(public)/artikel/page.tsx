import { Metadata } from "next";
import { getArticles, getCategories } from "@/lib/data";
import { ArtikelListClient } from "./artikel-list-client";

export const metadata: Metadata = {
  title: "Artikel, Esai & Wawasan Literasi",
  description:
    "Eksplorasi wawasan kritis, panduan kebiasaan membaca mendalam, dan literasi digital untuk membentengi nalar Anda.",
  openGraph: {
    title: "Artikel, Esai & Wawasan Literasi - Masyarakat Literasi",
    description:
      "Eksplorasi wawasan kritis, panduan kebiasaan membaca mendalam, dan literasi digital untuk membentengi nalar Anda.",
  },
};

export default async function ArtikelPage() {
  const [categories, articles] = await Promise.all([
    getCategories(),
    getArticles(),
  ]);

  return (
    <ArtikelListClient
      initialCategories={categories}
      initialArticles={articles}
    />
  );
}

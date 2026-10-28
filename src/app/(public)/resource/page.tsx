import { Metadata } from "next";
import { getResources } from "@/lib/data";
import { ResourceListClient } from "./resource-list-client";

export const metadata: Metadata = {
  title: "Resource Hub - Materi Bacaan & Perkakas Edukatif",
  description:
    "Kurasi materi bacaan berkualitas, lembar kerja nalar kritis, dan perkakas digital terbuka untuk keluarga, guru, dan komunitas.",
  openGraph: {
    title: "Resource Hub - Materi Bacaan & Perkakas Edukatif Terbuka",
    description:
      "Kurasi materi bacaan berkualitas, lembar kerja nalar kritis, dan perkakas digital terbuka untuk keluarga, guru, dan komunitas.",
  },
};

export default async function ResourcePage() {
  const resources = await getResources();
  return <ResourceListClient initialResources={resources} />;
}

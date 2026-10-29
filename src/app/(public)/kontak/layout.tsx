import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami - Aspirasi, Kolaborasi & Pertanyaan",
  description:
    "Kirimkan aspirasi, pertanyaan, atau tawaran kolaborasi program literasi bersama tim Rumah Literasi.",
  openGraph: {
    title: "Hubungi Kami - Aspirasi, Kolaborasi & Pertanyaan - Rumah Literasi",
    description:
      "Kirimkan aspirasi, pertanyaan, atau tawaran kolaborasi program literasi bersama tim Rumah Literasi.",
  },
};

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

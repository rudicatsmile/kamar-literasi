import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami - Aspirasi, Kolaborasi & Pertanyaan",
  description:
    "Kirimkan aspirasi, pertanyaan, atau tawaran kolaborasi program literasi bersama tim Masyarakat Literasi.",
  openGraph: {
    title: "Hubungi Kami - Aspirasi, Kolaborasi & Pertanyaan - Masyarakat Literasi",
    description:
      "Kirimkan aspirasi, pertanyaan, atau tawaran kolaborasi program literasi bersama tim Masyarakat Literasi.",
  },
};

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

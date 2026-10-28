import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berlangganan Buletin WhatsApp",
  description:
    "Dapatkan kurasi wawasan bacaan, ringkasan esai pilihan, dan kabar materi belajar gratis langsung di WhatsApp Anda setiap pekan.",
  openGraph: {
    title: "Berlangganan Buletin WhatsApp - Masyarakat Literasi",
    description:
      "Dapatkan kurasi wawasan bacaan, ringkasan esai pilihan, dan kabar materi belajar gratis langsung di WhatsApp Anda setiap pekan.",
  },
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

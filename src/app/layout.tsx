import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rumahliterasi.web.id";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Masyarakat Literasi - Gerakan Membaca & Berpikir Kritis Indonesia",
    template: "%s | Masyarakat Literasi",
  },
  description:
    "Platform edukatif untuk meningkatkan kesadaran literasi membaca, digital, berpikir kritis, dan sumber materi belajar gratis di Indonesia.",
  keywords: [
    "literasi indonesia",
    "minat baca",
    "berpikir kritis",
    "literasi digital",
    "tantangan membaca",
    "buku indonesia",
    "resource pendidikan",
  ],
  authors: [{ name: "Redaksi Masyarakat Literasi" }],
  creator: "Masyarakat Literasi",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: baseUrl,
    siteName: "Masyarakat Literasi",
    title: "Masyarakat Literasi - Gerakan Membaca & Berpikir Kritis Indonesia",
    description:
      "Platform edukatif untuk meningkatkan kesadaran literasi membaca, digital, berpikir kritis, dan sumber materi belajar gratis di Indonesia.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Masyarakat Literasi Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Masyarakat Literasi - Gerakan Membaca & Berpikir Kritis Indonesia",
    description:
      "Platform edukatif untuk meningkatkan kesadaran literasi membaca, digital, berpikir kritis, dan sumber materi belajar gratis di Indonesia.",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <OrganizationJsonLd />
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {/* Skip to Content for WCAG Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-md focus:outline-none"
        >
          Lewati ke konten utama
        </a>

        <div id="main-content" className="flex-1 flex flex-col">
          {children}
        </div>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

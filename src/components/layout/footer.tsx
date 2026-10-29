import * as React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getFooterSettings } from "@/lib/data";
import { FooterNewsletter } from "./footer-newsletter";

export async function Footer() {
  const footer = await getFooterSettings();

  return (
    <footer className="mt-auto border-t border-border bg-surface text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand & Mission Statement (Dynamic from Database) */}
          <div className="space-y-4 md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white shrink-0">
                <BookOpen className="h-4 w-4 stroke-[1.8]" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                {footer.title}
              </span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              {footer.description}
            </p>
            <div className="text-xs text-muted-foreground">
              {footer.tagline}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/artikel" className="hover:text-primary transition-colors">
                  Artikel & Esai
                </Link>
              </li>
              <li>
                <Link href="/statistik" className="hover:text-primary transition-colors">
                  Statistik & Fakta Literasi
                </Link>
              </li>
              <li>
                <Link href="/resource" className="hover:text-primary transition-colors">
                  Resource Hub (Gratis)
                </Link>
              </li>
              <li>
                <Link href="/mulai-sekarang" className="hover:text-primary transition-colors">
                  Tantangan 7/21/30 Hari
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-primary transition-colors">
                  Tentang & Visi Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-primary transition-colors">
                  Hubungi Tim Redaksi
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box (Client Component) */}
          <FooterNewsletter />
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row text-xs text-muted-foreground">
          <div>
            &copy; {new Date().getFullYear()} {footer.title}. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/tentang" className="hover:text-primary transition-colors">
              Visi & Misi
            </Link>
            <Link href="/kontak" className="hover:text-primary transition-colors">
              Kerja Sama
            </Link>
            <Link href="/admin" className="hover:text-primary font-medium transition-colors">
              Akses Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

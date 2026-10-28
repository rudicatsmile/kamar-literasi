"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/artikel", label: "Artikel" },
  { href: "/statistik", label: "Statistik & Fakta" },
  { href: "/resource", label: "Resource Hub" },
  { href: "/mulai-sekarang", label: "Mulai Sekarang" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

function NavbarContent() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Masyarakat Literasi
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Edukasi & Nalar Kritis
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive
                    ? "text-primary font-semibold underline underline-offset-8 decoration-primary decoration-2"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA / Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-medium">
              Masuk
            </Button>
          </Link>
          <Link href="/mulai-sekarang">
            <Button size="sm" className="gap-1.5 shadow-xs">
              <span>Ikuti Tantangan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden text-foreground hover:bg-muted"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-white px-4 py-4 md:hidden animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Masuk ke Akun
                </Button>
              </Link>
              <Link href="/mulai-sekarang" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Mulai Tantangan Literasi
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Navbar() {
  return (
    <React.Suspense fallback={<header className="h-16 border-b border-border bg-white" />}>
      <NavbarContent />
    </React.Suspense>
  );
}


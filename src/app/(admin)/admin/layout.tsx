"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  FolderArchive,
  BarChart2,
  Trophy,
  Lightbulb,
  FileEdit,
  Users,
  Send,
  Mail,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ADMIN_MODULES = [
  { href: "/admin", label: "Ringkasan Dasbor", icon: LayoutDashboard },
  { href: "/admin/artikel", label: "Kelola Artikel", icon: FileText },
  { href: "/admin/kategori", label: "Kategori Artikel", icon: FolderTree },
  { href: "/admin/resource", label: "Resource Hub", icon: FolderArchive },
  { href: "/admin/statistik", label: "Statistik & Fakta", icon: BarChart2 },
  { href: "/admin/tantangan", label: "Tantangan Literasi", icon: Trophy },
  { href: "/admin/tips", label: "Tips Praktis", icon: Lightbulb },
  { href: "/admin/halaman", label: "Halaman Statis", icon: FileEdit },
  { href: "/admin/subscriber", label: "Subscriber WhatsApp", icon: Users },
  { href: "/admin/broadcast", label: "Broadcast Pesan", icon: Send },
  { href: "/admin/pesan", label: "Pesan Kontak", icon: Mail },
];

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Admin Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-white lg:flex">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-white">
              <ShieldCheck className="h-4 w-4 stroke-[1.8]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-foreground text-sm">
                Panel Redaksi
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                Masyarakat Literasi
              </span>
            </div>
          </Link>
        </div>

        {/* Status Mode Badge */}
        <div className="px-4 py-3 border-b border-border bg-emerald-50/50 flex items-center justify-between">
          <span className="text-xs text-emerald-900 font-medium flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Supabase Live
          </span>
          <Badge variant="success" className="text-[10px] py-0 px-1.5">
            Admin
          </Badge>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Modul Manajemen
          </p>
          {ADMIN_MODULES.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-border p-3 space-y-1.5">
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between text-xs"
            >
              <span>Buka Website Publik</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </Link>
          <form action={async () => {
            const { signOutAction } = await import("@/app/actions/auth");
            await signOutAction();
          }}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar Mode Admin</span>
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-serif font-bold text-foreground text-sm">
              Panel Admin
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <span>/</span>
            <span className="font-medium text-foreground">
              {ADMIN_MODULES.find((m) =>
                m.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(m.href)
              )?.label || "Manajemen"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
              <span>Ke Beranda</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                AD
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-foreground">Admin Redaksi</p>
                <p className="text-muted-foreground text-[10px]">Super Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Admin Sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-50 flex w-72 flex-col bg-white p-4 shadow-xl border-r border-border">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="font-serif font-bold text-base">Modul Admin</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md p-1 hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-3 flex-1 space-y-1 overflow-y-auto">
                {ADMIN_MODULES.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-border">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Kembali ke Web Publik</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Admin Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </React.Suspense>
  );
}


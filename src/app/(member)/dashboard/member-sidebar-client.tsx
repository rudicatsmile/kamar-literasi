"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Bookmark,
  User,
  Compass,
  LogOut,
  Menu,
  X,
  BookOpen,
  Flame,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/actions/auth";

const MEMBER_LINKS = [
  { href: "/dashboard", label: "Dasbor Utama", icon: LayoutDashboard },
  { href: "/dashboard/tantangan", label: "Tantangan Saya", icon: Trophy },
  { href: "/dashboard/favorit", label: "Resource Favorit", icon: Bookmark },
  { href: "/dashboard/profil", label: "Profil & Pengaturan", icon: User },
];

interface UserProfileData {
  id?: string;
  full_name: string;
  email: string;
  whatsapp?: string;
  avatar_url: string;
  role: string;
  reminder_enabled?: boolean;
  streak: number;
  favorite_resource_ids?: string[];
}

export function MemberSidebarClient({
  children,
  userProfile,
}: {
  children: React.ReactNode;
  userProfile: UserProfileData;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOutAction();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-white md:flex">
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
              <BookOpen className="h-4 w-4 stroke-[1.8]" />
            </div>
            <span className="font-serif font-bold text-foreground">
              Masyarakat Literasi
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <img
              src={userProfile.avatar_url}
              alt={userProfile.full_name}
              className="h-10 w-10 rounded-full object-cover border border-border"
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {userProfile.full_name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="accent" className="text-[10px] py-0 px-1.5 gap-1 font-medium">
                  <Flame className="h-3 w-3 text-amber-600 fill-amber-500" />
                  <span>Streak {userProfile.streak} Hari</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu Anggota
          </p>
          {MEMBER_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {userProfile.role === "admin" && (
            <div className="pt-3 pb-1">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-xs"
              >
                <ShieldCheck className="h-4 w-4 text-amber-700" />
                <span>Buka Panel Admin</span>
              </Link>
            </div>
          )}

          <div className="pt-6">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Jelajah Publik
            </p>
            <Link
              href="/mulai-sekarang"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-3">
                <Compass className="h-4 w-4" />
                <span>Katalog Tantangan</span>
              </span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>
            <Link
              href="/resource"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-3">
                <BookOpen className="h-4 w-4" />
                <span>Resource Hub</span>
              </span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar Sesi</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="font-serif text-lg font-bold text-foreground capitalize">
              {MEMBER_LINKS.find((l) =>
                l.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(l.href)
              )?.label || "Ruang Anggota"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/mulai-sekarang">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 text-xs">
                <Compass className="h-3.5 w-3.5" />
                <span>Ikuti Tantangan Baru</span>
              </Button>
            </Link>
            <img
              src={userProfile.avatar_url}
              alt={userProfile.full_name}
              className="h-8 w-8 rounded-full object-cover border border-border"
            />
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white p-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="font-serif font-bold text-foreground">
                  Masyarakat Literasi
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile User Card */}
              <div className="py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <img
                    src={userProfile.avatar_url}
                    alt={userProfile.full_name}
                    className="h-10 w-10 rounded-full object-cover border border-border"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {userProfile.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{userProfile.email}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 space-y-1 py-4">
                {MEMBER_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="border-t border-border pt-4">
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

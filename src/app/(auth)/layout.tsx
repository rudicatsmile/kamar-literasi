import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-4 sm:p-6 md:p-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-4 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda Utama</span>
        </Link>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white shadow-xs">
            <BookOpen className="h-5 w-5 stroke-[1.8]" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Masyarakat Literasi
          </span>
        </Link>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Ruang belajar mandiri, refleksi gagasan, dan pembiasaan membaca.
        </p>
      </div>

      <div className="w-full max-w-md">{children}</div>

      <footer className="mt-8 text-center text-xs text-muted-foreground">
        &copy; 2026 Masyarakat Literasi Indonesia
      </footer>
    </div>
  );
}

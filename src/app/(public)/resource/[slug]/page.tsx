import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Bookmark,
  Share2,
  FileText,
  Star,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getResourceBySlug, getResources } from "@/lib/data";
import { dummyResources } from "@/lib/dummy-data";
import { ResourceActionButtons } from "./resource-actions";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export async function generateStaticParams() {
  const resources = await getResources();
  return resources.map((resource) => ({
    slug: resource.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    return {
      title: "Materi Tidak Ditemukan - Rumah Literasi",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rumahliterasi.web.id";
  const url = `${baseUrl}/resource/${resource.slug}`;

  return {
    title: `${resource.title} - Resource Hub Rumah Literasi`,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      url,
      siteName: "Rumah Literasi",
      images: [
        {
          url: resource.cover_url,
          width: 800,
          height: 600,
          alt: resource.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resource.title,
      description: resource.description,
      images: [resource.cover_url],
    },
  };
}

export default async function DetailResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    return notFound();
  }

  const allResources = await getResources();
  const relatedResources = allResources
    .filter((r) => r.id !== resource.id)
    .slice(0, 3);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rumahliterasi.web.id";

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: baseUrl },
          { name: "Resource Hub", url: `${baseUrl}/resource` },
          { name: resource.title, url: `${baseUrl}/resource/${resource.slug}` },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/resource"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Resource Hub</span>
          </Link>
        </div>

        {/* Header Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
          {/* Cover Image / Thumbnail */}
          <div className="md:col-span-5 overflow-hidden rounded-md border border-border bg-muted">
            <img
              src={resource.cover_url}
              alt={resource.title}
              className="w-full aspect-4/3 object-cover"
            />
          </div>

          {/* Details & Meta */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs uppercase font-semibold">
                Format: {resource.type.toUpperCase()}
              </Badge>
              <Badge variant="secondary" className="capitalize text-xs">
                Kategori Usia: {resource.age_category}
              </Badge>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {resource.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building className="h-3.5 w-3.5" />
                {resource.publisher}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {resource.download_count.toLocaleString("id-ID")} kali diakses
              </span>
              {resource.rating && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    {resource.rating}
                  </span>
                </>
              )}
            </div>

            {/* Action buttons (Client interactive) */}
            <ResourceActionButtons resource={resource} />
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mt-12 border-t border-border pt-8 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Tentang Materi Ini
          </h2>
          <div className="max-w-[68ch] text-base leading-relaxed text-foreground space-y-4">
            <p>{resource.description}</p>
            <p>
              Materi ini telah dikurasi oleh tim Rumah Literasi untuk memastikan
              kualitas informasi, kebebasan dari konten komersial terselubung, dan
              kesesuaian dengan kurikulum literasi nalar kritis di Indonesia.
            </p>
          </div>

          <div className="rounded-md border border-border bg-surface p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">Lisensi Akses Bebas</p>
              <p>
                Materi ini dilindungi hak cipta oleh penerbit resmi dan disediakan untuk
                kepentingan pendidikan non-komersial. Dilarang memperjualbelikan materi ini.
              </p>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        <div className="mt-16 border-t border-border pt-12">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
            Materi Terkait Lainnya
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedResources.map((rel) => (
              <div
                key={rel.id}
                className="group flex flex-col rounded-md border border-border bg-white p-4 hover:border-primary/40 transition-colors"
              >
                <Badge variant="outline" className="w-fit text-[10px] mb-2 uppercase">
                  {rel.type}
                </Badge>
                <Link href={`/resource/${rel.slug}`}>
                  <h4 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                  {rel.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

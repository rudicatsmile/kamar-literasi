import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getArticleBySlug, getArticles } from "@/lib/data";
import { dummyArticles } from "@/lib/dummy-data";
import { ShareButtons } from "./share-buttons";
import { ReadingControls } from "@/components/reading/reading-controls";
import { ReadingTracker } from "@/components/reading/reading-tracker";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

function getInitials(name: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan - Rumah Literasi",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rumahliterasi.web.id";
  const url = `${baseUrl}/artikel/${article.slug}`;

  return {
    title: `${article.title} - Rumah Literasi`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      siteName: "Rumah Literasi",
      images: [
        {
          url: article.cover_url,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author_name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.cover_url],
    },
  };
}

export default async function DetailArtikelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return notFound();
  }

  const allArticles = await getArticles();
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rumahliterasi.web.id";

  return (
    <article className="rd-surface min-h-[70vh] py-12 md:py-20">
      <ReadingControls />
      <ReadingTracker
        articleId={article.id}
        estimatedTimeMinutes={article.reading_time}
      />
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        url={`${baseUrl}/artikel/${article.slug}`}
        imageUrl={article.cover_url}
        datePublished={article.published_at}
        authorName={article.author_name}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: baseUrl },
          { name: "Artikel", url: `${baseUrl}/artikel` },
          { name: article.title, url: `${baseUrl}/artikel/${article.slug}` },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Breadcrumb / Back button */}
        <div data-zen-hide className="mb-8 flex items-center justify-between">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-rd-muted hover:text-rd-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Semua Artikel</span>
          </Link>
          <Badge
            variant="secondary"
            className="font-medium text-xs bg-rd-surface text-rd-muted border border-rd-border hover:bg-rd-border"
          >
            {article.category_name}
          </Badge>
        </div>

        {/* Title & Excerpt */}
        <header className="space-y-4">
          <h1 className="rd-title font-bold tracking-tight text-rd-fg">{article.title}</h1>

          <p className="rd-excerpt text-rd-muted italic border-l-2 border-rd-accent/50 pl-4 py-1">
            &ldquo;{article.excerpt}&rdquo;
          </p>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-rd-border py-4">
            <div className="flex items-center gap-3">
              {article.author_avatar ? (
                <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-rd-border shadow-xs bg-rd-surface">
                  <Image
                    src={article.author_avatar}
                    alt={article.author_name}
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rd-accent/10 text-rd-accent font-bold text-xs border border-rd-accent/20 uppercase tracking-wider">
                  {getInitials(article.author_name)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-rd-fg">
                  {article.author_name}
                </p>
                <p className="text-xs text-rd-muted">
                  {article.author_role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-rd-muted">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {article.reading_time} menit baca
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(article.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="my-8 overflow-hidden rounded-md border border-rd-border bg-rd-surface">
          <img
            src={article.cover_url}
            alt={article.title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>

        {/* Content Body (Strict max-w-[68ch] as per PRD Bab 4) */}
        <div className="rd-article mx-auto max-w-[68ch] space-y-6 pt-4">
          {article.content.split("\n\n").map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith("### ")) {
              return (
                <h3
                  key={index}
                  className="tracking-tight text-rd-fg pt-6 pb-2"
                >
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            if (trimmed.startsWith("> ")) {
              return (
                <blockquote
                  key={index}
                  className="my-6 rounded-md border-l-4 border-rd-accent bg-rd-surface p-4 italic text-rd-fg"
                >
                  {trimmed.replace("> ", "")}
                </blockquote>
              );
            }

            if (trimmed.startsWith("1. ") || trimmed.startsWith("- ")) {
              const lines = trimmed.split("\n");
              return (
                <ul key={index} className="list-disc pl-6 space-y-2">
                  {lines.map((line, liIdx) => (
                    <li key={liIdx} className="text-rd-fg">
                      {line.replace(/^(\d+\.|\-)\s+/, "")}
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={index} className="text-rd-fg">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Article Footer & Interactive Share Buttons */}
        <div className="mx-auto max-w-[68ch] mt-12 pt-8 border-t border-rd-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
              Bagikan Esai Ini:
            </span>
            <ShareButtons title={article.title} />
          </div>
        </div>

        {/* Related Articles */}
        <div data-zen-hide className="mt-20 border-t border-rd-border pt-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl font-bold text-rd-fg">
              Artikel Terkait Lainnya
            </h3>
            <Link
              href="/artikel"
              className="text-xs font-semibold text-rd-accent hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                className="group flex flex-col rounded-md border border-rd-border bg-rd-surface p-4 transition-all hover:border-rd-accent/40"
              >
                <div className="text-[11px] text-rd-muted mb-1">
                  {rel.category_name}
                </div>
                <Link href={`/artikel/${rel.slug}`}>
                  <h4 className="font-serif text-base font-semibold text-rd-fg group-hover:text-rd-accent transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
                <span className="mt-auto pt-3 text-[11px] text-rd-muted">
                  {rel.reading_time} menit baca
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft } from "symbols-react";

import { ArticleEnhancements } from "@/components/writings/article-enhancements";
import { TableOfContents } from "@/components/writings/table-of-contents";
import { Button } from "@/components/ui/button";
import {
  formatWritingDate,
  getWritingBySlug,
  getWritingSlugs,
} from "@/lib/writings";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type WritingPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getWritingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const writing = await getWritingBySlug(slug);

  if (!writing) {
    return {};
  }

  return {
    title: `${writing.title} · Steven Sarmiento`,
    description: writing.description,
    alternates: {
      canonical: `${SITE_URL}/writings/${writing.slug}`,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      siteName: SITE_NAME,
      title: writing.title,
      description: writing.description,
      publishedTime: writing.publishedAt,
      modifiedTime: writing.updatedAt,
      authors: [SITE_NAME],
      url: `${SITE_URL}/writings/${writing.slug}`,
    },
  };
}

export default async function WritingPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const writing = await getWritingBySlug(slug);

  if (!writing) {
    notFound();
  }

  const { Content } = writing;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: writing.title,
    description: writing.description,
    datePublished: writing.publishedAt,
    dateModified: writing.updatedAt ?? writing.publishedAt,
    author: {
      "@type": "Person",
      name: "Steven Sarmiento",
    },
    mainEntityOfPage: `${SITE_URL}/writings/${writing.slug}`,
  };

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#f4f1ea] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="relative mx-auto min-h-dvh w-full max-w-[1000px]">
        <div className="relative mx-auto min-h-dvh w-full max-w-[620px]">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="absolute left-4 top-6 z-20 rounded-xl bg-white/45 text-zinc-700 shadow-sm ring-1 ring-black/10 transition-[background-color,transform,color] duration-150 ease-out hover:bg-white/80 hover:text-zinc-950 active:scale-[0.97] lg:left-0 lg:-translate-x-[calc(100%+16px)]"
          >
            <Link href="/writings" aria-label="Back to Musings">
              <IconArrowLeft className="h-4 w-4 fill-current" />
            </Link>
          </Button>

          <article className="long-dashed-rails min-h-dvh px-6 pb-24 pt-6 sm:px-8">
            <header className="mx-auto max-w-[556px] border-b border-black/10 pb-10 pl-12 lg:pl-0">
              <h1 className="text-balance font-nuvo text-[20px] font-bold leading-[1.76] tracking-[-0.025em] text-zinc-950">
                {writing.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-zinc-500">
                <time dateTime={writing.publishedAt}>
                  {formatWritingDate(writing.publishedAt)}
                </time>
                {writing.updatedAt ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      Updated{" "}
                      <time dateTime={writing.updatedAt}>
                        {formatWritingDate(writing.updatedAt)}
                      </time>
                    </span>
                  </>
                ) : null}
              </div>
            </header>

            <ArticleEnhancements>
              <Content />
            </ArticleEnhancements>

            <footer className="mx-auto mt-20 max-w-[556px] border-t border-black/10 pt-8">
              <Link
                href="/writings"
                className="inline-flex items-center gap-2 font-nuvo text-xs italic text-zinc-600 transition-[color,transform] duration-150 ease-out hover:text-zinc-950 active:scale-[0.97]"
              >
                <span aria-hidden="true">←</span>
                All Writings
              </Link>
            </footer>
          </article>
        </div>

        <TableOfContents />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowLeft } from "symbols-react";

import { Button } from "@/components/ui/button";
import { formatWritingDate, getAllWritings } from "@/lib/writings";
import { SITE_NAME, WRITINGS_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Musings · Steven Sarmiento",
  description: WRITINGS_DESCRIPTION,
  alternates: {
    canonical: "/writings",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/writings",
    siteName: SITE_NAME,
    title: "Musings",
    description: WRITINGS_DESCRIPTION,
  },
};

export default async function WritingsPage() {
  const writings = await getAllWritings();

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#f4f1ea] text-zinc-950">
      <div className="relative mx-auto min-h-dvh w-full max-w-[620px]">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="absolute left-4 top-6 z-20 rounded-xl bg-white/45 text-zinc-700 shadow-sm ring-1 ring-black/10 transition-[background-color,transform,color] duration-150 ease-out hover:bg-white/80 hover:text-zinc-950 active:scale-[0.97] lg:left-0 lg:-translate-x-[calc(100%+16px)]"
        >
          <Link href="/" aria-label="Back home">
            <IconArrowLeft className="h-4 w-4 fill-current" />
          </Link>
        </Button>

        <div className="long-dashed-rails min-h-dvh px-6 pb-24 pt-8 sm:px-8">
          <header className="mx-auto max-w-[556px] border-b border-black/10 pb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Notes to self
            </p>
            <p className="max-w-md text-pretty text-[16px] leading-7 text-zinc-600">
              Loose thoughts on life, design, engineering, and the details that make me feel alive.
            </p>
          </header>

          <section className="mx-auto max-w-[556px]" aria-label="Published musings">
            {writings.length > 0 ? (
              <ol>
                {writings.map((writing) => (
                  <li key={writing.slug} className="border-b border-black/10">
                    <Link
                      href={`/writings/${writing.slug}`}
                      className="group block rounded-lg py-3 transition-transform duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b95f65] active:scale-[0.99]"
                    >
                      <div className="flex items-baseline justify-between gap-5">
                        <h2 className="font-nuvo text-sm leading-tight text-zinc-900 transition-colors duration-75 ease-out group-hover:text-[#b95f65] group-focus-visible:text-[#b95f65]">
                          {writing.title}
                        </h2>
                        <time
                          dateTime={writing.publishedAt}
                          className="shrink-0 font-mono text-sm text-zinc-500"
                        >
                          {formatWritingDate(writing.publishedAt)}
                        </time>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="py-10 font-mono text-sm text-zinc-500">
                Nothing published yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

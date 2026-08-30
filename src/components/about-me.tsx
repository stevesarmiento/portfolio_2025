"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { IconScribbleVariable } from "symbols-react";

import { AboutActions } from "@/components/about-actions";
import { SolanaLogo } from "@/components/solana-logo";

interface AboutRow {
  name: string;
  href: string;
  year?: string;
  image?: string;
  internal?: boolean;
  showIcon?: boolean;
}

export interface HomepageWriting {
  slug: string;
  title: string;
  publishedAt: string;
}

const forFun: AboutRow[] = [
  {
    name: "Aggr",
    href: "https://aggr.watch",
    image: "/img/work-svela.png",
  },
  {
    name: "Senko",
    href: "https://apps.apple.com/us/app/senko-simple-pro-camera/id6584516223",
    image: "/img/work-senko.png",
  },
  {
    name: "Symbols",
    href: "https://symbols.dev",
    image: "/img/work-symbols.png",
  },
];

interface InlineLinkProps {
  label: string;
  href: string;
  image: string;
}

function InlineLink({ label, href, image }: InlineLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="expanding-link inline-flex items-baseline gap-1 align-baseline font-medium text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#df8f93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea]"
    >
      {image === "solana" ? (
        <SolanaLogo className="size-3.5 shrink-0" />
      ) : (
        <Image
          src={image}
          alt=""
          width={14}
          height={14}
          className="size-4 shrink-0 rounded-[5px] object-cover ring-1 ring-black/10"
        />
      )}
      <span>{label}</span>
    </a>
  );
}

function RowIcon({ item }: { item: AboutRow }) {
  if (item.image) {
    return (
      <Image
        src={item.image}
        alt=""
        width={24}
        height={24}
        className="size-6 shrink-0 rounded-[8px]  object-cover ring-1 ring-black/10 shadow-sm shadow-black/20"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-white/65 ring-1 ring-black/10"
    >
      <IconScribbleVariable className="size-3.5 fill-zinc-500" />
    </span>
  );
}

function RowContents({ item }: { item: AboutRow }) {
  return (
    <>
      {item.showIcon !== false ? <RowIcon item={item} /> : null}
      <span className="min-w-0 flex-1 truncate text-sm text-zinc-800 transition-colors duration-150 ease-out group-hover:text-zinc-950">
        {item.name}
      </span>
      {item.year ? (
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-zinc-500">
          {item.year}
        </span>
      ) : null}
      {!item.internal ? (
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-3.5 shrink-0 text-zinc-950 opacity-25 transition-[color,opacity] duration-150 ease-out group-hover:text-rose-400 group-hover:opacity-100 group-focus-visible:text-rose-400 group-focus-visible:opacity-100"
        >
          <path
            d="M4.86619 10.6763C4.44263 11.1046 3.75197 11.1083 3.32351 10.6849C2.89556 10.2613 2.89165 9.57055 3.31499 9.14222L7.22 5.18188L4.74545 5.18188C4.14292 5.18188 3.65449 4.69343 3.65449 4.09094C3.65473 3.48859 4.14307 3 4.74545 3L9.90904 3C10.1983 3 10.4758 3.1152 10.6804 3.31957C10.8849 3.52409 10.9999 3.80177 11 4.09094L11 9.18199C11 9.78449 10.5116 10.2729 9.90904 10.2729C9.30652 10.2729 8.81808 9.78449 8.81808 9.18199L8.81808 6.66919L4.86619 10.6763Z"
            fill="currentColor"
          />
        </svg>
      ) : null}
    </>
  );
}

function RowLink({ item }: { item: AboutRow }) {
  const className =
    "group -mx-2 flex min-h-10 items-center gap-2.5 rounded-lg px-2 transition-[background-color,transform] duration-150 ease-out hover:bg-white/55 active:scale-[0.99] focus-visible:bg-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#df8f93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea] motion-reduce:transform-none";

  if (item.internal) {
    return (
      <Link href={item.href} className={className}>
        <RowContents item={item} />
      </Link>
    );
  }

  return (
    <a href={item.href} target="_blank" rel="noreferrer" className={className}>
      <RowContents item={item} />
    </a>
  );
}

function LinkSection({
  title,
  items,
  shouldReduceMotion,
}: {
  title: string;
  items: AboutRow[];
  shouldReduceMotion: boolean | null;
}) {
  const sectionId = `about-${title.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <motion.section
      variants={{
        hidden: {
          opacity: 0,
          transform: shouldReduceMotion ? "none" : "translateY(6px)",
        },
        visible: {
          opacity: 1,
          transform: "translateY(0px)",
          transition: {
            duration: shouldReduceMotion ? 0.16 : 0.24,
            ease: [0.23, 1, 0.32, 1] as const,
          },
        },
      }}
      aria-labelledby={sectionId}
    >
      <h2
        id={sectionId}
        className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500"
      >
        {title}
      </h2>
      <ul className="long-dashed-list">
        {items.map((item) => (
          <li key={item.name} className="py-1">
            <RowLink item={item} />
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

export default function AboutMe({ writings }: { writings: HomepageWriting[] }) {
  const shouldReduceMotion = useReducedMotion();
  const writingRows: AboutRow[] = writings.map((writing) => ({
    name: writing.title,
    href: `/writings/${writing.slug}`,
    year: writing.publishedAt.slice(0, 4),
    internal: true,
    showIcon: false,
  }));
  const visibleTransform = shouldReduceMotion ? "none" : "translateY(0px)";
  const hiddenTransform = shouldReduceMotion ? "none" : "translateY(6px)";
  const paragraphVariants = {
    hidden: {
      opacity: 0,
      filter: shouldReduceMotion ? "none" : "blur(3px)",
      transform: hiddenTransform,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transform: visibleTransform,
      transition: {
        duration: shouldReduceMotion ? 0.16 : 0.24,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
  };

  return (
    <div className="flex w-full flex-col">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: shouldReduceMotion ? 0.7 : 0.72,
              staggerChildren: shouldReduceMotion ? 0.04 : 0.07,
            },
          },
        }}
        className="mt-6 flex w-full flex-col gap-y-6 px-4 font-nuvo"
      >
        <motion.p
          variants={paragraphVariants}
          className="text-lg leading-relaxed text-zinc-950"
        >
          Pushing towards building thoughtful experiences and solving interesting problems with code.
        </motion.p>

        <motion.div variants={paragraphVariants}>
          <AboutActions />
        </motion.div>

        <div className="flex flex-col gap-y-4 text-sm leading-6 text-zinc-800">
          <motion.p variants={paragraphVariants}>
            Today I work for the Solana Foundation building products and developer tooling for the Solana ecosystem.
          </motion.p>

          <motion.p variants={paragraphVariants}>
            Previously, I worked with startups including{" "}
            <InlineLink
              label="MetaDAO"
              href="https://metadao.fi"
              image="/img/work-metadao.png"
            />
            ,{" "}
            <InlineLink
              label="Triton"
              href="https://triton.one"
              image="/img/work-triton.png"
            />
            , and{" "}
            <InlineLink
              label="Vapi"
              href="https://vapi.ai"
              image="/img/work-vapi.png"
            />
            {" "}across product, design, and engineering. Before that, I was a contributor to{" "}
            <InlineLink
              label="Mango"
              href="https://x.com/mangomarkets"
              image="/img/work-mango.png"
            />
            {" "}and worked on the marketing team at{" "}
            <InlineLink
              label="BRD"
              href="https://www.nasdaq.com/articles/coinbase-acquires-crypto-wallet-firm-brd"
              image="/img/work-brd.png"
            />
            .
          </motion.p>
        </div>

        <LinkSection
          title="For Fun"
          items={forFun}
          shouldReduceMotion={shouldReduceMotion}
        />
        <LinkSection
          title="Writings"
          items={writingRows}
          shouldReduceMotion={shouldReduceMotion}
        />
      </motion.div>
    </div>
  );
}

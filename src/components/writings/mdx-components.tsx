import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

import { cn } from "@/lib/utils";

type CalloutProps = {
  children: ReactNode;
  title?: string;
  tone?: "note" | "idea" | "caution";
};

export function Callout({
  children,
  title = "A small note",
  tone = "note",
}: CalloutProps) {
  return (
    <aside className="writing-callout" data-tone={tone}>
      <p className="writing-callout-title">{title}</p>
      <div>{children}</div>
    </aside>
  );
}

type FigureProps = {
  children: ReactNode;
  caption?: ReactNode;
  bleed?: boolean;
};

export function Figure({ children, caption, bleed = false }: FigureProps) {
  return (
    <figure className={cn("writing-figure", bleed && "writing-figure-bleed")}>
      {children}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function DemoFrame({
  children,
  title = "Interactive example",
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <section className="writing-demo-frame" aria-label={title}>
      <div className="writing-demo-frame-label">{title}</div>
      <div className="writing-demo-frame-content">{children}</div>
    </section>
  );
}

export function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="writing-section-divider" aria-hidden="true">
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export function PropertyList({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <dl className="writing-property-list">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function WritingLink({
  href = "",
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const isExternal = /^https?:\/\//.test(href);
  const linkClassName = cn("writing-link", className);

  if (isInternal) {
    return (
      <Link href={href} className={linkClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={linkClassName}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

function WritingImage({
  alt = "",
  className,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  // Markdown images do not carry intrinsic dimensions, so a native image is
  // the most honest default. Authors still provide meaningful alt text.
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} className={cn("writing-image", className)} {...props} />;
}

export const writingMDXComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1 className={cn("writing-prose-h1", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("writing-prose-h2", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("writing-prose-h3", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("writing-paragraph", className)} {...props} />
  ),
  a: WritingLink,
  ul: ({ className, ...props }) => (
    <ul className={cn("writing-list writing-list-unordered", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("writing-list writing-list-ordered", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("writing-list-item", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote className={cn("writing-blockquote", className)} {...props} />
  ),
  code: ({ className, ...props }) => (
    <code className={cn("writing-code", className)} {...props} />
  ),
  pre: ({ className, ...props }) => (
    <pre className={cn("writing-pre", className)} {...props} />
  ),
  table: ({ className, ...props }) => (
    <div className="writing-table-scroll">
      <table className={cn("writing-table", className)} {...props} />
    </div>
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("writing-rule", className)} {...props} />
  ),
  img: WritingImage,
  Callout,
  Figure,
  DemoFrame,
  SectionDivider,
  PropertyList,
};

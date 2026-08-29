"use client";

import { useEffect, useState } from "react";

type ArticleHeading = {
  id: string;
  label: string;
  level: 2 | 3;
};

export function TableOfContents() {
  const [headings, setHeadings] = useState<ArticleHeading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(
        "#writing-content h2[id], #writing-content h3[id]",
      ),
    ).filter((element) => !element.closest("[data-footnotes]"));
    const nextHeadings = elements.map((element) => ({
      id: element.id,
      label: element.textContent?.replace(/#$/, "").trim() ?? element.id,
      level: element.tagName === "H2" ? (2 as const) : (3 as const),
    }));

    const frame = window.requestAnimationFrame(() => {
      setHeadings(nextHeadings);
      setActiveId(nextHeadings[0]?.id ?? "");
    });

    if (nextHeadings.length < 2) {
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries.find((entry) => entry.isIntersecting);
        if (visibleHeading) {
          setActiveId(visibleHeading.target.id);
        }
      },
      {
        rootMargin: "-88px 0px -68% 0px",
        threshold: 0,
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  if (headings.length < 2) {
    return null;
  }

  return (
    <nav className="writing-toc" aria-label="Table of contents">
      <p>On this page</p>
      <ol>
        {headings.map((heading) => (
          <li key={heading.id} data-level={heading.level}>
            <a href={`#${heading.id}`} aria-current={activeId === heading.id ? "location" : undefined}>
              {heading.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

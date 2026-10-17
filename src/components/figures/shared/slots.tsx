"use client";

// Empty solid and line slots that a live loop fills every frame through refs,
// so shaded parts that change shape (rotating discs, arms) never re-render React.

import * as React from "react";
import type { SolidPaths } from "@/components/iso/iso-kit";

export interface SolidNodes {
  fill: SVGPathElement | null;
  shades: (SVGPathElement | null)[];
  top: SVGPathElement | null;
  crease: SVGPathElement | null;
  edge: SVGPathElement | null;
}

export function solidNodes(g: SVGGElement | null): SolidNodes {
  return {
    fill: g?.querySelector(".iso-fill") ?? null,
    shades: [0, 1, 2, 3].map((i) => g?.querySelector(`.iso-shade[data-shade="${i}"]`) ?? null),
    top: g?.querySelector(".iso-top") ?? null,
    crease: g?.querySelector(".iso-crease") ?? null,
    edge: g?.querySelector(".iso-edge") ?? null,
  };
}

export function applySolid(n: SolidNodes | undefined, paths: SolidPaths | null) {
  if (!n || !paths) return;
  n.fill?.setAttribute("d", paths.fill);
  paths.shades.forEach((d, i) => n.shades[i]?.setAttribute("d", d));
  n.top?.setAttribute("d", paths.top);
  n.crease?.setAttribute("d", paths.crease);
  n.edge?.setAttribute("d", paths.outline);
}

export function SolidSlot({
  tone,
  crease = "faint",
  lit,
  className,
  bind,
}: {
  tone: "hi" | "mid" | "lo";
  crease?: "faint" | "lo" | "none";
  lit?: boolean;
  className?: string;
  bind: (g: SVGGElement | null) => void;
}) {
  return (
    <g className={className ? `iso-solid ${className}` : "iso-solid"} data-lit={lit ? "" : undefined} ref={bind}>
      <path className="iso-fill" d="" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} className="iso-shade" data-shade={i} d="" />
      ))}
      <path className="iso-top" d="" />
      {crease === "none" ? null : <path className="iso-line iso-crease" data-tone={crease} d="" />}
      <path className="iso-line iso-edge" data-tone={tone} d="" />
    </g>
  );
}

export const setD = (el: Element | null | undefined, d: string) => {
  if (el && el.getAttribute("d") !== d) el.setAttribute("d", d);
};

export const show = (el: HTMLElement | SVGElement | null | undefined, on: boolean) => {
  if (!el) return;
  const want = on ? "" : "none";
  if (el.style.display !== want) el.style.display = want;
};

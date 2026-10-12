// Browser-side sampling of an SVG file's paths into a point list for the
// Fourier tracer. Uses SVGPathElement.getPointAtLength, so DOM only.

import type { Pt } from "@/components/playground/fourier-outline/outline-math";
import type { SilhouettePath } from "@/components/playground/fourier-outline";

export interface SvgOutline {
  /** Sampled points, y up, in the SVG's user units. */
  points: Pt[];
  /** The original path data, for drawing the silhouette. */
  paths: SilhouettePath[];
  viewBox: string | null;
}

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Fetch an SVG and sample all its <path> elements, in document order, into
 * roughly `samples` points spaced by arc length. Each path gets a share
 * proportional to its length. The result is treated as one closed loop, so
 * jumps between paths become straight connecting strokes.
 */
export async function loadSvgOutline(url: string, samples = 1024): Promise<SvgOutline> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const root = doc.documentElement;
  if (root.nodeName !== "svg") throw new Error(`${url} is not an SVG document`);

  const paths: SilhouettePath[] = Array.from(root.querySelectorAll("path"))
    .map((el) => ({
      d: el.getAttribute("d") ?? "",
      fillRule: el.getAttribute("fill-rule") === "evenodd" ? ("evenodd" as const) : ("nonzero" as const),
    }))
    .filter((p) => p.d.trim().length > 0);

  // Measure in a hidden, attached <svg> so geometry works in every browser.
  const scratch = document.createElementNS(SVG_NS, "svg");
  scratch.setAttribute("aria-hidden", "true");
  scratch.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  document.body.appendChild(scratch);
  try {
    const els = paths.map((p) => {
      const el = document.createElementNS(SVG_NS, "path");
      el.setAttribute("d", p.d);
      scratch.appendChild(el);
      return el;
    });
    const lengths = els.map((el) => el.getTotalLength());
    const total = lengths.reduce((a, b) => a + b, 0);
    const points: Pt[] = [];
    els.forEach((el, i) => {
      const n = Math.max(8, Math.round((samples * lengths[i]) / total));
      for (let j = 0; j < n; j++) {
        const p = el.getPointAtLength((j / n) * lengths[i]);
        points.push([p.x, -p.y]);
      }
    });
    return { points, paths, viewBox: root.getAttribute("viewBox") };
  } finally {
    scratch.remove();
  }
}

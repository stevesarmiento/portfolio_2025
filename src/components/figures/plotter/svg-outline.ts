// Browser-side sampling of an SVG file's paths into contours for the Fourier
// tracer. Uses SVGPathElement.getPointAtLength, so DOM only.

import type { Pt } from "./outline-math";

export interface SilhouettePath {
  d: string;
  fillRule?: "nonzero" | "evenodd";
}

export interface SvgOutline {
  /** One closed contour per subpath, y up, in the SVG's user units. */
  contours: Pt[][];
  /** The original path data, for drawing the silhouette. */
  paths: SilhouettePath[];
  viewBox: string | null;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const MIN_CONTOUR_LENGTH = 0.5; // user units; anything shorter is a stray point
const MIN_SAMPLES = 48;

/** Split path data into subpaths at every absolute/relative moveto. */
function splitSubpaths(d: string): string[] {
  return d
    .split(/(?=[Mm])/)
    .map((s) => s.trim())
    .filter((s) => /^[Mm]/.test(s));
}

function dist(a: Pt, b: Pt): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

/**
 * Greedy nearest-neighbour ordering. Each contour is also rotated so it
 * starts at the sample closest to where the previous contour ended, which
 * keeps every pen-up hop as short as possible.
 */
function orderContours(contours: Pt[][]): Pt[][] {
  if (contours.length < 2) return contours;
  const remaining = new Set(contours.keys());
  const ordered: Pt[][] = [contours[0]];
  remaining.delete(0);
  // A closed contour ends where it starts.
  let end: Pt = contours[0][0];
  while (remaining.size > 0) {
    let bestIdx = -1;
    let bestStart = 0;
    let bestDist = Infinity;
    for (const idx of remaining) {
      const c = contours[idx];
      for (let s = 0; s < c.length; s++) {
        const d = dist(end, c[s]);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = idx;
          bestStart = s;
        }
      }
    }
    const c = contours[bestIdx];
    const rotated = c.slice(bestStart).concat(c.slice(0, bestStart));
    ordered.push(rotated);
    remaining.delete(bestIdx);
    end = rotated[0];
  }
  return ordered;
}

/**
 * Fetch an SVG and sample every subpath of every <path> into its own closed
 * contour, spaced by arc length, roughly `samples` points in total.
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
    const pieces = paths.flatMap((p) => splitSubpaths(p.d));
    const els = pieces.map((d) => {
      const el = document.createElementNS(SVG_NS, "path");
      el.setAttribute("d", d);
      scratch.appendChild(el);
      return el;
    });
    const lengths = els.map((el) => el.getTotalLength());
    const keep = lengths.map((l) => l >= MIN_CONTOUR_LENGTH);
    const total = lengths.reduce((a, l, i) => a + (keep[i] ? l : 0), 0) || 1;

    const contours: Pt[][] = [];
    els.forEach((el, i) => {
      if (!keep[i]) return;
      const n = Math.max(MIN_SAMPLES, Math.round((samples * lengths[i]) / total));
      const c: Pt[] = new Array(n);
      for (let j = 0; j < n; j++) {
        const p = el.getPointAtLength((j / n) * lengths[i]);
        c[j] = [p.x, -p.y];
      }
      contours.push(c);
    });

    return { contours: orderContours(contours), paths, viewBox: root.getAttribute("viewBox") };
  } finally {
    scratch.remove();
  }
}

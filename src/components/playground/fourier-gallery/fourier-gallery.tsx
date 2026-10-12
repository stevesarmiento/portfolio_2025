"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FourierOutline, type OutlineMode } from "@/components/playground/fourier-outline";
import { loadSvgOutline, type SvgOutline } from "./svg-outline";

export interface FourierGalleryProps {
  /** File names inside `basePath`, e.g. ["Frame-1.svg", …]. */
  files: string[];
  basePath?: string;
  mode?: OutlineMode;
  /** N values each icon steps through before the gallery advances. */
  growSteps?: number[];
  maxTerms?: number;
  speed?: number;
  color?: string;
  /** Points sampled from each SVG before the transform. */
  samples?: number;
  /** Share of each loop spent gliding, pen up, between contours. */
  hopFraction?: number;
  autoPlay?: boolean;
  className?: string;
}

function prettyName(file: string): string {
  return file.replace(/\.svg$/i, "").replace(/[-_]+/g, " ");
}

export function FourierGallery({
  files,
  basePath = "/svgs",
  mode = "complex",
  growSteps = [2, 8, 32, 128],
  maxTerms = 128,
  speed = 1.3,
  color,
  samples = 1024,
  hopFraction = 0.05,
  autoPlay = true,
  className,
}: FourierGalleryProps) {
  const [index, setIndex] = useState(0);
  const [outline, setOutline] = useState<SvgOutline | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef(new Map<string, Promise<SvgOutline>>());

  const load = useCallback(
    (file: string) => {
      let p = cache.current.get(file);
      if (!p) {
        p = loadSvgOutline(`${basePath}/${file}`, samples);
        cache.current.set(file, p);
      }
      return p;
    },
    [basePath, samples],
  );

  const file = files[index];

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    load(file)
      .then((o) => {
        if (cancelled) return;
        setOutline(o);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    // warm the next one
    const next = files[(index + 1) % files.length];
    if (next) load(next).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [file, files, index, load]);

  const step = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + files.length) % files.length);
    },
    [files.length],
  );

  const advance = useCallback(() => step(1), [step]);

  if (files.length === 0) {
    return <p className="text-center font-nuvo text-xs text-zinc-500">No SVGs found.</p>;
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {outline ? (
        <FourierOutline
          key={file}
          points={outline.contours}
          silhouettePaths={outline.paths}
          mode={mode}
          maxTerms={maxTerms}
          initialTerms={growSteps[0]}
          growSteps={growSteps}
          onSequenceEnd={advance}
          speed={speed}
          hopFraction={hopFraction}
          color={color}
          autoPlay={autoPlay}
          label={prettyName(file)}
          className="w-full"
        />
      ) : (
        <div
          className="w-full"
          style={{ aspectRatio: mode === "axes" ? "640 / 520" : "640 / 400" }}
          aria-busy
        >
          {error && (
            <p className="p-6 text-center font-nuvo text-xs text-[#b95f65]">{error}</p>
          )}
        </div>
      )}

      <div className="mx-auto flex w-full max-w-md items-center justify-center gap-4 text-zinc-950">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full"
          onClick={() => step(-1)}
          aria-label="Previous shape"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M10 3 5 8l5 5" />
          </svg>
        </Button>
        <span className="min-w-[8rem] text-center font-nuvo text-xs uppercase tracking-widest text-zinc-500">
          {prettyName(file)}
          <span className="ml-2 tabular-nums text-zinc-400">
            {index + 1}/{files.length}
          </span>
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full"
          onClick={() => step(1)}
          aria-label="Next shape"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m6 3 5 5-5 5" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

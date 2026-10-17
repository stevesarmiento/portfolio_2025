import type { Metadata } from "next";
import { PlotterFigure } from "@/components/figures/plotter/figure";
import { listGallerySvgs } from "@/lib/svg-gallery";

export const metadata: Metadata = {
  title: "Icons as sums of circles",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab/icons" },
};

export default function IconsPage() {
  const files = listGallerySvgs();
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f4f1ea] px-4 py-10 text-zinc-950">
      <div className="w-full max-w-3xl">
        <PlotterFigure files={files} fig="Fig 3" />
      </div>
    </main>
  );
}

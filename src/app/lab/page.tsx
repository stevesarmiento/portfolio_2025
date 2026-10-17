import type { Metadata } from "next";
import type { ReactNode } from "react";
import { WaveBoxFigure } from "@/components/figures/wavebox/figure";
import { RecorderFigure } from "@/components/figures/recorder/figure";
import { PlotterFigure } from "@/components/figures/plotter/figure";
import { listGallerySvgs } from "@/lib/svg-gallery";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab" },
};

const gallerySvgs = listGallerySvgs();

const experiments: Array<{ number: string; title: string; component: ReactNode }> = [
  {
    number: "01",
    title: "Complex Gaussian wave packet",
    component: <WaveBoxFigure fig="Fig 1" />,
  },
  {
    number: "02",
    title: "Harmonic recorder",
    component: <RecorderFigure fig="Fig 2" />,
  },
  {
    number: "03",
    title: "Icons as sums of circles",
    component: <PlotterFigure files={gallerySvgs} fig="Fig 3" />,
  },
];

export default function LabPage() {
  return (
    <main className="min-h-dvh bg-[#f4f1ea] px-4 py-16 text-zinc-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-24">
        {experiments.map(({ number, title, component }) => (
          <section key={number} className="flex flex-col gap-6">
            <h2 className="font-nuvo text-xs uppercase tracking-widest text-zinc-500">
              {number} · {title}
            </h2>
            {component}
          </section>
        ))}
      </div>
    </main>
  );
}

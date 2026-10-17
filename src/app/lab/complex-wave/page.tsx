import type { Metadata } from "next";
import { WaveBoxFigure } from "@/components/figures/wavebox/figure";

export const metadata: Metadata = {
  title: "Complex wave packet",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab/complex-wave" },
};

export default function ComplexWavePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f4f1ea] px-4 py-10 text-zinc-950">
      <div className="w-full max-w-3xl">
        <WaveBoxFigure />
      </div>
    </main>
  );
}

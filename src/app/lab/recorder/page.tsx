import type { Metadata } from "next";
import { RecorderFigure } from "@/components/figures/recorder/figure";

export const metadata: Metadata = {
  title: "Harmonic recorder",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab/recorder" },
};

export default function RecorderPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f4f1ea] px-4 py-10 text-zinc-950">
      <div className="w-full max-w-3xl">
        <RecorderFigure />
      </div>
    </main>
  );
}

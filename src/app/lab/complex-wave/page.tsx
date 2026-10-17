import type { Metadata } from "next";
import { ComplexWave } from "@/components/playground/complex-wave";

export const metadata: Metadata = {
  title: "Complex Wave",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab/complex-wave" },
};

export default function ComplexWavePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f4f1ea] px-4 py-10 text-zinc-950">
      <ComplexWave className="w-full max-w-3xl" />
    </main>
  );
}

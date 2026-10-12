import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ComplexWave } from "@/components/playground/complex-wave";
import {
  FourierEpicycles,
  type SeriesTerm,
} from "@/components/playground/fourier-epicycles";
import {
  FourierOutline,
  kochSnowflake,
  mooreCurve,
  sigma,
} from "@/components/playground/fourier-outline";
import { FourierGallery } from "@/components/playground/fourier-gallery";
import { listGallerySvgs } from "@/lib/svg-gallery";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab" },
};

function Sigma({ from, to }: { from: string; to: string }) {
  return (
    <>
      <span className="align-middle text-2xl not-italic">Σ</span>
      <sub className="font-nuvo text-[0.55em] not-italic text-zinc-500">{from}</sub>
      <sup className="font-nuvo text-[0.55em] not-italic text-zinc-500">{to}</sup>
    </>
  );
}

const spikes: SeriesTerm[] = Array.from({ length: 13 }, (_, k) => ({
  a: 5 / (k + 1),
  f: 4 * k + 1,
}));

const crests: SeriesTerm[] = Array.from({ length: 12 }, (_, i) => ({
  a: 6 / (2 * (i + 1) + 1),
  f: 2 * (i + 1) + 1,
}));

const square: SeriesTerm[] = Array.from({ length: 7 }, (_, k) => ({
  a: 2 / (2 * k + 1),
  f: 2 * k + 1,
}));

const beats: SeriesTerm[] = [
  { a: 15, f: 1, p: -30 },
  { a: 15, f: 0.9, p: -27 },
];

const battlements: SeriesTerm[] = [
  { a: 5, f: 1 },
  { a: -1, f: 5 },
];

const sawtooth: SeriesTerm[] = Array.from({ length: 7 }, (_, i) => ({
  a: 1.5 / Math.sqrt(i + 1),
  f: i + 1,
}));

const moore = mooreCurve(4);
const koch = kochSnowflake(3);
const gallerySvgs = listGallerySvgs();

const experiments: Array<{ number: string; title: string; component: ReactNode }> = [
  {
    number: "01",
    title: "Complex Gaussian wave packet",
    component: <ComplexWave className="w-full" />,
  },
  {
    number: "02",
    title: "Fourier spikes",
    component: (
      <FourierEpicycles
        className="w-full"
        terms={spikes}
        formula={
          <>
            y = 5 <Sigma from="k=0" to="12" /> sin((4k+1)x) / (k+1)
          </>
        }
      />
    ),
  },
  {
    number: "03",
    title: "Odd harmonics",
    component: (
      <FourierEpicycles
        className="w-full"
        terms={crests}
        color="#7d6fae"
        formula={
          <>
            y = 6 <Sigma from="k=1" to="12" /> sin((2k+1)x) / (2k+1)
          </>
        }
      />
    ),
  },
  {
    number: "04",
    title: "Square wave",
    component: (
      <FourierEpicycles
        className="w-full"
        terms={square}
        xMax={6 * Math.PI}
        speed={0.9}
        formula={
          <>
            y = <Sigma from="k=0" to="6" /> 2 sin((2k+1)x) / (2k+1)
          </>
        }
      />
    ),
  },
  {
    number: "05",
    title: "Beats",
    component: (
      <FourierEpicycles
        className="w-full"
        terms={beats}
        xMax={20 * Math.PI}
        speed={4.5}
        color="#7d6fae"
        formula={<>y = 15(sin(x−30) + sin(0.9(x−30)))</>}
      />
    ),
  },
  {
    number: "06",
    title: "Battlements",
    component: (
      <FourierEpicycles
        className="w-full"
        terms={battlements}
        formula={<>y = 5 sin(x) − sin(5x)</>}
      />
    ),
  },
  {
    number: "07",
    title: "Soft sawtooth",
    component: (
      <FourierEpicycles
        className="w-full"
        terms={sawtooth}
        xMax={6 * Math.PI}
        speed={0.9}
        color="#7d6fae"
        formula={
          <>
            y = <Sigma from="n=1" to="7" /> 1.5 sin(nx) / √n
          </>
        }
      />
    ),
  },
  {
    number: "08",
    title: "Icons as sums of circles",
    component: <FourierGallery className="w-full" files={gallerySvgs} />,
  },
  {
    number: "09",
    title: "Σ as a sum of circles",
    component: (
      <FourierOutline
        className="w-full"
        points={sigma}
        mode="complex"
        maxTerms={128}
        formula={
          <>
            z(t) = <Sigma from="k" to="" /> c<sub className="text-[0.6em]">k</sub> e
            <sup className="text-[0.6em]">ikt</sup>
          </>
        }
      />
    ),
  },
  {
    number: "10",
    title: "Moore curve, one chain per axis",
    component: (
      <FourierOutline
        className="w-full"
        points={moore}
        mode="axes"
        maxTerms={128}
        speed={0.8}
        formula={
          <>
            x(t) = <Sigma from="k=1" to="N" /> (a<sub className="text-[0.6em]">k</sub> cos kt + b
            <sub className="text-[0.6em]">k</sub> sin kt)
          </>
        }
      />
    ),
  },
  {
    number: "11",
    title: "Koch snowflake",
    component: (
      <FourierOutline
        className="w-full"
        points={koch}
        mode="complex"
        maxTerms={64}
        color="#7d6fae"
        formula={
          <>
            z(t) = <Sigma from="k" to="" /> c<sub className="text-[0.6em]">k</sub> e
            <sup className="text-[0.6em]">ikt</sup>
          </>
        }
      />
    ),
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

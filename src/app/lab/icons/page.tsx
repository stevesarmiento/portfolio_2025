import type { Metadata } from "next";
import { FourierGallery } from "@/components/playground/fourier-gallery";
import { listGallerySvgs } from "@/lib/svg-gallery";

export const metadata: Metadata = {
  title: "Icons as circles",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab/icons" },
};

export default function IconsPage() {
  const files = listGallerySvgs();
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f4f1ea] px-4 py-10 text-zinc-950">
      <FourierGallery files={files} className="w-full max-w-3xl" />
    </main>
  );
}

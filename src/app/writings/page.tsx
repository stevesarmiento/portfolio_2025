import Link from "next/link";
import { IconArrowLeft, IconScribble } from "symbols-react";

import { Button } from "@/components/ui/button";

export default function WritingsPage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#f4f1ea] text-zinc-950">
      <div className="relative mx-auto h-dvh w-full max-w-[620px]">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="absolute left-4 top-6 z-20 rounded-xl bg-white/45 text-zinc-700 shadow-sm ring-1 ring-black/10 transition-[background-color,transform,color] duration-150 ease-out hover:bg-white/80 hover:text-zinc-950 active:scale-[0.97] lg:left-0 lg:-translate-x-[calc(100%+16px)]"
        >
          <Link href="/" aria-label="Back home">
            <IconArrowLeft className="h-4 w-4 fill-current" />
          </Link>
        </Button>

        <div className="long-dashed-rails relative z-10 h-dvh w-full overflow-y-auto overscroll-contain">
          <div className="flex min-h-dvh w-full flex-col items-center justify-center px-4 py-24 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/45 shadow-sm ring-1 ring-black/10">
              <IconScribble className="h-6 w-6 fill-zinc-700" />
            </div>
            <p className="mt-3 text-pretty font-mono text-sm text-zinc-600">
              under construction
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

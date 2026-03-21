import Link from "next/link";
import { IconArrowLeft, IconScribble } from "symbols-react";

import { Button } from "@/components/ui/button";

export default function WritingsPage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black text-zinc-50">
      <div className="relative mx-auto h-dvh w-full max-w-[620px]">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="absolute left-4 top-6 z-20 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 sm:left-0 sm:-translate-x-[calc(100%+16px)]"
        >
          <Link href="/" aria-label="Back home">
            <IconArrowLeft className="h-4 w-4 fill-white/80" />
          </Link>
        </Button>

        <div className="relative z-10 h-dvh w-full overflow-y-auto border-r border-l border-white/10">
          <div className="flex min-h-dvh w-full flex-col items-center justify-center px-4 py-24 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <IconScribble className="h-6 w-6 fill-white/80" />
            </div>
            <p className="mt-3 text-pretty text-sm font-mono text-white/60">
              under construction
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


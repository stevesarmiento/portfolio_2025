import Link from "next/link";
import { IconApplescript, IconSunDustFill } from "symbols-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AboutActionsProps {
  isExpanded: boolean;
  onToggle: () => void;
}

interface AboutLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

const aboutLinks: AboutLink[] = [
  { label: "Playground", href: "/playground" },
  { label: "Writings", href: "/writings" },
  { label: "Github", href: "https://github.com/stevesarmiento", isExternal: true },
  { label: "Calendar", href: "https://cal.com/lassi", isExternal: true },
  { label: "@stevensarmi", href: "https://x.com/stevensarmi", isExternal: true },
];

export function AboutActions({ isExpanded, onToggle }: AboutActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-y-2">
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              aria-expanded={isExpanded}
              variant="link"
              onClick={onToggle}
              className="group h-auto p-0 font-nuvo text-sm text-zinc-700 transition-colors duration-150 ease-out hover:text-zinc-950 active:scale-[0.97]"
              endIcon={
                isExpanded ? (
                  <IconApplescript className="mt-[2px] size-5 fill-zinc-950/35 transition-[fill] duration-150 ease-out group-hover:fill-zinc-950" />
                ) : (
                  <IconSunDustFill className="mt-[2px] size-5 fill-amber-500/60 transition-[fill] duration-150 ease-out group-hover:fill-amber-600" />
                )
              }
            >
              {isExpanded ? "TLDR;" : <span className="line-through">TLDR;</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={10}
            className="border border-zinc-50/10 bg-zinc-950 font-nuvo text-xs text-zinc-50 shadow-none"
          >
            {isExpanded ? "Less is more" : "Dive deeper"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <span aria-hidden="true" className="mx-3 hidden h-4 w-px bg-black/15 sm:block" />

      <nav aria-label="Site links" className="basis-full sm:basis-auto">
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-0">
          {aboutLinks.map((item, index) => (
            <li key={item.label} className="flex items-center">
              {index > 0 ? (
                <span aria-hidden="true" className="mx-2 hidden text-xs text-black/25 sm:inline">
                  ·
                </span>
              ) : null}
              {item.isExternal ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-nuvo text-xs text-zinc-600 transition-colors duration-150 ease-out hover:text-zinc-950"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="font-nuvo text-xs text-zinc-600 transition-colors duration-150 ease-out hover:text-zinc-950"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

import Link from "next/link";

interface AboutLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

const aboutLinks: AboutLink[] = [
  { label: "Github", href: "https://github.com/stevesarmiento", isExternal: true },
  { label: "Calendar", href: "https://cal.com/lassi", isExternal: true },
  { label: "@stevensarmi", href: "https://x.com/stevensarmi", isExternal: true },
];

export function AboutActions() {
  return (
    <nav aria-label="Site links">
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
                className="font-nuvo text-xs text-zinc-600 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#df8f93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea]"
              >
                {item.label}
              </a>
            ) : (
              <Link
                href={item.href}
                className="font-nuvo text-xs text-zinc-600 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#df8f93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea]"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

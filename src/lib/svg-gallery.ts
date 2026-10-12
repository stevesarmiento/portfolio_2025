import { readdirSync } from "node:fs";
import path from "node:path";

/** File names of the SVGs under public/svgs, in natural numeric order. */
export function listGallerySvgs(): string[] {
  const dir = path.join(process.cwd(), "public", "svgs");
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  return names.filter((n) => /\.svg$/i.test(n)).sort(collator.compare);
}

import type { MDXComponents } from "mdx/types";

import { writingMDXComponents } from "@/components/writings/mdx-components";

export function useMDXComponents(): MDXComponents {
  return writingMDXComponents;
}

declare module "*.mdx" {
  import type { ComponentType } from "react";

  import type { WritingMetadata } from "@/lib/writings";

  export const article: WritingMetadata;
  const MDXContent: ComponentType;

  export default MDXContent;
}

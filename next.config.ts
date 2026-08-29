import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const rehypeCodeCopy = new URL(
  "./src/lib/rehype-code-copy.mjs",
  import.meta.url,
).pathname;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-autolink-headings",
        {
          behavior: "append",
          properties: {
            ariaLabel: "Link to this section",
            className: ["writing-heading-anchor"],
          },
          content: {
            type: "text",
            value: "#",
          },
        },
      ],
      [
        "rehype-pretty-code",
        {
          theme: "github-light-default",
          keepBackground: false,
        },
      ],
      rehypeCodeCopy,
    ],
  },
});

export default withMDX(nextConfig);

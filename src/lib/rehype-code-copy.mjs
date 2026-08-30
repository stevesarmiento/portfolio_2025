import { visit } from "unist-util-visit";

/**
 * Adds a real button to every fenced code block after pretty-code has
 * transformed it. One client-side listener handles the interaction later.
 */
export default function rehypeCodeCopy() {
  return (tree) => {
    visit(tree, "element", (node) => {
      const containsHighlightedCode = node.children?.some(
        (child) =>
          child.type === "element" &&
          child.tagName === "pre",
      );

      if (node.tagName !== "figure" || !containsHighlightedCode) {
        return;
      }

      node.children.push({
        type: "element",
        tagName: "button",
        properties: {
          type: "button",
          ariaLabel: "Copy code to clipboard",
          className: ["writing-copy-button"],
          dataCopyCode: "",
        },
        children: [{ type: "text", value: "Copy" }],
      });
    });
  };
}

"use client";

import { Fragment, useState } from "react";

const initialMarkdown = `## Make the draft small

Write the thought before you decorate it.

### Then make it clear

Good tools should disappear behind the work.`;

function Preview({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);

  if (!source.trim()) {
    return <p className="writing-preview-empty">Your preview will appear here.</p>;
  }

  return blocks.map((block, index) => {
    if (block.startsWith("### ")) {
      return <h4 key={index}>{block.slice(4)}</h4>;
    }

    if (block.startsWith("## ")) {
      return <h3 key={index}>{block.slice(3)}</h3>;
    }

    return (
      <Fragment key={index}>
        <p>{block.replace(/\n/g, " ")}</p>
      </Fragment>
    );
  });
}

export function MarkdownPreviewDemo() {
  const [source, setSource] = useState(initialMarkdown);

  return (
    <div className="writing-markdown-demo">
      <label>
        <span>Markdown</span>
        <textarea
          value={source}
          onChange={(event) => setSource(event.target.value)}
          spellCheck="false"
        />
      </label>
      <div className="writing-markdown-preview">
        <span className="writing-markdown-demo-label">Preview</span>
        <div className="writing-markdown-preview-content">
          <Preview source={source} />
        </div>
      </div>
    </div>
  );
}

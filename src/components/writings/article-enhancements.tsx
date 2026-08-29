"use client";

import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Clipboard request timed out")), 800),
        ),
      ]);
      return true;
    } catch {
      // Fall through to the older, permission-free browser path.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

export function ArticleEnhancements({ children }: { children: ReactNode }) {
  const [announcement, setAnnouncement] = useState("");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const handleClick = async (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest<HTMLButtonElement>("[data-copy-code]");
    if (!button) {
      return;
    }

    const code = button
      .closest("[data-rehype-pretty-code-figure]")
      ?.querySelector("code");
    if (!code) {
      setAnnouncement("Unable to find code to copy.");
      return;
    }

    const copied = await copyText(code.textContent ?? "");
    const message = copied ? "Code copied to clipboard." : "Unable to copy code.";

    button.textContent = copied ? "Copied" : "Try again";
    button.dataset.state = copied ? "copied" : "error";
    setAnnouncement(message);

    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }

    resetTimer.current = setTimeout(() => {
      button.textContent = "Copy";
      delete button.dataset.state;
      setAnnouncement("");
    }, 1800);
  };

  return (
    <div
      id="writing-content"
      className="writing-prose mx-auto max-w-[556px]"
      onClick={handleClick}
    >
      {children}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}

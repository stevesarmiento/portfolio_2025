const MAX_DISPLAY_TITLE_LENGTH = 132;

export type PreparedSocialTitle = {
  fontSize: number;
  text: string;
};

export function prepareSocialTitle(title: string): PreparedSocialTitle {
  const normalizedTitle = title.trim().replace(/\s+/g, " ");
  let displayTitle = normalizedTitle;

  if (normalizedTitle.length > MAX_DISPLAY_TITLE_LENGTH) {
    const candidate = normalizedTitle.slice(0, MAX_DISPLAY_TITLE_LENGTH - 1);
    const lastSpace = candidate.lastIndexOf(" ");
    const breakPoint = lastSpace >= 108 ? lastSpace : candidate.length;

    displayTitle = `${candidate.slice(0, breakPoint).trimEnd()}…`;
  }

  if (displayTitle.length <= 36) {
    return { fontSize: 92, text: displayTitle };
  }

  if (displayTitle.length <= 64) {
    return { fontSize: 76, text: displayTitle };
  }

  if (displayTitle.length <= 96) {
    return { fontSize: 62, text: displayTitle };
  }

  return { fontSize: 52, text: displayTitle };
}

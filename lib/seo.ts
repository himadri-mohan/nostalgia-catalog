import type { Show } from "./types";

const MAX_DESCRIPTION = 160;

export function showMetaDescription(show: Show): string {
  const lead = `Where to watch ${show.title} (${show.year}) legally. `;
  const tail = " No video is hosted here.";
  const room = MAX_DESCRIPTION - lead.length - tail.length;
  if (room < 24) {
    return `${lead.trim()} Official links only.${tail}`.slice(0, MAX_DESCRIPTION);
  }
  if (show.blurb.length <= room) {
    return `${lead}${show.blurb}${tail}`;
  }
  const slice = show.blurb.slice(0, Math.max(0, room - 1));
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = (lastSpace > 24 ? slice.slice(0, lastSpace) : slice).trimEnd();
  return `${lead}${trimmed}…${tail}`;
}

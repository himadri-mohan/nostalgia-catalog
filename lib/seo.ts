import type { Shelf, Show } from "./types";

const MAX_DESCRIPTION = 160;

export function showDiscoveryCopy(shelf: Shelf): string {
  if (shelf === "india-original") {
    return "This is an Indian kids' series. The buttons below are legal discovery links to official pages, store searches, and libraries. Nothing plays on this site.";
  }
  if (shelf === "india-import") {
    return "Kids in India watched this on channels such as Cartoon Network, Nickelodeon, Disney Channel, Hungama, or Pogo, often in Hindi. The buttons below are legal discovery links only. Nothing plays on this site.";
  }
  return "This classic sits with the Disney Afternoon and other global series. The buttons below are legal discovery links only. Nothing plays on this site.";
}

export function showMetaDescription(show: Show): string {
  const lead = `Legal places to watch ${show.title} (${show.year}). `;
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

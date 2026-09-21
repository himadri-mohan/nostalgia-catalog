import type { Show } from "./types";

export type ShowMatch = {
  show: Show;
  matchedCharacter: string | null;
};

export function matchShows(shows: readonly Show[], query: string): ShowMatch[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return shows.map((show) => ({ show, matchedCharacter: null }));
  }

  const matches: ShowMatch[] = [];
  for (const show of shows) {
    if (show.title.toLowerCase().includes(needle)) {
      matches.push({ show, matchedCharacter: null });
      continue;
    }
    const character = show.characters.find((name) => name.toLowerCase().includes(needle));
    if (character) {
      matches.push({ show, matchedCharacter: character });
    }
  }
  return matches;
}

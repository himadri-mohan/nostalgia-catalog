export const LIBRARY_STORAGE_KEY = "nostalgia-catalog.library.v1";
export const LIBRARY_EVENT = "nostalgia-catalog-library";

const MAX_TAGS = 12;
const MAX_TAG_LENGTH = 24;
const MAX_NOTES = 1000;

export type LibraryEntry = {
  saved: boolean;
  notes: string;
  tags: string[];
  updatedAt: string;
};

export type LibraryState = Record<string, LibraryEntry>;

export function normalizeTag(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_TAG_LENGTH);
}

function isEntry(value: unknown): value is Partial<LibraryEntry> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function readLibrary(): LibraryState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const state: LibraryState = {};
    for (const [slug, value] of Object.entries(parsed)) {
      if (!/^[a-z0-9-]+$/.test(slug) || !isEntry(value)) continue;
      const tags = Array.isArray(value.tags)
        ? value.tags
            .filter((tag): tag is string => typeof tag === "string")
            .map(normalizeTag)
            .filter(Boolean)
            .slice(0, MAX_TAGS)
        : [];
      state[slug] = {
        saved: Boolean(value.saved),
        notes: typeof value.notes === "string" ? value.notes.slice(0, MAX_NOTES) : "",
        tags,
        updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
      };
    }
    return state;
  } catch {
    return {};
  }
}

export function writeLibrary(state: LibraryState) {
  const compact: LibraryState = {};
  for (const [slug, entry] of Object.entries(state)) {
    if (!entry.saved && entry.notes.trim() === "" && entry.tags.length === 0) continue;
    compact[slug] = {
      ...entry,
      notes: entry.notes.slice(0, MAX_NOTES),
      tags: entry.tags.slice(0, MAX_TAGS),
    };
  }
  window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(compact));
  window.dispatchEvent(new Event(LIBRARY_EVENT));
}

export function countSaved(state: LibraryState): number {
  return Object.values(state).filter((entry) => entry.saved).length;
}

export const EMPTY_ENTRY: LibraryEntry = {
  saved: false,
  notes: "",
  tags: [],
  updatedAt: "",
};

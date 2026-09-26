import showsJson from "@/data/shows.json";
import type { Show } from "./types";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VIDEO_FILE_PATTERN = /\.(?:mp4|m3u8|mkv|avi|webm|mov|ts)(?:$|\?)/i;
const BLOCKED_HOST_MARKERS = [
  "kimcartoon",
  "kisscartoon",
  "kiss-cartoon",
  "gogoanime",
  "fmovies",
  "123movies",
  "putlocker",
  "soap2day",
  "watchcartoononline",
  "wcofun",
  "9anime",
  "animesuge",
  "thepiratebay",
  "nyaa.si",
];

function assertShow(value: unknown, index: number): Show {
  if (!value || typeof value !== "object") {
    throw new Error(`Show at index ${index} is not an object`);
  }
  const show = value as Record<string, unknown>;
  const label = typeof show.slug === "string" ? show.slug : `#${index}`;

  if (typeof show.slug !== "string" || !SLUG_PATTERN.test(show.slug)) {
    throw new Error(`Show ${label} needs a lowercase slug`);
  }
  if (typeof show.title !== "string" || show.title.trim() === "") {
    throw new Error(`Show ${label} needs a title`);
  }
  if (typeof show.year !== "number" || show.year < 1900 || show.year > 2100) {
    throw new Error(`Show ${label} needs a year`);
  }
  if (typeof show.blurb !== "string" || show.blurb.trim().length < 20) {
    throw new Error(`Show ${label} needs a short blurb`);
  }
  if (!Array.isArray(show.characters) || show.characters.length === 0) {
    throw new Error(`Show ${label} needs characters`);
  }
  if (!show.characters.every((name) => typeof name === "string" && name.trim() !== "")) {
    throw new Error(`Show ${label} has an empty character name`);
  }
  if (!Array.isArray(show.legalSources) || show.legalSources.length === 0) {
    throw new Error(`Show ${label} needs legalSources`);
  }

  const legalSources = show.legalSources.map((source, sourceIndex) => {
    if (!source || typeof source !== "object") {
      throw new Error(`Show ${label} source ${sourceIndex} is invalid`);
    }
    const entry = source as Record<string, unknown>;
    if (typeof entry.name !== "string" || entry.name.trim() === "") {
      throw new Error(`Show ${label} source ${sourceIndex} needs a name`);
    }
    if (typeof entry.url !== "string" || typeof entry.detail !== "string") {
      throw new Error(`Show ${label} source ${sourceIndex} needs a url and detail`);
    }
    let parsed: URL;
    try {
      parsed = new URL(entry.url);
    } catch {
      throw new Error(`Show ${label} source ${entry.name} is not a URL`);
    }
    if (parsed.protocol !== "https:") {
      throw new Error(`Show ${label} source ${entry.name} must use https`);
    }
    if (VIDEO_FILE_PATTERN.test(parsed.pathname) || parsed.pathname.toLowerCase().includes("/embed")) {
      throw new Error(`Show ${label} source ${entry.name} looks like a media file`);
    }
    const host = parsed.hostname.toLowerCase();
    if (BLOCKED_HOST_MARKERS.some((marker) => host.includes(marker))) {
      throw new Error(`Show ${label} source ${entry.name} is not an official provider`);
    }
    return {
      name: entry.name.trim(),
      url: entry.url,
      detail: entry.detail.trim(),
    };
  });

  return {
    slug: show.slug,
    title: show.title.trim(),
    year: show.year,
    blurb: show.blurb.trim(),
    characters: show.characters.map((name) => (name as string).trim()),
    legalSources,
  };
}

function loadShows(input: unknown): Show[] {
  if (!Array.isArray(input)) {
    throw new Error("data/shows.json must be an array");
  }
  const shows = input.map((entry, index) => assertShow(entry, index));
  const slugs = new Set<string>();
  for (const show of shows) {
    if (slugs.has(show.slug)) {
      throw new Error(`Duplicate slug ${show.slug}`);
    }
    slugs.add(show.slug);
  }
  return shows;
}

const shows = loadShows(showsJson);

export function getShows(): Show[] {
  return [...shows].sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
}

export function getShow(slug: string): Show | undefined {
  return shows.find((show) => show.slug === slug);
}

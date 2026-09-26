const LOCAL_ORIGIN = "http://localhost:3000";

export const SITE_NAME = "Nostalgia Catalog";

export const HOME_TITLE = "Nostalgia Catalog — Where to Watch Classic and Indian Cartoons Legally";

export const HOME_DESCRIPTION =
  "Search Indian kids' TV and Disney Afternoon classics, from Chhota Bheem and Doraemon to DuckTales. Official store, streamer, and library links only. No video is hosted here.";

export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === "https:" || url.protocol === "http:") {
        return new URL(url.origin);
      }
    } catch {
      // Fall through to the deployment host or localhost.
    }
  }

  const vercel = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, "");
  if (vercel) {
    return new URL(`https://${vercel}`);
  }

  return new URL(LOCAL_ORIGIN);
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

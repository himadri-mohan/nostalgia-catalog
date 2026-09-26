import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const BLOCKED = /kimcartoon|kisscartoon|gogoanime|fmovies|123movies|putlocker|soap2day|watchcartoononline/i;

type SeedShow = {
  slug: string;
  title: string;
  year: number;
  legalSources: { name: string; url: string }[];
};

test("seed catalog is a launch-sized set of official https links", () => {
  const shows = JSON.parse(readFileSync(new URL("../data/shows.json", import.meta.url), "utf8")) as SeedShow[];
  assert.ok(shows.length >= 15 && shows.length <= 25, `expected 15–25 shows, got ${shows.length}`);
  assert.equal(new Set(shows.map((show) => show.slug)).size, shows.length);

  for (const show of shows) {
    assert.ok(
      show.legalSources.some((source) => new URL(source.url).hostname.endsWith("amazon.com")),
      `${show.slug} needs an Amazon store link`,
    );
    for (const source of show.legalSources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, "https:");
      assert.doesNotMatch(url.hostname, BLOCKED);
      assert.doesNotMatch(url.pathname, /\/embed/i);
      assert.doesNotMatch(url.pathname, /\.(?:mp4|m3u8|mkv|avi|webm|mov|ts)$/i);
    }
  }
});

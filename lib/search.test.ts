import assert from "node:assert/strict";
import test from "node:test";
import { matchShows } from "./search.ts";
import type { Show } from "./types.ts";

const shows: Show[] = [
  {
    slug: "ducktales",
    title: "DuckTales",
    year: 1987,
    blurb: "Scrooge and his nephews chase treasure.",
    characters: ["Scrooge McDuck", "Launchpad McQuack", "Webby Vanderquack"],
    legalSources: [],
    shelf: "classic",
  },
  {
    slug: "talespin",
    title: "TaleSpin",
    year: 1990,
    blurb: "Baloo and Kit fly cargo.",
    characters: ["Baloo", "Kit Cloudkicker"],
    legalSources: [],
    shelf: "classic",
  },
  {
    slug: "ducktales-2017",
    title: "DuckTales (2017)",
    year: 2017,
    blurb: "A later Scrooge expedition.",
    characters: ["Scrooge McDuck", "Dewey"],
    legalSources: [],
    shelf: "classic",
  },
];

test("blank search returns every show", () => {
  assert.equal(matchShows(shows, "   ").length, 3);
});

test("matches a title or any character name", () => {
  const byTitle = matchShows(shows, "talespin");
  assert.deepEqual(
    byTitle.map((match) => match.show.slug),
    ["talespin"],
  );
  assert.equal(byTitle[0]?.matchedCharacter, null);

  const byCharacter = matchShows(shows, "Launchpad");
  assert.deepEqual(
    byCharacter.map((match) => match.show.slug),
    ["ducktales"],
  );
  assert.equal(byCharacter[0]?.matchedCharacter, "Launchpad McQuack");

  const shared = matchShows(shows, "scrooge");
  assert.deepEqual(
    shared.map((match) => match.show.slug),
    ["ducktales", "ducktales-2017"],
  );
});

test("returns no shows for an unknown query", () => {
  assert.deepEqual(matchShows(shows, "zzzz-not-a-show"), []);
});

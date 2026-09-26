import assert from "node:assert/strict";
import test from "node:test";
import { showMetaDescription } from "./seo.ts";
import type { Show } from "./types.ts";

const show: Show = {
  slug: "winnie-the-pooh",
  title: "The New Adventures of Winnie the Pooh",
  year: 1988,
  blurb:
    "In the Hundred Acre Wood, Pooh, Piglet, Tigger, and the rest turn tiny problems into a whole afternoon.",
  characters: ["Winnie the Pooh"],
  legalSources: [],
};

test("show descriptions stay within a typical meta length", () => {
  const description = showMetaDescription(show);
  assert.ok(description.length <= 160, description);
  assert.match(description, /Winnie the Pooh/);
  assert.match(description, /No video is hosted here/);
});

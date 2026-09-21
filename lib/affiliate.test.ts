import assert from "node:assert/strict";
import test from "node:test";
import { applyAffiliate, inferProvider } from "./affiliate.ts";

const disney =
  "https://www.disneyplus.com/browse/entity-d21f9ec9-14f4-4c26-ba02-199108dac9ff";
const amazon = "https://www.amazon.com/s?k=DuckTales+1987&i=movies-tv";
const apple = "https://tv.apple.com/us/search?term=TaleSpin";

test("inferProvider recognizes official hosts", () => {
  assert.equal(inferProvider(disney), "disney");
  assert.equal(inferProvider(amazon), "amazon");
  assert.equal(inferProvider(apple), "apple");
  assert.equal(inferProvider("https://search.worldcat.org/search?q=DuckTales"), "none");
});

test("leaves the URL unchanged when no affiliate id is set", () => {
  assert.equal(applyAffiliate(amazon, "amazon", {}), amazon);
  assert.equal(applyAffiliate(disney, "disney", { AFFILIATE_DISNEY_CID: "   " }), disney);
});

test("appends provider params from server-only env names", () => {
  const amazonHref = applyAffiliate(amazon, "amazon", { AFFILIATE_AMAZON_TAG: "shelf-20" });
  const appleHref = applyAffiliate(apple, "apple", { AFFILIATE_APPLE_AT: "1001labc" });
  const disneyHref = applyAffiliate(disney, "disney", { AFFILIATE_DISNEY_CID: "summer" });

  assert.equal(new URL(amazonHref).searchParams.get("tag"), "shelf-20");
  assert.equal(new URL(amazonHref).searchParams.get("k"), "DuckTales 1987");
  assert.equal(new URL(appleHref).searchParams.get("at"), "1001labc");
  assert.equal(new URL(appleHref).searchParams.get("term"), "TaleSpin");
  assert.equal(new URL(disneyHref).searchParams.get("cid"), "summer");
});

test("prefers server-only ids and falls back to NEXT_PUBLIC names", () => {
  const preferred = applyAffiliate(amazon, "amazon", {
    AFFILIATE_AMAZON_TAG: "server-20",
    NEXT_PUBLIC_AFFILIATE_AMAZON_TAG: "public-20",
  });
  const fallback = applyAffiliate(amazon, "amazon", {
    NEXT_PUBLIC_AFFILIATE_AMAZON_TAG: "public-20",
  });
  assert.equal(new URL(preferred).searchParams.get("tag"), "server-20");
  assert.equal(new URL(fallback).searchParams.get("tag"), "public-20");
});

test("refuses unsafe tokens and mismatched hosts", () => {
  const injected = applyAffiliate(amazon, "amazon", { AFFILIATE_AMAZON_TAG: "ok-20&evil=1" });
  const wrongHost = applyAffiliate(disney, "amazon", { AFFILIATE_AMAZON_TAG: "shelf-20" });
  const insecure = applyAffiliate("http://www.amazon.com/s?k=DuckTales", "amazon", {
    AFFILIATE_AMAZON_TAG: "shelf-20",
  });
  assert.equal(injected, amazon);
  assert.equal(wrongHost, disney);
  assert.equal(insecure, "http://www.amazon.com/s?k=DuckTales");
});

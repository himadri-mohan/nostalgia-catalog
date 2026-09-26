import type { MetadataRoute } from "next";
import { getShows } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const shows = getShows().map((show) => ({
    url: absoluteUrl(`/shows/${show.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...shows,
  ];
}

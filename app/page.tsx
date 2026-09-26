import type { Metadata } from "next";
import { CatalogSearch } from "@/components/CatalogSearch";
import { JsonLd } from "@/components/JsonLd";
import { getShows } from "@/lib/catalog";
import { absoluteUrl, HOME_DESCRIPTION, HOME_TITLE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function HomePage() {
  const shows = getShows();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: absoluteUrl("/"),
          description: HOME_DESCRIPTION,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Classic cartoons with official watch links",
          itemListElement: shows.map((show, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: show.title,
            url: absoluteUrl(`/shows/${show.slug}`),
          })),
        }}
      />
      <CatalogSearch shows={shows} />
    </>
  );
}

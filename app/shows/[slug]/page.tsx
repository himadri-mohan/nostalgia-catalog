import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { JsonLd } from "@/components/JsonLd";
import { ShowLibrary } from "@/components/ShowLibrary";
import { getShow, getShows } from "@/lib/catalog";
import { resolveLegalLinks } from "@/lib/outbound";
import { showDiscoveryCopy, showMetaDescription } from "@/lib/seo";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

type ShowPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getShows().map((show) => ({ slug: show.slug }));
}

export async function generateMetadata({ params }: ShowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show) {
    return { title: "Show not found" };
  }

  const description = showMetaDescription(show);
  const path = `/shows/${show.slug}`;
  const title = `Where to Watch ${show.title} (${show.year}) Legally`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show) {
    notFound();
  }

  const links = await resolveLegalLinks(show.legalSources);

  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TVSeries",
          name: show.title,
          datePublished: String(show.year),
          description: show.blurb,
          url: absoluteUrl(`/shows/${show.slug}`),
          sameAs: show.legalSources.map((source) => source.url),
        }}
      />
      <div>
        <Link href="/" className="text-sm font-extrabold text-teal no-underline">
          Back to catalog
        </Link>
        <p className="mt-4 text-sm font-extrabold uppercase tracking-[0.16em] text-teal">
          <time dateTime={String(show.year)}>{show.year}</time>
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
          Where to watch {show.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-ink">{show.blurb}</p>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{showDiscoveryCopy(show.shelf)}</p>

        <section aria-labelledby="characters-heading" className="mt-8">
          <h2 id="characters-heading" className="font-display text-3xl text-navy">
            Characters
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {show.characters.map((character) => (
              <li key={character} className="rounded-full border border-line bg-card px-3 py-1.5 text-sm font-bold">
                {character}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="watch-heading" className="mt-8">
          <h2 id="watch-heading" className="font-display text-3xl text-navy">
            Where to watch
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Buttons open an official series page or a search on a store or library. A direct purchase
            page can change, and availability depends on your country. These links leave Nostalgia
            Catalog. This page does not play or host video.
          </p>
          <div className="mt-3 max-w-2xl rounded-2xl border border-line bg-[#efe4d0] px-4 py-3 text-sm leading-6 text-ink">
            <AffiliateDisclosure />
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel={link.sponsored ? "sponsored noopener noreferrer" : "noopener noreferrer"}
                  className="flex min-h-20 flex-col justify-center rounded-2xl bg-navy px-4 py-3 text-paper no-underline hover:bg-[#22374f]"
                >
                  <span className="font-extrabold">
                    {link.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  <span className="text-sm text-[#f3d48a]">{link.detail}</span>
                  {link.sponsored ? (
                    <span className="mt-1 text-xs font-bold uppercase tracking-wide text-paper">
                      Affiliate link
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ShowLibrary slug={show.slug} title={show.title} />
    </article>
  );
}

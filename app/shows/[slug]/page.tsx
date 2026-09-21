import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShowLibrary } from "@/components/ShowLibrary";
import { getShow, getShows } from "@/lib/catalog";
import { resolveLegalLinks } from "@/lib/outbound";

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

  return {
    title: `${show.title} (${show.year})`,
    description: `Where to watch ${show.title} (${show.year}) legally. Official Disney+ page plus store and library searches. No video is hosted here.`,
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
      <div>
        <Link href="/" className="text-sm font-extrabold text-teal no-underline">
          Back to catalog
        </Link>
        <p className="mt-4 text-sm font-extrabold uppercase tracking-[0.16em] text-teal">
          <time dateTime={String(show.year)}>{show.year}</time>
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">{show.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-ink">{show.blurb}</p>

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
            Disney+ opens the official series page. Store and library buttons are searches on those
            services, because a direct purchase page can change. Availability depends on your country.
            These links leave Nostalgia Catalog. This page does not play video.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-20 flex-col justify-center rounded-2xl bg-navy px-4 py-3 text-paper no-underline hover:bg-[#22374f]"
                >
                  <span className="font-extrabold">
                    {link.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  <span className="text-sm text-[#f3d48a]">{link.detail}</span>
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

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type FormEvent } from "react";
import { matchShows, type ShowMatch } from "@/lib/search";
import type { Shelf, Show } from "@/lib/types";

const shelfOrder: { shelf: Shelf; heading: string; intro: string }[] = [
  {
    shelf: "india-original",
    heading: "Made in India",
    intro: "Pogo, Nickelodeon, Hungama, and other Indian originals.",
  },
  {
    shelf: "india-import",
    heading: "Indian kids' TV and Hindi dubs",
    intro: "Cartoon Network, Nickelodeon, Disney Channel, Hungama, and Pogo imports people actually watched.",
  },
  {
    shelf: "classic",
    heading: "Disney Afternoon and other classics",
    intro: "The global shelf, including DuckTales, TaleSpin, and the rest of the afternoon block.",
  },
];

function ShowCards({ matches }: { matches: ShowMatch[] }) {
  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-2">
      {matches.map(({ show, matchedCharacter }) => (
        <li key={show.slug}>
          <Link
            href={`/shows/${show.slug}`}
            className="flex h-full flex-col rounded-2xl border border-line bg-card p-5 no-underline shadow-sm transition hover:border-teal"
          >
            <span className="w-fit rounded-full bg-gold px-2.5 py-1 text-xs font-extrabold text-navy">
              <time dateTime={String(show.year)}>{show.year}</time>
            </span>
            <span className="mt-3 font-display text-2xl leading-tight text-navy">{show.title}</span>
            <span className="mt-2 text-sm leading-6 text-muted">{show.blurb}</span>
            {matchedCharacter ? (
              <span className="mt-3 text-sm font-bold text-teal">Character match: {matchedCharacter}</span>
            ) : (
              <span className="mt-3 text-sm text-ink">
                {show.characters.slice(0, 4).join(", ")}
                {show.characters.length > 4 ? ` +${show.characters.length - 4}` : ""}
              </span>
            )}
            <span className="mt-4 text-sm font-extrabold text-coral">Where to watch legally</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CatalogSearch({ shows }: { shows: Show[] }) {
  const router = useRouter();
  const searchId = useId();
  const [query, setQuery] = useState("");
  const results = useMemo(() => matchShows(shows, query), [shows, query]);
  const trimmed = query.trim();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results.length === 1) {
      router.push(`/shows/${results[0].show.slug}`);
      return;
    }
    document.getElementById("search-results")?.focus();
  }

  return (
    <section aria-labelledby="catalog-heading">
      <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-teal">Legal watch guide</p>
      <h1
        id="catalog-heading"
        className="mt-2 max-w-3xl font-display text-4xl leading-tight text-navy sm:text-5xl"
      >
        Where to watch classic and Indian cartoons legally.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Search {shows.length} series from Pogo, Nickelodeon, Cartoon Network, Disney Channel, Hungama,
        and the Disney Afternoon. Open a show for official store, streamer, and library links. Nothing
        plays on this site.
      </p>

      <form role="search" className="mt-6" onSubmit={onSubmit}>
        <label htmlFor={searchId} className="block text-sm font-extrabold text-navy">
          Search titles or characters
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Bheem, Doraemon, or Scrooge"
            autoComplete="off"
            className="min-h-12 w-full rounded-xl border border-line bg-card px-4 text-base text-ink shadow-sm"
          />
          <button
            type="submit"
            className="min-h-12 rounded-xl bg-navy px-5 font-extrabold text-paper sm:w-40"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h2 id="search-results" tabIndex={-1} className="text-lg font-extrabold text-navy">
          {trimmed ? "Matches" : "On the shelf"}
        </h2>
        <p className="mt-1 text-sm text-muted" aria-live="polite">
          {results.length === 1 ? "1 show" : `${results.length} shows`}
          {trimmed ? ` for “${trimmed}”` : " in the catalog"}.
        </p>

        {results.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-card px-5 py-8">
            <p className="font-extrabold text-navy">No matches on the shelf</p>
            <p className="mt-2 text-muted">
              Nothing in this catalog matches that title or character. The list only includes shows
              with an official page, store, or library link. Try a shorter name, such as Bheem,
              Doraemon, or Scrooge.
            </p>
          </div>
        ) : trimmed ? (
          <ShowCards matches={results} />
        ) : (
          shelfOrder.map((group) => {
            const matches = results.filter((match) => match.show.shelf === group.shelf);
            if (matches.length === 0) return null;
            return (
              <section key={group.shelf} aria-labelledby={`${group.shelf}-heading`} className="mt-8">
                <h3 id={`${group.shelf}-heading`} className="font-display text-3xl text-navy">
                  {group.heading}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {matches.length === 1 ? "1 show" : `${matches.length} shows`}. {group.intro}
                </p>
                <ShowCards matches={matches} />
              </section>
            );
          })
        )}
      </div>
    </section>
  );
}

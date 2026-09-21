"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type FormEvent } from "react";
import { matchShows } from "@/lib/search";
import type { Show } from "@/lib/types";

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
        Find the official door for a classic cartoon.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Search a show title or any character name. Results open a page of streaming, store, and
        library links. Nothing plays on this site.
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
            placeholder="Try TaleSpin, Scrooge, or Gadget"
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
          <p className="mt-6 rounded-2xl border border-dashed border-line bg-card px-5 py-8 text-muted">
            No title or character matches that search. Try a shorter name, such as Baloo or Pooh.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {results.map(({ show, matchedCharacter }) => (
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
                    <span className="mt-3 text-sm font-bold text-teal">
                      Character match: {matchedCharacter}
                    </span>
                  ) : (
                    <span className="mt-3 text-sm text-ink">
                      {show.characters.slice(0, 4).join(", ")}
                      {show.characters.length > 4 ? ` +${show.characters.length - 4}` : ""}
                    </span>
                  )}
                  <span className="mt-4 text-sm font-extrabold text-coral">Where to watch</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

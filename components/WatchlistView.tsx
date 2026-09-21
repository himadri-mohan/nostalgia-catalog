"use client";

import Link from "next/link";
import { readLibrary, writeLibrary } from "@/lib/library";
import type { Show } from "@/lib/types";
import { useHydrated, useLibrary } from "@/lib/use-library";

export function WatchlistView({ shows }: { shows: Show[] }) {
  const hydrated = useHydrated();
  const library = useLibrary();

  const saved = Object.entries(library)
    .filter(([, entry]) => entry.saved)
    .sort(([, a], [, b]) => b.updatedAt.localeCompare(a.updatedAt));

  function remove(slug: string) {
    const next = readLibrary();
    const current = next[slug];
    if (!current) return;
    next[slug] = { ...current, saved: false, updatedAt: new Date().toISOString() };
    writeLibrary(next);
  }

  return (
    <section aria-labelledby="watchlist-heading">
      <h1 id="watchlist-heading" className="font-display text-4xl text-navy sm:text-5xl">
        Watchlist
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-8 text-muted">
        Shows you save stay on this device, with any tags and notes you added. Clearing site data
        for this browser removes them.
      </p>

      {!hydrated ? (
        <p className="mt-8 text-muted" aria-live="polite">
          Loading your watchlist…
        </p>
      ) : saved.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-card px-5 py-8">
          <p className="text-ink">Your watchlist is empty.</p>
          <Link href="/" className="mt-4 inline-flex min-h-11 items-center font-extrabold text-teal">
            Browse the catalog
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4">
          {saved.map(([slug, entry]) => {
            const show = shows.find((item) => item.slug === slug);
            return (
              <li key={slug} className="rounded-2xl border border-line bg-card p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    {show ? (
                      <Link href={`/shows/${show.slug}`} className="font-display text-3xl text-navy no-underline">
                        {show.title}
                      </Link>
                    ) : (
                      <p className="font-display text-3xl text-navy">{slug}</p>
                    )}
                    <p className="mt-1 text-sm text-muted">
                      {show ? <time dateTime={String(show.year)}>{show.year}</time> : "No longer in the catalog"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(slug)}
                    className="min-h-11 rounded-xl border border-navy px-4 text-sm font-extrabold text-navy"
                  >
                    Remove from watchlist
                  </button>
                </div>
                {entry.tags.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                    {entry.tags.map((tag) => (
                      <li key={tag} className="rounded-full bg-gold px-3 py-1 text-sm font-bold text-navy">
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {entry.notes.trim() ? (
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-ink">{entry.notes}</p>
                ) : (
                  <p className="mt-4 text-sm text-muted">No notes yet.</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

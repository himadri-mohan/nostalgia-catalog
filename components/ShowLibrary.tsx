"use client";

import { useState, type FormEvent } from "react";
import { EMPTY_ENTRY, normalizeTag, readLibrary, writeLibrary, type LibraryEntry } from "@/lib/library";
import { useHydrated, useLibrary } from "@/lib/use-library";

export function ShowLibrary({ slug, title }: { slug: string; title: string }) {
  const hydrated = useHydrated();
  const library = useLibrary();
  const entry = library[slug] ?? EMPTY_ENTRY;
  const [tagDraft, setTagDraft] = useState("");
  const [tagMessage, setTagMessage] = useState("");

  function update(next: LibraryEntry) {
    const state = readLibrary();
    state[slug] = { ...next, updatedAt: new Date().toISOString() };
    writeLibrary(state);
  }

  function toggleSaved() {
    update({ ...entry, saved: !entry.saved });
  }

  function onAddTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const tag = normalizeTag(tagDraft);
    if (!tag) {
      setTagMessage("Enter a tag before adding it.");
      return;
    }
    if (entry.tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setTagMessage(`${tag} is already on this show.`);
      return;
    }
    if (entry.tags.length >= 12) {
      setTagMessage("This show already has 12 tags.");
      return;
    }
    update({ ...entry, tags: [...entry.tags, tag] });
    setTagDraft("");
    setTagMessage(`Added tag ${tag}.`);
  }

  function removeTag(tag: string) {
    update({ ...entry, tags: entry.tags.filter((existing) => existing !== tag) });
    setTagMessage(`Removed tag ${tag}.`);
  }

  return (
    <section aria-labelledby="device-heading" className="rounded-2xl border border-line bg-card p-5">
      <h2 id="device-heading" className="font-display text-3xl text-navy">
        On this device
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Watchlist, tags, and notes for {title} stay in this browser. Nothing is uploaded.
      </p>

      <button
        type="button"
        onClick={toggleSaved}
        disabled={!hydrated}
        aria-pressed={entry.saved}
        className={`mt-4 min-h-12 rounded-xl px-4 font-extrabold ${
          entry.saved ? "bg-gold text-navy" : "bg-teal text-paper"
        } disabled:opacity-60`}
      >
        {entry.saved ? "Remove from watchlist" : "Add to watchlist"}
      </button>
      <p className="mt-2 text-sm text-muted">
        {entry.saved
          ? "This show is on your watchlist. Removing it leaves notes and tags on this page."
          : "Add it when you want this show on your watchlist."}
      </p>

      <form className="mt-6" onSubmit={onAddTag}>
        <label htmlFor="show-tag" className="block text-sm font-extrabold text-navy">
          Tags
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="show-tag"
            value={tagDraft}
            onChange={(event) => setTagDraft(event.target.value)}
            maxLength={24}
            disabled={!hydrated}
            placeholder="Rewatch, with kids, own it"
            className="min-h-12 w-full rounded-xl border border-line bg-paper px-3"
          />
          <button
            type="submit"
            disabled={!hydrated}
            className="min-h-12 rounded-xl border border-navy px-4 font-extrabold text-navy disabled:opacity-60"
          >
            Add tag
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {tagMessage}
        </p>
      </form>

      {entry.tags.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <li key={tag} className="inline-flex items-center rounded-full bg-paper pl-3">
              <span className="text-sm font-bold text-navy">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="min-h-10 min-w-10 rounded-full px-2 text-sm font-bold text-navy"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">No tags yet.</p>
      )}

      <label htmlFor="show-notes" className="mt-6 block text-sm font-extrabold text-navy">
        Notes
      </label>
      <textarea
        id="show-notes"
        value={entry.notes}
        onChange={(event) => update({ ...entry, notes: event.target.value.slice(0, 1000) })}
        disabled={!hydrated}
        rows={4}
        maxLength={1000}
        placeholder="Which season you left off, or who you want to watch it with."
        className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2 leading-6"
      />
      <p className="mt-1 text-xs text-muted">{entry.notes.length} / 1000</p>
    </section>
  );
}

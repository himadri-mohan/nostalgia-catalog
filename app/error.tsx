"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="max-w-xl" role="alert">
      <h1 className="font-display text-4xl text-navy">The catalog hit a snag</h1>
      <p className="mt-3 text-lg leading-8 text-muted">
        Reload this page. Your watchlist stays in this browser either way.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 min-h-11 rounded-xl bg-navy px-4 font-extrabold text-paper"
      >
        Try again
      </button>
    </section>
  );
}

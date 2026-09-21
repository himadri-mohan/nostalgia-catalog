import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-xl">
      <h1 className="font-display text-4xl text-navy">That show is not on the shelf</h1>
      <p className="mt-3 text-lg leading-8 text-muted">
        The catalog only lists shows with official outbound links. Try a title or character from the
        home search.
      </p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center font-extrabold text-teal">
        Back to catalog
      </Link>
    </section>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { countSaved } from "@/lib/library";
import { useHydrated, useLibrary } from "@/lib/use-library";

const links = [
  { href: "/", label: "Catalog" },
  { href: "/watchlist", label: "Watchlist" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const library = useLibrary();
  const savedCount = hydrated ? countSaved(library) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-navy text-paper">
      <div className="flex h-2" aria-hidden="true">
        <span className="flex-1 bg-coral" />
        <span className="flex-1 bg-[#e0b03a]" />
        <span className="flex-1 bg-teal" />
        <span className="flex-1 bg-[#2f6f9f]" />
        <span className="flex-1 bg-paper" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <Link href="/" className="rounded-md py-1 no-underline">
          <span className="block font-display text-2xl leading-none text-paper">Nostalgia Catalog</span>
          <span className="mt-1 block text-sm text-[#f3d48a]">Classic cartoons, legal links only</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-2">
            {links.map((link) => {
              const current = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              const label =
                link.href === "/watchlist" && savedCount
                  ? `Watchlist, ${savedCount} saved`
                  : link.label;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold no-underline ${
                      current ? "bg-paper text-navy" : "text-paper hover:bg-white/10"
                    }`}
                  >
                    <span className="sr-only">{label}</span>
                    <span aria-hidden="true">
                      {link.label}
                      {link.href === "/watchlist" && savedCount ? ` (${savedCount})` : ""}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

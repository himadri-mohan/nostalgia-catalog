import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-[#efe4d0]">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 text-sm leading-6 text-muted sm:px-8">
        <AffiliateDisclosure />
        <p className="mt-2">
          Nostalgia Catalog is an independent fan directory. It is not affiliated with, endorsed by,
          or sponsored by Disney, Warner Bros. Discovery, Paramount, Nickelodeon, Hanna-Barbera,
          Amazon, Apple, or any studio, streamer, or store linked from this site. Show names are used
          so you can find the official release.
        </p>
        <p className="mt-2">
          This site does not host, embed, scrape, or redistribute video, and it does not offer a free
          stream. Personal watchlists stay in this browser.
        </p>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { WatchlistView } from "@/components/WatchlistView";
import { getShows } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Watchlist",
  description:
    "Shows, tags, and notes saved in this browser. Nostalgia Catalog does not store an account or host video.",
};

export default function WatchlistPage() {
  return <WatchlistView shows={getShows()} />;
}

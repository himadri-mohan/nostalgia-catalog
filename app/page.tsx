import { CatalogSearch } from "@/components/CatalogSearch";
import { getShows } from "@/lib/catalog";

export default function HomePage() {
  return <CatalogSearch shows={getShows()} />;
}

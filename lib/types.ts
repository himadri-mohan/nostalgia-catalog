export const affiliateProviders = ["disney", "amazon", "apple", "none"] as const;

export type AffiliateProvider = (typeof affiliateProviders)[number];

export type LegalSource = {
  name: string;
  url: string;
  detail: string;
};

export const shelves = ["india-original", "india-import", "classic"] as const;

export type Shelf = (typeof shelves)[number];

export type Show = {
  slug: string;
  title: string;
  year: number;
  blurb: string;
  characters: string[];
  legalSources: LegalSource[];
  shelf: Shelf;
};

export type ResolvedLink = LegalSource & {
  href: string;
  provider: AffiliateProvider;
  sponsored: boolean;
};

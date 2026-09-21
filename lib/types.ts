export const affiliateProviders = ["disney", "amazon", "apple", "none"] as const;

export type AffiliateProvider = (typeof affiliateProviders)[number];

export type LegalSource = {
  name: string;
  url: string;
  detail: string;
};

export type Show = {
  slug: string;
  title: string;
  year: number;
  blurb: string;
  characters: string[];
  legalSources: LegalSource[];
};

export type ResolvedLink = LegalSource & {
  href: string;
  provider: AffiliateProvider;
};

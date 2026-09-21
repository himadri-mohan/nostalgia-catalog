import type { AffiliateProvider } from "./types";

export type EnvSource = Record<string, string | undefined>;

const TOKEN_PATTERN = /^[A-Za-z0-9._~-]{1,80}$/;

const PROVIDER_RULES: Record<
  Exclude<AffiliateProvider, "none">,
  { param: string; envKeys: string[]; hosts: string[] }
> = {
  amazon: {
    param: "tag",
    envKeys: ["AFFILIATE_AMAZON_TAG", "NEXT_PUBLIC_AFFILIATE_AMAZON_TAG"],
    hosts: ["amazon.com"],
  },
  apple: {
    param: "at",
    envKeys: ["AFFILIATE_APPLE_AT", "NEXT_PUBLIC_AFFILIATE_APPLE_AT"],
    hosts: ["tv.apple.com", "itunes.apple.com", "apple.com"],
  },
  disney: {
    param: "cid",
    envKeys: ["AFFILIATE_DISNEY_CID", "NEXT_PUBLIC_AFFILIATE_DISNEY_CID"],
    hosts: ["disneyplus.com"],
  },
};

function readToken(env: EnvSource, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function hostAllowed(hostname: string, hosts: string[]): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return hosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

export function inferProvider(url: string): AffiliateProvider {
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return "none";
  }
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (host === "disneyplus.com" || host.endsWith(".disneyplus.com")) return "disney";
  if (host === "amazon.com" || host.endsWith(".amazon.com")) return "amazon";
  if (
    host === "tv.apple.com" ||
    host.endsWith(".tv.apple.com") ||
    host === "itunes.apple.com" ||
    host.endsWith(".itunes.apple.com") ||
    host === "apple.com" ||
    host.endsWith(".apple.com")
  ) {
    return "apple";
  }
  return "none";
}

/**
 * Append an affiliate query param when a matching env value exists.
 * Unknown hosts, non-HTTPS URLs, and unsafe token characters keep the original URL.
 */
export function applyAffiliate(
  url: string,
  provider: AffiliateProvider,
  env: EnvSource = process.env,
): string {
  if (provider === "none") return url;

  const rule = PROVIDER_RULES[provider];
  const token = readToken(env, rule.envKeys);
  if (!token || !TOKEN_PATTERN.test(token)) return url;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (parsed.protocol !== "https:") return url;
  if (!hostAllowed(parsed.hostname, rule.hosts)) return url;

  parsed.searchParams.set(rule.param, token);
  return parsed.toString();
}

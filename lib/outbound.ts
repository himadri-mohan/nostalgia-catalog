import { connection } from "next/server";
import { applyAffiliate, inferProvider } from "./affiliate";
import type { LegalSource, ResolvedLink } from "./types";

export async function resolveLegalLinks(sources: LegalSource[]): Promise<ResolvedLink[]> {
  await connection();
  const env = process.env;
  return sources.map((source) => {
    const provider = inferProvider(source.url);
    const href = applyAffiliate(source.url, provider, env);
    return {
      ...source,
      provider,
      href,
      sponsored: href !== source.url,
    };
  });
}

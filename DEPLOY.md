# Deploy Nostalgia Catalog on Vercel

This is a Next.js App Router app. It stores show metadata and outbound links only. It does not host, embed, or scrape video. Watchlists stay in each browser’s `localStorage`.

Real affiliate ids belong in Vercel, never in git. Leave a variable blank to publish the plain official URL.

## Connect the GitHub repo

1. Push `himadri-mohan/nostalgia-catalog` to GitHub if it is not already there.
2. Sign in at [vercel.com/new](https://vercel.com/new).
3. Import the GitHub repository. Grant Vercel access to the repo if it is not listed.
4. Leave the root directory as the repo root. [`vercel.json`](vercel.json) pins the framework to Next.js, installs with `npm ci`, and builds with `npm run build`. It leaves the output directory as the Next.js default. That overrides project settings from an earlier import, when this repository only contained a README and Vercel treated it as a static site looking for a `public` directory.
5. Add the environment variables below, then deploy.

Vercel builds again on each push to the connected branch. After you change an environment variable, redeploy so the running server picks up the new value.

## Vercel environment variables

Set these under **Project → Settings → Environment Variables**. Apply them to **Production**. Add the same values to **Preview** only when you want preview URLs to use the live affiliate ids and canonical origin.

| Variable | Required | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended for production | Public origin for canonical URLs, Open Graph, `sitemap.xml`, and `robots.txt`. Example shape: `https://your-domain.example`. Include `https://`, no path, no trailing slash. If unset, the app uses `https://$VERCEL_URL` (set by Vercel) or `http://localhost:3000` locally. |
| `AFFILIATE_AMAZON_TAG` | Optional | Amazon Associates tracking id. Appended as `tag` on `amazon.com` links. |
| `AFFILIATE_APPLE_AT` | Optional | Apple Services affiliate token. Appended as `at` on Apple TV links. |
| `AFFILIATE_DISNEY_CID` | Optional | Disney+ campaign id. Appended as `cid` on `disneyplus.com` links. |
| `NEXT_PUBLIC_AFFILIATE_AMAZON_TAG` | Optional fallback | Used only when `AFFILIATE_AMAZON_TAG` is unset. |
| `NEXT_PUBLIC_AFFILIATE_APPLE_AT` | Optional fallback | Used only when `AFFILIATE_APPLE_AT` is unset. |
| `NEXT_PUBLIC_AFFILIATE_DISNEY_CID` | Optional fallback | Used only when `AFFILIATE_DISNEY_CID` is unset. |

Prefer the server-only names (`AFFILIATE_*`). The server-only name wins when both are set. Values may use letters, numbers, dots, underscores, tildes, and hyphens, up to 80 characters. Anything else is ignored so a bad value cannot rewrite the URL.

WorldCat, Paramount+, and any other host outside those three rules never receive an affiliate parameter.

Only set an id from an affiliate program you are allowed to use. This app does not create Amazon, Apple, or Disney accounts.

`VERCEL_URL` is provided by Vercel. Do not add it yourself.

## Post-deploy smoke test

Replace `https://your-domain.example` with the deployment URL.

1. Open `/`. Confirm the title is “Nostalgia Catalog — Where to Watch Classic Cartoons Legally”, the catalog lists shows, and search for `Scooby` and `Scrooge` each returns a show.
2. Open `/robots.txt`. It should allow `/` and list `Sitemap: https://your-domain.example/sitemap.xml`.
3. Open `/sitemap.xml`. It should list `/` and each `/shows/[slug]` page.
4. Open `/shows/ducktales`. Confirm the year, blurb, characters, affiliate disclosure next to **Where to watch**, and the footer line that this site is not affiliated with Disney or the other named companies.
5. Confirm outbound links are `https` pages on `disneyplus.com`, `amazon.com`, `tv.apple.com`, `paramountplus.com`, or `search.worldcat.org`. None should be a video file or an unofficial stream.
6. With `AFFILIATE_AMAZON_TAG` set, the Amazon link on a show page includes `tag=` and the button says “Affiliate link”. The WorldCat link on the same page does not include `tag`, `at`, or `cid`.
7. With `AFFILIATE_APPLE_AT` set, an Apple TV link includes `at=`. With `AFFILIATE_DISNEY_CID` set, a Disney+ link includes `cid=`.
8. Open `/watchlist` before saving anything. You should see “Nothing saved on this device yet”. Add a show from its page, return to `/watchlist`, then remove it and confirm the empty state returns.
9. View the page source for `/` and `/shows/ducktales` and confirm `og:title` and `og:description` are present.

If an affiliate query param is missing, check the variable name, confirm it was saved for the environment you deployed, and redeploy.

# Nostalgia Catalog

A public catalog of where to watch classic cartoons legally. Search a title or character, open the show, and follow an official streaming, store, or library link.

This app stores metadata and outbound links only. It does not host, embed, scrape, or redistribute video.

Personal watchlist items, tags, and notes stay in `localStorage` on the device. There is no account and no database.

## Routes

| Route | What it does |
| --- | --- |
| `/` | Search show titles and character names. Each result links to a show page. |
| `/shows/[slug]` | Show year, blurb, characters, and “Where to watch” links. SEO title and description. Add or remove the watchlist, tags, and notes. |
| `/watchlist` | Shows saved in this browser, with their tags and notes. |
| `/shows` | Redirects to the catalog. |

Seed data lives in [`data/shows.json`](data/shows.json). Disney+ entries point at official series pages. Amazon, Apple TV, and WorldCat entries are searches on those services.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Leave the affiliate values blank in `.env.local` unless you are testing a real id. `.env.local` is gitignored.

```bash
npm test
npm run build
```

## Affiliate environment variables

“Where to watch” links are built on the server when the show page renders. If a variable below is unset or blank, that link stays the plain official URL from the catalog. Real ids belong in the host’s environment, never in git.

| Variable | Fallback | Applied to | Query param |
| --- | --- | --- | --- |
| `AFFILIATE_AMAZON_TAG` | `NEXT_PUBLIC_AFFILIATE_AMAZON_TAG` | `amazon.com` links | `tag` |
| `AFFILIATE_APPLE_AT` | `NEXT_PUBLIC_AFFILIATE_APPLE_AT` | Apple TV links | `at` |
| `AFFILIATE_DISNEY_CID` | `NEXT_PUBLIC_AFFILIATE_DISNEY_CID` | `disneyplus.com` links | `cid` |

The server-only name wins when both are set. Values may use letters, numbers, dots, underscores, tildes, and hyphens (up to 80 characters). Anything else is ignored so a bad value cannot rewrite the URL. WorldCat links never receive an affiliate param.

Example `.env.local` (placeholders only):

```bash
AFFILIATE_AMAZON_TAG=
AFFILIATE_APPLE_AT=
AFFILIATE_DISNEY_CID=
```

## Deploy on Vercel from this GitHub repo

The app is a Next.js App Router project. Vercel detects that from `package.json` and `app/`.

1. Push this repository to GitHub (`himadri-mohan/nostalgia-catalog`).
2. Sign in at [vercel.com/new](https://vercel.com/new).
3. Import the GitHub repository. If it is not listed, grant Vercel access to the repo first.
4. Leave the framework preset as **Next.js**. Root directory is the repo root. Build command is `npm run build`. Output is the Next.js default.
5. Open **Environment Variables** and add any affiliate ids you want, using the names in the table above. You can skip them and add them later.
6. Deploy.

After the first deploy, Vercel builds on each push to the connected branch. To change an affiliate id, update the variable in **Project → Settings → Environment Variables**, then redeploy so the running server picks up the new value.

Do not put real affiliate ids in `data/shows.json`, `.env.example`, or any committed file.

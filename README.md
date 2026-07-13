# Matchday — Football Ticket Sales

Real sign-up, sign-in, and email verification powered by Clerk.
Fixture browsing, seat selection, and a "My tickets" page.

## 1. Get a free Clerk account

1. Go to https://dashboard.clerk.com and sign up
2. Create a new application
3. Copy the **Publishable key** shown on the setup screen

## 1b. Get a free football fixtures API key

1. Go to https://www.football-data.org/client/register and sign up (free)
2. Copy the API token from your account page
3. This key is used **server-side only** — never put it in `.env` with a
   `VITE_` prefix, or it would be visible to anyone viewing the site's code

Free tier covers Premier League and La Liga (and a few others) with a
request-rate limit — fine for a small site. Real ticket/seller prices
aren't included in any free API; those numbers on the site are
placeholders until you connect a real pricing source (see
`src/data/matches.ts`).

## 2. Run it locally

```bash
npm install
cp .env.example .env
# paste your publishable key into .env
npm run dev
```

Open the local URL it prints. Try "Sign in to book" — Clerk will show
a real sign-up form, send a real verification email/code, and only
let you in once it's confirmed.

## 3. Put it on GitHub

```bash
git init
git add .
git commit -m "Initial commit"
```

Then create a new repo on github.com and follow its "push an existing
repository" instructions.

## 4. Deploy on Vercel

1. Go to vercel.com → New Project → import your GitHub repo
2. Before deploying, open **Environment Variables** and add:
   - Key: `VITE_CLERK_PUBLISHABLE_KEY`, Value: (your Clerk key)
   - Key: `FOOTBALL_API_KEY`, Value: (your football-data.org key — no `VITE_` prefix)
3. Click Deploy

## Important note on the import name

This project imports Clerk from **`@clerk/clerk-react`**, not
`@clerk/react`. The latter isn't an installable package — using it
was the cause of a previous build failure. Don't change this import.

## Before taking real payments

`src/lib/bookings.ts` currently saves bookings to the browser's
localStorage so the app works end-to-end today. That's fine for
testing, but it's not safe for real sales (no server checks whether
a seat's already taken, and tickets won't sync across devices). Swap
it for a real backend + database before going live.

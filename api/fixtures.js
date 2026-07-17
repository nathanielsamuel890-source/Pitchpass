// Vercel serverless function — runs on the server, not in the browser.
// This keeps FOOTBALL_API_KEY and SEATGEEK_CLIENT_ID hidden from anyone
// viewing the site's code.
//
// Uses football-data.org's free tier: https://www.football-data.org/
// Free tier covers a handful of top competitions (Premier League, Primera
// Division/La Liga, and others) with a request-rate limit — fine for a
// small site, not for high traffic.

const SEATGEEK_CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;

async function getSeatGeekPricing(home, away) {
  if (!SEATGEEK_CLIENT_ID) return null;
  try {
    const q = encodeURIComponent(`${home} vs ${away}`);
    const url = `https://api.seatgeek.com/2/events?client_id=${SEATGEEK_CLIENT_ID}&q=${q}&per_page=1`;
    const r = await fetch(url);
    const data = await r.json();
    const event = data.events && data.events[0];
    if (!event || !event.stats) return null;
    return {
      lowest: event.stats.lowest_price ?? null,
      average: event.stats.average_price ?? null,
      highest: event.stats.highest_price ?? null,
    };
  } catch {
    return null;
  }
}

const MANUAL_FIXTURES = [
  {
    id: "wc-sf1",
    competition: "FIFA World Cup",
    home: "France",
    away: "Spain",
    homeCrest: "https://flagcdn.com/w80/fr.png",
    awayCrest: "https://flagcdn.com/w80/es.png",
    utcDate: "2026-07-14T19:00:00Z",
    date: "14 Jul 2026",
    time: "3:00 PM ET",
    venue: "AT&T Stadium, Arlington, Texas",
  },
  {
    id: "wc-sf2",
    competition: "FIFA World Cup",
    home: "England",
    away: "Argentina",
    homeCrest: "https://flagcdn.com/w80/gb-eng.png",
    awayCrest: "https://flagcdn.com/w80/ar.png",
    utcDate: "2026-07-15T19:00:00Z",
    date: "15 Jul 2026",
    time: "3:00 PM ET",
    venue: "Mercedes-Benz Stadium, Atlanta",
  },
  {
    id: "wc-final",
    competition: "FIFA World Cup",
    home: "Argentina",
    away: "Spain",
    homeCrest: "https://flagcdn.com/w80/ar.png",
    awayCrest: "https://flagcdn.com/w80/es.png",
    utcDate: "2026-07-19T19:00:00Z",
    date: "19 Jul 2026",
    time: "3:00 PM ET",
    venue: "MetLife Stadium, East Rutherford, New Jersey",
  },
];

export default async function handler(req, res) {
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error:
        "Missing FOOTBALL_API_KEY. Add it in Vercel's Environment Variables (server-side, no VITE_ prefix).",
    });
  }

  // Competitions covered by the free tier. Add/remove codes as needed:
  // PL = Premier League, PD = La Liga (Primera Division)
  // WC = World Cup, CL = Champions League — both free tier, no key upgrade needed
  const competitions = ["PL", "PD", "WC", "CL"];

  try {
    const results = await Promise.all(
      competitions.map((code) =>
        fetch(`https://api.football-data.org/v4/competitions/${code}/matches?status=SCHEDULED`, {
          headers: { "X-Auth-Token": apiKey },
        }).then((r) => r.json())
      )
    );

    const apiMatches = results
      .flatMap((r) => r.matches ?? [])
      .slice(0, 30)
      .map((m) => ({
        id: String(m.id),
        competition: m.competition?.name ?? "Football",
        home: m.homeTeam?.shortName ?? m.homeTeam?.name ?? "Home",
        away: m.awayTeam?.shortName ?? m.awayTeam?.name ?? "Away",
        homeCrest: m.homeTeam?.crest ?? null,
        awayCrest: m.awayTeam?.crest ?? null,
        utcDate: m.utcDate,
        date: new Date(m.utcDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: new Date(m.utcDate).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        venue: m.venue || `${m.competition?.area?.name ?? ""}`.trim() || "Venue TBC",
      }));

    // Auto-hide manual fixtures once their kickoff time has passed,
    // and enrich the still-upcoming ones with real SeatGeek pricing.
    const now = new Date();
    const activeManualFixtures = MANUAL_FIXTURES.filter(
      (f) => new Date(f.utcDate) > now
    );
    const manualFixturesWithPricing = await Promise.all(
      activeManualFixtures.map(async (f) => {
        const sgPricing = await getSeatGeekPricing(f.home, f.away);
        return sgPricing ? { ...f, sgPricing } : f;
      })
    );

    const matches = [...manualFixturesWithPricing, ...apiMatches];

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate"); // cache 30 min
    return res.status(200).json({ matches });
  } catch (err) {
    return res.status(502).json({ error: "Could not reach football-data.org" });
  }
}

// Vercel serverless function — runs on the server, not in the browser.
// This keeps FOOTBALL_API_KEY hidden from anyone viewing the site's code.
//
// Uses football-data.org's free tier: https://www.football-data.org/
// Free tier covers a handful of top competitions (Premier League, Primera
// Division/La Liga, and others) with a request-rate limit — fine for a
// small site, not for high traffic.

export default async function handler(req, res) {
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error:
        "Missing FOOTBALL_API_KEY. Add it in Vercel's Environment Variables (server-side, no VITE_ prefix).",
    });
  }

  // Competitions covered by the free tier. Add/remove codes as needed:
  // PL = Premier League, PD = La Liga (Primera Division), CL = Champions League
  const competitions = ["PL", "PD"];

  try {
    const results = await Promise.all(
      competitions.map((code) =>
        fetch(`https://api.football-data.org/v4/competitions/${code}/matches?status=SCHEDULED`, {
          headers: { "X-Auth-Token": apiKey },
        }).then((r) => r.json())
      )
    );

    const matches = results
      .flatMap((r) => r.matches ?? [])
      .slice(0, 20)
      .map((m) => ({
        id: String(m.id),
        competition: m.competition?.name ?? "Football",
        home: m.homeTeam?.shortName ?? m.homeTeam?.name ?? "Home",
        away: m.awayTeam?.shortName ?? m.awayTeam?.name ?? "Away",
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

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate"); // cache 30 min
    return res.status(200).json({ matches });
  } catch (err) {
    return res.status(502).json({ error: "Could not reach football-data.org" });
  }
}

import { useState, useEffect } from "react";
import { Search, ShieldCheck, Calendar, TrendingDown, Trophy, MapPin, Loader2 } from "lucide-react";
import { Fixture, Match, attachPlaceholderPricing } from "../data/matches";

const STATS = [
  { icon: ShieldCheck, value: "6+", label: "Verified Sellers Compared" },
  { icon: Calendar, value: "49+", label: "Matches Tracked" },
  { icon: TrendingDown, value: "23%", label: "Average Savings" },
  { icon: Trophy, value: "4+", label: "Competitions Covered" },
];

export default function FixturesPage() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/fixtures");
        const data = await res.json();
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
        } else {
          const fixtures: Fixture[] = data.matches ?? [];
          setMatches(attachPlaceholderPricing(fixtures));
        }
      } catch {
        if (!cancelled) setError("Couldn't load fixtures right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = query
    ? matches.filter(
        (m) =>
          m.home.toLowerCase().includes(query.toLowerCase()) ||
          m.away.toLowerCase().includes(query.toLowerCase())
      )
    : matches;

  return (
    <main>
      {/* Hero */}
      <section className="bg-page px-6 py-14 text-center">
        <span className="inline-block rounded-full bg-blue-50 text-brand text-xs font-medium px-3 py-1 mb-4">
          The Smart Way to Buy Football Tickets
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight max-w-xl mx-auto">
          Don't overpay for your stadium seat.{" "}
          <span className="text-brand">Compare prices.</span>
        </h1>
        <p className="text-muted max-w-md mx-auto mt-4 text-sm">
          We scan multiple verified ticket resale platforms to find you the
          cheapest and most secure seats for any match.
        </p>

        <div className="flex max-w-lg mx-auto mt-6 gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-2.5">
            <Search size={16} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by team, match, or stadium... e.g. Real Madrid"
              className="flex-1 bg-transparent text-sm text-ink placeholder-muted focus:outline-none"
            />
          </div>
          <button className="rounded-full bg-brand text-white text-sm font-semibold px-6 hover:brightness-110 transition-all">
            Search
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-savings" /> 100% Verified Sellers
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-savings" /> Transparent Pricing
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-savings" /> Secure Checkout
          </span>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-panel border-y border-border px-6 py-8">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <s.icon size={20} className="mx-auto text-brand mb-2" />
              <p className="text-xl font-bold text-ink">{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* High-demand matches */}
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-ink">High-Demand Matches</h2>
            <p className="text-muted text-sm mt-1">
              The most sought-after tickets on the market right now.
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-page transition-colors whitespace-nowrap">
            View all matches →
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {loading && (
            <div className="col-span-2 flex items-center justify-center gap-2 text-muted py-10">
              <Loader2 size={18} className="animate-spin" /> Loading live fixtures...
            </div>
          )}

          {!loading && error && (
            <div className="col-span-2 rounded-xl border border-border bg-panel p-6 text-center text-sm text-muted">
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="col-span-2 rounded-xl border border-border bg-panel p-6 text-center text-sm text-muted">
              No upcoming fixtures found.
            </div>
          )}

          {!loading &&
            !error &&
            filtered.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-border bg-panel p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1 rounded-full bg-page text-muted text-xs px-2.5 py-1">
                  <Trophy size={11} /> {m.competition}
                </span>
                {m.hot && (
                  <span className="rounded-full bg-blue-50 text-brand text-xs font-medium px-2.5 py-1">
                    Hot Match
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col items-center gap-1.5 w-20">
                  <span
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: m.homeColor }}
                  >
                    {m.home.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-xs font-medium text-ink text-center">{m.home}</span>
                </div>
                <span className="text-muted text-xs">vs</span>
                <div className="flex flex-col items-center gap-1.5 w-20">
                  <span
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: m.awayColor }}
                  >
                    {m.away.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-xs font-medium text-ink text-center">{m.away}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {m.date} · {m.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {m.venue}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">{m.sellers} Sellers</span>
                    <span className="rounded bg-green-50 text-savings text-xs font-semibold px-1.5 py-0.5">
                      -{m.discountPct}%
                    </span>
                  </div>
                  <p className="mt-0.5">
                    <span className="text-xs text-muted">From </span>
                    <span className="text-lg font-bold text-brand">£{m.fromPrice.toFixed(2)}</span>{" "}
                    <span className="text-xs text-muted line-through">
                      £{m.originalPrice.toFixed(2)}
                    </span>
                  </p>
                </div>
                <button className="rounded-full bg-brand text-white text-sm font-semibold px-5 py-2 hover:brightness-110 transition-all">
                  Compare
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

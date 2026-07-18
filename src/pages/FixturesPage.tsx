import { useState, useEffect } from "react";
import {
  Search,
  ShieldCheck,
  Calendar,
  TrendingDown,
  TrendingUp,
  Trophy,
  MapPin,
  Loader2,
  X,
  Users,
  LayoutGrid,
  List as ListIcon,
  Smartphone,
} from "lucide-react";
import { Fixture, Match, PriceTier, Listing, attachPlaceholderPricing } from "../data/matches";
import { whatsappOrderUrl } from "../lib/whatsapp";

const STATS = [
  { icon: ShieldCheck, value: "6+", label: "Verified Sellers Compared" },
  { icon: Calendar, value: "49+", label: "Matches Tracked" },
  { icon: TrendingDown, value: "23%", label: "Average Savings" },
  { icon: Trophy, value: "4+", label: "Competitions Covered" },
];

const QUANTITY_OPTIONS = ["1", "2", "3", "4", "5", "5+"];

type ListingSort = "best-deal" | "price-low" | "price-high";

// Small mini stadium/pitch thumbnail used on each listing row
function StadiumThumb() {
  return (
    <svg viewBox="0 0 56 56" className="h-full w-full">
      <rect width="56" height="56" fill="var(--color-page, #f3f4f6)" />
      <circle cx="28" cy="28" r="22" fill="none" stroke="#d1d5db" strokeWidth="1.5" />
      <circle cx="28" cy="28" r="14" fill="none" stroke="#d1d5db" strokeWidth="1.5" />
      <rect x="18" y="20" width="20" height="16" rx="2" fill="#22c55e" opacity="0.9" />
      <rect x="21" y="23" width="14" height="10" rx="1" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

export default function FixturesPage() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantityFor, setQuantityFor] = useState<Match | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<"soonest" | "price-low" | "price-high">("soonest");
  const [listingSort, setListingSort] = useState<ListingSort>("best-deal");

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

  const competitions = Array.from(new Set(matches.map((m) => m.competition)));

  const filtered = matches
    .filter((m) => {
      const q = query.toLowerCase();
      const matchesQuery = query
        ? m.home.toLowerCase().includes(q) ||
          m.away.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q) ||
          m.competition.toLowerCase().includes(q)
        : true;
      const matchesCategory = category ? m.competition === category : true;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "price-low") return a.fromPrice - b.fromPrice;
      if (sort === "price-high") return b.fromPrice - a.fromPrice;
      return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(); // soonest
    });

  const sortedListings = quantityFor
    ? [...quantityFor.listings].sort((a, b) => {
        if (listingSort === "price-high") return b.price - a.price;
        return a.price - b.price; // best-deal and price-low both ascend by price
      })
    : [];

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
              placeholder="Search by team, competition, or stadium... e.g. Real Madrid"
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

      {/* Top Football Matches carousel */}
      {!loading && !error && matches.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-ink">Top Football Matches</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const el = document.getElementById("top-matches-scroll");
                  el?.scrollBy({ left: -260, behavior: "smooth" });
                }}
                aria-label="Scroll left"
                className="rounded-full border border-border p-1.5 hover:border-brand"
              >
                ←
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("top-matches-scroll");
                  el?.scrollBy({ left: 260, behavior: "smooth" });
                }}
                aria-label="Scroll right"
                className="rounded-full border border-border p-1.5 hover:border-brand"
              >
                →
              </button>
            </div>
          </div>
          <div
            id="top-matches-scroll"
            className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth"
          >
            {matches.slice(0, 8).map((m) => (
              <div
                key={`top-${m.id}`}
                className="shrink-0 w-56 rounded-xl border border-border bg-panel overflow-hidden"
              >
                <div className="h-24 bg-page flex items-center justify-center gap-3">
                  {m.homeCrest ? (
                    <img src={m.homeCrest} alt={m.home} className="h-10 w-10 object-contain" />
                  ) : (
                    <span className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-50 text-xs font-medium">
                      {m.home.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="text-xs text-muted">vs</span>
                  {m.awayCrest ? (
                    <img src={m.awayCrest} alt={m.away} className="h-10 w-10 object-contain" />
                  ) : (
                    <span className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-50 text-xs font-medium">
                      {m.away.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-ink text-sm truncate">
                    {m.home} vs {m.away}
                  </p>
                  <p className="text-xs text-muted mt-1">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
        {/* Browse by competition */}
        {competitions.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
            <button
              onClick={() => setCategory(null)}
className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
  category === null
    ? "border-brand bg-blue-50 text-brand"
    : "border-border text-muted hover:border-brand"
}`}
            >
              All
            </button>
            {competitions.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c === category ? null : c)}
className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
  category === c
    ? "border-brand bg-blue-50 text-brand"
    : "border-border text-muted hover:border-brand"
}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-ink">High-Demand Matches</h2>
            <p className="text-muted text-sm mt-1">
              The most sought-after tickets on the market right now.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-full border border-border bg-panel px-3 py-1.5 text-sm text-ink focus:outline-none"
            >
              <option value="soonest">Soonest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div className="flex items-center gap-1 rounded-full border border-border p-1">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`rounded-full p-1.5 transition-colors ${
                  view === "grid" ? "bg-blue-50 text-brand" : "text-muted"
                  }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`rounded-full p-1.5 transition-colors ${
                  view === "list" ? "bg-blue-50 text-brand" : "text-muted"
                }`}
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-muted py-10">
            <Loader2 size={18} className="animate-spin" /> Loading live fixtures...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-border bg-panel p-6 text-center text-sm text-muted">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-panel p-6 text-center text-sm text-muted">
            No upcoming fixtures found.
          </div>
        )}

        {!loading && !error && filtered.length > 0 && view === "list" && (
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
            {filtered.map((m) => {
              const d = new Date(m.utcDate);
              const dayNum = d.getDate();
              const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
              const month = d.toLocaleDateString("en-GB", { month: "short" });
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setQuantityFor(m);
                    setSelectedListing(m.listings[0]);
                    setListingSort("best-deal");
                  }}
                  className="flex items-center gap-4 bg-panel px-4 py-3 text-left hover:bg-page transition-colors"
                >
                  <div className="flex flex-col items-center justify-center w-12 shrink-0">
                    <span className="text-xs text-muted uppercase">{month}</span>
                    <span className="text-lg font-bold text-ink leading-none">{dayNum}</span>
                    <span className="text-xs text-muted">{weekday}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">
                      {m.home} vs {m.away}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {m.competition} · {m.time} · {m.venue}
                    </p>
                    {m.priceTrend === "up" && (
                      <span className="inline-flex items-center gap-1 text-xs text-red-500 mt-0.5">
                        <TrendingUp size={12} /> Prices increasing soon
                      </span>
                    )}
                    {m.priceTrend === "down" && (
                      <span className="inline-flex items-center gap-1 text-xs text-savings mt-0.5">
                        <TrendingDown size={12} /> Prices dropped
                      </span>
                    )}
                    {m.priceTrend === "stable" && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted mt-0.5">
                        <Users size={12} /> {m.viewers} people viewing
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted">From</p>
                    <Price amount={m.fromPrice} from={m.currency} className="font-bold text-brand" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
{!loading && !error && filtered.length > 0 && view === "grid" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((m) => (
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
                    {m.homeCrest ? (
                      <img
                        src={m.homeCrest}
                        alt={m.home}
                        className="h-10 w-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: m.homeColor }}
                      >
                        {m.home.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="text-xs font-medium text-ink text-center">{m.home}</span>
                  </div>
                  <span className="text-muted text-xs">vs</span>
                  <div className="flex flex-col items-center gap-1.5 w-20">
                    {m.awayCrest ? (
                      <img
                        src={m.awayCrest}
                        alt={m.away}
                        className="h-10 w-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: m.awayColor }}
                      >
                        {m.away.slice(0, 2).toUpperCase()}
                      </span>
                    )}
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
  <Price amount={m.fromPrice} from={m.currency} className="text-lg font-bold text-brand" />
  <span className="text-xs text-muted line-through">
    <Price amount={m.originalPrice} from={m.currency} />
  </span>
</p>
                  </div>
                  <button
                    onClick={() => {
                      setQuantityFor(m);
                      setSelectedListing(m.listings[0]);
                      setListingSort("best-deal");
                    }}
                    className="rounded-full bg-brand text-white text-sm font-semibold px-5 py-2 hover:brightness-110 transition-all"
                  >
                    Buy Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {quantityFor && selectedListing && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
          onClick={() => setQuantityFor(null)}
        >
          <div
            className="w-full sm:max-w-md rounded-2xl bg-panel p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-ink">Choose your seats</h3>
              <button
                onClick={() => setQuantityFor(null)}
                className="text-muted hover:text-ink"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-muted mb-4">
              {quantityFor.home} vs {quantityFor.away}
            </p>

            {/* Listings header: count + sort, like SeatPick */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                {quantityFor.listings.length} Listings
              </p>
              <select
                value={listingSort}
                onChange={(e) => setListingSort(e.target.value as ListingSort)}
                className="rounded-full border border-border bg-panel px-2.5 py-1 text-xs text-ink focus:outline-none"
              >
                <option value="best-deal">Best Deal</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Listing cards */}
            <div className="flex flex-col divide-y divide-border mb-5 max-h-80 overflow-y-auto rounded-xl border border-border">
              {sortedListings.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => setSelectedListing(listing)}
 className={`flex items-center gap-3 px-3 py-3 text-left transition-colors ${
  selectedListing?.id === listing.id ? "bg-blue-50" : "bg-panel hover:bg-page"
}`}
                >
                  <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-border">
                    <StadiumThumb />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">{listing.label}</p>
                    <p className="text-xs text-muted truncate">{listing.ticketCount}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="inline-flex items-center gap-1 rounded bg-green-50 text-savings text-[11px] font-semibold px-1.5 py-0.5">
                        <ShieldCheck size={10} /> {listing.quality}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-page text-muted text-[11px] px-1.5 py-0.5">
                        <Smartphone size={10} /> Mobile Tickets
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-bold text-ink text-sm">
  <Price amount={listing.price} from={quantityFor?.currency ?? "GBP"} />
</p>
                    <p className="text-[11px] text-muted">each</p>
                    <p className="text-[11px] text-muted mt-1.5">{listing.vendor}</p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
              How many tickets?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {QUANTITY_OPTIONS.map((q) => (
                <a
                  key={q}
                  href={whatsappOrderUrl(quantityFor, q, selectedListing)}
                  onClick={() => setQuantityFor(null)}
                  className="flex items-center justify-center rounded-xl border border-border py-3 text-ink font-semibold hover:border-brand hover:text-brand hover:bg-blue-50 transition-colors"
                >
                  {q}
                </a>
              ))}
            </div>
            <p className="flex items-center justify-center gap-1 text-xs text-muted mt-4">
              <ShieldCheck size={13} className="text-savings" /> Verified sellers · Secure checkout
            </p>
          </div>
        </div>
      )}
    </main>
  );
                  }

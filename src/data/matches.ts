export type Fixture = {
  id: string;
  competition: string;
  home: string;
  away: string;
  homeCrest: string | null;
  awayCrest: string | null;
  date: string;
  time: string;
  venue: string;
};

export type Match = Fixture & {
  hot: boolean;
  homeColor: string;
  awayColor: string;
  sellers: number;
  fromPrice: number;
  originalPrice: number;
  discountPct: number;
  seller: string;
  section: string;
};

const COLORS = ["#C8102E", "#1E5AA8", "#A50044", "#EE2523", "#5E5CE6", "#16A34A", "#DB7A00"];
const SELLER_NAMES = ["Football Ticket Net", "StadiumSeats", "MatchDay Resale", "GoalLine Tickets"];
const SECTIONS = ["Main Stand", "East Stand", "West Stand", "North End", "Family Zone"];

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

/**
 * PLACEHOLDER PRICING — no free API provides real ticket/seller prices.
 * This generates plausible-looking numbers so the layout has something
 * to show. Replace with real data once you have a seller/pricing source
 * (either your own listings or a paid ticket marketplace API).
 */
export function attachPlaceholderPricing(fixtures: Fixture[]): Match[] {
  return fixtures.map((f, i) => {
    const original = 80 + ((f.id.charCodeAt(0) + i * 17) % 150);
    const discountPct = 15 + (i % 4) * 5;
    const fromPrice = Math.round(original * (1 - discountPct / 100) * 10) / 10;
    return {
      ...f,
      hot: i < 4,
      homeColor: colorFor(f.home),
      awayColor: colorFor(f.away),
      sellers: 2 + (i % 5),
      fromPrice,
      originalPrice: original,
      discountPct,
      seller: SELLER_NAMES[i % SELLER_NAMES.length],
      section: SECTIONS[i % SECTIONS.length],
    };
  });
}

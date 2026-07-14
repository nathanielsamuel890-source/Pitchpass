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

function hashStr(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

function colorFor(name: string) {
  return COLORS[hashStr(name) % COLORS.length];
}

const DISCOUNTS = [10, 15, 18, 22, 25, 28, 32, 35, 40];

/**
 * PLACEHOLDER PRICING — no free API provides real ticket/seller prices.
 * This generates plausible-looking numbers so the layout has something
 * to show. Replace with real data once you have a seller/pricing source
 * (either your own listings or a paid ticket marketplace API).
 */
export function attachPlaceholderPricing(fixtures: Fixture[]): Match[] {
  return fixtures.map((f, i) => {
    const priceHash = hashStr(f.id + f.home + f.away);
    const original = 45 + (priceHash % 280); // £45–£325 spread
    const discountPct = DISCOUNTS[(priceHash >> 3) % DISCOUNTS.length];
    const fromPrice = Math.round(original * (1 - discountPct / 100) * 10) / 10;
    return {
      ...f,
      hot: i < 4,
      homeColor: colorFor(f.home),
      awayColor: colorFor(f.away),
      sellers: 2 + (priceHash % 8),
      fromPrice,
      originalPrice: original,
      discountPct,
      seller: SELLER_NAMES[priceHash % SELLER_NAMES.length],
      section: SECTIONS[(priceHash >> 2) % SECTIONS.length],
    };
  });
}

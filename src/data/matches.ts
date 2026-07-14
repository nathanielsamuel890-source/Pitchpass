import { MANUAL_PRICES } from "./manualPrices";

export type Fixture = {
  id: string;
  competition: string;
  home: string;
  away: string;
  homeCrest: string | null;
  awayCrest: string | null;
  utcDate: string;
  date: string;
  time: string;
  venue: string;
};

export type PriceTier = {
  label: string;
  price: number;
  originalPrice: number;
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
  tiers: PriceTier[];
  viewers: number;
  priceTrend: "up" | "down" | "stable";
};

const COLORS = ["#C8102E", "#1E5AA8", "#A50044", "#EE2523", "#5E5CE6", "#16A34A", "#DB7A00"];
const SELLER_NAMES = ["Football Ticket Net", "StadiumSeats", "MatchDay Resale", "GoalLine Tickets"];
const SECTIONS = ["Main Stand", "East Stand", "West Stand", "North End", "Family Zone"];

function hashStr(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (s.charCodeAt(i) + ((hash << 5) - hash)) | 0; // keep hash within 32-bit range every step
  }
  return Math.abs(hash);
}

function colorFor(name: string) {
  return COLORS[hashStr(name) % COLORS.length];
}

const DISCOUNTS = [10, 15, 18, 22, 25, 28, 32, 35, 40];

// Pitch-side seats cost more than upper-tier ones — same pattern as real
// stadium seat maps (SeatPick, etc). "originalPrice"/"fromPrice" on a Match
// always reflect the cheapest (Upper Tier) price, matching how ticket
// sites show a "From £X" headline price on the card.
const TIERS = [
  { label: "Pitch Side", mult: 1.9 },
  { label: "Lower Tier", mult: 1.3 },
  { label: "Upper Tier", mult: 1 },
];

const MANUAL_LOOKUP = Object.fromEntries(
  Object.entries(MANUAL_PRICES).map(([k, v]) => [k.toLowerCase().trim(), v])
);

export function attachPlaceholderPricing(fixtures: Fixture[]): Match[] {
  return fixtures.map((f, i) => {
    const priceHash = hashStr(f.id + f.home + f.away);
    const manual = MANUAL_LOOKUP[`${f.home} vs ${f.away}`.toLowerCase().trim()];

    let original: number;
    let discountPct: number;
    let fromPrice: number;
    let tiers: PriceTier[];

    if (manual) {
      discountPct = manual.discountPct ?? 0;
      const withDiscount = (real: number) =>
        discountPct > 0 ? Math.round((real / (1 - discountPct / 100)) * 10) / 10 : real;
      tiers = [
        { label: "Pitch Side", price: manual.pitchSide, originalPrice: withDiscount(manual.pitchSide) },
        { label: "Lower Tier", price: manual.lowerTier, originalPrice: withDiscount(manual.lowerTier) },
        { label: "Upper Tier", price: manual.upperTier, originalPrice: withDiscount(manual.upperTier) },
      ];
      original = tiers[2].originalPrice;
      fromPrice = manual.upperTier;
    } else {
      // PLACEHOLDER PRICING — no free API provides real ticket/seller prices.
      // This generates plausible-looking numbers so the layout has something
      // to show. Add a real price in manualPrices.ts to override this for
      // any specific match.
      original = 45 + (priceHash % 280); // £45–£325 spread (Upper Tier)
      discountPct = DISCOUNTS[(priceHash >> 3) % DISCOUNTS.length];
      fromPrice = Math.round(original * (1 - discountPct / 100) * 10) / 10;
      tiers = TIERS.map((t) => {
        const tierOriginal = Math.round(original * t.mult);
        const tierPrice = Math.round(tierOriginal * (1 - discountPct / 100) * 10) / 10;
        return { label: t.label, price: tierPrice, originalPrice: tierOriginal };
      });
    }

    const trendRoll = (priceHash >> 4) % 3;
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
      tiers,
      viewers: 20 + (priceHash % 400),
      priceTrend: trendRoll === 0 ? "up" : trendRoll === 1 ? "down" : "stable",
    };
  });
}

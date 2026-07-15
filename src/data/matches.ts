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
  sgPricing?: { lowest: number | null; average: number | null; highest: number | null } | null;
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
  currency: "GBP" | "USD";
};

const COLORS = ["#C8102E", "#1E5AA8", "#A50044", "#EE2523", "#5E5CE6", "#16A34A", "#DB7A00"];
const SELLER_NAMES = ["Football Ticket Net", "StadiumSeats", "MatchDay Resale", "GoalLine Tickets"];
const SECTIONS = ["Main Stand", "East Stand", "West Stand", "North End", "Family Zone"];

function hashStr(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (s.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  }
  return Math.abs(hash);
}

function colorFor(name: string) {
  return COLORS[hashStr(name) % COLORS.length];
}

const DISCOUNTS = [10, 15, 18, 22, 25, 28, 32, 35, 40];

const TIERS = [
  { label: "Pitch Side", mult: 1.9 },
  { label: "Lower Tier", mult: 1.3 },
  { label: "Upper Tier", mult: 1 },
];

const MANUAL_LOOKUP = Object.fromEntries(
  Object.entries(MANUAL_PRICES).map(([k, v]) => [k.toLowerCase().trim(), v])
);

const USD_TO_GBP = 0.79;

export function attachPlaceholderPricing(fixtures: Fixture[]): Match[] {
  return fixtures.map((f, i) => {
    const priceHash = hashStr(f.id + f.home + f.away);
    const manual = MANUAL_LOOKUP[`${f.home} vs ${f.away}`.toLowerCase().trim()];

    let original: number;
    let discountPct: number;
    let fromPrice: number;
    let tiers: PriceTier[];
    let currency: "GBP" | "USD" = "GBP";

    if (manual) {
      currency = manual.currency ?? "GBP";
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
    } else if (f.sgPricing && f.sgPricing.lowest && f.sgPricing.highest) {
      const low = Math.round(f.sgPricing.lowest * USD_TO_GBP * 10) / 10;
      const avg =
        Math.round(
          (f.sgPricing.average ?? (f.sgPricing.lowest + f.sgPricing.highest) / 2) * USD_TO_GBP * 10
        ) / 10;
      const high = Math.round(f.sgPricing.highest * USD_TO_GBP * 10) / 10;
      tiers = [
        { label: "Pitch Side", price: high, originalPrice: high },
        { label: "Lower Tier", price: avg, originalPrice: avg },
        { label: "Upper Tier", price: low, originalPrice: low },
      ];
      original = high;
      discountPct = 0;
      fromPrice = low;
    } else {
      original = 45 + (priceHash % 280);
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
      currency,
    };
  });
                      }

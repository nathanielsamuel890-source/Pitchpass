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

export type Listing = {
  id: string;
  label: string;
  section: string;
  row: string;
  ticketCount: string;
  quality: "Amazing" | "Great" | "Good" | "Fair";
  price: number;
  originalPrice: number;
  vendor: string;
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
  listings: Listing[];
  viewers: number;
  priceTrend: "up" | "down" | "stable";
  currency: "GBP" | "USD";
};

const COLORS = ["#C8102E", "#1E5AA8", "#A50044", "#EE2523", "#5E5CE6", "#16A34A", "#DB7A00"];
const SELLER_NAMES = ["Football Ticket Net", "StadiumSeats", "MatchDay Resale", "GoalLine Tickets", "PitchPass Verified", "KickOff Tickets"];
const SECTIONS = ["Main Stand", "East Stand", "West Stand", "North End", "Family Zone"];
const QUALITIES: Listing["quality"][] = ["Amazing", "Amazing", "Great", "Great", "Good"];

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

function generateListings(tiers: PriceTier[], priceHash: number): Listing[] {
  const listings: Listing[] = [];
  let counter = 0;
  tiers.forEach((tier) => {
    const listingsPerTier = 3 + ((priceHash >> (counter + 2)) % 2);
    for (let j = 0; j < listingsPerTier; j++) {
      const variance = ((priceHash >> (counter + 5)) % 20) - 5;
      const price = Math.round(tier.price * (1 + variance / 100) * 10) / 10;
      const originalPrice = Math.round(tier.originalPrice * (1 + variance / 100) * 10) / 10;
      const sectionNum = 100 + ((priceHash >> (counter + 1)) % 400);
      const rowNum = 1 + ((priceHash >> (counter + 3)) % 20);
      const ticketCount = 1 + ((priceHash >> (counter + 4)) % 6);
      const vendor = SELLER_NAMES[(priceHash + counter) % SELLER_NAMES.length];
      const quality = QUALITIES[(priceHash >> (counter + 2)) % QUALITIES.length];
      const section = `Section ${sectionNum}`;
      const row = `Row ${rowNum}`;
      listings.push({
        id: `${tier.label}-${counter}`,
        label: `${section} - ${row}`,
        section,
        row,
        ticketCount: ticketCount === 1 ? "1 Ticket" : `1-${ticketCount} Tickets`,
        quality,
        price,
        originalPrice,
        vendor,
      });
      counter++;
    }

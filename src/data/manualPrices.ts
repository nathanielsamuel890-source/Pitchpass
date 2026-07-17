// MANUAL TICKET PRICES
// ---------------------
// Add a real price here for any match and it OVERRIDES the automatic
// placeholder pricing for that match. Any match not listed here keeps
// showing placeholder numbers as normal.
//
// HOW TO ADD A PRICE:
// 1. Key must be "Home vs Away" — copy the team names exactly as they
//    appear on the site (capitalization doesn't matter).
// 2. pitchSide / lowerTier / upperTier are the real prices in GBP,
//    per ticket, for each seating tier.
// 3. discountPct is OPTIONAL — only add it if you want to show a
//    "was £X" strikethrough price. Leave it out for a plain real price.
//
// EXAMPLE (copy this pattern, remove the // to activate a line):
//
// export const MANUAL_PRICES: Record<string, ManualPrice> = {
//   "arsenal vs chelsea": { pitchSide: 320, lowerTier: 180, upperTier: 95 },
//   "man united vs liverpool": {
//     pitchSide: 410,
//     lowerTier: 240,
//     upperTier: 130,
//     discountPct: 15, // shows a strikethrough "was" price above this one
//   },
// };

export type ManualPrice = {
  pitchSide: number;
  lowerTier: number;
  upperTier: number;
  discountPct?: number;
  currency?: "GBP" | "USD";
};

export const MANUAL_PRICES: Record<string, ManualPrice> = {
  "arsenal vs chelsea": { pitchSide: 120, lowerTier: 90, upperTier: 52 },
  "england vs argentina": {pitchSide: 11000, lowerTier: 5400, upperTier: 2600, discountPct: 30, currency: "USD"},
"argentina vs spain": { pitchSide: 6080, lowerTier: 4160, upperTier: 3200, currency: "USD", discountPct: 30 },};

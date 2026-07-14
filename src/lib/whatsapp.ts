import { Match, PriceTier } from "../data/matches";

// The number tickets orders are sent to. Digits only, no "+", spaces, or
// dashes (wa.me requires this format) — include the country code.
const WHATSAPP_NUMBER = "13434839896";

export function buildOrderMessage(m: Match, quantity: string, tier: PriceTier) {
  return (
    `Hi! I'd like to buy ${quantity} ticket${quantity === "1" ? "" : "s"} for ${m.home} vs ${m.away} (${m.date}). ` +
    `Seller: ${m.seller}, Tier: ${tier.label}, Section: ${m.section}, ` +
    `Price: £${tier.price.toFixed(2)} each (${m.discountPct}% off).`
  );
}

export function whatsappOrderUrl(m: Match, quantity: string, tier: PriceTier) {
  const text = encodeURIComponent(buildOrderMessage(m, quantity, tier));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

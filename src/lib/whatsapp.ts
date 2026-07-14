import { Match } from "../data/matches";

// The number tickets orders are sent to. Digits only, no "+", spaces, or
// dashes (wa.me requires this format) — include the country code.
const WHATSAPP_NUMBER = "13434839896";

export function buildOrderMessage(m: Match) {
  return (
    `Hi! I'd like to buy a ticket for ${m.home} vs ${m.away} (${m.date}). ` +
    `Seller: ${m.seller}, Section: ${m.section}, ` +
    `Price: £${m.fromPrice.toFixed(2)} (${m.discountPct}% off).`
  );
}

export function whatsappOrderUrl(m: Match) {
  const text = encodeURIComponent(buildOrderMessage(m));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

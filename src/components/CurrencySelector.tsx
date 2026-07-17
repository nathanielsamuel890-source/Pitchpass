import { useCurrency } from "../context/CurrencyContext";

const SUPPORTED_CURRENCIES = [
  "USD", "GBP", "EUR", "JPY", "CAD", "CNY", "MXN", "KRW",
  "TRY", "BRL", "TWD", "AUD", "CZK", "DKK", "PLN", "SEK",
  "AED", "INR", "MYR", "NOK", "ILS", "SAR", "ARS",
];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="bg-transparent border rounded px-2 py-1 text-sm"
    >
      {SUPPORTED_CURRENCIES.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
}

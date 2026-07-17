import { useCurrency } from "../context/CurrencyContext";

type PriceProps = {
  amount: number;
  from?: "GBP" | "USD";
  className?: string;
};

export default function Price({ amount, from = "GBP", className }: PriceProps) {
  const { currency, rates, loadingRates } = useCurrency();

  if (loadingRates || !rates) {
    const symbol = from === "USD" ? "$" : "£";
    return <span className={className}>{symbol}{amount.toFixed(2)}</span>;
  }

  const inGBP = from === "GBP" ? amount : amount / (rates["USD"] || 1);
  const converted = currency === "GBP" ? inGBP : inGBP * (rates[currency] || 1);

  const symbols: Record<string, string> = {
    USD: "$", GBP: "£", EUR: "€", JPY: "¥", CNY: "¥", INR: "₹",
  };
  const symbol = symbols[currency] || `${currency} `;

  return (
    <span className={className}>
      {symbol}{converted.toFixed(2)}
    </span>
  );
}

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type CurrencyContextType = {
  currency: string;
  setCurrency: (c: string) => void;
  rates: Record<string, number> | null;
  loadingRates: boolean;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "GBP",
  setCurrency: () => {},
  rates: null,
  loadingRates: true,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("GBP");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("pitchpass_currency");
    if (saved) setCurrency(saved);
  }, []);

  useEffect(() => {
    setLoadingRates(true);
    fetch("/api/exchange-rates?base=GBP")
      .then((res) => res.json())
      .then((data) => {
        if (data.rates) setRates(data.rates);
      })
      .catch(() => setRates(null))
      .finally(() => setLoadingRates(false));
  }, []);

  const updateCurrency = (c: string) => {
    setCurrency(c);
    localStorage.setItem("pitchpass_currency", c);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency, rates, loadingRates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);

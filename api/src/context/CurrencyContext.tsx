import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type CurrencyContextType = {
  currency: string;
  setCurrency: (c: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "GBP",
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("GBP");

  useEffect(() => {
    const saved = localStorage.getItem("pitchpass_currency");
    if (saved) setCurrency(saved);
  }, []);

  const updateCurrency = (c: string) => {
    setCurrency(c);
    localStorage.setItem("pitchpass_currency", c);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);

// api/exchange-rates.ts
export default async function handler(req: any, res: any) {
  const base = req.query.base || "GBP";
  const apiKey = process.env.EXCHANGE_API_KEY;

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`
    );
    const data = await response.json();

    if (data.result !== "success") {
      return res.status(500).json({ error: "Failed to fetch rates" });
    }

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json({ rates: data.conversion_rates });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export default function HowItWorksPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-ink mb-2">How Pitchpass Works</h1>
      <p className="text-muted mb-10">
        Here's exactly how it works, from browsing to matchday.
      </p>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">1. Browse real fixtures</h2>
          <p className="text-muted text-sm">
            We track upcoming football matches across major leagues and cups, so you always see what's coming up.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">2. Compare seating tiers</h2>
          <p className="text-muted text-sm">
            Every match shows Pitch Side, Lower Tier, and Upper Tier pricing, so you can pick what fits your budget and view.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">3. Choose your currency</h2>
          <p className="text-muted text-sm">
            Prices convert automatically to USD, GBP, EUR, and more, so you always know what you're actually paying.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">4. Reserve your tickets</h2>
          <p className="text-muted text-sm">
            Select your quantity and you'll be connected directly with our seller via WhatsApp to confirm availability and complete your purchase securely.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">5. Get your tickets</h2>
          <p className="text-muted text-sm">
            Once your order is confirmed, your tickets are sent directly to you ahead of matchday.
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-lg font-semibold text-ink mb-3">Why fans trust Pitchpass</h2>
        <ul className="text-sm text-muted space-y-2">
          <li>• Transparent pricing — no hidden fees added at checkout</li>
          <li>• Direct communication with a real person, not a faceless bot</li>
          <li>• Verified sellers only</li>
        </ul>
      </div>

      <div className="mt-10 text-sm text-muted">
        Got questions before you buy? Reach out anytime — we're happy to help before you commit.
      </div>
    </main>
  );
}

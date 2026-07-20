import { MessageCircle, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";
import { whatsappSupportUrl } from "../lib/whatsapp";

const SUPPORT_EMAIL = "pitchpass1@gmail.com";

const FAQS = [
  {
    q: "How do I actually buy a ticket?",
    a: "Pick a match, choose your seating tier and quantity, and you'll be connected directly with our seller via WhatsApp to confirm availability and complete your purchase.",
  },
  {
    q: "Are the sellers verified?",
    a: "Yes — every match on PitchPass only shows verified sellers so you can compare with confidence before you commit.",
  },
  {
    q: "How will I receive my tickets?",
    a: "Once your order is confirmed over WhatsApp, your tickets are sent directly to you ahead of matchday.",
  },
  {
    q: "What if I don't hear back on WhatsApp?",
    a: "Message us again, or reach out by email below — we'll get back to you as soon as we can.",
  },
  {
    q: "Can I get a refund if my match is cancelled or postponed?",
    a: "Reach out to us directly on WhatsApp or by email as soon as you know, and we'll talk through your options for that specific order.",
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-ink mb-2">Support</h1>
      <p className="text-muted mb-10">
        Got a question before or after you buy? Here's how to reach us.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <a
          href={whatsappSupportUrl()}
          className="flex items-center gap-3 rounded-xl border border-border bg-panel p-5 hover:border-brand hover:shadow-md transition-all"
        >
          <span className="flex items-center justify-center h-11 w-11 rounded-full bg-blue-50 text-brand shrink-0">
            <MessageCircle size={20} />
          </span>
          <span>
            <span className="block font-semibold text-ink">Message us on WhatsApp</span>
            <span className="block text-sm text-muted">Usually the fastest way to reach us</span>
          </span>
        </a>

        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex items-center gap-3 rounded-xl border border-border bg-panel p-5 hover:border-brand hover:shadow-md transition-all"
        >
          <span className="flex items-center justify-center h-11 w-11 rounded-full bg-blue-50 text-brand shrink-0">
            <Mail size={20} />
          </span>
          <span>
            <span className="block font-semibold text-ink">Email us</span>
            <span className="block text-sm text-muted">{SUPPORT_EMAIL}</span>
          </span>
        </a>
      </div>

      <h2 className="text-lg font-semibold text-ink mb-4">Frequently asked questions</h2>
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
        {FAQS.map((item, i) => (
          <div key={item.q} className="bg-panel">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-ink">{item.q}</span>
              <ChevronDown
                size={18}
                className={`text-muted shrink-0 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <p className="px-5 pb-4 text-sm text-muted">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

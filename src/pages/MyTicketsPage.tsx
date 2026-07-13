import { useUser } from "@clerk/clerk-react";
import { Ticket } from "lucide-react";
import { getBookings } from "../lib/bookings";

export default function MyTicketsPage() {
  const { user } = useUser();
  const bookings = user ? getBookings(user.id) : [];

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-1 text-ink">My Tickets</h1>
      <p className="text-muted mb-6 text-sm">
        Signed in as {user?.primaryEmailAddress?.emailAddress ?? user?.username}
      </p>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-border bg-panel p-8 text-center">
          <Ticket size={28} className="mx-auto mb-3 text-border" />
          <p className="text-muted text-sm">No tickets yet. Book a fixture and it'll show up here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-border bg-panel p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-ink">
                  {b.match.home} vs {b.match.away}
                </p>
                <p className="text-xs text-muted mt-1">
                  {b.match.date} · {b.match.time} · Seats {b.seats.join(", ")}
                </p>
              </div>
              <span className="text-brand font-bold">£{b.total}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

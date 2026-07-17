import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Ticket } from "lucide-react";
import CurrencySelector from "./CurrencySelector";
export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-panel">
      <Link to="/fixtures" className="flex items-center gap-2">
        <Ticket size={20} className="text-brand" />
        <span className="text-xl font-bold tracking-tight text-ink">PitchPass</span>
      </Link>

      <div className="flex items-center gap-5 text-sm">
        <Link to="/fixtures" className="text-muted hover:text-ink transition-colors">
          All Matches
        </Link>

        <SignedIn>
          <Link to="/my-tickets" className="text-muted hover:text-ink transition-colors">
            My Tickets
          </Link>
          <UserButton afterSignOutUrl="/fixtures" />
        </SignedIn>

        <SignedOut>
          <Link
            to="/sign-in"
            className="rounded-full border border-border px-4 py-1.5 font-medium text-ink hover:bg-page transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/sign-up"
            className="rounded-full bg-brand px-4 py-1.5 font-medium text-white hover:brightness-110 transition-all"
          >
            Sign Up
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}

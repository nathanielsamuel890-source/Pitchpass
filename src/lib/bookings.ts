import { Match } from "../data/matches";

export type Booking = {
  id: string;
  match: Match;
  seats: string[];
  total: number;
  bookedAt: string;
};

/**
 * NOTE: This uses localStorage as a placeholder so the app works
 * end-to-end today. localStorage is per-browser, not per-account —
 * it won't sync across devices and isn't suitable for real ticket
 * sales (a seat could be "sold" twice with no server checking).
 *
 * Before taking real payments, replace these two functions with
 * calls to a real backend (e.g. a database + API route) that:
 *   1. checks a seat isn't already booked before confirming
 *   2. is the single source of truth for what's been sold
 */

function key(userId: string) {
  return `bookings:${userId}`;
}

export function getBookings(userId: string): Booking[] {
  try {
    const raw = localStorage.getItem(key(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBooking(userId: string, booking: Booking) {
  const existing = getBookings(userId);
  localStorage.setItem(key(userId), JSON.stringify([booking, ...existing]));
}

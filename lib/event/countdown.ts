/**
 * Event countdown helpers for the Homepage hero.
 *
 * The event start time is configured via the `NEXT_PUBLIC_EVENT_DATETIME`
 * environment variable (ISO-8601). When it is missing or invalid we fall back
 * to a fixed future date so the countdown never renders blank or crashes.
 */

/** Fallback used when the env var is unset or not a valid ISO-8601 datetime. */
export const FALLBACK_EVENT_DATETIME = "2026-12-31T18:30:00+07:00";

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  /** True once the target time has been reached or passed. */
  ended: boolean;
}

/**
 * Returns a valid ISO-8601 datetime string: the provided value when parseable,
 * otherwise {@link FALLBACK_EVENT_DATETIME}.
 */
export function resolveEventDatetime(raw?: string | null): string {
  if (raw && !Number.isNaN(Date.parse(raw))) {
    return raw;
  }
  return FALLBACK_EVENT_DATETIME;
}

/**
 * Computes the time remaining between `now` and `target`, broken into whole
 * days / hours / minutes. Clamped at zero once the target is reached.
 */
export function getRemaining(target: Date, now: Date = new Date()): Remaining {
  const diffMs = target.getTime() - now.getTime();

  if (Number.isNaN(diffMs) || diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, ended: true };
  }

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes, ended: false };
}

/** Pads a number to a 2-digit, zero-padded string (e.g. 5 → "05"). */
export function padded(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0");
}

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

export interface FormattedEvent {
  /** e.g. "16/06/2026" */
  date: string;
  /** e.g. "10h00" */
  time: string;
}

/**
 * Formats an ISO-8601 event datetime for display, so the on-screen date/time
 * stays in sync with the countdown (single source of truth = the env var).
 * Formatting is pinned to a fixed time zone to avoid server/client mismatch.
 */
export function formatEventDateTime(
  iso: string,
  timeZone = "Asia/Ho_Chi_Minh",
): FormattedEvent {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { date: "", time: "" };
  }
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    date: `${get("day")}/${get("month")}/${get("year")}`,
    time: `${get("hour")}h${get("minute")}`,
  };
}

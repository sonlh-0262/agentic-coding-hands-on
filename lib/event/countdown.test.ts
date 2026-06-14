/**
 * Unit tests for countdown.ts
 * Tests the event datetime resolution, remaining time calculation, and padding helpers.
 * Run with: node --experimental-strip-types --test lib/event/countdown.test.ts
 */

import { test } from "node:test";
import assert from "node:assert";
import {
  resolveEventDatetime,
  getRemaining,
  padded,
  formatEventDateTime,
  FALLBACK_EVENT_DATETIME,
} from "./countdown.ts";

test("formatEventDateTime", async (t) => {
  await t.test("formats an ISO datetime in the +07:00 zone", () => {
    const { date, time } = formatEventDateTime("2026-06-16T10:00:00+07:00");
    assert.strictEqual(date, "16/06/2026");
    assert.strictEqual(time, "10h00");
  });

  await t.test("converts a UTC instant into the pinned zone", () => {
    // 03:00Z == 10:00 in Asia/Ho_Chi_Minh (+07:00)
    const { date, time } = formatEventDateTime("2026-06-16T03:00:00Z");
    assert.strictEqual(date, "16/06/2026");
    assert.strictEqual(time, "10h00");
  });

  await t.test("returns empty strings for an invalid datetime", () => {
    assert.deepStrictEqual(formatEventDateTime("not-a-date"), {
      date: "",
      time: "",
    });
  });
});

test("resolveEventDatetime", async (t) => {
  await t.test(
    "returns input when valid ISO-8601 datetime string",
    () => {
      const validISO = "2026-12-31T23:59:59Z";
      const result = resolveEventDatetime(validISO);
      assert.strictEqual(result, validISO);
    }
  );

  await t.test(
    "returns input with timezone offset when valid ISO-8601",
    () => {
      const validISO = "2026-12-31T18:30:00+07:00";
      const result = resolveEventDatetime(validISO);
      assert.strictEqual(result, validISO);
    }
  );

  await t.test("returns fallback when input is undefined", () => {
    const result = resolveEventDatetime(undefined);
    assert.strictEqual(result, FALLBACK_EVENT_DATETIME);
  });

  await t.test("returns fallback when input is null", () => {
    const result = resolveEventDatetime(null);
    assert.strictEqual(result, FALLBACK_EVENT_DATETIME);
  });

  await t.test("returns fallback when input is invalid datetime string", () => {
    const invalidInputs = [
      "not-a-date",
      "2026-13-45",
      "invalid",
      "31-12-2026",
      "gibberish",
      "abc123",
    ];

    invalidInputs.forEach((invalid) => {
      const result = resolveEventDatetime(invalid);
      assert.strictEqual(
        result,
        FALLBACK_EVENT_DATETIME,
        `Expected fallback for input: "${invalid}"`
      );
    });
  });

  await t.test("returns fallback for empty string", () => {
    const result = resolveEventDatetime("");
    assert.strictEqual(result, FALLBACK_EVENT_DATETIME);
  });

  await t.test(
    "returns fallback for string with only whitespace",
    () => {
      const result = resolveEventDatetime("   ");
      assert.strictEqual(result, FALLBACK_EVENT_DATETIME);
    }
  );
});

test("getRemaining", async (t) => {
  await t.test("returns correct time remaining for future target", () => {
    // Target: 2 days, 3 hours, 15 minutes in the future
    const now = new Date("2026-06-14T10:00:00Z");
    const target = new Date("2026-06-16T13:15:00Z");

    const result = getRemaining(target, now);

    assert.strictEqual(result.days, 2);
    assert.strictEqual(result.hours, 3);
    assert.strictEqual(result.minutes, 15);
    assert.strictEqual(result.ended, false);
  });

  await t.test("returns zeros and ended=true when target time equals now", () => {
    const now = new Date("2026-06-14T10:00:00Z");
    const target = new Date("2026-06-14T10:00:00Z");

    const result = getRemaining(target, now);

    assert.strictEqual(result.days, 0);
    assert.strictEqual(result.hours, 0);
    assert.strictEqual(result.minutes, 0);
    assert.strictEqual(result.ended, true);
  });

  await t.test("returns zeros and ended=true when target time is in the past", () => {
    const now = new Date("2026-06-14T10:00:00Z");
    const target = new Date("2026-06-13T10:00:00Z");

    const result = getRemaining(target, now);

    assert.strictEqual(result.days, 0);
    assert.strictEqual(result.hours, 0);
    assert.strictEqual(result.minutes, 0);
    assert.strictEqual(result.ended, true);
  });

  await t.test("uses current time by default when now is not provided", () => {
    // Create target 1 hour in the future
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);

    const result = getRemaining(futureDate);

    assert.strictEqual(result.ended, false);
    assert(result.hours >= 0 && result.hours <= 1);
  });

  await t.test("handles very large time differences correctly", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const target = new Date("2027-12-31T23:59:59Z");

    const result = getRemaining(target, now);

    // ~730 days difference
    assert(result.days > 700);
    assert.strictEqual(result.ended, false);
  });

  await t.test("calculates hours correctly within a day", () => {
    const now = new Date("2026-06-14T10:00:00Z");
    const target = new Date("2026-06-14T18:45:30Z"); // 8 hours 45 minutes

    const result = getRemaining(target, now);

    assert.strictEqual(result.days, 0);
    assert.strictEqual(result.hours, 8);
    assert.strictEqual(result.minutes, 45);
    assert.strictEqual(result.ended, false);
  });

  await t.test("calculates minutes correctly within an hour", () => {
    const now = new Date("2026-06-14T10:00:00Z");
    const target = new Date("2026-06-14T10:30:45Z"); // 30 minutes 45 seconds

    const result = getRemaining(target, now);

    assert.strictEqual(result.days, 0);
    assert.strictEqual(result.hours, 0);
    assert.strictEqual(result.minutes, 30);
    assert.strictEqual(result.ended, false);
  });

  await t.test("floors minutes calculation (truncates seconds)", () => {
    const now = new Date("2026-06-14T10:00:00Z");
    const target = new Date("2026-06-14T10:00:59Z"); // 59 seconds (0 full minutes)

    const result = getRemaining(target, now);

    assert.strictEqual(result.minutes, 0);
    assert.strictEqual(result.ended, false);
  });

  await t.test("handles Invalid Date with NaN diff gracefully", () => {
    const invalidDate = new Date("invalid");
    const validDate = new Date("2026-06-14T10:00:00Z");

    const result = getRemaining(invalidDate, validDate);

    assert.strictEqual(result.days, 0);
    assert.strictEqual(result.hours, 0);
    assert.strictEqual(result.minutes, 0);
    assert.strictEqual(result.ended, true);
  });

  await t.test("handles both dates as Invalid Date", () => {
    const invalidNow = new Date("invalid");
    const invalidTarget = new Date("also-invalid");

    const result = getRemaining(invalidTarget, invalidNow);

    assert.strictEqual(result.days, 0);
    assert.strictEqual(result.hours, 0);
    assert.strictEqual(result.minutes, 0);
    assert.strictEqual(result.ended, true);
  });
});

test("padded", async (t) => {
  await t.test("returns 2-digit zero-padded string for single digit", () => {
    assert.strictEqual(padded(0), "00");
    assert.strictEqual(padded(1), "01");
    assert.strictEqual(padded(5), "05");
    assert.strictEqual(padded(9), "09");
  });

  await t.test("returns string unchanged for 2-digit numbers", () => {
    assert.strictEqual(padded(10), "10");
    assert.strictEqual(padded(15), "15");
    assert.strictEqual(padded(23), "23");
    assert.strictEqual(padded(99), "99");
  });

  await t.test("returns string unchanged for numbers > 99", () => {
    assert.strictEqual(padded(100), "100");
    assert.strictEqual(padded(999), "999");
    assert.strictEqual(padded(1000), "1000");
  });

  await t.test("clamps negative numbers to '00'", () => {
    assert.strictEqual(padded(-1), "00");
    assert.strictEqual(padded(-5), "00");
    assert.strictEqual(padded(-100), "00");
  });

  await t.test("handles zero correctly", () => {
    assert.strictEqual(padded(0), "00");
  });

  await t.test("handles floating point by coercing to string", () => {
    // Math.max(0, 5.7) = 5.7, then String() = "5.7", then padStart(2, "0") = "5.7"
    assert.strictEqual(padded(5.7), "5.7");
  });
});

test("integration: env var format (ID-56, ID-57)", async (t) => {
  await t.test(
    "environment variable NEXT_PUBLIC_EVENT_DATETIME accepts ISO-8601 format",
    () => {
      const envValue = "2026-12-31T18:30:00+07:00";
      const resolved = resolveEventDatetime(envValue);
      assert.strictEqual(resolved, envValue);

      const target = new Date(resolved);
      const now = new Date("2026-06-14T10:00:00Z");
      const remaining = getRemaining(target, now);

      assert.strictEqual(remaining.ended, false);
      assert(remaining.days > 0);
    }
  );
});

test("integration: invalid datetime fallback (ID-60)", async (t) => {
  await t.test(
    "returns fallback and does not crash for invalid datetime",
    () => {
      const invalidDatetime = "not-a-valid-datetime";
      const resolved = resolveEventDatetime(invalidDatetime);

      assert.strictEqual(resolved, FALLBACK_EVENT_DATETIME);

      // Should not crash when using fallback
      const target = new Date(resolved);
      const now = new Date();
      const remaining = getRemaining(target, now);

      // Since fallback is a future date, countdown should be active
      assert.strictEqual(remaining.ended, false);
    }
  );
});

test("integration: padding for display (ID-40, ID-41)", async (t) => {
  await t.test(
    "padding ensures 2-digit display format for single-digit times",
    () => {
      const now = new Date("2026-06-14T10:00:00Z");
      const target = new Date("2026-06-16T09:05:03Z"); // 1 day, 23 hours, 5 minutes

      const remaining = getRemaining(target, now);

      // Verify we can format these for display
      assert.strictEqual(padded(remaining.days), "01");
      assert.strictEqual(padded(remaining.hours), "23");
      assert.strictEqual(padded(remaining.minutes), "05");
    }
  );

  await t.test(
    "padding ensures zero state is displayed as '00'",
    () => {
      const now = new Date("2026-06-14T10:00:00Z");
      const target = new Date("2026-06-13T10:00:00Z"); // Past

      const remaining = getRemaining(target, now);

      // All should be zero when event has ended
      assert.strictEqual(padded(remaining.days), "00");
      assert.strictEqual(padded(remaining.hours), "00");
      assert.strictEqual(padded(remaining.minutes), "00");
    }
  );
});

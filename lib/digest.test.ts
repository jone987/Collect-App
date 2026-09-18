import { describe, expect, it } from "vitest";
import {
  computeDigestsForAllUsers,
  computeUserDigestStats,
  groupFollowUpsByUser,
  type DigestFollowUpRow,
} from "./digest";

const TODAY = "2026-09-18";

describe("groupFollowUpsByUser", () => {
  it("groups rows by user_id, preserving each user's rows", () => {
    const rows: DigestFollowUpRow[] = [
      { user_id: "u1", customer_id: "c1", due_date: TODAY },
      { user_id: "u2", customer_id: "c2", due_date: TODAY },
      { user_id: "u1", customer_id: "c3", due_date: "2026-09-10" },
    ];

    const grouped = groupFollowUpsByUser(rows);

    expect(grouped.size).toBe(2);
    expect(grouped.get("u1")).toHaveLength(2);
    expect(grouped.get("u2")).toHaveLength(1);
  });

  it("returns an empty map for no rows", () => {
    expect(groupFollowUpsByUser([]).size).toBe(0);
  });
});

describe("computeUserDigestStats", () => {
  it("splits rows into due-today vs. overdue by exact date comparison", () => {
    const rows: DigestFollowUpRow[] = [
      { user_id: "u1", customer_id: "c1", due_date: TODAY },
      { user_id: "u1", customer_id: "c2", due_date: "2026-09-17" }, // 1 day overdue
      { user_id: "u1", customer_id: "c3", due_date: "2026-09-04" }, // 14 days overdue
    ];

    const stats = computeUserDigestStats("u1", rows, TODAY, new Map());

    expect(stats.dueTodayCount).toBe(1);
    expect(stats.overdueCount).toBe(2);
  });

  it("sums each distinct customer's amount owed exactly once, even with multiple follow-ups", () => {
    const rows: DigestFollowUpRow[] = [
      { user_id: "u1", customer_id: "c1", due_date: TODAY },
      { user_id: "u1", customer_id: "c1", due_date: "2026-09-10" }, // same customer, 2nd follow-up
      { user_id: "u1", customer_id: "c2", due_date: TODAY },
    ];
    const amounts = new Map([
      ["c1", 500],
      ["c2", 300],
    ]);

    const stats = computeUserDigestStats("u1", rows, TODAY, amounts);

    // Not 500 + 500 + 300 = 1300 — c1 only counts once.
    expect(stats.totalOutstanding).toBe(800);
  });

  it("treats a customer missing from the amount map as $0, not a crash", () => {
    const rows: DigestFollowUpRow[] = [
      { user_id: "u1", customer_id: "unknown-customer", due_date: TODAY },
    ];

    const stats = computeUserDigestStats("u1", rows, TODAY, new Map());

    expect(stats.totalOutstanding).toBe(0);
  });
});

describe("computeDigestsForAllUsers", () => {
  it("returns one entry per user present in the input, correctly isolated", () => {
    const rows: DigestFollowUpRow[] = [
      { user_id: "u1", customer_id: "c1", due_date: TODAY },
      { user_id: "u2", customer_id: "c2", due_date: "2026-09-01" },
    ];
    const amounts = new Map([
      ["c1", 100],
      ["c2", 900],
    ]);

    const digests = computeDigestsForAllUsers(rows, TODAY, amounts);

    expect(digests).toHaveLength(2);
    const byUser = new Map(digests.map((d) => [d.userId, d]));
    expect(byUser.get("u1")).toMatchObject({
      dueTodayCount: 1,
      overdueCount: 0,
      totalOutstanding: 100,
    });
    expect(byUser.get("u2")).toMatchObject({
      dueTodayCount: 0,
      overdueCount: 1,
      totalOutstanding: 900,
    });
  });

  it("a user with no qualifying rows never appears — this is how 'don't email people with nothing due' is enforced", () => {
    // No row for u3 at all, simulating the caller's query already having
    // filtered to due_date <= today.
    const rows: DigestFollowUpRow[] = [{ user_id: "u1", customer_id: "c1", due_date: TODAY }];

    const digests = computeDigestsForAllUsers(rows, TODAY, new Map());

    expect(digests.map((d) => d.userId)).toEqual(["u1"]);
  });

  it("returns an empty list when nobody has anything due or overdue", () => {
    expect(computeDigestsForAllUsers([], TODAY, new Map())).toEqual([]);
  });
});

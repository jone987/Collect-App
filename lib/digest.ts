/** Pure computation for the daily digest — no Supabase, no I/O, so it's
 * cheap to unit-test exhaustively. The caller is responsible for fetching
 * only pending follow-ups with `due_date <= today` in the first place;
 * a user who has none simply never appears in `rows`, which is what makes
 * "don't email people with nothing due" fall out naturally rather than
 * needing its own branch. */

export interface DigestFollowUpRow {
  user_id: string;
  customer_id: string;
  due_date: string;
}

export interface UserDigestStats {
  userId: string;
  dueTodayCount: number;
  overdueCount: number;
  totalOutstanding: number;
}

export function groupFollowUpsByUser(
  rows: DigestFollowUpRow[]
): Map<string, DigestFollowUpRow[]> {
  const byUser = new Map<string, DigestFollowUpRow[]>();
  for (const row of rows) {
    const existing = byUser.get(row.user_id);
    if (existing) existing.push(row);
    else byUser.set(row.user_id, [row]);
  }
  return byUser;
}

export function computeUserDigestStats(
  userId: string,
  rows: DigestFollowUpRow[],
  today: string,
  amountByCustomerId: Map<string, number>
): UserDigestStats {
  let dueTodayCount = 0;
  let overdueCount = 0;
  const customerIds = new Set<string>();

  for (const row of rows) {
    customerIds.add(row.customer_id);
    if (row.due_date === today) dueTodayCount++;
    else if (row.due_date < today) overdueCount++;
    // due_date > today can't happen given the caller's query, but isn't
    // counted as either bucket if it somehow did.
  }

  let totalOutstanding = 0;
  for (const customerId of customerIds) {
    totalOutstanding += amountByCustomerId.get(customerId) ?? 0;
  }

  return { userId, dueTodayCount, overdueCount, totalOutstanding };
}

/** One entry per user who has at least one pending follow-up due today or
 * overdue. `amountByCustomerId` sums each distinct customer's amount owed
 * once, even if they have multiple due/overdue follow-ups. */
export function computeDigestsForAllUsers(
  rows: DigestFollowUpRow[],
  today: string,
  amountByCustomerId: Map<string, number>
): UserDigestStats[] {
  const byUser = groupFollowUpsByUser(rows);
  return Array.from(byUser.entries()).map(([userId, userRows]) =>
    computeUserDigestStats(userId, userRows, today, amountByCustomerId)
  );
}

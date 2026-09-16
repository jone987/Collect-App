import { getCustomerStats } from "@/lib/data/customers";
import { getFollowUps, getFollowUpStats } from "@/lib/data/follow-ups";

export async function getDashboardData() {
  const [customerStats, followUpStats, overdueFollowUps, dueTodayFollowUps] =
    await Promise.all([
      getCustomerStats(),
      getFollowUpStats(),
      getFollowUps("overdue"),
      getFollowUps("due-today"),
    ]);

  return {
    customerStats,
    followUpStats,
    // Overdue first, then due today, capped so the dashboard stays scannable.
    attentionFollowUps: [...overdueFollowUps, ...dueTodayFollowUps].slice(
      0,
      8
    ),
  };
}

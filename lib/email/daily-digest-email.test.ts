import { describe, expect, it } from "vitest";
import { buildDigestEmail, digestSubject, digestSummarySentence } from "./daily-digest-email";

const dashboardUrl = "https://example.com/dashboard";

describe("digestSummarySentence — clause dropping", () => {
  it("mentions both due-today and overdue when both are present", () => {
    const sentence = digestSummarySentence({
      dueTodayCount: 2,
      overdueCount: 3,
      totalOutstanding: 1200,
      dashboardUrl,
    });
    expect(sentence).toBe(
      "2 follow-ups due today and 3 overdue — $1,200.00 outstanding across all of them."
    );
  });

  it("drops the overdue clause entirely when there's none, not '0 overdue'", () => {
    const sentence = digestSummarySentence({
      dueTodayCount: 4,
      overdueCount: 0,
      totalOutstanding: 500,
      dashboardUrl,
    });
    expect(sentence).not.toMatch(/0 overdue/);
    expect(sentence).toBe("4 follow-ups due today — $500.00 outstanding across all of them.");
  });

  it("drops the due-today clause entirely when there's none, not '0 due today'", () => {
    const sentence = digestSummarySentence({
      dueTodayCount: 0,
      overdueCount: 5,
      totalOutstanding: 750,
      dashboardUrl,
    });
    expect(sentence).not.toMatch(/0 follow-ups due today/);
    expect(sentence).toBe("5 follow-ups overdue — $750.00 outstanding across all of them.");
  });

  it("uses singular phrasing for exactly 1", () => {
    const sentence = digestSummarySentence({
      dueTodayCount: 1,
      overdueCount: 1,
      totalOutstanding: 100,
      dashboardUrl,
    });
    expect(sentence).toContain("1 follow-up due today");
    expect(sentence).not.toContain("1 follow-ups due today");
  });
});

describe("digestSubject", () => {
  it("matches the requested style: 'X due today, Y overdue — $Z outstanding'", () => {
    expect(
      digestSubject({ dueTodayCount: 3, overdueCount: 2, totalOutstanding: 1500, dashboardUrl })
    ).toBe("3 due today, 2 overdue — $1,500.00 outstanding");
  });

  it("omits the zero side", () => {
    expect(
      digestSubject({ dueTodayCount: 3, overdueCount: 0, totalOutstanding: 300, dashboardUrl })
    ).toBe("3 due today — $300.00 outstanding");
  });
});

describe("buildDigestEmail", () => {
  it("includes the dashboard link and formatted amount in both text and html", () => {
    const email = buildDigestEmail({
      dueTodayCount: 2,
      overdueCount: 1,
      totalOutstanding: 999,
      dashboardUrl,
    });

    expect(email.text).toContain(dashboardUrl);
    expect(email.html).toContain(dashboardUrl);
    expect(email.text).toContain("$999.00");
    expect(email.html).toContain("$999.00");
    expect(email.subject).toBe("2 due today, 1 overdue — $999.00 outstanding");
  });
});

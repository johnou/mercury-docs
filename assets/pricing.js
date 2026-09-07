'use strict';

const monthlyTiers = [
  { limit: 100, rate: 1 },
  { limit: 250, rate: 0.9 },
  { limit: 1000, rate: 0.75 },
  { limit: 2500, rate: 0.6 },
  { limit: 5000, rate: 0.5 },
  { limit: 7500, rate: 0.45 },
  { limit: 10000, rate: 0.4 },
  { limit: 25000, rate: 0.3 },
  { limit: 50000, rate: 0.25 },
  { limit: 100000, rate: 0.2 }
];

function calculateMonthlyPrice(users) {
  if (!Number.isInteger(users) || users < 1 || users > 100000) {
    throw new RangeError('Billable Jira users must be an integer from 1 to 100,000.');
  }
  if (users <= 10) return { total: 10, lines: [{ users, rate: null, amount: 10 }] };

  let total = 0;
  let previousLimit = 0;
  const lines = [];
  for (const tier of monthlyTiers) {
    const count = Math.max(0, Math.min(users, tier.limit) - previousLimit);
    if (count) {
      const amount = count * tier.rate;
      total += amount;
      lines.push({ users: count, rate: tier.rate, amount });
    }
    if (users <= tier.limit) break;
    previousLimit = tier.limit;
  }
  return { total, lines };
}

globalThis.MERCURY_PRICING = { calculateMonthlyPrice };

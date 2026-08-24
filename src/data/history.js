// Simulated purchase history: item, days since last purchase, and average
// repurchase cycle (in days). A real system would derive this from order
// history in a database; here it's seeded so the recommendation engine has
// something realistic to reason about.

export const PURCHASE_HISTORY = [
  { item: "milk", lastPurchasedDaysAgo: 6, avgCycleDays: 7 },
  { item: "bread", lastPurchasedDaysAgo: 5, avgCycleDays: 6 },
  { item: "eggs", lastPurchasedDaysAgo: 9, avgCycleDays: 10 },
  { item: "coffee", lastPurchasedDaysAgo: 12, avgCycleDays: 14 },
  { item: "bananas", lastPurchasedDaysAgo: 4, avgCycleDays: 5 },
  { item: "paper towels", lastPurchasedDaysAgo: 18, avgCycleDays: 21 },
  { item: "chicken", lastPurchasedDaysAgo: 6, avgCycleDays: 8 },
  { item: "yogurt", lastPurchasedDaysAgo: 3, avgCycleDays: 4 },
];

// Returns items that are "due" soon (within `thresholdDays` of their cycle)
export function getItemsRunningLow(thresholdDays = 1) {
  return PURCHASE_HISTORY.filter(
    (h) => h.avgCycleDays - h.lastPurchasedDaysAgo <= thresholdDays
  ).map((h) => h.item);
}

// Very simple seasonal logic based on current month
export function getCurrentSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  if (month === 11 || month <= 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  return "fall";
}

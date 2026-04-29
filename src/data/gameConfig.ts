export const ACTIVE_PRIZE = {
  title: 'PlayStation 5',
  cycleLabel: 'Sorteo semanal',
};

export function getEarnedGoldenCoupons(score: number) {
  if (score > 1000) return 3;
  if (score > 0) return 1;
  return 0;
}

export function getWeeklyClosingDate(baseDate = new Date()) {
  const closingDate = new Date(baseDate);
  const currentDay = closingDate.getDay();
  const daysUntilSunday = (7 - currentDay) % 7;

  closingDate.setDate(closingDate.getDate() + daysUntilSunday);
  closingDate.setHours(23, 59, 0, 0);

  if (closingDate <= baseDate) {
    closingDate.setDate(closingDate.getDate() + 7);
  }

  return closingDate;
}

export function formatCountdownParts(targetDate: Date, baseDate = new Date()) {
  const diff = Math.max(0, targetDate.getTime() - baseDate.getTime());
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return `${days}D ${hours}H ${minutes}M`;
}

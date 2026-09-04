export const LEVELS = [
  { level: 1, name: "Seedling", min: 0, max: 100 },
  { level: 2, name: "Sprout", min: 101, max: 300 },
  { level: 3, name: "Eco Rookie", min: 301, max: 600 },
  { level: 4, name: "Green Guardian", min: 601, max: 1000 },
  { level: 5, name: "Planet Hero", min: 1001, max: Infinity },
] as const;

export function calculateLevel(points: number) {
  if (points <= 100) return 1;
  if (points <= 300) return 2;
  if (points <= 600) return 3;
  if (points <= 1000) return 4;
  return 5;
}

export function levelInfo(points: number) {
  const level = calculateLevel(points);
  const current = LEVELS[level - 1]!;
  const next = LEVELS[level] ?? null;
  const span = next ? next.min - current.min : 1;
  const progress = next
    ? Math.min(100, Math.max(0, ((points - current.min) / span) * 100))
    : 100;
  return {
    level,
    name: current.name,
    next,
    pointsToNext: next ? Math.max(0, next.min - points) : 0,
    progress,
  };
}

export function makeToken(rewardId: string) {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `FREE-${n}-${rewardId.toUpperCase()}`;
}

export function parseNumber(value: string, fallback: number): number {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function toPercentage(value: number) {
  return `${(value * 100).toFixed(0)}%`;
}

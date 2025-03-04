export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function formatNumberToKOrM(num: number): string {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

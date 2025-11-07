import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Stage, StageRanges, IncentiveDetails } from "@/lib/types"
import { INCENTIVES } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseStageRanges(jsonString: string): StageRanges {
  const parsed = JSON.parse(jsonString);
  const ranges: Partial<StageRanges> = {};

  for (const stage of ['Red', 'Blue', 'Yellow', 'Green']) {
    const stageKey = stage as Stage;
    const rangeStr = parsed[stageKey];
    if (rangeStr.includes('>')) {
      ranges[stageKey] = {
        min: parseInt(rangeStr.replace('>', '').trim(), 10) + 1,
        max: null,
      };
    } else {
      const [min, max] = rangeStr.split('-').map((s: string) => parseInt(s.trim(), 10));
      ranges[stageKey] = { min, max };
    }
  }
  return ranges as StageRanges;
}

export function getStageForSales(sales: number, ranges: StageRanges): IncentiveDetails {
  if (sales >= ranges.Green.min) {
    return { stage: 'Green', incentive: INCENTIVES.Green, color: 'bg-green-500' };
  }
  if (sales >= ranges.Yellow.min && sales <= (ranges.Yellow.max ?? Infinity)) {
    return { stage: 'Yellow', incentive: INCENTIVES.Yellow, color: 'bg-yellow-500' };
  }
  if (sales >= ranges.Blue.min && sales <= (ranges.Blue.max ?? Infinity)) {
    return { stage: 'Blue', incentive: INCENTIVES.Blue, color: 'bg-blue-500' };
  }
  return { stage: 'Red', incentive: INCENTIVES.Red, color: 'bg-red-500' };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

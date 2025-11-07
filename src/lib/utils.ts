import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Stage, StageRanges, IncentiveDetails } from "@/lib/types"
import { INCENTIVES, STAGE_COLORS } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseStageRanges(jsonString: string): StageRanges {
  const parsed = JSON.parse(jsonString);
  const ranges: Partial<StageRanges> = {};

  for (const stage of ['Red', 'Blue', 'Yellow', 'Green']) {
    const stageKey = stage as Stage;
    const rangeStr = parsed[stageKey];
    if (rangeStr.includes('>=')) {
      ranges[stageKey] = {
        min: parseInt(rangeStr.replace('>=', '').trim(), 10),
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
    return { stage: 'Green', incentive: INCENTIVES.Green, colorClass: STAGE_COLORS.Green.bg, colorHex: STAGE_COLORS.Green.hex };
  }
  if (sales >= ranges.Yellow.min && sales <= (ranges.Yellow.max ?? Infinity)) {
    return { stage: 'Yellow', incentive: INCENTIVES.Yellow, colorClass: STAGE_COLORS.Yellow.bg, colorHex: STAGE_COLORS.Yellow.hex };
  }
  if (sales >= ranges.Blue.min && sales <= (ranges.Blue.max ?? Infinity)) {
    return { stage: 'Blue', incentive: INCENTIVES.Blue, colorClass: STAGE_COLORS.Blue.bg, colorHex: STAGE_COLORS.Blue.hex };
  }
  return { stage: 'Red', incentive: INCENTIVES.Red, colorClass: STAGE_COLORS.Red.bg, colorHex: STAGE_COLORS.Red.hex };
}

export function formatCurrency(amount: number, minimumFractionDigits = 0, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

export function getProgress(current: number, target: number): number {
  if (target === 0) return 0;
  // Allow progress to go beyond 100%
  return Math.round((current / target) * 100);
}

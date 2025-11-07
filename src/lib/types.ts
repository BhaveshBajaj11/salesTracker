
export type Stage = 'Red' | 'Blue' | 'Yellow' | 'Green';

export type StageRanges = {
  [key in Stage]: {
    min: number;
    max: number | null;
  };
};

export const INCENTIVES: { [key in Stage]: number } = {
  Red: 0.75,
  Blue: 0.90,
  Yellow: 1.20,
  Green: 1.40,
};

export const STAGE_COLORS: { [key in Stage]: { bg: string, hex: string } } = {
  Red: { bg: 'bg-red-500', hex: '#ef4444' },
  Blue: { bg: 'bg-blue-500', hex: '#3b82f6' },
  Yellow: { bg: 'bg-yellow-500', hex: '#eab308' },
  Green: { bg: 'bg-green-500', hex: '#22c55e' },
};

export type IncentiveDetails = {
  stage: Stage;
  incentive: number;
  colorClass: string;
  colorHex: string;
};

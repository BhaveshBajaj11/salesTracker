
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

export type IncentiveDetails = {
  stage: Stage;
  incentive: number;
  color: string;
};

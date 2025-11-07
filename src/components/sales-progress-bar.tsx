
'use client';

import type { StageRanges } from '@/lib/types';
import { formatCurrency, getProgress, getStageForSales } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SalesProgressBarProps = {
  currentSales: number;
  salesTarget: number;
  ranges: StageRanges;
};

const stageDetails: { [key: string]: { color: string; markerColor: string; } } = {
  Red: { color: 'bg-red-500', markerColor: '#ef4444' },
  Blue: { color: 'bg-blue-500', markerColor: '#3b82f6' },
  Yellow: { color: 'bg-yellow-500', markerColor: '#eab308' },
  Green: { color: 'bg-green-500', markerColor: '#22c55e' },
};

export default function SalesProgressBar({ currentSales, salesTarget, ranges }: SalesProgressBarProps) {
  const progress = getProgress(currentSales, salesTarget);
  const incentiveDetails = getStageForSales(currentSales, ranges);

  const allMarkers = [
    { value: ranges.Blue.min, stage: 'Blue' },
    { value: ranges.Yellow.min, stage: 'Yellow' },
    { value: ranges.Green.min, stage: 'Green' },
  ];

  return (
    <TooltipProvider>
      <div className="w-full px-4">
        <div className="relative h-6 w-full rounded-full bg-muted mt-10">
          {/* Progress Fill */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${stageDetails[incentiveDetails.stage].color}`}
            style={{ width: `${progress}%` }}
          />

          {/* Stage Markers */}
          {allMarkers.map((marker, index) => {
            if (marker.value === null) return null;
            const markerPosition = getProgress(marker.value, salesTarget);
            const stageDetail = stageDetails[marker.stage];
            return (
              <div
                key={index}
                className="absolute top-0 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${markerPosition}%`, top: '50%' }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold -mt-5">{marker.value}</span>
                  <div 
                    className="w-5 h-5 rounded-full border-2" 
                    style={{ borderColor: stageDetail.markerColor, backgroundColor: 'white' }}
                  />
                  <div
                    className="h-3 w-px"
                    style={{ background: `repeating-linear-gradient(to bottom, ${stageDetail.markerColor}, ${stageDetail.markerColor} 2px, transparent 2px, transparent 4px)` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-1 h-6">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className="absolute top-0 -translate-x-1/2 transition-all duration-500"
                style={{ left: `${progress}%` }}
              >
                <div className="flex flex-col items-center">
                   <div className="w-5 h-5 rounded-full" style={{backgroundColor: '#3b82f6' /* Blue as per design */}} />
                   <span className="text-xs font-bold text-primary mt-1">{formatCurrency(currentSales, 0)}</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your current sales</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground -mt-4">
            <span>{formatCurrency(0, 0)}</span>
            <span>{formatCurrency(salesTarget, 0)}</span>
        </div>
      </div>
    </TooltipProvider>
  );
}

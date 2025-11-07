'use client';

import type { StageRanges } from '@/lib/types';
import { formatCurrency, getProgress, getStageForSales } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const stageDetails: { [key: string]: { color: string; markerColor: string; } } = {
  Red: { color: 'bg-red-500', markerColor: '#ef4444' },
  Blue: { color: 'bg-blue-500', markerColor: '#3b82f6' },
  Yellow: { color: 'bg-yellow-500', markerColor: '#eab308' },
  Green: { color: 'bg-green-500', markerColor: '#22c55e' },
};

type SalesProgressBarProps = {
    currentSales: number;
    salesTarget: number;
    ranges: StageRanges;
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
      <div className="w-full">
        <div className="relative w-full mx-auto mt-10">
          {/* Stage Markers */}
          <div className="relative h-8">
            {allMarkers.map((marker, index) => {
              if (marker.value === null) return null;
              const markerPosition = getProgress(marker.value, salesTarget);
              if (currentSales >= marker.value && marker.stage !== 'Green') return null;
              if (markerPosition > 100) return null;
              const stageDetail = stageDetails[marker.stage];
              return (
                <div
                  key={index}
                  className="absolute bottom-0 -translate-x-1/2"
                  style={{ left: `${markerPosition}%` }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold">{formatCurrency(marker.value, 0)}</span>
                    <div 
                      className="w-5 h-5 rounded-full border-2 bg-white" 
                      style={{ borderColor: stageDetail.markerColor }}
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

          {/* Progress Bar */}
          <div className="relative h-10 w-full rounded-full bg-muted border-2 border-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${stageDetails[incentiveDetails.stage].color}`}
              style={{ width: `${progress > 100 ? 100 : progress}%` }}
            />
          </div>
        </div>


        <div className="relative mt-1 h-6 w-full mx-auto">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className="absolute top-0 -translate-x-1/2 transition-all duration-500"
                style={{ left: `${progress > 100 ? 100 : progress}%` }}
              >
                <div className="flex flex-col items-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 24L24 12H0L12 24Z" />
                  </svg>
                  <span className="text-xs font-bold text-primary mt-1">{formatCurrency(currentSales, 0)}</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your current sales</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}


'use client';

import type { StageRanges } from '@/lib/types';
import { formatCurrency, getProgress, getStageForSales } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, MapPin } from 'lucide-react';

type SalesProgressBarProps = {
  currentSales: number;
  salesTarget: number;
  ranges: StageRanges;
};

const stageColors: { [key: string]: string } = {
  Red: 'bg-red-500',
  Blue: 'bg-blue-500',
  Yellow: 'bg-yellow-500',
  Green: 'bg-green-500',
};

export default function SalesProgressBar({ currentSales, salesTarget, ranges }: SalesProgressBarProps) {
  const progress = getProgress(currentSales, salesTarget);
  const incentiveDetails = getStageForSales(currentSales, ranges);

  const markers = [
    { value: ranges.Red.max, label: 'Red End' },
    { value: ranges.Blue.max, label: 'Blue End' },
    { value: ranges.Yellow.max, label: 'Yellow End' },
  ].filter(m => m.value !== null && m.value > currentSales);

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="relative h-8 w-full rounded-full bg-muted overflow-hidden mt-6">
            {/* Progress Fill */}
            <div
                className={`h-full transition-all duration-500 ${stageColors[incentiveDetails.stage]}`}
                style={{ width: `${progress}%` }}
            />
            
            {/* Stage Markers */}
            {markers.map((marker, index) => {
                if (marker.value === null) return null;
                const markerPosition = getProgress(marker.value, salesTarget);
                return (
                    <div key={index} className="absolute top-0 h-full -translate-y-1/2" style={{ left: `${markerPosition}%`, top: '50%' }}>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <div className="relative -translate-x-1/2">
                                  <MapPin className="h-10 w-10 text-primary" fill="hsl(var(--primary))" />
                                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-primary-foreground">
                                    {formatCurrency(marker.value)}
                                  </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{marker.label}: {formatCurrency(marker.value)}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )
            })}
        </div>

        <div className="relative mt-2 h-6">
           <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  className="absolute top-0 -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${progress}%` }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-primary">{formatCurrency(currentSales)}</span>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your current sales</p>
              </TooltipContent>
            </Tooltip>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(salesTarget)}</span>
        </div>
      </div>
    </TooltipProvider>
  );
}

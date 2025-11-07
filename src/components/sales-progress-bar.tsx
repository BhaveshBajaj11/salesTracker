
'use client';

import type { StageRanges } from '@/lib/types';
import { formatCurrency, getProgress } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp } from 'lucide-react';

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

  const stageSegments = Object.entries(ranges).map(([stage, range]) => {
    const min = range.min;
    const max = range.max ?? salesTarget;
    let width = 0;
    if (salesTarget > 0) {
        width = ((max - min) / salesTarget) * 100;
    }
    if (stage === 'Green' && salesTarget > min) {
        width = ((salesTarget - min) / salesTarget) * 100;
    }
    if (width < 0) width = 0;

    const label = `${formatCurrency(min)} - ${range.max ? formatCurrency(range.max) : '+'}`;

    return { stage, width, label, color: stageColors[stage] };
  });

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="relative h-8 w-full rounded-full bg-muted overflow-hidden flex">
          {stageSegments.map(segment => (
             segment.width > 0 && (
              <Tooltip key={segment.stage} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className={`${segment.color} h-full transition-all duration-500`}
                    style={{ width: `${segment.width}%` }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{segment.stage}: {segment.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          ))}
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

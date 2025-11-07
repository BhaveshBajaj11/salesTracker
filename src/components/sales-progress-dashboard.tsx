'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { parseStageRanges, getStageForSales, formatCurrency } from '@/lib/utils';
import type { StageRanges, IncentiveDetails, Stage } from '@/lib/types';
import SalesProgressBar from './sales-progress-bar';

const initialRangesString = '{"Red": "0-1299", "Blue": "1300-1499", "Yellow": "1500-1699", "Green": ">=1700"}';

export default function SalesProgressDashboard() {
  const { toast } = useToast();

  const [currentSales, setCurrentSales] = useState(0);
  const [stageRanges, setStageRanges] = useState<StageRanges>(() => parseStageRanges(initialRangesString));
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastStage, setLastStage] = useState<Stage | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const salesTarget = useMemo(() => {
    const greenMin = stageRanges.Green.min;
    return greenMin * 1.1; // 10% padding
  }, [stageRanges]);
  
  const incentiveDetails: IncentiveDetails = useMemo(() => getStageForSales(currentSales, stageRanges), [currentSales, stageRanges]);
  
  const handleConfetti = useCallback(() => {
      if (incentiveDetails.stage !== lastStage && lastStage !== null) {
          if (incentiveDetails.stage === 'Blue' || incentiveDetails.stage === 'Yellow' || incentiveDetails.stage === 'Green') {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
          }
      }
      setLastStage(incentiveDetails.stage);
  }, [incentiveDetails.stage, lastStage]);

  useEffect(() => {
    handleConfetti();
    if (typeof window !== 'undefined') {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }
  }, [currentSales, handleConfetti]);

  const tipContent = useMemo(() => {
    if (incentiveDetails.stage === 'Green') {
      return 'Great work! Continue to increase your incentive.';
    }

    let nextStage: Stage;
    let nextTarget: number;

    if (incentiveDetails.stage === 'Red') {
      nextStage = 'Blue';
      nextTarget = stageRanges.Blue.min;
    } else if (incentiveDetails.stage === 'Blue') {
      nextStage = 'Yellow';
      nextTarget = stageRanges.Yellow.min;
    } else { // Yellow
      nextStage = 'Green';
      nextTarget = stageRanges.Green.min;
    }

    const difference = nextTarget - currentSales;
    if (difference <= 0) return '';
    
    return `You need ${formatCurrency(difference, 0)} more to reach the ${nextStage} slab.`;
  }, [currentSales, stageRanges, incentiveDetails.stage]);
  
  return (
    <>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardHeader className={`text-center ${incentiveDetails.colorClass} text-primary-foreground rounded-t-lg py-4 transition-colors duration-500`}>
          <CardTitle className="text-2xl font-bold">WoW Rewards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 bg-card px-4 md:px-6">
          <div className="text-center">
            <p className="text-lg">Hi &lt;User Name&gt;</p>
          </div>
          
          <div className="">
             <label htmlFor="current-sales" className="sr-only">Current Sales</label>
             <Input
              id="current-sales"
              type="number"
              value={currentSales}
              onChange={(e) => setCurrentSales(Number(e.target.value))}
              className="text-lg font-semibold text-center"
              aria-label="Current Sales Input"
              placeholder="Enter your sales"
            />
          </div>

          <SalesProgressBar currentSales={currentSales} salesTarget={salesTarget} ranges={stageRanges} />
          
          <div className="text-center space-y-4 pt-8">
              {incentiveDetails.stage === 'Green' ? (
                  <>
                      <p>Your Target for the day: <span className="font-bold">{formatCurrency(stageRanges.Yellow.min)}</span></p>
                      <p>Current Achievement: <span className="font-bold">{formatCurrency(currentSales)}</span></p>
                  </>
              ) : (
                  <>
                      <p>Target Sales: <span className="font-bold">{formatCurrency(stageRanges.Green.min)}</span></p>
                      <p>Sales: <span className="font-bold">{formatCurrency(currentSales)}</span></p>
                  </>
              )}

              <div className="flex justify-center items-baseline">
                  <p className={`font-bold text-4xl`} style={{color: incentiveDetails.colorHex}}>
                      {incentiveDetails.incentive.toFixed(2)}x
                  </p>
                  <p className="text-muted-foreground ml-2">Multiple</p>
              </div>

              {tipContent && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">{tipContent}</p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

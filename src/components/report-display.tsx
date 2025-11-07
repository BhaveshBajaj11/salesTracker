
'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useEffect, useState, useCallback } from 'react';
import SalesProgressBar from '@/components/sales-progress-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageRanges, IncentiveDetails } from '@/lib/types';
import { getStageForSales, formatCurrency, getProgress } from '@/lib/utils';
import Confetti from 'react-confetti';

export default function ReportDisplay() {
  const searchParams = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastStage, setLastStage] = useState<string | null>(null);

  const salesData = useMemo(() => {
    const sales = Number(searchParams.get('sales')) || 0;
    const target = Number(searchParams.get('target')) || 1;
    const redMax = Number(searchParams.get('redMax'));
    const blueMax = Number(searchPa'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useEffect, useState, useCallback } from 'react';
import SalesProgressBar from '@/components/sales-progress-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { StageRanges, IncentiveDetails } from '@/lib/types';
import { getStageForSales, formatCurrency, getProgress } from '@/lib/utils';
import Confetti from 'react-confetti';

export default function ReportDisplay() {
  const searchParams = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastStage, setLastStage] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState<{width: number, height: number}>({width: 0, height: 0});

  const salesData = useMemo(() => {
    const sales = Number(searchParams.get('sales')) || 0;
    const target = Number(searchParams.get('target')) || 1;
    const redMax = Number(searchParams.get('redMax'));
    const blueMax = Number(searchParams.get('blueMax'));
    const yellowMax = Number(searchParams.get('yellowMax'));
    const greenMin = Number(searchParams.get('greenMin'));

    const ranges: StageRanges = {
      Red: { min: 0, max: redMax },
      Blue: { min: redMax + 1, max: blueMax },
      Yellow: { min: blueMax + 1, max: yellowMax },
      Green: { min: greenMin, max: null },
    };

    const incentiveDetails = getStageForSales(sales, ranges);
    const progressPercentage = getProgress(sales, target);

    return { sales, target, ranges, incentiveDetails, progressPercentage };
  }, [searchParams]);

  const { sales, target, ranges, incentiveDetails, progressPercentage } = salesData;

  const handleConfetti = useCallback(() => {
    if (incentiveDetails.stage !== lastStage && lastStage !== null) {
        if (incentiveDetails.stage === 'Blue' || incentiveDetails.stage === 'Yellow' || incentiveDetails.stage === 'Green') {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }
    }
    setLastStage(incentiveDetails.stage);
  }, [incentiveDetails.stage, lastStage]);

  useEffect(() => {
    handleConfetti();
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, [sales, handleConfetti]);


  if (!salesData.target) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-0 shadow-none">
                <CardHeader>
                    <CardTitle>Invalid Report Data</CardTitle>
                    <CardDescription>The provided link is missing required sales data.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      <Card className="w-full max-w-md animate-in fade-in-50 duration-500 border-0 shadow-none">
        <CardHeader className="text-center bg-primary text-primary-foreground rounded-t-lg py-4">
          <CardTitle className="text-2xl font-bold">WoW Rewards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 bg-card">
          <div className="text-center">
            <p className="text-lg">Hi &lt;User Name&gt;</p>
          </div>
          
          <SalesProgressBar currentSales={sales} salesTarget={target} ranges={ranges} />
          
          <div className="text-center space-y-4 pt-4">
              {incentiveDetails.stage === 'Green' ? (
                  <>
                      <p>Your Target for the day: <span className="font-bold">{formatCurrency(target)}</span></p>
                      <p>Current Achievement: <span className="font-bold">{formatCurrency(sales)}</span></p>
                  </>
              ) : (
                  <>
                      <p>Target Sales: <span className="font-bold">{formatCurrency(target)}</span></p>
                      <p>Sales: <span className="font-bold">{formatCurrency(sales)}</span></p>
                  </>
              )}

              <div className="flex justify-center items-center">
                  <p className={`font-bold text-3xl`} style={{color: incentiveDetails.colorHex}}>
                      {incentiveDetails.incentive}x
                  </p>
                  <p className="text-muted-foreground ml-2">Multiple</p>
              </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Confetti from 'react-confetti';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { parseStageRanges, getStageForSales, formatCurrency } from '@/lib/utils';
import type { StageRanges, IncentiveDetails, Stage } from '@/lib/types';
import { INCENTIVES } from '@/lib/types';
import SalesProgressBar from './sales-progress-bar';
import { locales, type Locale } from '@/lib/locales';

const buildRangesString = (params: URLSearchParams): string => {
  const blueMin = parseInt(params.get('Blue') || "1300", 10);
  const yellowMin = parseInt(params.get('Yellow') || "1500", 10);
  const greenMin = parseInt(params.get('Green') || "1700", 10);

  const redMax = blueMin > 0 ? blueMin - 1 : 0;
  const blueMax = yellowMin > 0 ? yellowMin - 1 : blueMin;
  const yellowMax = greenMin > 0 ? greenMin - 1 : yellowMin;

  return JSON.stringify({
    Red: `0-${redMax}`,
    Blue: `${blueMin}-${blueMax}`,
    Yellow: `${yellowMin}-${yellowMax}`,
    Green: `>=${greenMin}`,
  });
};

const getSalesFromParams = (params: URLSearchParams) => {
  const sales = params.get('sales');
  return sales ? Number(sales) : 0;
};

const getUserNameFromParams = (params: URLSearchParams): string | null => {
  return params.get('Name');
};

const getLangFromParams = (params: URLSearchParams) => {
  const lang = params.get('lang');
  if (lang === 'en') {
    return locales.en;
  }
  return locales.ta;
};

export default function SalesProgressDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentSales, setCurrentSales] = useState(0);
  const [stageRanges, setStageRanges] = useState<StageRanges>(() => parseStageRanges(buildRangesString(new URLSearchParams(searchParams.toString()))));
  const [userName, setUserName] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastStage, setLastStage] = useState<Stage | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isDebug, setIsDebug] = useState(false);
  const [lang, setLang] = useState<Locale>(locales.ta);

  const salesTarget = useMemo(() => {
    const greenMin = stageRanges.Green.min;
    return greenMin * 1.1; // 10% padding
  }, [stageRanges]);
  
  const incentiveDetails: IncentiveDetails = useMemo(() => getStageForSales(currentSales, stageRanges), [currentSales, stageRanges]);
  
  const handleConfetti = () => {
      if (incentiveDetails.stage !== lastStage && lastStage !== null) {
          if (incentiveDetails.stage === 'Blue' || incentiveDetails.stage === 'Yellow' || incentiveDetails.stage === 'Green') {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
          }
      }
      setLastStage(incentiveDetails.stage);
  };

  useEffect(() => {
    handleConfetti();
  }, [incentiveDetails.stage]);
  
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial size
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setStageRanges(parseStageRanges(buildRangesString(params)));
    setUserName(getUserNameFromParams(params));
    setCurrentSales(getSalesFromParams(params));
    setIsDebug(params.get('debug') === 'true');
    setLang(getLangFromParams(params));
  }, [searchParams]);

  const handleSalesChange = (newSales: number) => {
    setCurrentSales(newSales);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sales', String(newSales));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const tipContent = useMemo(() => {
    if (incentiveDetails.stage === 'Green') {
      return lang.greatWork;
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
    
    const nextIncentive = INCENTIVES[nextStage];

    if (lang === locales.ta) {
      return `${lang.tip_prefix} ${formatCurrency(difference, 0)} ${lang.tip_suffix_part1} ${nextIncentive.toFixed(2)}${lang.tip_suffix_part2}`;
    }
    return `${lang.tip_prefix} ${formatCurrency(difference, 0)} ${lang.tip_suffix_part1} ${nextIncentive.toFixed(2)}${lang.tip_suffix_part2}`;

  }, [currentSales, stageRanges, incentiveDetails.stage, lang]);
  
  return (
    <>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardHeader className={`text-center ${incentiveDetails.colorClass} text-primary-foreground rounded-t-lg py-4 transition-colors duration-500`}>
          <CardTitle className="text-2xl font-bold">{lang.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 bg-card px-4 md:px-6">
          <div className="text-center">
            <p className="text-lg pb-6">{lang.greeting}{userName ? ` ${userName}` : ''}</p>
          </div>
          
          {isDebug && (
            <div className="pb-4">
               <label htmlFor="current-sales" className="sr-only">{lang.enterYourSales}</label>
               <Input
                id="current-sales"
                type="number"
                value={currentSales}
                onChange={(e) => handleSalesChange(Number(e.target.value))}
                className="text-lg font-semibold text-center"
                aria-label="Current Sales Input"
                placeholder={lang.enterYourSales}
              />
            </div>
          )}

          <SalesProgressBar currentSales={currentSales} salesTarget={salesTarget} ranges={stageRanges} lang={lang} />
          
          <div className="text-center space-y-4 pt-8">
              {incentiveDetails.stage === 'Green' ? (
                  <>
                      <p>{lang.yourTarget}: <span className="font-bold">{formatCurrency(stageRanges.Yellow.min)}</span></p>
                      <p>{lang.currentAchievement}: <span className="font-bold">{formatCurrency(currentSales)}</span></p>
                  </>
              ) : (
                  <>
                      <p>{lang.yourTarget}: <span className="font-bold">{formatCurrency(stageRanges.Yellow.min)}</span></p>
                      <p>{lang.sales}: <span className="font-bold">{formatCurrency(currentSales)}</span></p>
                  </>
              )}

              <div className="flex justify-center items-baseline">
                  <p className={`font-bold text-4xl`} style={{color: incentiveDetails.colorHex}}>
                      {incentiveDetails.incentive.toFixed(2)}x
                  </p>
                  <p className="text-muted-foreground ml-2">{lang.multiple}</p>
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


'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Share2, TrendingUp, IndianRupee } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { parseStageRanges, getStageForSales, formatCurrency, getProgress } from '@/lib/utils';
import type { StageRanges, IncentiveDetails } from '@/lib/types';
import SalesProgressBar from './sales-progress-bar';

const initialRangesString = '{"Red": "0-1000", "Blue": "1001-1500", "Yellow": "1501-2500", "Green": ">2500"}';

export default function SalesProgressDashboard() {
  const { toast } = useToast();

  const [currentSales, setCurrentSales] = useState(1250);
  const [salesTarget, setSalesTarget] = useState(4000);
  const [stageRanges, setStageRanges] = useState<StageRanges>(() => parseStageRanges(initialRangesString));

  const incentiveDetails: IncentiveDetails = useMemo(() => getStageForSales(currentSales, stageRanges), [currentSales, stageRanges]);
  const progressPercentage = useMemo(() => getProgress(currentSales, salesTarget), [currentSales, salesTarget]);


  const handleShare = () => {
    const params = new URLSearchParams({
      sales: currentSales.toString(),
      target: salesTarget.toString(),
      redMax: stageRanges.Red.max!.toString(),
      blueMax: stageRanges.Blue.max!.toString(),
      yellowMax: stageRanges.Yellow.max!.toString(),
      greenMin: stageRanges.Green.min.toString(),
    });
    const url = `${window.location.origin}/report?${params.toString()}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied!',
      description: 'The report link is now on your clipboard.',
    });
  };
  
  return (
    <div className="grid grid-cols-1 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-primary" />
            Current Performance
          </CardTitle>
          <CardDescription>Track your current sales against your target.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label htmlFor="current-sales" className="flex items-center gap-2 text-lg font-medium whitespace-nowrap">
              <IndianRupee className="w-5 h-5" />
              Current Sales
            </label>
            <Input
              id="current-sales"
              type="number"
              value={currentSales}
              onChange={(e) => setCurrentSales(Number(e.target.value))}
              className="text-lg font-semibold max-w-xs"
              aria-label="Current Sales Input"
            />
          </div>
          <SalesProgressBar currentSales={currentSales} salesTarget={salesTarget} ranges={stageRanges} />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Stage</p>
                <Badge className={`${incentiveDetails.color} text-white`}>{incentiveDetails.stage}</Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Incentive</p>
                <p className="font-bold text-accent text-lg">{incentiveDetails.incentive.toFixed(2)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Target</p>
                <p className="font-bold text-lg">{formatCurrency(salesTarget)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-bold text-lg">{progressPercentage}%</p>
              </div>
            </div>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2" /> Share Report <Copy className="ml-2 w-4 h-4" />
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { useFormState } from 'react-dom';
import { BrainCircuit, Copy, Share2, Target, TrendingUp, IndianRupee } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { AIFormState } from '@/app/actions';
import { getAiSuggestion } from '@/app/actions';
import { parseStageRanges, getStageForSales, formatCurrency, getProgress } from '@/lib/utils';
import type { StageRanges, IncentiveDetails } from '@/lib/types';
import SalesProgressBar from './sales-progress-bar';

const initialRangesString = '{"Red": "0-1000", "Blue": "1001-1500", "Yellow": "1501-2500", "Green": ">2500"}';

export default function SalesProgressDashboard() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [currentSales, setCurrentSales] = useState(1250);
  const [salesTarget, setSalesTarget] = useState(4000);
  const [stageRanges, setStageRanges] = useState<StageRanges>(() => parseStageRanges(initialRangesString));
  const [marketBenchmark, setMarketBenchmark] = useState(
    'Our main competitor in the region sold 2,500 units last quarter with a similar product. The total addressable market is estimated at 10,000 units per year.'
  );

  const [aiState, formAction] = useFormState<AIFormState, FormData>(getAiSuggestion, null);

  const incentiveDetails: IncentiveDetails = useMemo(() => getStageForSales(currentSales, stageRanges), [currentSales, stageRanges]);
  const progressPercentage = useMemo(() => getProgress(currentSales, salesTarget), [currentSales, salesTarget]);

  useEffect(() => {
    if (!aiState) return;

    if (aiState.success && aiState.data) {
      toast({
        title: 'AI Analysis Complete',
        description: 'Sales targets and stages have been updated.',
      });
      startTransition(() => {
        setSalesTarget(aiState.data!.revisedSalesTarget);
        setStageRanges(parseStageRanges(aiState.data!.suggestedStageRanges));
      });
    } else if (aiState.error) {
      toast({
        variant: 'destructive',
        title: 'AI Analysis Failed',
        description: aiState.error,
      });
    }
  }, [aiState, toast]);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
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

      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="text-primary" />
              AI Sales Analyst
            </CardTitle>
            <CardDescription>Get AI-driven suggestions to refine your sales target based on market data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="hidden" name="salesTarget" value={salesTarget} />
            <input type="hidden" name="currentStage" value={incentiveDetails.stage} />
            <div>
              <label htmlFor="market-benchmark" className="text-sm font-medium">Market Benchmark Data</label>
              <Textarea
                id="market-benchmark"
                name="marketBenchmark"
                value={marketBenchmark}
                onChange={(e) => setMarketBenchmark(e.target.value)}
                placeholder="Enter industry sales data, competitor performance, regional analysis, etc."
                rows={5}
                className="mt-1"
                required
              />
            </div>
            {aiState?.success && aiState.data && !isPending && (
              <div className="p-4 bg-muted/50 rounded-lg border border-dashed text-sm space-y-2">
                <p className="font-semibold text-accent flex items-center gap-2"><Target /> AI Suggestion:</p>
                <p><strong>New Target:</strong> {formatCurrency(aiState.data.revisedSalesTarget)}</p>
                <p><strong>Reasoning:</strong> {aiState.data.reasoning}</p>
              </div>
            )}
            {isPending && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Analyzing...' : 'Get AI Suggestion'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

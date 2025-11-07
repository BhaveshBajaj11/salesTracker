
'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import SalesProgressBar from '@/components/sales-progress-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StageRanges, IncentiveDetails } from '@/lib/types';
import { getStageForSales, formatCurrency, getProgress } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export default function ReportDisplay() {
  const searchParams = useSearchParams();

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

  if (!salesData.target) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Invalid Report Data</CardTitle>
                    <CardDescription>The provided link is missing required sales data.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  const { sales, target, ranges, incentiveDetails, progressPercentage } = salesData;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl animate-in fade-in-50 duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <TrendingUp className="text-primary" /> Sales Performance Report
          </CardTitle>
          <CardDescription>A snapshot of sales progress as of {new Date().toLocaleDateString()}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <SalesProgressBar currentSales={sales} salesTarget={target} ranges={ranges} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center p-4 bg-muted/50 rounded-lg">
                <div>
                    <p className="text-sm text-muted-foreground">Current Sales</p>
                    <p className="font-bold text-lg text-primary">{formatCurrency(sales)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Sales Target</p>
                    <p className="font-bold text-lg">{formatCurrency(target)}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Stage</p>
                    <Badge className={`${incentiveDetails.color} text-white`}>{incentiveDetails.stage}</Badge>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Incentive</p>
                    <p className="font-bold text-lg text-accent">{incentiveDetails.incentive.toFixed(2)}%</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

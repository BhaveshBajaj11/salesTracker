
import { Suspense } from 'react';
import ReportDisplay from '@/components/report-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingReport() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-full rounded-full" />
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/4" />
                             <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                     <div className="flex items-center justify-around">
                        <div className="text-center space-y-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="text-center space-y-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="text-center space-y-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ReportPage() {
  return (
    <div className="container mx-auto p-4 md:py-8 flex justify-center">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoadingReport />}>
          <ReportDisplay />
        </Suspense>
      </div>
    </div>
  );
}

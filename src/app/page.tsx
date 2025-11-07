import SalesProgressDashboard from '@/components/sales-progress-dashboard';
import { PageHeader } from '@/components/page-header';

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:py-8">
      <PageHeader
        title="Sales Progress Tracker"
        subtitle="Monitor your sales performance and get AI-powered insights to optimize your targets."
      />
      <SalesProgressDashboard />
    </div>
  );
}

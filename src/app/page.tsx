import SalesProgressDashboard from '@/components/sales-progress-dashboard';

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:py-8 flex justify-center">
      <div className="w-full max-w-md">
        <SalesProgressDashboard />
      </div>
    </div>
  );
}

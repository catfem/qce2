import { useQuery } from '@tanstack/react-query';
import { useUser } from '../context/UserContext.jsx';
import { useCredits } from '../context/CreditContext.jsx';
import { fetchQuestionStats } from '../services/questions.js';
import { StatsCards } from '../components/Dashboard/StatsCards.jsx';
import { UsageAnalytics } from '../components/Dashboard/UsageAnalytics.jsx';
import { RecentActivity } from '../components/Dashboard/RecentActivity.jsx';
import { CreditSummary } from '../components/Dashboard/CreditSummary.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

export default function DashboardPage() {
  const { accessToken } = useUser();
  const { credits, unlimited } = useCredits();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => fetchQuestionStats(accessToken),
    enabled: Boolean(accessToken)
  });

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-44" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const stats = data?.stats || [];
  const usage = data?.usage || { extractions: 0, reviews: 0, breakdown: [] };
  const activity = data?.activity || [];
  const ledger = data?.creditLedger || [];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-3xl font-semibold text-gradient">Mission control</h2>
        <p className="mt-2 text-sm text-slate-300">
          Monitor AI performance, assess moderation throughput, and stay ahead of learning demand.
        </p>
      </section>
      <StatsCards stats={stats} />
      <div className="grid gap-6 lg:grid-cols-2">
        <UsageAnalytics usage={usage} />
        <CreditSummary credits={credits} ledger={ledger} unlimited={unlimited} />
      </div>
      <RecentActivity items={activity} />
    </div>
  );
}

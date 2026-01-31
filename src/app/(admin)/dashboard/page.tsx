import StatsGrid from '@/components/dashboard/StatsGrid';
import Section from '@/components/dashboard/Section';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  return (
    <>
      <StatsGrid />

      <Section title="Recent Activity">
        <RecentActivity />
      </Section>
    </>
  );
}

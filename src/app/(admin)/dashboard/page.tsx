import StatsGrid from '@/components/dashboard/StatsGrid';
import Section from '@/components/dashboard/Section';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { createSupabaseServer } from '@/lib/supabase/server';

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins === 0 ? 'Just now' : mins + ' min ago'}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

export default async function DashboardPage() {
  const supabase = createSupabaseServer();

  const [
    { data: paidOrders },
    { count: ordersCount },
    { count: productsCount },
    { count: customersCount },
    { data: recentOrders },
    { data: recentProducts },
  ] = await Promise.all([
    supabase.from('orders').select('total').eq('status', 'paid'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*, user:profiles(full_name)').order('created_at', { ascending: false }).limit(3),
    supabase.from('products').select('*').order('created_at', { ascending: false }).limit(3)
  ]);

  const totalRevenue = paidOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

  const activities: any[] = [];

  if (recentOrders) {
    recentOrders.forEach(order => {
      activities.push({
        user: order.user?.full_name || 'Guest',
        action: 'Created order',
        time: order.created_at,
        type: 'order'
      });
    });
  }

  if (recentProducts) {
    recentProducts.forEach(product => {
      activities.push({
        user: 'Admin',
        action: 'Added product: ' + product.name,
        time: product.created_at,
        type: 'edit'
      });
    });
  }

  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const formattedActivities = activities.slice(0, 5).map(a => ({
    ...a,
    time: timeAgo(a.time)
  }));

  return (
    <>
      <StatsGrid 
        totalRevenue={totalRevenue} 
        ordersCount={ordersCount || 0}
        productsCount={productsCount || 0}
        customersCount={customersCount || 0}
      />

      <Section title="Recent Activity">
        <RecentActivity activities={formattedActivities} />
      </Section>
    </>
  );
}

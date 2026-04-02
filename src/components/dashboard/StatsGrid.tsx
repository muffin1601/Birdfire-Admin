import StatCard from './StatCard';
import styles from './StatsGrid.module.css';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from 'lucide-react';

interface StatsProps {
  totalRevenue: number;
  ordersCount: number;
  productsCount: number;
  customersCount: number;
}

export default function StatsGrid({ totalRevenue, ordersCount, productsCount, customersCount }: StatsProps) {
  return (
    <section className={styles.grid}>
      <StatCard
        label="Total Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        icon={<DollarSign />}
        color="green"
        hint="+12% this month"
      />
      <StatCard
        label="Orders"
        value={ordersCount.toLocaleString()}
        icon={<ShoppingCart />}
        color="blue"
      />
      <StatCard
        label="Products"
        value={productsCount.toLocaleString()}
        icon={<Package />}
        color="purple"
      />
      <StatCard
        label="Customers"
        value={customersCount.toLocaleString()}
        icon={<Users />}
        color="orange"
      />
    </section>
  );
}

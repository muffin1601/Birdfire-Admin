import StatCard from './StatCard';
import styles from './StatsGrid.module.css';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from 'lucide-react';

export default function StatsGrid() {
  return (
    <section className={styles.grid}>
      <StatCard
        label="Total Revenue"
        value="$24,500"
        icon={<DollarSign />}
        color="green"
        hint="+12% this month"
      />
      <StatCard
        label="Orders"
        value="1,245"
        icon={<ShoppingCart />}
        color="blue"
      />
      <StatCard
        label="Products"
        value="320"
        icon={<Package />}
        color="purple"
      />
      <StatCard
        label="Customers"
        value="890"
        icon={<Users />}
        color="orange"
      />
    </section>
  );
}

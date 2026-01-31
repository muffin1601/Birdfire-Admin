'use client';

import styles from './StatCard.module.css';

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'purple' | 'orange';
};

export default function StatCard({
  label,
  value,
  hint,
  icon,
  color = 'blue',
}: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      {icon && <div className={styles.icon}>{icon}</div>}

      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>

      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

// components/admin/PageHeader.tsx
import styles from './PageHeader.module.css';

export default function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
      {action}
    </div>
  );
}

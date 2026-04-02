import styles from './RecentActivity.module.css';
import { UserPlus, ShoppingBag, Edit3 } from 'lucide-react';

const icons: any = {
  order: <ShoppingBag size={14} />,
  edit: <Edit3 size={14} />,
  user: <UserPlus size={14} />,
};

interface Activity {
  user: string;
  action: string;
  time: string;
  type: string;
}

interface RecentActivityProps {
  activities?: Activity[];
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>User</th>
          <th className={styles.th}>Action</th>
          <th className={styles.th}>Time</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((row, i) => (
          <tr key={i}>
            <td className={styles.td}>{row.user}</td>
            <td className={styles.td}>
              <span className={`${styles.status} ${styles[row.type] || ''}`}>
                {icons[row.type]} {row.action}
              </span>
            </td>
            <td className={styles.td}>{row.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

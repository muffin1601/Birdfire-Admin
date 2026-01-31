import styles from './RecentActivity.module.css';
import { UserPlus, ShoppingBag, Edit3 } from 'lucide-react';

const rows = [
  { user: 'Sana', action: 'Created order', time: '2 min ago', type: 'order' },
  { user: 'Admin', action: 'Updated product', time: '10 min ago', type: 'edit' },
  { user: 'Muffin', action: 'Signed up', time: '1 hour ago', type: 'user' },
];

const icons: any = {
  order: <ShoppingBag size={14} />,
  edit: <Edit3 size={14} />,
  user: <UserPlus size={14} />,
};

export default function RecentActivity() {
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
        {rows.map((row, i) => (
          <tr key={i}>
            <td className={styles.td}>{row.user}</td>
            <td className={styles.td}>
              <span className={`${styles.status} ${styles[row.type]}`}>
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

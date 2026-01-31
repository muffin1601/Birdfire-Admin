'use client';

import styles from './Topbar.module.css';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();

    // Redirect to login page
    router.replace('/login');
    router.refresh(); // ensures server components re-run
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <span className={styles.pageTitle}>Welcome Admin</span>
      </div>

      <div className={styles.right}>
        <button
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

import { requireAdmin } from '@/lib/auth/requireAdmin';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Right side (Topbar + Content) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Topbar */}
        <Topbar />

        {/* Main content */}
        <main
          style={{
            flexGrow: 1,
            padding: '1rem',
            color: '#ffffff',
            overflowY: 'auto',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

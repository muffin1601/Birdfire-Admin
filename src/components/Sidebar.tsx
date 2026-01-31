'use client';

import styles from './Sidebar.module.css';

const navSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Management',
    items: [
     
      { label: 'Categories', href: '/categories' },
      { label: 'Products', href: '/products' },
       { label: 'Orders', href: '/orders' },
      { label: 'Users', href: '/users' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/settings' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Logo section */}
      <div className={styles.brand}>
        <img
          src="/LOGO-W.png"
          alt="Logo"
          className={styles.logo}
        />
        {/* <span className={styles.brandName}>Admin Console</span> */}
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navSections.map((section) => (
          <div key={section.title} className={styles.section}>
            <span className={styles.sectionTitle}>
              {section.title}
            </span>

            {section.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.navItem}
              >
                {item.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

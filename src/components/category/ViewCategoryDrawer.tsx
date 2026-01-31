'use client';

import styles from './ViewCategoryDrawer.module.css';

type Props = {
  open: boolean;
  category?: any;
  onClose: () => void;
};

export default function ViewCategoryDrawer({
  open,
  category,
  onClose,
}: Props) {
  if (!open || !category) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className={styles.header}>
          <h2>View Category</h2>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className={styles.body}>
          {category.image_url && (
            <img
              src={category.image_url}
              alt={category.name}
              className={styles.image}
            />
          )}

          <div className={styles.field}>
            <label>Name</label>
            <p>{category.name}</p>
          </div>

          <div className={styles.field}>
            <label>Slug</label>
            <p>{category.slug}</p>
          </div>

          <div className={styles.field}>
            <label>Status</label>
            <span
              className={`${styles.status} ${
                category.is_active
                  ? styles.active
                  : styles.inactive
              }`}
            >
              {category.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {category.description && (
            <div className={styles.field}>
              <label>Description</label>
              <p>{category.description}</p>
            </div>
          )}

          <div className={styles.field}>
            <label>Products</label>
            <p>{category.product_count ?? 0}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

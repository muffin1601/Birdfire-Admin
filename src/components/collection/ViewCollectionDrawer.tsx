'use client';

import styles from './ViewCollectionDrawer.module.css';

type Props = {
  open: boolean;
  collection?: any;
  onClose: () => void;
};

export default function ViewCollectionDrawer({
  open,
  collection,
  onClose,
}: Props) {
  if (!open || !collection) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className={styles.header}>
          <h2>View Collection</h2>
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
          {collection.image_url && (
            <img
              src={collection.image_url}
              alt={collection.name}
              className={styles.image}
            />
          )}

          <div className={styles.field}>
            <label>Name</label>
            <p>{collection.name}</p>
          </div>

          <div className={styles.field}>
            <label>Slug</label>
            <p>{collection.slug}</p>
          </div>

          <div className={styles.field}>
            <label>Status</label>
            <span
              className={`${styles.status} ${
                collection.is_active
                  ? styles.active
                  : styles.inactive
              }`}
            >
              {collection.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {collection.description && (
            <div className={styles.field}>
              <label>Description</label>
              <p>{collection.description}</p>
            </div>
          )}

          <div className={styles.field}>
            <label>Products</label>
            <p>{collection.product_count ?? 0}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

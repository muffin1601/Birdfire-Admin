'use client';

import styles from './BrandCard.module.css';

type Props = {
  brand: any;
  onEdit?: (brand: any) => void;
  onDelete?: (brand: any) => void;
};

export default function BrandCard({
  brand,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.logoContainer}>
        {brand.logo_url ? (
          <img src={brand.logo_url} alt={brand.name} className={styles.logo} />
        ) : (
          <div className={styles.logoPlaceholder}>{brand.name?.[0]}</div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{brand.name}</h3>
        <p className={styles.slug}>{brand.slug}</p>
        <span className={`${styles.status} ${brand.is_active ? styles.active : styles.inactive}`}>
          {brand.is_active ? 'Active' : 'Inactive'}
        </span>
        <p className={styles.count}>{brand.product_count || 0} products</p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit?.(brand)}
        >
          Edit
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${brand.name}?`)) {
              onDelete?.(brand);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

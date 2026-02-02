import styles from "./ProductPagination.module.css";

export default function ProductPagination({
  page,
  totalPages,
  onChange,
}: any) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ← Prev
      </button>

      <span className={styles.pageInfo}>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        className={styles.button}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}

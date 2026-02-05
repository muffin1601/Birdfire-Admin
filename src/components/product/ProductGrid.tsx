import styles from "./ProductGrid.module.css";
import {
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
} from "lucide-react";

export default function ProductGrid({
  products = [],
  onEdit,
  onDelete,
}: {
  products: any[];
  onEdit: (p: any) => void;
  onDelete: (p: any) => void;
}) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Status</th>
            <th>Last updated</th>
            <th>Actions</th> 
          </tr>
        </thead>

        <tbody>
          {products.map((p) => {
            const image = p.product_images?.find(
              (i: any) => i.is_primary
            )?.image_url;

            const isActive = p.is_active;

            return (
              <tr key={p.id}>
                {/* PRODUCT */}
                <td>
                  <div className={styles.productCell}>
                    {image && (
                      <img
                        src={image}
                        alt={p.name}
                        className={styles.thumbnail}
                      />
                    )}

                    <div className={styles.meta}>
                      <div className={styles.nameRow}>
                        <span className={styles.name}>
                          {p.name}
                        </span>

                        <span
                          className={`${styles.statusInline} ${
                            isActive
                              ? styles.active
                              : styles.draft
                          }`}
                        >
                          {isActive ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Circle size={14} />
                          )}
                          {isActive ? "Active" : "Draft"}
                        </span>
                      </div>

                      {p.short_description && (
                        <div className={styles.desc}>
                          {p.short_description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className={styles.muted}>
                  {p.categories?.name ?? "—"}
                </td>

                {/* STATUS (kept for scanning) */}
                <td>
                  <span
                    className={`${styles.status} ${
                      isActive
                        ? styles.active
                        : styles.draft
                    }`}
                  >
                    {isActive ? "Active" : "Draft"}
                  </span>
                </td>

                {/* UPDATED */}
                <td className={styles.muted}>
                  {p.updated_at
                    ? new Date(
                        p.updated_at
                      ).toLocaleDateString()
                    : "—"}
                </td>

                {/* ACTIONS */}
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.edit}
                      onClick={() => onEdit(p)}
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      className={styles.delete}
                      onClick={() => {
                        const ok = window.confirm(
                          `Delete "${p.name}"?\n\nThis action cannot be undone.`
                        );

                        if (!ok) return;

                        onDelete(p);
                      }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {products.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.empty}>
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

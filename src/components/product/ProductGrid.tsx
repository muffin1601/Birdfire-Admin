import styles from "./ProductGrid.module.css";

export default function ProductGrid({
  products,
  onEdit,
  onDelete,
  selected,
  onToggleSelect,
}: any) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th className={styles.th}>
              <input
                className={styles.checkbox}
                type="checkbox"
                onChange={(e) =>
                  onToggleSelect("ALL", e.target.checked)
                }
              />
            </th>
            <th className={styles.th}>Product</th>
            <th className={styles.th}>Category</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Stock</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th} />
          </tr>
        </thead>

        <tbody className={styles.tbody}>
          {products.map((p: any) => {
            const image =
              p.product_images?.find((i: any) => i.is_primary)
                ?.image_url;

            return (
              <tr key={p.id} className={styles.tr}>
                <td className={styles.td}>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={(e) =>
                      onToggleSelect(p.id, e.target.checked)
                    }
                  />
                </td>

                <td className={styles.td}>
                  <div className={styles.productCell}>
                    {image && (
                      <img
                        className={styles.thumbnail}
                        src={image}
                        alt={p.name}
                      />
                    )}
                    <span className={styles.productName}>
                      {p.name}
                    </span>
                  </div>
                </td>

                <td className={styles.td}>
                  {p.categories?.name ?? "—"}
                </td>

                <td className={styles.td}>
                  ${p.price}
                </td>

                <td className={styles.td}>
                  <span
                    className={`${styles.stock} ${
                      p.stock > 0
                        ? styles.inStock
                        : styles.outStock
                    }`}
                  >
                    {p.stock > 0 ? "In stock" : "Out"}
                  </span>
                </td>

                <td className={styles.td}>
                  {p.is_active ? "Active" : "Draft"}
                </td>

                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => onEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => onDelete(p)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

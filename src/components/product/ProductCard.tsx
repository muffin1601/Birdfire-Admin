import styles from "./ProductCard.module.css";

export default function ProductCard({ product, onEdit }: any) {
  const image =
    product.product_images?.find((i: any) => i.is_primary)?.url;

  return (
    <div className={styles.card}>
      {image && <img src={image} alt={product.name} />}

      <h3>{product.name}</h3>
      <p>{product.categories?.name}</p>
      <p>${product.price}</p>

      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

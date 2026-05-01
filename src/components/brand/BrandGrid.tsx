'use client';

import BrandCard from './BrandCard';
import styles from './BrandGrid.module.css';

type Props = {
  brands: any[];
  onEdit?: (brand: any) => void;
  onDelete?: (brand: any) => void;
};

export default function BrandGrid({
  brands,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className={styles.grid}>
      {brands.map((brand) => (
        <BrandCard
          key={brand.id}
          brand={brand}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

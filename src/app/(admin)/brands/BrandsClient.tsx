'use client';

import { useState } from 'react';
import BrandDrawer from '@/components/brand/BrandDrawer';
import BrandGrid from '@/components/brand/BrandGrid';
import styles from './brands.module.css';

export default function BrandsClient({
  initialBrands,
}: {
  initialBrands: any[];
}) {
  const [brands, setBrands] = useState(initialBrands);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);

  async function refreshBrands() {
    const res = await fetch('/api/brands', {
      cache: 'no-store',
    });

    const data = await res.json();
    setBrands(Array.isArray(data) ? data : []);
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Manage Brands</h1>

        <button
          className={styles.addBtn}
          onClick={() => {
            setSelectedBrand(null);
            setDrawerOpen(true);
          }}
        >
          + Add Brand
        </button>
      </header>

      {/* Empty State */}
      {brands.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No brands yet</p>
          <span>Create your first brand to get started.</span>

          <button
            className={styles.emptyCta}
            onClick={() => {
              setSelectedBrand(null);
              setDrawerOpen(true);
            }}
          >
            + Create Brand
          </button>
        </div>
      ) : (
        <BrandGrid
          brands={brands}
          onEdit={(brand: any) => {
            setSelectedBrand(brand);
            setDrawerOpen(true);
          }}
          onDelete={async (brand: any) => {
            await fetch(`/api/brands/${brand.id}`, {
              method: 'DELETE',
            });
            await refreshBrands();
          }}
        />
      )}

      <BrandDrawer
        key={selectedBrand?.id ?? 'new'}
        open={drawerOpen}
        brand={selectedBrand}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedBrand(null);
        }}
        onSaved={async () => {
          await refreshBrands();
        }}
      />
    </div>
  );
}

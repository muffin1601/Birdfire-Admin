'use client';

import { useState } from 'react';
import ProductDrawer from '@/components/product/ProductDrawer';
import ProductFilters from '@/components/product/ProductFilters';
import ProductGrid from '@/components/product/ProductGrid';
import styles from './products.module.css';

export default function ProductsClient({
  initialProducts,
}: {
  initialProducts: any[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  async function refreshProducts() {
    const res = await fetch('/api/products', { cache: 'no-store' });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Manage Products</h1>

        <button
          className={styles.addBtn}
          onClick={() => {
            setSelectedProduct(null);
            setDrawerOpen(true);
          }}
        >
          + Add Product
        </button>
      </header>

      {/* Filters (products-only feature) */}
      <ProductFilters onChange={refreshProducts} />

      {/* Empty State */}
      {products.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No products yet</p>
          <span>
            Start by creating your first product.
          </span>

          <button
            className={styles.emptyCta}
            onClick={() => {
              setSelectedProduct(null);
              setDrawerOpen(true);
            }}
          >
            + Create Product
          </button>
        </div>
      ) : (
        <ProductGrid
          products={products}
          onEdit={(product: any) => {
            setSelectedProduct(product);
            setDrawerOpen(true);
          }}
          onDelete={async (product: any) => {
            await fetch(`/api/products/${product.id}`, {
              method: 'DELETE',
            });
            await refreshProducts();
          }}
        />
      )}

      {/* Drawer */}
      <ProductDrawer
        key={selectedProduct?.id ?? 'new'}
        open={drawerOpen}
        product={selectedProduct}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedProduct(null);
        }}
        onSaved={async () => {
          await refreshProducts();
        }}
      />
    </div>
  );
}

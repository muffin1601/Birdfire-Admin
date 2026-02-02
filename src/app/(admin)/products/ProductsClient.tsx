'use client';

import { useState, useEffect } from 'react';
import ProductDrawer from '@/components/product/ProductDrawer';
import ProductFilters from '@/components/product/ProductFilters';
import ProductGrid from '@/components/product/ProductGrid';
import styles from './products.module.css';
import ProductPagination from "@/components/product/ProductPagination";



export default function ProductsClient({
  initialProducts,
}: {
  initialProducts: any[];
}) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const [selected, setSelected] = useState<string[]>([]);

  // function handleToggleSelect(id: string | "ALL", checked: boolean) {
  //   if (id === "ALL") {
  //     setSelected(checked ? products.map((p) => p.id) : []);
  //     return;
  //   }

  //   setSelected((prev) =>
  //     checked ? [...prev, id] : prev.filter((x) => x !== id)
  //   );
  // }
  // useEffect(() => {
  //   setSelected([]);
  // }, [products]);

  useEffect(() => {
    setPage(1);
  }, [products]);


  async function refreshProducts(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters ?? {}).toString();
    const res = await fetch(`/api/products?${params}`, {
      cache: 'no-store',
    });

    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  }

  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  const paginatedProducts = products.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );


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

      {/* Filters */}
      <ProductFilters onChange={refreshProducts} />

      {/* Empty State */}
      {products.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No products yet</p>
          <span>Start by creating your first product.</span>

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
          products={paginatedProducts}
          // selected={selected}
          // onToggleSelect={handleToggleSelect}
          onEdit={(product: any) => {
            setSelectedProduct(product);
            setDrawerOpen(true);
          }}
          onDelete={async (product: any) => {
            await fetch(`/api/products/${product.id}`, {
              method: 'DELETE',
            });
            await refreshProducts();
            setSelected([]);
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
      <ProductPagination
        page={page}
        totalPages={totalPages}
        onChange={(p: number) => setPage(p)}
      />

    </div>
  );
}

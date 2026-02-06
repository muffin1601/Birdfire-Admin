'use client';

import { useState } from 'react';
import CategoryDrawer from '@/components/category/CategoryDrawer';
import ViewCategoryDrawer from '@/components/category/ViewCategoryDrawer';
import styles from './categories.module.css';
import dynamic from 'next/dynamic';

const CategoryGridClient = dynamic(
  () => import('@/components/category/CategoryGridClient'),
  { ssr: false }
);

export default function CategoriesClient({
  initialCategories,
}: {
  initialCategories: any[];
}) {
  const [categories, setCategories] =
    useState(initialCategories);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<any>(null);

  async function refreshCategories() {
    const res = await fetch('/api/categories', {
      cache: 'no-store',
    });

    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Manage Categories</h1>

        <button
          className={styles.addBtn}
          onClick={() => {
            setSelectedCategory(null);
            setDrawerOpen(true);
          }}
        >
          + Add Category
        </button>
      </header>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No categories yet</p>
          <span>
            Create your first category to get started.
          </span>

          <button
            className={styles.emptyCta}
            onClick={() => {
              setSelectedCategory(null);
              setDrawerOpen(true);
            }}
          >
            + Create Category
          </button>
        </div>
      ) : (
        <CategoryGridClient
          categories={categories}
          setCategories={setCategories}
          onEdit={(category: any) => {
            setSelectedCategory(category);
            setDrawerOpen(true);
          }}
          onDelete={async (category: any) => {
            await fetch(`/api/categories/${category.id}`, {
              method: 'DELETE',
            });
            await refreshCategories();
          }}
          onView={(category: any) => {
            setSelectedCategory(category);
            setViewOpen(true);
          }}
        />
      )}

      <CategoryDrawer
        key={selectedCategory?.id ?? 'new'}
        open={drawerOpen}
        category={selectedCategory}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCategory(null);
        }}
        onSaved={async () => {
          await refreshCategories();
        }}
      />

      {/* View Drawer */}
      <ViewCategoryDrawer
        open={viewOpen}
        category={selectedCategory}
        onClose={() => {
          setViewOpen(false);
          setSelectedCategory(null);
        }}
      />
    </div>
  );
}

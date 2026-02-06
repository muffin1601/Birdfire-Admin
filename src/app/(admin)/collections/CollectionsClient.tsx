'use client';

import { useState } from 'react';
import CollectionDrawer from '@/components/collection/CollectionDrawer';
import ViewCollectionDrawer from '@/components/collection/ViewCollectionDrawer';
import styles from './collections.module.css';
import dynamic from 'next/dynamic';

const CollectionGridClient = dynamic(
  () => import('@/components/collection/CollectionGridClient'),
  { ssr: false }
);

export default function CollectionsClient({
  initialCollections,
}: {
  initialCollections: any[];
}) {
  const [collections, setCollections] =
    useState(initialCollections);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<any>(null);

  async function refreshCollections() {
    const res = await fetch('/api/collections', {
      cache: 'no-store',
    });

    const data = await res.json();
    setCollections(Array.isArray(data) ? data : []);
  }

  // console.log("collections", initialCollections);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Manage Collections</h1>

        <button
          className={styles.addBtn}
          onClick={() => {
            setSelectedCollection(null);
            setDrawerOpen(true);
          }}
        >
          + Add Collection
        </button>
      </header>

      {/* Empty State */}
      {collections.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No collections yet</p>
          <span>
            Create your first collection to get started.
          </span>

          <button
            className={styles.emptyCta}
            onClick={() => {
              setSelectedCollection(null);
              setDrawerOpen(true);
            }}
          >
            + Create Collection
          </button>
        </div>
      ) : (
        <CollectionGridClient
          collections={collections}
          setCollections={setCollections}
          onEdit={(collection: any) => {
            setSelectedCollection(collection);
            setDrawerOpen(true);
          }}
          onDelete={async (collection: any) => {
            await fetch(`/api/collections/${collection.id}`, {
              method: 'DELETE',
            });
            await refreshCollections();
          }}
          onView={(collection: any) => {
            setSelectedCollection(collection);
            setViewOpen(true);
          }}
        />
      )}

      
      <CollectionDrawer
        key={selectedCollection?.id ?? 'new'}
        open={drawerOpen}
        collection={selectedCollection}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCollection(null);
        }}
        onSaved={async () => {
          await refreshCollections();
        }}
      />

      {/* View Drawer */}
      <ViewCollectionDrawer
        open={viewOpen}
        collection={selectedCollection}
        onClose={() => {
          setViewOpen(false);
          setSelectedCollection(null);
        }}
      />
    </div>
  );
}

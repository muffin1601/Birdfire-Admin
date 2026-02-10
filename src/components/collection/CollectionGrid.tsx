'use client';

import { useMemo, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import CollectionCard from './CollectionCard';
import styles from './CollectionGrid.module.css';

type Props = {
  collections: any[];
  setCollections: (c: any[]) => void;
  onEdit?: (collection: any) => void;
  onDelete?: (collection: any) => void;
  onView?: (collection: any) => void;
};

const PAGE_SIZE = 8;

export default function CollectionGrid({
  collections,
  setCollections,
  onEdit,
  onDelete,
  onView,
}: Props) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const sortedCollections = useMemo(
    () => [...collections].reverse(),
    [collections]
  );

  const filteredCollections = useMemo(() => {
    if (!query) return sortedCollections;
    return sortedCollections.filter(c =>
      c.name?.toLowerCase().includes(query.toLowerCase())
    );
  }, [sortedCollections, query]);

  const totalPages = Math.ceil(
    filteredCollections.length / PAGE_SIZE
  );

  const paginatedCollections = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCollections.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredCollections, page]);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const pageIds = paginatedCollections.map(c => c.id);
    const oldIndex = pageIds.indexOf(active.id);
    const newIndex = pageIds.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const updatedPage = arrayMove(
      paginatedCollections,
      oldIndex,
      newIndex
    );

    const updatedAll = [...sortedCollections];
    const globalStart = (page - 1) * PAGE_SIZE;

    updatedPage.forEach((item, i) => {
      updatedAll[globalStart + i] = item;
    });

    const finalList = [...updatedAll].reverse();
    setCollections(finalList);

    fetch('/api/collections/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        finalList.map((c, i) => ({
          id: c.id,
          sort_order: i,
        }))
      ),
    });
  }

  return (
    <>
      <div className={styles.searchWrap}>
        <input
          type="text"
          placeholder="Search collections…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={paginatedCollections.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.grid}>
            {paginatedCollections.map(collection => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Prev
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

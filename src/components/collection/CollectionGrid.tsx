'use client';

import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
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

export default function CollectionGrid({
  collections,
  setCollections,
  onEdit,
  onDelete,
  onView,
}: Props) {
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = collections.findIndex(
      (c) => c.id === active.id
    );
    const newIndex = collections.findIndex(
      (c) => c.id === over.id
    );

    const reordered = arrayMove(
      collections,
      oldIndex,
      newIndex
    );

    setCollections(reordered);

    fetch('/api/collections/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        reordered.map((c, i) => ({
          id: c.id,
          sort_order: i,
        }))
      ),
    });
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={collections.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.grid}>
          {collections.map((collection) => (
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
  );
}

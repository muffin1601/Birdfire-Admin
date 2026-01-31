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

import CategoryCard from './CategoryCard';
import styles from './CategoryGrid.module.css';

type Props = {
  categories: any[];
  setCategories: (c: any[]) => void;
  onEdit?: (category: any) => void;
  onDelete?: (category: any) => void;
  onView?: (category: any) => void;
};

export default function CategoryGrid({
  categories,
  setCategories,
  onEdit,
  onDelete,
  onView,
}: Props) {
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex(
      (c) => c.id === active.id
    );
    const newIndex = categories.findIndex(
      (c) => c.id === over.id
    );

    const reordered = arrayMove(
      categories,
      oldIndex,
      newIndex
    );

    setCategories(reordered);

    fetch('/api/categories/reorder', {
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
        items={categories.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.grid}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
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

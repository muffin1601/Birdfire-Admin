'use client';

import { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import {
  GripVertical,
  Pencil,
  Trash2,
  Eye,
  Package,
} from 'lucide-react';
import styles from './categoryCard.module.css';


type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  product_count?: number;
};

type Props = {
  category: Category;
  onView?: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
};

export default function CategoryCard({
  category,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleDelete() {
    const ok = window.confirm(
      `Delete category "${category.name}"?\nThis action cannot be undone.`
    );
    if (ok) onDelete?.(category);
  }




  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`${styles.card} ${isDragging ? styles.cardDragging : ''
          }`}
        tabIndex={0}
      >
        {/* Drag Handle */}
        <div
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical size={18} />
        </div>

        {/* Image */}
        <div className={styles.imageWrap}>
          {category.image_url ? (
            <img src={category.image_url} alt={category.name} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <h3>{category.name}</h3>
            </div>

            {category.description && (
              <p className={styles.description}>
                {category.description}
              </p>
            )}
          </div>


          <div className={styles.meta}>
            <span
              className={`${styles.status} ${category.is_active
                  ? styles.active
                  : styles.inactive
                }`}
            >
              {category.is_active ? 'Active' : 'Inactive'}
            </span>
            <span className={styles.products}>
              <Package size={14} />
              {category.product_count ?? 0} products
            </span>

            {/* Actions */}
            <div className={styles.actions}>
              {/* Actions */}
              <div className={styles.actions}>
                <button
                  type="button"
                  aria-label="View category"
                  onClick={() => onView?.(category)}
                >
                  <Eye size={16} />
                </button>
              </div>

              <button
                type="button"
                aria-label="Edit category"
                onClick={() => onEdit?.(category)}
              >
                <Pencil size={16} />
              </button>

              <button
                type="button"
                aria-label="Delete category"
                className={styles.danger}
                onClick={handleDelete}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}

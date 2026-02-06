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
import styles from './collectionCard.module.css';


type Collection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  product_count?: number;
};

type Props = {
  collection: Collection;
  onView?: (collection: Collection) => void;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collection: Collection) => void;
};

function truncateWords(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '…';
}


export default function CollectionCard({
  collection,
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
  } = useSortable({ id: collection.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleDelete() {
    const ok = window.confirm(
      `Delete collection "${collection.name}"?\nThis action cannot be undone.`
    );
    if (ok) onDelete?.(collection);
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
          {collection.image_url ? (
            <img src={collection.image_url} alt={collection.name} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <h3>{collection.name}</h3>
            </div>

            {collection.description && (
              <p className={styles.description}>
                {truncateWords(collection.description, 40)}
              </p>
            )}
          </div>


          <div className={styles.meta}>
            <span
              className={`${styles.status} ${collection.is_active
                  ? styles.active
                  : styles.inactive
                }`}
            >
              {collection.is_active ? 'Active' : 'Inactive'}
            </span>
            <span className={styles.products}>
              <Package size={14} />
              {collection.product_count ?? 0} products
            </span>

            {/* Actions */}
            <div className={styles.actions}>
              {/* Actions */}
              <div className={styles.actions}>
                <button
                  type="button"
                  aria-label="View collection"
                  onClick={() => onView?.(collection)}
                >
                  <Eye size={16} />
                </button>
              </div>

              <button
                type="button"
                aria-label="Edit collection"
                onClick={() => onEdit?.(collection)}
              >
                <Pencil size={16} />
              </button>

              <button
                type="button"
                aria-label="Delete collection"
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

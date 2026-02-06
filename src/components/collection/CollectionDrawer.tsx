'use client';

import { useEffect, useState } from 'react';
import styles from './CollectionDrawer.module.css';
import { uploadCollectionImage } from '@/lib/uploads/uploadCollectionImage';

type Props = {
  open: boolean;
  onClose: () => void;
  collection?: any;
  onSaved: () => void;
};

export default function CollectionDrawer({
  open,
  onClose,
  collection,
  onSaved,
}: Props) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (collection) {
      setForm(collection);
    }
  }, [collection]);

  if (!open) return null;

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      await fetch(
        collection ? `/api/collections/${collection.id}` : '/api/collections',
        {
          method: collection ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      onSaved();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(file: File) {
    try {
      setLoading(true);
      const url = await uploadCollectionImage(file);
      updateField('image_url', url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        {/* Header */}
        <header className={styles.header}>
          <h2 className={styles.title}>
            {collection ? 'Edit Collection' : 'New Collection'}
          </h2>
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.field}>
            <label>Name</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                updateField('name', name);
                updateField(
                  'slug',
                  name.toLowerCase().replace(/\s+/g, '-')
                );
              }}
              placeholder="Collection name"
            />
          </div>

          <div className={styles.field}>
            <label>Slug</label>
            <input
              className={styles.input}
              value={form.slug}
              disabled
            />
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) =>
                updateField('description', e.target.value)
              }
              placeholder="Optional description"
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldInline}>
              <label>Status</label>
              <span className={styles.helper}>
                {form.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <button
              type="button"
              className={`${styles.toggle} ${form.is_active ? styles.on : styles.off
                }`}
              onClick={() => updateField('is_active', !form.is_active)}
              aria-pressed={form.is_active}
            >
              <span className={styles.knob} />
            </button>
          </div>

          <div className={styles.field}>
            <label>Collection Image</label>

            <div className={styles.imageUpload}>
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt="Collection preview"
                  className={styles.preview}
                />
              ) : (
                <span className={styles.placeholder}>
                  Click to upload image
                </span>
              )}

              <input
                type="file"
                accept="image/*"
                disabled={loading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <button
            className={styles.save}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Saving…' : 'Save Collection'}
          </button>
        </footer>
      </div>
    </div>
  );
}

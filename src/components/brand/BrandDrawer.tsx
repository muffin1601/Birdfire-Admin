'use client';

import { useEffect, useState } from 'react';
import styles from './BrandDrawer.module.css';
import { supabase } from '@/lib/supabase/client';

type Props = {
  open: boolean;
  onClose: () => void;
  brand?: any;
  onSaved: () => void;
};

export default function BrandDrawer({
  open,
  onClose,
  brand,
  onSaved,
}: Props) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    logo_url: '',
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (brand) {
      setForm({
        ...brand,
        description: brand.description || "",
        is_active: Boolean(brand.is_active),
      });
    } else {
      setForm({
        name: '',
        slug: '',
        description: '',
        logo_url: '',
        is_active: true,
      });
    }
  }, [brand, open]);

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

      const res = await fetch(
        brand ? `/api/brands/${brand.id}` : '/api/brands',
        {
          method: brand ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save brand');
      }

      onSaved();
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoUpload(file: File) {
    try {
      setLoading(true);
      const ext = file.name.split('.').pop();
      const filePath = `brands/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('brand-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('brand-logos')
        .getPublicUrl(filePath);

      updateField('logo_url', data.publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            {brand ? 'Edit Brand' : 'New Brand'}
          </h2>
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        </header>

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
                  name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                );
              }}
              placeholder="Brand name"
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
            >
              <span className={styles.knob} />
            </button>
          </div>

          <div className={styles.field}>
            <label>Brand Logo</label>

            <div className={styles.imageUpload}>
              {form.logo_url ? (
                <img
                  src={form.logo_url}
                  alt="Brand logo preview"
                  className={styles.preview}
                />
              ) : (
                <span className={styles.placeholder}>
                  Click to upload logo
                </span>
              )}

              <input
                type="file"
                accept="image/*"
                disabled={loading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                }}
              />
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <button
            className={styles.save}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Saving…' : 'Save Brand'}
          </button>
        </footer>
      </div>
    </div>
  );
}

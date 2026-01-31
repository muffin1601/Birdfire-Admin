"use client";

import { useEffect, useState } from "react";
import styles from "./ProductDrawer.module.css";
import ProductImagesUploader from "./ProductImagesUploader";

type Props = {
  open: boolean;
  onClose: () => void;
  product?: any;
  onSaved: () => void;
};

const EMPTY_FORM = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  price: "",
  compare_price: "",
  stock: 0,
  category_id: "",
  is_active: false, // 👈 default DRAFT
  is_featured: false,
  is_new: false,
};

export default function ProductDrawer({
  open,
  onClose,
  product,
  onSaved,
}: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [showMedia, setShowMedia] = useState(false); // 👈 toggle media

  /* Load product safely */
  useEffect(() => {
    if (product) {
      setForm({ ...EMPTY_FORM, ...product });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [product]);

  /* Load categories */
  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/categories", {
        cache: "no-store",
      });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    }
    loadCategories();
  }, []);

  if (!open) return null;

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(isDraft = false) {
    try {
      setLoading(true);

      await fetch(
        product ? `/api/products/${product.id}` : "/api/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            is_active: isDraft ? false : form.is_active,
            availability_status:
              Number(form.stock) > 0
                ? "in_stock"
                : "out_of_stock",
          }),
        }
      );

      onSaved();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        {/* HEADER */}
        <header className={styles.header}>
          <h2 className={styles.title}>
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        </header>

        {/* BODY */}
        <div className={styles.body}>
          {/* Category */}
          <div className={styles.field}>
            <label>Category</label>
            <select
              className={styles.input}
              value={form.category_id}
              onChange={(e) =>
                updateField("category_id", e.target.value)
              }
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className={styles.field}>
            <label>Name</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                updateField("name", name);
                updateField(
                  "slug",
                  name.toLowerCase().replace(/\s+/g, "-")
                );
              }}
            />
          </div>

          {/* Slug */}
          <div className={styles.field}>
            <label>Slug</label>
            <input
              className={styles.input}
              value={form.slug}
              disabled
            />
          </div>

          {/* Descriptions */}
          <div className={styles.field}>
            <label>Short description</label>
            <textarea
              className={styles.textarea}
              value={form.short_description}
              onChange={(e) =>
                updateField("short_description", e.target.value)
              }
            />
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
            />
          </div>

          {/* Pricing */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldInline}>
              <label>Price</label>
              <input
                className={styles.input}
                type="number"
                value={form.price}
                onChange={(e) =>
                  updateField("price", e.target.value)
                }
              />
            </div>

            <div className={styles.fieldInline}>
              <label>Compare price</label>
              <input
                className={styles.input}
                type="number"
                value={form.compare_price}
                onChange={(e) =>
                  updateField("compare_price", e.target.value)
                }
              />
            </div>
          </div>

          {/* Stock */}
          <div className={styles.field}>
            <label>Stock</label>
            <input
              className={styles.input}
              type="number"
              value={form.stock}
              onChange={(e) =>
                updateField("stock", Number(e.target.value))
              }
            />
          </div>

          {/* Toggles */}
          {[
            ["Active", "is_active"],
            ["Featured", "is_featured"],
            ["New", "is_new"],
          ].map(([label, key]) => (
            <div className={styles.fieldRow} key={key}>
              <div className={styles.fieldInline}>
                <label>{label}</label>
                <span className={styles.helper}>
                  {(form as any)[key] ? "Yes" : "No"}
                </span>
              </div>

              <button
                type="button"
                className={`${styles.toggle} ${
                  (form as any)[key]
                    ? styles.on
                    : styles.off
                }`}
                onClick={() =>
                  updateField(
                    key as keyof typeof form,
                    !(form as any)[key]
                  )
                }
              >
                <span className={styles.knob} />
              </button>
            </div>
          ))}

          {/* MEDIA TOGGLE */}
          <div className={styles.mediaToggle}>
            <button
              type="button"
              className={styles.mediaBtn}
              onClick={() => setShowMedia((v) => !v)}
            >
              {showMedia ? "Hide Media ▲" : "Add Media ▼"}
            </button>
          </div>

          {/* MEDIA SECTION */}
          {showMedia && product?.id && (
            <div className={styles.mediaSection}>
              <ProductImagesUploader
                productId={product.id}
                mode="primary"
              />
              <ProductImagesUploader
                productId={product.id}
                mode="secondary"
              />
              <ProductImagesUploader
                productId={product.id}
                mode="gallery"
              />
            </div>
          )}

          {showMedia && !product?.id && (
            <p className={styles.helper}>
              Save product first to upload images.
            </p>
          )}
        </div>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <button
            className={styles.saveSecondary}
            disabled={loading}
            onClick={() => handleSubmit(true)}
          >
            Save as Draft
          </button>

          <button
            className={styles.save}
            disabled={loading}
            onClick={() => handleSubmit(false)}
          >
            {loading ? "Saving…" : "Publish Product"}
          </button>
        </footer>
      </div>
    </div>
  );
}

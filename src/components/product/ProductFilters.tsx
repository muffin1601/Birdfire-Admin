"use client";

import { useEffect, useState } from "react";
import styles from "./ProductFilters.module.css";
import {
  Search,
  Filter,
  Layers,
  CheckCircle2,
} from "lucide-react";

type Props = {
  onChange: (filters: Record<string, string>) => void;
};

export default function ProductFilters({ onChange }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [brand, setBrand] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  /* Load categories */
  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []));
  }, []);

  /* Load collections */
  useEffect(() => {
    fetch("/api/collections", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCollections(Array.isArray(d) ? d : []));
  }, []);

  /* Load brands */
  useEffect(() => {
    fetch("/api/brands", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setBrands(Array.isArray(d) ? d : []));
  }, []);


  function apply(overrides?: Partial<Record<string, string>>) {
    const filters: Record<string, string> = {
      ...(query ? { q: query } : {}),
      ...(status ? { active: status } : {}),
      ...(category ? { category } : {}),
      ...(collection ? { collection } : {}),
      ...(brand ? { brand } : {}),
      ...overrides,
    };

    onChange(filters);
  }


  return (
    <div className={styles.filters}>
      {/* Search */}
      <div className={styles.inputWrap}>
        <Search size={16} className={styles.icon} />
        <input
          className={styles.search}
          type="text"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply();
          }}
        />
      </div>

      {/* Status */}
      <div className={styles.selectWrap}>
        <CheckCircle2 size={16} className={styles.icon} />
        <select
          className={styles.select}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            apply({ active: e.target.value || "" });
          }}
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Draft</option>
        </select>
      </div>



      {/* Category */}
      <div className={styles.selectWrap}>
        <Layers size={16} className={styles.icon} />
        <select
          className={styles.select}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            apply({ category: e.target.value || "" });
          }}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Collection */}
      <div className={styles.selectWrap}>
        <Layers size={16} className={styles.icon} />
        <select
          className={styles.select}
          value={collection}
          onChange={(e) => {
            setCollection(e.target.value);
            apply({ collection: e.target.value || "" });
          }}
        >
          <option value="">All collections</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className={styles.selectWrap}>
        <Layers size={16} className={styles.icon} />
        <select
          className={styles.select}
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            apply({ brand: e.target.value || "" });
          }}
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Apply */}
      <button className={styles.applyBtn} onClick={() => apply()}>
        <Filter size={16} />
        Apply
      </button>
    </div>
  );
}

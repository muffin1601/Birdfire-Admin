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
  const [categories, setCategories] = useState<any[]>([]);

  /* Load categories */
  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []));
  }, []);

  function apply(overrides?: Partial<Record<string, string>>) {
    const filters: Record<string, string> = {
      ...(query ? { q: query } : {}),
      ...(status ? { active: status } : {}),
      ...(category ? { category } : {}),
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

      {/* Apply */}
      <button className={styles.applyBtn} onClick={() => apply()}>
        <Filter size={16} />
        Apply
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import styles from "./ProductFilters.module.css";

export default function ProductFilters({ onApply }: any) {
  const [active, setActive] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function apply() {
    const params = new URLSearchParams();

    if (active) params.set("active", active);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    onApply(params.toString());
  }

  return (
    <div className={styles.filters}>
      <select
        className={styles.select}
        value={active}
        onChange={(e) => setActive(e.target.value)}
      >
        <option value="">All</option>
        <option value="true">Active</option>
        <option value="false">Draft</option>
      </select>

      <input
        className={styles.input}
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <input
        className={styles.input}
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <button
        className={styles.applyBtn}
        onClick={apply}
      >
        Apply
      </button>
    </div>
  );
}

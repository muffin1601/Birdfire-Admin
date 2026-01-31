"use client";

import { useEffect, useState } from "react";
import styles from "./ProductImagesUploader.module.css";
import { uploadProductImage } from "@/lib/uploads/uploadProductImage";
import { supabase } from "@/lib/supabase/client";

type Props = {
  productId: string;
  mode: "primary" | "secondary" | "gallery";
};

export default function ProductImagesUploader({
  productId,
  mode,
}: Props) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadImages() {
    const { data } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .eq("image_type", mode)
      .order("sort_order", { ascending: true });

    setImages(data ?? []);
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    await uploadProductImage({
      file,
      productId,
      mode,
      altText: "Product image",
    });
    await loadImages();
    setLoading(false);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>
          {mode === "primary"
            ? "Primary Image"
            : mode === "secondary"
            ? "Secondary Image"
            : "Gallery Images"}
        </span>
      </div>

      <div className={styles.grid}>
        {images.map((img) => (
          <div key={img.id} className={styles.thumb}>
            <img src={img.image_url} alt="" />
          </div>
        ))}

        {(mode === "gallery" || images.length === 0) && (
          <label className={styles.uploadBox}>
            <span>
              {loading ? "Uploading…" : "+ Add image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={loading}
            />
          </label>
        )}
      </div>

      <span className={styles.helper}>
        {mode === "gallery"
          ? "Multiple images allowed"
          : "Only one image allowed"}
      </span>
    </div>
  );
}

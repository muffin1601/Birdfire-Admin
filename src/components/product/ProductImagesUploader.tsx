"use client";

import { useEffect, useState } from "react";
import styles from "./ProductImagesUploader.module.css";
import { uploadProductImage } from "@/lib/uploads/uploadProductImage";
import { supabase } from "@/lib/supabase/client";

type Props = {
  productId: string;
  mode: "primary" | "gallery";
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
    if (productId) loadImages();
  }, [productId, mode]);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    // 🔒 Enforce ONE primary image
    if (mode === "primary" && images.length > 0) {
      alert("Only one primary image is allowed.");
      setLoading(false);
      return;
    }

    await uploadProductImage({
      file,
      productId,
      mode,
      altText: "Product image",
    });

    await loadImages();
    setLoading(false);
  }

  async function handleDelete(img: any) {
    // delete db row
    await supabase
      .from("product_images")
      .delete()
      .eq("id", img.id);

    // delete file from storage
    const path = img.image_url.split("/product-images/")[1];
    if (path) {
      await supabase.storage
        .from("product-images")
        .remove([path]);
    }

    await loadImages();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {mode === "primary" ? "Primary Image" : "Gallery Images"}
      </div>

      <div className={styles.grid}>
        {images.map((img) => (
          <div key={img.id} className={styles.thumb}>
            <img src={img.image_url} alt="" />
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(img)}
            >
              ✕
            </button>
          </div>
        ))}

        {(mode === "gallery" || images.length === 0) && (
          <label className={styles.uploadBox}>
            {loading ? "Uploading…" : "+ Add image"}
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
          : "Only one primary image"}
      </span>
    </div>
  );
}

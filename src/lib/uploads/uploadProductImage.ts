import { supabase } from "@/lib/supabase/client";

type UploadArgs = {
  file: File;
  productId: string;
  mode: "primary" | "secondary" | "gallery";
  altText?: string;
};

export async function uploadProductImage({
  file,
  productId,
  mode,
  altText,
}: UploadArgs) {
  const ext = file.name.split(".").pop();
  const filePath = `products/${productId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  const imageUrl = data.publicUrl;

  // 1️⃣ insert image row
  const { data: image, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      image_url: imageUrl,
      alt_text: altText ?? "",
      is_primary: mode === "primary",
      image_type: mode,
    })
    .select()
    .single();

  if (error) throw error;

  // 2️⃣ wire product primary / secondary automatically
  if (mode === "primary") {
    await supabase
      .from("products")
      .update({ primary_image_id: image.id })
      .eq("id", productId);
  }

  if (mode === "secondary") {
    await supabase
      .from("products")
      .update({ secondary_image_id: image.id })
      .eq("id", productId);
  }

  return image;
}

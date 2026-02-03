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
  const path = `products/${productId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  const { data: image, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      image_url: data.publicUrl,
      alt_text: altText ?? "",
      image_type: mode,
      is_primary: mode === "primary",
    })
    .select()
    .single();

  if (error) throw error;

  return image;
}

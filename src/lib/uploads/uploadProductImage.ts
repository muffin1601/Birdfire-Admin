import { supabase } from "@/lib/supabase/client";

type UploadArgs = {
  file: File;
  productId: string;
  mode: "primary" | "secondary" | "gallery";
  altText?: string;
};


export async function uploadTempProductImage(file: File) {
  const ext = file.name.split(".").pop();
  const filePath = `temp/products/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

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

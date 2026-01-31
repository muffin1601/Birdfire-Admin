import { createSupabaseServer } from "@/lib/supabase/server";
import ProductsClient from "./ProductsClient";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function ProductsPage() {
  await requireAdmin();

  const supabase = createSupabaseServer();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      product_images (
        id,
        image_url,
        image_type,
        is_primary
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <ProductsClient initialProducts={products ?? []} />
  );
}

import { createSupabaseServer } from "@/lib/supabase/server";
import ProductsClient from "./ProductsClient";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await requireAdmin();

  const supabase = createSupabaseServer();

  // Fetch products with their relationships
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      collections(name),
      brands(name),
      product_images (
        id,
        image_url,
        image_type,
        is_primary
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products fetch error with brands:", error.message);
    
    // Fallback: Fetch without brands join if relationship is missing
    const { data: fallbackProducts } = await supabase
      .from("products")
      .select(`
        *,
        categories(name),
        collections(name),
        product_images (
          id,
          image_url,
          image_type,
          is_primary
        )
      `)
      .order("created_at", { ascending: false });
      
    return <ProductsClient initialProducts={fallbackProducts ?? []} />;
  }

  return <ProductsClient initialProducts={products ?? []} />;
}

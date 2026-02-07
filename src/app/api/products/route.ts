import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(req: Request) {
  await requireAdmin();

  const supabase = createSupabaseServer();
  const { searchParams } = new URL(req.url);

  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories(name),
      collections(name),
      product_images:product_images!product_images_product_id_fkey (
        id,
        image_url,
        image_type,
        is_primary,
        sort_order
      )
    `
    )
    .order("created_at", { ascending: false });

  /*  Search */
  const q = searchParams.get("q");
  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  /* Status filter */
  const active = searchParams.get("active");
  if (active === "true") {
    query = query.eq("is_active", true);
  }
  if (active === "false") {
    query = query.eq("is_active", false);
  }

  /* Category filter */
  const category = searchParams.get("category");
  if (category) {
    query = query.eq("category_id", category);
  }

  const collection = searchParams.get("collection");
  if (collection) {
    query = query.eq("collection_id", collection);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  await requireAdmin();

  const supabase = createSupabaseServer();
  const body = await req.json();

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Product insert error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}

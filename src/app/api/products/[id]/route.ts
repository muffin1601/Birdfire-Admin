import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const supabase = createSupabaseServer();
  const body = await req.json();
  const { id } = await params;

  
  const updateData = {
    name: body.name,
    slug: body.slug,
    short_description: body.short_description,
    description: body.description,
    category_id: body.category_id || null,
    stock: Number(body.stock) || 0,

    price:
      body.price === null || body.price === undefined
        ? null
        : Number(body.price),

    compare_price:
      body.compare_price === null || body.compare_price === undefined
        ? null
        : Number(body.compare_price),

    is_active: Boolean(body.is_active),
    is_featured: Boolean(body.is_featured),
    is_new: Boolean(body.is_new),

    availability_status:
      Number(body.stock) > 0 ? "in_stock" : "out_of_stock",

    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const supabase = createSupabaseServer();

  const { id } = await params; // ✅ REQUIRED

  await supabase.from("product_images").delete().eq("product_id", id);
  await supabase.from("products").delete().eq("id", id);

  return NextResponse.json({ success: true });
}

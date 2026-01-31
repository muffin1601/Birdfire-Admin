import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(req: Request) {
  // 🔐 Admin guard (redirects if not admin)
  await requireAdmin();

  const supabase = createSupabaseServer();
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const active = searchParams.get("active");
  const search = searchParams.get("search");

  let query = supabase
    .from("products")
    .select(`
      *,
      categories(name),
      product_images (
        id,
        url,
        is_primary
      )
    `)
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category_id", category);
  if (active !== null) query = query.eq("is_active", active === "true");
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
 
  await requireAdmin();

  const supabase = createSupabaseServer();
  const body = await req.json();

  const { data, error } = await supabase
    .from("products")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

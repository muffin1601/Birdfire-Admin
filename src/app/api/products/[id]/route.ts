import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET() {
  await requireAdmin();

  const supabase = createSupabaseServer();

  const { data, error } = await supabase
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
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}

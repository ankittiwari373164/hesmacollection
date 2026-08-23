import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { supabaseAdmin, supabaseAdminEnabled } from "@/lib/supabaseAdmin";

function toRow(p) {
  return {
    name: p.name,
    category: p.category,
    price: p.price,
    mrp: p.mrp,
    images: p.images,
    description: p.description,
    sku: p.sku,
    stock: p.stock,
    featured: p.featured,
    new_arrival: p.newArrival,
    buy1get2: p.buy1get2,
  };
}

export async function POST(req) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!supabaseAdminEnabled) return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 501 });
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from("products").insert(toRow(body)).select().single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!supabaseAdminEnabled) return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 501 });
  const body = await req.json();
  const { id, ...rest } = body;
  const { data, error } = await supabaseAdmin.from("products").update(toRow(rest)).eq("id", id).select().single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!supabaseAdminEnabled) return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 501 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

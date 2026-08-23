import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { supabaseAdmin, supabaseAdminEnabled } from "@/lib/supabaseAdmin";

export async function POST(req) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!supabaseAdminEnabled) return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 501 });
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("coupons")
    .insert({ code: body.code.toUpperCase(), type: body.type, value: body.value, min_order: body.minOrder, active: body.active, description: body.description })
    .select()
    .single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!supabaseAdminEnabled) return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 501 });
  const { code, patch } = await req.json();
  const row = {};
  if ("active" in patch) row.active = patch.active;
  if ("value" in patch) row.value = patch.value;
  if ("minOrder" in patch) row.min_order = patch.minOrder;
  if ("description" in patch) row.description = patch.description;
  const { data, error } = await supabaseAdmin.from("coupons").update(row).eq("code", code).select().single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!supabaseAdminEnabled) return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 501 });
  const { code } = await req.json();
  const { error } = await supabaseAdmin.from("coupons").delete().eq("code", code);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

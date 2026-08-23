import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { supabaseAdmin, supabaseAdminEnabled } from "@/lib/supabaseAdmin";

export async function PUT(req) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!supabaseAdminEnabled) return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 501 });
  const { id, status } = await req.json();
  const { data, error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id).select().single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

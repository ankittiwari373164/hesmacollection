import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseAdminEnabled } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { name, email, message } = await req.json();
  if (!supabaseAdminEnabled) {
    // No database configured yet — accept gracefully so the form still works in local/demo mode.
    return NextResponse.json({ ok: true, stored: false });
  }
  const { error } = await supabaseAdmin.from("messages").insert({ name, email, message });
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, stored: true });
}

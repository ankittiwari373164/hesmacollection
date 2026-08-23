import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { supabaseAdmin, supabaseAdminEnabled } from "@/lib/supabaseAdmin";

export async function PUT(req) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!supabaseAdminEnabled) return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 501 });
  const s = await req.json();
  const row = {
    store_name: s.storeName,
    support_email: s.supportEmail,
    support_phone: s.supportPhone,
    address: s.address,
    cod_enabled: s.codEnabled,
    cod_extra_fee: s.codExtraFee,
    online_payment_enabled: s.onlinePaymentEnabled,
    payment_provider: s.paymentProvider,
    razorpay_key_id: s.razorpayKeyId,
    stripe_publishable_key: s.stripePublishableKey,
    free_shipping_threshold: s.freeShippingThreshold,
    shipping_fee: s.shippingFee,
  };
  const { data, error } = await supabaseAdmin.from("settings").update(row).eq("id", 1).select().single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

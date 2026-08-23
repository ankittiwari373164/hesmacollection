import { NextResponse } from "next/server";
import { signToken, ADMIN_COOKIE } from "@/lib/adminAuth";

export async function POST(req) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD || "hesma@admin";

  if (password !== expected) {
    return NextResponse.json({ ok: false, message: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, signToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}

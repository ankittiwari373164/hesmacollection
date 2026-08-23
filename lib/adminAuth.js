import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "hesma_admin";

function secret() {
  return process.env.ADMIN_PASSWORD || "hesma@admin";
}

export function signToken() {
  return crypto.createHmac("sha256", secret()).update("admin-session").digest("hex");
}

export async function isAdminRequest() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token && token === signToken();
}

export const ADMIN_COOKIE = COOKIE_NAME;

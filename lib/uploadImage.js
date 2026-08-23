import { supabase, supabaseEnabled } from "./supabaseClient";

const MAX_FILE_MB = 5;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a single image file and returns its public URL.
 * - If Supabase is configured, uploads to the `product-images` storage bucket.
 * - Otherwise (local demo mode), inlines the image as a base64 data URL so the
 *   app keeps working without any backend. Fine for a handful of images; for
 *   a real catalog, set up Supabase Storage (see db/STORAGE.md).
 */
export async function uploadProductImage(file) {
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    throw new Error(`${file.name} is larger than ${MAX_FILE_MB}MB. Please use a smaller image.`);
  }

  if (supabaseEnabled) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  return fileToDataUrl(file);
}

/** Uploads multiple files in parallel, returning URLs in the same order. */
export async function uploadProductImages(files) {
  return Promise.all(Array.from(files).map(uploadProductImage));
}
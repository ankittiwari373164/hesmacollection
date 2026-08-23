"use client";
import { useRef, useState } from "react";
import { useStore, moneyFmt } from "@/lib/store";
import { CATEGORIES } from "@/lib/seed";
import { uploadProductImages } from "@/lib/uploadImage";
import { onImgError } from "@/lib/imgFallback";
import { Pencil, Trash2, Plus, X, Upload, GripVertical } from "lucide-react";

const BLANK = { name: "", category: CATEGORIES[0].slug, price: "", mrp: "", images: [], description: "", stock: 20, featured: false, newArrival: false, buy1get2: false };

export default function AdminProductsPage() {
  const products = useStore((s) => s.products);
  const addProduct = useStore((s) => s.addProduct);
  const updateProduct = useStore((s) => s.updateProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);
  const [editing, setEditing] = useState(null); // null | 'new' | product id
  const [form, setForm] = useState(BLANK);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const fileInputRef = useRef(null);

  function startEdit(p) {
    setForm({ ...p, images: p.images?.length ? p.images : [] });
    setEditing(p.id);
    setUploadError("");
  }
  function startNew() {
    setForm(BLANK);
    setEditing("new");
    setUploadError("");
  }

  async function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadError("");
    try {
      const urls = await uploadProductImages(fileList);
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch (err) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(idx) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  function reorder(from, to) {
    setForm((f) => {
      const next = [...f.images];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...f, images: next };
    });
  }

  function save(e) {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp) || Number(form.price),
      stock: Number(form.stock),
      images: form.images.length ? form.images : ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=900&auto=format&fit=crop"],
    };
    if (editing === "new") addProduct(payload);
    else updateProduct(editing, payload);
    setEditing(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Products</h1>
        <button onClick={startNew} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm rounded-sm"><Plus size={16} /> Add Product</button>
      </div>

      {editing && (
        <form onSubmit={save} className="border border-taupe rounded-sm p-5 mb-8 grid sm:grid-cols-2 gap-4 bg-parchment">
          <TextField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <div>
            <label className="text-xs text-ink/60">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm bg-white">
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <TextField label="Price (₹)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required />
          <TextField label="MRP (₹)" type="number" value={form.mrp} onChange={(v) => setForm({ ...form, mrp: v })} />
          <TextField label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />

          <div className="sm:col-span-2">
            <label className="text-xs text-ink/60 block mb-1">Product Images</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-taupe rounded-sm p-5 text-center cursor-pointer bg-white hover:border-oxblood transition-colors"
            >
              <Upload size={20} className="mx-auto mb-2 text-bronze" />
              <p className="text-sm text-ink/70">{uploading ? "Uploading…" : "Click to upload, or drag & drop images here"}</p>
              <p className="text-xs text-ink/40 mt-1">You can select multiple images at once · JPG/PNG, up to 5MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </div>
            {uploadError && <p className="text-xs text-oxblood mt-2">{uploadError}</p>}

            {form.images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                {form.images.map((img, idx) => (
                  <div
                    key={img + idx}
                    draggable
                    onDragStart={() => setDragIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => { if (dragIndex !== null && dragIndex !== idx) reorder(dragIndex, idx); setDragIndex(null); }}
                    className="relative group aspect-square rounded-sm overflow-hidden border border-taupe bg-white cursor-move"
                  >
                    <img src={img} onError={onImgError} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && <span className="absolute top-1 left-1 bg-oxblood text-ivory text-[9px] px-1.5 py-0.5 rounded-sm">Main</span>}
                    <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={13} className="text-ink/40" /></span>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute bottom-1 right-1 bg-ink/80 text-ivory rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] text-ink/40 mt-2">First image is the main product photo. Drag thumbnails to reorder.</p>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs text-ink/60">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm bg-white" />
          </div>
          <div className="sm:col-span-2 flex gap-6 text-sm">
            <Checkbox label="Featured" checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />
            <Checkbox label="New Arrival" checked={form.newArrival} onChange={(v) => setForm({ ...form, newArrival: v })} />
            <Checkbox label="Buy 1 Get 2" checked={form.buy1get2} onChange={(v) => setForm({ ...form, buy1get2: v })} />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button disabled={uploading} className="btn-primary px-5 py-2 text-sm rounded-sm disabled:opacity-50">Save Product</button>
            <button type="button" onClick={() => setEditing(null)} className="btn-outline px-5 py-2 text-sm rounded-sm flex items-center gap-1"><X size={14} /> Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto border border-taupe rounded-sm">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-left text-xs eyebrow">
            <tr><Th>Product</Th><Th>Category</Th><Th>Price</Th><Th>Stock</Th><Th>Flags</Th><Th></Th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-taupe">
                <td className="px-4 py-3 flex items-center gap-3">
                  <img src={p.images[0]} onError={onImgError} className="w-10 h-10 rounded-sm object-cover" alt="" />
                  {p.name}
                  {p.images?.length > 1 && <span className="text-[10px] text-ink/40">+{p.images.length - 1}</span>}
                </td>
                <td className="px-4 py-3 capitalize">{p.category}</td>
                <td className="px-4 py-3">{moneyFmt(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 text-xs text-ink/50">
                  {[p.featured && "Featured", p.newArrival && "New", p.buy1get2 && "B1G2"].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(p)} aria-label="Edit"><Pencil size={15} /></button>
                    <button onClick={() => deleteProduct(p.id)} aria-label="Delete"><Trash2 size={15} className="text-oxblood" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) { return <th className="px-4 py-3">{children}</th>; }
function TextField({ label, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="text-xs text-ink/60">{label}</label>
      <input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm bg-white" />
    </div>
  );
}
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-oxblood" /> {label}
    </label>
  );
}
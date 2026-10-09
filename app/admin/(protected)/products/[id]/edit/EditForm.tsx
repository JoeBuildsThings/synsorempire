"use client";

import { useState } from "react";
import Link from "next/link";
import ProductFields, {
  type Category,
  type FieldDefaults,
} from "@/components/admin/ProductFields";
import { updateProduct } from "../../actions";

export default function EditForm({
  productId,
  categories,
  defaults,
}: {
  productId: string;
  categories: Category[];
  defaults: FieldDefaults;
}) {
  const [message, setMessage] = useState("");
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const rawPrice = String(form.get("price") ?? "").trim();

    setBusy(true);
    setMessage("");
    const result = await updateProduct(productId, {
      name: String(form.get("name") ?? ""),
      categoryId: String(form.get("category") ?? ""),
      subcategory: String(form.get("subcategory") ?? ""),
      description: String(form.get("description") ?? ""),
      priceNgn: rawPrice === "" ? null : Number(rawPrice),
      status: String(form.get("status") ?? "available"),
      sizes: String(form.get("sizes") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: form.get("featured") === "on",
    });
    setBusy(false);
    setBad(!result.ok);
    setMessage(result.ok ? "Changes saved." : result.error ?? "Could not save.");
  }

  return (
    <form onSubmit={handleSubmit} className="adminCard">
      <ProductFields categories={categories} defaults={defaults} />
      <p className="hint">Photos are not editable yet. Delete and re add the product to change photos.</p>
      <div className="rowActions">
        <button type="submit" className="btn btnPrimary" disabled={busy}>
          {busy ? "Saving..." : "Save changes"}
        </button>
        <Link className="btn" href="/admin/products">
          Back to products
        </Link>
      </div>
      {message && <p className={bad ? "msg msgBad" : "msg"}>{message}</p>}
    </form>
  );
}
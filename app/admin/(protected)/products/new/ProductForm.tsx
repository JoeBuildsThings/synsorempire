"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import ProductFields, { type Category } from "@/components/admin/ProductFields";
import { getUploadSignature, createProduct } from "../actions";

export default function ProductForm({ categories }: { categories: Category[] }) {
  const [message, setMessage] = useState("");
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState(false);

  function say(text: string, isBad = false) {
    setMessage(text);
    setBad(isBad);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const files = (form.getAll("photos") as File[]).filter((f) => f.size > 0);
    if (files.length < 1 || files.length > 8) {
      say("Choose between 1 and 8 photos.", true);
      return;
    }
    if (files.some((f) => !f.type.startsWith("image/") || f.size > 15 * 1024 * 1024)) {
      say("Photos only, each under 15 MB.", true);
      return;
    }

    setBusy(true);
    say("Compressing and uploading photos...");

    try {
      const sig = await getUploadSignature();
      const imageIds: string[] = [];

      for (const file of files) {
        const small = await imageCompression(file, {
          maxSizeMB: 0.25,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
        });
        const body = new FormData();
        body.append("file", small);
        body.append("api_key", sig.apiKey);
        body.append("timestamp", String(sig.timestamp));
        body.append("signature", sig.signature);
        body.append("folder", sig.folder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
          { method: "POST", body }
        );
        const json = await res.json();
        if (!res.ok || !json.public_id) {
          throw new Error(json?.error?.message ?? "Photo upload failed.");
        }
        imageIds.push(json.public_id);
      }

      say("Saving product...");
      const rawPrice = String(form.get("price") ?? "").trim();
      const result = await createProduct({
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
        imageIds,
      });

      if (result.ok) {
        formEl.reset();
        say("Product saved. It is on the home page now.");
      } else {
        say(result.error ?? "Could not save.", true);
      }
    } catch (err) {
      say(err instanceof Error ? err.message : "Something went wrong.", true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="adminCard">
      <ProductFields categories={categories} />
      <div className="field">
        <label htmlFor="photos">Photos</label>
        <input id="photos" name="photos" type="file" accept="image/*" multiple />
        <span className="hint">Boss Upload Up to 8. The first one is the main photo.</span>
      </div>
      <button type="submit" className="btn btnPrimary" disabled={busy}>
        {busy ? "Working..." : "Save product"}
      </button>
      {message && <p className={bad ? "msg msgBad" : "msg"}>{message}</p>}
    </form>
  );
}
"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { getUploadSignature, createProduct } from "../actions";

type Category = { id: string; name: string };

export default function ProductForm({
  categories,
}: {
  categories: Category[];
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const files = (form.getAll("photos") as File[]).filter((f) => f.size > 0);
    if (files.length < 1 || files.length > 8) {
      setMessage("Choose between 1 and 8 photos.");
      return;
    }
    if (
      files.some(
        (f) => !f.type.startsWith("image/") || f.size > 15 * 1024 * 1024
      )
    ) {
      setMessage("Photos only, each under 15 MB.");
      return;
    }

    setBusy(true);
    setMessage("Compressing and uploading photos...");

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

      setMessage("Saving product...");

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
        imageIds,
      });

      if (result.ok) {
        formEl.reset();
        setMessage("Product saved. Check the home page.");
      } else {
        setMessage(result.error ?? "Could not save.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label>
          Name <input name="name" required />
        </label>
      </p>
      <p>
        <label>
          Category{" "}
          <select name="category" required defaultValue="">
            <option value="" disabled>
              Choose
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </p>
      <p>
        <label>
          Type, for example Hoodies <input name="subcategory" />
        </label>
      </p>
      <p>
        <label>
          Price in naira, leave empty for message for price{" "}
          <input name="price" type="number" min="0" step="1" />
        </label>
      </p>
      <p>
        <label>
          Status{" "}
          <select name="status" defaultValue="available">
            <option value="available">Available</option>
            <option value="sold_out">Sold out</option>
            <option value="ask">Ask us</option>
          </select>
        </label>
      </p>
      <p>
        <label>
          Sizes, separated by commas <input name="sizes" />
        </label>
      </p>
      <p>
        <label>
          Description <textarea name="description" />
        </label>
      </p>
      <p>
        <label>
          Photos <input name="photos" type="file" accept="image/*" multiple />
        </label>
      </p>
      <button type="submit" disabled={busy}>
        {busy ? "Working..." : "Save product"}
      </button>
      <p>{message}</p>
    </form>
  );
}
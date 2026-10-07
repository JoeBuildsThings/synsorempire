"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setArchived, deleteProduct } from "./actions";

export default function ProductActions({
  id,
  archived,
}: {
  id: string;
  archived: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function toggle() {
    setBusy(true);
    const result = await setArchived(id, !archived);
    setBusy(false);
    if (result.ok) router.refresh();
    else setMessage(result.error ?? "Failed.");
  }

  async function remove() {
    if (!window.confirm("Delete this product and its photos for good?")) {
      return;
    }
    setBusy(true);
    const result = await deleteProduct(id);
    setBusy(false);
    if (result.ok) {
      if (result.cleaned === false) {
        window.alert("Product deleted, but some photos stayed in Cloudinary.");
      }
      router.refresh();
    } else {
      setMessage(result.error ?? "Failed.");
    }
  }

  return (
    <span>
      <button onClick={toggle} disabled={busy}>
        {archived ? "Show" : "Hide"}
      </button>{" "}
      <button onClick={remove} disabled={busy}>
        Delete
      </button>{" "}
      {message}
    </span>
  );
}
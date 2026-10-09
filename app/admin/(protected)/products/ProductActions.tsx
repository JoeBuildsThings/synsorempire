"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setArchived, setFeatured, deleteProduct } from "./actions";

export default function ProductActions({
  id,
  archived,
  featured,
}: {
  id: string;
  archived: boolean;
  featured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function run(
    job: () => Promise<{ ok: boolean; error?: string; cleaned?: boolean }>
  ) {
    setBusy(true);
    setMessage("");
    const result = await job();
    setBusy(false);
    if (!result.ok) {
      setMessage(result.error ?? "Failed.");
      return;
    }
    if (result.cleaned === false) {
      window.alert("Product deleted, but some photos stayed in Cloudinary.");
    }
    router.refresh();
  }

  function remove() {
    if (!window.confirm("Delete this product and its photos for good?")) return;
    run(() => deleteProduct(id));
  }

  return (
    <div className="rowActions">
      <Link className="btn btnSmall" href={`/admin/products/${id}/edit`}>
        Edit
      </Link>
      <button
        type="button"
        className="btn btnSmall"
        disabled={busy}
        onClick={() => run(() => setFeatured(id, !featured))}
      >
        {featured ? "Unfeature" : "Feature"}
      </button>
      <button
        type="button"
        className="btn btnSmall"
        disabled={busy}
        onClick={() => run(() => setArchived(id, !archived))}
      >
        {archived ? "Show" : "Hide"}
      </button>
      <button
        type="button"
        className="btn btnSmall btnDanger"
        disabled={busy}
        onClick={remove}
      >
        Delete
      </button>
      {message && <span className="msg msgBad">{message}</span>}
    </div>
  );
}
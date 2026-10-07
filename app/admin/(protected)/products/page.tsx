import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { imageUrl } from "@/lib/images";
import ProductActions from "./ProductActions";

export default async function AdminProducts() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, code, name, price_ngn, status, is_archived, product_images(path, sort_order)"
    )
    .order("created_at", { ascending: false });

  if (error) return <pre>{error.message}</pre>;

  return (
    <main>
      <h1>Products</h1>
      <Link href="/admin/products/new">Add product</Link>
      {(products ?? []).length === 0 && <p>No products yet.</p>}
      {(products ?? []).map((p) => {
        const first = [...p.product_images].sort(
          (a, b) => a.sort_order - b.sort_order
        )[0];
        return (
          <div key={p.id}>
            {first && <img src={imageUrl(first.path, 120)} alt={p.name} />}
            <strong>{p.code}</strong> {p.name}{" "}
            {p.price_ngn !== null
              ? `₦${p.price_ngn.toLocaleString("en-NG")}`
              : "Message for price"}{" "}
            ({p.status}){p.is_archived ? " HIDDEN" : ""}{" "}
            <ProductActions id={p.id} archived={p.is_archived} />
          </div>
        );
      })}
    </main>
  );
}
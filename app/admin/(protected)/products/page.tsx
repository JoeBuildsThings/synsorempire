import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { imageUrl } from "@/lib/images";
import ProductActions from "./ProductActions";

export default async function AdminProducts() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, code, name, price_ngn, status, is_archived, featured, product_images(path, sort_order)"
    )
    .order("created_at", { ascending: false });

  if (error) return <pre>{error.message}</pre>;

  return (
    <div>
      <h1 className="adminTitle">Products</h1>
      <p>
        <Link className="btn btnPrimary btnSmall" href="/admin/products/new">
          Add product
        </Link>
      </p>
      {(products ?? []).length === 0 ? (
        <p className="empty">No products yet.</p>
      ) : (
        <ul className="rowList">
          {(products ?? []).map((p) => {
            const first = [...p.product_images].sort(
              (a, b) => a.sort_order - b.sort_order
            )[0];
            return (
              <li key={p.id} className="row">
                <div className="rowImg">
                  {first && <img src={imageUrl(first.path, 160, "4:5")} alt={p.name} />}
                </div>
                <div className="rowBody">
                  <p className="rowName">
                    {p.code} {p.name}
                  </p>
                  <p className="rowMeta">
                    {p.price_ngn !== null
                      ? `₦${p.price_ngn.toLocaleString("en-NG")}`
                      : "Message for price"}{" "}
                    <span className="tag">{p.status}</span>
                    {p.featured && <span className="tag">featured</span>}
                    {p.is_archived && <span className="tag tagHidden">hidden</span>}
                  </p>
                  <ProductActions
                    id={p.id}
                    archived={p.is_archived}
                    featured={p.featured}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
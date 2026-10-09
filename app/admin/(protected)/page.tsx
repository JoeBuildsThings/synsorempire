import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function count(
  supabase: Awaited<ReturnType<typeof createClient>>,
  filter?: { column: string; value: boolean }
) {
  let query = supabase
    .from("products")
    .select("id", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count: total } = await query;
  return total ?? 0;
}

export default async function AdminHome() {
  const supabase = await createClient();
  const [total, hidden, featured] = await Promise.all([
    count(supabase),
    count(supabase, { column: "is_archived", value: true }),
    count(supabase, { column: "featured", value: true }),
  ]);

  return (
    <div>
      <h1 className="adminTitle">Dashboard</h1>
      <ul className="stats">
        <li>
          <span className="statNum">{total}</span>
          <span className="statLabel">Products in total</span>
        </li>
        <li>
          <span className="statNum">{total - hidden}</span>
          <span className="statLabel">Showing on the site</span>
        </li>
        <li>
          <span className="statNum">{hidden}</span>
          <span className="statLabel">Hidden</span>
        </li>
        <li>
          <span className="statNum">{featured}</span>
          <span className="statLabel">Featured on home</span>
        </li>
      </ul>
      <p className="rowActions">
        <Link className="btn btnPrimary" href="/admin/products/new">
          Add product
        </Link>
        <Link className="btn" href="/admin/products">
          Manage products
        </Link>
      </p>
    </div>
  );
}
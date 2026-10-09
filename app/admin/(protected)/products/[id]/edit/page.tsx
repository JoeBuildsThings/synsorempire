import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditForm from "./EditForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [productRes, categoriesRes] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, code, name, category_id, subcategory, description, price_ngn, status, sizes, featured"
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.from("categories").select("id, name").order("sort_order"),
  ]);

  const p = productRes.data;
  if (!p) notFound();

  return (
    <div>
      <h1 className="adminTitle">
        Edit {p.code} {p.name}
      </h1>
      <EditForm
        productId={p.id}
        categories={categoriesRes.data ?? []}
        defaults={{
          name: p.name,
          categoryId: p.category_id ?? "",
          subcategory: p.subcategory ?? "",
          description: p.description ?? "",
          price: p.price_ngn === null ? "" : String(p.price_ngn),
          status: p.status,
          sizes: (p.sizes ?? []).join(", "),
          featured: p.featured,
        }}
      />
    </div>
  );
}
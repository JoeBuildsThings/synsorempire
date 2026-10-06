import { createClient } from "@/lib/supabase/server";
import ProductForm from "./ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  return (
    <main>
      <h1>Add product</h1>
      <ProductForm categories={categories ?? []} />
    </main>
  );
}
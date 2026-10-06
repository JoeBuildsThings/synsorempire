import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .order("sort_order");

  return <pre>{JSON.stringify({ data, error }, null, 2)}</pre>;
}
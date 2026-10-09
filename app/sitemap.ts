import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  if (!base) return [];

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_archived", false);

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...(data ?? []).map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
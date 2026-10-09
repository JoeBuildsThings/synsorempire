"use server";

import { revalidatePath } from "next/cache";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/admin";

const FOLDER = "synsorempire";
const STATUSES = ["available", "sold_out", "ask"];

type Fields = {
  name: string;
  categoryId: string;
  subcategory: string;
  description: string;
  priceNgn: number | null;
  status: string;
  sizes: string[];
  featured: boolean;
};

type Result = { ok: boolean; error?: string; cleaned?: boolean };

function fail(e: unknown): Result {
  return {
    ok: false,
    error: e instanceof Error ? e.message : "Something went wrong.",
  };
}

function validate(f: Fields): string | null {
  const name = f.name.trim();
  if (name.length < 2 || name.length > 120) {
    return "Name must be 2 to 120 characters.";
  }
  if (!f.categoryId) return "Pick a category.";
  if (!STATUSES.includes(f.status)) return "Invalid status.";
  if (
    f.priceNgn !== null &&
    (!Number.isInteger(f.priceNgn) || f.priceNgn < 0 || f.priceNgn > 100000000)
  ) {
    return "Price must be a whole number in naira.";
  }
  if (f.sizes.length > 12 || f.sizes.some((s) => s.length === 0 || s.length > 20)) {
    return "Sizes look wrong.";
  }
  if (f.description.length > 2000) return "Description is too long.";
  return null;
}

function refresh(slug?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  if (slug) revalidatePath(`/product/${slug}`);
}

function slugify(text: string) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "item"}_${suffix}`;
}

export async function getUploadSignature() {
  await requireAdmin();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: FOLDER },
    process.env.CLOUDINARY_API_SECRET as string
  );
  return {
    signature,
    timestamp,
    folder: FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
  };
}

export async function createProduct(
  input: Fields & { imageIds: string[] }
): Promise<Result> {
  try {
    const supabase = await requireAdmin();

    const problem = validate(input);
    if (problem) return { ok: false, error: problem };
    if (
      input.imageIds.length < 1 ||
      input.imageIds.length > 8 ||
      input.imageIds.some((id) => !id.startsWith(`${FOLDER}/`) || id.length > 100)
    ) {
      return { ok: false, error: "Add between 1 and 8 photos." };
    }

    const name = input.name.trim();
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        category_id: input.categoryId,
        subcategory: input.subcategory.trim() || null,
        name,
        slug: slugify(name),
        description: input.description.trim() || null,
        price_ngn: input.priceNgn,
        status: input.status,
        sizes: input.sizes,
        featured: input.featured,
      })
      .select("id, slug")
      .single();

    if (error || !product) {
      return { ok: false, error: error?.message ?? "Could not save product." };
    }

    const { error: imageError } = await supabase.from("product_images").insert(
      input.imageIds.map((id, index) => ({
        product_id: product.id,
        path: id,
        sort_order: index,
      }))
    );

    if (imageError) {
      await supabase.from("products").delete().eq("id", product.id);
      return { ok: false, error: imageError.message };
    }

    refresh(product.slug);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function updateProduct(
  productId: string,
  input: Fields
): Promise<Result> {
  try {
    const supabase = await requireAdmin();
    const problem = validate(input);
    if (problem) return { ok: false, error: problem };

    const { data, error } = await supabase
      .from("products")
      .update({
        category_id: input.categoryId,
        subcategory: input.subcategory.trim() || null,
        name: input.name.trim(),
        description: input.description.trim() || null,
        price_ngn: input.priceNgn,
        status: input.status,
        sizes: input.sizes,
        featured: input.featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .select("slug")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Could not save changes." };
    }
    refresh(data.slug);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setArchived(
  productId: string,
  archived: boolean
): Promise<Result> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("products")
      .update({ is_archived: archived, updated_at: new Date().toISOString() })
      .eq("id", productId)
      .select("slug")
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? "Failed." };
    refresh(data.slug);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setFeatured(
  productId: string,
  featured: boolean
): Promise<Result> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("products")
      .update({ featured, updated_at: new Date().toISOString() })
      .eq("id", productId)
      .select("slug")
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? "Failed." };
    refresh(data.slug);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteProduct(productId: string): Promise<Result> {
  try {
    const supabase = await requireAdmin();

    const { data: images } = await supabase
      .from("product_images")
      .select("path")
      .eq("product_id", productId);

    const { data: gone, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .select("slug")
      .single();
    if (error || !gone) return { ok: false, error: error?.message ?? "Failed." };

    const ids = (images ?? [])
      .map((i) => i.path as string)
      .filter((id) => id.startsWith(`${FOLDER}/`));

    let cleaned = true;
    if (ids.length > 0) {
      try {
        await cloudinary.api.delete_resources(ids);
      } catch {
        cleaned = false;
      }
    }

    refresh(gone.slug);
    return { ok: true, cleaned };
  } catch (e) {
    return fail(e);
  }
}
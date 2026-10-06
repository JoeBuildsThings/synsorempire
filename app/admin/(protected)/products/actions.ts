"use server";

import { revalidatePath } from "next/cache";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/admin";

const FOLDER = "synsorempire";
const STATUSES = ["available", "sold_out", "ask"];

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

type NewProduct = {
  name: string;
  categoryId: string;
  subcategory: string;
  description: string;
  priceNgn: number | null;
  status: string;
  sizes: string[];
  imageIds: string[];
};

function slugify(text: string) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "item"}_${suffix}`;
}

export async function createProduct(input: NewProduct) {
  try {
    const supabase = await requireAdmin();

    const name = input.name.trim();
    if (name.length < 2 || name.length > 120) {
      return { ok: false, error: "Name must be 2 to 120 characters." };
    }
    if (!input.categoryId) {
      return { ok: false, error: "Pick a category." };
    }
    if (!STATUSES.includes(input.status)) {
      return { ok: false, error: "Invalid status." };
    }
    if (
      input.priceNgn !== null &&
      (!Number.isInteger(input.priceNgn) ||
        input.priceNgn < 0 ||
        input.priceNgn > 100000000)
    ) {
      return { ok: false, error: "Price must be a whole number in naira." };
    }
    if (
      input.sizes.length > 12 ||
      input.sizes.some((s) => s.length === 0 || s.length > 20)
    ) {
      return { ok: false, error: "Sizes look wrong." };
    }
    if (
      input.imageIds.length < 1 ||
      input.imageIds.length > 8 ||
      input.imageIds.some(
        (id) => !id.startsWith(`${FOLDER}/`) || id.length > 100
      )
    ) {
      return { ok: false, error: "Add between 1 and 8 photos." };
    }

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
      })
      .select("id")
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

    revalidatePath("/");
    revalidatePath("/shop");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Something went wrong.",
    };
  }
}
import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import ProductGallery from "@/components/ProductGallery";
import { statusLabel, statusDot } from "@/components/ProductCard";
import { createPublicClient } from "@/lib/supabase/public";
import { imageUrl } from "@/lib/images";
import { site, whatsappLink, orderMessage } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

const getProduct = cache(async (slug: string) => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, name, slug, code, description, price_ngn, status, sizes, subcategory, categories(name), product_images(path, sort_order)"
    )
    .eq("slug", slug)
    .eq("is_archived", false)
    .maybeSingle();
  return data;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };

  const first = [...product.product_images].sort(
    (a, b) => a.sort_order - b.sort_order
  )[0];
  const description = product.description
    ? String(product.description).slice(0, 150)
    : `${product.name} at ${site.name}, ${site.location}. Message us on WhatsApp to confirm size, price and delivery.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: first ? [imageUrl(first.path, 1200)] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const paths: string[] = [...product.product_images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.path);
  const images = paths.map((p) => ({
    main: imageUrl(p, 900, "4:5"),
    thumb: imageUrl(p, 160, "1:1"),
  }));

  const status: string = product.status;
  const sizes: string[] = product.sizes ?? [];
  const rel = product.categories as
    | { name: string }
    | { name: string }[]
    | null;
  const categoryName = Array.isArray(rel) ? rel[0]?.name : rel?.name;

  const message = orderMessage(product.name, product.code, status);
  const cta =
    status === "ask"
      ? "Ask availability on WhatsApp"
      : status === "sold_out"
        ? "Ask about similar items"
        : "Order on WhatsApp";

  return (
    <SiteShell>
      <section className="section">
        <div className="wrap">
          <Link className="backLink" href="/#latest">
            Back to new items
          </Link>
          <div className="detail">
            <ProductGallery images={images} name={product.name} />
            <div className="detailInfo">
              {categoryName && (
                <p className="detailCat">
                  {categoryName}
                  {product.subcategory ? `, ${product.subcategory}` : ""}
                </p>
              )}
              <h1 className="detailTitle">{product.name}</h1>
              <p className="cardCode">Product code {product.code}</p>
              <p className="detailPrice">
                {product.price_ngn !== null
                  ? `₦${product.price_ngn.toLocaleString("en-NG")}`
                  : "Message for price"}
              </p>
              <p className="status">
                <span className={`dot ${statusDot[status] ?? "dotAsk"}`} />
                {statusLabel[status] ?? "Ask us"}
              </p>
              {sizes.length > 0 && (
                <div>
                  <h2 className="detailLabel">Sizes</h2>
                  <ul className="sizes">
                    {sizes.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.description && (
                <p className="detailDesc">{product.description}</p>
              )}
              <a
                className="btn btnPrimary"
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cta}
              </a>
              <p className="fine">
                {site.paymentPolicy} Message us first to confirm the size, price
                and delivery details.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
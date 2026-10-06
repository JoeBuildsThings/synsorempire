import SiteShell from "@/components/SiteShell";
import ProductCard, { type CardProduct } from "@/components/ProductCard";
import { createPublicClient } from "@/lib/supabase/public";
import { imageUrl } from "@/lib/images";
import { site, whatsappLink, categoryNotes } from "@/lib/site";

export const revalidate = 300;

export default async function Home() {
  const supabase = createPublicClient();

  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, price_ngn, status, product_images(path, sort_order)")
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
      .limit(24),
    supabase.from("categories").select("id, name, slug").order("sort_order"),
  ]);

  if (productsRes.error) console.error(productsRes.error.message);

  const products: CardProduct[] = (productsRes.data ?? []).map((p) => {
    const first = [...p.product_images].sort(
      (a, b) => a.sort_order - b.sort_order
    )[0];
    return {
      id: p.id,
      name: p.name,
      price_ngn: p.price_ngn,
      status: p.status,
      image: first ? first.path : null,
    };
  });
  const categories = categoriesRes.data ?? [];
  const heroProduct = products.find((p) => p.image) ?? null;
  const orderLink = whatsappLink(`Hello ${site.name}, I want to order. `);

  return (
    <SiteShell>
      <section className="hero onDark">
        <div className="wrap heroGrid">
          <div>
            <h1 className="heroTitle">
              Corporate wear, sneakers and streetwear in one place
            </h1>
            <p className="heroText">
              Shirts, trousers, formal shoes, caps, belts, bags and more from{" "}
              {site.location}. Message us to confirm sizes, prices and delivery
              before you pay.
            </p>
            <div className="heroActions">
              <a className="btn btnPrimary" href="#latest">
                Browse new items
              </a>
              <a
                className="btn btnGhost"
                href={orderLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
          {heroProduct && heroProduct.image && (
            <div className="heroPhoto">
              <img
                src={imageUrl(heroProduct.image, 700, "1:1")}
                alt={heroProduct.name}
                width={700}
                height={700}
              />
            </div>
          )}
        </div>
      </section>

      <div className="policy">
        <div className="wrap">
          <p>
            {site.paymentPolicy} Message us first to confirm the product, size,
            price and delivery details.
          </p>
        </div>
      </div>

      <section id="latest" className="section">
        <div className="wrap">
          <h2 className="sectionTitle">New in</h2>
          <p className="sectionLead">
            Tap order and your message to {site.name} is ready to send.
          </p>
          {products.length === 0 ? (
            <p className="empty">
              No products yet. Message us to ask what is available.
            </p>
          ) : (
            <div className="grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 2} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="categories" className="section sectionAlt">
        <div className="wrap">
          <h2 className="sectionTitle">What we sell</h2>
          <p className="sectionLead">
            Corporate wear, footwear, streetwear, accessories and essentials,
            and more. Ask us if you do not see what you need.
          </p>
          <ul className="catList">
            {categories.map((c) => (
              <li key={c.id}>
                <h3 className="catName">{c.name}</h3>
                <p className="catNote">{categoryNotes[c.slug] ?? ""}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="order" className="section">
        <div className="wrap">
          <h2 className="sectionTitle">How to order</h2>
          <ol className="steps">
            <li>
              <p>Message us on WhatsApp with the item and your size.</p>
            </li>
            <li>
              <p>We confirm the product, price and delivery details with you.</p>
            </li>
            <li>
              <p>Pay before delivery.</p>
            </li>
          </ol>
          <a
            className="btn btnPrimary"
            href={orderLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Start your order on WhatsApp
          </a>
          <p className="fine">We reply to messages fast.</p>
        </div>
      </section>
    </SiteShell>
  );
}
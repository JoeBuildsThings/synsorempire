import Link from "next/link";
import { imageUrl } from "@/lib/images";
import { whatsappLink, orderMessage } from "@/lib/site";

export type CardProduct = {
  id: string;
  slug: string;
  code: string;
  name: string;
  price_ngn: number | null;
  status: string;
  featured: boolean;
  image: string | null;
};

export const statusLabel: Record<string, string> = {
  available: "Available",
  sold_out: "Sold out",
  ask: "Ask us",
};
export const statusDot: Record<string, string> = {
  available: "dotAvailable",
  sold_out: "dotSold",
  ask: "dotAsk",
};

export default function ProductCard({
  product,
  priority,
}: {
  product: CardProduct;
  priority: boolean;
}) {
  const { name, slug, code, price_ngn, status, image } = product;
  const href = `/product/${slug}`;

  return (
    <article className="card">
      <Link className="cardImage" href={href} tabIndex={-1} aria-hidden="true">
        {image && (
          <img
            src={imageUrl(image, 600, "4:5")}
            alt={name}
            width={600}
            height={750}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        )}
      </Link>
      <p className="cardCode">{code}</p>
      <h3 className="cardName">
        <Link className="cardLink" href={href}>
          {name}
        </Link>
      </h3>
      <p className="cardPrice">
        {price_ngn !== null
          ? `₦${price_ngn.toLocaleString("en-NG")}`
          : "Message for price"}
      </p>
      <p className="status">
        <span className={`dot ${statusDot[status] ?? "dotAsk"}`} />
        {statusLabel[status] ?? "Ask us"}
      </p>
      {status !== "sold_out" && (
        <a
          className="btn btnSmall"
          href={whatsappLink(orderMessage(name, code, status))}
          target="_blank"
          rel="noopener noreferrer"
        >
          {status === "ask" ? "Ask availability" : "Order on WhatsApp"}
        </a>
      )}
    </article>
  );
}
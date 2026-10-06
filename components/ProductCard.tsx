import { imageUrl } from "@/lib/images";
import { site, whatsappLink } from "@/lib/site";

export type CardProduct = {
  id: string;
  name: string;
  price_ngn: number | null;
  status: string;
  image: string | null;
};

const LABEL: Record<string, string> = {
  available: "Available",
  sold_out: "Sold out",
  ask: "Ask us",
};
const DOT: Record<string, string> = {
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
  const { name, price_ngn, status, image } = product;
  const message =
    status === "ask"
      ? `Hello ${site.name}, is the ${name} available? `
      : `Hello ${site.name}, I want to order the ${name}. Please confirm size, price and delivery. `;

  return (
    <article className="card">
      <div className="cardImage">
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
      </div>
      <h3 className="cardName">{name}</h3>
      <p className="cardPrice">
        {price_ngn !== null
          ? `₦${price_ngn.toLocaleString("en-NG")}`
          : "Message for price"}
      </p>
      <p className="status">
        <span className={`dot ${DOT[status] ?? "dotAsk"}`} />
        {LABEL[status] ?? "Ask us"}
      </p>
      {status !== "sold_out" && (
        <a
          className="btn btnSmall"
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {status === "ask" ? "Ask availability" : "Order on WhatsApp"}
        </a>
      )}
    </article>
  );
}
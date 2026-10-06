import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const orderLink = whatsappLink(`Hello ${site.name}, I want to order. `);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="siteHeader onDark">
        <div className="wrap headerRow">
          <Link className="wordmark" href="/">
            {site.name}
          </Link>
          <nav className="headerNav" aria-label="Main">
            <Link href="/#latest">New in</Link>
            <Link href="/#categories">What we sell</Link>
            <Link href="/#order">How to order</Link>
          </nav>
          <a
            className="btn btnPrimary btnSmall"
            href={orderLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order on WhatsApp"
          >
            Order
          </a>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="footer">
        <div className="wrap footerGrid">
          <div>
            <h2>{site.name}</h2>
            <p>{site.location}</p>
            <p>{site.paymentPolicy}</p>
          </div>
          <div>
            <h2>Contact</h2>
            <p>
              <a href={`tel:${site.phoneDisplay}`}>{site.phoneDisplay}</a>
            </p>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <div>
            <h2>Fast replies</h2>
            <p>We answer messages fast. Message us to confirm products, sizes, prices and delivery.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
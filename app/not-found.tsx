import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <SiteShell>
      <section className="section">
        <div className="wrap">
          <h1 className="sectionTitle">This page does not exist</h1>
          <p className="sectionLead">
            The link may be old, or the item may have been removed. See what is
            available now.
          </p>
          <Link className="btn btnPrimary" href="/#latest">
            See new items
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

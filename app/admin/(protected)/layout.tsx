import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login");

  return (
    <>
      <header className="adminBar onDark">
        <div className="wrap adminBarRow">
          <nav className="adminNav" aria-label="Admin">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/products">Products</Link>
            <Link href="/admin/products/new">Add product</Link>
            <Link href="/">View site</Link>
          </nav>
          <form action={logout} className="adminUser">
            <span>{user.email} </span>
            <button type="submit" className="btn btnSmall btnGhost">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="wrap adminMain">{children}</main>
    </>
  );
}
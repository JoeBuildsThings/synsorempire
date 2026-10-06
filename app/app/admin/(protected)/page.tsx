import Link from "next/link";

export default function AdminHome() {
  return (
    <div>
      <h1>Admin dashboard</h1>
      <Link href="/admin/products/new">Add product</Link>
    </div>
  );
}
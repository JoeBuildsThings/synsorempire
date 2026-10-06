import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main>
      <h1>Admin login</h1>
      {error && <p>Wrong email or password.</p>}
      <form action={login}>
        <input name="email" type="email" required />
        <input name="password" type="password" required />
        <button type="submit">Log in</button>
      </form>
    </main>
  );
}
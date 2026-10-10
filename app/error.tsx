"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="wrap section">
      <h1 className="sectionTitle">Something went wrong</h1>
      <p className="sectionLead">
        Please try again. If it keeps happening, message us on WhatsApp.
      </p>
      <button type="button" className="btn btnPrimary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}

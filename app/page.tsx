export default function HomePage() {
  return (
    <main style={{
      minHeight: "100dvh",
      display: "grid",
      placeItems: "center",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto"
    }}>
      <div style={{
        padding: "2rem 2.5rem",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,.05)",
        textAlign: "center"
      }}>
        <h1>✅ Hello Next.js on Vercel</h1>
        <p>Es funktioniert. Diese Seite wird mit dem App Router ausgeliefert.</p>
        <p>
          Health-Check: <a href="/api/health">/api/health</a>
        </p>
      </div>
    </main>
  );
}

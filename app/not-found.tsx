import Nav from "@/app/components/Nav";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main
        className="not-found-main"
        style={{
          backgroundColor: "var(--parchment-bg)",
          color: "var(--ledger-ink)",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4rem, 10vw, 8rem)",
            fontWeight: 700,
            lineHeight: 1,
            color: "var(--accent-ochre)",
            marginBottom: "1.5rem",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
            lineHeight: 1.6,
            maxWidth: "40ch",
            marginBottom: "2rem",
            color: "var(--ledger-ink)",
          }}
        >
          This page has wandered off the ledger. The record you are looking for
          does not exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--parchment-bg)",
            backgroundColor: "var(--ledger-ink)",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.375rem",
            textDecoration: "none",
            transition: "opacity 0.2s ease-out",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          Return to the Ledger
        </Link>
      </main>
    </>
  );
}

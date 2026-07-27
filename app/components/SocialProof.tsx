export default function SocialProof() {
  return (
    <section className="proof-root" aria-labelledby="social-proof-heading">
      <div className="proof-inner">
        <h2 id="social-proof-heading" className="proof-headline">
          Trusted by teams who ship
        </h2>
        <div className="proof-grid">
          <article className="proof-card">
            <div className="proof-content-col">
              <p className="proof-quote">
                "Thornwood Ledger cut our reconciliation time by 80%. The
                verification API is flawless."
              </p>
              <p className="proof-author">Sarah Chen, VP Finance at Acme</p>
            </div>
          </article>
          <article className="proof-card">
            <div className="proof-content-col">
              <p className="proof-quote">
                "We went live in two weeks. The documentation and support are
                world-class."
              </p>
              <p className="proof-author">Marcus Johnson, CTO at Zephyr</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

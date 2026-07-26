"use client";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FormState = "idle" | "loading" | "success" | "error";

export default function WalkthroughCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [coopName, setCoopName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormState("loading");

    // TODO: POST to /api/booking — must enforce rate limiting (max 5 req/min per IP) per AUTH-001
    // IDOR-001: No user-controlled IDs in payload. Server assigns all record identifiers.
    const payload = { name, coopName, email, phone };

    try {
      // Stub: simulate network delay — move real fetch here so catch can fire
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Stub success — replace with real fetch when backend is ready
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  const isDisabled = formState === "loading" || formState === "success";

  return (
    <motion.section
      id="walkthrough"
      className="cta-section"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="cta-inner">
        <h2 className="cta-headline heading-display">
          Ready for a more efficient harvest?
        </h2>
        <p className="cta-pricing">
          Flat-rate annual licensing. No per-bushel fees or hidden member costs.
        </p>
        <p className="cta-roles">
          Purpose-built for co-op office staff, scale operators, and farmer-members.
        </p>
        <button
          className="cta-button"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          Book a Walkthrough
        </button>
      </div>

      {/* Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-heading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          >
            <motion.div
              className="modal-panel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                className="modal-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close booking form"
                type="button"
              >
                ×
              </button>

              {formState === "success" ? (
                <div className="modal-success">
                  <p className="modal-success-text">
                    {`Request received. We'll be in touch within one business day.`}
                  </p>
                </div>
              ) : (
                <>
                  <h2 id="modal-heading" className="modal-heading heading-display">
                    Request a Walkthrough
                  </h2>
                  <form className="modal-form" onSubmit={handleSubmit} noValidate>
                    <div className="field-group">
                      <label className="field-label" htmlFor="field-name">Name</label>
                      <input
                        id="field-name"
                        className="field-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isDisabled}
                        aria-disabled={isDisabled}
                        autoComplete="name"
                      />
                      <p className="field-helper" aria-live="polite" />
                    </div>
                    <div className="field-group">
                      <label className="field-label" htmlFor="field-coop">Co-op Name</label>
                      <input
                        id="field-coop"
                        className="field-input"
                        type="text"
                        required
                        value={coopName}
                        onChange={(e) => setCoopName(e.target.value)}
                        disabled={isDisabled}
                        aria-disabled={isDisabled}
                        autoComplete="organization"
                      />
                      <p className="field-helper" aria-live="polite" />
                    </div>
                    <div className="field-group">
                      <label className="field-label" htmlFor="field-email">Email</label>
                      <input
                        id="field-email"
                        className="field-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isDisabled}
                        aria-disabled={isDisabled}
                        autoComplete="email"
                      />
                      <p className="field-helper" aria-live="polite" />
                    </div>
                    <div className="field-group">
                      <label className="field-label" htmlFor="field-phone">
                        Phone <span className="field-optional">(optional)</span>
                      </label>
                      <input
                        id="field-phone"
                        className="field-input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isDisabled}
                        aria-disabled={isDisabled}
                        autoComplete="tel"
                      />
                      <p className="field-helper" aria-live="polite" />
                    </div>
                    {formState === "error" && (
                      <p className="form-error" role="alert">
                        Something went wrong. Please email{" "}
                        <a href="mailto:support@thornwoodledger.com" className="form-error-link">
                          support@thornwoodledger.com
                        </a>{" "}
                        directly.
                      </p>
                    )}
                    <button
                      className="submit-button"
                      type="submit"
                      disabled={isDisabled}
                      aria-disabled={isDisabled}
                    >
                      {formState === "loading" ? "Sending..." : "Send Request"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

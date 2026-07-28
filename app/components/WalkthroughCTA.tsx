"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function WalkthroughCTA() {
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    coopName: "",
    email: "",
    phone: "",
  });
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[e.target.name];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setFieldErrors({});
    setErrorMessage("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 201) {
        setFormState("success");
        setFormData({ name: "", coopName: "", email: "", phone: "" });
        return;
      }

      if (res.status === 422) {
        const data = await res.json().catch(() => ({}));
        if (data.errors && typeof data.errors === "object") {
          setFieldErrors(data.errors);
        } else {
          setErrorMessage("Please check your input and try again.");
        }
        setFormState("error");
        return;
      }

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const retry = data.retryAfter ?? 60;
        setErrorMessage(
          `Too many requests. Please wait ${retry} second${retry === 1 ? "" : "s"} and try again.`
        );
        setFormState("error");
        return;
      }

      setErrorMessage("Something went wrong. Please try again later.");
      setFormState("error");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setFormState("error");
    }
  };

  const sectionMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <motion.section
      id="walkthrough"
      className="cta-section"
      {...sectionMotionProps}
    >
      <div className="cta-inner">
        <h2 className="cta-headline">Ready for a more efficient harvest?</h2>
        <p className="cta-subhead">
          Flat-rate annual licensing. No per-bushel fees or hidden member costs.
          Purpose-built for co-op office staff, scale operators, and farmer-members.
        </p>

        {formState === "success" ? (
          <div className="cta-success" role="status">
            Request received. We will be in touch shortly.
          </div>
        ) : (
          <form
            className="cta-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Book a walkthrough"
          >
            {errorMessage && (
              <div className="cta-error-banner" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="cta-field">
              <label htmlFor="name" className="cta-label">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`cta-input${fieldErrors.name ? " cta-input-error" : ""}`}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                aria-invalid={fieldErrors.name ? "true" : undefined}
              />
              {fieldErrors.name && (
                <span id="name-error" className="cta-field-error" role="alert">
                  {fieldErrors.name}
                </span>
              )}
            </div>

            <div className="cta-field">
              <label htmlFor="coopName" className="cta-label">
                Co-op Name
              </label>
              <input
                id="coopName"
                name="coopName"
                type="text"
                autoComplete="organization"
                required
                value={formData.coopName}
                onChange={handleChange}
                className={`cta-input${fieldErrors.coopName ? " cta-input-error" : ""}`}
                aria-describedby={fieldErrors.coopName ? "coopName-error" : undefined}
                aria-invalid={fieldErrors.coopName ? "true" : undefined}
              />
              {fieldErrors.coopName && (
                <span id="coopName-error" className="cta-field-error" role="alert">
                  {fieldErrors.coopName}
                </span>
              )}
            </div>

            <div className="cta-field">
              <label htmlFor="email" className="cta-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`cta-input${fieldErrors.email ? " cta-input-error" : ""}`}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                aria-invalid={fieldErrors.email ? "true" : undefined}
              />
              {fieldErrors.email && (
                <span id="email-error" className="cta-field-error" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className="cta-field">
              <label htmlFor="phone" className="cta-label">
                Phone <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`cta-input${fieldErrors.phone ? " cta-input-error" : ""}`}
                aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                aria-invalid={fieldErrors.phone ? "true" : undefined}
              />
              {fieldErrors.phone && (
                <span id="phone-error" className="cta-field-error" role="alert">
                  {fieldErrors.phone}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="cta-submit"
              disabled={formState === "submitting"}
              aria-busy={formState === "submitting"}
            >
              {formState === "submitting" ? "Sending..." : "Book a Walkthrough"}
            </button>
          </form>
        )}

        <p className="cta-pricing">
          Flat-rate annual licensing. No per-bushel fees or hidden member costs.
        </p>
      </div>
    </motion.section>
  );
}
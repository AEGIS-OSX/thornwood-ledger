"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function WalkthroughCTA() {
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

  return (
    <section id="walkthrough" className="py-24 px-6 bg-stone-50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">
            Book a Walkthrough
          </h2>
          <p className="text-stone-600 text-lg">
            See how Thornwood Ledger can streamline your co-op&apos;s finances.
          </p>
        </motion.div>

        {formState === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 shadow-sm text-center"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-stone-900 mb-2">
              Request Received
            </h3>
            <p className="text-stone-600">
              We&apos;ll be in touch within 24 hours to schedule your walkthrough.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-8 shadow-sm space-y-6"
            noValidate
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-md border ${
                  fieldErrors.name
                    ? "border-red-400 focus:ring-red-200"
                    : "border-stone-200 focus:ring-stone-200"
                } focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Jane Doe"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="coopName"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Co-op Name
              </label>
              <input
                type="text"
                id="coopName"
                name="coopName"
                value={formData.coopName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-md border ${
                  fieldErrors.coopName
                    ? "border-red-400 focus:ring-red-200"
                    : "border-stone-200 focus:ring-stone-200"
                } focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Sunrise Housing Co-op"
              />
              {fieldErrors.coopName && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.coopName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-md border ${
                  fieldErrors.email
                    ? "border-red-400 focus:ring-red-200"
                    : "border-stone-200 focus:ring-stone-200"
                } focus:outline-none focus:ring-2 transition-colors`}
                placeholder="jane@coop.org"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Phone <span className="text-stone-400">(optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md border ${
                  fieldErrors.phone
                    ? "border-red-400 focus:ring-red-200"
                    : "border-stone-200 focus:ring-stone-200"
                } focus:outline-none focus:ring-2 transition-colors`}
                placeholder="+1 (555) 123-4567"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
              )}
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 rounded-md">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={formState === "submitting"}
              className="w-full bg-stone-900 text-white py-3 px-6 rounded-md font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {formState === "submitting"
                ? "Submitting..."
                : "Request Walkthrough"}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}

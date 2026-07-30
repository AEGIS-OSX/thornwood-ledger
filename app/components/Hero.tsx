"use client";

import { useState, useEffect } from "react";
import {
  HeroMotion,
  HeroHeadlineMotion,
  HeroCountMotion,
  HeroCtaMotion,
} from "@/app/components/HeroMotion";

export default function Hero() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    preferredTime: "",
  });

  useEffect(() => {
    fetch("/api/delivery/stats")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (typeof data.count === "number") {
          setCount(data.count);
        }
      })
      .catch(() => {
        // Leave count as null on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    if (modalOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [modalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch {
      // Silently handle error
    }
    setModalOpen(false);
    setFormData({ name: "", email: "", preferredTime: "" });
  };

  const countDisplay =
    count !== null ? count.toLocaleString("en-US") : "10,000+";

  return (
    <HeroMotion>
      <div className="hero-inner">
        <div className="hero-left w-full !max-w-full">
          <HeroHeadlineMotion>
            <h1
              id="hero-heading"
              className="hero-headline text-2xl sm:text-4xl lg:text-5xl !max-w-full break-words"
            >
              Settlement speed for regional co-ops.
            </h1>
          </HeroHeadlineMotion>
          <HeroCtaMotion>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setModalOpen(true);
              }}
              className="hero-cta focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              role="button"
              aria-label="Book a Walkthrough"
            >
              Book a Walkthrough
            </a>
          </HeroCtaMotion>
        </div>

        <HeroCountMotion>
          <div
            className="hero-count-box"
            aria-label="Verified delivery count"
          >
            <span className="hero-count-number">{countDisplay}</span>
            <span className="hero-count-label">
              {countDisplay} verified deliveries recorded this harvest season.
            </span>
          </div>
        </HeroCountMotion>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="booking-modal-title"
              className="text-xl font-semibold text-gray-900 mb-4"
            >
              Book a Walkthrough
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="booking-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="booking-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="booking-time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preferred Time
                </label>
                <input
                  id="booking-time"
                  type="text"
                  required
                  value={formData.preferredTime}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredTime: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HeroMotion>
  );
}

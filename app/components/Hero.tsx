'use client';

import { useState, useEffect, useRef } from 'react';

interface DeliveryStats {
  verifiedCount: number;
}

interface BookingFormData {
  name: string;
  email: string;
  preferredDate: string;
}

export default function Hero() {
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    preferredDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await fetch('/api/delivery/stats');
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Unable to load verification count');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  useEffect(() => {
    if (modalOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    if (!modalOpen && openButtonRef.current) {
      openButtonRef.current.focus();
    }
  }, [modalOpen]);

  function openModal() {
    setSubmitStatus('idle');
    setSubmitMessage('');
    setFormData({ name: '', email: '', preferredDate: '' });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Your walkthrough is booked! We will be in touch soon.');
        setFormData({ name: '', email: '', preferredDate: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'Booking failed. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Settlement speed for regional co-ops.
          </h1>

          <div className="mt-4 text-base sm:text-lg text-gray-600">
            {loading && (
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" aria-label="Loading verification count" />
            )}
            {!loading && error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {!loading && stats && (
              <p>
                {stats.verifiedCount.toLocaleString()} verified deliveries recorded this harvest season.
              </p>
            )}
          </div>

          <div className="mt-8">
            <button
              ref={openButtonRef}
              type="button"
              onClick={openModal}
              className="inline-flex items-center justify-center rounded-md px-5 py-3 text-base font-medium shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}
            >
              Book a Walkthrough
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            ref={modalRef}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="booking-modal-title" className="text-lg font-semibold text-gray-900">
                Book a Walkthrough
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeModal}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitStatus === 'success' ? (
              <div className="mt-4 rounded-md bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">{submitMessage}</p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="booking-email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700">
                    Preferred Date
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, preferredDate: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="rounded-md bg-red-50 p-3">
                    <p className="text-sm text-red-700">{submitMessage}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex flex-1 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex flex-1 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Booking…' : 'Book Walkthrough'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

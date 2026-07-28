'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function WalkthroughCTA() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('submitting');
    setErrorMsg('');
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          coopName: fd.get('coopName'),
          email: fd.get('email'),
          phone: fd.get('phone') ?? '',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFormState('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setFormState('error');
    }
  }

  return (
    <section id="walkthrough" className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-inner">
        <h2 id="cta-heading" className="cta-headline">Book a Walkthrough</h2>
        <p className="cta-pricing">
          See how Thornwood Ledger fits your co-operative's workflow. No commitment required.
        </p>

        <AnimatePresence mode="wait">
          {formState === 'success' ? (
            <motion.div
              key="success"
              className="modal-success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="modal-success-text">
                Request received. We'll be in touch within one business day.
              </p>
            </motion.div>
          ) : (
            <form
              key="form"
              className="modal-form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Book a walkthrough"
            >
              <div className="field-group">
                <label htmlFor="wt-name" className="field-label">Name</label>
                <input
                  id="wt-name"
                  name="name"
                  type="text"
                  className="field-input"
                  required
                  autoComplete="name"
                  disabled={formState === 'submitting'}
                />
              </div>

              <div className="field-group">
                <label htmlFor="wt-coop" className="field-label">Co-op / Organisation</label>
                <input
                  id="wt-coop"
                  name="coopName"
                  type="text"
                  className="field-input"
                  required
                  autoComplete="organization"
                  disabled={formState === 'submitting'}
                />
              </div>

              <div className="field-group">
                <label htmlFor="wt-email" className="field-label">Email</label>
                <input
                  id="wt-email"
                  name="email"
                  type="email"
                  className="field-input"
                  required
                  autoComplete="email"
                  disabled={formState === 'submitting'}
                />
              </div>

              <div className="field-group">
                <label htmlFor="wt-phone" className="field-label">
                  Phone <span className="field-optional">(optional)</span>
                </label>
                <input
                  id="wt-phone"
                  name="phone"
                  type="tel"
                  className="field-input"
                  autoComplete="tel"
                  disabled={formState === 'submitting'}
                />
              </div>

              {formState === 'error' && (
                <p className="form-error" role="alert">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={formState === 'submitting'}
                aria-disabled={formState === 'submitting'}
              >
                {formState === 'submitting' ? 'Submitting…' : 'Request Walkthrough'}
              </button>
            </form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

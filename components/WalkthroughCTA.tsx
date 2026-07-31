import React, { useState } from 'react';

export const WalkthroughCTA = () => {
  const [email, setEmail] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to see it in action?</h2>
        <p className="text-xl text-slate-300 mb-10">Join 500+ firms automating their ledger management.</p>
        <form className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your work email"
            className="px-6 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
            Get a Demo
          </button>
        </form>
      </div>
    </section>
  );
};

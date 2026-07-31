import React from 'react';

const logos = [
  { name: 'Acme Corp', src: '/logos/acme.svg' },
  { name: 'Global Finance', src: '/logos/global.svg' },
  { name: 'Stellar Ventures', src: '/logos/stellar.svg' },
  { name: 'Nexus Systems', src: '/logos/nexus.svg' },
];

export const SocialProof = () => {
  return (
    <div className="py-12 border-y border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
          Trusted by industry leaders
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale">
          {logos.map((logo, i) => (
            <img
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              className="h-8 w-auto animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

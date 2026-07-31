import React, { useState, useEffect } from 'react';

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return reduced;
};

export const HeroMotion = ({ children }: { children: React.ReactNode }) => {
  const reduced = useReducedMotion();
  return (
    <div className={reduced ? '' : 'animate-fade-in'}>
      {children}
    </div>
  );
};

export const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const reduced = useReducedMotion();
  return (
    <div 
      className={reduced ? '' : 'animate-float'} 
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export const StaggerItem = ({ children, index = 0 }: { children: React.ReactNode; index?: number }) => {
  const reduced = useReducedMotion();
  return (
    <div 
      className={reduced ? '' : 'animate-slide-up'} 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {children}
    </div>
  );
};

export const ScaleIn = ({ children }: { children: React.ReactNode }) => {
  const reduced = useReducedMotion();
  return (
    <div className={reduced ? '' : 'animate-scale-in'}>
      {children}
    </div>
  );
};

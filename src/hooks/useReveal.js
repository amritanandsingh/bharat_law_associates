import { useEffect } from 'react';

// Adds .is-in to every [data-reveal] element as it enters the viewport.
// Pass `deps` (e.g. async-loaded data) so it re-observes elements that mount
// AFTER the first render — otherwise dynamically-added [data-reveal] nodes
// (like async-loaded article cards) stay hidden at opacity:0 forever.
const useReveal = (deps = []) => {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.is-in)');
    if (els.length === 0) return undefined;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useReveal;

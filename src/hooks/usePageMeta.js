import { useEffect } from 'react';

// Sets a named or property meta tag's content, creating the tag if absent.
const setMeta = (attr, name, content) => {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

// Updates document.title, the description meta, and the Open Graph / Twitter
// title+description at runtime. NOTE: social crawlers do not run JS, so shared
// links still unfurl with the static defaults in public/index.html — this only
// helps in-app navigation and JS-capable embedders.
const usePageMeta = (title, description) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
  }, [title, description]);
};

export default usePageMeta;

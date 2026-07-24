// Article metadata (language-independent). Translatable text — title, excerpt,
// body paragraphs and tag labels — lives in locales/<lng>/articles.json,
// keyed by article id and tag id. Articles are static repo content: to publish
// a new one, add an entry here and its text to every articles.json.

export const ARTICLES = [
  {
    id: 'fir-what-to-do',
    date: '2026-07-05',
    tagIds: ['criminal', 'fir', 'rights'],
    order: 1,
  },
  {
    id: 'anticipatory-bail-guide',
    date: '2026-06-22',
    tagIds: ['criminal', 'bail'],
    order: 2,
  },
  {
    id: 'cheque-bounce-notice-window',
    date: '2026-06-10',
    tagIds: ['cheque-bounce', 'recovery'],
    order: 3,
  },
  {
    id: 'file-consumer-complaint',
    date: '2026-05-28',
    tagIds: ['consumer', 'rights'],
    order: 4,
  },
  {
    id: 'maintenance-and-alimony',
    date: '2026-05-12',
    tagIds: ['family', 'maintenance'],
    order: 5,
  },
  {
    id: 'writ-petition-remedy',
    date: '2026-04-30',
    tagIds: ['constitutional', 'writ', 'rights'],
    order: 6,
  },
];

export const getArticleBySlug = (slug) => ARTICLES.find((a) => a.id === slug);

export const getAllTagIds = () => {
  const seen = [];
  ARTICLES.forEach((a) => a.tagIds.forEach((t) => !seen.includes(t) && seen.push(t)));
  return seen;
};

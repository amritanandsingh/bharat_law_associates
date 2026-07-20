// Formats an ISO date (YYYY-MM-DD) for display. Falls back to English, then to
// the raw string, for locale codes the Intl API does not recognise (e.g. brx, sat).
export const formatDate = (iso, lng = 'en') => {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  for (const locale of [lng, 'en']) {
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
    } catch (e) {
      /* try next */
    }
  }
  return iso;
};

// Formats a whole-rupee amount for display. Falls back to English-India, then
// to a bare symbol, for locale codes the Intl API does not recognise
// (e.g. brx, sat, mni) — same ladder as formatDate.
//
// Returns null when there is no price, so callers can render their own
// "Price on request" string.
export const formatPrice = (amount, lng = 'en') => {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) return null;
  for (const locale of [lng, 'en-IN']) {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    } catch (e) {
      /* try next */
    }
  }
  return `₹${value}`;
};

export default formatPrice;

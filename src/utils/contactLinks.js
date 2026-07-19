export const buildWhatsAppUrl = (number, text) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const buildMailtoUrl = (to, subject, body) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const buildTelUrl = (e164) => `tel:${e164}`;

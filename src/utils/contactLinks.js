export const buildWhatsAppUrl = (number, text) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const buildMailtoUrl = (to, subject, body) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const buildTelUrl = (e164) => `tel:${e164}`;

// `sms:<number>?&body=` is the cross-platform form that works on both iOS and Android.
export const buildSmsUrl = (e164, body) =>
  `sms:${e164}?&body=${encodeURIComponent(body)}`;

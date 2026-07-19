export const normalizePhone = (raw) => raw.replace(/[\s()-]/g, '');

export const isValidIndianPhone = (raw) =>
  /^(?:\+?91)?[6-9]\d{9}$/.test(normalizePhone(raw));

export const isValidEmail = (raw) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());

export const isFutureOrToday = (isoDate) => {
  if (!isoDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${isoDate}T00:00:00`) >= today;
};

export const todayISO = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

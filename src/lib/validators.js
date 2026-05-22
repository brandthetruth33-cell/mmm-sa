export function validateField(fieldType, value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;

  switch (fieldType) {
    case 'zip':
      return /^\d{5}$/.test(value);
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'phone': {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10;
    }
    default:
      return value !== null && value !== undefined && String(value).trim() !== '';
  }
}

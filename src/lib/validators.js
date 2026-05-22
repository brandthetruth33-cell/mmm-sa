export function validateField(fieldName, value) {
  switch (fieldName) {
    case 'zip':
      return /^\d{5}$/.test(value);
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'phone': {
      if (value === null || value === undefined) return false;
      const digits = String(value).replace(/\D/g, '');
      return digits.length === 10;
    }
    default:
      if (value === null || value === undefined) return false;
      return String(value).trim() !== '';
  }
}

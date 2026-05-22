export function formatPrice(value) {
  const num = Number(value);
  if (num < 0) {
    const abs = Math.abs(num);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(abs);
    return `-${formatted}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

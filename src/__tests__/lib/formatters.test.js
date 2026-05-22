import { formatPrice } from '@/lib/formatters';

describe('formatPrice', () => {
  it('formats an integer', () => {
    expect(formatPrice(100)).toBe('$100.00');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats a float to 2 decimal places', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
  });

  it('formats a float that rounds up', () => {
    expect(formatPrice(9.999)).toBe('$10.00');
  });

  it('handles negative values for refunds', () => {
    expect(formatPrice(-25)).toBe('-$25.00');
  });

  it('formats large numbers with comma separators', () => {
    expect(formatPrice(1500)).toBe('$1,500.00');
  });
});

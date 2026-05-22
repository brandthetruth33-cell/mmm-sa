import { calculateProvisionalTotal } from '@/lib/quoteLogic';

describe('calculateProvisionalTotal', () => {
  it('returns 0 when no services are selected', () => {
    expect(calculateProvisionalTotal({ services: [] })).toBe(0);
  });

  it('calculates total from a single service with labor and parts', () => {
    const input = {
      services: [{ laborCost: 100, partsCost: 50 }],
    };
    expect(calculateProvisionalTotal(input)).toBe(150);
  });

  it('sums multiple services correctly', () => {
    const input = {
      services: [
        { laborCost: 100, partsCost: 50 },
        { laborCost: 80, partsCost: 30 },
      ],
    };
    expect(calculateProvisionalTotal(input)).toBe(260);
  });

  it('applies a discount when provided', () => {
    const input = {
      services: [{ laborCost: 100, partsCost: 100 }],
      discount: 50,
    };
    expect(calculateProvisionalTotal(input)).toBe(150);
  });

  it('does not return a negative total', () => {
    const input = {
      services: [{ laborCost: 10, partsCost: 0 }],
      discount: 100,
    };
    expect(calculateProvisionalTotal(input)).toBeGreaterThanOrEqual(0);
  });

  it('handles missing laborCost or partsCost gracefully', () => {
    const input = {
      services: [{ laborCost: 100 }],
    };
    expect(() => calculateProvisionalTotal(input)).not.toThrow();
  });

  it('handles floating point values without precision errors', () => {
    const input = {
      services: [{ laborCost: 19.99, partsCost: 9.99 }],
    };
    expect(calculateProvisionalTotal(input)).toBeCloseTo(29.98, 2);
  });
});

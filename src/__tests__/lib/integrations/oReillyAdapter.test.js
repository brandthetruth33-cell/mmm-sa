import { fetchPartPricing } from '@/lib/integrations/oReillyAdapter';

describe('fetchPartPricing', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns pricing data for a valid part', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ price: 29.99, partNumber: 'ABC123' }),
    });
    const result = await fetchPartPricing({ partNumber: 'ABC123' });
    expect(result).toHaveProperty('price');
    expect(typeof result.price).toBe('number');
  });

  it('returns null for an unknown part number', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const result = await fetchPartPricing({ partNumber: 'UNKNOWN' });
    expect(result).toBeNull();
  });

  it('returns null on network timeout without throwing', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Timeout'));
    const result = await fetchPartPricing({ partNumber: 'ABC123' });
    expect(result).toBeNull();
  });
});

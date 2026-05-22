import { fetchLaborTime } from '@/lib/integrations/proDemandAdapter';

describe('fetchLaborTime', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns labor time data for a valid vehicle and service', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hours: 2.5, operation: 'Oil Change' }),
    });
    const result = await fetchLaborTime({ year: 2020, make: 'Toyota', model: 'Camry', serviceId: 'oil_change' });
    expect(result).toHaveProperty('hours');
    expect(typeof result.hours).toBe('number');
  });

  it('returns null on a failed API response', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const result = await fetchLaborTime({ year: 2020, make: 'Toyota', model: 'Camry', serviceId: 'unknown' });
    expect(result).toBeNull();
  });

  it('returns null on network error without throwing', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Timeout'));
    const result = await fetchLaborTime({});
    expect(result).toBeNull();
  });
});

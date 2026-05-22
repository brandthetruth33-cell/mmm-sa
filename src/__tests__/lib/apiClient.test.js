import { apiClient } from '@/lib/apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns ok: true on a successful response', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ data: 'test' }) });
    const result = await apiClient('/api/test');
    expect(result.ok).toBe(true);
  });

  it('calls fetch with the correct endpoint', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await apiClient('/api/quote/create', { method: 'POST' });
    expect(global.fetch).toHaveBeenCalledWith('/api/quote/create', expect.objectContaining({ method: 'POST' }));
  });

  it('handles a non-ok response without throwing', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ error: 'Server error' }) });
    await expect(apiClient('/api/bad')).resolves.not.toThrow();
  });

  it('propagates network errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(apiClient('/api/test')).rejects.toThrow('Network error');
  });
});

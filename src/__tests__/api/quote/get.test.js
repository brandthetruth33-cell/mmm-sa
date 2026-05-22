import { createMocks } from 'node-mocks-http';
import handler from '@/api/quote/get';

describe('GET /api/quote/get', () => {
  it('responds with 200 and a quote object', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: 'quote-123' } });
    handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('quote');
  });

  it('returns 404 when quoteId is not found', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: 'nonexistent' } });
    handler(req, res);
    expect(res._getStatusCode()).toBe(404);
  });

  it('returns 400 when no id is provided', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });
});

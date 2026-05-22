import { createMocks } from 'node-mocks-http';
import handler from '@/api/quote/create';

describe('POST /api/quote/create', () => {
  it('responds with 200 and a quoteId', async () => {
    const { req, res } = createMocks({ method: 'POST' });
    handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('quoteId');
  });

  it('returns a non-empty quoteId', async () => {
    const { req, res } = createMocks({ method: 'POST' });
    handler(req, res);
    const data = JSON.parse(res._getData());
    expect(data.quoteId).toBeTruthy();
  });

  it('rejects a GET request with 405', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });
});

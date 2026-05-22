import { createMocks } from 'node-mocks-http';
import handler from '@/api/quote/update';

describe('PUT /api/quote/update', () => {
  it('responds with 200 and updated: true', async () => {
    const { req, res } = createMocks({ method: 'PUT', body: { quoteId: 'q1', services: [] } });
    handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.updated).toBe(true);
  });

  it('rejects requests without a quoteId with 400', async () => {
    const { req, res } = createMocks({ method: 'PUT', body: {} });
    handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });
});

import { createMocks } from 'node-mocks-http';
import handler from '@/api/quote/approve';

describe('POST /api/quote/approve', () => {
  it('responds with 200 and approved: true', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { quoteId: 'q1' } });
    handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.approved).toBe(true);
  });

  it('is idempotent — approving twice returns 200 both times', async () => {
    const { req: req1, res: res1 } = createMocks({ method: 'POST', body: { quoteId: 'q1' } });
    const { req: req2, res: res2 } = createMocks({ method: 'POST', body: { quoteId: 'q1' } });
    handler(req1, res1);
    handler(req2, res2);
    expect(res1._getStatusCode()).toBe(200);
    expect(res2._getStatusCode()).toBe(200);
  });

  it('rejects a missing quoteId with 400', async () => {
    const { req, res } = createMocks({ method: 'POST', body: {} });
    handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });
});

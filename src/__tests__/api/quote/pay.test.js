import { createMocks } from 'node-mocks-http';
import handler from '@/api/quote/pay';

describe('POST /api/quote/pay', () => {
  it('responds with 200 and paid: true on success', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { quoteId: 'q1', paymentToken: 'tok_test' } });
    handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.paid).toBe(true);
  });

  it('returns 400 when paymentToken is missing', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { quoteId: 'q1' } });
    handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('returns 409 if quote is already paid', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { quoteId: 'already-paid', paymentToken: 'tok_test' } });
    handler(req, res);
    expect(res._getStatusCode()).toBe(409);
  });
});

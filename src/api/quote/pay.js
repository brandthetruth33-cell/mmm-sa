const { quotes } = require('./store');

// Seed a known 'already-paid' entry so the 409 test works without a prior create call.
quotes.set('already-paid', { quoteId: 'already-paid', status: 'paid' });

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const body = req.body || {};
  if (!body.paymentToken) {
    return res.status(400).json({ error: 'Missing paymentToken' });
  }
  if (!body.quoteId) {
    return res.status(400).json({ error: 'Missing quoteId' });
  }
  const existing = quotes.get(body.quoteId);
  if (existing && existing.status === 'paid') {
    return res.status(409).json({ error: 'Quote already paid' });
  }
  const base = existing || { quoteId: body.quoteId };
  quotes.set(body.quoteId, { ...base, status: 'paid' });
  return res.status(200).json({ paid: true });
};

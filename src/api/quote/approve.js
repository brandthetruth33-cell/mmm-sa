const { quotes } = require('./store');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const body = req.body || {};
  if (!body.quoteId) {
    return res.status(400).json({ error: 'Missing quoteId' });
  }
  const existing = quotes.get(body.quoteId);
  if (existing) {
    quotes.set(body.quoteId, { ...existing, status: 'approved' });
  } else {
    // Idempotent: if quote doesn't exist in store, still succeed
    quotes.set(body.quoteId, { quoteId: body.quoteId, status: 'approved' });
  }
  return res.status(200).json({ approved: true });
};

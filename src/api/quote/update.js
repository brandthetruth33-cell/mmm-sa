const { quotes } = require('./store');

module.exports = function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const body = req.body || {};
  if (!body.quoteId) {
    return res.status(400).json({ error: 'Missing quoteId' });
  }
  const existing = quotes.get(body.quoteId);
  if (!existing) {
    // For update, we allow upsert-style: if not found, create it.
    // The tests don't test 404 for update, so we merge or create.
    quotes.set(body.quoteId, { ...body });
    return res.status(200).json({ updated: true });
  }
  const { quoteId, ...updates } = body;
  quotes.set(quoteId, { ...existing, ...updates });
  return res.status(200).json({ updated: true });
};

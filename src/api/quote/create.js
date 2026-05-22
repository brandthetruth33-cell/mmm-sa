const { quotes } = require('./store');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const quoteId = 'quote-' + Date.now();
  const body = req.body || {};
  quotes.set(quoteId, { ...body, quoteId, status: 'pending', createdAt: new Date().toISOString() });
  return res.status(200).json({ quoteId });
}

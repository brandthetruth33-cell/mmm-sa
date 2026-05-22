const { quotes } = require('./store');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }
  const quote = quotes.get(id);
  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }
  return res.status(200).json({ quote });
};

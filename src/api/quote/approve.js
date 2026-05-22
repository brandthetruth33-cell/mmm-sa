export default function handler(req, res) {
  const body = req.body || {};
  if (!body.quoteId) {
    return res.status(400).json({ error: 'Missing quoteId' });
  }
  res.status(200).json({ approved: true });
}

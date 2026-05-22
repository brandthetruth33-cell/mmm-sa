export default function handler(req, res) {
  const body = req.body || {};
  if (!body.paymentToken) {
    return res.status(400).json({ error: 'Missing paymentToken' });
  }
  if (body.quoteId === 'already-paid') {
    return res.status(409).json({ error: 'Quote already paid' });
  }
  res.status(200).json({ paid: true });
}

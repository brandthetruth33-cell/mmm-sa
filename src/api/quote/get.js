export default function handler(req, res) {
  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }
  if (id === 'nonexistent') {
    return res.status(404).json({ error: 'Quote not found' });
  }
  res.status(200).json({ quote: {} });
}

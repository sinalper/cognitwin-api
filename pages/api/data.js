// Simple in-memory store (resets on redeploy - for production use a database)
// For pilot testing this is sufficient

let store = {};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const key = body.key;
      const value = body.value;
      if (!key) return res.status(400).json({ error: 'key required' });
      store[key] = value;
      return res.status(200).json({ ok: true, key });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'GET') {
    const key = req.query.key;
    if (key) {
      return res.status(200).json({ key, value: store[key] || null });
    }
    // Return all keys
    return res.status(200).json({ keys: Object.keys(store), count: Object.keys(store).length });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

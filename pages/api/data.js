import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body.key) return res.status(400).json({ error: 'key required' });
      await kv.set(body.key, body.value);
      const index = await kv.get('_index') || [];
      if (!index.includes(body.key)) {
        index.push(body.key);
        await kv.set('_index', index);
      }
      return res.status(200).json({ ok: true, key: body.key });
    }

    if (req.method === 'GET') {
      const key = req.query.key;
      if (key) {
        const value = await kv.get(key);
        const strValue = typeof value === 'string' ? value : JSON.stringify(value);
        return res.status(200).json({ key, value: strValue });
      }
      const index = await kv.get('_index') || [];
      return res.status(200).json({ keys: index, count: index.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

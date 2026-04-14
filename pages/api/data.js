import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body.key) return res.status(400).json({ error: 'key required' });

      // Handle clear all
      if (body.action === 'clear_all') {
        const index = await kv.get('_index') || [];
        for (const k of index) { try { await kv.del(k); } catch(_){} }
        await kv.set('_index', []);
        try { await kv.del('_used_topics'); } catch(_){}
        return res.status(200).json({ ok: true, cleared: index.length });
      }

      // Handle delete (value = null)
      if (body.value === null) {
        try { await kv.del(body.key); } catch(_){}
        const index = await kv.get('_index') || [];
        const newIndex = index.filter(k => k !== body.key);
        await kv.set('_index', newIndex);
        return res.status(200).json({ ok: true, deleted: body.key });
      }

      // Normal set
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

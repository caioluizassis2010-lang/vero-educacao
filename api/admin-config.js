// api/admin-config.js
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY não configurada' });

  const sb = createClient('https://lklmzhunhiwqsbhnymaw.supabase.co', serviceKey);

  const { admin_id } = req.body || {};
  if (!admin_id) return res.status(401).json({ error: 'admin_id obrigatório' });

  const { data: perfil } = await sb.from('perfis').select('is_admin').eq('id', admin_id).single();
  if (!perfil?.is_admin) return res.status(403).json({ error: 'Acesso negado' });

  if (req.method === 'GET' || (req.method === 'POST' && req.body.action === 'get')) {
    const { data } = await sb.from('vofor_config').select('*');
    const config = {};
    data?.forEach(row => { config[row.id] = row.valor; });
    return res.status(200).json({ config });
  }

  if (req.method === 'POST' && req.body.action === 'save') {
    const { id, valor } = req.body;
    if (!id || !valor) return res.status(400).json({ error: 'id e valor obrigatórios' });
    const { error } = await sb.from('vofor_config')
      .upsert({ id, valor, updated_at: new Date().toISOString() });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

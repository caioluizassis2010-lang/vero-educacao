// api/admin-update-user.js — Atualiza dados de um usuário
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY não configurada' });

  const sb = createClient('https://lklmzhunhiwqsbhnymaw.supabase.co', serviceKey);

  const { admin_id, target_id, plano, is_admin, nivel } = req.body;
  if (!admin_id || !target_id) return res.status(400).json({ error: 'admin_id e target_id obrigatórios' });

  // Verifica se quem chama é admin
  const { data: perfil } = await sb.from('perfis').select('is_admin').eq('id', admin_id).single();
  if (!perfil?.is_admin) return res.status(403).json({ error: 'Acesso negado' });

  const updates = {};
  if (plano !== undefined) updates.plano = plano;
  if (is_admin !== undefined) updates.is_admin = is_admin;
  if (nivel !== undefined) updates.nivel = nivel;

  const { error } = await sb.from('perfis').update(updates).eq('id', target_id);
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ ok: true });
};

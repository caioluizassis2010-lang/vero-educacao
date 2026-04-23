// api/admin-users.js — Lista usuários com email real (service role)
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY não configurada' });

  const sb = createClient('https://lklmzhunhiwqsbhnymaw.supabase.co', serviceKey);

  // Verifica se quem chama é admin
  const { user_id } = req.body;
  if (!user_id) return res.status(401).json({ error: 'user_id obrigatório' });
  const { data: perfil } = await sb.from('perfis').select('is_admin').eq('id', user_id).single();
  if (!perfil?.is_admin) return res.status(403).json({ error: 'Acesso negado' });

  const { page = 1, limit = 50, search = '' } = req.body;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // Busca perfis
    let query = sb.from('perfis')
      .select('id, area, concurso, nivel, is_admin, plano, diagnostico_completo, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(`concurso.ilike.%${search}%,nivel.ilike.%${search}%`);
    }

    const { data: perfis, count, error } = await query;
    if (error) throw error;

    // Busca emails via auth admin API
    const { data: authData } = await sb.auth.admin.listUsers({ page, perPage: limit });
    const emailMap = {};
    authData?.users?.forEach(u => { emailMap[u.id] = { email: u.email, nome: u.user_metadata?.full_name || u.user_metadata?.nome || '', last_sign_in: u.last_sign_in_at }; });

    // Busca contagem de questões por usuário
    const ids = perfis.map(p => p.id);
    const { data: questoes } = await sb.from('questoes_respondidas').select('user_id').in('user_id', ids);
    const qtdQuestoes = {};
    questoes?.forEach(q => { qtdQuestoes[q.user_id] = (qtdQuestoes[q.user_id] || 0) + 1; });

    // Busca questões de hoje
    const hoje = new Date().toISOString().split('T')[0];
    const { data: questoesHoje } = await sb.from('questoes_respondidas').select('user_id').in('user_id', ids).gte('created_at', hoje);
    const ativoHoje = new Set(questoesHoje?.map(q => q.user_id) || []);

    const usuarios = perfis.map(p => ({
      ...p,
      email: emailMap[p.id]?.email || '—',
      nome: emailMap[p.id]?.nome || '—',
      last_sign_in: emailMap[p.id]?.last_sign_in || null,
      qtd_questoes: qtdQuestoes[p.id] || 0,
      ativo_hoje: ativoHoje.has(p.id),
    }));

    return res.status(200).json({ usuarios, total: count, page, limit });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};

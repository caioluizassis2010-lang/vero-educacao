// api/admin-stats.js — Métricas agregadas do sistema
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY não configurada' });

  const sb = createClient('https://lklmzhunhiwqsbhnymaw.supabase.co', serviceKey);

  const { user_id } = req.body;
  if (!user_id) return res.status(401).json({ error: 'user_id obrigatório' });
  const { data: perfil } = await sb.from('perfis').select('is_admin').eq('id', user_id).single();
  if (!perfil?.is_admin) return res.status(403).json({ error: 'Acesso negado' });

  try {
    const hoje = new Date().toISOString().split('T')[0];
    const set7 = new Date(Date.now() - 7 * 86400000).toISOString();

    const [
      { count: totalUsuarios },
      { count: totalQuestoes },
      { count: totalPlanos },
      { count: ativosHoje },
      { count: ativosSemana },
      { data: acertos },
      { data: disciplinas },
      { data: concursos },
    ] = await Promise.all([
      sb.from('perfis').select('*', { count: 'exact', head: true }),
      sb.from('questoes_respondidas').select('*', { count: 'exact', head: true }),
      sb.from('planos_estudo').select('*', { count: 'exact', head: true }),
      sb.from('questoes_respondidas').select('user_id', { count: 'exact', head: true }).gte('created_at', hoje),
      sb.from('questoes_respondidas').select('user_id', { count: 'exact', head: true }).gte('created_at', set7),
      sb.from('questoes_respondidas').select('acertou'),
      sb.from('questoes_respondidas').select('disciplina, acertou'),
      sb.from('perfis').select('concurso'),
    ]);

    // Taxa média
    const taxaMedia = acertos?.length
      ? Math.round(acertos.filter(q => q.acertou).length / acertos.length * 100)
      : 0;

    // Por disciplina
    const discMap = {};
    disciplinas?.forEach(q => {
      if (!discMap[q.disciplina]) discMap[q.disciplina] = { total: 0, acertos: 0 };
      discMap[q.disciplina].total++;
      if (q.acertou) discMap[q.disciplina].acertos++;
    });
    const discSorted = Object.entries(discMap)
      .map(([d, v]) => ({ disciplina: d, total: v.total, taxa: Math.round(v.acertos / v.total * 100) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Por concurso
    const concMap = {};
    concursos?.forEach(p => { if (p.concurso) concMap[p.concurso] = (concMap[p.concurso] || 0) + 1; });
    const concSorted = Object.entries(concMap)
      .map(([c, n]) => ({ concurso: c, usuarios: n }))
      .sort((a, b) => b.usuarios - a.usuarios)
      .slice(0, 10);

    return res.status(200).json({
      totalUsuarios,
      totalQuestoes,
      totalPlanos,
      ativosHoje,
      ativosSemana,
      taxaMedia,
      disciplinas: discSorted,
      concursos: concSorted,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};

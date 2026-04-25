// api/admin-import-questoes.js
// Importa questões reais via JSON ou CSV para o banco
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY não configurada' });

  const sb = createClient('https://lklmzhunhiwqsbhnymaw.supabase.co', serviceKey);

  const { admin_id, questoes, sistema, banca } = req.body;
  if (!admin_id) return res.status(401).json({ error: 'admin_id obrigatório' });

  const { data: perfil } = await sb.from('perfis').select('is_admin').eq('id', admin_id).single();
  if (!perfil?.is_admin) return res.status(403).json({ error: 'Acesso negado' });

  if (!questoes || !Array.isArray(questoes) || !questoes.length)
    return res.status(400).json({ error: 'Array de questões obrigatório' });

  // Registra importação
  const { data: importacao } = await sb.from('questoes_importacoes').insert({
    admin_id,
    sistema,
    banca,
    total_questoes: questoes.length,
    status: 'processando',
    arquivo_nome: `importacao_${Date.now()}`
  }).select().single();

  let importadas = 0, erros = 0, detalhes = [];

  for (const q of questoes) {
    try {
      // Valida campos obrigatórios
      if (!q.disciplina || !q.enunciado || !q.gabarito) {
        erros++;
        detalhes.push({ erro: 'Campos obrigatórios ausentes', questao: q.enunciado?.substring(0, 50) });
        continue;
      }

      // Normaliza opções
      let opcoes = q.opcoes;
      if (Array.isArray(opcoes) && opcoes.length > 0 && typeof opcoes[0] === 'string') {
        opcoes = opcoes.map((op, i) => ({
          letra: ['A','B','C','D','E'][i] || String(i+1),
          texto: op.replace(/^[A-E]\)\s*/i, '').trim()
        }));
      }

      const { error } = await sb.from('questoes_banco').insert({
        sistema: q.sistema || sistema,
        banca: q.banca || banca,
        ano: q.ano ? parseInt(q.ano) : null,
        cargo: q.cargo || null,
        orgao: q.orgao || null,
        vestibular: q.vestibular || null,
        disciplina: q.disciplina.trim(),
        assunto: q.assunto?.trim() || null,
        subassunto: q.subassunto?.trim() || null,
        dificuldade: q.dificuldade ? parseInt(q.dificuldade) : 3,
        tipo: q.tipo || 'multipla_escolha',
        enunciado: q.enunciado.trim(),
        texto_base: q.texto_base?.trim() || null,
        opcoes: opcoes || null,
        gabarito: q.gabarito.trim().toUpperCase(),
        explicacao: q.explicacao?.trim() || null,
        fonte: 'importada',
        tags: q.tags || [],
        ativo: true
      });

      if (error) {
        erros++;
        detalhes.push({ erro: error.message, questao: q.enunciado?.substring(0, 50) });
      } else {
        importadas++;
      }
    } catch (e) {
      erros++;
      detalhes.push({ erro: e.message, questao: q.enunciado?.substring(0, 50) });
    }
  }

  // Atualiza status da importação
  await sb.from('questoes_importacoes').update({
    importadas, erros,
    status: erros === questoes.length ? 'erro' : 'concluida',
    detalhes: { erros: detalhes }
  }).eq('id', importacao.id);

  return res.status(200).json({
    ok: true,
    importacao_id: importacao.id,
    total: questoes.length,
    importadas,
    erros,
    detalhes: detalhes.slice(0, 10)
  });
};

// api/admin-stats.js — Métricas dos 3 sistemas
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
    const taxa = (arr) => arr?.length ? Math.round(arr.filter(q => q.acertou).length / arr.length * 100) : 0;
    const toMap = (arr, key, valKey) => { const m = {}; arr?.forEach(i => { if(i[key]) m[i[key]] = (m[i[key]]||0) + (valKey ? i[valKey] : 1); }); return m; };
    const topEntries = (m, labelKey, n=8) => Object.entries(m).map(([k,v])=>({[labelKey]:k,usuarios:v})).sort((a,b)=>b.usuarios-a.usuarios).slice(0,n);
    const discStats = (arr) => { const m={}; arr?.forEach(q=>{if(!m[q.disciplina||q.area])m[q.disciplina||q.area]={t:0,a:0};m[q.disciplina||q.area].t++;if(q.acertou)m[q.disciplina||q.area].a++;}); return Object.entries(m).map(([d,v])=>({disciplina:d,total:v.t,taxa:Math.round(v.a/v.t*100)})).sort((a,b)=>b.total-a.total).slice(0,8); };

    const [
      {count:uC},{count:qC},{count:pC},{data:acC},{data:dC},{data:concs},
      {count:uM},{count:qM},{data:acM},{data:dM},{data:vests},
      {count:uE},{count:qE},{count:rE},{data:acE},{data:aE},{data:nR},
      {count:ahC},{count:ahM},{count:ahE},
    ] = await Promise.all([
      sb.from('perfis').select('*',{count:'exact',head:true}),
      sb.from('questoes_respondidas').select('*',{count:'exact',head:true}),
      sb.from('planos_estudo').select('*',{count:'exact',head:true}),
      sb.from('questoes_respondidas').select('acertou'),
      sb.from('questoes_respondidas').select('disciplina,acertou'),
      sb.from('perfis').select('concurso'),
      sb.from('medicina_perfis').select('*',{count:'exact',head:true}),
      sb.from('medicina_questoes').select('*',{count:'exact',head:true}),
      sb.from('medicina_questoes').select('acertou'),
      sb.from('medicina_questoes').select('disciplina,acertou'),
      sb.from('medicina_perfis').select('vestibular_alvo'),
      sb.from('enem_perfis').select('*',{count:'exact',head:true}),
      sb.from('enem_questoes').select('*',{count:'exact',head:true}),
      sb.from('enem_redacoes').select('*',{count:'exact',head:true}),
      sb.from('enem_questoes').select('acertou'),
      sb.from('enem_questoes').select('area,acertou'),
      sb.from('enem_redacoes').select('nota_total'),
      sb.from('questoes_respondidas').select('user_id',{count:'exact',head:true}).gte('created_at',hoje),
      sb.from('medicina_questoes').select('user_id',{count:'exact',head:true}).gte('created_at',hoje),
      sb.from('enem_questoes').select('user_id',{count:'exact',head:true}).gte('created_at',hoje),
    ]);

    return res.status(200).json({
      totalUsuarios:(uC||0)+(uM||0)+(uE||0),
      totalQuestoes:(qC||0)+(qM||0)+(qE||0),
      ativosHoje:(ahC||0)+(ahM||0)+(ahE||0),
      taxaMediaGeral:Math.round((taxa(acC)+taxa(acM)+taxa(acE))/3),
      concursos:{usuarios:uC||0,questoes:qC||0,planos:pC||0,taxaMedia:taxa(acC),ativosHoje:ahC||0,disciplinas:discStats(dC),concursosMaisEstudados:topEntries(toMap(concs,'concurso'),'concurso')},
      medicina:{usuarios:uM||0,questoes:qM||0,taxaMedia:taxa(acM),ativosHoje:ahM||0,disciplinas:discStats(dM),vestibulares:topEntries(toMap(vests,'vestibular_alvo'),'vestibular')},
      enem:{usuarios:uE||0,questoes:qE||0,redacoes:rE||0,taxaMedia:taxa(acE),ativosHoje:ahE||0,notaMediaRedacao:nR?.length?Math.round(nR.reduce((a,r)=>a+(r.nota_total||0),0)/nR.length):0,areas:discStats(aE)},
    });
  } catch(e) { return res.status(500).json({error:e.message}); }
};

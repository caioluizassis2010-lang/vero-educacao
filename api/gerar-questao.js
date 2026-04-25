// /api/gerar-questao.js — versão multi-usuário
// 1) Cache em memória (30 min, até 200 entradas)
// 2) Banco Supabase (questões reutilizadas)
// 3) Fallback automático entre 4 modelos Groq (limites diários separados)
// 4) Prompt compacto (~400 tokens entrada vs ~700 anterior)

const SUPABASE_URL         = 'https://lklmzhunhiwqsbhnymaw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const GROQ_API_KEY         = process.env.GROQ_API_KEY;

// Modelos em ordem — cada um tem limite diário SEPARADO no Groq
const MODELOS_GROQ = [
  { id: 'llama-3.3-70b-versatile', max_tokens: 1200 },
  { id: 'llama-3.1-70b-versatile', max_tokens: 1200 },
  { id: 'llama-3.1-8b-instant',    max_tokens: 1000 },
  { id: 'gemma2-9b-it',            max_tokens: 1000 },
];

// Cache em memória — TTL 30min, máx 200 entradas, até 5 variações por chave
const CACHE = new Map();
const CACHE_MAX = 200;

// ─── Supabase (opcional) ──────────────────────────────────────────────────────
let _sb = null;
async function getSupabase() {
  if (!SUPABASE_SERVICE_KEY) return null;
  if (_sb) return _sb;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    _sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    return _sb;
  } catch (e) { console.warn('[supabase] indisponível:', e.message); return null; }
}

// ─── Estilos compactos ────────────────────────────────────────────────────────
const ESTILOS_BANCA = {
  CESPE:'CESPE/Cebraspe: assertivas diretas, certo/errado implícito.',
  FCC:'FCC: enunciado longo, 5 alternativas completas, sem pegadinhas.',
  FGV:'FGV: texto-base interpretativo, questão contextualizada.',
  VUNESP:'VUNESP: objetivo, alternativas distintas, aplicação prática.',
  CESGRANRIO:'CESGRANRIO: técnica, linguagem formal.',
  ESAF:'ESAF: foco fiscal/tributário.',
  IADES:'IADES: direta, foco em legislação.',
  IBFC:'IBFC: objetivo, alternativas equilibradas.',
  AOCP:'AOCP: regional, linguagem acessível.',
  QUADRIX:'QUADRIX: nível médio-superior.',
  IDECAN:'IDECAN: prática, cargo específico.',
  FUNRIO:'FUNRIO: técnica.',
  CONSULPLAN:'CONSULPLAN: objetiva, alternativas curtas.',
  OBJETIVA:'OBJETIVA: municipal, simples.',
  FEPESE:'FEPESE: regional sul.',
  FUNDATEC:'FUNDATEC: gaúcha, legislação local.',
  NUCEPE:'NUCEPE: piauiense.',
  FUNIVERSA:'FUNIVERSA: DF.',
  UPENET:'UPENET: pernambucana.',
  'UECE-CEV':'UECE-CEV: cearense, raciocínio crítico.',
  'NOVA CONCURSOS':'Nova Concursos: moderna, atualizada.',
  FUVEST:'FUVEST/USP: interdisciplinar, texto-base científico/literário.',
  COMVEST:'COMVEST/Unicamp: contextualizada, argumentação.',
  FAMERP:'FAMERP: técnica, bioquímica/fisiologia.',
  FCMSCSP:'FCMSCSP: casos clínicos, linguagem médica.',
  FMABC:'FMABC/Einstein: raciocínio diagnóstico.',
  UNIFESP:'UNIFESP: interdisciplinar, ciências básicas.',
  UERJ:'UERJ: contextualizada, análise crítica.',
  FAMEMA:'FAMEMA: objetiva, ciências básicas.',
  FMJ:'FMJ: direta, medicina.',
  UFRGS:'UFRGS: texto-base científico.',
  UFMG:'UFMG: interdisciplinar.',
  UFRJ:'UFRJ: biologia e química.',
  UFBA:'UFBA: saúde pública.',
  UFC:'UFC: ciências da natureza.',
  UFPE:'UFPE: raciocínio crítico.',
  UPE:'UPE: anatomia e fisiologia.',
  BAHIANA:'BAHIANA: saúde coletiva.',
  UNIFOR:'UNIFOR: objetiva.',
  UNICHRISTUS:'UNICHRISTUS: medicina clínica.',
  'ENEM-SISU':'ENEM/SISU: texto-base obrigatório (60-100 palavras).',
  INEP:'ENEM/INEP: texto-base OBRIGATÓRIO (60-100 palavras + "Adaptado de [fonte]"), interdisciplinar.',
};

const ASSUNTOS = {
  'Direito Constitucional':['Princípios Fundamentais','Direitos Fundamentais','Organização do Estado','Poder Legislativo','Poder Executivo','Poder Judiciário','Controle de Constitucionalidade','Processo Legislativo','Repartição de Competências','Ordem Econômica'],
  'Direito Administrativo':['Princípios da Administração','Atos Administrativos','Licitações e Contratos','Servidores Públicos','Improbidade Administrativa','Controle da Administração','Responsabilidade Civil','Poder de Polícia','Serviços Públicos','Bens Públicos'],
  'Direito Penal':['Teoria do Crime','Tipicidade','Ilicitude','Crimes contra a Pessoa','Crimes contra o Patrimônio','Penas','Extinção da Punibilidade','Lei de Drogas','Crimes Hediondos','Concurso de Crimes'],
  'Direito Civil':['Pessoas','Negócio Jurídico','Prescrição e Decadência','Contratos','Responsabilidade Civil','Família','Sucessões','Propriedade','Obrigações','Posse'],
  'Português':['Interpretação de Texto','Coesão e Coerência','Sintaxe','Morfologia','Ortografia','Pontuação','Semântica','Figuras de Linguagem','Concordância','Regência'],
  'Raciocínio Lógico':['Proposições','Tabela Verdade','Silogismo','Conjuntos','Sequências','Porcentagem','Probabilidade','Geometria Plana','Progressões','Combinatória'],
  'Informática':['Windows e Linux','Pacote Office','Internet e Segurança','Redes','Hardware','Banco de Dados','LGPD','Cloud Computing','Backup','Algoritmos'],
  'Biologia':['Citologia','Genética Mendeliana','Genética Molecular','Evolução','Ecologia','Fisiologia Humana','Histologia','Embriologia','Botânica','Zoologia'],
  'Química':['Tabela Periódica','Ligações Químicas','Funções Orgânicas','Reações Orgânicas','Termoquímica','Cinética','Equilíbrio Químico','Eletroquímica','Soluções','Estequiometria'],
  'Física':['Mecânica','Termodinâmica','Óptica','Eletrostática','Eletrodinâmica','Magnetismo','Ondas','Física Moderna','Gravitação','Relatividade'],
  'Matemática':['Funções','Geometria Analítica','Trigonometria','Matrizes','Probabilidade','Progressões','Logaritmos','Polinômios','Geometria Plana','Geometria Espacial'],
  'Linguagens':['Interpretação Textual','Literatura Brasileira','Gramática','Produção de Texto','Artes','Música','Cinema','Inglês','Espanhol','Semiótica'],
  'Ciências Humanas':['História do Brasil','História Geral','Geografia do Brasil','Geopolítica','Filosofia','Sociologia','Direitos Humanos','Economia','Cultura','Atualidades'],
  'Ciências da Natureza':['Física Aplicada','Química no Cotidiano','Biologia e Saúde','Ecologia','Genética','Biotecnologia','Astronomia','Energia','Evolução','Corpo Humano'],
  'Matemática e Suas Tecnologias':['Funções','Geometrias','Estatística','Progressões','Matrizes','Trigonometria','Porcentagem','Combinatória','Gráficos','Razão e Proporção'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sortear = arr => arr[Math.floor(Math.random() * arr.length)];
const gabarito_aleatorio = () => sortear(['A','B','C','D','E']);
const escolher_assunto = disc => sortear(ASSUNTOS[disc] || ['Conteúdo geral']);
const normalizar_banca = raw => raw ? raw.split(/[,;]/)[0].trim().toUpperCase() : null;

// ─── Cache ────────────────────────────────────────────────────────────────────
function cache_get(key) {
  const item = CACHE.get(key);
  if (!item) return null;
  if (Date.now() - item.ts > 30 * 60 * 1000) { CACHE.delete(key); return null; }
  return item.questoes[Math.floor(Math.random() * item.questoes.length)];
}
function cache_set(key, questao) {
  if (CACHE.size >= CACHE_MAX) CACHE.delete(CACHE.keys().next().value);
  const item = CACHE.get(key) || { ts: Date.now(), questoes: [] };
  if (item.questoes.length < 5) item.questoes.push(questao);
  item.ts = Date.now();
  CACHE.set(key, item);
}

// ─── Banco Supabase ───────────────────────────────────────────────────────────
async function buscar_no_banco(supabase, { sistema, disciplina, assunto, dificuldade, banca }) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.rpc('buscar_questao_banco', {
      p_sistema: sistema, p_disciplina: disciplina || null,
      p_assunto: assunto || null, p_dificuldade: dificuldade || null,
      p_banca: banca || null, p_excluir_ids: [],
    });
    if (error || !data || !data.length) return null;
    return { ...data[0], _origem: 'banco' };
  } catch (e) { console.warn('[banco]', e.message); return null; }
}

// ─── Gera via IA com fallback de modelos ─────────────────────────────────────
async function gerar_via_ia({ sistema, banca, disciplina, assunto, dificuldade }) {
  const estilo   = ESTILOS_BANCA[banca] || `${banca}: questão objetiva, 5 alternativas A-E.`;
  const gabarito = gabarito_aleatorio();
  const difLabel = { facil:'fácil', medio:'médio', dificil:'difícil' }[dificuldade] || 'médio';
  const textoBaseInstr =
    sistema === 'enem'      ? 'Texto-base: OBRIGATÓRIO, 60-100 palavras, terminar com "Adaptado de [fonte]".' :
    sistema === 'medicina'  ? 'Texto-base: caso clínico quando relevante (30-60 palavras).' :
                              'Texto-base: incluir apenas se enriquecer.';

  const prompt =
`Questão para ${sistema === 'concursos' ? `concurso (${banca})` : sistema === 'medicina' ? `medicina (${banca})` : 'ENEM'}.
Estilo: ${estilo}
Disciplina: ${disciplina} | Assunto: ${assunto} | Dificuldade: ${difLabel}
Gabarito OBRIGATÓRIO: ${gabarito}. ${textoBaseInstr}
Responda SOMENTE JSON sem markdown:
{"texto_base":null,"enunciado":"","opcoes":[{"letra":"A","texto":""},{"letra":"B","texto":""},{"letra":"C","texto":""},{"letra":"D","texto":""},{"letra":"E","texto":""}],"gabarito":"${gabarito}","explicacao_curta":"","explicacao_didatica":""}`;

  let ultimo_erro = 'nenhum modelo disponível';

  for (const modelo of MODELOS_GROQ) {
    try {
      console.log(`[groq] tentando ${modelo.id}`);
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({ model: modelo.id, temperature: 0.8, max_tokens: modelo.max_tokens, messages: [{ role: 'user', content: prompt }] }),
      });

      const txt = await resp.text();

      // Rate limit → próximo modelo
      if (resp.status === 429) {
        console.warn(`[groq] rate limit ${modelo.id} → próximo`);
        ultimo_erro = `rate limit ${modelo.id}`;
        continue;
      }
      if (!resp.ok) {
        ultimo_erro = `erro ${resp.status} em ${modelo.id}`;
        continue;
      }

      let gd;
      try { gd = JSON.parse(txt); } catch { ultimo_erro = 'envelope inválido'; continue; }
      if (gd.error) {
        ultimo_erro = gd.error.message || 'erro no envelope';
        if (String(gd.error.code).includes('rate')) continue;
        continue;
      }

      const content = gd.choices?.[0]?.message?.content?.trim() || '';
      if (!content) { ultimo_erro = 'resposta vazia'; continue; }

      let clean = content.replace(/^```json\s*/i,'').replace(/```\s*$/i,'').trim();
      const s = clean.indexOf('{'), e = clean.lastIndexOf('}');
      if (s === -1 || e === -1) { ultimo_erro = 'sem JSON'; continue; }
      clean = clean.slice(s, e + 1);

      let parsed;
      try { parsed = JSON.parse(clean); } catch (err) { ultimo_erro = `parse: ${err.message}`; continue; }
      if (!parsed.enunciado || !Array.isArray(parsed.opcoes) || parsed.opcoes.length < 4) {
        ultimo_erro = 'campos faltando'; continue;
      }

      console.log(`[groq] sucesso: ${modelo.id}`);
      return { ...parsed, gabarito: parsed.gabarito || gabarito, _modelo: modelo.id, _origem: 'ia' };

    } catch (e) {
      ultimo_erro = e.message;
      continue;
    }
  }

  throw new Error(`Todos os modelos falharam. Último: ${ultimo_erro}`);
}

// ─── Salva no banco (background) ─────────────────────────────────────────────
async function salvar_ia_no_banco(sb, q, { sistema, banca, disciplina, assunto, dificuldade }) {
  if (!sb) return;
  try {
    await sb.from('questoes_banco').insert({
      sistema,
      banca:      sistema === 'concursos' ? banca : null,
      vestibular: sistema !== 'concursos' ? banca : null,
      disciplina, assunto, dificuldade: dificuldade || 'medio',
      tipo: 'multipla_escolha',
      texto_base: q.texto_base || null, enunciado: q.enunciado,
      opcoes: q.opcoes, gabarito: q.gabarito,
      explicacao: q.explicacao_didatica || q.explicacao_curta || null,
      fonte: 'ia_calibrada', ativo: true,
    });
  } catch (e) { console.warn('[salvar_ia]', e.message); }
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { sistema = 'concursos', banca: banca_raw, vestibular: vest_raw,
            disciplina: disc_raw, assunto: assunto_raw, dificuldade = 'medio', usar_banco = true } = req.body || {};

    const banca      = normalizar_banca(banca_raw || vest_raw || (sistema === 'enem' ? 'INEP' : 'CESPE'));
    const disciplina = disc_raw    || (sistema === 'enem' ? 'Linguagens' : sistema === 'medicina' ? 'Biologia' : 'Português');
    const assunto    = assunto_raw || escolher_assunto(disciplina);
    const cache_key  = `${sistema}|${banca}|${disciplina}|${assunto}`;

    const supabase = await getSupabase();
    let questao = null, fonte = 'ia';

    // 1. Banco
    if (usar_banco) {
      questao = await buscar_no_banco(supabase, { sistema, disciplina, assunto, dificuldade, banca });
      if (questao) { fonte = 'banco'; }
    }

    // 2. Cache
    if (!questao) {
      const cached = cache_get(cache_key);
      if (cached) { questao = cached; fonte = 'cache'; }
    }

    // 3. IA com fallback
    if (!questao) {
      questao = await gerar_via_ia({ sistema, banca, disciplina, assunto, dificuldade });
      fonte = 'ia';
      cache_set(cache_key, questao);
      if (supabase) salvar_ia_no_banco(supabase, questao, { sistema, banca, disciplina, assunto, dificuldade });
    }

    return res.status(200).json({
      ok: true, fonte, sistema, banca, disciplina, assunto, dificuldade,
      texto_base:          questao.texto_base || null,
      enunciado:           questao.enunciado,
      opcoes:              questao.opcoes,
      gabarito:            questao.gabarito,
      explicacao_curta:    questao.explicacao_curta    || questao.explicacao?.split('\n')[0] || '',
      explicacao_didatica: questao.explicacao_didatica || questao.explicacao || '',
    });

  } catch (err) {
    console.error('[gerar-questao] erro:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

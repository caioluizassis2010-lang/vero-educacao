// /api/gerar-questao.js
// Lógica: 1) Busca no banco real (Supabase)
//          2) Se não encontrar → gera via IA (Groq)
//          3) Salva questão gerada pela IA no banco (ia_calibrada)

const SUPABASE_URL         = 'https://lklmzhunhiwqsbhnymaw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const GROQ_API_KEY         = process.env.GROQ_API_KEY;

// ─── Supabase opcional ──────────────────────────────────────────────────────────────────────────────────
// Se SUPABASE_SERVICE_KEY nao existir, pula banco e vai direto pra IA
let _sb = null;
async function getSupabase() {
  if (!SUPABASE_SERVICE_KEY) return null;
  if (_sb) return _sb;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    _sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    return _sb;
  } catch (e) {
    console.warn('[supabase] nao disponivel:', e.message);
    return null;
  }
}

// ─── Bancas / estilos ────────────────────────────────────────────────────────
const ESTILOS_BANCA = {
  CESPE:        'Estilo CESPE/Cebraspe: assertivas curtas, verdadeiro ou falso implícito, linguagem direta e técnica.',
  FCC:          'Estilo FCC: enunciado longo e detalhado, 5 alternativas completas, sem pegadinhas.',
  FGV:          'Estilo FGV: texto-base interpretativo, questão contextualizada, alternativas plausíveis.',
  VUNESP:       'Estilo VUNESP: enunciado objetivo, alternativas bem distintas, foco em aplicação prática.',
  CESGRANRIO:   'Estilo CESGRANRIO: questões técnicas e específicas, linguagem formal, foco em conhecimento especializado.',
  ESAF:         'Estilo ESAF: questões fiscais e tributárias, raciocínio lógico aplicado, alternativas com cálculos.',
  IADES:        'Estilo IADES: questões diretas, com foco em legislação e normativas, alternativas curtas.',
  IBFC:         'Estilo IBFC: enunciado objetivo, alternativas equilibradas, foco em conhecimentos gerais.',
  AOCP:         'Estilo AOCP: questões regionais, linguagem acessível, alternativas bem distintas.',
  QUADRIX:      'Estilo QUADRIX: questões de nível médio a superior, linguagem clara, alternativas objetivas.',
  IDECAN:       'Estilo IDECAN: questões práticas, foco em conhecimentos específicos do cargo.',
  FUNRIO:       'Estilo FUNRIO: questões técnicas para cargos específicos, linguagem formal.',
  CONSULPLAN:   'Estilo CONSULPLAN: questões objetivas, alternativas curtas e precisas.',
  OBJETIVA:     'Estilo OBJETIVA: questões de nível municipal, linguagem simples, foco em conhecimentos básicos.',
  FEPESE:       'Estilo FEPESE: questões regionais do sul do Brasil, linguagem clara e direta.',
  FUNDATEC:     'Estilo FUNDATEC: questões gaúchas, foco em legislação estadual e municipal.',
  NUCEPE:       'Estilo NUCEPE: questões do Piauí, linguagem regional, conhecimentos locais.',
  FUNIVERSA:    'Estilo FUNIVERSA: questões do DF, foco em legislação distrital, alternativas equilibradas.',
  UPENET:       'Estilo UPENET: questões pernambucanas, linguagem técnica, foco em saúde e educação.',
  'UECE-CEV':   'Estilo UECE-CEV: questões cearenses, alternativas com raciocínio crítico.',
  'NOVA CONCURSOS': 'Estilo Nova Concursos: questões modernas, linguagem atualizada, alternativas bem elaboradas.',
  // Medicina
  FUVEST:       'Estilo FUVEST (USP): questões interdisciplinares com texto-base literário ou científico, exige interpretação e raciocínio.',
  COMVEST:      'Estilo COMVEST (Unicamp): questões contextualizadas, criativas, exige argumentação.',
  FAMERP:       'Estilo FAMERP: questões técnicas de ciências da saúde, foco em bioquímica e fisiologia.',
  FCMSCSP:      'Estilo FCMSCSP: questões clínicas com casos práticos, linguagem médica técnica.',
  FMABC:        'Estilo FMABC/Einstein: questões com casos clínicos, foco em raciocínio diagnóstico.',
  UNIFESP:      'Estilo UNIFESP: questões interdisciplinares, textos científicos, foco em ciências básicas.',
  UERJ:         'Estilo UERJ: questões contextualizadas, com textos-base variados, exige análise crítica.',
  FAMEMA:       'Estilo FAMEMA: questões objetivas de ciências básicas, alternativas técnicas.',
  FMJ:          'Estilo FMJ: questões diretas de conteúdo médico, alternativas bem distintas.',
  UFRGS:        'Estilo UFRGS: questões com texto-base científico, foco em raciocínio e interpretação.',
  UFMG:         'Estilo UFMG: questões interdisciplinares, texto-base variado, foco em análise.',
  UFRJ:         'Estilo UFRJ: questões com contexto científico, foco em biologia e química.',
  UFBA:         'Estilo UFBA: questões com texto-base regional, foco em saúde pública e ciências.',
  UFC:          'Estilo UFC: questões contextualizadas do nordeste, foco em ciências da natureza.',
  UFPE:         'Estilo UFPE: questões com raciocínio crítico, textos científicos adaptados.',
  UPE:          'Estilo UPE: questões técnicas de medicina, foco em anatomia e fisiologia.',
  BAHIANA:      'Estilo BAHIANA: questões clínicas com casos práticos, foco em saúde coletiva.',
  UNIFOR:       'Estilo UNIFOR: questões objetivas, alternativas equilibradas, foco em ciências básicas.',
  UNICHRISTUS:  'Estilo UNICHRISTUS: questões práticas, linguagem clara, foco em medicina clínica.',
  'ENEM-SISU':  'Estilo ENEM/SISU: texto-base obrigatório (60-120 palavras), questão contextualizada, alternativas plausíveis, padrão INEP.',
  // ENEM
  INEP:         'Estilo ENEM/INEP: OBRIGATÓRIO incluir texto-base (60-120 palavras, com fonte "Adaptado de..."). Questão contextualizada e interdisciplinar. 5 alternativas plausíveis. Linguagem acessível mas exigente.',
};

// ─── Assuntos por área ───────────────────────────────────────────────────────
const ASSUNTOS = {
  // Concursos
  'Direito Constitucional':   ['Princípios Fundamentais','Direitos e Garantias Fundamentais','Organização do Estado','Poder Legislativo','Poder Executivo','Poder Judiciário','Controle de Constitucionalidade','Ordem Econômica e Social','Processo Legislativo','Repartição de Competências'],
  'Direito Administrativo':   ['Princípios da Administração','Atos Administrativos','Licitações e Contratos','Servidores Públicos','Improbidade Administrativa','Controle da Administração','Responsabilidade Civil do Estado','Poder de Polícia','Serviços Públicos','Bens Públicos'],
  'Direito Penal':            ['Teoria do Crime','Tipicidade','Ilicitude e Culpabilidade','Crimes contra a Pessoa','Crimes contra o Patrimônio','Penas e Medidas de Segurança','Extinção da Punibilidade','Lei de Drogas','Crimes Hediondos','Concurso de Crimes'],
  'Direito Civil':            ['Pessoas Naturais e Jurídicas','Negócio Jurídico','Prescrição e Decadência','Contratos em Geral','Responsabilidade Civil','Família','Sucessões','Propriedade','Obrigações','Posse'],
  'Português':                ['Interpretação de Texto','Coesão e Coerência','Sintaxe','Morfologia','Ortografia','Pontuação','Semântica','Figuras de Linguagem','Concordância','Regência'],
  'Raciocínio Lógico':        ['Proposições e Conectivos','Tabela Verdade','Silogismo','Conjuntos','Sequências Numéricas','Porcentagem','Probabilidade','Geometria Plana','Progressões','Análise Combinatória'],
  'Informática':              ['Windows e Linux','Pacote Office','Internet e Segurança','Redes de Computadores','Conceitos de Hardware','Banco de Dados','Algoritmos Básicos','Proteção de Dados (LGPD)','Cloud Computing','Backup e Armazenamento'],
  // Medicina
  'Biologia':                 ['Citologia','Genética Mendeliana','Genética Molecular','Evolução','Ecologia','Fisiologia Humana','Histologia','Embriologia','Botânica','Zoologia'],
  'Química':                  ['Tabela Periódica','Ligações Químicas','Funções Orgânicas','Reações Orgânicas','Termoquímica','Cinética Química','Equilíbrio Químico','Eletroquímica','Soluções','Estequiometria'],
  'Física':                   ['Mecânica Clássica','Termodinâmica','Óptica Geométrica','Eletrostática','Eletrodinâmica','Magnetismo','Ondas e Som','Relatividade Básica','Física Moderna','Gravitação'],
  'Matemática':               ['Funções','Geometria Analítica','Trigonometria','Matrizes e Determinantes','Probabilidade e Estatística','Progressões','Logaritmos','Polinômios','Geometria Plana','Geometria Espacial'],
  // ENEM
  'Linguagens':               ['Interpretação Textual','Literatura Brasileira','Gramática e Norma Culta','Produção de Texto','Artes Visuais','Música e Cultura','Cinema e Mídia','Língua Estrangeira (Inglês)','Língua Estrangeira (Espanhol)','Semiótica'],
  'Ciências Humanas':         ['História do Brasil','História Geral','Geografia do Brasil','Geopolítica','Filosofia','Sociologia','Atualidades','Direitos Humanos','Economia Básica','Cultura e Identidade'],
  'Ciências da Natureza':     ['Física Aplicada','Química no Cotidiano','Biologia e Saúde','Ecologia e Meio Ambiente','Genética Aplicada','Biotecnologia','Astronomia Básica','Energia e Tecnologia','Evolução e Origens','Corpo Humano'],
  'Matemática e Suas Tecnologias': ['Funções no Cotidiano','Geometrias','Estatística e Probabilidade','Progressões','Matrizes Aplicadas','Trigonometria','Financeiro e Porcentagem','Combinatória','Análise Gráfica','Razão e Proporção'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function sortear(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function gabarito_aleatorio() {
  return sortear(['A','B','C','D','E']);
}

function escolher_assunto(disciplina) {
  const lista = ASSUNTOS[disciplina];
  if (!lista) return 'Conteúdo geral';
  return sortear(lista);
}

// Normaliza vestibular_alvo que pode vir como "FUVEST, UERJ" ou "fuvest"
function normalizar_banca(raw) {
  if (!raw) return null;
  const primeiro = raw.split(/[,;]/)[0].trim().toUpperCase();
  return primeiro;
}

// ─── 1. Busca no banco real ──────────────────────────────────────────────────
async function buscar_no_banco(supabase, { sistema, disciplina, assunto, dificuldade, banca }) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.rpc('buscar_questao_banco', {
      p_sistema:     sistema,
      p_disciplina:  disciplina  || null,
      p_assunto:     assunto     || null,
      p_dificuldade: dificuldade || null,
      p_banca:       banca       || null,
      p_excluir_ids: [],
    });

    if (error) {
      console.error('[banco] erro RPC:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    const q = data[0];
    return {
      ...q,
      _origem: 'banco',
    };
  } catch (e) {
    console.error('[banco] exceção:', e.message);
    return null;
  }
}

// ─── 2. Gera via IA (Groq) ───────────────────────────────────────────────────
async function gerar_via_ia({ sistema, banca, disciplina, assunto, dificuldade, nivel }) {
  const estilo   = ESTILOS_BANCA[banca] || `Estilo ${banca}: questão objetiva com 5 alternativas A a E.`;
  const gabarito = gabarito_aleatorio();
  const diff_map = { facil: 'fácil', medio: 'médio', dificil: 'difícil' };
  const diff_label = diff_map[dificuldade] || 'médio';

  const prompt = `Você é um especialista em elaboração de questões para ${
    sistema === 'concursos' ? `concursos públicos (banca ${banca})` :
    sistema === 'medicina'  ? `vestibulares de medicina (${banca})` :
    'ENEM (INEP)'
  }.

${estilo}

Crie UMA questão de múltipla escolha sobre:
- Disciplina: ${disciplina}
- Assunto: ${assunto}
- Dificuldade: ${diff_label}
- Gabarito OBRIGATÓRIO: alternativa ${gabarito}

REGRAS:
1. A alternativa ${gabarito} DEVE ser a CORRETA
2. As demais devem ser plausíveis mas incorretas
3. Não indique qual é o gabarito no enunciado ou nas alternativas
${sistema === 'enem' ? '4. texto_base OBRIGATÓRIO (60-120 palavras, termine com "Adaptado de [fonte realista]")' :
  sistema === 'medicina' ? '4. Inclua texto_base clínico ou científico quando relevante (30-80 palavras)' :
  '4. Inclua texto_base apenas se enriquecer a questão'}

Responda APENAS com este JSON (sem markdown, sem explicação fora do JSON):
{"texto_base":"[texto ou null]","enunciado":"[enunciado completo]","opcoes":[{"letra":"A","texto":"..."},{"letra":"B","texto":"..."},{"letra":"C","texto":"..."},{"letra":"D","texto":"..."},{"letra":"E","texto":"..."}],"gabarito":"${gabarito}","explicacao_curta":"[1 frase explicando a resposta correta]","explicacao_didatica":"[Parágrafo 1: por que ${gabarito} está correta. Parágrafo 2: por que as outras estão erradas. Parágrafo 3: resumo do conteúdo para fixação.]"}`;

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model:       'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens:  1800,
      messages:    [{ role: 'user', content: prompt }],
    }),
  });

  // Lê o body sempre como texto primeiro — evita crash em erros inesperados
  const respText = await resp.text();

  if (!resp.ok) {
    throw new Error(`Groq error ${resp.status}: ${respText.slice(0, 200)}`);
  }

  // Tenta parsear o envelope da API do Groq
  let groqData;
  try {
    groqData = JSON.parse(respText);
  } catch {
    throw new Error(`Groq retornou resposta inválida: ${respText.slice(0, 200)}`);
  }

  // Verifica se veio erro embutido no envelope (status 200 mas com error field)
  if (groqData.error) {
    throw new Error(`Groq error: ${groqData.error.message || JSON.stringify(groqData.error)}`);
  }

  const texto = groqData.choices?.[0]?.message?.content?.trim() || '';
  if (!texto) {
    throw new Error('Groq retornou resposta vazia');
  }

  // Extrai o JSON da resposta — remove ```json ... ``` e qualquer texto fora do objeto
  let clean = texto
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // Se o modelo escreveu texto antes do {, pega só a partir do primeiro {
  const jsonStart = clean.indexOf('{');
  const jsonEnd   = clean.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(`IA não retornou JSON válido. Resposta: ${clean.slice(0, 200)}`);
  }
  clean = clean.slice(jsonStart, jsonEnd + 1);

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch (e) {
    throw new Error(`Erro ao parsear JSON da IA: ${e.message}. Trecho: ${clean.slice(0, 200)}`);
  }

  // Validação mínima
  if (!parsed.enunciado || !Array.isArray(parsed.opcoes) || parsed.opcoes.length < 4) {
    throw new Error('Resposta da IA inválida: faltam campos obrigatórios');
  }

  return {
    ...parsed,
    gabarito: parsed.gabarito || gabarito,
    _origem: 'ia',
  };
}

// ─── 3. Salva questão IA no banco (para aprender) ────────────────────────────
async function salvar_ia_no_banco(supabase, questao, { sistema, banca, disciplina, assunto, dificuldade }) {
  if (!supabase) return;
  try {
    await supabase.from('questoes_banco').insert({
      sistema,
      banca:       sistema === 'concursos' ? banca : null,
      vestibular:  sistema !== 'concursos' ? banca : null,
      disciplina,
      assunto,
      dificuldade: dificuldade || 'medio',
      tipo:        'multipla_escolha',
      texto_base:  questao.texto_base   || null,
      enunciado:   questao.enunciado,
      opcoes:      questao.opcoes,
      gabarito:    questao.gabarito,
      explicacao:  questao.explicacao_didatica || questao.explicacao_curta || null,
      fonte:       'ia_calibrada',
      ativo:       true,
    });
  } catch (e) {
    // Falha silenciosa — não impede a resposta ao usuário
    console.warn('[salvar_ia] falhou:', e.message);
  }
}

// ─── Handler principal ───────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Método não permitido' });

  try {
    const {
      sistema      = 'concursos',
      banca:        banca_raw,
      vestibular:   vestibular_raw,
      disciplina:   disc_raw,
      assunto:      assunto_raw,
      dificuldade   = 'medio',
      nivel         = 'intermediario',
      usar_banco    = true,   // cliente pode forçar sempre IA com usar_banco=false
    } = req.body || {};

    // Normaliza banca
    const banca_origem = banca_raw || vestibular_raw || (sistema === 'enem' ? 'INEP' : 'CESPE');
    const banca        = normalizar_banca(banca_origem);

    // Disciplina e assunto
    const disciplina = disc_raw    || (sistema === 'enem' ? 'Linguagens' : sistema === 'medicina' ? 'Biologia' : 'Português');
    const assunto    = assunto_raw || escolher_assunto(disciplina);

    const supabase = await getSupabase();
    let questao    = null;
    let fonte      = 'ia';

    // ── Etapa 1: tenta banco real ──
    if (usar_banco && SUPABASE_SERVICE_KEY) {
      questao = await buscar_no_banco(supabase, { sistema, disciplina, assunto, dificuldade, banca });
      if (questao) {
        fonte = 'banco';
        console.log(`[gerar-questao] servido do banco: ${questao.id}`);
      }
    }

    // ── Etapa 2: gera via IA ──
    if (!questao) {
      questao = await gerar_via_ia({ sistema, banca, disciplina, assunto, dificuldade, nivel });
      console.log(`[gerar-questao] gerado via IA (${banca} / ${disciplina} / ${assunto})`);

      // Salva no banco em background (sem aguardar)
      if (SUPABASE_SERVICE_KEY) {
        salvar_ia_no_banco(supabase, questao, { sistema, banca, disciplina, assunto, dificuldade });
      }
    }

    // ── Resposta ──
    return res.status(200).json({
      ok:                  true,
      fonte,                          // "banco" ou "ia"
      sistema,
      banca,
      disciplina,
      assunto,
      dificuldade,
      texto_base:          questao.texto_base          || null,
      enunciado:           questao.enunciado,
      opcoes:              questao.opcoes,
      gabarito:            questao.gabarito,
      explicacao_curta:    questao.explicacao_curta    || questao.explicacao?.split('\n')[0] || '',
      explicacao_didatica: questao.explicacao_didatica || questao.explicacao                || '',
    });

  } catch (err) {
    console.error('[gerar-questao] erro:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

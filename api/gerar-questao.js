// /api/gerar-questao.js — v3 com prompts fiéis por banca
// 1) Banco Supabase → Cache → IA
// 2) Prompt específico por banca/vestibular (não genérico)
// 3) CESPE gera Certo/Errado, demais geram A-E
// 4) Fallback automático entre 4 modelos Groq

const SUPABASE_URL         = 'https://lklmzhunhiwqsbhnymaw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const GROQ_API_KEY         = process.env.GROQ_API_KEY;

const MODELOS_GROQ = [
  { id: 'llama-3.3-70b-versatile', max_tokens: 2000, temperature: 0.4 },
  { id: 'llama-3.1-70b-versatile', max_tokens: 2000, temperature: 0.4 },
  { id: 'llama-3.1-8b-instant',    max_tokens: 1600, temperature: 0.4 },
  { id: 'gemma2-9b-it',            max_tokens: 1600, temperature: 0.4 },
];

const CACHE = new Map();
const CACHE_MAX = 200;

// ─── Supabase ─────────────────────────────────────────────────────────────────
let _sb = null;
async function getSupabase() {
  if (!SUPABASE_SERVICE_KEY) return null;
  if (_sb) return _sb;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    _sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    return _sb;
  } catch (e) { console.warn('[supabase]', e.message); return null; }
}

// ─── Assuntos por disciplina ──────────────────────────────────────────────────
const ASSUNTOS = {
  'Direito Constitucional':   ['Princípios Fundamentais','Direitos e Garantias Fundamentais','Poder Legislativo','Poder Executivo','Poder Judiciário','Controle de Constitucionalidade','Organização do Estado','Processo Legislativo','Repartição de Competências','Ordem Econômica e Social'],
  'Direito Administrativo':   ['Princípios da Administração Pública','Atos Administrativos','Licitações e Contratos (Lei 14.133/21)','Servidores Públicos','Improbidade Administrativa','Controle da Administração','Responsabilidade Civil do Estado','Poder de Polícia','Serviços Públicos','Bens Públicos'],
  'Direito Penal':             ['Teoria do Crime','Tipicidade','Ilicitude e Culpabilidade','Crimes contra a Pessoa','Crimes contra o Patrimônio','Penas e Medidas de Segurança','Extinção da Punibilidade','Lei de Drogas (11.343/06)','Crimes Hediondos','Concurso de Crimes'],
  'Direito Civil':             ['Pessoas Naturais e Jurídicas','Negócio Jurídico','Prescrição e Decadência','Contratos em Geral','Responsabilidade Civil','Família','Sucessões','Propriedade','Obrigações','Posse'],
  'Direito Processual Penal':  ['Inquérito Policial','Ação Penal','Prisões e Liberdade Provisória','Provas','Procedimentos','Recursos','Habeas Corpus','Nulidades','Medidas Cautelares','Execução Penal'],
  'Direito Processual Civil':  ['Competência','Petição Inicial','Citação e Intimação','Provas','Sentença e Coisa Julgada','Recursos','Tutela Provisória','Execução','Procedimentos Especiais','Processo de Conhecimento'],
  'Português':                 ['Interpretação de Texto','Coesão e Coerência Textual','Sintaxe da Oração','Morfologia','Ortografia e Acentuação','Pontuação','Semântica e Pragmática','Figuras de Linguagem','Concordância Nominal e Verbal','Regência Nominal e Verbal'],
  'Raciocínio Lógico':         ['Proposições e Conectivos Lógicos','Tabela Verdade','Silogismo e Inferências','Teoria dos Conjuntos','Sequências Numéricas e Alfanuméricas','Porcentagem e Juros','Probabilidade','Geometria Plana','Progressões Aritméticas e Geométricas','Análise Combinatória'],
  'Informática':               ['Windows 10/11 e Linux','Microsoft Office (Word/Excel/PowerPoint)','Internet, Protocolos e Segurança','Redes de Computadores (TCP/IP)','Hardware e Arquitetura','Banco de Dados (SQL básico)','LGPD (Lei 13.709/18)','Cloud Computing','Backup e Armazenamento','Algoritmos e Lógica de Programação'],
  'Administração Pública':     ['Estrutura da Administração Federal','Planejamento e Orçamento Público','Gestão de Pessoas no Setor Público','Controle Interno e Externo','Governança Pública','Processo Administrativo (Lei 9.784/99)','Lei de Acesso à Informação','Ética no Serviço Público','Decreto 9.094/17','Decreto 1.171/94'],
  'Biologia':                  ['Citologia e Bioquímica Celular','Genética Mendeliana','Genética Molecular e Biotecnologia','Evolução e Sistemática','Ecologia e Biomas Brasileiros','Fisiologia Humana (Sistemas)','Histologia e Embriologia','Botânica','Zoologia','Microbiologia e Imunologia'],
  'Química':                   ['Tabela Periódica e Propriedades','Ligações Químicas','Funções Orgânicas e Nomenclatura','Reações Orgânicas','Termoquímica','Cinética Química','Equilíbrio Químico','Eletroquímica','Soluções e Coloides','Estequiometria'],
  'Física':                    ['Cinemática e Dinâmica','Leis de Newton','Energia e Trabalho','Termodinâmica','Óptica Geométrica','Eletrostática','Eletrodinâmica e Circuitos','Magnetismo e Eletromagnetismo','Ondulatória e Acústica','Física Moderna e Radioatividade'],
  'Matemática':                ['Funções e Gráficos','Geometria Analítica','Trigonometria','Matrizes, Determinantes e Sistemas','Probabilidade e Estatística','Progressões (PA e PG)','Logaritmos e Exponenciais','Polinômios e Equações','Geometria Plana','Geometria Espacial'],
  'Linguagens':                ['Interpretação de Textos Literários','Literatura Brasileira (Modernismo/Contemporâneo)','Gramática e Norma Culta','Produção e Gêneros Textuais','Linguagem e Sociedade','Semiótica e Multimodalidade','Artes Visuais e Música','Cinema e Mídia Digital','Língua Inglesa (leitura)','Língua Espanhola (leitura)'],
  'Ciências Humanas':          ['História do Brasil (República)','História Geral (Século XX)','Geografia do Brasil (Regional)','Geopolítica Mundial Contemporânea','Filosofia Política e Ética','Sociologia e Movimentos Sociais','Direitos Humanos e Cidadania','Economia e Globalização','Cultura e Identidade Brasileira','Atualidades e Geopolítica'],
  'Ciências da Natureza':      ['Física Aplicada ao Cotidiano','Química no Cotidiano e Ambiental','Biologia e Saúde Pública','Ecologia, Meio Ambiente e Sustentabilidade','Genética Aplicada e Biotecnologia','Astronomia e Cosmologia Básica','Energia, Tecnologia e Sociedade','Evolução e Origens da Vida','Corpo Humano e Saúde','Ciência e Tecnologia'],
  'Matemática e Suas Tecnologias': ['Funções no Cotidiano','Geometrias (Plana, Espacial, Analítica)','Estatística e Probabilidade','Progressões e Finanças','Trigonometria Aplicada','Porcentagem e Matemática Financeira','Combinatória e Probabilidade','Análise de Gráficos e Tabelas','Razão, Proporção e Grandezas','Equações e Inequações'],
};

// ─── Prompts por banca — fiéis ao estilo real ────────────────────────────────
function build_prompt({ sistema, banca, disciplina, assunto, dificuldade }) {
  const dif = { facil:'fácil', medio:'médio', dificil:'difícil' }[dificuldade] || 'médio';

  // ── CESPE/CEBRASPE ──
  if (banca === 'CESPE' || banca === 'CEBRASPE') {
    return `Você é elaborador de questões da banca CESPE/Cebraspe para concursos públicos federais.

O estilo CESPE é único: apresenta um TEXTO-BASE seguido de uma ASSERTIVA. O candidato deve julgar se a assertiva é CERTA ou ERRADA com base no texto e no conhecimento jurídico/técnico.

Características obrigatórias do estilo CESPE:
- Texto-base: trecho de lei, doutrina, jurisprudência do STF/STJ ou situação hipotética (3-6 linhas)
- Assertiva: afirmação técnica e direta derivada do texto-base, podendo conter erro sutil
- Linguagem: técnica, formal, sem ambiguidade proposital
- Erros comuns inseridos: inversão de conceitos, troca de prazos, confusão entre institutos similares
- NÃO usa alternativas A/B/C/D/E — apenas Certo ou Errado

Disciplina: ${disciplina}
Assunto: ${assunto}
Dificuldade: ${dif}

PROCESSO:
1. Crie um texto-base realista (lei, súmula, caso concreto ou doutrina)
2. Crie uma assertiva que pode ser certa OU errada (decida você qual será)
3. Se errada: insira um erro técnico sutil e realista
4. Verifique a assertiva contra o texto-base e o direito positivo
5. Confirme o gabarito: "Certo" ou "Errado"

Responda SOMENTE JSON válido:
{"texto_base":"[trecho de lei/doutrina/caso - 3 a 6 linhas]","enunciado":"[a assertiva completa que o candidato deve julgar]","opcoes":[{"letra":"C","texto":"Certo"},{"letra":"E","texto":"Errado"}],"gabarito":"C","explicacao_curta":"[por que certo ou errado em 1 frase]","explicacao_didatica":"[análise técnica completa da assertiva, base legal, por que está certa/errada]"}`;
  }

  // ── ENEM/INEP ──
  if (banca === 'INEP' || banca === 'ENEM' || banca === 'ENEM-SISU') {
    return `Você é elaborador de questões do ENEM (INEP) com 15 anos de experiência.

O ENEM tem características únicas e inegociáveis:
- SEMPRE começa com texto-base (80-150 palavras): pode ser literário, jornalístico, científico, charge descrita, dados estatísticos ou situação-problema do cotidiano
- O texto DEVE ter fonte real ou verossímil: "Adaptado de [nome do autor/veículo], [ano]"
- A questão NÃO testa memorização — testa COMPETÊNCIA e RACIOCÍNIO
- As 5 alternativas são longas, elaboradas e todas plausíveis à primeira leitura
- O erro nas alternativas incorretas é conceitual ou de interpretação, nunca óbvio
- Linguagem: acessível mas exigente, interdisciplinar quando possível
- Situações-problema reais: tecnologia, meio ambiente, saúde, cidadania, cultura

Área: ${disciplina}
Assunto: ${assunto}
Dificuldade: ${dif}

PROCESSO OBRIGATÓRIO:
1. Escolha uma situação real e atual relacionada ao assunto
2. Escreva um texto-base rico (80-150 palavras) com fonte
3. Formule uma questão que exige interpretação + conhecimento (não só memorização)
4. Crie 5 alternativas elaboradas — todas plausíveis, apenas 1 correta
5. Verifique cada alternativa contra o texto e o conhecimento da área
6. Defina o gabarito após verificação

Responda SOMENTE JSON válido:
{"texto_base":"[texto rico de 80-150 palavras + Adaptado de fonte]","enunciado":"[pergunta que exige raciocínio, não apenas memorização]","opcoes":[{"letra":"A","texto":"[alternativa elaborada]"},{"letra":"B","texto":""},{"letra":"C","texto":""},{"letra":"D","texto":""},{"letra":"E","texto":""}],"gabarito":"A","explicacao_curta":"[por que a correta está certa]","explicacao_didatica":"[análise de cada alternativa + conceito ensinado]"}`;
  }

  // ── FUVEST/COMVEST ──
  if (banca === 'FUVEST' || banca === 'COMVEST') {
    return `Você elabora questões para vestibulares de medicina de alta complexidade (${banca}).

Características do ${banca}:
- Questões interdisciplinares que cruzam biologia, química, física e atualidades
- Texto-base: artigo científico adaptado, notícia de saúde pública ou pesquisa recente (50-100 palavras)
- Exige raciocínio e aplicação, não só memorização
- As alternativas incorretas são tecnicamente elaboradas e sedutoras
- Nível: muito difícil, exige domínio completo do conteúdo do ensino médio

Disciplina: ${disciplina}
Assunto: ${assunto}
Dificuldade: ${dif} (lembre: ${banca} tem nível naturalmente alto)

PROCESSO:
1. Crie contexto científico realista (dado de pesquisa, situação clínica ou fenômeno natural)
2. Formule questão que exige raciocínio aplicado, não só definição
3. Crie 5 alternativas tecnicamente elaboradas
4. Verifique cada alternativa rigorosamente
5. Defina o gabarito

Responda SOMENTE JSON válido:
{"texto_base":"[contexto científico 50-100 palavras]","enunciado":"[questão que exige raciocínio aplicado]","opcoes":[{"letra":"A","texto":""},{"letra":"B","texto":""},{"letra":"C","texto":""},{"letra":"D","texto":""},{"letra":"E","texto":""}],"gabarito":"A","explicacao_curta":"","explicacao_didatica":"[análise científica completa]"}`;
  }

  // ── Vestibulares de medicina (FAMERP, FCMSCSP, FMABC/Einstein, etc) ──
  if (['FAMERP','FCMSCSP','FMABC','FAMEMA','FMJ','UNIFESP'].includes(banca)) {
    return `Você elabora questões para o vestibular de medicina ${banca}.

Características:
- Foco em ciências básicas (biologia, química, física) com aplicação médica
- Texto-base clínico quando relevante: caso de paciente, dado epidemiológico (30-60 palavras)
- Questões diretas e técnicas sobre conteúdo do ensino médio voltado à área da saúde
- Alternativas precisas, com erros técnicos sutis nas incorretas
- Para biologia: foco em fisiologia humana, genética e bioquímica
- Para química: foco em reações bioquímicas, pH, soluções

Disciplina: ${disciplina}
Assunto: ${assunto}
Dificuldade: ${dif}

PROCESSO:
1. Se biologia/química com aplicação clínica: crie contexto de saúde realista
2. Formule questão técnica e precisa
3. Crie 5 alternativas — a incorreta deve ter erro técnico específico, não óbvio
4. Calcule ou verifique a resposta correta
5. Defina o gabarito

Responda SOMENTE JSON válido:
{"texto_base":"[contexto clínico se aplicável, senão null]","enunciado":"[questão técnica e precisa]","opcoes":[{"letra":"A","texto":""},{"letra":"B","texto":""},{"letra":"C","texto":""},{"letra":"D","texto":""},{"letra":"E","texto":""}],"gabarito":"A","explicacao_curta":"","explicacao_didatica":"[explicação técnica com base científica]"}`;
  }

  // ── Vestibulares de medicina (federais: UFBA, UFMG, UFRJ, UFC, UFPE, etc) ──
  if (sistema === 'medicina') {
    return `Você elabora questões para vestibular de medicina federal/estadual (${banca}).

Características:
- Texto-base: trecho científico, dado epidemiológico ou situação-problema de saúde (40-80 palavras, com fonte)
- Questões interdisciplinares: biologia + química, ou física + biologia
- Exige interpretação e raciocínio científico, não só memorização
- Alternativas elaboradas, plausíveis, com erros técnicos sutis
- Contexto regional/nacional quando aplicável (saúde pública brasileira, biomas)

Disciplina: ${disciplina}
Assunto: ${assunto}
Dificuldade: ${dif}

PROCESSO:
1. Crie texto-base científico realista com fonte
2. Formule questão que exige raciocínio e aplicação do conhecimento
3. Crie 5 alternativas tecnicamente elaboradas
4. Verifique cada alternativa rigorosamente
5. Defina o gabarito correto

Responda SOMENTE JSON válido:
{"texto_base":"[texto científico 40-80 palavras + Adaptado de fonte]","enunciado":"[questão de raciocínio aplicado]","opcoes":[{"letra":"A","texto":""},{"letra":"B","texto":""},{"letra":"C","texto":""},{"letra":"D","texto":""},{"letra":"E","texto":""}],"gabarito":"A","explicacao_curta":"","explicacao_didatica":"[análise científica completa de cada alternativa]"}`;
  }

  // ── FCC ──
  if (banca === 'FCC') {
    return `Você elabora questões para a banca FCC (Fundação Carlos Chagas) para concursos públicos.

Estilo FCC:
- Enunciados longos e completos, sem texto-base (a informação está no próprio enunciado)
- Linguagem formal e técnica
- 5 alternativas completas e bem escritas
- Foco em conhecimento literal da lei, doutrina clássica
- Sem pegadinhas — testa conhecimento direto
- As alternativas incorretas usam termos errados ou trocam conceitos próximos

Disciplina: ${disciplina}
Assunto: ${assunto}
Dificuldade: ${dif}

PROCESSO:
1. Crie enunciado longo com toda informação necessária (situação hipotética ou pergunta direta)
2. Crie 5 alternativas completas e formalmente escritas
3. Verifique cada alternativa contra a legislação/doutrina
4. Defina o gabarito

Responda SOMENTE JSON válido:
{"texto_base":null,"enunciado":"[enunciado longo e completo, 3-5 linhas]","opcoes":[{"letra":"A","texto":"[alternativa completa]"},{"letra":"B","texto":""},{"letra":"C","texto":""},{"letra":"D","texto":""},{"letra":"E","texto":""}],"gabarito":"A","explicacao_curta":"","explicacao_didatica":"[base legal/doutrinária completa]"}`;
  }

  // ── FGV ──
  if (banca === 'FGV') {
    return `Você elabora questões para a banca FGV para concursos públicos.

Estilo FGV:
- Texto-base: trecho de lei, caso concreto elaborado ou jurisprudência (4-8 linhas)
- Questão exige interpretação do texto + conhecimento técnico
- Alternativas elaboradas e contextualmente plausíveis
- Foco em aplicação prática do direito/conhecimento, não só teoria
- Linguagem formal e precisa

Disciplina: ${disciplina}
Assunto: ${assunto}
Dificuldade: ${dif}

PROCESSO:
1. Crie texto-base rico e contextualizado
2. Formule questão que exige interpretação + conhecimento
3. Crie 5 alternativas elaboradas
4. Verifique cada alternativa
5. Defina o gabarito

Responda SOMENTE JSON válido:
{"texto_base":"[texto 4-8 linhas]","enunciado":"[questão interpretativa]","opcoes":[{"letra":"A","texto":""},{"letra":"B","texto":""},{"letra":"C","texto":""},{"letra":"D","texto":""},{"letra":"E","texto":""}],"gabarito":"A","explicacao_curta":"","explicacao_didatica":"[análise completa]"}`;
  }

  // ── VUNESP ──
  if (banca === 'VUNESP') {
    return `Você elabora questões para a banca VUNESP para concursos públicos estaduais/municipais de São Paulo.

Estilo VUNESP:
- Enunciado objetivo e direto (2-4 linhas)
- Texto-base quando necessário: notícia, trecho de lei ou caso prático (3-5 linhas)
- 5 alternativas bem distintas entre si
- Foco em aplicação prática do conhecimento
- Linguagem clara e objetiva, sem hermetismo desnecessário

Disciplina: ${disciplina}
Assunto: ${assunto}
Dificuldade: ${dif}

Responda SOMENTE JSON válido:
{"texto_base":"[se relevante, 3-5 linhas, senão null]","enunciado":"[enunciado objetivo 2-4 linhas]","opcoes":[{"letra":"A","texto":""},{"letra":"B","texto":""},{"letra":"C","texto":""},{"letra":"D","texto":""},{"letra":"E","texto":""}],"gabarito":"A","explicacao_curta":"","explicacao_didatica":"[análise objetiva]"}`;
  }

  // ── Demais bancas de concurso (genérico de qualidade) ──
  return `Você elabora questões para concurso público — banca ${banca}.

Características gerais de qualidade:
- Enunciado claro e tecnicamente preciso
- Texto-base quando enriquece (lei, caso, contexto)
- 5 alternativas elaboradas: 1 correta, 4 incorretas mas plausíveis
- Erros nas incorretas: técnicos e sutis, não óbvios
- Base: legislação vigente, doutrina consolidada, jurisprudência atual

Disciplina: ${disciplina}
Assunto: ${assunto}
Dificuldade: ${dif}

PROCESSO:
1. Crie enunciado preciso sobre o assunto
2. Inclua texto-base se relevante
3. Crie 5 alternativas — verifique cada uma antes de definir o gabarito
4. Defina o gabarito correto após verificação

Responda SOMENTE JSON válido:
{"texto_base":null,"enunciado":"","opcoes":[{"letra":"A","texto":""},{"letra":"B","texto":""},{"letra":"C","texto":""},{"letra":"D","texto":""},{"letra":"E","texto":""}],"gabarito":"A","explicacao_curta":"","explicacao_didatica":""}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sortear = arr => arr[Math.floor(Math.random() * arr.length)];
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

// ─── Gera via IA ──────────────────────────────────────────────────────────────
async function gerar_via_ia({ sistema, banca, disciplina, assunto, dificuldade }) {
  const prompt = build_prompt({ sistema, banca, disciplina, assunto, dificuldade });
  let ultimo_erro = 'nenhum modelo';

  for (const modelo of MODELOS_GROQ) {
    try {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: modelo.id,
          temperature: modelo.temperature,
          max_tokens: modelo.max_tokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const txt = await resp.text();
      if (resp.status === 429) { ultimo_erro = `rate limit ${modelo.id}`; continue; }
      if (!resp.ok) { ultimo_erro = `erro ${resp.status}`; continue; }

      let gd;
      try { gd = JSON.parse(txt); } catch { ultimo_erro = 'envelope inválido'; continue; }
      if (gd.error) { ultimo_erro = gd.error.message; continue; }

      const content = gd.choices?.[0]?.message?.content?.trim() || '';
      if (!content) { ultimo_erro = 'vazio'; continue; }

      let clean = content.replace(/^```json\s*/i,'').replace(/```\s*$/i,'').trim();
      const s = clean.indexOf('{'), e = clean.lastIndexOf('}');
      if (s === -1 || e === -1) { ultimo_erro = 'sem JSON'; continue; }
      clean = clean.slice(s, e + 1);

      let parsed;
      try { parsed = JSON.parse(clean); } catch (err) { ultimo_erro = `parse: ${err.message}`; continue; }
      if (!parsed.enunciado || !Array.isArray(parsed.opcoes) || parsed.opcoes.length < 2) {
        ultimo_erro = 'campos faltando'; continue;
      }

      // Para CESPE: normaliza gabarito C/E → Certo/Errado
      if ((banca === 'CESPE' || banca === 'CEBRASPE') && parsed.opcoes.length === 2) {
        const g = (parsed.gabarito || '').toUpperCase();
        parsed.gabarito = (g === 'C' || g === 'CERTO') ? 'C' : 'E';
      }

      console.log(`[groq] sucesso: ${modelo.id} | ${banca} | ${disciplina}`);
      return { ...parsed, _modelo: modelo.id, _origem: 'ia' };

    } catch (e) { ultimo_erro = e.message; continue; }
  }

  throw new Error(`Todos os modelos falharam. Último: ${ultimo_erro}`);
}

// ─── Salva no banco ───────────────────────────────────────────────────────────
async function salvar_ia_no_banco(sb, q, { sistema, banca, disciplina, assunto, dificuldade }) {
  if (!sb) return;
  try {
    await sb.from('questoes_banco').insert({
      sistema,
      banca:      sistema === 'concursos' ? banca : null,
      vestibular: sistema !== 'concursos' ? banca : null,
      disciplina, assunto, dificuldade: dificuldade || 'medio',
      tipo: (banca === 'CESPE' || banca === 'CEBRASPE') ? 'certo_errado' : 'multipla_escolha',
      texto_base: q.texto_base || null,
      enunciado: q.enunciado,
      opcoes: q.opcoes,
      gabarito: q.gabarito,
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
    const {
      sistema     = 'concursos',
      banca:       banca_raw,
      vestibular:  vest_raw,
      disciplina:  disc_raw,
      assunto:     assunto_raw,
      dificuldade  = 'medio',
      usar_banco   = true,
    } = req.body || {};

    const banca      = normalizar_banca(banca_raw || vest_raw || (sistema === 'enem' ? 'INEP' : 'CESPE'));
    const disciplina = disc_raw    || (sistema === 'enem' ? 'Ciências da Natureza' : sistema === 'medicina' ? 'Biologia' : 'Direito Constitucional');
    const assunto    = assunto_raw || escolher_assunto(disciplina);
    const cache_key  = `${sistema}|${banca}|${disciplina}|${assunto}`;

    const supabase = await getSupabase();
    let questao = null, fonte = 'ia';

    if (usar_banco) {
      questao = await buscar_no_banco(supabase, { sistema, disciplina, assunto, dificuldade, banca });
      if (questao) fonte = 'banco';
    }

    if (!questao) {
      const cached = cache_get(cache_key);
      if (cached) { questao = cached; fonte = 'cache'; }
    }

    if (!questao) {
      questao = await gerar_via_ia({ sistema, banca, disciplina, assunto, dificuldade });
      fonte = 'ia';
      cache_set(cache_key, questao);
      if (supabase) salvar_ia_no_banco(supabase, questao, { sistema, banca, disciplina, assunto, dificuldade });
    }

    return res.status(200).json({
      ok: true, fonte, sistema, banca, disciplina, assunto, dificuldade,
      texto_base:          questao.texto_base          || null,
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

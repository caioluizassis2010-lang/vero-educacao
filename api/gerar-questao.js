// api/gerar-questao.js
const PROMPTS_BANCA = {
  'CESPE': 'Especialista CESPE/CEBRASPE. Afirmativas longas e complexas. Múltipla escolha 5 alternativas (A-E). Linguagem técnica formal nível alto. Pegadinhas nos distratores. Sempre contextualizado com legislação ou situação prática.',
  'FCC': 'Especialista FCC. 5 alternativas objetivas e formais. Enunciado direto. Foco em conhecimento técnico e legislação. Distratores plausíveis mas incorretos.',
  'FGV': 'Especialista FGV. 5 alternativas com texto de contextualização obrigatório. Abordagem crítica e analítica. Casos práticos e situações reais. Nível alto.',
  'VUNESP': 'Especialista VUNESP. 5 alternativas, texto base frequente. Interpretação e aplicação prática. Linguagem técnica.',
  'CESGRANRIO': 'Especialista CESGRANRIO (Petrobras, BB, Marinha). 5 alternativas formais e técnicas. Conhecimentos específicos da área. Nível alto.',
  'ESAF': 'Especialista ESAF (Receita Federal, fiscal). 5 alternativas sobre legislação fiscal e tributária. Interpretação de artigos de lei. Nível muito alto.',
  'IADES': 'Especialista IADES. 5 alternativas, foco em saúde e educação. Linguagem médio-alto.',
  'QUADRIX': 'Especialista QUADRIX (conselhos CRM, CRF). Estilo misto CESPE, foco em regulação profissional.',
  'IBFC': 'Especialista IBFC. 5 alternativas diretas e objetivas. Nível médio.',
  'AOCP': 'Especialista AOCP. 5 alternativas, nível médio, estilo direto.',
  'IDECAN': 'Especialista IDECAN. 5 alternativas objetivas, nível médio.',
  'FUNRIO': 'Especialista FUNRIO. 5 alternativas, foco em saúde e educação, nível médio-alto.',
  'CONSULPLAN': 'Especialista CONSULPLAN. 5 alternativas diretas, nível médio.',
  'OBJETIVA': 'Especialista OBJETIVA (RS). 5 alternativas, nível médio, foco municipal.',
  'FEPESE': 'Especialista FEPESE (SC). 5 alternativas, nível médio.',
  'FUNDATEC': 'Especialista FUNDATEC (RS). 5 alternativas, nível médio.',
  'FUNIVERSA': 'Especialista FUNIVERSA (DF). 5 alternativas, nível médio-alto.',
  'UPENET': 'Especialista UPENET/IAUPE (PE). 5 alternativas, nível médio.',
  'FAURGS': 'Especialista FAURGS (RS). 5 alternativas, nível médio-alto.',
  'FUVEST': 'Especialista FUVEST (USP). Questões altíssimo nível, 5 alternativas. Bio: citologia, genética, ecologia em profundidade. Química orgânica avançada. Física: eletromagnetismo, ótica. Interdisciplinaridade frequente. Contextualização científica moderna. Exige raciocínio profundo, nunca decoreba.',
  'COMVEST': 'Especialista UNICAMP (COMVEST). 4 alternativas (A-D). Abordagem crítica e interdisciplinar única. Textos longos com múltiplas fontes. Forte componente de interpretação e argumentação.',
  'FAMERP': 'Especialista FAMERP. 5 alternativas, foco intenso em Biologia e Química. Nível muito alto em ciências da natureza.',
  'FCMSCSP': 'Especialista Santa Casa SP. 5 alternativas. Biologia médica em profundidade: histologia, anatomia, fisiologia. Nível muito alto.',
  'UERJ': 'Especialista UERJ. 4 alternativas (A-D). Fortemente interdisciplinar. Abordagem crítica da realidade brasileira.',
  'FAMEMA': 'Especialista FAMEMA. 5 alternativas com situações-problema. Foco em competências médicas.',
  'UNIFESP': 'Especialista UNIFESP. 5 alternativas, nível muito alto, ciências da natureza em profundidade.',
  'INEP': 'Especialista ENEM/INEP. REGRAS OBRIGATÓRIAS: (1) SEMPRE inclua texto(s) de apoio variados - pode ser trecho literário, notícia, dados estatísticos, charge descrita, gráfico descrito, poema, texto científico; (2) 5 alternativas (A-E) NUNCA certo/errado; (3) Interdisciplinaridade - misture disciplinas quando possível; (4) Contexto social, ambiental ou cultural sempre presente; (5) Matemática: sempre aplicação prática com situação real; (6) Ciências da Natureza: integre Bio+Física+Química quando possível; (7) Ciências Humanas: integre História+Geografia+Filosofia+Sociologia; (8) O gabarito deve variar - use A, B, C, D ou E de forma aleatória.'
};

// Assuntos por área/disciplina para garantir variedade
const ASSUNTOS = {
  linguagens: ['Interpretação de texto literário','Figuras de linguagem','Coesão e coerência textual','Literatura brasileira modernismo','Literatura barroca','Variação linguística','Funções da linguagem','Gêneros textuais','Intertextualidade','Cronologia literária','Arte e linguagem visual','Cinema e linguagem'],
  matematica: ['Funções do 1° grau','Funções do 2° grau','Progressão aritmética','Progressão geométrica','Trigonometria','Geometria plana — áreas','Geometria espacial — volumes','Probabilidade e combinatória','Estatística — média mediana moda','Porcentagem e juros','Sequências numéricas','Geometria analítica'],
  natureza: ['Ecologia — cadeias alimentares','Ecologia — fluxo de energia','Genética — leis de Mendel','Genética — mutações','Evolução — seleção natural','Fisiologia humana — sistema nervoso','Fisiologia humana — sistema circulatório','Bioquímica — fotossíntese','Química orgânica — hidrocarbonetos','Química — reações redox','Física — termodinâmica','Física — ondas sonoras','Física — óptica geométrica','Física — eletricidade','Física — mecânica — cinemática'],
  humanas: ['História do Brasil — República Velha','História do Brasil — Era Vargas','História do Brasil — Ditadura Militar','História mundial — Segunda Guerra','História mundial — Guerra Fria','Geografia — urbanização brasileira','Geografia — clima e vegetação','Geografia — geopolítica mundial','Filosofia — ética e moral','Filosofia — teorias do conhecimento','Sociologia — estratificação social','Sociologia — movimentos sociais','Direitos humanos e cidadania','Questões ambientais e sustentabilidade'],
  biologia: ['Citologia','Histologia','Genética mendeliana','Genética molecular','Evolução','Ecologia de populações','Fisiologia vegetal','Fisiologia animal','Microbiologia','Parasitologia','Embriologia','Taxonomia e sistemática'],
  quimica: ['Química orgânica — funções oxigenadas','Química orgânica — funções nitrogenadas','Reações orgânicas','Equilíbrio químico','Eletroquímica','Termoquímica','Cinética química','Soluções e concentrações','Ácidos e bases','Tabela periódica e propriedades','Ligações químicas','Isomeria'],
  fisica: ['Mecânica — dinâmica','Mecânica — estática','Mecânica — cinemática','Termodinâmica','Óptica','Ondulatória','Eletrostática','Eletrodinâmica','Magnetismo','Física moderna — relatividade','Física moderna — física quântica'],
  matematica_med: ['Funções','Trigonometria','Geometria analítica','Geometria plana','Geometria espacial','Probabilidade','Estatística','Álgebra','Progressões','Matrizes e determinantes'],
  direito: ['Direito Constitucional — direitos fundamentais','Direito Constitucional — organização do Estado','Direito Administrativo — atos administrativos','Direito Administrativo — licitações','Direito Civil — contratos','Direito Penal — crimes contra a administração','Direito Processual Civil','Direito Tributário','Direito Trabalhista','Lei de Improbidade Administrativa'],
  portugues: ['Interpretação textual','Gramática — concordância verbal','Gramática — concordância nominal','Gramática — regência','Gramática — crase','Pontuação','Semântica — sinonímia e antonímia','Coesão textual','Tipologia textual','Redação oficial'],
  administracao: ['Teorias da administração','Gestão de pessoas','Planejamento estratégico','Orçamento público','Controle interno','Processo administrativo','Administração pública — princípios','Atendimento ao público','Liderança e motivação'],
  informatica: ['Sistemas operacionais','Redes de computadores','Segurança da informação','Banco de dados','Programação básica','Internet e protocolos','Pacote Office','Backup e armazenamento'],
};

function getAssuntosAleatorios(area, disciplina) {
  const chave = area || disciplina?.toLowerCase().replace(/\s/g,'_') || 'portugues';
  const lista = ASSUNTOS[chave] || ASSUNTOS.portugues;
  // Pega um aleatório
  return lista[Math.floor(Math.random() * lista.length)];
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    sistema = 'concursos',
    banca,
    vestibular,
    disciplina,
    assunto,
    area,
    nivel_aluno = 'intermediario',
  } = req.body || {};

  const bancaFinal = banca || vestibular || (sistema === 'enem' ? 'INEP' : sistema === 'medicina' ? 'FUVEST' : 'CESPE');
  const promptBase = PROMPTS_BANCA[bancaFinal] || PROMPTS_BANCA[sistema === 'enem' ? 'INEP' : sistema === 'medicina' ? 'FUVEST' : 'CESPE'];

  const nivelMap = {
    iniciante: 'fácil (nível 1)',
    basico: 'básico (nível 2)',
    intermediario: 'intermediário (nível 3)',
    avancado: 'avançado (nível 4)',
    expert: 'muito difícil (nível 5)'
  };

  // Sorteia assunto para garantir variedade
  const areaChave = area || (sistema === 'enem' ? ['linguagens','matematica','natureza','humanas'][Math.floor(Math.random()*4)] : null);
  const assuntoFinal = assunto || getAssuntosAleatorios(areaChave, disciplina);
  const disciplinaInstr = disciplina ? `Disciplina obrigatória: ${disciplina}.` : '';
  const areaInstr = areaChave ? `Área: ${areaChave}.` : '';
  const assuntoInstr = `Assunto obrigatório: ${assuntoFinal}.`;
  const nivelInstr = `Dificuldade: ${nivelMap[nivel_aluno] || 'intermediário'}.`;

  // Gabarito aleatório para forçar variação
  const gabaritoSugerido = ['A','B','C','D','E'][Math.floor(Math.random()*5)];

  const prompt = `${promptBase}

${areaInstr} ${disciplinaInstr} ${assuntoInstr} ${nivelInstr}

IMPORTANTE: O gabarito correto DEVE ser a alternativa ${gabaritoSugerido}. Construa a questão de forma que ${gabaritoSugerido} seja a única resposta correta.

Crie UMA questão INÉDITA e ORIGINAL sobre o assunto "${assuntoFinal}". Não repita questões genéricas.

Retorne SOMENTE JSON válido puro, sem markdown, sem texto antes ou depois:
{"banca":"${bancaFinal}","area":"${areaChave||''}","disciplina":"nome da disciplina","assunto":"${assuntoFinal}","dificuldade":3,"tipo":"multipla_escolha","texto_base":"texto de apoio se aplicável ou null","enunciado":"enunciado completo e específico da questão","opcoes":[{"letra":"A","texto":"alternativa A completa"},{"letra":"B","texto":"alternativa B completa"},{"letra":"C","texto":"alternativa C completa"},{"letra":"D","texto":"alternativa D completa"},{"letra":"E","texto":"alternativa E completa"}],"gabarito":"${gabaritoSugerido}","explicacao":"Explicação detalhada: por que ${gabaritoSugerido} é correto e por que cada uma das outras está errada"}`;

  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) return res.status(500).json({ error: 'GROQ_API_KEY não configurada no Vercel' });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Você é um criador de questões de concurso. Retorne APENAS JSON válido puro, sem markdown, sem ```json, sem texto antes ou depois. Nunca repita questões. Sempre varie o gabarito conforme solicitado.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1400,
        temperature: 0.8
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return res.status(500).json({ error: `Groq ${groqRes.status}: ${errText.substring(0,200)}` });
    }

    const groqData = await groqRes.json();
    let txt = groqData.choices?.[0]?.message?.content || '';
    txt = txt.replace(/```json|```/g, '').trim();

    const ji = txt.indexOf('{');
    const je = txt.lastIndexOf('}');
    if (ji >= 0 && je > ji) txt = txt.substring(ji, je + 1);

    const questao = JSON.parse(txt);
    if (!questao.enunciado || !questao.gabarito || !questao.opcoes) {
      return res.status(500).json({ error: 'Questão inválida gerada pelo modelo' });
    }

    return res.status(200).json({ ...questao, fonte: 'ia_calibrada', ok: true });

  } catch (e) {
    console.error('gerar-questao error:', e.message);
    return res.status(500).json({ error: e.message });
  }
};

// api/gerar-questao.js
// Gera questão calibrada pela banca — robusto com fallback total

const PROMPTS_BANCA = {
  // CONCURSOS
  'CESPE': 'Você é especialista em provas CESPE/CEBRASPE. Crie questões com afirmativas longas e complexas, linguagem técnica e formal nível alto. Múltipla escolha com 5 alternativas (A-E) ou certo/errado. Pegadinhas nos distratores, sempre contextualizado com legislação ou situação prática.',
  'FCC': 'Você é especialista em provas FCC. Crie questões com 5 alternativas objetivas e formais, enunciado direto sem ambiguidades, foco em conhecimento técnico e legislação específica, distratores plausíveis mas claramente incorretos.',
  'FGV': 'Você é especialista em provas FGV. Crie questões com 5 alternativas, sempre com texto de contextualização, abordagem crítica e analítica, casos práticos e situações reais, nível alto de complexidade.',
  'VUNESP': 'Você é especialista em provas VUNESP. Crie questões com 5 alternativas, texto base frequente, foco em interpretação e aplicação prática, linguagem acessível mas técnica.',
  'CESGRANRIO': 'Você é especialista em provas CESGRANRIO (Petrobras, BB, Marinha). Crie questões com 5 alternativas formais e técnicas, foco em conhecimentos específicos da área, nível alto.',
  'ESAF': 'Você é especialista em provas ESAF (Receita Federal, fiscal). Crie questões com 5 alternativas sobre legislação fiscal e tributária, interpretação de artigos de lei, nível muito alto.',
  'IADES': 'Você é especialista em provas IADES. Crie questões com 5 alternativas, foco em saúde e educação, linguagem médio-alto.',
  'QUADRIX': 'Você é especialista em provas QUADRIX (conselhos profissionais CRM, CRF). Crie questões com estilo misto CESPE, foco em regulação e saúde.',
  'IBFC': 'Você é especialista em provas IBFC. Crie questões com 5 alternativas diretas e objetivas, nível médio.',
  'AOCP': 'Você é especialista em provas AOCP. Crie questões com 5 alternativas, nível médio, estilo direto.',
  'IDECAN': 'Você é especialista em provas IDECAN. Crie questões com 5 alternativas objetivas, nível médio.',
  'FUNRIO': 'Você é especialista em provas FUNRIO. Crie questões com 5 alternativas, foco em saúde e educação, nível médio-alto.',
  'CONSULPLAN': 'Você é especialista em provas CONSULPLAN. Crie questões com 5 alternativas diretas, nível médio.',
  'OBJETIVA': 'Você é especialista em provas OBJETIVA (RS). Crie questões com 5 alternativas, nível médio, foco municipal.',
  'FEPESE': 'Você é especialista em provas FEPESE (SC). Crie questões com 5 alternativas, nível médio, foco estadual SC.',
  'FUNDATEC': 'Você é especialista em provas FUNDATEC (RS). Crie questões com 5 alternativas, nível médio, foco municipal RS.',
  'FUNIVERSA': 'Você é especialista em provas FUNIVERSA (DF/GDF). Crie questões com 5 alternativas, nível médio-alto.',
  'UPENET': 'Você é especialista em provas UPENET/IAUPE (PE). Crie questões com 5 alternativas, nível médio, foco nordeste.',
  'FAURGS': 'Você é especialista em provas FAURGS (RS). Crie questões com 5 alternativas, nível médio-alto.',
  'NUCEPE': 'Você é especialista em provas NUCEPE (PI). Crie questões com 5 alternativas, nível médio.',
  'FADESP': 'Você é especialista em provas FADESP (PA). Crie questões com 5 alternativas, nível médio.',
  'IBAM': 'Você é especialista em provas IBAM (municipal). Crie questões com 5 alternativas, foco em administração municipal.',
  'IESES': 'Você é especialista em provas IESES (SC). Crie questões com 5 alternativas, nível médio.',
  'SOUSÂNDRADE': 'Você é especialista em provas Sousândrade (MA). Crie questões com 5 alternativas, nível médio.',

  // MEDICINA
  'FUVEST': 'Você é especialista em provas FUVEST (USP) — uma das mais difíceis do Brasil. Crie questões de altíssimo nível com 5 alternativas (A-E). Biologia: citologia, genética, ecologia em profundidade. Química orgânica avançada. Física: eletromagnetismo, ótica. Interdisciplinaridade frequente. Contextualização científica moderna. Nunca decoreba — exige raciocínio profundo.',
  'COMVEST': 'Você é especialista em provas UNICAMP (COMVEST). Crie questões com 4 alternativas (A-D), abordagem crítica e interdisciplinar única, textos longos com múltiplas fontes, forte componente de interpretação e argumentação, foge do padrão de outras bancas.',
  'FAMERP': 'Você é especialista em provas FAMERP. Crie questões com 5 alternativas, foco intenso em Biologia e Química (70% da prova), nível muito alto em ciências da natureza.',
  'FCMSCSP': 'Você é especialista em provas Santa Casa SP. Crie questões com 5 alternativas, Biologia médica em profundidade (histologia, anatomia, fisiologia), nível muito alto.',
  'FMABC': 'Você é especialista em provas Einstein (FMABC). Crie questões com 5 alternativas, nível muito alto, foco em raciocínio clínico e ciências básicas.',
  'UERJ': 'Você é especialista em provas UERJ. Crie questões com 4 alternativas (A-D), fortemente interdisciplinar, abordagem crítica da realidade brasileira, duas fases.',
  'FAMEMA': 'Você é especialista em provas FAMEMA. Crie questões com 5 alternativas e situações-problema, foco em competências médicas, metodologia ativa.',
  'UNIFESP': 'Você é especialista em vestibular UNIFESP. Crie questões com 5 alternativas, nível muito alto, ciências da natureza em profundidade.',
  'UEL': 'Você é especialista em vestibular UEL (Londrina). Crie questões com 5 alternativas, nível alto, padrão regional PR.',
  'ACAFE': 'Você é especialista em vestibular ACAFE (SC). Crie questões com 5 alternativas, nível médio-alto, foco regional SC.',
  'BAHIANA': 'Você é especialista em vestibular BAHIANA. Crie questões com 5 alternativas, nível alto, foco em ciências da saúde.',
  'UNIFOR': 'Você é especialista em vestibular UNIFOR. Crie questões com 5 alternativas, nível médio-alto, foco nordeste.',

  // ENEM
  'INEP': 'Você é especialista em provas ENEM (INEP). Regras OBRIGATÓRIAS: SEMPRE inclua texto(s) de apoio (literário, jornalístico, científico, charge ou dados). Avalie COMPETÊNCIAS e HABILIDADES, nunca memorização. 5 alternativas (A-E), nunca certo/errado. Interdisciplinaridade obrigatória. Contexto social, ambiental ou cultural sempre presente. Linguagem acessível mas raciocínio complexo. Matemática: sempre aplicação prática. Natureza: Bio+Física+Química integradas quando possível. Humanas: História+Geografia+Filosofia+Sociologia integradas.'
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    sistema = 'concursos',
    banca,
    vestibular,
    disciplina,
    assunto,
    nivel_aluno = 'intermediario',
  } = req.body || {};

  const bancaFinal = banca || vestibular || (sistema === 'enem' ? 'INEP' : 'CESPE');
  const promptBase = PROMPTS_BANCA[bancaFinal] || PROMPTS_BANCA[
    sistema === 'enem' ? 'INEP' :
    sistema === 'medicina' ? 'FUVEST' : 'CESPE'
  ];

  const nivelMap = {
    iniciante: 'fácil',
    basico: 'básico',
    intermediario: 'intermediário',
    avancado: 'avançado',
    expert: 'muito difícil'
  };

  const disciplinaInstr = disciplina ? `Disciplina: ${disciplina}.` : '';
  const assuntoInstr = assunto ? `Assunto: ${assunto}.` : '';
  const nivelInstr = `Dificuldade: ${nivelMap[nivel_aluno] || 'intermediário'}.`;

  const prompt = `${promptBase}

${disciplinaInstr} ${assuntoInstr} ${nivelInstr}

Crie UMA questão seguindo EXATAMENTE o padrão descrito.

Retorne SOMENTE JSON válido, sem markdown, sem explicação antes ou depois:
{"banca":"${bancaFinal}","disciplina":"nome da disciplina","assunto":"subtópico específico","dificuldade":3,"tipo":"multipla_escolha","texto_base":"texto de apoio obrigatório para ENEM ou null","enunciado":"enunciado completo da questão","opcoes":[{"letra":"A","texto":"alternativa A"},{"letra":"B","texto":"alternativa B"},{"letra":"C","texto":"alternativa C"},{"letra":"D","texto":"alternativa D"},{"letra":"E","texto":"alternativa E"}],"gabarito":"C","explicacao":"Explicação detalhada de por que C é correto e por que as outras são incorretas"}`;

  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) throw new Error('GROQ_API_KEY não configurada');

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Você retorna APENAS JSON válido puro, sem markdown, sem texto antes ou depois.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1200,
        temperature: 0.4
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq error ${groqRes.status}: ${errText}`);
    }

    const groqData = await groqRes.json();
    let txt = groqData.choices?.[0]?.message?.content || '';
    txt = txt.replace(/```json|```/g, '').trim();

    // Garante que pega só o JSON
    const ji = txt.indexOf('{');
    const je = txt.lastIndexOf('}');
    if (ji >= 0 && je > ji) txt = txt.substring(ji, je + 1);

    const questao = JSON.parse(txt);

    if (!questao.enunciado || !questao.gabarito) {
      throw new Error('Questão inválida gerada');
    }

    return res.status(200).json({ ...questao, fonte: 'ia_calibrada', ok: true });

  } catch (e) {
    console.error('gerar-questao error:', e.message);
    return res.status(500).json({
      error: e.message,
      dica: 'Verifique se GROQ_API_KEY está configurada no Vercel'
    });
  }
};

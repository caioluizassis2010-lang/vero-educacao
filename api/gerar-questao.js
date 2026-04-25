// api/gerar-questao.js — v3
// Questões com contexto rico, perspectiva de prova real e explicação didática

// ── PROMPTS CALIBRADOS POR BANCA ──
const PROMPTS_BANCA = {

  'CESPE': `Você é elaborador sênior de questões CESPE/CEBRASPE.
ESTRUTURA OBRIGATÓRIA:
1. TEXTO-BASE (obrigatório): trecho de lei, situação funcional real, caso administrativo ou normativo (3-6 linhas)
2. ENUNCIADO: longo, com múltiplas informações técnicas, linguagem formal nível alto
3. 5 ALTERNATIVAS (A-E): uma correta, quatro com erros sutis tecnicamente plausíveis
4. Sempre baseado em legislação real, princípios constitucionais ou situações administrativas concretas
5. Pegadinhas nos distratores — troca de palavras-chave, negações, exceções à regra`,

  'FCC': `Você é elaborador sênior de questões FCC.
ESTRUTURA OBRIGATÓRIA:
1. TEXTO-BASE quando aplicável: lei, artigo normativo ou situação formal
2. ENUNCIADO: direto, tecnicamente preciso, sem ambiguidade desnecessária
3. 5 ALTERNATIVAS (A-E): formais, distratores que confundem quem não domina o conteúdo
4. Linguagem formal e precisa, sem pegadinhas excessivas`,

  'FGV': `Você é elaborador sênior de questões FGV.
ESTRUTURA OBRIGATÓRIA:
1. CONTEXTO RICO (obrigatório): caso empresarial real, situação de gestão, dados de mercado ou cenário político (4-8 linhas)
2. ENUNCIADO: exige análise crítica do contexto, não decoreba
3. 5 ALTERNATIVAS (A-E): envolvem tomada de decisão ou análise de cenário
4. Nível alto — pensamento analítico e sistêmico`,

  'VUNESP': `Você é elaborador sênior de questões VUNESP.
ESTRUTURA OBRIGATÓRIA:
1. TEXTO-BASE frequente: notícia, artigo, lei ou situação prática
2. ENUNCIADO: interpretação e aplicação prática do texto
3. 5 ALTERNATIVAS (A-E): equilibradas, nível médio-alto`,

  'CESGRANRIO': `Você é elaborador sênior de questões CESGRANRIO.
ESTRUTURA OBRIGATÓRIA:
1. CONTEXTO TÉCNICO específico: setor de petróleo/gás, bancário ou naval quando aplicável
2. ENUNCIADO: exige conhecimento especializado da área
3. 5 ALTERNATIVAS (A-E): formais, técnicas, nível alto`,

  'ESAF': `Você é elaborador sênior de questões ESAF (fiscal/tributário).
ESTRUTURA OBRIGATÓRIA:
1. TEXTO-BASE obrigatório: trecho literal de lei fiscal, regulamento ou portaria
2. ENUNCIADO: pergunta sobre interpretação ou aplicação da norma citada
3. 5 ALTERNATIVAS (A-E): exigem leitura cuidadosa da norma, nível muito alto`,

  'IADES': `Você é elaborador sênior de questões IADES.
ESTRUTURA: texto-base situacional quando aplicável, 5 alternativas, foco em saúde e educação, nível médio-alto.`,

  'QUADRIX': `Você é elaborador sênior de questões QUADRIX (conselhos profissionais).
ESTRUTURA: estilo misto CESPE, foco em regulação profissional e ética, 5 alternativas, nível médio-alto.`,

  'IBFC': `Você é elaborador de questões IBFC. 5 alternativas diretas e objetivas, nível médio, texto-base quando pertinente.`,
  'AOCP': `Você é elaborador de questões AOCP. 5 alternativas, nível médio, estilo direto.`,
  'IDECAN': `Você é elaborador de questões IDECAN. 5 alternativas objetivas, nível médio.`,
  'FUNRIO': `Você é elaborador de questões FUNRIO. 5 alternativas, foco em saúde e educação, nível médio-alto.`,
  'CONSULPLAN': `Você é elaborador de questões CONSULPLAN. 5 alternativas diretas, nível médio.`,
  'OBJETIVA': `Você é elaborador de questões OBJETIVA (RS). 5 alternativas, nível médio, foco municipal.`,
  'FEPESE': `Você é elaborador de questões FEPESE (SC). 5 alternativas, nível médio.`,
  'FUNDATEC': `Você é elaborador de questões FUNDATEC (RS). 5 alternativas, nível médio.`,
  'FUNIVERSA': `Você é elaborador de questões FUNIVERSA (DF). 5 alternativas, nível médio-alto.`,
  'UPENET': `Você é elaborador de questões UPENET (PE). 5 alternativas, nível médio.`,
  'FAURGS': `Você é elaborador de questões FAURGS (RS). 5 alternativas, nível médio-alto.`,

  'FUVEST': `Você é elaborador sênior de questões FUVEST/USP — uma das provas mais exigentes do Brasil.
ESTRUTURA OBRIGATÓRIA:
1. CONTEXTO CIENTÍFICO (obrigatório): experimento real, descoberta científica recente, dado de pesquisa ou situação biológica/química/física concreta (4-6 linhas)
2. ENUNCIADO: exige raciocínio profundo, nunca memorização. Pode envolver interpretação de gráfico descrito, análise de resultado experimental ou aplicação de conceito em situação nova
3. 5 ALTERNATIVAS (A-E): todas plausíveis para quem não domina, mas só uma correta para quem raciocina bem
4. Interdisciplinaridade Bio+Quim ou Fis+Mat frequente
5. Nível muito alto — próximo a vestibulares europeus`,

  'COMVEST': `Você é elaborador sênior de questões UNICAMP/COMVEST.
ESTRUTURA OBRIGATÓRIA:
1. TEXTO COMPOSTO (obrigatório): combine 2 fontes diferentes (Ex: trecho literário + dado científico, ou artigo + charge descrita) — mínimo 6 linhas
2. ENUNCIADO: exige síntese e análise crítica entre as fontes
3. 4 ALTERNATIVAS (A-D): todas elaboradas, exige argumentação para eliminação
4. Interdisciplinaridade marcante, temas contemporâneos e polêmicos
5. Aborda questões de gênero, raça, meio ambiente, ciência e tecnologia`,

  'FAMERP': `Você é elaborador sênior de questões FAMERP.
ESTRUTURA OBRIGATÓRIA:
1. CONTEXTO BIOLÓGICO/QUÍMICO (obrigatório): processo biológico real, reação química, mecanismo celular (4-6 linhas)
2. ENUNCIADO: integra Biologia e Química, exige conhecimento profundo
3. 5 ALTERNATIVAS (A-E): nível muito alto, próximo à FUVEST`,

  'FCMSCSP': `Você é elaborador sênior de questões Santa Casa SP.
ESTRUTURA: contexto biológico médico (histologia, anatomia, fisiologia), 5 alternativas, nível muito alto.`,

  'UERJ': `Você é elaborador sênior de questões UERJ.
ESTRUTURA OBRIGATÓRIA:
1. TEXTO INTERDISCIPLINAR (obrigatório): conecta 2+ disciplinas com texto rico e referências culturais brasileiras (5-8 linhas)
2. ENUNCIADO: pensamento crítico sobre a realidade brasileira
3. 4 ALTERNATIVAS (A-D): exige visão sistêmica`,

  'FAMEMA': `Você é elaborador sênior de questões FAMEMA.
ESTRUTURA: situação-problema clínica ou biológica como contexto, 5 alternativas, competências médicas, metodologia ativa.`,

  'UNIFESP': `Você é elaborador sênior de questões UNIFESP.
ESTRUTURA: contexto científico obrigatório, 5 alternativas, ciências da natureza em profundidade, nível muito alto.`,

  'INEP': `Você é elaborador sênior de questões ENEM/INEP com 20 anos de experiência.
ESTRUTURA OBRIGATÓRIA — SIGA RIGOROSAMENTE:

1. TEXTO-BASE (OBRIGATÓRIO, 80-150 palavras): Escolha UMA das opções:
   a) Trecho literário com autor e obra: "NOME DO AUTOR. Título da obra. Ano." 
   b) Notícia/artigo com fonte: "Adaptado de: VEÍCULO. Título. Data."
   c) Dados de gráfico ou tabela descritos em prosa (descreva o gráfico com dados inventados mas realistas)
   d) Charge descrita detalhadamente com legenda
   e) Trecho histórico ou filosófico com contexto
   f) Letra de música com: "ARTISTA. Título da música. Álbum, Ano."
   g) Texto científico de divulgação com fonte

2. ENUNCIADO: Deve referenciar o texto-base. Use: "Com base no texto", "A partir do trecho", "Considerando os dados apresentados"

3. 5 ALTERNATIVAS (A-E): Completas (não use "apenas a), b) e c)" — escreva cada alternativa por extenso)

4. INTERDISCIPLINARIDADE: Conecte disciplinas quando possível

5. RELEVÂNCIA SOCIAL: Questão deve ter impacto na vida real do candidato`
};

// ── BANCO DE ASSUNTOS POR ÁREA ──
const ASSUNTOS = {
  linguagens: [
    'Interpretação de texto narrativo — ponto de vista e narrador',
    'Figuras de linguagem — metáfora, metonímia e ironia em publicidade',
    'Variação linguística — preconceito linguístico e identidade cultural',
    'Gêneros textuais — crônica jornalística e seus recursos expressivos',
    'Coesão e coerência textual — conectivos e progressão temática',
    'Modernismo brasileiro — Drummond, Bandeira e a poesia do cotidiano',
    'Romantismo brasileiro — José de Alencar e a construção da identidade nacional',
    'Realismo e Naturalismo — Machado de Assis e a crítica à sociedade',
    'Intertextualidade — relações entre textos, paródia e pastiche',
    'Linguagem publicitária — persuasão, argumentação e recursos retóricos',
    'Literatura barroca — Gregório de Matos e o contexto colonial',
    'Modernismo fase heroica — Semana de 22 e a ruptura estética',
  ],
  matematica: [
    'Funções do 1° grau — interpretação gráfica e situações reais de custo',
    'Funções do 2° grau — maximização de lucro e minimização de custos',
    'Geometria plana — áreas em projetos arquitetônicos e terrenos',
    'Geometria espacial — volume de embalagens e projetos industriais',
    'Probabilidade — análise de risco em seguros e saúde pública',
    'Estatística — análise de gráficos e dados do IBGE',
    'Porcentagem — juros compostos e financiamentos imobiliários',
    'Progressão geométrica — crescimento exponencial e epidemias',
    'Trigonometria — aplicações em topografia e engenharia civil',
    'Geometria analítica — distâncias entre pontos em GPS e cartografia',
    'Combinatória — contagem em problemas de segurança digital',
    'Razão e proporção — escala em mapas e modelos reduzidos',
  ],
  natureza: [
    'Ecologia — impacto do desmatamento amazônico na biodiversidade global',
    'Ecologia — ciclo do carbono e aquecimento global',
    'Genética — biotecnologia, transgênicos e impactos na agricultura',
    'Genética — heredograma e probabilidade de doenças hereditárias',
    'Evolução — evidências evolutivas e ancestralidade comum',
    'Fisiologia — sistema imunológico, vacinas e imunidade de rebanho',
    'Fisiologia — nutrição, obesidade e doenças metabólicas',
    'Química orgânica — polímeros, plásticos e impacto ambiental',
    'Química — reações de combustão, poluição e qualidade do ar',
    'Física — termodinâmica, eficiência energética e sustentabilidade',
    'Física — ondas eletromagnéticas e comunicação por satélite',
    'Física — eletricidade, fontes renováveis e matriz energética brasileira',
  ],
  humanas: [
    'República Velha — coronelismo, voto de cabresto e exclusão política',
    'Era Vargas — populismo, trabalhismo e modernização do Brasil',
    'Ditadura Militar — repressão, resistência cultural e AI-5',
    'Redemocratização — Constituição de 1988 e direitos fundamentais',
    'Imperialismo — partilha da África e neocolonialismo',
    'Revolução Industrial — transformações sociais e questão operária',
    'Segunda Guerra Mundial — Holocausto, totalitarismo e direitos humanos',
    'Guerra Fria — disputa ideológica e influência na América Latina',
    'Urbanização brasileira — migração campo-cidade e periferização',
    'Migração e refúgio — causas, fluxos e políticas internacionais',
    'Filosofia Iluminista — contrato social e direitos naturais',
    'Sociologia — desigualdade racial, racismo estrutural e políticas afirmativas',
  ],
  biologia: [
    'Citologia — membrana plasmática, transporte e homeostase celular',
    'Citologia — divisão celular, ciclo celular e câncer',
    'Genética molecular — replicação do DNA, transcrição e tradução',
    'Genética aplicada — CRISPR, edição genômica e ética',
    'Fisiologia — sistema nervoso central, sinapses e neurotransmissores',
    'Fisiologia — sistema endócrino, hormônios e diabetes mellitus',
    'Ecologia de biomas — Cerrado, Caatinga e Mata Atlântica',
    'Microbiologia — resistência bacteriana e uso de antibióticos',
    'Embriologia — desenvolvimento embrionário e células-tronco',
    'Evolução — especiação alopátrica e isolamento reprodutivo',
    'Parasitologia — Aedes aegypti, dengue, zika e saúde pública',
    'Botânica — fotossíntese, ciclo de Calvin e fixação de CO2',
  ],
  quimica: [
    'Química orgânica — isomeria óptica, quiralidade e fármacos',
    'Química orgânica — reações de adição em polímeros e plásticos',
    'Eletroquímica — pilhas, baterias de lítio e veículos elétricos',
    'Equilíbrio químico — princípio de Le Chatelier na indústria',
    'Termoquímica — entalpia de combustão e biocombustíveis',
    'Cinética química — catalisadores na indústria farmacêutica',
    'Soluções — concentração, diluição e soluções intravenosas',
    'Ácidos e bases — pH, tampão biológico e chuva ácida',
    'Radioatividade — medicina nuclear, PET scan e radioterapia',
    'Ligações químicas — propriedades dos materiais e nanotecnologia',
    'Tabela periódica — metais de transição e baterias recarregáveis',
    'Química ambiental — metais pesados, poluição hídrica e bioacumulação',
  ],
  fisica: [
    'Mecânica — leis de Newton aplicadas a colisões em acidentes de trânsito',
    'Mecânica — conservação de energia em esportes radicais',
    'Termodinâmica — máquinas térmicas, rendimento e segunda lei',
    'Óptica — lentes, miopia, hipermetropia e óculos corretivos',
    'Ondulatória — efeito Doppler, ultrassom e diagnóstico médico',
    'Eletrostática — campo elétrico, capacitores e descargas atmosféricas',
    'Eletrodinâmica — circuitos, resistência elétrica e consumo de energia',
    'Magnetismo — indução eletromagnética, geradores e transformadores',
    'Física moderna — efeito fotoelétrico, fótons e energia solar',
    'Física nuclear — fissão, fusão, usinas e Chernobyl',
    'Relatividade — dilatação temporal, GPS e referencial inercial',
    'Física de partículas — modelo padrão e o Bóson de Higgs',
  ],
  direito: [
    'Direito Constitucional — remédios constitucionais habeas corpus, mandado de segurança, mandado de injunção',
    'Direito Constitucional — separação dos poderes e sistema de freios e contrapesos',
    'Direito Administrativo — princípios LIMPE e atos administrativos',
    'Direito Administrativo — licitações Lei 14.133/21 e contratos administrativos',
    'Direito Civil — responsabilidade civil objetiva e subjetiva',
    'Direito Penal — crimes contra a administração pública e peculato',
    'Direito Processual Civil — recursos e prazos processuais',
    'Direito Tributário — impostos, taxas e contribuições de melhoria',
    'Direito Trabalhista — jornada, férias, 13° salário e FGTS',
    'Lei de Improbidade Administrativa — atos e sanções 8.429/92',
    'Lei de Acesso à Informação — transparência, sigilo e prazos',
    'LGPD — Lei Geral de Proteção de Dados — conceitos e obrigações',
  ],
  portugues: [
    'Interpretação textual — inferência, pressuposição e implicatura',
    'Concordância verbal — casos especiais com sujeito composto',
    'Regência verbal — verbos assistir, visar, aspirar e seus complementos',
    'Crase — casos obrigatórios, facultativos e proibidos',
    'Pontuação — vírgula em orações subordinadas adjetivas e adverbiais',
    'Semântica — polissemia, homonímia e ambiguidade em textos legais',
    'Coesão textual — pronomes anafóricos e catafóricos',
    'Tipologia textual — dissertativo-argumentativo e sua estrutura',
    'Redação oficial — manual de redação da Presidência — ofício e memorando',
    'Ortografia — acordo ortográfico de 2009 e casos polêmicos',
  ],
  administracao: [
    'Teorias clássicas — Taylor, Fayol e administração científica',
    'Gestão de pessoas — liderança situacional e modelos de motivação',
    'Planejamento estratégico — análise SWOT e balanced scorecard',
    'Orçamento público — LOA, LDO, PPA e ciclo orçamentário',
    'Controle interno — auditoria, CGU e accountability',
    'Processo administrativo federal — Lei 9.784/99',
    'Nova gestão pública — reforma Bresser-Pereira e agências reguladoras',
    'Atendimento ao público — qualidade, acessibilidade e cidadania',
    'Governança pública — transparência e controle social',
    'Gestão por competências — avaliação de desempenho no setor público',
  ],
};

function getAssunto(area, disciplina) {
  let chave = (area || '').toLowerCase();
  if (!chave && disciplina) {
    const d = disciplina.toLowerCase();
    if (d.includes('bio')) chave = 'biologia';
    else if (d.includes('quim')) chave = 'quimica';
    else if (d.includes('fis') && !d.includes('fisi')) chave = 'fisica';
    else if (d.includes('port') || d.includes('lingu') || d.includes('lit')) chave = 'portugues';
    else if (d.includes('dir')) chave = 'direito';
    else if (d.includes('admin') || d.includes('gest')) chave = 'administracao';
    else if (d.includes('mat')) chave = 'matematica';
    else if (d.includes('human') || d.includes('hist') || d.includes('geo')) chave = 'humanas';
    else if (d.includes('natur') || d.includes('cienc')) chave = 'natureza';
  }
  const lista = ASSUNTOS[chave] || ASSUNTOS['portugues'];
  return lista[Math.floor(Math.random() * lista.length)];
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    sistema = 'concursos',
    banca, vestibular, disciplina, assunto, area,
    nivel_aluno = 'intermediario',
  } = req.body || {};

  const bancaFinal = banca || vestibular || (sistema === 'enem' ? 'INEP' : sistema === 'medicina' ? 'FUVEST' : 'CESPE');
  const promptBase = PROMPTS_BANCA[bancaFinal] || PROMPTS_BANCA[sistema === 'enem' ? 'INEP' : sistema === 'medicina' ? 'FUVEST' : 'CESPE'];

  const nivelMap = { iniciante:'fácil', basico:'básico', intermediario:'intermediário', avancado:'avançado', expert:'muito difícil (nível máximo)' };
  const nivelTxt = nivelMap[nivel_aluno] || 'intermediário';

  const areaFinal = area || null;
  const assuntoFinal = assunto || getAssunto(areaFinal, disciplina);
  const gabaritoSugerido = ['A','B','C','D','E'][Math.floor(Math.random() * 5)];

  const alternativasNum = (bancaFinal === 'COMVEST' || bancaFinal === 'UERJ') ? 4 : 5;
  const letras = ['A','B','C','D','E'].slice(0, alternativasNum);

  const prompt = `${promptBase}

ASSUNTO DESTA QUESTÃO: "${assuntoFinal}"
${disciplina ? `DISCIPLINA: ${disciplina}` : ''}
${areaFinal ? `ÁREA: ${areaFinal}` : ''}
DIFICULDADE: ${nivelTxt}
GABARITO CORRETO: alternativa ${gabaritoSugerido} — construa a questão de forma que ${gabaritoSugerido} seja a ÚNICA resposta correta.

EXPLICAÇÃO DIDÁTICA OBRIGATÓRIA: Após o gabarito, escreva uma explicação de 3-5 parágrafos que:
1. Explique por que a alternativa ${gabaritoSugerido} está correta, com fundamento teórico
2. Explique por que cada uma das outras alternativas está incorreta (cite o erro específico)
3. Ensine o conteúdo por trás da questão — como se fosse um professor explicando para o aluno
4. Se aplicável, cite a lei, artigo, conceito científico ou dado real que fundamenta a resposta

Retorne SOMENTE JSON válido puro, sem markdown:
{
  "banca": "${bancaFinal}",
  "area": "${areaFinal || ''}",
  "disciplina": "nome da disciplina",
  "assunto": "${assuntoFinal}",
  "dificuldade": 3,
  "tipo": "multipla_escolha",
  "texto_base": "texto de apoio OBRIGATÓRIO para ENEM e quando aplicável para outras bancas — mínimo 80 palavras com fonte indicada, ou null para questões sem texto",
  "enunciado": "enunciado completo e específico que referencia o texto quando houver",
  "opcoes": ${JSON.stringify(letras.map(l => ({ letra: l, texto: `alternativa ${l} completa e bem elaborada` })))},
  "gabarito": "${gabaritoSugerido}",
  "explicacao_curta": "feedback imediato — 1 frase dizendo que ${gabaritoSugerido} está correta e por quê",
  "explicacao_didatica": "Explicação completa em 3-5 parágrafos: (1) por que ${gabaritoSugerido} está correta com fundamento teórico, (2) por que cada outra alternativa está errada com o erro específico, (3) ensine o conteúdo como um professor — conceitos, leis, referências"
}`;

  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) return res.status(500).json({ error: 'GROQ_API_KEY não configurada no Vercel' });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Você é elaborador de questões de concurso e vestibular. Retorne APENAS JSON válido puro sem markdown, sem texto antes ou depois. Varie sempre o gabarito conforme solicitado. Crie questões inéditas e originais com contexto rico.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.85
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return res.status(500).json({ error: `Groq ${groqRes.status}: ${errText.substring(0, 300)}` });
    }

    const groqData = await groqRes.json();
    let txt = groqData.choices?.[0]?.message?.content || '';
    txt = txt.replace(/```json|```/g, '').trim();
    const ji = txt.indexOf('{'), je = txt.lastIndexOf('}');
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

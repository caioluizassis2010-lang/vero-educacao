module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    if (!body) body = {};

    const { concurso, nivel, horas_dia, data_prova, desempenho, area } = body;

    // Banco completo de disciplinas por concurso/área
    const EDITAIS = {
      // POLÍCIA CIVIL
      'PC-BA': {
        'Investigador': {
          disciplinas: [
            { nome: 'Português', peso: 15, assuntos: ['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância nominal e verbal','Regência nominal e verbal','Pontuação','Coesão e coerência','Figuras de linguagem','Funções sintáticas'] },
            { nome: 'Raciocínio Lógico', peso: 10, assuntos: ['Proposições lógicas','Conectivos (e, ou, se...então, se e somente se)','Negação de proposições','Silogismo','Lógica de argumentação','Sequências e padrões','Conjuntos','Porcentagem','Probabilidade básica','Diagramas lógicos'] },
            { nome: 'Direito Constitucional', peso: 15, assuntos: ['Princípios fundamentais','Direitos e garantias fundamentais','Organização do Estado','Poder Executivo','Poder Legislativo','Poder Judiciário','Ministério Público','Direitos sociais','Segurança pública','Controle de constitucionalidade'] },
            { nome: 'Direito Penal', peso: 20, assuntos: ['Princípios do Direito Penal','Teoria do crime','Tipicidade','Ilicitude','Culpabilidade','Concurso de pessoas','Penas','Crimes contra a pessoa','Crimes contra o patrimônio','Crimes contra a administração pública','Lei de Drogas (11.343/06)','Estatuto do Desarmamento'] },
            { nome: 'Direito Processual Penal', peso: 15, assuntos: ['Inquérito policial','Ação penal','Competência','Prisão em flagrante','Prisão preventiva','Prisão temporária','Liberdade provisória','Provas','Habeas corpus','Recursos','Execução penal'] },
            { nome: 'Legislação Especial', peso: 10, assuntos: ['ECA (8.069/90)','Maria da Penha (11.340/06)','Crime organizado (12.850/13)','Abuso de autoridade (13.869/19)','Crimes de trânsito (CTB)','Lavagem de dinheiro (9.613/98)','Interceptação telefônica (9.296/96)'] },
            { nome: 'Direito Administrativo', peso: 10, assuntos: ['Princípios da administração','Atos administrativos','Poderes da administração','Agentes públicos','Licitação (14.133/21)','Contratos administrativos','Responsabilidade civil do Estado','Improbidade administrativa'] },
            { nome: 'Informática', peso: 5, assuntos: ['Windows','Word e Excel','Internet e segurança','E-mail','Redes de computadores','Sistemas operacionais','Vírus e malware','Cloud computing'] },
          ]
        },
        'Delegado': {
          disciplinas: [
            { nome: 'Português', peso: 10, assuntos: ['Interpretação de texto','Gramática avançada','Redação oficial','Coesão e coerência'] },
            { nome: 'Direito Constitucional', peso: 15, assuntos: ['Teoria da Constituição','Direitos fundamentais','Organização do Estado','Controle de constitucionalidade','Poder Constituinte','Hermenêutica constitucional'] },
            { nome: 'Direito Penal', peso: 20, assuntos: ['Teoria geral do crime','Teoria da pena','Crimes em espécie (CP)','Lei de Drogas','Crime organizado','Crimes contra a honra','Crimes contra a família','Crimes ambientais'] },
            { nome: 'Direito Processual Penal', peso: 20, assuntos: ['Princípios processuais','Inquérito policial','Ação penal','Competência','Provas','Prisões e liberdade provisória','Nulidades','Recursos','Execução penal','Lei 9.099/95'] },
            { nome: 'Medicina Legal', peso: 10, assuntos: ['Tanatologia','Traumatologia','Sexologia forense','Toxicologia forense','Infortunística','Perícias médico-legais','Documentos médico-legais'] },
            { nome: 'Criminalística', peso: 10, assuntos: ['Local de crime','Documentoscopia','Balística forense','Biologia forense','Perícia contábil e financeira','DNA forense'] },
            { nome: 'Direito Administrativo', peso: 10, assuntos: ['Administração pública','Agentes públicos','Poderes administrativos','Atos administrativos','Licitação','Contratos','Controle da administração'] },
            { nome: 'Legislação Especial', peso: 5, assuntos: ['ECA','Maria da Penha','Abuso de autoridade','Organização criminosa','Lavagem de dinheiro','Estatuto do Desarmamento'] },
          ]
        },
        'Escrivão': {
          disciplinas: [
            { nome: 'Português', peso: 20, assuntos: ['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância','Regência','Redação oficial','Pontuação','Coesão'] },
            { nome: 'Raciocínio Lógico', peso: 10, assuntos: ['Proposições','Conectivos','Tabela verdade','Silogismo','Sequências','Porcentagem','Probabilidade'] },
            { nome: 'Direito Constitucional', peso: 15, assuntos: ['Princípios fundamentais','Direitos fundamentais','Segurança pública','Organização do Estado','Poder Judiciário','MP'] },
            { nome: 'Direito Penal', peso: 15, assuntos: ['Teoria do crime','Crimes contra a pessoa','Crimes contra o patrimônio','Crimes contra a administração','Lei de Drogas','Estatuto do Desarmamento'] },
            { nome: 'Direito Processual Penal', peso: 15, assuntos: ['Inquérito policial','Ação penal','Provas','Prisões','Habeas corpus','Recursos'] },
            { nome: 'Legislação Especial', peso: 10, assuntos: ['ECA','Maria da Penha','Abuso de autoridade','Trânsito'] },
            { nome: 'Informática', peso: 10, assuntos: ['Windows','Office','Internet','Redes','Segurança','Sistemas'] },
            { nome: 'Direito Administrativo', peso: 5, assuntos: ['Princípios','Atos administrativos','Agentes públicos','Licitação básica'] },
          ]
        }
      },
      'PM-BA': {
        'Soldado': {
          disciplinas: [
            { nome: 'Português', peso: 20, assuntos: ['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância nominal e verbal','Regência','Pontuação'] },
            { nome: 'Matemática', peso: 15, assuntos: ['Operações básicas','Frações','Porcentagem','Razão e proporção','Regra de três','Juros simples e compostos','Geometria básica','Estatística básica'] },
            { nome: 'Raciocínio Lógico', peso: 10, assuntos: ['Proposições lógicas','Conectivos','Tabela verdade','Silogismo','Sequências e padrões','Conjuntos'] },
            { nome: 'Direito Constitucional', peso: 15, assuntos: ['Princípios fundamentais','Direitos e garantias fundamentais','Segurança pública','Organização do Estado'] },
            { nome: 'Direito Penal e Processual', peso: 15, assuntos: ['Teoria do crime','Crimes contra a pessoa','Crimes contra o patrimônio','Lei de Drogas','Prisões','Inquérito policial'] },
            { nome: 'Direito Administrativo', peso: 10, assuntos: ['Princípios','Atos administrativos','Poderes da administração','Agentes públicos','Responsabilidade civil'] },
            { nome: 'Noções de Primeiros Socorros', peso: 5, assuntos: ['RCP','Hemorragias','Fraturas','Transporte de acidentados','Estado de choque'] },
            { nome: 'Conhecimentos Gerais', peso: 10, assuntos: ['Atualidades','História da Bahia','Geografia da Bahia','Instituições do Estado BA','Direitos Humanos'] },
          ]
        }
      },
      // INSS
      'INSS': {
        'Técnico do Seguro Social': {
          disciplinas: [
            { nome: 'Português', peso: 15, assuntos: ['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância','Regência','Pontuação','Coesão e coerência','Figuras de linguagem','Redação oficial'] },
            { nome: 'Raciocínio Lógico', peso: 10, assuntos: ['Proposições lógicas','Conectivos','Tabela verdade','Silogismo','Contagem e probabilidade','Sequências','Raciocínio matemático','Porcentagem','Juros','Regra de três'] },
            { nome: 'Direito Constitucional', peso: 10, assuntos: ['Princípios fundamentais','Direitos fundamentais','Ordem social','Seguridade social','Previdência social na CF','Organização do Estado'] },
            { nome: 'Direito Administrativo', peso: 15, assuntos: ['Princípios da administração','Atos administrativos','Poderes administrativos','Organização administrativa','Agentes públicos','Licitação (14.133/21)','Contratos','Controle','Responsabilidade do Estado','Improbidade administrativa'] },
            { nome: 'Direito Previdenciário', peso: 25, assuntos: ['Seguridade social (CF)','RGPS — custeio','RGPS — benefícios','Segurados obrigatórios','Segurado facultativo','Salário de contribuição','Aposentadorias','Auxílios','Salário-maternidade','Pensão por morte','BPC/LOAS','Acidente do trabalho','Decadência e prescrição','Processo administrativo previdenciário'] },
            { nome: 'Legislação Previdenciária', peso: 15, assuntos: ['Lei 8.212/91','Lei 8.213/91','Decreto 3.048/99','EC 103/2019 (Reforma da Previdência)','RPS — Regulamento','Instrução Normativa INSS'] },
            { nome: 'Informática', peso: 10, assuntos: ['Windows 10/11','Word','Excel','Outlook','Internet','Segurança digital','Redes básicas','Cloud','Sistemas de informação'] },
          ]
        },
        'Analista do Seguro Social': {
          disciplinas: [
            { nome: 'Português', peso: 10, assuntos: ['Interpretação de texto','Redação oficial','Gramática avançada','Coesão e coerência','Linguística textual'] },
            { nome: 'Direito Constitucional', peso: 10, assuntos: ['Teoria da Constituição','Direitos fundamentais','Ordem econômica e social','Seguridade social','Controle de constitucionalidade','Poder Constituinte'] },
            { nome: 'Direito Administrativo', peso: 15, assuntos: ['Princípios','Organização administrativa','Atos administrativos','Poderes','Agentes públicos','Licitação','Contratos','Controle','Responsabilidade','Improbidade'] },
            { nome: 'Direito Previdenciário', peso: 25, assuntos: ['Seguridade social','Previdência na CF','Custeio — Lei 8.212','Benefícios — Lei 8.213','Acidente do trabalho','Reforma da previdência EC 103','Jurisprudência STJ/TNU'] },
            { nome: 'Direito do Trabalho', peso: 10, assuntos: ['Relação de emprego','Contrato de trabalho','Jornada de trabalho','Remuneração','Férias','FGTS','Rescisão contratual','Processo trabalhista'] },
            { nome: 'Raciocínio Lógico e Estatística', peso: 10, assuntos: ['Lógica proposicional','Estatística descritiva','Probabilidade','Raciocínio matemático','Análise combinatória'] },
            { nome: 'Administração Pública', peso: 10, assuntos: ['Gestão pública','Planejamento estratégico','Gestão de processos','Governança pública','Transparência e controle'] },
            { nome: 'Informática', peso: 10, assuntos: ['Office avançado','Sistemas de informação','Banco de dados','Redes','Segurança','LGPD'] },
          ]
        }
      },
      // BANCO DO BRASIL
      'Banco do Brasil': {
        'Escriturário — Agente Comercial': {
          disciplinas: [
            { nome: 'Português', peso: 15, assuntos: ['Interpretação de texto','Ortografia','Concordância','Regência','Crase','Pontuação','Redação'] },
            { nome: 'Matemática e Raciocínio Lógico', peso: 20, assuntos: ['Porcentagem','Juros simples e compostos','Amortização','Desconto','Taxa de juros','Regra de três','Probabilidade','Estatística','Sequências','Lógica proposicional'] },
            { nome: 'Atualidades do Mercado Financeiro', peso: 15, assuntos: ['Sistema Financeiro Nacional','Banco Central do Brasil','CMN','CVM','Instituições financeiras','Produtos bancários','Crédito e cobrança','Garantias','Compliance e ética','LGPD no setor financeiro'] },
            { nome: 'Conhecimentos Bancários', peso: 20, assuntos: ['Operações ativas e passivas','CDB/RDB','Poupança','Fundos de investimento','Previdência privada','Seguros','Câmbio','Mercado de capitais','Crédito imobiliário','Crédito rural','Cartões de crédito','PIX e meios de pagamento'] },
            { nome: 'Direito e Legislação', peso: 10, assuntos: ['Direito do consumidor (CDC)','Crimes contra o SFN','Lavagem de dinheiro','LGPD','Sigilo bancário','Código Civil — contratos'] },
            { nome: 'Tecnologia e Inovação', peso: 10, assuntos: ['Open banking','Fintechs','Blockchain','Criptomoedas','Inteligência artificial no setor bancário','Cybersegurança','Cloud banking'] },
            { nome: 'Vendas e Negociação', peso: 10, assuntos: ['Técnicas de vendas','Perfil do cliente','Marketing bancário','Gestão de relacionamento','Satisfação e fidelização'] },
          ]
        }
      },
      // CEF
      'CEF': {
        'Técnico Bancário Novo — Suporte de Negócio': {
          disciplinas: [
            { nome: 'Português', peso: 15, assuntos: ['Interpretação de texto','Gramática','Redação','Coesão e coerência'] },
            { nome: 'Matemática Financeira', peso: 20, assuntos: ['Porcentagem','Juros simples e compostos','Amortização (SAC e PRICE)','VP e VF','TIR e TMA','Desconto bancário','Equivalência de capitais'] },
            { nome: 'Conhecimentos Bancários', peso: 20, assuntos: ['SFN','Banco Central','Produtos e serviços bancários','Crédito imobiliário — SFH/SFI','FGTS','Habitação','Saneamento','Fundos de investimento','Poupança','Previdência','Seguros'] },
            { nome: 'Vendas e Atendimento', peso: 15, assuntos: ['Técnicas de vendas','Perfil de cliente','Marketing','Negociação','CRM','NPS'] },
            { nome: 'Legislação', peso: 15, assuntos: ['LGPD','CDC','Lavagem de dinheiro','Prevenção a fraudes','Sigilo bancário','Compliance'] },
            { nome: 'Raciocínio Lógico', peso: 10, assuntos: ['Lógica proposicional','Sequências','Conjuntos','Probabilidade','Estatística básica'] },
            { nome: 'Informática', peso: 5, assuntos: ['Office','Internet','Segurança digital','Sistemas bancários','Open banking'] },
          ]
        }
      },
      // TJ genérico
      'TJ': {
        'Analista Judiciário': {
          disciplinas: [
            { nome: 'Português', peso: 15, assuntos: ['Interpretação de texto','Gramática','Redação','Coesão e coerência','Linguística'] },
            { nome: 'Raciocínio Lógico', peso: 10, assuntos: ['Proposições','Conectivos','Silogismo','Sequências','Conjuntos','Probabilidade'] },
            { nome: 'Direito Constitucional', peso: 20, assuntos: ['Princípios fundamentais','Direitos fundamentais','Organização do Estado','Poder Judiciário','MP','Controle de constitucionalidade','Hermenêutica'] },
            { nome: 'Direito Administrativo', peso: 20, assuntos: ['Princípios','Organização administrativa','Atos administrativos','Poderes','Agentes públicos','Licitação','Contratos','Controle','Responsabilidade','Improbidade'] },
            { nome: 'Direito Civil', peso: 15, assuntos: ['LINDB','Pessoas físicas e jurídicas','Bens','Fatos jurídicos','Negócio jurídico','Prescrição e decadência','Família','Sucessões','Contratos','Responsabilidade civil'] },
            { nome: 'Direito Processual Civil', peso: 15, assuntos: ['Princípios processuais','Competência','Partes','Atos processuais','Petição inicial','Resposta do réu','Provas','Sentença','Recursos','Execução','Tutelas de urgência'] },
            { nome: 'Informática', peso: 5, assuntos: ['Office','Internet','Sistemas judiciários (PJe)','Redes','Segurança'] },
          ]
        },
        'Técnico Judiciário': {
          disciplinas: [
            { nome: 'Português', peso: 20, assuntos: ['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância','Regência','Pontuação','Redação oficial'] },
            { nome: 'Raciocínio Lógico', peso: 15, assuntos: ['Proposições lógicas','Conectivos','Silogismo','Sequências','Porcentagem','Probabilidade'] },
            { nome: 'Direito Constitucional', peso: 20, assuntos: ['Princípios fundamentais','Direitos fundamentais','Poder Judiciário','Organização do Estado','Garantias processuais'] },
            { nome: 'Direito Administrativo', peso: 20, assuntos: ['Princípios','Atos administrativos','Agentes públicos','Licitação','Contratos','Responsabilidade'] },
            { nome: 'Noções de Direito Processual Civil', peso: 15, assuntos: ['Atos processuais','Petição inicial','Citação','Recursos','Execução'] },
            { nome: 'Informática', peso: 10, assuntos: ['Windows','Word','Excel','Internet','Segurança','PJe básico'] },
          ]
        }
      },
      // Receita Federal
      'Receita Federal': {
        'Auditor Fiscal': {
          disciplinas: [
            { nome: 'Português', peso: 5, assuntos: ['Interpretação de texto','Redação oficial','Gramática avançada'] },
            { nome: 'Direito Constitucional', peso: 10, assuntos: ['Teoria da Constituição','Direitos fundamentais','Ordem econômica','Sistema tributário nacional','Controle de constitucionalidade'] },
            { nome: 'Direito Tributário', peso: 25, assuntos: ['Sistema tributário nacional','Competência tributária','Princípios tributários','CTN — Obrigação tributária','CTN — Crédito tributário','Lançamento','Extinção do crédito','Exclusão do crédito','Garantias e privilégios','Administração tributária','Impostos federais (IR, IPI, IOF, ITR, II, IE)','PIS/COFINS','CSLL','CIDE','Simples Nacional','Processo administrativo fiscal'] },
            { nome: 'Direito Aduaneiro', peso: 15, assuntos: ['Controle aduaneiro','Despacho de importação','Despacho de exportação','Regimes aduaneiros especiais','Valor aduaneiro','TEC','Crimes contra a ordem tributária'] },
            { nome: 'Contabilidade Geral e Avançada', peso: 20, assuntos: ['Demonstrações financeiras','Análise de balanço','Contabilidade de custos','IFRS','CPC','Tributação do lucro real','Lucro presumido','LALUR'] },
            { nome: 'Direito Administrativo', peso: 10, assuntos: ['Processo administrativo','Licitação','Contratos','Agentes públicos','Improbidade'] },
            { nome: 'Raciocínio Lógico e Estatística', peso: 10, assuntos: ['Lógica','Estatística descritiva','Probabilidade','Análise quantitativa'] },
            { nome: 'Tecnologia da Informação', peso: 5, assuntos: ['Sistemas de informação','Banco de dados','SPED','NF-e','Segurança','LGPD'] },
          ]
        }
      }
    };

    // Identifica o banco correto
    let edital = null;
    let concursoKey = '';
    let cargoKey = '';

    // Tenta encontrar o edital pelo nome do concurso
    const concursoUpper = (concurso || '').toUpperCase();
    
    if (concursoUpper.includes('PC-BA') || concursoUpper.includes('POLÍCIA CIVIL') && concursoUpper.includes('BA')) {
      concursoKey = 'PC-BA';
      if (concursoUpper.includes('DELEGADO')) cargoKey = 'Delegado';
      else if (concursoUpper.includes('ESCRIVÃO')) cargoKey = 'Escrivão';
      else cargoKey = 'Investigador';
    } else if (concursoUpper.includes('PM-BA') || concursoUpper.includes('POLÍCIA MILITAR') && concursoUpper.includes('BA')) {
      concursoKey = 'PM-BA';
      cargoKey = 'Soldado';
    } else if (concursoUpper.includes('INSS')) {
      concursoKey = 'INSS';
      if (concursoUpper.includes('ANALISTA')) cargoKey = 'Analista do Seguro Social';
      else cargoKey = 'Técnico do Seguro Social';
    } else if (concursoUpper.includes('BANCO DO BRASIL') || concursoUpper.includes('BB —') || concursoUpper.includes('BB -')) {
      concursoKey = 'Banco do Brasil';
      cargoKey = 'Escriturário — Agente Comercial';
    } else if (concursoUpper.includes('CEF') || concursoUpper.includes('CAIXA')) {
      concursoKey = 'CEF';
      cargoKey = 'Técnico Bancário Novo — Suporte de Negócio';
    } else if (concursoUpper.includes('RECEITA FEDERAL')) {
      concursoKey = 'Receita Federal';
      cargoKey = 'Auditor Fiscal';
    } else if (concursoUpper.includes('TJ')) {
      concursoKey = 'TJ';
      if (concursoUpper.includes('ANALISTA')) cargoKey = 'Analista Judiciário';
      else cargoKey = 'Técnico Judiciário';
    }

    if (concursoKey && EDITAIS[concursoKey] && EDITAIS[concursoKey][cargoKey]) {
      edital = EDITAIS[concursoKey][cargoKey];
    }

    // Calcula semanas disponíveis
    let numSemanas = 8;
    if (data_prova) {
      const hoje = new Date();
      const prova = new Date(data_prova + 'T00:00:00');
      const dias = Math.ceil((prova - hoje) / (1000 * 60 * 60 * 24));
      if (dias > 0) numSemanas = Math.min(Math.max(Math.ceil(dias / 7), 4), 16);
    }

    // Monta contexto de desempenho
    const desempStr = desempenho && Object.keys(desempenho).length
      ? Object.entries(desempenho).map(([d,v]) => `${d}: ${Math.round(v.acertos/v.total*100)}% (${v.total} questões)`).join('; ')
      : 'Sem histórico ainda — aluno está começando';

    // Monta lista completa de disciplinas do edital
    const disciplinasEdital = edital
      ? edital.disciplinas.map(d => `- ${d.nome} (peso ${d.peso}%): ${d.assuntos.join(', ')}`).join('\n')
      : `Disciplinas típicas para concurso de ${area || 'administrativo'}: Português, Raciocínio Lógico, Direito Constitucional, Direito Administrativo e matérias específicas da área.`;

    const prompt = `Você é especialista em concursos públicos brasileiros com acesso ao edital completo.

PERFIL DO ALUNO:
- Concurso: ${concurso}
- Nível atual: ${nivel || 'intermediario'}
- Disponibilidade: ${horas_dia || '2h'} por dia
- Semanas até a prova: ${numSemanas} semanas
- Desempenho atual: ${desempStr}

EDITAL COMPLETO — DISCIPLINAS E ASSUNTOS:
${disciplinasEdital}

INSTRUÇÕES PARA O PLANO:
1. Crie um plano para EXATAMENTE ${numSemanas} semanas
2. Distribua TODAS as disciplinas do edital ao longo das semanas
3. Disciplinas com maior peso devem receber mais semanas e mais questões
4. Disciplinas com baixo % de acerto devem ser priorizadas (prioridade ALTA)
5. Disciplinas com bom desempenho ou não estudadas ainda: prioridade MÉDIA
6. Nas últimas 2 semanas: revisão geral das disciplinas mais cobradas
7. Adapte a meta de questões ao tempo disponível (${horas_dia || '2h'}/dia = ~${horas_dia === '1h' ? 20 : horas_dia === '2h' ? 40 : horas_dia === '3h' ? 60 : horas_dia === '4h' ? 80 : 40} questões/dia)
8. Para cada disciplina, liste os assuntos ESPECÍFICOS do edital a estudar naquela semana
9. Não invente assuntos — use apenas os do edital listado acima
10. Crie uma dica estratégica personalizada com base no perfil

Responda APENAS com JSON puro válido:
{
  "semanas": [
    {
      "numero": 1,
      "titulo": "título motivador",
      "foco": "disciplinas principais da semana",
      "tipo": "introducao|aprofundamento|revisao",
      "disciplinas": [
        {
          "nome": "nome exato da disciplina",
          "peso": 15,
          "prioridade": "alta|media|baixa",
          "meta_questoes": 40,
          "horas_semana": 6,
          "assuntos": ["assunto específico 1", "assunto específico 2"]
        }
      ]
    }
  ],
  "dica_ia": "dica estratégica personalizada",
  "resumo": "resumo do plano em 2 frases",
  "total_semanas": ${numSemanas},
  "total_horas": 0,
  "disciplinas_criticas": ["disc1", "disc2"],
  "disciplinas_ok": ["disc3"]
}`;

    const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Você é especialista em concursos públicos brasileiros. Responda APENAS com JSON puro válido, sem markdown, sem texto adicional.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 4096
      })
    });

    const data = await groqResp.json();
    const txt = data.choices[0].message.content.replace(/```json|```/g, '').trim();
    const plano = JSON.parse(txt);
    
    // Injeta edital no plano para o frontend usar
    plano._edital = edital || null;
    plano._concursoKey = concursoKey;
    
    return res.status(200).json(plano);

  } catch (err) {
    console.error('Erro plano:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

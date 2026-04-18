// Banco completo de editais por concurso
// Estrutura: EDITAIS[chave] = { disciplinas: [{nome, peso, assuntos[]}] }

const EDITAIS = {

  // =================== POLÍCIA FEDERAL ===================
  'PF_AGENTE': { disciplinas: [
    {nome:'Português',peso:10,assuntos:['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância nominal e verbal','Regência','Pontuação','Coesão e coerência','Redação oficial']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Proposições lógicas','Conectivos','Tabela verdade','Silogismo','Sequências','Conjuntos','Porcentagem','Probabilidade','Raciocínio matemático']},
    {nome:'Direito Constitucional',peso:10,assuntos:['Princípios fundamentais','Direitos fundamentais','Segurança pública','Organização do Estado','Poder Judiciário','MP','Controle de constitucionalidade']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios','Atos administrativos','Poderes','Agentes públicos','Licitação (14.133/21)','Contratos','Responsabilidade do Estado','Controle da administração','Improbidade administrativa']},
    {nome:'Direito Penal',peso:15,assuntos:['Princípios','Teoria do crime','Tipicidade','Ilicitude','Culpabilidade','Concurso de crimes','Concurso de pessoas','Penas','Crimes contra a pessoa','Crimes contra o patrimônio','Crimes contra a administração pública','Crimes hediondos']},
    {nome:'Direito Processual Penal',peso:15,assuntos:['Inquérito policial','Ação penal','Competência','Provas','Prisão em flagrante','Prisão preventiva','Prisão temporária','Liberdade provisória','Habeas corpus','Recursos','Lei 9.099/95']},
    {nome:'Legislação Especial',peso:15,assuntos:['Lei de Drogas (11.343/06)','Organização criminosa (12.850/13)','Lavagem de dinheiro (9.613/98)','Abuso de autoridade (13.869/19)','Estatuto do Desarmamento','ECA (8.069/90)','Maria da Penha (11.340/06)','Interceptação telefônica (9.296/96)','Crimes de trânsito']},
    {nome:'Informática',peso:5,assuntos:['Windows','Office','Internet e segurança','Redes','Sistemas operacionais','Criptografia','Cloud']},
    {nome:'Língua Inglesa',peso:5,assuntos:['Interpretação de texto em inglês','Vocabulário','Gramática básica','Falsos cognatos']},
    {nome:'Conhecimentos de Inteligência Policial',peso:5,assuntos:['Atividade de inteligência','Ciclo do conhecimento','Contra-inteligência','Segurança de informações']},
  ]},
  'PF_DELEGADO': { disciplinas: [
    {nome:'Português',peso:5,assuntos:['Interpretação de texto','Redação oficial','Gramática avançada']},
    {nome:'Direito Constitucional',peso:10,assuntos:['Teoria da Constituição','Direitos fundamentais','Organização do Estado','Controle de constitucionalidade','Hermenêutica','Poder Constituinte']},
    {nome:'Direito Penal',peso:20,assuntos:['Teoria geral do crime','Teoria da pena','Extinção da punibilidade','Crimes em espécie (CP completo)','Lei de Drogas','Crime organizado','Crimes contra a honra','Crimes ambientais','Crimes de informática']},
    {nome:'Direito Processual Penal',peso:20,assuntos:['Princípios processuais','Inquérito policial','Ação penal','Competência','Provas','Prisões cautelares','Nulidades','Recursos','Execução penal','Acordos (plea bargaining)','Pacote anticrime']},
    {nome:'Medicina Legal',peso:10,assuntos:['Tanatologia forense','Traumatologia forense','Sexologia forense','Toxicologia forense','Infortunística','DNA forense','Documentos médico-legais']},
    {nome:'Criminalística',peso:10,assuntos:['Local do crime','Documentoscopia','Balística forense','Biologia forense','Química forense','Informática forense','Cadeia de custódia']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Administração pública','Atos administrativos','Poderes','Agentes públicos','Licitação','Contratos','Controle','Improbidade']},
    {nome:'Direito Civil',peso:5,assuntos:['Pessoas físicas e jurídicas','Bens','Fatos jurídicos','Negócio jurídico','Prescrição e decadência']},
    {nome:'Legislação Especial',peso:10,assuntos:['ECA','Maria da Penha','Abuso de autoridade','Organização criminosa','Lavagem de dinheiro','Estatuto do Desarmamento','Interceptação telefônica']},
  ]},
  'PF_ESCRIVAO': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância','Regência','Pontuação','Redação oficial']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Proposições','Conectivos','Silogismo','Sequências','Porcentagem','Probabilidade']},
    {nome:'Direito Constitucional',peso:15,assuntos:['Princípios fundamentais','Direitos fundamentais','Segurança pública','Organização do Estado']},
    {nome:'Direito Penal',peso:15,assuntos:['Teoria do crime','Crimes contra a pessoa','Crimes contra o patrimônio','Crimes contra a administração','Lei de Drogas']},
    {nome:'Direito Processual Penal',peso:15,assuntos:['Inquérito policial','Ação penal','Provas','Prisões','Habeas corpus','Recursos']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios','Atos administrativos','Agentes públicos','Licitação']},
    {nome:'Legislação Especial',peso:10,assuntos:['ECA','Maria da Penha','Abuso de autoridade','Organização criminosa']},
    {nome:'Informática',peso:10,assuntos:['Windows','Office','Internet','Redes','Segurança']},
  ]},

  // =================== PRF ===================
  'PRF': { disciplinas: [
    {nome:'Português',peso:10,assuntos:['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância','Regência','Pontuação','Redação oficial']},
    {nome:'Raciocínio Lógico e Matemática',peso:15,assuntos:['Lógica proposicional','Conjuntos','Porcentagem','Juros','Progressões','Estatística','Probabilidade','Geometria','Funções']},
    {nome:'Direito Constitucional',peso:10,assuntos:['Princípios fundamentais','Direitos fundamentais','Segurança pública','Organização do Estado','Poder Executivo']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios','Atos administrativos','Agentes públicos','Poderes','Licitação','Contratos','Responsabilidade']},
    {nome:'Direito Penal e Processual Penal',peso:15,assuntos:['Teoria do crime','Crimes de trânsito','Crimes contra a pessoa e patrimônio','Drogas','Inquérito policial','Prisões','Provas']},
    {nome:'Legislação de Trânsito',peso:20,assuntos:['CTB completo','Habilitação','Infrações e penalidades','Crimes de trânsito','Fiscalização','SENATRAN','DENATRAN','Sinalização','Licenciamento']},
    {nome:'Legislação Especial',peso:10,assuntos:['Estatuto do Desarmamento','Lei de Drogas','Abuso de autoridade','Organização criminosa']},
    {nome:'Primeiros Socorros',peso:5,assuntos:['RCP','Hemorragias','Politraumatizado','Transporte de acidentados','Queimaduras']},
    {nome:'Informática',peso:5,assuntos:['Windows','Office','Internet','Sistemas de fiscalização','GPS e telemetria']},
  ]},

  // =================== PCDF ===================
  'PCDF_AGENTE': { disciplinas: [
    {nome:'Português',peso:10,assuntos:['Interpretação de texto','Ortografia','Concordância','Regência','Crase','Pontuação','Redação oficial']},
    {nome:'Direito Constitucional',peso:10,assuntos:['Princípios fundamentais','Direitos fundamentais','Segurança pública','Organização do Estado','DF na CF']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios','Atos administrativos','Agentes públicos','Licitação','Contratos','Responsabilidade']},
    {nome:'Direito Penal',peso:20,assuntos:['Teoria do crime','Crimes contra a pessoa','Crimes patrimoniais','Crimes contra a administração','Crimes hediondos','Lei de Drogas','Organização criminosa']},
    {nome:'Direito Processual Penal',peso:15,assuntos:['Inquérito policial','Ação penal','Provas','Prisões','Liberdade provisória','Habeas corpus','Recursos']},
    {nome:'Legislação Especial',peso:15,assuntos:['ECA','Maria da Penha','Abuso de autoridade','Lavagem de dinheiro','Estatuto do Desarmamento','Lei de Drogas']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Proposições','Conectivos','Silogismo','Sequências','Conjuntos','Porcentagem']},
    {nome:'Informática',peso:10,assuntos:['Windows','Office','Internet','Redes','Segurança digital']},
  ]},

  // =================== INSS ===================
  'INSS_TECNICO': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância nominal e verbal','Regência','Pontuação','Coesão e coerência','Redação oficial (Manual de Redação da Presidência)']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Proposições lógicas','Conectivos','Tabela verdade','Silogismo','Contagem e probabilidade','Sequências','Raciocínio matemático','Porcentagem','Juros simples e compostos','Regra de três simples e composta']},
    {nome:'Direito Constitucional',peso:10,assuntos:['Princípios fundamentais','Direitos fundamentais','Direitos sociais','Ordem social','Seguridade social na CF','Saúde','Previdência social','Assistência social','Organização do Estado']},
    {nome:'Direito Administrativo',peso:15,assuntos:['Princípios da administração (LIMPE)','Organização administrativa federal','Atos administrativos','Poderes administrativos','Agentes públicos','Lei 8.112/90','Licitação (14.133/21)','Contratos administrativos','Controle da administração','Responsabilidade civil do Estado','Improbidade administrativa (8.429/92)','Processo administrativo federal (9.784/99)']},
    {nome:'Direito Previdenciário',peso:25,assuntos:['Seguridade social (CF arts. 194-204)','Princípios e objetivos da Previdência','RGPS — custeio (Lei 8.212/91)','Segurados obrigatórios e facultativos','Empresa e equiparados','Salário de contribuição','Contribuições sociais','RGPS — benefícios (Lei 8.213/91)','Aposentadoria por incapacidade permanente','Aposentadoria programada','Aposentadoria especial','Auxílio por incapacidade temporária','Auxílio-acidente','Salário-família','Salário-maternidade','Pensão por morte','Auxílio-reclusão','BPC/LOAS','Acidente do trabalho','Período de carência','Período de graça','Decadência e prescrição','Processo administrativo previdenciário']},
    {nome:'Legislação Previdenciária',peso:15,assuntos:['Lei 8.212/1991 completa','Lei 8.213/1991 completa','Decreto 3.048/1999 (RPS)','EC 103/2019 (Reforma da Previdência)','Lei 9.784/1999','Instrução Normativa INSS nº 128/2022']},
    {nome:'Informática',peso:10,assuntos:['Windows 10/11','Word (edição, formatação, mala direta)','Excel (fórmulas, gráficos, tabelas dinâmicas)','Outlook','Internet (navegadores, e-mail, segurança)','Redes de computadores','LGPD (13.709/18)','Cloud computing','Sistemas de informação do INSS']},
  ]},
  'INSS_ANALISTA': { disciplinas: [
    {nome:'Português',peso:10,assuntos:['Interpretação de texto','Redação oficial','Gramática avançada','Coesão e coerência','Linguística textual','Semântica']},
    {nome:'Direito Constitucional',peso:10,assuntos:['Teoria da Constituição','Direitos fundamentais','Ordem econômica e social','Seguridade social','Controle de constitucionalidade','Poder Constituinte','Hermenêutica constitucional']},
    {nome:'Direito Administrativo',peso:15,assuntos:['Princípios','Organização administrativa','Atos administrativos','Poderes','Agentes públicos e Lei 8.112/90','Licitação 14.133/21','Contratos','Controle','Responsabilidade do Estado','Improbidade','Processo administrativo 9.784/99']},
    {nome:'Direito Previdenciário',peso:25,assuntos:['Seguridade social','Previdência na CF','Lei 8.212/91 — custeio completo','Lei 8.213/91 — benefícios completo','Decreto 3.048/99','EC 103/2019','Jurisprudência STJ/TNU em matéria previdenciária','Acordos internacionais de previdência']},
    {nome:'Direito do Trabalho',peso:10,assuntos:['Relação de emprego','Contrato de trabalho','Jornada','Remuneração','Férias','FGTS','Rescisão','CTPS','Terceirização','Trabalho temporário','Grupos econômicos']},
    {nome:'Raciocínio Lógico e Estatística',peso:10,assuntos:['Lógica proposicional','Estatística descritiva','Probabilidade','Análise combinatória','Distribuições de probabilidade','Amostragem']},
    {nome:'Administração Pública',peso:10,assuntos:['Modelos de administração pública','Gestão por competências','Planejamento estratégico','Balanced Scorecard','Gestão de processos','Governança pública','Transparência e controle social','Atendimento ao cidadão']},
    {nome:'Informática',peso:10,assuntos:['Office avançado','Sistemas de informação','Banco de dados','Redes e segurança','LGPD','Arquitetura de sistemas','Cloud computing']},
  ]},

  // =================== RECEITA FEDERAL ===================
  'RECEITA_AUDITOR': { disciplinas: [
    {nome:'Direito Tributário',peso:25,assuntos:['Sistema Tributário Nacional (CF)','Princípios constitucionais tributários','Competência tributária','CTN — Disposições gerais','Obrigação tributária','Fato gerador','Sujeito ativo e passivo','Responsabilidade tributária','Crédito tributário','Lançamento','Suspensão do crédito','Extinção do crédito','Exclusão do crédito','Garantias e privilégios do crédito','Administração tributária — CF e CTN','Tributos federais: IR PF e PJ','IPI','IOF','ITR','II e IE','PIS/COFINS','CSLL','CIDE','Simples Nacional','Processo administrativo fiscal']},
    {nome:'Direito Aduaneiro',peso:15,assuntos:['Controle aduaneiro de mercadorias','Despacho de importação','Despacho de exportação','Regimes aduaneiros especiais e aplicados em áreas especiais','Valor aduaneiro (Acordo de Valoração Aduaneira)','TEC — Tarifa Externa Comum','TIPI','Drawback','Crimes contra a ordem tributária','Descaminho e contrabando']},
    {nome:'Contabilidade Geral e Avançada',peso:20,assuntos:['Demonstrações financeiras (BP, DRE, DMPL, DFC, NE)','Análise das demonstrações financeiras','Contabilidade de custos','IFRS e CPC','Lucro Real (LALUR, LAJIR)','Lucro Presumido','Simples Nacional na contabilidade','Consolidação de demonstrações','Operações com instrumentos financeiros']},
    {nome:'Direito Constitucional',peso:10,assuntos:['Sistema tributário nacional na CF','Direitos fundamentais','Ordem econômica','Organização do Estado','Controle de constitucionalidade']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios','Processo administrativo','Licitação','Contratos','Agentes públicos — Lei 8.112/90','Improbidade administrativa']},
    {nome:'Português e Redação',peso:5,assuntos:['Interpretação de texto','Redação oficial','Gramática avançada','Linguística']},
    {nome:'Raciocínio Lógico e Estatística',peso:10,assuntos:['Lógica','Estatística descritiva','Probabilidade','Análise quantitativa','Grafos e algoritmos']},
    {nome:'Tecnologia da Informação',peso:5,assuntos:['SPED','NF-e, NFS-e, CT-e','EFD-Contribuições','ECF','Segurança da informação','LGPD','Banco de dados','Sistemas ERP']},
  ]},

  // =================== TCU ===================
  'TCU_ANALISTA': { disciplinas: [
    {nome:'Português',peso:10,assuntos:['Interpretação de texto','Redação','Gramática avançada','Semântica e estilística']},
    {nome:'Direito Constitucional',peso:15,assuntos:['TCU na CF (arts. 70-75)','Controle externo','Fiscalização financeira','Direitos fundamentais','Organização do Estado','Controle de constitucionalidade']},
    {nome:'Direito Administrativo',peso:20,assuntos:['Princípios','Administração pública direta e indireta','Atos administrativos','Poderes','Agentes públicos e Lei 8.112/90','Licitação 14.133/21 completa','Contratos administrativos','PPP e concessões','Controle interno e externo','Responsabilidade do Estado','Improbidade 8.429/92','Tomada de contas especial']},
    {nome:'Controle Externo e Auditoria',peso:20,assuntos:['Lei Orgânica do TCU (8.443/92)','RITCU','Auditoria governamental','NBC TA','Riscos de auditoria','Materialidade e evidências','Relatório de auditoria','Prestação e tomada de contas','Responsabilidade de gestores','COSO e COBIT','Controles internos']},
    {nome:'Contabilidade Pública',peso:15,assuntos:['MCASP','Plano de Contas Aplicado ao Setor Público','Orçamento público (PPA, LDO, LOA)','SIAFI','Execução orçamentária e financeira','Dívida pública','Demonstrações contábeis públicas','NBCASP']},
    {nome:'Administração Pública',peso:10,assuntos:['Planejamento estratégico','Gestão de processos','Governança pública','Compliance','Gestão de riscos','Transparência','LGPD no setor público']},
    {nome:'Direito Financeiro',peso:5,assuntos:['Lei 4.320/1964','LRF (101/2000)','Orçamento público','Créditos adicionais','Receita e despesa pública']},
    {nome:'Raciocínio Lógico e Estatística',peso:5,assuntos:['Lógica','Estatística','Probabilidade','Análise de dados']},
  ]},

  // =================== AGU ===================
  'AGU_ADVOGADO': { disciplinas: [
    {nome:'Português',peso:5,assuntos:['Interpretação de texto','Redação jurídica','Gramática avançada']},
    {nome:'Direito Constitucional',peso:15,assuntos:['Teoria da Constituição','Direitos fundamentais','Organização do Estado','Controle de constitucionalidade','Hermenêutica','Poder Constituinte','Ação direta de inconstitucionalidade','ADPF','ADO']},
    {nome:'Direito Administrativo',peso:20,assuntos:['Princípios','Organização administrativa','Atos administrativos','Poderes','Agentes públicos','Licitação 14.133/21 completa','Contratos','PPP','Controle','Responsabilidade','Improbidade','Processo administrativo','Regulação']},
    {nome:'Direito Civil',peso:15,assuntos:['LINDB','Pessoas físicas e jurídicas','Bens','Fatos jurídicos','Negócio jurídico','Prescrição e decadência','Contratos (espécies)','Responsabilidade civil','Direito das Coisas','Família','Sucessões']},
    {nome:'Direito Processual Civil',peso:15,assuntos:['CPC completo','Princípios','Competência','Partes e procuradores','Atos processuais','Tutelas provisórias','Procedimentos especiais','Recursos','Execução','Ação popular','ACP','Mandado de segurança']},
    {nome:'Direito Tributário',peso:10,assuntos:['Sistema tributário nacional','Princípios','CTN completo','Tributos federais','Execução fiscal','Processo administrativo fiscal','Imunidades']},
    {nome:'Direito Financeiro',peso:5,assuntos:['LRF','Lei 4.320/64','Orçamento público','Dívida pública']},
    {nome:'Direito Internacional',peso:5,assuntos:['Fontes do direito internacional','Tratados internacionais','ONU','Direitos humanos internacionais','Direito da integração — MERCOSUL']},
    {nome:'Direito Empresarial',peso:5,assuntos:['Empresa e empresário','Sociedades empresariais','Falência e recuperação','Títulos de crédito']},
    {nome:'Raciocínio Lógico',peso:5,assuntos:['Lógica proposicional','Argumentação jurídica']},
  ]},

  // =================== BANCO DO BRASIL ===================
  'BB_ESCRITURARIO': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Ortografia','Concordância','Regência','Crase','Pontuação','Redação']},
    {nome:'Matemática e Raciocínio Lógico',peso:20,assuntos:['Porcentagem','Juros simples e compostos','Amortização SAC e PRICE','Desconto bancário','Taxa de juros efetiva e nominal','Equivalência de capitais','Probabilidade','Estatística descritiva','Análise combinatória','Lógica proposicional','Sequências e funções']},
    {nome:'Atualidades do Mercado Financeiro',peso:15,assuntos:['Sistema Financeiro Nacional (SFN)','Banco Central do Brasil (BACEN)','CMN — Conselho Monetário Nacional','CVM — Comissão de Valores Mobiliários','Banco do Brasil — missão e história','Produtos bancários','Crédito bancário','Garantias (aval, fiança, hipoteca, alienação fiduciária)','Compliance e ética bancária','LGPD no setor financeiro','Open banking e open finance','Pix e meios de pagamento eletrônico']},
    {nome:'Conhecimentos Bancários',peso:20,assuntos:['Operações ativas (empréstimos e financiamentos)','Operações passivas (depósitos)','CDB e RDB','Poupança','Fundos de investimento (renda fixa, ações, multimercado)','Previdência privada (PGBL e VGBL)','Seguros (vida, residencial, automóvel)','Câmbio e remessas internacionais','Mercado de capitais (ações, debêntures, CRI, CRA)','Crédito imobiliário (SFH e SFI)','Crédito rural','Cartões de crédito e débito','CDC e crédito consignado','Resolução CMN 4.966','Meios de pagamento']},
    {nome:'Legislação e Ética',peso:10,assuntos:['Código de Defesa do Consumidor (CDC)','Crimes contra o SFN (7.492/86)','Lavagem de dinheiro (9.613/98)','LGPD (13.709/18)','Sigilo bancário (LC 105/01)','Código Civil — contratos bancários','Resolução BACEN 4.949/21 (ouvidoria)','Ética e código de conduta bancária']},
    {nome:'Tecnologia e Inovação',peso:10,assuntos:['Open banking e APIs bancárias','Fintechs e bancos digitais','Blockchain e criptomoedas','Inteligência artificial no setor bancário','Cybersegurança bancária','Cloud banking','Big data no setor financeiro','Transformação digital']},
    {nome:'Vendas e Negociação',peso:10,assuntos:['Técnicas de vendas','Perfil e comportamento do cliente','Marketing bancário','Gestão de relacionamento (CRM)','Satisfação e fidelização','NPS — Net Promoter Score','Negociação e argumentação','Cross selling e up selling']},
  ]},

  // =================== CEF ===================
  'CEF_TECNICO': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Ortografia','Concordância','Regência','Crase','Pontuação','Redação']},
    {nome:'Matemática Financeira',peso:20,assuntos:['Porcentagem e variação','Juros simples e compostos','Sistemas de amortização SAC e PRICE','Valor presente e futuro','TIR e TMA','Desconto bancário','Equivalência de capitais','Capitalização contínua']},
    {nome:'Conhecimentos Bancários e Habitacionais',peso:20,assuntos:['SFN e SFH — Sistema Financeiro da Habitação','SFI — Sistema de Financiamento Imobiliário','FGTS — funcionamento e uso habitacional','Produtos CEF (habitação, saneamento, infraestrutura)','Poupança e CDB','Fundos de investimento','Previdência','Seguros habitacionais','Câmbio','Meios de pagamento','Pix','Open banking']},
    {nome:'Vendas e Atendimento',peso:15,assuntos:['Técnicas de vendas bancárias','Perfil do cliente','Marketing de relacionamento','CRM bancário','NPS','Negociação','Resolução de conflitos com clientes','Gestão de reclamações']},
    {nome:'Legislação',peso:15,assuntos:['LGPD (13.709/18)','CDC','Lavagem de dinheiro (9.613/98)','Crimes contra o SFN','Sigilo bancário','Código Civil aplicado','Compliance e ética','Resolução BACEN — prevenção a fraudes']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Lógica proposicional','Sequências','Conjuntos','Probabilidade','Estatística básica','Raciocínio quantitativo']},
    {nome:'Informática',peso:5,assuntos:['Office (Word, Excel, Outlook)','Internet e segurança','Sistemas bancários','Open banking','Cybersegurança','LGPD na prática']},
  ]},

  // =================== TJ ESTADOS ===================
  'TJ_ANALISTA': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Redação oficial','Gramática','Coesão e coerência','Linguística']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Proposições','Conectivos','Silogismo','Sequências','Conjuntos','Probabilidade','Raciocínio matemático']},
    {nome:'Direito Constitucional',peso:20,assuntos:['Princípios fundamentais','Direitos fundamentais','Organização do Estado','Poder Judiciário na CF','MP na CF','Controle de constitucionalidade','Hermenêutica constitucional','Defensoria Pública']},
    {nome:'Direito Administrativo',peso:20,assuntos:['Princípios LIMPE','Organização administrativa','Atos administrativos','Poderes da administração','Agentes públicos e Lei 8.112/90','Licitação 14.133/21','Contratos administrativos','Controle da administração','Responsabilidade civil do Estado','Improbidade administrativa 8.429/92']},
    {nome:'Direito Civil',peso:15,assuntos:['LINDB','Pessoas físicas e jurídicas','Bens','Fatos e negócios jurídicos','Vícios do negócio jurídico','Prescrição e decadência','Contratos em geral','Responsabilidade civil','Direito das Coisas (posse e propriedade)','Família','Sucessões']},
    {nome:'Direito Processual Civil',peso:15,assuntos:['Princípios do CPC/2015','Competência','Partes e procuradores','Atos processuais','Petição inicial e resposta','Tutelas provisórias','Provas','Sentença e coisa julgada','Recursos','Execução','Cumprimento de sentença','Ações especiais','Mandado de segurança']},
    {nome:'Informática',peso:5,assuntos:['Windows','Office','Internet','Sistemas judiciários (PJe)','Redes','Segurança da informação','LGPD']},
  ]},
  'TJ_TECNICO': { disciplinas: [
    {nome:'Português',peso:20,assuntos:['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância nominal e verbal','Regência','Pontuação','Redação oficial']},
    {nome:'Raciocínio Lógico',peso:15,assuntos:['Proposições lógicas','Conectivos','Tabela verdade','Silogismo','Sequências','Conjuntos','Porcentagem','Probabilidade']},
    {nome:'Direito Constitucional',peso:20,assuntos:['Princípios fundamentais','Direitos e garantias fundamentais','Poder Judiciário','MP','Organização do Estado','Garantias processuais']},
    {nome:'Direito Administrativo',peso:20,assuntos:['Princípios da administração','Atos administrativos','Agentes públicos','Poderes','Licitação básica','Contratos','Responsabilidade do Estado']},
    {nome:'Noções de Direito Processual Civil',peso:15,assuntos:['Atos processuais','Petição inicial','Citação e intimação','Prazos','Recursos em geral','Cumprimento de sentença','Processo eletrônico — PJe']},
    {nome:'Informática',peso:10,assuntos:['Windows 10/11','Word','Excel','Internet','Segurança digital','PJe básico']},
  ]},

  // =================== TRF ===================
  'TRF_ANALISTA': { disciplinas: [
    {nome:'Português',peso:10,assuntos:['Interpretação de texto','Redação oficial','Gramática']},
    {nome:'Direito Constitucional',peso:15,assuntos:['Princípios fundamentais','Direitos fundamentais','Justiça Federal na CF','Controle de constitucionalidade','TRFs — competência e organização']},
    {nome:'Direito Administrativo',peso:15,assuntos:['Princípios','Organização administrativa federal','Atos administrativos','Agentes públicos — Lei 8.112/90','Licitação 14.133/21','Contratos','Controle','Responsabilidade','Improbidade']},
    {nome:'Direito Civil',peso:10,assuntos:['LINDB','Pessoas','Bens','Fatos jurídicos','Negócio jurídico','Contratos','Responsabilidade civil']},
    {nome:'Direito Processual Civil',peso:20,assuntos:['CPC/2015 completo','Competência da Justiça Federal','Ação popular','ACP','Mandado de segurança','Ação rescisória','Recursos — STJ e STF','Execução contra Fazenda Pública']},
    {nome:'Direito do Trabalho e Processual do Trabalho',peso:10,assuntos:['CLT — contrato de trabalho','Jornada','Remuneração','Rescisão','Processo trabalhista básico']},
    {nome:'Direito Penal e Processual Penal',peso:10,assuntos:['Competência federal em matéria penal','Crimes federais','Processo penal federal','Habeas corpus e mandado de segurança criminal']},
    {nome:'Raciocínio Lógico e Informática',peso:10,assuntos:['Lógica','Probabilidade','Windows','Office','PJe','LGPD']},
  ]},

  // =================== PC ESTADOS ===================
  'PC_INVESTIGADOR': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância nominal e verbal','Regência nominal e verbal','Pontuação','Coesão e coerência','Redação oficial']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Proposições lógicas','Conectivos','Tabela verdade','Silogismo','Lógica de argumentação','Sequências e padrões','Conjuntos','Porcentagem','Probabilidade básica']},
    {nome:'Direito Constitucional',peso:15,assuntos:['Princípios fundamentais','Direitos e garantias fundamentais','Segurança pública na CF','Organização do Estado','Poder Judiciário','MP','Controle de constitucionalidade']},
    {nome:'Direito Penal',peso:20,assuntos:['Princípios do Direito Penal','Teoria do crime — tipicidade, ilicitude, culpabilidade','Concurso de pessoas','Concurso de crimes','Penas e medidas de segurança','Crimes contra a vida','Lesão corporal','Crimes contra a honra','Crimes patrimoniais','Crimes contra a administração pública','Crimes hediondos']},
    {nome:'Direito Processual Penal',peso:15,assuntos:['Inquérito policial','Ação penal pública e privada','Competência','Prisão em flagrante','Prisão preventiva','Prisão temporária','Liberdade provisória','Provas em geral','Habeas corpus','Recursos em espécie']},
    {nome:'Legislação Especial',peso:10,assuntos:['Lei de Drogas 11.343/06','Organização criminosa 12.850/13','Abuso de autoridade 13.869/19','ECA 8.069/90','Maria da Penha 11.340/06','Estatuto do Desarmamento 10.826/03','Lavagem de dinheiro 9.613/98','Crimes de trânsito — CTB']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios da administração','Atos administrativos','Poderes da administração','Agentes públicos','Licitação','Contratos','Responsabilidade civil do Estado','Improbidade administrativa']},
    {nome:'Informática',peso:5,assuntos:['Windows','Word e Excel básico','Internet e segurança','Redes','Sistemas de informação policial']},
  ]},
  'PC_DELEGADO': { disciplinas: [
    {nome:'Português',peso:5,assuntos:['Interpretação de texto','Redação jurídica','Gramática avançada']},
    {nome:'Direito Constitucional',peso:10,assuntos:['Teoria da Constituição','Direitos fundamentais','Segurança pública','Controle de constitucionalidade','Hermenêutica','Poder Constituinte']},
    {nome:'Direito Penal',peso:20,assuntos:['Teoria geral do crime completa','Teoria da pena','Extinção da punibilidade','Crimes contra a vida','Crimes sexuais','Crimes patrimoniais','Crimes contra a administração','Lei de Drogas completa','Organização criminosa','Crimes ambientais','Crimes de informática (12.737/12)']},
    {nome:'Direito Processual Penal',peso:20,assuntos:['Princípios processuais penais','Inquérito policial completo','Ação penal','Competência','Provas — espécies e vedações','Prisões cautelares','Medidas cautelares diversas','Nulidades','Recursos','Execução penal','Acordo de não persecução penal','Pacote anticrime 13.964/19']},
    {nome:'Medicina Legal',peso:10,assuntos:['Tanatologia','Traumatologia','Asfixias mecânicas','Sexologia forense','Toxicologia','DNA forense','Infortunística','Documentos médico-legais']},
    {nome:'Criminalística',peso:10,assuntos:['Local do crime — isolamento e exame','Documentoscopia','Balística forense','Biologia forense','Cadeia de custódia (13.964/19)','Informática forense','Química forense']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Administração pública direta e indireta','Atos administrativos','Poderes','Agentes públicos','Licitação','Contratos','Controle e responsabilidade']},
    {nome:'Legislação Especial',peso:10,assuntos:['ECA','Maria da Penha','Abuso de autoridade','Organização criminosa','Lavagem de dinheiro','Estatuto do Desarmamento','Lei de Drogas — aspectos processuais','Crimes de tortura']},
    {nome:'Direito Civil',peso:5,assuntos:['Pessoas físicas e jurídicas','Bens','Negócio jurídico','Prescrição']},
  ]},

  // =================== PM ESTADOS ===================
  'PM_SOLDADO': { disciplinas: [
    {nome:'Português',peso:20,assuntos:['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância nominal e verbal','Regência','Pontuação','Redação básica']},
    {nome:'Matemática',peso:15,assuntos:['Operações e frações','Porcentagem','Razão e proporção','Regra de três','Juros simples','Equações de 1º e 2º grau','Geometria plana','Estatística básica']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Proposições lógicas','Conectivos','Tabela verdade','Silogismo','Sequências','Conjuntos']},
    {nome:'Direito Constitucional',peso:15,assuntos:['Princípios fundamentais','Direitos e garantias fundamentais','Segurança pública','Forças policiais na CF','Organização do Estado']},
    {nome:'Direito Penal e Processual',peso:15,assuntos:['Teoria do crime básica','Crimes contra a pessoa','Crimes contra o patrimônio','Lei de Drogas básica','Prisões','Inquérito policial']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios da administração','Atos administrativos','Poderes','Agentes públicos','Responsabilidade do Estado']},
    {nome:'Conhecimentos Gerais',peso:10,assuntos:['Atualidades','História do Brasil','Geografia do Brasil','Direitos Humanos','História e geografia do estado']},
    {nome:'Primeiros Socorros',peso:5,assuntos:['RCP','Hemorragias','Fraturas e entorses','Transporte de acidentados','Estado de choque','Queimaduras']},
  ]},

  // =================== BNB ===================
  'BNB_ANALISTA': { disciplinas: [
    {nome:'Português',peso:10,assuntos:['Interpretação de texto','Redação','Gramática']},
    {nome:'Matemática e Raciocínio Lógico',peso:15,assuntos:['Porcentagem','Juros','Amortização','Probabilidade','Estatística','Lógica proposicional','Sequências']},
    {nome:'Conhecimentos Bancários',peso:20,assuntos:['SFN','BACEN','CMN','CVM','Produtos bancários','Crédito','Câmbio','Mercado de capitais','Fundos','Previdência','Seguros','Meios de pagamento']},
    {nome:'Desenvolvimento Regional',peso:15,assuntos:['Região Nordeste — economia','Políticas de desenvolvimento regional','Pronaf','FNE — Fundo Constitucional','Desenvolvimento sustentável','Microcrédito','Agroindústria nordestina','Semiárido e convivência']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios','Atos administrativos','Licitação','Contratos','Agentes públicos','Improbidade']},
    {nome:'Atualidades e Economia',peso:10,assuntos:['Macroeconomia básica','Indicadores econômicos','Mercado de trabalho','Inflação','Política monetária e fiscal','Economia verde','Agenda 2030 ONU']},
    {nome:'Contabilidade Geral',peso:10,assuntos:['Demonstrações financeiras','Análise de balanço','Noções de custos','Depreciação']},
    {nome:'Legislação',peso:10,assuntos:['LGPD','Lavagem de dinheiro','CDC','Código de Ética','Compliance']},
  ]},

  // =================== SEFAZ ESTADOS ===================
  'SEFAZ_AUDITOR': { disciplinas: [
    {nome:'Português',peso:5,assuntos:['Interpretação de texto','Redação oficial','Gramática']},
    {nome:'Direito Tributário',peso:25,assuntos:['Sistema Tributário Nacional','CTN completo','Princípios constitucionais tributários','Competência tributária','Obrigação tributária','Crédito tributário','Lançamento','Extinção e exclusão do crédito','Administração tributária','ICMS — legislação','ISS — legislação','IPVA','ITCMD','Simples Nacional','Processo administrativo tributário estadual']},
    {nome:'Direito Constitucional',peso:10,assuntos:['Sistema tributário na CF','Repartição de receitas','Federalismo fiscal','Direitos fundamentais','Organização do Estado']},
    {nome:'Direito Administrativo',peso:15,assuntos:['Princípios','Administração pública','Atos administrativos','Agentes públicos','Licitação','Contratos','Controle','Improbidade']},
    {nome:'Contabilidade Geral e Fiscal',peso:20,assuntos:['Demonstrações financeiras','Análise de balanço','Contabilidade de custos','Escrituração fiscal','SPED','NF-e','EFD-ICMS/IPI','Recuperação de créditos fiscais']},
    {nome:'Auditoria Fiscal',peso:15,assuntos:['Técnicas de auditoria fiscal','Planejamento de auditoria','Papéis de trabalho','Sonegação fiscal','Crimes contra a ordem tributária','Fraudes contábeis','Auditoria de sistemas']},
    {nome:'Raciocínio Lógico e Estatística',peso:5,assuntos:['Lógica','Estatística','Análise de dados','Probabilidade']},
    {nome:'Informática',peso:5,assuntos:['Excel avançado','Banco de dados','BI e análise fiscal','SPED na prática','Sistemas de gestão tributária']},
  ]},

  // =================== PREFEITURA ANALISTA ===================
  'PREFEITURA_ANALISTA': { disciplinas: [
    {nome:'Português',peso:20,assuntos:['Interpretação de texto','Ortografia','Acentuação','Crase','Concordância','Regência','Pontuação','Redação oficial']},
    {nome:'Raciocínio Lógico',peso:15,assuntos:['Proposições','Conectivos','Silogismo','Sequências','Conjuntos','Porcentagem','Probabilidade']},
    {nome:'Direito Constitucional',peso:15,assuntos:['Princípios fundamentais','Direitos fundamentais','Organização do Estado','Municípios na CF','Competências municipais']},
    {nome:'Direito Administrativo',peso:20,assuntos:['Princípios','Organização administrativa','Atos administrativos','Agentes públicos','Licitação 14.133/21','Contratos','Responsabilidade','Improbidade']},
    {nome:'Direito Municipal',peso:10,assuntos:['Lei Orgânica Municipal','Câmara Municipal','Tributos municipais (IPTU, ISS, ITBI)','Lei de Responsabilidade Fiscal','Estatuto das Cidades']},
    {nome:'Informática',peso:10,assuntos:['Windows','Office (Word, Excel, PowerPoint)','Internet','Segurança','Redes básicas','Sistemas de gestão municipal']},
    {nome:'Conhecimentos Específicos do Cargo',peso:10,assuntos:['Legislação específica da área','Técnicas da profissão','Ética profissional','Atualidades da área']},
  ]},

  // =================== EDUCAÇÃO / PROFESSOR ===================
  'PROFESSOR_ESTADUAL': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Gramática','Redação','Coesão e coerência']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Proposições','Sequências','Conjuntos','Porcentagem','Probabilidade']},
    {nome:'Direito Constitucional',peso:10,assuntos:['Direitos fundamentais','Direito à educação','Organização do Estado','Princípios fundamentais']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios','Agentes públicos','Atos administrativos','Responsabilidade']},
    {nome:'Conhecimentos Pedagógicos',peso:20,assuntos:['Didática','Planejamento de ensino','Avaliação da aprendizagem','Teorias da aprendizagem (Piaget, Vygotsky, Ausubel)','PCN e BNCC','Educação inclusiva','Metodologias ativas','Projeto político-pedagógico']},
    {nome:'Legislação Educacional',peso:15,assuntos:['LDB — Lei 9.394/96','BNCC','Estatuto do Magistério','Plano Nacional de Educação','ECA — direito à educação','Educação especial e inclusiva','IDEB','ENEM e SAEB']},
    {nome:'Conhecimentos Específicos (área)',peso:20,assuntos:['Fundamentos teóricos da disciplina','Metodologia de ensino específica','Histórico e evolução da área','Interdisciplinaridade','Prática pedagógica']},
  ]},

  // =================== SAÚDE / EBSERH ===================
  'EBSERH_ENFERMEIRO': { disciplinas: [
    {nome:'Português',peso:10,assuntos:['Interpretação de texto','Redação oficial','Gramática']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios','Agentes públicos','Atos administrativos','Contratos','Licitação básica']},
    {nome:'Legislação em Saúde',peso:15,assuntos:['SUS — princípios e diretrizes','Lei 8.080/90','Lei 8.142/90','COFEN — Código de ética','Resolução COFEN 564/17','Lei do exercício profissional 7.498/86','RDC ANVISA 63/11 e 36/13']},
    {nome:'Saúde Coletiva e Epidemiologia',peso:15,assuntos:['Vigilância epidemiológica','Indicadores de saúde','Doenças de notificação compulsória','Promoção da saúde','Saúde da família — ESF','PNAB','Saúde do trabalhador']},
    {nome:'Enfermagem Médico-Cirúrgica',peso:20,assuntos:['Semiologia e semiotécnica','Sinais vitais','Administração de medicamentos','Curativo e estomas','Cateterismo vesical','Sondagem nasogástrica','Oxigenoterapia','Transfusão sanguínea','Cuidados pré e pós-operatórios']},
    {nome:'Urgência e Emergência',peso:15,assuntos:['RCP — Suporte básico e avançado de vida','Politraumatismo','Choque','Queimaduras','Intoxicações','Triagem de Manchester','SAE em urgência']},
    {nome:'Saúde Mental',peso:10,assuntos:['Reforma psiquiátrica','CAPS','Transtornos mentais prevalentes','Uso de drogas e álcool','Lei 10.216/01']},
    {nome:'Gestão em Enfermagem',peso:5,assuntos:['SAE — Sistematização da Assistência','CIPE','NHB','Indicadores de qualidade em enfermagem','Gestão de resíduos hospitalares']},
  ]},

  // =================== GENÉRICO POR ÁREA ===================
  'GENERICO_POLICIAL': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Ortografia','Concordância','Regência','Crase','Pontuação','Redação oficial']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Proposições lógicas','Conectivos','Silogismo','Sequências','Conjuntos','Porcentagem','Probabilidade']},
    {nome:'Direito Constitucional',peso:15,assuntos:['Princípios fundamentais','Direitos fundamentais','Segurança pública','Organização do Estado']},
    {nome:'Direito Penal',peso:20,assuntos:['Teoria do crime','Crimes contra a pessoa','Crimes patrimoniais','Crimes contra a administração','Lei de Drogas','Crimes hediondos']},
    {nome:'Direito Processual Penal',peso:15,assuntos:['Inquérito policial','Ação penal','Provas','Prisões','Habeas corpus','Recursos']},
    {nome:'Legislação Especial',peso:10,assuntos:['ECA','Maria da Penha','Abuso de autoridade','Organização criminosa','Estatuto do Desarmamento']},
    {nome:'Direito Administrativo',peso:10,assuntos:['Princípios','Atos administrativos','Agentes públicos','Licitação']},
    {nome:'Informática',peso:5,assuntos:['Windows','Office','Internet','Segurança digital']},
  ]},
  'GENERICO_JUDICIAL': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Redação oficial','Gramática']},
    {nome:'Raciocínio Lógico',peso:10,assuntos:['Proposições','Silogismo','Sequências','Probabilidade']},
    {nome:'Direito Constitucional',peso:20,assuntos:['Princípios fundamentais','Direitos fundamentais','Poder Judiciário','Controle de constitucionalidade']},
    {nome:'Direito Administrativo',peso:20,assuntos:['Princípios','Atos administrativos','Agentes públicos','Licitação 14.133/21','Contratos','Responsabilidade','Improbidade']},
    {nome:'Direito Civil',peso:15,assuntos:['LINDB','Pessoas','Bens','Negócio jurídico','Contratos','Responsabilidade civil','Família']},
    {nome:'Direito Processual Civil',peso:15,assuntos:['CPC/2015','Competência','Atos processuais','Provas','Sentença','Recursos','Execução']},
    {nome:'Informática',peso:5,assuntos:['Windows','Office','PJe','LGPD']},
  ]},
  'GENERICO_ADMINISTRATIVA': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Ortografia','Concordância','Regência','Crase','Pontuação','Redação oficial']},
    {nome:'Raciocínio Lógico',peso:15,assuntos:['Proposições','Silogismo','Sequências','Conjuntos','Porcentagem','Probabilidade','Raciocínio matemático']},
    {nome:'Direito Constitucional',peso:15,assuntos:['Princípios fundamentais','Direitos fundamentais','Organização do Estado','Poder Executivo']},
    {nome:'Direito Administrativo',peso:25,assuntos:['Princípios LIMPE','Organização administrativa','Atos administrativos','Poderes','Agentes públicos — Lei 8.112/90','Licitação 14.133/21','Contratos','Controle','Responsabilidade','Improbidade']},
    {nome:'Informática',peso:15,assuntos:['Windows 10/11','Word','Excel','Outlook','Internet e segurança','Redes','LGPD']},
    {nome:'Administração Geral',peso:10,assuntos:['Funções administrativas','Planejamento estratégico','Gestão de processos','Atendimento ao cidadão','Comunicação organizacional']},
    {nome:'Conhecimentos Específicos',peso:5,assuntos:['Legislação do órgão','Regimento interno','Ética no serviço público']},
  ]},
  'GENERICO_BANCARIA': { disciplinas: [
    {nome:'Português',peso:15,assuntos:['Interpretação de texto','Gramática','Redação']},
    {nome:'Matemática e Raciocínio Lógico',peso:20,assuntos:['Porcentagem','Juros simples e compostos','Amortização','Probabilidade','Estatística','Lógica proposicional']},
    {nome:'Atualidades do Mercado Financeiro',peso:15,assuntos:['SFN','BACEN','CMN','CVM','Produtos bancários','Crédito','Garantias','Compliance','LGPD']},
    {nome:'Conhecimentos Bancários',peso:20,assuntos:['Operações bancárias','Fundos de investimento','Previdência','Seguros','Câmbio','Mercado de capitais','Meios de pagamento','Open banking']},
    {nome:'Legislação',peso:10,assuntos:['CDC','Lavagem de dinheiro','Crimes contra o SFN','LGPD','Sigilo bancário']},
    {nome:'Vendas e Atendimento',peso:10,assuntos:['Técnicas de vendas','CRM','Negociação','Marketing']},
    {nome:'Informática',peso:10,assuntos:['Office','Internet','Segurança bancária','Sistemas financeiros']},
  ]},
};

// Mapeamento de palavras-chave para chaves do banco
const MAPA_CONCURSOS = [
  {keys:['PF','POLÍCIA FEDERAL'], cargo:{AGENTE:'PF_AGENTE',DELEGADO:'PF_DELEGADO',ESCRIVÃO:'PF_ESCRIVAO',ESCRIVAO:'PF_ESCRIVAO',PAPILOSCOPISTA:'PF_ESCRIVAO'}, default:'PF_AGENTE'},
  {keys:['PRF','RODOVIÁRIA FEDERAL','RODOVIARIO FEDERAL'], default:'PRF'},
  {keys:['PCDF','POLÍCIA CIVIL DO DF','POLÍCIA CIVIL DF'], cargo:{DELEGADO:'PF_DELEGADO',AGENTE:'PCDF_AGENTE'}, default:'PCDF_AGENTE'},
  {keys:['PC-BA','PCBA','POLÍCIA CIVIL DA BAHIA','POLÍCIA CIVIL BAHIA','PC - BA'], cargo:{DELEGADO:'PC_DELEGADO',INVESTIGADOR:'PC_INVESTIGADOR',ESCRIVÃO:'PC_INVESTIGADOR',ESCRIVAO:'PC_INVESTIGADOR'}, default:'PC_INVESTIGADOR'},
  {keys:['PC-SP','PCSP','POLÍCIA CIVIL DE SÃO PAULO','PC - SP'], cargo:{DELEGADO:'PC_DELEGADO',INVESTIGADOR:'PC_INVESTIGADOR'}, default:'PC_INVESTIGADOR'},
  {keys:['PC-RJ','PCRJ','POLÍCIA CIVIL DO RIO'], cargo:{DELEGADO:'PC_DELEGADO',INSPETOR:'PC_INVESTIGADOR'}, default:'PC_INVESTIGADOR'},
  {keys:['PC-MG','PCMG','POLÍCIA CIVIL DE MINAS'], cargo:{DELEGADO:'PC_DELEGADO'}, default:'PC_INVESTIGADOR'},
  {keys:['POLÍCIA CIVIL','PC-'], cargo:{DELEGADO:'PC_DELEGADO'}, default:'PC_INVESTIGADOR'},
  {keys:['PM-BA','PMBA','POLÍCIA MILITAR DA BAHIA','POLÍCIA MILITAR BAHIA','PM - BA'], default:'PM_SOLDADO'},
  {keys:['PM-SP','PMSP','POLÍCIA MILITAR DE SÃO PAULO'], default:'PM_SOLDADO'},
  {keys:['PM-RJ','PMRJ'], default:'PM_SOLDADO'},
  {keys:['PM-MG','PMMG'], default:'PM_SOLDADO'},
  {keys:['POLÍCIA MILITAR','PM-','BM-','BOMBEIRO'], default:'PM_SOLDADO'},
  {keys:['INSS'], cargo:{ANALISTA:'INSS_ANALISTA',TÉCNICO:'INSS_TECNICO',TECNICO:'INSS_TECNICO'}, default:'INSS_TECNICO'},
  {keys:['RECEITA FEDERAL'], cargo:{AUDITOR:'RECEITA_AUDITOR',ANALISTA:'RECEITA_AUDITOR'}, default:'RECEITA_AUDITOR'},
  {keys:['TCU'], default:'TCU_ANALISTA'},
  {keys:['AGU','ADVOCACIA-GERAL'], default:'AGU_ADVOGADO'},
  {keys:['BANCO DO BRASIL','BB —','BB -','BB—'], default:'BB_ESCRITURARIO'},
  {keys:['CEF','CAIXA ECONÔMICA'], default:'CEF_TECNICO'},
  {keys:['BNB','BANCO DO NORDESTE'], default:'BNB_ANALISTA'},
  {keys:['TRF'], cargo:{ANALISTA:'TRF_ANALISTA',TÉCNICO:'TJ_TECNICO'}, default:'TRF_ANALISTA'},
  {keys:['TJ-','TJ —','TRIBUNAL DE JUSTIÇA'], cargo:{ANALISTA:'TJ_ANALISTA',TÉCNICO:'TJ_TECNICO',ESCREVENTE:'TJ_TECNICO'}, default:'TJ_ANALISTA'},
  {keys:['TST','TRIBUNAL SUPERIOR DO TRABALHO'], default:'TJ_ANALISTA'},
  {keys:['SEFAZ','SECRETARIA DA FAZENDA','AUDITOR FISCAL'], cargo:{AUDITOR:'SEFAZ_AUDITOR'}, default:'SEFAZ_AUDITOR'},
  {keys:['PROFESSOR','SEE-','SEC-','MAGISTÉRIO'], default:'PROFESSOR_ESTADUAL'},
  {keys:['EBSERH','HOSPITAL UNIVERSITÁRIO'], cargo:{ENFERMEIRO:'EBSERH_ENFERMEIRO',MÉDICO:'EBSERH_ENFERMEIRO'}, default:'EBSERH_ENFERMEIRO'},
  {keys:['PREFEITURA','CÂMARA MUNICIPAL'], default:'PREFEITURA_ANALISTA'},
];

function identificarEdital(concurso) {
  const upper = (concurso || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  
  for (const mapa of MAPA_CONCURSOS) {
    const match = mapa.keys.some(k => upper.includes(k.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')));
    if (match) {
      if (mapa.cargo) {
        for (const [cargoKey, editalKey] of Object.entries(mapa.cargo)) {
          if (upper.includes(cargoKey.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''))) {
            return EDITAIS[editalKey] || null;
          }
        }
      }
      return EDITAIS[mapa.default] || null;
    }
  }
  
  // Fallback por área
  return null;
}




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

    // Identifica edital real pelo nome do concurso
    let edital = identificarEdital(concurso);

    // Fallback por área se não encontrar edital específico
    if (!edital) {
      const FALLBACKS = {
        policial: EDITAIS['GENERICO_POLICIAL'],
        judicial: EDITAIS['GENERICO_JUDICIAL'],
        administrativa: EDITAIS['GENERICO_ADMINISTRATIVA'],
        bancaria: EDITAIS['GENERICO_BANCARIA'],
        saude: EDITAIS['EBSERH_ENFERMEIRO'],
        educacao: EDITAIS['PROFESSOR_ESTADUAL'],
      };
      edital = FALLBACKS[area] || EDITAIS['GENERICO_ADMINISTRATIVA'];
    }

    // Calcula semanas disponíveis
    let numSemanas = 8;
    if (data_prova) {
      const hoje = new Date();
      const prova = new Date(data_prova + 'T00:00:00');
      const dias = Math.ceil((prova - hoje) / (1000 * 60 * 60 * 24));
      if (dias > 0) numSemanas = Math.min(Math.max(Math.ceil(dias / 7), 4), 20);
    }

    // Horas por dia → questões estimadas
    const questoesPorDia = { '1h': 20, '2h': 40, '3h': 60, '4h': 80, '6h': 120, '8h+': 160 };
    const qDia = questoesPorDia[horas_dia] || 40;

    // Desempenho atual por disciplina
    const desempStr = desempenho && Object.keys(desempenho).length
      ? Object.entries(desempenho).map(([d, v]) => `${d}: ${Math.round(v.acertos / v.total * 100)}% (${v.total} questões)`).join('; ')
      : 'Nenhum histórico — aluno está iniciando';

    // Monta lista completa do edital
    const disciplinasEdital = edital.disciplinas
      .sort((a, b) => b.peso - a.peso)
      .map(d => `- ${d.nome} | Peso: ${d.peso}% | Assuntos: ${d.assuntos.join(', ')}`)
      .join('\n');

    const totalPeso = edital.disciplinas.reduce((a, d) => a + d.peso, 0);

    const prompt = `Você é especialista em concursos públicos brasileiros com acesso ao edital oficial.

DADOS DO ALUNO:
- Concurso: ${concurso}
- Nível atual: ${nivel || 'intermediario'}
- Horas de estudo por dia: ${horas_dia || '2h'} (~${qDia} questões/dia)
- Semanas disponíveis: ${numSemanas} semanas
- Total horas estimado: ${numSemanas * 7 * parseInt(horas_dia || '2')}h
- Desempenho atual por disciplina: ${desempStr}

EDITAL OFICIAL — TODAS AS DISCIPLINAS (total de pesos: ${totalPeso}%):
${disciplinasEdital}

REGRAS DO PLANO:
1. Crie EXATAMENTE ${numSemanas} semanas
2. TODAS as disciplinas do edital devem aparecer pelo menos uma vez
3. Disciplinas com maior peso devem ter mais semanas dedicadas
4. Prioridade ALTA: disciplinas com menos de 50% de acerto ou peso > 20%
5. Prioridade MÉDIA: disciplinas com 50-75% de acerto ou peso entre 10-20%
6. Prioridade BAIXA: disciplinas com mais de 75% de acerto e peso < 10%
7. Últimas ${Math.max(1, Math.floor(numSemanas * 0.2))} semanas = REVISÃO GERAL
8. Para cada disciplina, use APENAS assuntos do edital listado acima
9. Meta de questões por disciplina proporcional ao peso no edital
10. Distribua os assuntos de forma progressiva (básico → avançado)

Responda APENAS com JSON puro:
{
  "semanas": [
    {
      "numero": 1,
      "titulo": "título motivador",
      "foco": "disciplinas da semana",
      "tipo": "introducao|aprofundamento|revisao",
      "disciplinas": [
        {
          "nome": "nome EXATO da disciplina do edital",
          "peso": 15,
          "prioridade": "alta|media|baixa",
          "meta_questoes": 80,
          "horas_semana": 8,
          "assuntos": ["assunto específico 1", "assunto específico 2", "assunto específico 3"]
        }
      ]
    }
  ],
  "dica_ia": "dica estratégica personalizada para este concurso e perfil",
  "resumo": "resumo do plano em 2-3 frases motivadoras",
  "total_semanas": ${numSemanas},
  "total_horas": 0,
  "disciplinas_criticas": ["disc com baixo desempenho ou alto peso"],
  "disciplinas_ok": ["disc com bom desempenho"]
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
          { role: 'system', content: 'Especialista em concursos públicos brasileiros. Responda APENAS JSON puro válido, sem markdown, sem texto adicional, sem explicações fora do JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 4096
      })
    });

    const raw = await groqResp.json();
    if (!raw.choices?.[0]?.message?.content) throw new Error('Sem resposta da IA');

    const txt = raw.choices[0].message.content.replace(/```json|```/g, '').trim();
    const plano = JSON.parse(txt);
    plano._edital = edital;

    return res.status(200).json(plano);

  } catch (err) {
    console.error('Erro plano:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

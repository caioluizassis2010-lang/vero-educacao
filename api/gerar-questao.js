// api/gerar-questao.js — v4 — simples e robusto

const ESTILOS = {
  'CESPE': 'CESPE/CEBRASPE: afirmativas longas, linguagem formal alta, pegadinhas nos distratores, baseado em legislação real.',
  'FCC': 'FCC: 5 alternativas objetivas e formais, enunciado direto, distratores plausíveis.',
  'FGV': 'FGV: texto de contextualização obrigatório, abordagem crítica, casos práticos reais.',
  'VUNESP': 'VUNESP: texto base frequente, interpretação e aplicação prática, nível médio-alto.',
  'CESGRANRIO': 'CESGRANRIO: contexto técnico (Petrobras/BB/Marinha), 5 alternativas, nível alto.',
  'ESAF': 'ESAF: trecho de lei fiscal como base, questão sobre interpretação normativa, nível muito alto.',
  'IADES': 'IADES: 5 alternativas, foco em saúde e educação, nível médio-alto.',
  'QUADRIX': 'QUADRIX: estilo CESPE, foco em conselhos profissionais.',
  'IBFC': 'IBFC: 5 alternativas diretas, nível médio.',
  'AOCP': 'AOCP: 5 alternativas, nível médio.',
  'IDECAN': 'IDECAN: 5 alternativas, nível médio.',
  'FUNRIO': 'FUNRIO: 5 alternativas, saúde e educação.',
  'CONSULPLAN': 'CONSULPLAN: 5 alternativas diretas.',
  'OBJETIVA': 'OBJETIVA: 5 alternativas, municipal RS.',
  'FEPESE': 'FEPESE: 5 alternativas, estadual SC.',
  'FUNDATEC': 'FUNDATEC: 5 alternativas, municipal RS.',
  'FUNIVERSA': 'FUNIVERSA: 5 alternativas, GDF.',
  'UPENET': 'UPENET: 5 alternativas, nordeste.',
  'FAURGS': 'FAURGS: 5 alternativas, nível médio-alto RS.',
  'NUCEPE': 'NUCEPE: 5 alternativas, estadual PI.',
  'FADESP': 'FADESP: 5 alternativas, estadual PA.',
  'IBAM': 'IBAM: 5 alternativas, administração municipal.',
  'IESES': 'IESES: 5 alternativas, estadual SC.',
  'SOUSÂNDRADE': 'SOUSÂNDRADE: 5 alternativas, estadual MA.',
  'FUVEST': 'FUVEST/USP: contexto científico obrigatório, nível muito alto, raciocínio profundo, interdisciplinar, nunca decoreba.',
  'COMVEST': 'UNICAMP/COMVEST: 4 alternativas, dois textos combinados, abordagem crítica única, interdisciplinar.',
  'FAMERP': 'FAMERP: contexto biológico/químico obrigatório, foco Bio+Quim, nível muito alto.',
  'FCMSCSP': 'Santa Casa SP: biologia médica (histologia, anatomia, fisiologia), nível muito alto.',
  'FMABC': 'Einstein: raciocínio clínico e ciências básicas, nível muito alto.',
  'UNIFESP': 'UNIFESP: ciências da natureza profundas, nível muito alto.',
  'UERJ': 'UERJ: 4 alternativas, interdisciplinar, realidade brasileira, pensamento crítico.',
  'FAMEMA': 'FAMEMA: situação-problema clínica, competências médicas.',
  'UEL': 'UEL: 5 alternativas, nível alto, vestibular PR.',
  'ACAFE': 'ACAFE: 5 alternativas, nível médio-alto, SC.',
  'BAHIANA': 'BAHIANA: 5 alternativas, ciências da saúde, BA.',
  'UNIFOR': 'UNIFOR: 5 alternativas, nível médio-alto, CE.',
  'INEP': 'ENEM/INEP: texto-base obrigatório (trecho literário, notícia, dado de pesquisa ou charge descrita com fonte), 5 alternativas, interdisciplinar, contexto social, competências e habilidades, nunca memorização pura.'
};

const ASSUNTOS = {
  linguagens:['Interpretação de texto narrativo — narrador e ponto de vista','Figuras de linguagem — metáfora e ironia','Variação linguística e preconceito','Gêneros textuais — crônica','Coesão e coerência — conectivos','Modernismo — Drummond e Bandeira','Romantismo — Alencar e identidade nacional','Realismo — Machado de Assis','Intertextualidade e paródia','Linguagem publicitária e persuasão'],
  matematica:['Funções 1° grau — gráfico e situações reais','Funções 2° grau — máximo e mínimo','Geometria plana — áreas em projetos','Geometria espacial — volumes','Probabilidade — análise de risco','Estatística — gráficos e dados IBGE','Porcentagem — juros compostos','Progressão geométrica — crescimento exponencial','Trigonometria — topografia e engenharia','Combinatória — problemas cotidianos'],
  natureza:['Ecologia — desmatamento e biodiversidade','Ciclo do carbono e aquecimento global','Genética — transgênicos e biotecnologia','Genética — heredograma e doenças','Evolução — seleção natural','Imunologia — vacinas e imunidade','Química orgânica — polímeros e meio ambiente','Reações de combustão e poluição','Termodinâmica e eficiência energética','Física — fontes renováveis e sustentabilidade'],
  humanas:['República Velha — coronelismo','Era Vargas — populismo e trabalhismo','Ditadura Militar e AI-5','Constituição de 1988 e direitos','Imperialismo e partilha da África','Revolução Industrial e questão social','Segunda Guerra e Holocausto','Guerra Fria na América Latina','Urbanização brasileira e periferização','Desigualdade racial e políticas afirmativas'],
  biologia:['Citologia — membrana e transporte celular','Divisão celular e câncer','DNA — replicação e síntese proteica','CRISPR e edição genômica','Sistema nervoso e neurotransmissores','Sistema endócrino e diabetes','Biomas brasileiros — Cerrado e Caatinga','Resistência bacteriana e antibióticos','Evolução — especiação','Aedes aegypti e saúde pública'],
  quimica:['Isomeria óptica e fármacos','Reações orgânicas e polímeros','Eletroquímica — baterias de lítio','Equilíbrio químico — Le Chatelier','Termoquímica e biocombustíveis','Cinética — catalisadores industriais','Soluções e concentração farmacológica','pH — tampão biológico e chuva ácida','Radioatividade e medicina nuclear','Química ambiental — poluição hídrica'],
  fisica:['Leis de Newton — acidentes de trânsito','Conservação de energia em esportes','Máquinas térmicas e rendimento','Óptica — lentes e correção visual','Efeito Doppler e ultrassom médico','Campo elétrico e descargas atmosféricas','Circuitos elétricos e consumo de energia','Indução eletromagnética e geradores','Efeito fotoelétrico e energia solar','Física nuclear — fissão e usinas'],
  direito:['Remédios constitucionais — habeas corpus e mandado de segurança','Separação dos poderes','Princípios LIMPE e atos administrativos','Licitações — Lei 14.133/21','Responsabilidade civil objetiva','Crimes contra a administração pública','Direito tributário — impostos e taxas','FGTS — férias e jornada de trabalho','Lei de Improbidade Administrativa','LGPD — proteção de dados'],
  portugues:['Inferência e pressuposição textual','Concordância verbal — casos especiais','Regência verbal — assistir e visar','Crase — obrigatória e proibida','Pontuação — vírgula em orações','Semântica — polissemia e homonímia','Coesão — pronomes anafóricos','Dissertativo-argumentativo — estrutura','Redação oficial — ofício e memorando','Ortografia — acordo ortográfico'],
  administracao:['Taylor e Fayol — administração científica','Liderança situacional e motivação','Planejamento estratégico — SWOT','Orçamento público — LOA e LDO','Controle interno e auditoria','Processo administrativo — Lei 9.784','Reforma do Estado — gestão pública','Gestão por competências','Governança pública e transparência','Atendimento ao público e qualidade']
};

function sortearAssunto(area, disciplina) {
  let chave = (area||'').toLowerCase();
  if (!chave && disciplina) {
    const d = disciplina.toLowerCase();
    if(d.includes('bio')) chave='biologia';
    else if(d.includes('quim')) chave='quimica';
    else if(d.includes('fis')) chave='fisica';
    else if(d.includes('port')||d.includes('lingu')) chave='portugues';
    else if(d.includes('dir')) chave='direito';
    else if(d.includes('admin')) chave='administracao';
    else if(d.includes('mat')) chave='matematica';
    else if(d.includes('human')||d.includes('hist')||d.includes('geo')) chave='humanas';
    else if(d.includes('natur')) chave='natureza';
  }
  const lista = ASSUNTOS[chave] || ASSUNTOS.portugues;
  return lista[Math.floor(Math.random()*lista.length)];
}

module.exports = async function handler(req, res) {
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});

  const { sistema='concursos', banca, vestibular, disciplina, area, nivel_aluno='intermediario' } = req.body||{};

  const bancaFinal = banca||vestibular||(sistema==='enem'?'INEP':sistema==='medicina'?'FUVEST':'CESPE');
  const estilo = ESTILOS[bancaFinal]||ESTILOS[sistema==='enem'?'INEP':sistema==='medicina'?'FUVEST':'CESPE'];
  const nAlt = (bancaFinal==='COMVEST'||bancaFinal==='UERJ') ? 4 : 5;
  const assunto = sortearAssunto(area||null, disciplina||null);
  const gabarito = ['A','B','C','D','E'][Math.floor(Math.random()*nAlt)];
  const nivel = {iniciante:'fácil',basico:'básico',intermediario:'intermediário',avancado:'avançado',expert:'muito difícil'}[nivel_aluno]||'intermediário';

  const prompt = `Você cria questões de concurso e vestibular. Estilo: ${estilo}

Crie uma questão sobre: "${assunto}"${disciplina?`, disciplina ${disciplina}`:''}. Dificuldade: ${nivel}.
O gabarito DEVE ser a letra ${gabarito}.

FORMATO DE RESPOSTA — retorne APENAS este JSON preenchido, sem nenhum texto antes ou depois:

{"banca":"${bancaFinal}","disciplina":"${disciplina||assunto.split('—')[0].trim()}","assunto":"${assunto}","texto_base":"coloque aqui um texto de apoio de 60-120 palavras com fonte quando aplicável, ou deixe null","enunciado":"enunciado completo e claro da questão","opcoes":[{"letra":"A","texto":"alternativa A completa"},{"letra":"B","texto":"alternativa B completa"},{"letra":"C","texto":"alternativa C completa"},{"letra":"D","texto":"alternativa D completa"}${nAlt===5?',{"letra":"E","texto":"alternativa E completa"}':''}],"gabarito":"${gabarito}","explicacao_curta":"por que ${gabarito} está correta em 1 frase","explicacao_didatica":"parágrafo 1: por que ${gabarito} está correta com fundamentação. Parágrafo 2: por que cada outra está errada. Parágrafo 3: explicação do conteúdo como um professor ensinaria."}`;

  try {
    const key = process.env.GROQ_API_KEY;
    if(!key) return res.status(500).json({error:'GROQ_API_KEY não configurada'});

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[
          {role:'system',content:'Você retorna APENAS JSON válido puro. NUNCA coloque texto, explicação ou markdown fora do JSON. O JSON deve ter os campos: banca, disciplina, assunto, texto_base, enunciado, opcoes, gabarito, explicacao_curta, explicacao_didatica.'},
          {role:'user',content:prompt}
        ],
        max_tokens:1800,
        temperature:0.8
      })
    });

    if(!r.ok){
      const e=await r.text();
      return res.status(500).json({error:`Groq ${r.status}: ${e.substring(0,200)}`});
    }

    const data = await r.json();
    let txt = data.choices?.[0]?.message?.content||'';
    txt = txt.replace(/```json|```/g,'').trim();
    const ji=txt.indexOf('{'), je=txt.lastIndexOf('}');
    if(ji>=0&&je>ji) txt=txt.substring(ji,je+1);

    const q = JSON.parse(txt);

    // Validação flexível — aceita se tiver enunciado e opcoes
    if(!q.enunciado) return res.status(500).json({error:'Campo enunciado ausente na resposta'});
    if(!q.opcoes||!q.opcoes.length) return res.status(500).json({error:'Campo opcoes ausente na resposta'});
    if(!q.gabarito) q.gabarito = gabarito;

    return res.status(200).json({...q, fonte:'ia_calibrada', ok:true});

  } catch(e) {
    console.error('gerar-questao:',e.message);
    return res.status(500).json({error:e.message});
  }
};

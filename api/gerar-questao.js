// api/gerar-questao.js
// Gera questão calibrada pela banca: primeiro tenta banco real, depois IA calibrada
const { createClient } = require('@supabase/supabase-js');

const PROMPTS_BANCA = {
  // ── CONCURSOS ──
  'CESPE': `Você é especialista em provas CESPE/CEBRASPE.
Características obrigatórias:
- Afirmativas longas e complexas com análise crítica
- Linguagem técnica e formal, nível alto
- Quando certo/errado: frases que parecem corretas mas têm sutileza
- Quando múltipla escolha: 5 alternativas (A-E), pegadinhas nos distratores
- Sempre contextualizado com legislação ou situação prática
- Gabarito: letra da correta (A-E) ou C/E`,

  'FCC': `Você é especialista em provas FCC (Fundação Carlos Chagas).
Características obrigatórias:
- 5 alternativas objetivas e formais
- Enunciado direto sem ambiguidades propositais
- Foco em conhecimento técnico e legislação específica
- Distratores plausíveis mas claramente incorretos
- Linguagem formal e precisa`,

  'FGV': `Você é especialista em provas FGV (Fundação Getulio Vargas).
Características obrigatórias:
- 5 alternativas com texto de contextualização obrigatório
- Abordagem crítica e analítica
- Questões que exigem raciocínio, não memorização
- Frequentemente usa casos práticos e situações reais
- Nível alto de complexidade`,

  'VUNESP': `Você é especialista em provas VUNESP.
Características obrigatórias:
- 5 alternativas com texto base frequente
- Foco em interpretação e aplicação prática
- Linguagem acessível mas técnica
- Equilíbrio entre teoria e prática`,

  'CESGRANRIO': `Você é especialista em provas CESGRANRIO.
Características obrigatórias:
- 5 alternativas formais e técnicas
- Muito usado para Petrobras, BB, Marinha
- Foco em conhecimentos específicos da área
- Nível alto, questões elaboradas`,

  'ESAF': `Você é especialista em provas ESAF (fiscal/tributário).
Características obrigatórias:
- 5 alternativas com foco em legislação fiscal e tributária
- Questões sobre Receita Federal, Auditoria, Contabilidade
- Nível muito alto de complexidade técnica
- Interpretação de artigos de lei frequente`,

  'IADES': `Você é especialista em provas IADES.
Características obrigatórias:
- 5 alternativas, mistura de estilos
- Foco em saúde e educação frequentemente
- Linguagem médio-alto
- Pegadinhas moderadas`,

  'QUADRIX': `Você é especialista em provas QUADRIX.
Características obrigatórias:
- Mistura de certo/errado (estilo CESPE) com múltipla escolha
- Foco em conselhos profissionais (CRM, CRF, etc.)
- Linguagem técnica da área de saúde/regulação`,

  'DEFAULT_CONCURSOS': `Você é especialista em concursos públicos brasileiros.
Características obrigatórias:
- 5 alternativas (A-E) objetivas
- Enunciado claro e técnico
- Distratores plausíveis
- Baseado em legislação e conhecimentos da área`,

  // ── MEDICINA / VESTIBULARES ──
  'FUVEST': `Você é especialista em provas FUVEST (USP).
Características obrigatórias:
- Questões de altíssimo nível — uma das provas mais difíceis do Brasil
- Biologia: citologia, genética, ecologia, fisiologia em profundidade
- Química: orgânica, equilíbrio químico, eletroquímica
- Física: ótica, eletromagnetismo, mecânica avançada
- Matemática: funções, geometria analítica, probabilidade
- Interdisciplinaridade frequente
- 5 alternativas (A-E), sem pegadinhas, mas exige raciocínio profundo
- Contextualização científica moderna (artigos, descobertas)`,

  'COMVEST': `Você é especialista em provas UNICAMP (COMVEST).
Características obrigatórias:
- Abordagem crítica e interdisciplinar — questões únicas no Brasil
- Exige capacidade analítica e síntese
- 4 alternativas (A-D)
- Textos longos com múltiplas fontes
- Questões que fogem do padrão de outras bancas
- Forte componente de interpretação e argumentação`,

  'FAMERP': `Você é especialista em provas FAMERP.
Características obrigatórias:
- Foco intenso em Biologia e Química (70% da prova)
- 5 alternativas objetivas
- Nível muito alto em ciências da natureza
- Questões diretas mas exigentes`,

  'FCMSCSP': `Você é especialista em provas Santa Casa de São Paulo.
Características obrigatórias:
- Biologia médica em profundidade (histologia, anatomia)
- 5 alternativas objetivas
- Nível muito alto
- Foco em ciências biológicas aplicadas à medicina`,

  'UERJ': `Você é especialista em provas UERJ.
Características obrigatórias:
- 4 alternativas (A-D)
- Fortemente interdisciplinar — mistura disciplinas
- Questões conceituais e analíticas
- Duas fases: específica e discursiva
- Abordagem crítica da realidade brasileira`,

  'DEFAULT_MEDICINA': `Você é especialista em vestibulares de medicina brasileiros.
Características obrigatórias:
- Nível muito alto em Biologia e Química
- 5 alternativas (A-E)
- Foco em ciências da natureza aplicadas
- Contextualização científica
- Distratores tecnicamente elaborados`,

  // ── ENEM ──
  'INEP': `Você é especialista em provas ENEM (INEP).
Características OBRIGATÓRIAS — o ENEM tem padrão único:
- SEMPRE começa com texto(s) de apoio: pode ser literário, jornalístico, científico, charge, gráfico
- Avalia COMPETÊNCIAS e HABILIDADES, não memorização
- 5 alternativas (A-E) — nunca C/E
- Interdisciplinaridade: uma questão pode envolver 2+ disciplinas
- Contexto social, ambiental, cultural sempre presente
- Linguagem acessível mas o raciocínio é complexo
- Áreas: Linguagens, Matemática, Ciências da Natureza, Ciências Humanas
- Questões de Matemática: sempre aplicação prática, nunca cálculo puro
- Questões de Natureza: Bio+Física+Química integradas
- Questões de Humanas: História+Geografia+Filosofia+Sociologia integradas
- Redação: dissertativo-argumentativo, proposta de intervenção obrigatória`
};

async function buscarDoBanco(sb, sistema, banca, disciplina, dificuldade, excluirIds) {
  const params = { p_sistema: sistema };
  if (banca) params.p_banca = banca;
  if (disciplina) params.p_disciplina = disciplina;
  if (dificuldade) params.p_dificuldade = dificuldade;
  if (excluirIds?.length) params.p_excluir_ids = excluirIds;

  const { data } = await sb.rpc('buscar_questao_banco', params);
  return data?.[0] || null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    sistema = 'concursos',
    banca,
    vestibular,
    disciplina,
    assunto,
    dificuldade,
    nivel_aluno = 'intermediario',
    excluir_ids = [],
    forcar_ia = false
  } = req.body;

  const sb = createClient(
    'https://lklmzhunhiwqsbhnymaw.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_DvhwDRaB-L4kO9gOYXgtxw_0jVdsuHU'
  );

  const bancaFinal = banca || vestibular;

  // 1. Tenta buscar questão real do banco
  if (!forcar_ia && bancaFinal) {
    try {
      const questaoReal = await buscarDoBanco(sb, sistema, bancaFinal, disciplina, dificuldade, excluir_ids);
      if (questaoReal) {
        return res.status(200).json({
          ...questaoReal,
          fonte: 'banco_real',
          ok: true
        });
      }
    } catch (e) {
      console.error('Erro ao buscar do banco:', e.message);
    }
  }

  // 2. Gera via IA calibrada pelo padrão da banca
  const promptBase = PROMPTS_BANCA[bancaFinal] ||
    (sistema === 'enem' ? PROMPTS_BANCA['INEP'] :
     sistema === 'medicina' ? PROMPTS_BANCA['DEFAULT_MEDICINA'] :
     PROMPTS_BANCA['DEFAULT_CONCURSOS']);

  const nivelMap = {
    iniciante: 'fácil (nível 1-2)',
    basico: 'básico (nível 2)',
    intermediario: 'intermediário (nível 3)',
    avancado: 'avançado (nível 4)',
    expert: 'muito difícil (nível 5)'
  };

  const disciplinaInstr = disciplina ? `Disciplina: ${disciplina}.` : '';
  const assuntoInstr = assunto ? `Assunto específico: ${assunto}.` : '';
  const nivelInstr = `Dificuldade: ${nivelMap[nivel_aluno] || 'intermediário'}.`;

  const prompt = `${promptBase}

${disciplinaInstr} ${assuntoInstr} ${nivelInstr}

Crie UMA questão seguindo EXATAMENTE o padrão descrito acima.

Retorne SOMENTE JSON válido sem markdown:
{
  "banca": "${bancaFinal || 'GERAL'}",
  "disciplina": "nome da disciplina",
  "assunto": "subtópico específico",
  "dificuldade": 3,
  "tipo": "multipla_escolha",
  "texto_base": "texto de apoio se necessário ou null",
  "enunciado": "enunciado completo da questão",
  "opcoes": [
    {"letra": "A", "texto": "alternativa A"},
    {"letra": "B", "texto": "alternativa B"},
    {"letra": "C", "texto": "alternativa C"},
    {"letra": "D", "texto": "alternativa D"},
    {"letra": "E", "texto": "alternativa E"}
  ],
  "gabarito": "C",
  "explicacao": "Explicação detalhada de por que a resposta é correta e por que as outras são incorretas"
}`;

  try {
    // Tenta Groq direto primeiro, fallback via proxy /api/groq
    let txt = '';
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.4
        })
      });
      const groqData = await groqRes.json();
      txt = groqData.choices?.[0]?.message?.content || '';
    } catch(groqErr) {
      // Fallback: chama proxy interno
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
      const proxyRes = await fetch(`${baseUrl}/api/groq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.4
        })
      });
      const proxyData = await proxyRes.json();
      txt = proxyData.choices?.[0]?.message?.content || '';
    }

    if (!txt) throw new Error('Resposta vazia do modelo');
    txt = txt.replace(/```json|```/g, '').trim();
    // Garante que pega só o JSON
    const ji = txt.indexOf('{'), je = txt.lastIndexOf('}');
    if (ji >= 0 && je > ji) txt = txt.substring(ji, je + 1);
    const questao = JSON.parse(txt);

    // Salva no banco como ia_calibrada para aprendizado futuro
    try {
      await sb.from('questoes_banco').insert({
        sistema, banca: bancaFinal, disciplina: questao.disciplina,
        assunto: questao.assunto, dificuldade: questao.dificuldade || 3,
        tipo: questao.tipo || 'multipla_escolha',
        texto_base: questao.texto_base || null,
        enunciado: questao.enunciado, opcoes: questao.opcoes,
        gabarito: questao.gabarito, explicacao: questao.explicacao,
        fonte: 'ia_calibrada', ativo: true
      });
    } catch (e) { /* não crítico */ }

    return res.status(200).json({ ...questao, fonte: 'ia_calibrada', ok: true });

  } catch (e) {
    return res.status(500).json({ error: 'Erro ao gerar questão: ' + e.message });
  }
};

const { identificarEdital, EDITAIS } = require('./editais');

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

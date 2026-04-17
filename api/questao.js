module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    if (!body) body = {};

    const disciplina = body.disciplina || 'Direito Constitucional';
    const banca = body.banca || 'CESPE';
    const assunto = body.assunto || null;
    const concurso = body.concurso || null;
    const nivel = body.nivel || 'intermediario';

    // Monta o prompt personalizado
    let prompt = '';

    if (concurso && assunto) {
      prompt = `Você é um especialista em concursos públicos brasileiros. Crie uma questão de ${disciplina} sobre o assunto "${assunto}" no estilo da banca ${banca}, calibrada para o concurso "${concurso}" em nível ${nivel}. Use o padrão real de questões cobradas nesse concurso — linguagem, formato e dificuldade típicos dessa banca.`;
    } else if (concurso) {
      prompt = `Você é um especialista em concursos públicos brasileiros. Crie uma questão de ${disciplina} no estilo da banca ${banca}, calibrada para o concurso "${concurso}" em nível ${nivel}. Use o padrão real cobrado nesse concurso.`;
    } else {
      prompt = `Você é um especialista em concursos públicos brasileiros. Crie uma questão de ${disciplina} no estilo da banca ${banca} em nível ${nivel}.`;
    }

    prompt += ` Responda APENAS em JSON puro sem markdown, neste formato exato: {"enunciado":"texto da questão aqui","opcoes":["A) opção 1","B) opção 2","C) opção 3","D) opção 4","E) opção 5"],"gabarito":"A","explicacao":"explicação detalhada da resposta correta","assunto":"assunto específico da questão"}`;

    const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é especialista em concursos públicos brasileiros. Conheça os padrões de cada banca (CESPE usa certo/errado e assertivas, FCC usa letra de lei, FGV usa casos práticos). Responda APENAS com JSON puro e válido, sem texto adicional, sem markdown.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const text = await groqResp.text();
    let data;
    try { data = JSON.parse(text); }
    catch(e) { return res.status(500).json({ error: 'Resposta inválida do Groq', raw: text.substring(0,200) }); }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ error: 'Sem resposta da IA', data });
    }

    const content = data.choices[0].message.content.replace(/```json|```/g, '').trim();
    const questao = JSON.parse(content);
    return res.status(200).json(questao);

  } catch (err) {
    console.error('Erro:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

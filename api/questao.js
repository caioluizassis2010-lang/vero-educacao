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

    const prompt = `Crie uma questão de concurso público de ${disciplina} no estilo da banca ${banca}. Responda APENAS em JSON puro sem markdown, neste formato exato: {"enunciado":"texto da questão aqui","opcoes":["A) opção 1","B) opção 2","C) opção 3","D) opção 4","E) opção 5"],"gabarito":"A","explicacao":"explicação detalhada da resposta correta"}`;

    const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Você é especialista em concursos públicos brasileiros. Responda APENAS com JSON puro e válido, sem texto adicional, sem markdown, sem explicações fora do JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const text = await groqResp.text();
    console.log('Groq raw response:', text.substring(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      return res.status(500).json({ error: 'Groq retornou resposta inválida', raw: text.substring(0, 300) });
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ error: 'Estrutura inesperada do Groq', data });
    }

    const content = data.choices[0].message.content.replace(/```json|```/g, '').trim();
    console.log('Content:', content.substring(0, 200));

    const questao = JSON.parse(content);
    return res.status(200).json(questao);

  } catch (err) {
    console.error('Erro geral:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

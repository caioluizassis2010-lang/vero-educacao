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
    const concurso = body.concurso || null;
    const nivel = body.nivel || 'intermediario';
    const assunto = body.assunto || null;

    // Prompt compacto e direto
    const contexto = concurso
      ? `para o concurso "${concurso}" no estilo ${banca}, nível ${nivel}`
      : `no estilo da banca ${banca}, nível ${nivel}`;

    const assuntoCtx = assunto ? ` sobre "${assunto}"` : '';

    const prompt = `Crie uma questão de múltipla escolha de ${disciplina}${assuntoCtx} ${contexto}.
JSON puro: {"enunciado":"...","opcoes":["A) ...","B) ...","C) ...","D) ...","E) ..."],"gabarito":"A","explicacao":"...","assunto":"..."}`;

    // Tenta modelos em ordem de preferência
    const models = [
      'llama-3.3-70b-versatile',
      'llama3-70b-8192',
      'mixtral-8x7b-32768'
    ];

    let data = null;
    let lastError = null;

    for (const model of models) {
      try {
        const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'Especialista em concursos públicos brasileiros. Responda APENAS JSON puro válido, sem markdown.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.6,
            max_tokens: 800
          })
        });

        const raw = await groqResp.json();
        
        if (raw.error) {
          lastError = `${model}: ${raw.error.message || JSON.stringify(raw.error)}`;
          continue;
        }
        
        if (!raw.choices?.[0]?.message?.content) {
          lastError = `${model}: sem choices`;
          continue;
        }

        // Parse JSON
        let txt = raw.choices[0].message.content.replace(/```json|```/g, '').trim();
        const ji = txt.indexOf('{');
        const je = txt.lastIndexOf('}');
        if (ji >= 0 && je > ji) txt = txt.substring(ji, je + 1);
        
        data = JSON.parse(txt);
        break; // sucesso!

      } catch (modelErr) {
        lastError = `${model}: ${modelErr.message}`;
        continue;
      }
    }

    if (!data) {
      return res.status(500).json({ error: 'Todos os modelos falharam: ' + lastError });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Erro questao:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { disciplina, banca } = req.body;

  const prompt = `Crie uma questão de concurso público de ${disciplina} no estilo da banca ${banca}. Responda APENAS em JSON puro sem markdown: {"enunciado":"texto","opcoes":["A) texto","B) texto","C) texto","D) texto","E) texto"],"gabarito":"A","explicacao":"explicação"}`;

  const resp = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-latest:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': 'AQ.Ab8RN6K4TjZbsx6VBVpFA4T7U_9n6nqR60sBmo_sOtdAoZqDqw'
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    }
  );

  const data = await resp.json();
  const raw = data.candidates[0].content.parts[0].text.replace(/```json|```/g,'').trim();
  res.status(200).json(JSON.parse(raw));
}

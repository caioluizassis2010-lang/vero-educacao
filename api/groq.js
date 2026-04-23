// api/groq.js — Proxy Groq seguro
// A chave fica na variável de ambiente GROQ_API_KEY no Vercel.
// O frontend chama POST /api/groq e nunca vê a chave.

module.exports = async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY não configurada no Vercel' });
  }

  try {
    const { messages, max_tokens = 1200, temperature = 0.4, model = 'llama-3.3-70b-versatile' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Campo messages é obrigatório' });
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens, temperature }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      return res.status(groqRes.status).json({ error: err });
    }

    const data = await groqRes.json();
    return res.status(200).json(data);

  } catch (e) {
    console.error('Erro no proxy Groq:', e);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

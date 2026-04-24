// api/captura-email.js
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, nome, origem } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email inválido' });

  const resendKey = process.env.RESEND_API_KEY;
  const sb = createClient(
    'https://lklmzhunhiwqsbhnymaw.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_DvhwDRaB-L4kO9gOYXgtxw_0jVdsuHU'
  );

  // Salva no Supabase
  const { error: dbError } = await sb.from('leads').upsert({
    email: email.toLowerCase().trim(),
    nome: nome || null,
    origem: origem || 'desconhecido',
  }, { onConflict: 'email' });

  if (dbError) console.error('DB error:', dbError);

  // Envia email de boas-vindas via Resend
  if (resendKey) {
    try {
      const origemLabel = {
        'index': 'página inicial',
        'concursos': 'página de concursos',
        'enem': 'página do ENEM',
        'medicina': 'página de Medicina',
      }[origem] || 'nosso site';

      const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bem-vindo à Vofor</title></head>
<body style="margin:0;padding:0;background:#0f0d0b;font-family:'Outfit',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">
    
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:36px">
      <span style="font-family:Georgia,serif;font-size:1.4rem;font-weight:600;letter-spacing:.4em;color:#ede8e2;text-transform:uppercase">VOFOR</span>
    </div>

    <!-- Card principal -->
    <div style="background:#1c1814;border:1px solid rgba(180,175,168,0.15);border-radius:16px;padding:36px 32px;margin-bottom:20px">
      <h1 style="font-family:Georgia,serif;font-size:1.8rem;font-weight:700;color:#ede8e2;margin:0 0 8px;line-height:1.2">
        Você está na lista. <span style="font-style:italic;color:#b4afa8">✦</span>
      </h1>
      <p style="font-size:.95rem;color:#8a7d70;margin:0 0 24px;font-weight:300;line-height:1.7">
        Recebemos seu email pela ${origemLabel}. A partir de agora você vai receber alertas de editais, dicas de estudo e novidades da Vofor.
      </p>

      <div style="background:#2e2520;border-radius:10px;padding:20px 22px;margin-bottom:24px">
        <p style="font-size:.82rem;color:#b4afa8;font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin:0 0 12px">O que você vai receber</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="font-size:.88rem;color:#8a7d70;font-weight:300">📬 Alertas quando sair edital do seu concurso</div>
          <div style="font-size:.88rem;color:#8a7d70;font-weight:300">📊 Dicas semanais de estudo</div>
          <div style="font-size:.88rem;color:#8a7d70;font-weight:300">🎯 Novidades e recursos da plataforma</div>
        </div>
      </div>

      <a href="https://vero-educacao.vercel.app/cadastro.html" 
         style="display:block;text-align:center;background:#b4afa8;color:#0f0d0b;padding:14px 24px;border-radius:9px;font-size:.95rem;font-weight:700;text-decoration:none;letter-spacing:.02em">
        Criar conta grátis agora →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:16px 0">
      <p style="font-size:.75rem;color:rgba(200,188,175,0.35);margin:0;line-height:1.7">
        © 2025 VOFOR Educação · Estudo com método. Resultado de verdade.<br>
        <a href="#" style="color:rgba(200,188,175,0.35);text-decoration:underline">Cancelar inscrição</a>
      </p>
    </div>

  </div>
</body>
</html>`;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'VOFOR Educação <onboarding@resend.dev>',
          to: [email],
          subject: 'Você está na lista da Vofor ✦',
          html,
        }),
      });
    } catch (e) {
      console.error('Resend error:', e);
    }
  }

  return res.status(200).json({ ok: true });
};

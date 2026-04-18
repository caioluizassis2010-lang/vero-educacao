module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();

  try{
    let body=req.body;
    if(typeof body==='string')body=JSON.parse(body);
    if(!body)body={};

    const disc=body.disciplina||'Direito Constitucional';
    const banca=body.banca||'CESPE';
    const concurso=body.concurso||null;
    const nivel=body.nivel||'intermediario';

    const prompt='Questão de múltipla escolha de '+disc+
      (concurso?' para '+concurso:'')+
      ' estilo '+banca+' nível '+nivel+
      '. JSON: {"enunciado":"...","opcoes":["A) ...","B) ...","C) ...","D) ...","E) ..."],"gabarito":"A","explicacao":"...","assunto":"..."}';

    const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer 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'
      },
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[
          {role:'system',content:'Responda APENAS JSON puro válido sem markdown.'},
          {role:'user',content:prompt}
        ],
        temperature:0.6,
        max_tokens:600
      })
    });

    const raw=await r.json();
    if(raw.error)throw new Error(raw.error.message||JSON.stringify(raw.error));
    if(!raw.choices?.[0]?.message?.content)throw new Error('Sem resposta');

    let txt=raw.choices[0].message.content.replace(/```json|```/g,'').trim();
    const ji=txt.indexOf('{'),je=txt.lastIndexOf('}');
    if(ji>=0&&je>ji)txt=txt.substring(ji,je+1);

    return res.status(200).json(JSON.parse(txt));

  }catch(err){
    console.error(err.message);
    return res.status(500).json({error:err.message});
  }
}

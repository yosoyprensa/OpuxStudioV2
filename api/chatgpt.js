export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, provider = 'gemini', apiKey, isYtExpert = false } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Falta el prompt o tema' });
  }

  const systemPrompt = isYtExpert
    ? "Act as a professional YouTube Shorts and long-form animated storytelling director, viral video strategist, storyboard artist, AI image prompt engineer, AI video prompt engineer, and voice-over scriptwriter. Write a compelling script divided into clear spoken paragraphs for voiceover narration. Every paragraph represents an individual scene. Do not include scene titles or timestamps in the spoken text, keep it natural and optimized for high audience retention."
    : "Eres un director de video y guionista audiovisual. Escribe un guión estructurado en párrafos claros para locución. Cada párrafo representa una escena independiente sin subtítulos técnicos.";

  try {
    if (provider === 'gemini') {
      const geminiKey = apiKey || process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return res.status(400).json({ error: 'Falta la API Key de Gemini' });
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        return res.status(502).json({ error: 'Error en la API de Gemini', details: errorData });
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return res.status(200).json({ script: generatedText });
    }

    const openaiKey = apiKey || process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return res.status(400).json({ error: 'Falta la API Key de OpenAI' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(502).json({ error: 'Error en la API de OpenAI', details: errorData });
    }

    const data = await response.json();
    return res.status(200).json({ script: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno en el servidor', message: error.message });
  }
}
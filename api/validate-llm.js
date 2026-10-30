export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider = 'gemini', apiKey } = req.body;
  const token = apiKey;

  if (!token) {
    return res.status(400).json({ success: false, error: 'Falta ingresar la API Key' });
  }

  try {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${token}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'ping' }] }]
        })
      });

      if (response.ok) {
        return res.status(200).json({ success: true, message: 'Google Gemini conectado con éxito' });
      } else {
        const err = await response.json();
        return res.status(401).json({ success: false, error: err.error?.message || 'API Key de Gemini rechazada' });
      }
    } else {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        return res.status(200).json({ success: true, message: 'ChatGPT (OpenAI) conectado con éxito' });
      } else {
        return res.status(401).json({ success: false, error: 'API Key de OpenAI rechazada o vencida' });
      }
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
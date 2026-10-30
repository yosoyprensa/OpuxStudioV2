export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voice = 'es-ES-AlvaroNeural', apiKey } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Falta el texto de la locucion' });
  }

  const token = apiKey || process.env.AI33_API_KEY;

  try {
    const response = await fetch('https://api.ai33.pro/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: text,
        voice: voice,
        response_format: 'mp3'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({ error: 'ai33.pro error', details: errorText });
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    return res.send(Buffer.from(audioBuffer));
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
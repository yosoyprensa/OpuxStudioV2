export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey } = req.body;
  const token = apiKey || process.env.AI33_API_KEY;

  if (!token) {
    return res.status(400).json({ success: false, error: 'Falta la API Key de ai33.pro' });
  }

  try {
    const defaultFullVoices = [
      { id: 'es-ES-AlvaroNeural', name: 'Álvaro (Documental / Tono Profundo - España)', lang: 'es-ES' },
      { id: 'es-ES-ElviraNeural', name: 'Elvira (Narrativa / Clara - España)', lang: 'es-ES' },
      { id: 'es-MX-JorgeNeural', name: 'Jorge (Impacto / Autoridad - México)', lang: 'es-MX' },
      { id: 'es-MX-DaliaNeural', name: 'Dalia (Dinámica / Fluida - México)', lang: 'es-MX' },
      { id: 'es-US-AlonsoNeural', name: 'Alonso (Locutor Comercial - EE.UU.)', lang: 'es-US' },
      { id: 'es-US-PalomaNeural', name: 'Paloma (Storytelling / Emotiva - EE.UU.)', lang: 'es-US' },
      { id: 'es-AR-TomasNeural', name: 'Tomás (Conversacional - Argentina)', lang: 'es-AR' },
      { id: 'es-AR-ElenaNeural', name: 'Elena (Pausada / Académica - Argentina)', lang: 'es-AR' },
      { id: 'es-CO-GonzaloNeural', name: 'Gonzalo (Neutro / Técnico - Colombia)', lang: 'es-CO' },
      { id: 'es-CO-SalomeNeural', name: 'Salomé (Cálida / Explicativa - Colombia)', lang: 'es-CO' },
      { id: 'alloy', name: 'Alloy (OpenAI Neural TTS - Neutro)', lang: 'multi' },
      { id: 'echo', name: 'Echo (OpenAI Neural TTS - Enérgico)', lang: 'multi' },
      { id: 'fable', name: 'Fable (OpenAI Neural TTS - Expresivo)', lang: 'multi' },
      { id: 'onyx', name: 'Onyx (OpenAI Neural TTS - Barítono)', lang: 'multi' },
      { id: 'nova', name: 'Nova (OpenAI Neural TTS - Directa)', lang: 'multi' },
      { id: 'shimmer', name: 'Shimmer (OpenAI Neural TTS - Cristalina)', lang: 'multi' }
    ];

    return res.status(200).json({ success: true, count: defaultFullVoices.length, voices: defaultFullVoices });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
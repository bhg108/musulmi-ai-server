const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Musulmi Hausa AI server is running',
  });
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = (req.body?.message || '').toString().trim();

    console.log('Incoming message:', userMessage);

    if (!userMessage) {
      return res.status(400).json({
        reply: 'Ba a aiko da tambaya ba.',
      });
    }

    const apiKey = (process.env.OPENAI_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(500).json({
        reply: 'OPENAI_API_KEY bai samu ba a server.',
      });
    }

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      instructions:
        'Kai mataimaki ne na Musulmi Hausa app. Ka fara da sallama irinta Musulunci. Ka rika amsa da Hausa mai sauki, girmamawa, da fahimta, har ma wani lokacin da misalai masu ma’ana daga ayyuka ko furucin annabawa ko sahabbai, ko wasu mutanen kirki Musulmai. Idan tambayar ta shafi addini, ka yi taka-tsantsan, kada ka kirkiri hujjoji ko ayoyi. Idan ba ka da tabbaci, ka fada a hankali cewa kana bukatar a duba ingantattun malamai ko majiyoyi.',
      input: userMessage,
    });

    const reply =
      response.output_text?.trim() ||
      'Na kasa samar da amsa a yanzu. Ka sake gwadawa.';

    console.log('OpenAI reply OK');

    return res.json({ reply });
  } catch (error) {
    console.error('OpenAI error full:', error);

    return res.status(error?.status || 500).json({
      reply: `Matsala daga AI server: ${error?.message || 'Unknown error'}`,
      status: error?.status || 500,
      type: error?.type || null,
      code: error?.code || null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI server running on port ${PORT}`);
});

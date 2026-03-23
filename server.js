const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="ha">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Musulmi Hausa AI</title>
  <style>
    :root{
      --bg:#f6f7f1;
      --card:#ffffff;
      --text:#1f2937;
      --muted:#6b7280;
      --primary:#5e8f55;
      --primary-dark:#4e7a47;
      --line:#e5e7eb;
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
      background:var(--bg);
      color:var(--text);
    }
    .wrap{
      max-width:900px;
      margin:0 auto;
      padding:20px 16px 120px;
    }
    .hero{
      text-align:center;
      padding:18px 12px 10px;
    }
    .title{
      font-size:40px;
      font-weight:800;
      color:var(--primary-dark);
      margin:0 0 10px;
      letter-spacing:-0.02em;
    }
    .subtitle{
      margin:0 auto;
      max-width:720px;
      font-size:18px;
      line-height:1.7;
      color:#374151;
    }
    .grid{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:14px;
      margin:24px 0 20px;
    }
    .card{
      background:var(--card);
      border:1px solid var(--line);
      border-radius:18px;
      padding:18px;
      box-shadow:0 4px 12px rgba(0,0,0,.04);
      cursor:pointer;
      transition:.15s ease;
    }
    .card:hover{transform:translateY(-1px)}
    .card h3{
      margin:0 0 8px;
      font-size:24px;
      color:var(--primary-dark);
    }
    .card p{
      margin:0;
      color:var(--muted);
      line-height:1.6;
      font-size:16px;
    }
    .chatBox{
      background:var(--card);
      border:1px solid var(--line);
      border-radius:20px;
      box-shadow:0 4px 14px rgba(0,0,0,.04);
      overflow:hidden;
    }
    .chatHead{
      padding:16px 18px;
      border-bottom:1px solid var(--line);
      background:#fbfcf8;
      font-weight:700;
      color:var(--primary-dark);
    }
    .messages{
      min-height:320px;
      max-height:58vh;
      overflow:auto;
      padding:16px;
      background:#fafbf8;
    }
    .msg{
      max-width:82%;
      padding:14px 15px;
      border-radius:16px;
      margin-bottom:12px;
      line-height:1.7;
      white-space:pre-wrap;
      word-wrap:break-word;
      border:1px solid var(--line);
    }
    .user{
      margin-left:auto;
      background:#e9f4e6;
    }
    .bot{
      background:#fff;
    }
    .composer{
      display:flex;
      gap:10px;
      padding:14px;
      border-top:1px solid var(--line);
      background:#fff;
      position:sticky;
      bottom:0;
    }
    textarea{
      flex:1;
      resize:none;
      min-height:56px;
      max-height:160px;
      border:1px solid #cfd4dc;
      border-radius:16px;
      padding:14px 16px;
      font:inherit;
      outline:none;
      background:#fff;
    }
    button{
      border:none;
      background:var(--primary);
      color:#fff;
      font-weight:700;
      border-radius:16px;
      padding:0 22px;
      min-width:110px;
      cursor:pointer;
      font-size:18px;
    }
    button:hover{background:var(--primary-dark)}
    button:disabled{opacity:.65;cursor:not-allowed}
    .quick{
      display:flex;
      gap:10px;
      flex-wrap:wrap;
      margin:0 0 14px;
      padding:0 16px 12px;
    }
    .chip{
      background:#fff;
      border:1px solid var(--line);
      border-radius:999px;
      padding:10px 14px;
      cursor:pointer;
      color:#374151;
      font-size:14px;
    }
    .status{
      font-size:14px;
      color:var(--muted);
      padding:0 16px 12px;
    }
    @media (max-width:700px){
      .title{font-size:30px}
      .subtitle{font-size:16px}
      .grid{grid-template-columns:1fr}
      .msg{max-width:92%}
      .composer{flex-direction:column}
      button{height:52px}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <section class="hero">
      <h1 class="title">Musulmi Hausa AI</h1>
      <p class="subtitle">
        Tambayi AI da Hausa ko Turanci game da addini, ibada, azumi, sallah, sadaka,
        tarbiyya, da bayanai na yau da kullum cikin sauƙi da girmamawa.
      </p>
    </section>

    <section class="grid">
      <div class="card" onclick="fillPrompt('Menene ma’anar Musulunci?')">
        <h3>Addinin Musulunci</h3>
        <p>Tambayoyi game da ginshiƙai, imani, ibada, da rayuwar Musulmi.</p>
      </div>
      <div class="card" onclick="fillPrompt('Ka yi min bayani game da Alƙur’ani da Hadisi.')">
        <h3>Alƙur’ani da Hadisi</h3>
        <p>Bayani cikin Hausa mai sauƙi kan ma’anoni da fahimta.</p>
      </div>
      <div class="card" onclick="fillPrompt('Menene hukuncin sadaka da zakka?')">
        <h3>Sadaka da Zakka</h3>
        <p>Tambayoyi kan taimako, zakka, falala, da nau’o’in sadaka.</p>
      </div>
      <div class="card" onclick="fillPrompt('Mene ne amfanin azumi?')">
        <h3>Azumi da Ibada</h3>
        <p>Tambayoyi game da Ramadan, azumi, sallah, addu’a, da ladubba.</p>
      </div>
    </section>

    <section class="chatBox">
      <div class="chatHead">AI Mataimaki</div>
      <div class="messages" id="messages">
        <div class="msg bot">Assalamu alaikum. Ni ne Musulmi Hausa AI. Rubuta tambayarka a ƙasa, zan amsa da Hausa mai sauƙi.</div>
      </div>

      <div class="quick">
        <div class="chip" onclick="fillPrompt('Menene sadaka a Musulunci?')">Menene sadaka?</div>
        <div class="chip" onclick="fillPrompt('Mene ne amfanin azumi?')">Amfanin azumi</div>
        <div class="chip" onclick="fillPrompt('Yaya ake yin alwala?')">Yadda ake alwala</div>
        <div class="chip" onclick="fillPrompt('Menene ma’anar zakka?')">Ma’anar zakka</div>
      </div>

      <div class="status" id="status">A shirye.</div>

      <div class="composer">
        <textarea id="message" placeholder="Rubuta tambayarka a nan..."></textarea>
        <button id="sendBtn" onclick="sendMessage()">Aika</button>
      </div>
    </section>
  </div>

  <script>
    const messagesEl = document.getElementById('messages');
    const statusEl = document.getElementById('status');
    const inputEl = document.getElementById('message');
    const sendBtn = document.getElementById('sendBtn');

    function fillPrompt(text) {
      inputEl.value = text;
      inputEl.focus();
    }

    function addMessage(text, who) {
      const div = document.createElement('div');
      div.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
      div.textContent = text;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function sendMessage() {
      const message = inputEl.value.trim();
      if (!message) return;

      addMessage(message, 'user');
      inputEl.value = '';
      sendBtn.disabled = true;
      statusEl.textContent = 'Ana jiran amsa...';

      try {
        const res = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });

        const data = await res.json();
        const reply = (data.reply || 'Ba a samu amsa ba.').replace(/\\\\n/g, '\\n');
        addMessage(reply, 'bot');
        statusEl.textContent = 'Amsa ta iso.';
      } catch (err) {
        addMessage('An samu matsala wajen haɗawa da AI. Ka sake gwadawa.', 'bot');
        statusEl.textContent = 'An samu matsala.';
      } finally {
        sendBtn.disabled = false;
      }
    }

    inputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  </script>
</body>
</html>`);
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = String(req.body?.message || '').trim();

    if (!userMessage) {
      return res.status(400).json({
        reply: 'Ba a aiko da tambaya ba.'
      });
    }

    const apiKey = String(process.env.OPENAI_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({
        reply: 'OPENAI_API_KEY bai samu ba a server.'
      });
    }

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      instructions: 'Kai mataimaki ne na Musulmi Hausa app. Ka fara da sallama idan ya dace. Ka rika amsa da Hausa mai sauƙi, girmamawa, da fahimta. Idan tambayar ta shafi addini, ka yi taka-tsantsan, kada ka kirkiri hujjoji ko ayoyi. Idan ba ka da tabbaci, ka faɗa a hankali cewa a duba ingantattun malamai ko majiyoyi.',
      input: userMessage
    });

    const reply =
      String(response.output_text || '').trim() ||
      'Na kasa samar da amsa a yanzu. Ka sake gwadawa.';

    return res.json({ reply });
  } catch (error) {
    console.error('OpenAI error full:', error);

    return res.status(error?.status || 500).json({
      reply: 'Matsala daga AI server: ' + (error?.message || 'Unknown error')
    });
  }
});

app.listen(PORT, () => {
  console.log('AI server running on port ' + PORT);
});

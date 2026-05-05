require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve AdSense config safely to frontend
app.get('/api/config', (req, res) => {
  res.json({
    adsenseClient: process.env.ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX',
    adsenseSlot: process.env.ADSENSE_SLOT_ID || 'XXXXXXXXXX'
  });
});

// ── PERMANENT SOLUTION: model fallback list ──
// If one model is decommissioned, it auto-tries the next one
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',   // primary (best quality)
  'llama-3.1-8b-instant',      // fallback 1 (faster, lighter)
  'llama3-groq-70b-8192-tool-use-preview', // fallback 2
];

async function callGroq(apiKey, prompt) {
  let lastError = null;

  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a YouTube SEO expert. Always respond with valid JSON only. No markdown, no explanation, no extra text — just the raw JSON object.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1200,
          temperature: 0.7
        })
      });

      const data = await response.json();

      // If model is decommissioned or unavailable, try next
      if (!response.ok) {
        const msg = data.error?.message || '';
        if (msg.includes('decommissioned') || msg.includes('not found') || msg.includes('deprecated')) {
          console.warn(`Model ${model} unavailable, trying next...`);
          lastError = msg;
          continue;
        }
        throw new Error(msg || `Groq API error ${response.status}`);
      }

      const text = data.choices?.[0]?.message?.content || '';
      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);

    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message);
      lastError = err.message;

      // If it's a JSON parse error, still try next model
      if (err instanceof SyntaxError) continue;

      // If it's a network or auth error, don't bother trying more
      if (err.message.includes('401') || err.message.includes('network')) {
        throw err;
      }
      continue;
    }
  }

  throw new Error(lastError || 'All models failed. Please try again later.');
}

// Main analyze endpoint
app.post('/api/analyze', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return res.status(500).json({ error: 'Groq API key not set. Get your free key from https://console.groq.com' });
  }

  try {
    const result = await callGroq(apiKey, prompt);
    res.json(result);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ TubeRank running at http://localhost:${PORT}`);
  console.log(`   Models: ${GROQ_MODELS.join(' → ')}\n`);
});

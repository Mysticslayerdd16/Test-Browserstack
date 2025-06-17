require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const geocodeCache = {}; // { city: { data, timestamp } }
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

app.post('/api/chat', async (req, res) => {
  console.log('Received POST /api/chat');
  const { thread_id, message, assistant_id } = req.body;

  try {
    let threadId = thread_id;
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    const stream = await openai.beta.threads.runs.stream(threadId, {
      assistant_id,
      stream: true,
    });

    stream.on('textDelta', (delta) => {
      res.write(delta.value);
    });

    stream.on('end', () => {
      res.end();
    });

    stream.on('error', (err) => {
      res.write(`[ERROR]: ${err.message}`);
      res.end();
    });
  } catch (err) {
    console.error('Error in /api/chat:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/geocode', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  const cached = geocodeCache[city];
  const now = Date.now();
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return res.json(cached.data);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'Test-Browserstack/1.0 (test@example.com)',
      },
    });
    if (!response.ok) {
      console.error('Nominatim error:', response.status, await response.text());
      return res.status(502).json({ error: 'Failed to fetch from Nominatim' });
    }
    const data = await response.json();

    // Store in cache with timestamp
    geocodeCache[city] = { data, timestamp: now };

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
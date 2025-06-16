require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
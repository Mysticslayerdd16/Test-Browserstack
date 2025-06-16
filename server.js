const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  console.log('Test endpoint hit');
  res.setHeader('Content-Type', 'text/plain');
  res.write('Hello from backend!\n');
  res.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));